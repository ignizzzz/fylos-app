// The submit state machine. Everything the task asks a form to handle lives
// here as explicit, testable state:
//   idle -> (client validation) -> submitting (loading)
//     -> success
//     -> error{ validation | server | network | duplicate }
//     -> retry (server/network) -> submitting ...
// Double submission is blocked while submitting. Editing a field clears its
// error and, for transient failures, dismisses the banner.

import { useCallback, useEffect, useReducer, useRef } from 'react'
import { hasErrors, isFieldVisible, validateForm } from '../core/validation'
import { submitForm, type SubmitFormOptions } from '../core/service'
import type {
  FieldErrors,
  FieldValue,
  FormSchema,
  FormValues,
  SubmitErrorKind,
  SubmitResult,
  SubmitSuccess,
} from '../core/types'

export type SubmitPhase = 'idle' | 'submitting' | 'success' | 'error'

interface State {
  phase: SubmitPhase
  values: FormValues
  fieldErrors: FieldErrors
  errorKind?: SubmitErrorKind
  errorMessage?: string
  success?: SubmitSuccess
  /** Count of network submissions attempted (retries included). */
  attempts: number
  /** Bumped whenever we want the UI to move focus to the first invalid field. */
  focusKey: number
}

type Action =
  | { type: 'SET_VALUE'; name: string; value: FieldValue }
  | { type: 'SET_VALUES'; values: FormValues }
  | { type: 'CLIENT_INVALID'; fieldErrors: FieldErrors }
  | { type: 'SUBMIT_START' }
  | { type: 'SUBMIT_SUCCESS'; success: SubmitSuccess }
  | { type: 'SUBMIT_FAILURE'; result: Extract<SubmitResult, { ok: false }> }
  | { type: 'RESET'; values: FormValues }

function initialValuesFor(schema: FormSchema, seed?: FormValues): FormValues {
  const values: FormValues = {}
  for (const field of schema.fields) {
    values[field.name] = field.type === 'checkbox' ? false : ''
  }
  return { ...values, ...seed }
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_VALUE': {
      const nextValues: FormValues = { ...state.values, [action.name]: action.value }
      const nextFieldErrors: FieldErrors = { ...state.fieldErrors }
      delete nextFieldErrors[action.name]

      // Clear a transient banner as soon as the user acts again.
      const wasTransient =
        state.phase === 'error' &&
        (state.errorKind === 'server' ||
          state.errorKind === 'network' ||
          state.errorKind === 'duplicate')

      const stillHasFieldErrors = hasErrors(nextFieldErrors)
      const nextPhase: SubmitPhase =
        state.phase === 'error' && (wasTransient || !stillHasFieldErrors) ? 'idle' : state.phase

      return {
        ...state,
        values: nextValues,
        fieldErrors: nextFieldErrors,
        phase: nextPhase,
        errorKind: nextPhase === 'idle' ? undefined : state.errorKind,
        errorMessage: nextPhase === 'idle' ? undefined : state.errorMessage,
      }
    }
    case 'SET_VALUES':
      return { ...state, values: { ...state.values, ...action.values } }
    case 'CLIENT_INVALID':
      return {
        ...state,
        phase: 'error',
        errorKind: 'validation',
        errorMessage: 'Please review the highlighted fields.',
        fieldErrors: action.fieldErrors,
        focusKey: state.focusKey + 1,
      }
    case 'SUBMIT_START':
      return {
        ...state,
        phase: 'submitting',
        errorKind: undefined,
        errorMessage: undefined,
        attempts: state.attempts + 1,
      }
    case 'SUBMIT_SUCCESS':
      return {
        ...state,
        phase: 'success',
        success: action.success,
        errorKind: undefined,
        errorMessage: undefined,
        fieldErrors: {},
      }
    case 'SUBMIT_FAILURE': {
      const { result } = action
      const isValidation = result.kind === 'validation'
      return {
        ...state,
        phase: 'error',
        errorKind: result.kind,
        errorMessage: result.message,
        // Narrowed by the discriminated union: fieldErrors only exists on a
        // validation failure.
        fieldErrors:
          result.kind === 'validation' && result.fieldErrors
            ? result.fieldErrors
            : state.fieldErrors,
        focusKey: isValidation ? state.focusKey + 1 : state.focusKey,
      }
    }
    case 'RESET':
      return {
        phase: 'idle',
        values: action.values,
        fieldErrors: {},
        attempts: 0,
        focusKey: 0,
      }
    default:
      return state
  }
}

export interface UseFormSubmitOptions {
  initialValues?: FormValues
  onSuccess?: (success: SubmitSuccess, values: FormValues) => void
  /** Sources for UTM/referrer capture; injected in tests. */
  metaSources?: SubmitFormOptions['metaSources']
  /**
   * Transport seam for tests/embeds. This is intentionally a different shape
   * from `formService.submit(formId, values, opts)`: the hook already holds the
   * schema and manages the AbortController, so an override receives the schema,
   * the (already validated and pruned) values, and the signal.
   */
  submit?: (schema: FormSchema, values: FormValues, signal: AbortSignal) => Promise<SubmitResult>
}

