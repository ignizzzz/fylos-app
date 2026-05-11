import React from 'react';

// Sliding-pill 3-way switcher — premium pass.
// Refined surface: cream-tinted container with crisp inner shadow for depth,
// active pill uses a warm dark gradient (not flat black) with subtle inner
// highlight, springier motion. Messages icon outside this control is styled
// to match.

export default function ServicesSubTabs({ tab, setTab, badges = {} }) {
  const tabs = [
    { id: 'discover', label: 'Discover' },
    { id: 'bookings', label: 'Bookings' },
    { id: 'saved', label: 'Saved' },
  ];
  const activeIndex = Math.max(0, tabs.findIndex((t) => t.id === tab));

  return (
    <div className="flex items-baseline gap-6 pb-1">
      {tabs.map((t) => {
        const isActive = t.id === tab;
        const badge = badges[t.id];
        return (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className="relative py-1 flex items-baseline"
            style={{
              color: isActive ? '#1A1715' : '#B0A89F',
              fontSize: isActive ? '20px' : '13.5px',
              fontWeight: isActive ? 700 : 400,
              letterSpacing: isActive ? '-0.03em' : '-0.005em',
              lineHeight: 1,
              transition:
                'color 240ms ease, font-size 280ms cubic-bezier(0.34, 1.2, 0.64, 1), letter-spacing 240ms ease',
            }}
            aria-label={badge ? `${t.label} (${badge} updates)` : t.label}
          >
            {t.label}
            {badge ? (
              <sup
                className="font-bold ml-[3px]"
                style={{
                  color: '#E85D2A',
                  fontSize: isActive ? '11px' : '9.5px',
                  lineHeight: 0,
                  position: 'relative',
                  top: isActive ? '-0.55em' : '-0.5em',
                  letterSpacing: 0,
                }}
              >
                {badge}
              </sup>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
