// The single, centralized, typed entry point every form submits through.
//
// Today it delegates to the mock transport. To go live you would swap the
// `mockSubmit` call for a real `fetch(endpointFor(formId), ...)` and map the
// HTTP response onto the same SubmitResult union. Nothing else in the system
// (hook, components, schemas, tests) would change: that is the point of
// routing everything through one typed service instead of hardcoding success
// at each call site.

import { captureSubmissionMeta, type MetaSources } from './meta'
import { mockSubmit } from './mockClient'
import type { FormId, FormValues, SubmissionMeta, SubmissionPayload, SubmitResult } from './types'

export interface SubmitFormOptions {
  /** Pre-built metadata (tests inject this for determinism). */
  meta?: SubmissionMeta
  /** Sources for capturing metadata when `meta` is not supplied. */
  metaSources?: MetaSources
  /** Abort an in-flight submission (e.g. component unmount). */
  signal?: AbortSignal
}

function buildPayload(
  formId: FormId,
  values: FormValues,
  options: SubmitFormOptions,
): SubmissionPayload {
  const meta = options.meta ?? captureSubmissionMeta(options.metaSources)
  return { formId, values, meta }
}

const NETWORK_FAILURE: SubmitResult = {
  ok: false,
  kind: 'network',
  message: 'We could not reach the network. Check your connection and try again.',
  retryable: true,
}

/**
 * Submit a form. Never throws for expected outcomes: every result (including
 * validation, server and network failures) comes back as a typed SubmitResult.
 * The only thing it rethrows is an AbortError, so callers can ignore cancelled
 * submissions.
 */
export async function submitForm(
  formId: FormId,
  values: FormValues,
  options: SubmitFormOptions = {},
): Promise<SubmitResult> {
  const payload = buildPayload(formId, values, options)
  try {
    return await mockSubmit(payload, { signal: options.signal })
  } catch (error) {
    if (error instanceof DOMException && error.name === 'AbortError') {
      throw error
    }
    return NETWORK_FAILURE
  }
}

/** Object form of the service, handy for dependency injection in call sites. */
export const formService = {
  submit: submitForm,
}

export type FormService = typeof formService
