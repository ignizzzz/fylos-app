import React, { useMemo, useState } from 'react';
import { Filter, ListFilter, Map as MapIcon } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import ProviderCard from '../components/shared/ProviderCard';
import EmptyServicesState from '../components/shared/EmptyState';
import { findProvidersByCategory, SERVICE_CATEGORY_BY_ID, SERVICE_SORTS } from '../../../data/services';
import { resolveIcon } from '../components/shared/icons';

// CategoryDetail — slide-in. Filtered + sorted provider list per category.

export default function CategoryDetail({
  categoryId,
  data,
  onClose,
  onOpenProvider,
  onOpenMap,
}) {
  const cat = SERVICE_CATEGORY_BY_ID[categoryId];
  const Icon = resolveIcon(cat?.icon);
  const [sort, setSort] = useState('recommended');
  const [available, setAvailable] = useState(false);

  const providers = useMemo(() => {
    let list = findProvidersByCategory(categoryId);
    if (available) list = list.filter((p) => p.availabilityState === 'available');
    list = [...list].sort((a, b) => {
      switch (sort) {
        case 'price_asc':  return a.priceFrom - b.priceFrom;
        case 'price_desc': return b.priceFrom - a.priceFrom;
        case 'rating':     return b.rating - a.rating;
        case 'distance':   return a.distanceKm - b.distanceKm;
        case 'available':  return (a.availabilityState === 'available' ? -1 : 1);
        default:
          // recommended: rating × jobs heuristic
          return b.rating * 10 + b.jobsCompleted * 0.005 - (a.rating * 10 + a.jobsCompleted * 0.005);
      }
    });
    return list;
  }, [categoryId, sort, available]);

  return (
    <SubScreenContainer
      title={cat?.label || 'Category'}
      onClose={onClose}
      rightAction={onOpenMap ? { icon: MapIcon, onTap: onOpenMap, ariaLabel: 'Map' } : null}
    >
      <div className="px-5">
        {/* Hero row — coral icon + blurb */}
        {cat && (
          <div className="flex items-center gap-3 mb-5">
            <span className="w-[52px] h-[52px] rounded-[18px] bg-[#FFEDE3] flex items-center justify-center">
              <Icon size={22} className="text-[#E85D2A]" strokeWidth={2.2} />
            </span>
            <div className="min-w-0">
              <h2 className="text-[18px] font-semibold text-[#111111] tracking-tight">{cat.label}</h2>
              <p className="text-[12.5px] text-[#8E8E93]">
                {cat.blurb} · {cat.providersCount} providers
              </p>
            </div>
          </div>
        )}

        {/* Filter chips */}
        <div className="flex gap-2 -mx-5 px-5 mb-4 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          <button
            onClick={() => setAvailable((v) => !v)}
            className={`shrink-0 h-[34px] px-3.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${
              available ? 'bg-[#111111] text-white' : 'bg-white text-[#6E6E73] border border-black/[0.05]'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${available ? 'bg-white' : 'bg-[#34C759]'}`} />
            Available now
          </button>
          {SERVICE_SORTS.map((s) => {
            const active = sort === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSort(s.id)}
                className={`shrink-0 h-[34px] px-3.5 rounded-full text-[12px] font-semibold flex items-center gap-1.5 ${
                  active ? 'bg-[#111111] text-white' : 'bg-white text-[#6E6E73] border border-black/[0.05]'
                }`}
              >
                {active && <ListFilter size={11} strokeWidth={2.4} />}
                {s.label}
              </button>
            );
          })}
        </div>

        {providers.length === 0 ? (
          <EmptyServicesState
            icon={Filter}
            title="No matches"
            subtext="Try removing a filter or switching sort."
            actionLabel="Reset filters"
            onAction={() => { setAvailable(false); setSort('recommended'); }}
          />
        ) : (
          <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
            {providers.map((p, i) => (
              <ProviderCard
                key={p.id}
                provider={p}
                layout="list"
                saved={data?.isSaved(p.id)}
                onTap={onOpenProvider}
                onToggleSave={(prov) => data?.toggleSaveProvider(prov.id)}
                className={i < providers.length - 1 ? 'border-b border-black/[0.04]' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </SubScreenContainer>
  );
}
