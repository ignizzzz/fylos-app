// Loads a single record by id through a ResourceService, with the same async
// state machine the lists use.

import { useAsync } from './useAsync';
import type { ResourceService } from '../services';
import type { AsyncState, ID } from '../types';

export function useRecord<T>(
  service: ResourceService<T>,
  id: ID | null | undefined,
): { state: AsyncState<T | null>; refetch: () => void } {
  return useAsync<T | null>(
    () => (id ? service.get(id) : Promise.resolve(null)),
    [service, id],
  );
}
