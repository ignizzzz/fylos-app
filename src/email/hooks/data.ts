// Typed data hooks. Each includes the active scenario + latency in its deps so
// flipping the scenario control re-fetches everything through the mock service.
import type {
  Audience,
  Campaign,
  DeliverySummary,
  Page,
  Subscriber,
  SubscriberQuery,
  SuppressionEntry,
  TokenResolution,
} from '../core/types'
import {
  getCampaign,
  listAudiences,
  listCampaigns,
  listSubscribers,
  listSuppression,
  resolveToken,
} from '../core/service'
import { useScenario } from '../state/ScenarioContext'
import { useAsync } from './useAsync'
import type { AsyncState } from './useAsync'

export function useToken(token: string): AsyncState<TokenResolution> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(() => resolveToken(token), [token, scenario, latencyMs])
}

export function useCampaigns(): AsyncState<Campaign[]> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(() => listCampaigns(), [scenario, latencyMs])
}

export function useCampaign(id: string): AsyncState<Campaign> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(() => getCampaign(id), [id, scenario, latencyMs])
}

export function useAudiences(): AsyncState<Audience[]> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(() => listAudiences(), [scenario, latencyMs])
}

export function useSubscribers(query: SubscriberQuery): AsyncState<Page<Subscriber>> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(
    () => listSubscribers(query),
    [query.page, query.pageSize, query.status, query.search, scenario, latencyMs],
  )
}

export function useSuppression(): AsyncState<SuppressionEntry[]> {
  const { scenario, latencyMs } = useScenario()
  return useAsync(() => listSuppression(), [scenario, latencyMs])
}

export type { DeliverySummary }
