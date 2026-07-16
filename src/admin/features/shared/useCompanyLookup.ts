// Loads companies once (via the service) into a lookup for label resolution on
// pages that reference companies. Kept out of ReferenceContext because a real
// company table can be large; this stays page-local.

import { useEffect, useMemo, useState } from 'react';
import { useServices } from '../../context/ServicesContext';
import type { Company, ID } from '../../types';
import type { FilterOption } from '../../components/data';

export function useCompanyLookup() {
  const svc = useServices();
  const [companies, setCompanies] = useState<Company[]>([]);

  useEffect(() => {
    let alive = true;
    svc.companies.list({ page: 1, pageSize: 1000, sort: { field: 'name', dir: 'asc' } })
      .then((r) => { if (alive) setCompanies(r.items); })
      .catch(() => { /* leave empty on failure */ });
    return () => { alive = false; };
  }, [svc]);

  return useMemo(() => {
    const map = new Map(companies.map((c) => [c.id, c]));
    return {
      companies,
      companyById: (id?: ID | null) => (id ? map.get(id) : undefined),
      companyName: (id?: ID | null) => (id && map.get(id)?.name) || 'Not set',
      options: companies.map((c): FilterOption => ({ value: c.id, label: c.name })),
    };
  }, [companies]);
}
