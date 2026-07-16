// Loads the small reference tables (team, tags, sources, pipeline) once via
// the services, then exposes synchronous lookups so table cells can resolve an
// ownerId -> name, tagIds -> chips, etc. without an async call per cell.
// Components never import MOCK_DB; they read reference data from here.

import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { ReactNode } from 'react';
import { useServices } from './ServicesContext';
import type { Tag, LeadSource, TeamMember, PipelineStage, ID } from '../types';

interface ReferenceValue {
  ready: boolean;
  team: TeamMember[];
  tags: Tag[];
  sources: LeadSource[];
  pipeline: PipelineStage[];
  memberById: (id: ID | null | undefined) => TeamMember | undefined;
  memberName: (id: ID | null | undefined) => string;
  sourceById: (id: ID | null | undefined) => LeadSource | undefined;
  sourceName: (id: ID | null | undefined) => string;
  tagById: (id: ID) => Tag | undefined;
  tagsByIds: (ids: ID[]) => Tag[];
  stageById: (id: string) => PipelineStage | undefined;
  refresh: () => void;
}

const ReferenceContext = createContext<ReferenceValue | null>(null);

const BIG_PAGE = { page: 1, pageSize: 1000 };

export function ReferenceProvider({ children }: { children: ReactNode }) {
  const svc = useServices();
  const [ready, setReady] = useState(false);
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [tags, setTags] = useState<Tag[]>([]);
  const [sources, setSources] = useState<LeadSource[]>([]);
  const [nonce, setNonce] = useState(0);

  useEffect(() => {
    let alive = true;
    Promise.all([
      svc.team.list(BIG_PAGE),
      svc.tags.list(BIG_PAGE),
      svc.sources.list(BIG_PAGE),
    ])
      .then(([t, g, s]) => {
        if (!alive) return;
        setTeam(t.items);
        setTags(g.items);
        setSources(s.items);
        setReady(true);
      })
      .catch(() => {
        // Reference load failing should not hard-crash the shell.
        if (alive) setReady(true);
      });
    return () => {
      alive = false;
    };
  }, [svc, nonce]);

  const value = useMemo<ReferenceValue>(() => {
    const teamMap = new Map(team.map((m) => [m.id, m]));
    const sourceMap = new Map(sources.map((s) => [s.id, s]));
    const tagMap = new Map(tags.map((t) => [t.id, t]));
    const stageMap = new Map(svc.pipeline.map((s) => [s.id, s]));
    return {
      ready,
      team,
      tags,
      sources,
      pipeline: svc.pipeline,
      memberById: (id) => (id ? teamMap.get(id) : undefined),
      memberName: (id) => (id ? teamMap.get(id)?.name ?? 'Unassigned' : 'Unassigned'),
      sourceById: (id) => (id ? sourceMap.get(id) : undefined),
      sourceName: (id) => (id ? sourceMap.get(id)?.name ?? 'Unknown' : 'Unknown'),
      tagById: (id) => tagMap.get(id),
      tagsByIds: (ids) => ids.map((id) => tagMap.get(id)).filter((t): t is Tag => Boolean(t)),
      stageById: (id) => stageMap.get(id as PipelineStage['id']),
      refresh: () => setNonce((n) => n + 1),
    };
  }, [ready, team, tags, sources, svc.pipeline]);

  return <ReferenceContext.Provider value={value}>{children}</ReferenceContext.Provider>;
}

export function useReference(): ReferenceValue {
  const ctx = useContext(ReferenceContext);
  if (!ctx) throw new Error('useReference must be used within a ReferenceProvider');
  return ctx;
}
