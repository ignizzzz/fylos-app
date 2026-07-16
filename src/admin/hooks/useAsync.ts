// Generic async-state hook for one-shot loads (dashboard, attribution report,
// a single record). Tracks loading/success/error, ignores stale responses, and
// refetches when the demo-state injector fires.

import { useCallback, useEffect, useRef, useState } from 'react';
import { demoState } from '../services';
import { toAdminError } from '../types';
import type { AsyncState } from '../types';

export interface UseAsyncResult<T> {
  state: AsyncState<T>;
  refetch: () => void;
}

export function useAsync<T>(
  factory: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): UseAsyncResult<T> {
  const [state, setState] = useState<AsyncState<T>>({ status: 'loading' });
  const [nonce, setNonce] = useState(0);
  const [demoNonce, setDemoNonce] = useState(0);
  const requestId = useRef(0);

  useEffect(() => demoState.subscribe(() => setDemoNonce((n) => n + 1)), []);

  useEffect(() => {
    const id = ++requestId.current;
    let alive = true;
    setState({ status: 'loading' });
    factory()
      .then((data) => {
        if (!alive || id !== requestId.current) return;
        setState({ status: 'success', data });
      })
      .catch((err) => {
        if (!alive || id !== requestId.current) return;
        setState({ status: 'error', error: toAdminError(err) });
      });
    return () => {
      alive = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...deps, nonce, demoNonce]);

  const refetch = useCallback(() => setNonce((n) => n + 1), []);
  return { state, refetch };
}
