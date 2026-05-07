import React from 'react';

// Sliding-pill 3-way switcher.
// Same pattern the Social tab uses (NetworkMode.SubTabs) — kept in sync visually.

export default function ServicesSubTabs({ tab, setTab, badges = {} }) {
  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'saved', label: 'Saved' },
  ];
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === tab));

  return (
    <div className="flex bg-white/80 backdrop-blur-xl p-1.5 rounded-full border border-black/[0.04] relative">
      <div
        className="absolute top-1.5 bottom-1.5 bg-[#111111] rounded-full transition-all duration-[300ms]"
        style={{
          width: `calc(${100 / tabs.length}% - 12px)`,
          left: `calc(${(100 / tabs.length) * activeIndex}% + 6px)`,
          transitionTimingFunction: 'cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      />
      {tabs.map((t) => {
        const isActive = t.id === tab;
        const badge = badges[t.id];
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-[200ms] flex items-center justify-center gap-1.5 ${
              isActive ? 'text-white' : 'text-[#8E8E93] hover:text-[#111111]'
            }`}
          >
            {t.label}
            {badge ? (
              <span
                className={`min-w-[14px] h-[14px] px-1 rounded-full text-[9px] font-bold inline-flex items-center justify-center ${
                  isActive ? 'bg-white/20 text-white' : 'bg-[#FF6A3D] text-white'
                }`}
              >
                {badge}
              </span>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
