import React, { useMemo } from 'react';
import { Search, Compass, Stethoscope, Map, Sparkles } from 'lucide-react';
import { SERVICE_CATEGORIES } from '../../../data/services';
import CategoryChip from '../components/shared/CategoryChip';
import ProviderCard from '../components/shared/ProviderCard';
import BookingRow from '../components/shared/BookingRow';
import SectionHeader from '../components/shared/SectionHeader';

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
}) {
  const selectedPet = pets.find((p) => p.id === selectedPetId) || pets[0];
  const recommended = useMemo(() => data.recommendedFor(selectedPetId), [data, selectedPetId]);
  const topRated = data.topRatedNearYou;
  const newProviders = data.newProviders;
  const recentlyViewed = data.recentlyViewed;

  const upcomingForPet = data
    .bookingsByStatus('upcoming', selectedPetId)
    .slice(0, 1);

  return (
    <div className="px-5 pb-8">
      {/* ── Search field ─────────────────────────────────────────── */}
      <button
        onClick={onOpenSearch}
        className="w-full flex items-center gap-2.5 h-[48px] px-4 rounded-[16px] bg-white border border-black/[0.04] mb-4 active:opacity-80 transition-opacity"
      >
        <Search size={16} className="text-[#A09A94]" strokeWidth={2.2} />
        <span className="text-[13.5px] text-[#A09A94]">Find walkers, sitters, vets…</span>
      </button>

      {/* ── Categories grid (peach + coral) ──────────────────────── */}
      <div className="mb-6">
        <SectionHeader title={`What does ${selectedPet?.name || 'your Fylos'} need?`} />
        <div className="grid grid-cols-4 gap-2">
          {SERVICE_CATEGORIES.map((cat) => (
            <CategoryChip key={cat.id} category={cat} onTap={onOpenCategory} />
          ))}
        </div>
      </div>

      {/* ── Next booking preview (if any) ─────────────────────────── */}
      {upcomingForPet.length > 0 && (
        <div className="mb-6">
          <SectionHeader title="Next up" />
          <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
            {upcomingForPet.map((b, i) => (
              <BookingRow
                key={b.id}
                booking={b}
                onTap={() => onOpenBookingDetails && onOpenBookingDetails(b.id)}
                showDivider={i < upcomingForPet.length - 1}
              />
            ))}
          </div>
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
              className={i < 3 ? 'border-b border-black/[0.04]' : ''}
            />
          ))}
        </div>
      </div>

      {/* ── Recently viewed ───────────────────────────────────────── */}
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

      {/* ── New on Fylos ──────────────────────────────────────────── */}
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
              />
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
