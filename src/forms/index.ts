// Public API of the Fylos form system. Consumers (site pages, the demo) import
// from here. Everything below the surface stays swappable.

export { Form, type FormProps } from './components/Form'
export { FormField, type FormFieldProps } from './components/FormField'
export { StatusBanner, type StatusBannerProps } from './components/StatusBanner'
export { SuccessPanel, type SuccessPanelProps } from './components/SuccessPanel'
export { SubmitButton, type SubmitButtonProps } from './components/SubmitButton'

export { useFormSubmit } from './hooks/useFormSubmit'
export type { UseFormSubmit, UseFormSubmitOptions, SubmitPhase } from './hooks/useFormSubmit'

export { submitForm, formService } from './core/service'
export type { SubmitFormOptions, FormService } from './core/service'
export { captureSubmissionMeta, recordFirstTouch } from './core/meta'
export type { MetaSources } from './core/meta'
export { validateForm, validateField, isFieldVisible, isBlank, hasErrors } from './core/validation'
export {
  getMockConfig,
  setMockConfig,
  resetMockConfig,
  isMockScenario,
  type MockConfig,
} from './core/mockConfig'

export { FORMS, ALL_FORMS, getFormSchema } from './schemas'

export type {
  FormId,
  FormSchema,
  FieldSpec,
  FieldType,
  FieldValue,
  FormValues,
  FieldErrors,
  SelectOption,
  SubmissionMeta,
  SubmissionPayload,
  SubmitResult,
  SubmitSuccess,
  SubmitFailure,
  ValidationFailure,
  ServerFailure,
  NetworkFailure,
  DuplicateFailure,
  SubmitErrorKind,
  MockScenario,
  UtmParams,
  ClickIds,
} from './core/types'
