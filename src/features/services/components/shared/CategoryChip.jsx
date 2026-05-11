import React from 'react';
import { Lock } from 'lucide-react';
import { resolveIcon } from './icons';

// Peach-bg + coral-icon category chip. Per FYLOS settings/list-row style memory.
// Coming-soon (active=false) renders at 40% opacity with a small lock pin.

export default function CategoryChip({ category, onTap, layout = 'tile' }) {
  const Icon = resolveIcon(category.icon);
  const disabled = !category.active;

  if (layout === 'pill') {
    return (
      <button
        onClick={() => !disabled && onTap && onTap(category)}
        className={`shrink-0 flex items-center gap-2 pl-2 pr-3.5 py-1.5 rounded-full transition-all duration-[180ms] ${
          disabled
            ? 'opacity-40 cursor-not-allowed bg-white border border-black/[0.04]'
            : 'bg-white border border-black/[0.05] active:scale-[0.97] hover:border-[#E85D2A]/30'
        }`}
      >
        <span className="w-7 h-7 rounded-full bg-[#FFEDE3] flex items-center justify-center">
          {disabled ? (
            <Lock size={12} className="text-[#A09A94]" strokeWidth={2.2} />
          ) : (
            <Icon size={14} className="text-[#E85D2A]" strokeWidth={2.2} />
          )}
        </span>
        <span className="text-[13px] font-semibold text-[#111111]">{category.label}</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => !disabled && onTap && onTap(category)}
      className={`group relative flex flex-col items-start text-left p-3 rounded-[20px] overflow-hidden transition-all duration-200 ${
        disabled
          ? 'cursor-not-allowed'
          : 'active:scale-[0.97] active:-translate-y-[1px] hover:-translate-y-[1px] hover:shadow-[0_8px_24px_rgba(232,93,42,0.12)]'
      }`}
      style={{
        minHeight: 118,
        background: disabled
          ? 'linear-gradient(160deg, #F7F5F2 0%, #ECE7E0 100%)'
          : 'linear-gradient(160deg, #FFEFE2 0%, #F8C9A8 100%)',
        border: disabled
          ? '1px solid rgba(0,0,0,0.04)'
          : '1px solid rgba(232,93,42,0.14)',
        boxShadow: disabled ? 'none' : '0 1px 3px rgba(232,93,42,0.06)',
      }}
    >
      {/* Soft radial highlight on active tiles for depth */}
      {!disabled && (
        <span
          className="pointer-events-none absolute inset-0"
          style={{
            background: 'radial-gradient(circle at 18% 14%, rgba(255,255,255,0.65) 0%, rgba(255,255,255,0) 55%)',
          }}
        />
      )}

      {/* Big bold icon — directly on peach, no inner square. The hero of the tile. */}
      <span className="relative">
        {disabled ? (
          <Lock size={26} className="text-[#9A9590]" strokeWidth={2.2} />
        ) : (
          <Icon
            size={30}
            className="text-[#D14C1B]"
            strokeWidth={2.2}
            style={{ filter: 'drop-shadow(0 1px 0 rgba(255,255,255,0.6))' }}
          />
        )}
      </span>

      {/* Label — anchored bottom, tight tracking, single line nowrap */}
      <span
        className={`relative text-[12px] font-bold leading-[1.1] mt-auto pt-3 tracking-[-0.025em] whitespace-nowrap ${
          disabled ? 'text-[#8E8884]' : 'text-[#3A1F12]'
        }`}
      >
        {category.label}
      </span>
      {category.blurb && (
        <span
          className={`relative text-[10.5px] mt-0.5 leading-[1.25] ${
            disabled ? 'text-[#B5AEA8]' : 'text-[#6E4838]'
          }`}
        >
          {category.blurb}
        </span>
      )}

      {/* "Soon" pill — top-right, when disabled */}
      {disabled && (
        <span
          className="absolute top-3 right-3 text-[9px] font-bold text-[#A09A94] uppercase tracking-[0.08em] px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: 'rgba(255,255,255,0.85)', border: '1px solid rgba(0,0,0,0.04)' }}
        >
          Soon
        </span>
      )}
    </button>
  );
}
