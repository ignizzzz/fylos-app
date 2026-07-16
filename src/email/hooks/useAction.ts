import { useCallback, useRef, useState } from 'react'

export interface ActionState<TArgs extends unknown[], TResult> {
  run: (...args: TArgs) => Promise<TResult | undefined>
  pending: boolean
  error: Error | null
  /** Result of the last successful run, or null. */
  result: TResult | null
  reset: () => void
}

/**
 * Wrap a one-shot async mutation (confirm, unsubscribe, save draft, send...)
 * with pending/error/result tracking. Never updates after unmount.
 */
export function useAction<TArgs extends unknown[], TResult>(
  action: (...args: TArgs) => Promise<TResult>,
): ActionState<TArgs, TResult> {
  const [pending, setPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [result, setResult] = useState<TResult | null>(null)
  const mounted = useRef(true)
  const actionRef = useRef(action)
  actionRef.current = action

  const run = useCallback(async (...args: TArgs): Promise<TResult | undefined> => {
    setPending(true)
    setError(null)
    try {
      const value = await actionRef.current(...args)
      if (mounted.current) {
        setResult(value)
        setPending(false)
      }
      return value
    } catch (err: unknown) {
      if (mounted.current) {
        setError(err instanceof Error ? err : new Error(String(err)))
        setPending(false)
      }
      return undefined
    }
  }, [])

  const reset = useCallback(() => {
    setError(null)
    setResult(null)
    setPending(false)
  }, [])

  return { run, pending, error, result, reset }
}
