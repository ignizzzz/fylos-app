import React, { useMemo, useState, useRef, useEffect } from 'react';
import { Search, Compass, Stethoscope, Map, Sparkles, Lock, X, Clock, MapPin, Star } from 'lucide-react';
import { SERVICE_CATEGORIES, SERVICES_PROVIDERS } from '../../../data/services';
import { resolveIcon as resolveCatIcon } from '../components/shared/icons';
import ProviderCard from '../components/shared/ProviderCard';
import BookingRow from '../components/shared/BookingRow';
import SectionHeader from '../components/shared/SectionHeader';
import PetSelectorPill from '../components/shared/PetSelectorPill';

const RECENT_DEFAULTS = ['walker near Seefeld', 'cat sitter', 'mobile groomer', 'vet telehealth'];

// Discover — Zone S (Airbnb-airy). Browse providers by category, discover new
// people, surface recommendations, and shortcut into nearby/upcoming bookings.

export default function DiscoverMode({
  pets,
  selectedPetId,
  data,
  onOpenSearch,
  onOpenCategory,
  onOpenProvider,
  onOpenMap,
  onOpenVetTelehealth,
  onOpenBookingDetails,
  onSelectPet,
}) {
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const recommended = useMemo(() => data.recommendedFor(selectedPetId), [data, selectedPetId]);
  const topRated = data.topRatedNearYou;
  const newProviders = data.newProviders;
  const recentlyViewed = data.recentlyViewed;

  const upcomingForPet = data
    .bookingsByStatus('upcoming', selectedPetId)
    .slice(0, 1);

  // ── Inline search state — expands in place, no navigation ──
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState('');
  const inputRef = useRef(null);

  const enterSearch = () => {
    setIsSearching(true);
    setTimeout(() => inputRef.current?.focus(), 60);
  };
  const exitSearch = () => {
    setQuery('');
    setIsSearching(false);
  };

  const searchResults = useMemo(() => {
    const term = query.trim().toLowerCase();
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
  }, [query]);

  return (
    <div className="px-5 pb-8">
      {/* ── Search field — expands inline, no page navigation ───── */}
      <div className="flex items-center gap-2 mb-4">
        <div
          className="flex-1 flex items-center gap-2.5 h-[44px] px-4 rounded-[14px] transition-all"
          style={{
            backgroundColor: '#F4EEE5',
            border: isSearching
              ? '1px solid rgba(232,93,42,0.30)'
              : '1px solid rgba(0,0,0,0.04)',
          }}
          onClick={!isSearching ? enterSearch : undefined}
        >
          <Search size={15} className="text-[#A09A94] shrink-0" strokeWidth={2} />
          {isSearching ? (
            <>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Find walkers, sitters, vets…"
                className="flex-1 min-w-0 bg-transparent outline-none text-[13.5px] text-[#111111] placeholder:text-[#A09A94] tracking-[-0.005em]"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="w-6 h-6 rounded-full bg-white flex items-center justify-center shrink-0 active:opacity-70"
                  aria-label="Clear search"
                >
                  <X size={11} className="text-[#6E6E73]" strokeWidth={2.4} />
                </button>
              )}
            </>
          ) : (
            <span className="text-[13.5px] text-[#A09A94] tracking-[-0.005em]">
              Find walkers, sitters, vets…
            </span>
          )}
        </div>
        {isSearching && (
          <button
            onClick={exitSearch}
            className="text-[13.5px] font-semibold text-[#E85D2A] active:opacity-70 transition-opacity shrink-0 px-1"
          >
            Cancel
          </button>
        )}
      </div>

      {/* ── Inline search results — replaces Discover content ──── */}
      {isSearching ? (
        <div
          style={{
            animation: 'fylosFadeUp 240ms cubic-bezier(0.34, 1.2, 0.64, 1) both',
          }}
        >
          {!query.trim() ? (
            <>
              <div className="mb-5">
                <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2.5">
                  Recent
                </h3>
                <div className="flex flex-wrap gap-2">
                  {RECENT_DEFAULTS.map((t) => (
                    <button
                      key={t}
                      onClick={() => setQuery(t)}
                      className="h-[30px] px-3 rounded-full bg-white border border-black/[0.05] flex items-center gap-1.5 text-[12px] text-[#111111] active:scale-[0.97]"
                    >
                      <Clock size={11} className="text-[#A09A94]" strokeWidth={2.2} />
                      {t}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-[11px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2.5">
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
          ) : searchResults.length === 0 ? (
            <div className="text-center py-12 px-8">
              <p className="text-[13.5px] text-[#9A9590] leading-relaxed">
                No matches for "<span className="text-[#3A2E22] font-semibold">{query}</span>". Try a broader term.
              </p>
            </div>
          ) : (
            <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
              {searchResults.map((p, i) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  layout="list"
                  saved={data?.isSaved(p.id)}
                  onTap={onOpenProvider}
                  onToggleSave={(prov) => data?.toggleSaveProvider(prov.id)}
                  className={i < searchResults.length - 1 ? 'border-b border-black/[0.04]' : ''}
                />
              ))}
            </div>
          )}
        </div>
      ) : (
      <>

      {/* ── Categories — 4 active tiles, minimal tidy ───────────── */}
      <div className="mb-6">
        <SectionHeader
          title={`What does ${selectedPet?.name || 'your Fylos'} need?`}
          right={
            pets.length > 1 ? (
              <PetSelectorPill
                pets={pets}
                selectedPetId={selectedPetId}
                onSelect={onSelectPet}
              />
            ) : null
          }
        />
        <div className="grid grid-cols-2 gap-2">
          {SERVICE_CATEGORIES.filter((c) => c.active).map((cat) => {
            const Icon = resolveCatIcon(cat.icon);
            return (
              <button
                key={cat.id}
                onClick={() => onOpenCategory && onOpenCategory(cat)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-[14px] bg-white active:scale-[0.98] active:bg-[#FFFAF6] transition-all"
                style={{
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
                }}
              >
                <span
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  style={{ backgroundColor: '#FFEDE3' }}
                >
                  <Icon size={14} className="text-[#E85D2A]" strokeWidth={2.2} />
                </span>
                <span className="text-[13px] font-semibold text-[#111111] leading-none tracking-[-0.01em]">
                  {cat.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Next booking preview — custom card, calm hierarchy ───── */}
      {upcomingForPet.length > 0 && (
        <div className="mb-6">
          <SectionHeader title="Next up" />
          {upcomingForPet.map((b) => {
            const statusColor =
              b.status === 'confirmed'
                ? { bg: '#EEF7F1', dot: '#34C759', text: '#3F8D63' }
                : b.status === 'pending'
                ? { bg: '#FDF1EB', dot: '#E85D2A', text: '#B25030' }
                : { bg: '#F1EDE8', dot: '#9A9590', text: '#6E6E73' };
            const ServiceIcon = resolveCatIcon(
              b.service?.type === 'walk'
                ? 'PawPrint'
                : b.service?.type === 'sitting'
                ? 'Home'
                : b.service?.type === 'grooming'
                ? 'Scissors'
                : b.service?.type === 'vet'
                ? 'Stethoscope'
                : 'Calendar'
            );
            return (
              <button
                key={b.id}
                onClick={() => onOpenBookingDetails && onOpenBookingDetails(b.id)}
                className="w-full text-left rounded-[18px] bg-white p-4 active:scale-[0.99] active:bg-[#FFFAF6] transition-all"
                style={{
                  border: '1px solid rgba(0,0,0,0.04)',
                  boxShadow: '0 1px 2px rgba(0,0,0,0.025)',
                }}
              >
                {/* Top strip — service icon + relative time + status pill */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <ServiceIcon
                      size={12}
                      strokeWidth={2.4}
                      className="text-[#E85D2A] shrink-0"
                    />
                    <span
                      className="text-[11px] font-bold uppercase tracking-[0.08em] truncate"
                      style={{ color: '#E85D2A' }}
                    >
                      {b.helper || b.dateTime?.relative || 'Upcoming'}
                    </span>
                  </div>
                  <span
                    className="inline-flex items-center gap-1.5 h-[22px] px-2 rounded-full shrink-0"
                    style={{ backgroundColor: statusColor.bg }}
                  >
                    <span
                      className="w-[6px] h-[6px] rounded-full"
                      style={{ backgroundColor: statusColor.dot }}
                    />
                    <span
                      className="text-[11px] font-semibold capitalize"
                      style={{ color: statusColor.text }}
                    >
                      {b.status?.replace('-', ' ') || 'upcoming'}
                    </span>
                  </span>
                </div>

                {/* Date + time, conversational headline */}
                {(() => {
                  const dayName = new Date(b.dateTime?.start || `${b.dateTime?.date}T${b.dateTime?.time || '00:00'}`)
                    .toLocaleDateString('en-US', { weekday: 'long' });
                  return (
                    <div
                      className="text-[18px] font-bold leading-tight tracking-[-0.02em] mb-1"
                      style={{ color: '#111111' }}
                    >
                      {dayName} at{' '}
                      <span style={{ color: '#E85D2A' }}>{b.dateTime?.time}</span>
                      <span className="text-[#C4BBB3] mx-1">→</span>
                      <span style={{ color: '#9A9590', fontWeight: 600 }}>{b.dateTime?.endTime}</span>
                    </div>
                  );
                })()}

                {/* Service + pet */}
                <div className="text-[13px] mb-3" style={{ color: '#6E6E73' }}>
                  {b.service?.label}
                  {b.pet?.name ? (
                    <>
                      {' · for '}
                      <span className="font-semibold" style={{ color: '#3A2E22' }}>
                        {b.pet.name}
                      </span>
                    </>
                  ) : null}
                </div>

                {/* Walker row — avatar + name + rating + chevron */}
                <div
                  className="flex items-center gap-2.5 pt-3"
                  style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}
                >
                  {b.provider?.photo ? (
                    <img
                      src={b.provider.photo}
                      alt={b.provider.name}
                      className="w-7 h-7 rounded-full object-cover bg-[#F2F2F7] shrink-0"
                    />
                  ) : (
                    <span
                      className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0"
                      style={{ backgroundColor: '#FFEDE3', color: '#E85D2A' }}
                    >
                      {(b.provider?.name || '?').charAt(0)}
                    </span>
                  )}
                  <span
                    className="text-[12.5px] font-semibold"
                    style={{ color: '#111111' }}
                  >
                    {b.provider?.name}
                  </span>
                  {b.provider?.rating ? (
                    <span
                      className="inline-flex items-center gap-0.5 text-[11.5px] font-medium"
                      style={{ color: '#A09A94' }}
                    >
                      <Star
                        size={10}
                        className="text-[#E85D2A]"
                        strokeWidth={2.4}
                        fill="#E85D2A"
                      />
                      {b.provider.rating}
                    </span>
                  ) : null}
                  <span className="ml-auto text-[#C4BBB3] text-[16px] leading-none shrink-0">
                    ›
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Recommended rail ──────────────────────────────────────── */}
      {recommended.length > 0 && (
        <div className="mb-6">
          <SectionHeader
            title={`We think ${selectedPet?.name || 'your Fylos'} would like`}
          />
          <div
            className="flex gap-3 overflow-x-auto -mx-5 px-5"
            style={{ scrollbarWidth: 'none' }}
          >
            {recommended.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                layout="rail"
                saved={data.isSaved(p.id)}
                onTap={onOpenProvider}
                onToggleSave={(prov) => data.toggleSaveProvider(prov.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Top rated near you ────────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader title="Top rated near you" action="See all" onAction={() => onOpenCategory({ id: 'walking' })} />
        <div className="bg-white rounded-[20px] border border-black/[0.04] px-4">
          {topRated.slice(0, 4).map((p, i) => (
            <ProviderCard
              key={p.id}
              provider={p}
              layout="list"
              saved={data.isSaved(p.id)}
              onTap={onOpenProvider}
              onToggleSave={(prov) => data.toggleSaveProvider(prov.id)}
              tag="Top Rated"
              className={i < 3 ? 'border-b border-black/[0.04]' : ''}
            />
          ))}
        </div>
      </div>

      {/* ── New on Fylos — discovery before "you looked at" ────────── */}
      {newProviders.length > 0 && (
        <div className="mb-6">
          <SectionHeader title="New on Fylos" />
          <div
            className="flex gap-3 overflow-x-auto -mx-5 px-5"
            style={{ scrollbarWidth: 'none' }}
          >
            {newProviders.map((p) => (
              <ProviderCard
                key={p.id}
                provider={p}
                layout="rail"
                saved={data.isSaved(p.id)}
                onTap={onOpenProvider}
                onToggleSave={(prov) => data.toggleSaveProvider(prov.id)}
                tag="New"
              />
            ))}
          </div>
        </div>
      )}

      {/* ── Recently viewed — last, low-priority memory aid ──────── */}
      {recentlyViewed.length > 0 && (
        <div className="mb-6">
          <SectionHeader title="You looked at" />
          <div
            className="flex gap-2 overflow-x-auto -mx-5 px-5"
            style={{ scrollbarWidth: 'none' }}
          >
            {recentlyViewed.map((p) => (
              <ProviderCard key={p.id} provider={p} layout="compact" onTap={onOpenProvider} />
            ))}
          </div>
        </div>
      )}

      {/* ── Quick actions ─────────────────────────────────────────── */}
      <div className="mb-6">
        <SectionHeader title="Quick actions" />
        <div className="bg-white rounded-[18px] border border-black/[0.04] divide-y divide-black/[0.04]">
          <QuickAction
            icon={Map}
            label="Explore on map"
            subtext="Find providers near you"
            onTap={onOpenMap}
          />
          <QuickAction
            icon={Stethoscope}
            label="Vet telehealth"
            subtext="20-min triage call"
            onTap={onOpenVetTelehealth}
          />
        </div>
      </div>

      {/* ── Calm tip card (Zone S warmth) ─────────────────────────── */}
      <div className="rounded-[18px] bg-white border border-black/[0.04] p-4 flex gap-3">
        <span className="w-8 h-8 rounded-full bg-[#FFEDE3] flex items-center justify-center shrink-0">
          <Sparkles size={15} className="text-[#E85D2A]" strokeWidth={2.2} />
        </span>
        <div>
          <p className="text-[13px] font-semibold text-[#111111]">A small tip</p>
          <p className="text-[12.5px] text-[#6E6E73] leading-[1.5] mt-0.5">
            Message a provider before booking — many tell us a quick chat sets the right tone for the first session.
          </p>
        </div>
      </div>
      </>
      )}
    </div>
  );
}

function QuickAction({ icon: Icon, label, subtext, onTap }) {
  return (
    <button
      onClick={onTap}
      className="w-full flex items-center gap-3 px-4 py-3.5 active:opacity-70 transition-opacity text-left"
    >
      <span className="w-9 h-9 rounded-full bg-[#FFEDE3] flex items-center justify-center shrink-0">
        <Icon size={16} className="text-[#E85D2A]" strokeWidth={2.2} />
      </span>
      <div className="flex-1 min-w-0">
        <span className="text-[14px] font-semibold text-[#111111] block">{label}</span>
        {subtext && <span className="text-[11.5px] text-[#8E8E93] block">{subtext}</span>}
      </div>
      <span className="text-[#C4BBB3]">›</span>
    </button>
  );
}
