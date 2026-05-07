import React, { useMemo, useState } from 'react';
import { Star } from 'lucide-react';
import SubScreenContainer from '../components/shared/SubScreenContainer';
import EmptyServicesState from '../components/shared/EmptyState';
import { findReviewsForProvider } from '../../../data/services';

// ProviderReviews — full list with rating histogram + filters.

export default function ProviderReviews({ provider, onClose }) {
  const all = findReviewsForProvider(provider.id);
  const [filter, setFilter] = useState('all'); // 'all' | '5' | '4' | '3' | '2' | '1'

  const histogram = useMemo(() => {
    const h = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    all.forEach((r) => { h[r.rating] = (h[r.rating] || 0) + 1; });
    return h;
  }, [all]);

  const visible = filter === 'all' ? all : all.filter((r) => r.rating === Number(filter));
  const avg =
    all.length === 0 ? 0 : all.reduce((s, r) => s + r.rating, 0) / all.length;

  return (
    <SubScreenContainer title={`${provider.displayName} · Reviews`} onClose={onClose}>
      <div className="px-5">
        {/* Avg + histogram */}
        <section className="bg-white rounded-[18px] border border-black/[0.04] p-4 mb-5 flex items-center gap-4">
          <div className="text-center shrink-0">
            <span className="text-[36px] font-bold text-[#111111] leading-none block">{avg.toFixed(1)}</span>
            <div className="flex items-center justify-center gap-0.5 mt-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  size={11}
                  className={n <= Math.round(avg) ? 'text-[#E85D2A]' : 'text-[#E5E5E5]'}
                  fill={n <= Math.round(avg) ? '#E85D2A' : 'none'}
                />
              ))}
            </div>
            <span className="text-[10.5px] text-[#A09A94] block mt-1">{all.length} reviews</span>
          </div>
          <div className="flex-1 min-w-0 flex flex-col gap-1">
            {[5, 4, 3, 2, 1].map((n) => {
              const count = histogram[n] || 0;
              const pct = all.length === 0 ? 0 : (count / all.length) * 100;
              return (
                <div key={n} className="flex items-center gap-2">
                  <span className="text-[10px] text-[#8E8E93] w-3">{n}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[#F2F2F7] overflow-hidden">
                    <div
                      className="h-full rounded-full bg-[#E85D2A]"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <span className="text-[10px] text-[#8E8E93] w-5 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Filter chips */}
        <div className="flex gap-2 mb-3 -mx-5 px-5 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
          {[
            { id: 'all', label: 'All' },
            { id: '5', label: '5 ★' },
            { id: '4', label: '4 ★' },
            { id: '3', label: '3 ★' },
            { id: '2', label: '2 ★' },
            { id: '1', label: '1 ★' },
          ].map((f) => {
            const active = filter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 h-[32px] px-3.5 rounded-full text-[12px] font-semibold transition-colors ${
                  active ? 'bg-[#111111] text-white' : 'bg-white text-[#6E6E73] border border-black/[0.05]'
                }`}
              >
                {f.label}
              </button>
            );
          })}
        </div>

        {/* List */}
        {visible.length === 0 ? (
          <EmptyServicesState icon={Star} title="No reviews yet" subtext="No reviews match this filter." />
        ) : (
          <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
            {visible.map((r) => (
              <div key={r.id} className="px-4 py-3.5">
                <div className="flex items-center gap-2 mb-1.5">
                  {r.author?.photo ? (
                    <img src={r.author.photo} alt="" className="w-7 h-7 rounded-full object-cover" />
                  ) : (
                    <span className="w-7 h-7 rounded-full bg-[#FFEDE3] text-[#E85D2A] text-[11px] font-bold flex items-center justify-center">
                      {r.author?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <span className="text-[12.5px] font-semibold text-[#111111]">{r.author?.name}</span>
                    <div className="flex items-center gap-0.5 mt-0.5">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} size={9} className="fill-[#E85D2A] text-[#E85D2A]" />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-[#A09A94]">{r.date}</span>
                </div>
                <p className="text-[12.5px] text-[#3D3D44] leading-[1.55]">{r.text}</p>
                {r.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {r.tags.map((t) => (
                      <span
                        key={t}
                        className="h-[20px] px-2 rounded-full bg-[#F2F2F7] text-[10px] font-medium text-[#6E6E73] inline-flex items-center"
                      >
                        {t.replace(/-/g, ' ')}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </SubScreenContainer>
  );
}
