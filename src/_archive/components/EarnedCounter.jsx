import React, { useEffect, useRef, useState } from 'react';

/**
 * EarnedCounter — Revolut/Uber-style data readout.
 * Bold tabular number (Inter Tight), small all-caps label, flat coral dot.
 * Flips on value change. One-liner, inline-baseline.
 */
export default function EarnedCounter({
  label = 'EARNED',
  value = 0,
  unit = 'walks',
  size = 'md',          // 'sm' | 'md' | 'lg'
  layout = 'row',       // 'row' | 'stack'
  className = '',
}) {
  const prev = useRef(value);
  const [display, setDisplay] = useState(value);
  const [ticking, setTicking] = useState(false);

  useEffect(() => {
    if (value === prev.current) return;
    setTicking(true);
    const t = setTimeout(() => {
      setDisplay(value);
      setTicking(false);
      prev.current = value;
    }, 220);
    return () => clearTimeout(t);
  }, [value]);

  const S = {
    sm: { label: 9, n: 16, unit: 11 },
    md: { label: 10, n: 22, unit: 12 },
    lg: { label: 11, n: 30, unit: 13 },
  }[size] || { label: 10, n: 22, unit: 12 };

  const LabelEl = (
    <span
      className="text-[#8E7A6B] uppercase"
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: S.label,
        fontWeight: 700,
        letterSpacing: '0.18em',
      }}
    >
      <span
        className="inline-block h-[4px] w-[4px] rounded-full align-middle mr-1.5"
        style={{ backgroundColor: '#E85D2A' }}
      />
      {label}
    </span>
  );

  const NumberEl = (
    <span
      className="inline-flex items-baseline gap-1.5"
      style={{ lineHeight: 1 }}
    >
      <span
        className="inline-block overflow-hidden align-baseline"
        style={{ height: S.n * 1.05 }}
      >
        <span
          className="inline-block will-change-transform"
          style={{
            fontFamily: '"Inter Tight", Inter, sans-serif',
            fontSize: S.n,
            fontWeight: 800,
            letterSpacing: '-0.015em',
            color: '#1A1614',
            fontVariantNumeric: 'tabular-nums',
            fontFeatureSettings: '"tnum"',
            transform: ticking ? 'translateY(-30%)' : 'translateY(0)',
            opacity: ticking ? 0 : 1,
            transitionProperty: 'transform, opacity',
            transitionDuration: '420ms',
            transitionTimingFunction: 'cubic-bezier(0.2, 0.85, 0.3, 1.05)',
          }}
        >
          {display}
        </span>
      </span>
      {unit && (
        <span
          className="text-[#6E6058]"
          style={{
            fontFamily: 'Inter, sans-serif',
            fontSize: S.unit,
            fontWeight: 600,
            letterSpacing: '-0.005em',
          }}
        >
          {unit}
        </span>
      )}
    </span>
  );

  if (layout === 'stack') {
    return (
      <div className={`inline-flex flex-col items-start gap-0.5 ${className}`}>
        {LabelEl}
        {NumberEl}
      </div>
    );
  }
  return (
    <span className={`inline-flex items-baseline gap-2.5 ${className}`}>
      {LabelEl}
      {NumberEl}
    </span>
  );
}
