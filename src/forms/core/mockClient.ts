// The mock transport. This stands in for a real HTTP client. It is the ONLY
// place that fabricates responses, and it does so from the centralized
// mockConfig, so we can drive every UI state deterministically.
//
// Behaviors:
//   success    -> resolves with a created record id (first time)
//   validation -> resolves with a server-side field-error result
//   server     -> resolves with a 5xx-style failure
//   network    -> THROWS (like a real fetch rejection); the service maps it
//   duplicate  -> resolves with a duplicate result
// Plus real duplicate detection: the same identity submitted twice in one
// session returns a duplicate result even under the success scenario.

import { getMockConfig } from './mockConfig'
import type { SubmissionPayload, SubmitResult } from './types'

/** Thrown to simulate a transport-level failure (DNS, offline, timeout). */
export class NetworkError extends Error {
  constructor(message = 'The network request failed.') {
    super(message)
    this.name = 'NetworkError'
  }
}

// In-memory record of identities we have already accepted this session.
const seenIdentities = new Set<string>()

// The most recent payload handed to the transport. Test seam only: lets a test
// assert that UTM/referrer metadata actually reaches the "backend".
let lastPayload: SubmissionPayload | null = null

/** The last payload submitted through the mock transport (test helper). */
export function __getLastPayload(): SubmissionPayload | null {
  return lastPayload
}

/** Clear the duplicate-detection memory and last payload. Tests use this between cases. */
export function __resetMockStore(): void {
  seenIdentities.clear()
  lastPayload = null
}

const EMAIL_FIELD_CANDIDATES = ['email', 'contact_email', 'work_email', 'press_email']

function identityFieldName(payload: SubmissionPayload): string | undefined {
  for (const name of EMAIL_FIELD_CANDIDATES) {
    const value = payload.values[name]
    if (typeof value === 'string' && value.trim().length > 0) return name
  }
  return undefined
}

function identityKey(payload: SubmissionPayload): string {
  const fieldName = identityFieldName(payload)
  const identity = fieldName ? String(payload.values[fieldName]).trim().toLowerCase() : ''
  return `${payload.formId}::${identity}`
}

// Small deterministic-ish id. Not security sensitive; purely a mock record id.
let counter = 0
function makeId(prefix: string): string {
  counter += 1
  return `${prefix}_${counter.toString(36).padStart(4, '0')}`
}

function wait(ms: number, signal?: AbortSignal): Promise<void> {
  if (ms <= 0) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      cleanup()
      resolve()
    }, ms)
    const onAbort = () => {
      clearTimeout(timer)
      cleanup()
      reject(new DOMException('Aborted', 'AbortError'))
    }
    const cleanup = () => signal?.removeEventListener('abort', onAbort)
    if (signal) {
      if (signal.aborted) {
        clearTimeout(timer)
        reject(new DOMException('Aborted', 'AbortError'))
        return
      }
      signal.addEventListener('abort', onAbort)
    }
  })
}

export interface MockSubmitOptions {
  signal?: AbortSignal
}

function duplicateResult(): SubmitResult {
  return {
    ok: false,
    kind: 'duplicate',
    id: makeId('dup'),
    message: 'You are already on the list with that address. No need to send it twice.',
    retryable: false,
  }
}

export async function mockSubmit(
  payload: SubmissionPayload,
  options: MockSubmitOptions = {},
): Promise<SubmitResult> {
  lastPayload = payload
  const config = getMockConfig()
  await wait(config.delayMs, options.signal)

  const key = identityKey(payload)

  switch (config.scenario) {
    case 'network':
      throw new NetworkError()

    case 'server':
      return {
        ok: false,
        kind: 'server',
        status: 503,
        message: 'Something went wrong on our end. Please try again in a moment.',
        retryable: true,
      }

    case 'validation': {
      const fieldName = identityFieldName(payload) ?? 'email'
      return {
        ok: false,
        kind: 'validation',
        message: 'Please check the highlighted field and try again.',
        fieldErrors: { [fieldName]: 'Our system could not accept this value.' },
        retryable: false,
      }
    }

    case 'duplicate':
      return duplicateResult()

    case 'success':
    default: {
      if (config.detectDuplicates && seenIdentities.has(key)) {
        return duplicateResult()
      }
      if (config.detectDuplicates) seenIdentities.add(key)
      return {
        ok: true,
        id: makeId(payload.formId),
        message: 'Received. We will be in touch.',
      }
    }
  }
}
