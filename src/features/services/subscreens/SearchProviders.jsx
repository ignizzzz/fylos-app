import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Search, X, Clock } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import ProviderCard from '../components/shared/ProviderCard';
import EmptyServicesState from '../components/shared/EmptyState';
import { SERVICES_PROVIDERS, SERVICE_CATEGORIES } from '../../../data/services';

const RECENT_DEFAULTS = ['walker near Seefeld', 'cat sitter', 'mobile groomer', 'vet telehealth'];

export default function SearchProviders({ data, onClose, onOpenProvider, onOpenCategory }) {
  const [q, setQ] = useState('');
  const [recent, setRecent] = useState(RECENT_DEFAULTS);
  const inputRef = useRef(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 320);
    return () => clearTimeout(t);
  }, []);

  const results = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return [];
    return SERVICES_PROVIDERS.filter((p) => {
      const hay = [
        p.name,
        p.displayName,
        p.type,
        p.location,
        ...(p.serviceTags || []),
        ...(p.languages || []),
      ]
        .join(' ')
        .toLowerCase();
      return hay.includes(term);
    });
  }, [q]);

  const submitRecent = (term) => setQ(term);

  return (
    <SubScreenContainer title="Search" onClose={onClose}>
      <div className="px-5">
        {/* Input */}
        <div className="flex items-center gap-2 px-4 h-[48px] rounded-[16px] bg-white border border-black/[0.05] mb-5 focus-within:border-[#E85D2A]/40 transition-colors">
          <Search size={16} className="text-[#A09A94]" strokeWidth={2.2} />
          <input
            ref={inputRef}
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Walkers, sitters, vets, places…"
            className="flex-1 bg-transparent text-[14px] text-[#111111] placeholder:text-[#A09A94] outline-none"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="w-7 h-7 rounded-full bg-[#F2F2F7] flex items-center justify-center active:opacity-70"
            >
              <X size={13} className="text-[#6E6E73]" strokeWidth={2.4} />
            </button>
          )}
        </div>

        {!q.trim() ? (
          <>
            {/* Recent */}
            <div className="mb-6">
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">
                Recent
              </h3>
              <div className="flex flex-wrap gap-2">
                {recent.map((t) => (
                  <button
                    key={t}
                    onClick={() => submitRecent(t)}
                    className="h-[32px] px-3 rounded-full bg-white border border-black/[0.05] flex items-center gap-1.5 text-[12px] text-[#111111] active:scale-[0.97]"
                  >
                    <Clock size={11} className="text-[#A09A94]" strokeWidth={2.2} />
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* Browse by category */}
            <div>
              <h3 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">
                Browse
              </h3>
              <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
                {SERVICE_CATEGORIES.filter((c) => c.active).map((c) => (
                  <button
                    key={c.id}
                    onClick={() => onOpenCategory && onOpenCategory(c)}
                    className="w-full flex items-center justify-between px-4 py-3.5 text-left active:opacity-70"
                  >
                    <span className="text-[14px] font-semibold text-[#111111]">{c.label}</span>
                    <span className="text-[12px] text-[#A09A94]">{c.providersCount} providers</span>
                  </button>
                ))}
              </div>
            </div>
          </>
        ) : results.length === 0 ? (
          <EmptyServicesState
            icon={Search}
            title="No matches"
            subtext={`We couldn't find anyone matching "${q}". Try a broader term.`}
          />
        ) : (
          <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
            {results.map((p, i) => (
              <ProviderCard
                key={p.id}
                provider={p}
                layout="list"
                saved={data?.isSaved(p.id)}
                onTap={onOpenProvider}
                onToggleSave={(prov) => data?.toggleSaveProvider(prov.id)}
                className={i < results.length - 1 ? 'border-b border-black/[0.04]' : ''}
              />
            ))}
          </div>
        )}
      </div>
    </SubScreenContainer>
  );
}
