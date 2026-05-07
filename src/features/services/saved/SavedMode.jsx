import React from 'react';
import { Bookmark, Compass } from 'lucide-react';
import ProviderCard from '../components/shared/ProviderCard';
import EmptyServicesState from '../components/shared/EmptyState';
import SectionHeader from '../components/shared/SectionHeader';

// Saved — Zone S. Bookmarked providers grouped lightly + recently viewed.

export default function SavedMode({
  data,
  onOpenProvider,
  onOpenDiscover,
}) {
  const saved = data.savedProviders;
  const recents = data.recentlyViewed;

  if (saved.length === 0) {
    return (
      <div className="px-5 pb-8">
        <EmptyServicesState
          icon={Bookmark}
          title="Nothing saved yet"
          subtext="Tap the bookmark on any provider to keep them here for later."
          actionLabel="Browse providers"
          onAction={onOpenDiscover}
        />

        {recents.length > 0 && (
          <div className="mt-2">
            <SectionHeader title="You recently looked at" />
            <div
              className="flex gap-3 overflow-x-auto -mx-5 px-5"
              style={{ scrollbarWidth: 'none' }}
            >
              {recents.map((p) => (
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
      </div>
    );
  }

  // Group by primary category
  const groups = saved.reduce((acc, p) => {
    const cat = p.categoryIds?.[0] || 'other';
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(p);
    return acc;
  }, {});

  const groupLabels = {
    walking: 'Walkers',
    sitting: 'Sitters',
    grooming: 'Groomers',
    vet: 'Vets',
    daycare: 'Daycare',
    boarding: 'Boarding',
    training: 'Trainers',
    taxi: 'Pet taxi',
    other: 'Other',
  };

  return (
    <div className="px-5 pb-8">
      <SectionHeader title="Your saved providers" />
      <div className="space-y-5">
        {Object.entries(groups).map(([catId, providers]) => (
          <div key={catId}>
            <h4 className="text-[12px] font-bold text-[#8E8E93] uppercase tracking-widest mb-2">
              {groupLabels[catId] || catId}
            </h4>
            <div className="bg-white rounded-[18px] border border-black/[0.04] px-4">
              {providers.map((p, i) => (
                <ProviderCard
                  key={p.id}
                  provider={p}
                  layout="list"
                  saved
                  onTap={onOpenProvider}
                  onToggleSave={(prov) => data.toggleSaveProvider(prov.id)}
                  className={i < providers.length - 1 ? 'border-b border-black/[0.04]' : ''}
                />
              ))}
            </div>
          </div>
        ))}
      </div>

      {recents.length > 0 && (
        <div className="mt-7">
          <SectionHeader title="Recently viewed" />
          <div
            className="flex gap-2 overflow-x-auto -mx-5 px-5"
            style={{ scrollbarWidth: 'none' }}
          >
            {recents.map((p) => (
              <ProviderCard key={p.id} provider={p} layout="compact" onTap={onOpenProvider} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