export interface UseFormSubmit {
  values: FormValues
  fieldErrors: FieldErrors
  phase: SubmitPhase
  errorKind?: SubmitErrorKind
  errorMessage?: string
  success?: SubmitSuccess
  attempts: number
  focusKey: number
  isIdle: boolean
  isSubmitting: boolean
  isSuccess: boolean
  isError: boolean
  /** True when the current error can be resolved by re-sending as-is. */
  canRetry: boolean
  setValue: (name: string, value: FieldValue) => void
  setValues: (values: FormValues) => void
  submit: () => void
  retry: () => void
  reset: () => void
  /** Names of currently invalid, visible fields, in schema order. */
  invalidFieldNames: () => string[]
}

export function useFormSubmit(
  schema: FormSchema,
  options: UseFormSubmitOptions = {},
): UseFormSubmit {
  const [state, dispatch] = useReducer(reducer, undefined, () => ({
    phase: 'idle' as SubmitPhase,
    values: initialValuesFor(schema, options.initialValues),
    fieldErrors: {},
    attempts: 0,
    focusKey: 0,
  }))

  const inFlight = useRef(false)
  const abortRef = useRef<AbortController | null>(null)
  const mounted = useRef(true)
  // Keep the latest values readable inside async callbacks without stale closbacks.
  const valuesRef = useRef(state.values)
  valuesRef.current = state.values

  useEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
      abortRef.current?.abort()
    }
  }, [])

  const runSubmit = useCallback(async () => {
    // Guard against double submission (both the phase and a synchronous ref).
    if (inFlight.current) return
    const currentValues = valuesRef.current

    const errors = validateForm(schema, currentValues)
    if (hasErrors(errors)) {
      dispatch({ type: 'CLIENT_INVALID', fieldErrors: errors })
      return
    }

    // Only submit fields that are actually visible: a conditional (revealWhen)
    // field that was filled then hidden must not send its stale value.
    const submittedValues: FormValues = {}
    for (const field of schema.fields) {
      if (isFieldVisible(field, currentValues)) {
        submittedValues[field.name] = currentValues[field.name] ?? (field.type === 'checkbox' ? false : '')
      }
    }

    inFlight.current = true
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    dispatch({ type: 'SUBMIT_START' })

    try {
      const result = options.submit
        ? await options.submit(schema, submittedValues, controller.signal)
        : await submitForm(schema.id, submittedValues, {
            metaSources: options.metaSources,
            signal: controller.signal,
          })

      if (!mounted.current || controller.signal.aborted) return

      if (result.ok) {
        dispatch({ type: 'SUBMIT_SUCCESS', success: result })
        options.onSuccess?.(result, submittedValues)
      } else {
        dispatch({ type: 'SUBMIT_FAILURE', result })
      }
    } catch (error) {
      // AbortError is expected on unmount/replacement; ignore it.
      if (error instanceof DOMException && error.name === 'AbortError') return
      if (!mounted.current) return
      dispatch({
        type: 'SUBMIT_FAILURE',
        result: {
          ok: false,
          kind: 'network',
          message: 'We could not reach the network. Check your connection and try again.',
          retryable: true,
        },
      })
    } finally {
      inFlight.current = false
    }
  }, [schema, options])

  const setValue = useCallback((name: string, value: FieldValue) => {
    dispatch({ type: 'SET_VALUE', name, value })
  }, [])

  const setValues = useCallback((values: FormValues) => {
    dispatch({ type: 'SET_VALUES', values })
  }, [])

  const submit = useCallback(() => {
    void runSubmit()
  }, [runSubmit])

  const retry = useCallback(() => {
    void runSubmit()
  }, [runSubmit])

  const reset = useCallback(() => {
    dispatch({ type: 'RESET', values: initialValuesFor(schema, options.initialValues) })
  }, [schema, options.initialValues])

  const invalidFieldNames = useCallback((): string[] => {
    return schema.fields
      .filter((field) => isFieldVisible(field, state.values) && state.fieldErrors[field.name])
      .map((field) => field.name)
  }, [schema, state.values, state.fieldErrors])

  const canRetry =
    state.phase === 'error' && (state.errorKind === 'server' || state.errorKind === 'network')

  return {
    values: state.values,
    fieldErrors: state.fieldErrors,
    phase: state.phase,
    errorKind: state.errorKind,
    errorMessage: state.errorMessage,
    success: state.success,
    attempts: state.attempts,
    focusKey: state.focusKey,
    isIdle: state.phase === 'idle',
    isSubmitting: state.phase === 'submitting',
    isSuccess: state.phase === 'success',
    isError: state.phase === 'error',
    canRetry,
    setValue,
    setValues,
    submit,
    retry,
    reset,
    invalidFieldNames,
  }
}
