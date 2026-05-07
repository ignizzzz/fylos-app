import React, { useMemo, useState, useEffect, useId } from 'react';

/**
 * PackDiagram — the constellation hero for Network mode.
 * Your dog sits at the center; pack members orbit. Size ∝ intimacy (past playdates),
 * distance from center ∝ recency (fresher = closer), opacity ∝ freshness.
 * Faint dashed lines to dogs walked with this week.
 *
 * "Oura rings, for social graph." The Network mode's signature visual.
 */
export default function PackDiagram({
  centerPet,        // { name, photo }
  members = [],     // [{ id, name, photo, intimacy (0-1), recency (0-1, 0=fresh), connected (bool) }]
  onSelectCenter,
  onSelectMember,
  height = 200,
  className = '',
}) {
  const gradId = useId();
  const W = 400;
  const H = height;
  const CX = W / 2;
  const CY = H / 2;

  const positioned = useMemo(() => {
    if (!members.length) return [];
    const count = members.length;
    return members.map((m, i) => {
      // Alternating top/bottom arcs for even distribution
      const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
      const recency = Math.max(0, Math.min(1, m.recency ?? 0.3));
      const intimacy = Math.max(0, Math.min(1, m.intimacy ?? 0.5));
      // closer = fresher; range 55 → 95 px from center
      const radius = 58 + recency * 38;
      const cx = CX + Math.cos(angle) * radius * 1.05;
      const cy = CY + Math.sin(angle) * radius * 0.78;
      const r = 10 + intimacy * 8; // 10 → 18 px
      const opacity = 0.45 + (1 - recency) * 0.55;
      return { ...m, cx, cy, r, opacity, _drift: (i % 4) + 7 };
    });
  }, [members]);

  const connections = positioned.filter((p) => p.connected);

  return (
    <div className={`relative w-full ${className}`} style={{ height: H }}>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-full" preserveAspectRatio="xMidYMid meet">
        <defs>
          <radialGradient id={`${gradId}-glow`}>
            <stop offset="0%" stopColor="#E85D2A" stopOpacity="0.35" />
            <stop offset="60%" stopColor="#E85D2A" stopOpacity="0.08" />
            <stop offset="100%" stopColor="#E85D2A" stopOpacity="0" />
          </radialGradient>
          <radialGradient id={`${gradId}-bg`}>
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#F7F5F2" stopOpacity="0" />
          </radialGradient>
          {positioned.map((p) => (
            <clipPath key={`${gradId}-clip-${p.id}`} id={`${gradId}-clip-${p.id}`}>
              <circle cx={p.cx} cy={p.cy} r={p.r - 1.5} />
            </clipPath>
          ))}
          <clipPath id={`${gradId}-clip-center`}>
            <circle cx={CX} cy={CY} r={22} />
          </clipPath>
        </defs>

        {/* Ambient background */}
        <rect x="0" y="0" width={W} height={H} fill={`url(#${gradId}-bg)`} />

        {/* Connection lines (walked-with-this-week) */}
        <g>
          {connections.map((p) => (
            <line
              key={`ln-${p.id}`}
              x1={CX}
              y1={CY}
              x2={p.cx}
              y2={p.cy}
              stroke="#E85D2A"
              strokeOpacity="0.22"
              strokeWidth="1"
              strokeDasharray="2 4"
            />
          ))}
        </g>

        {/* Center halo — slow pulse */}
        <circle cx={CX} cy={CY} r="48" fill={`url(#${gradId}-glow)`}>
          <animate attributeName="r" values="44;52;44" dur="4.2s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.9;1;0.9" dur="4.2s" repeatCount="indefinite" />
        </circle>

        {/* Satellites */}
        <g>
          {positioned.map((p) => (
            <g
              key={p.id}
              style={{ cursor: onSelectMember ? 'pointer' : 'default' }}
              onClick={() => onSelectMember?.(p)}
            >
              {/* drift animation via SVG */}
              <g>
                <animateTransform
                  attributeName="transform"
                  type="translate"
                  values={`0,0; 0,-2.5; 0,0`}
                  dur={`${p._drift}s`}
                  repeatCount="indefinite"
                />
                <circle
                  cx={p.cx}
                  cy={p.cy}
                  r={p.r}
                  fill="#FFFFFF"
                  stroke="#EDE8E2"
                  strokeWidth="1.25"
                  opacity={p.opacity}
                />
                {p.photo ? (
                  <image
                    href={p.photo}
                    xlinkHref={p.photo}
                    x={p.cx - p.r + 1}
                    y={p.cy - p.r + 1}
                    width={(p.r - 1) * 2}
                    height={(p.r - 1) * 2}
                    clipPath={`url(#${gradId}-clip-${p.id})`}
                    preserveAspectRatio="xMidYMid slice"
                    opacity={p.opacity}
                  />
                ) : (
                  <text
                    x={p.cx}
                    y={p.cy + 3}
                    textAnchor="middle"
                    fontSize="9"
                    fill="#8E7A6B"
                    style={{ fontFamily: 'Inter, sans-serif', fontWeight: 600 }}
                  >
                    {p.name?.slice(0, 1) || '·'}
                  </text>
                )}
              </g>
            </g>
          ))}
        </g>

        {/* Center pet */}
        <g
          style={{ cursor: onSelectCenter ? 'pointer' : 'default' }}
          onClick={() => onSelectCenter?.(centerPet)}
        >
          <circle cx={CX} cy={CY} r="24" fill="#FFFFFF" stroke="#E85D2A" strokeWidth="2" />
          {centerPet?.photo ? (
            <image
              href={centerPet.photo}
              xlinkHref={centerPet.photo}
              x={CX - 22}
              y={CY - 22}
              width="44"
              height="44"
              clipPath={`url(#${gradId}-clip-center)`}
              preserveAspectRatio="xMidYMid slice"
            />
          ) : (
            <text
              x={CX}
              y={CY + 5}
              textAnchor="middle"
              fontSize="14"
              fill="#2B2420"
              style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
            >
              {centerPet?.name?.slice(0, 1) || '·'}
            </text>
          )}
        </g>

        {/* Caption label under center — native sans caps */}
        <text
          x={CX}
          y={H - 10}
          textAnchor="middle"
          fontSize="10"
          letterSpacing="2.5"
          fill="#8E7A6B"
          style={{ fontFamily: 'Inter, sans-serif', fontWeight: 700 }}
        >
          YOUR PACK · {members.length}
        </text>
      </svg>
    </div>
  );
}
