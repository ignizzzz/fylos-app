// Turns reference tables (team, sources, tags, pipeline) into select options
// for filters and forms.

import { useMemo } from 'react';
import { useReference } from '../../context/ReferenceContext';
import type { FilterOption } from '../../components/data';

export function useRefOptions() {
  const { team, sources, tags, pipeline } = useReference();
  return useMemo(() => ({
    owners: team.map((m): FilterOption => ({ value: m.id, label: m.name })),
    sources: sources.map((s): FilterOption => ({ value: s.id, label: s.name })),
    tags: tags.map((t): FilterOption => ({ value: t.id, label: t.label })),
    stages: pipeline.map((s): FilterOption => ({ value: s.id, label: s.label })),
  }), [team, sources, tags, pipeline]);
}
