import { useCallback, useEffect, useRef, useState } from 'react'

export type AsyncStatus = 'loading' | 'success' | 'error'

export interface AsyncState<T> {
  status: AsyncStatus
  data: T | null
  error: Error | null
  /** Re-run the async function (e.g. a Retry button). */
  reload: () => void
}

/**
 * Run an async producer and track loading / success / error. Re-runs whenever
 * `deps` change or reload() is called. Safe against unmount: a late resolve
 * (or the never-resolving "loading" scenario) never updates a dead component.
 */
export function useAsync<T>(producer: () => Promise<T>, deps: readonly unknown[]): AsyncState<T> {
  const [state, setState] = useState<{ status: AsyncStatus; data: T | null; error: Error | null }>({
    status: 'loading',
    data: null,
    error: null,
  })
  const [nonce, setNonce] = useState(0)
  const producerRef = useRef(producer)
  producerRef.current = producer

  useEffect(() => {
    let active = true
    setState((prev) => ({ status: 'loading', data: prev.data, error: null }))
    producerRef.current()
      .then((data) => {
        if (active) setState({ status: 'success', data, error: null })
      })
      .catch((error: unknown) => {
        if (active) {
          setState({
            status: 'error',
            data: null,
            error: error instanceof Error ? error : new Error(String(error)),
          })
        }
      })
    return () => {
      active = false
    }
    // deps are provided by the caller; nonce forces an explicit reload.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce])

  const reload = useCallback(() => setNonce((n) => n + 1), [])

  return { status: state.status, data: state.data, error: state.error, reload }
}
