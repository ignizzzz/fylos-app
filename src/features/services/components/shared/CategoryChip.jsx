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
      className={`relative flex flex-col items-start text-left p-3 rounded-[18px] transition-all duration-[180ms] ${
        disabled
          ? 'opacity-50 cursor-not-allowed bg-white border border-black/[0.04]'
          : 'bg-white border border-black/[0.04] active:scale-[0.98] active:-translate-y-[1px] hover:border-[#E85D2A]/20 hover:shadow-[0_4px_14px_rgba(0,0,0,0.04)]'
      }`}
      style={{ minHeight: 86 }}
    >
      <span className="w-9 h-9 rounded-full bg-[#FFEDE3] flex items-center justify-center mb-2">
        {disabled ? (
          <Lock size={15} className="text-[#A09A94]" strokeWidth={2.2} />
        ) : (
          <Icon size={17} className="text-[#E85D2A]" strokeWidth={2.2} />
        )}
      </span>
      <span className="text-[13.5px] font-semibold text-[#111111] leading-none">{category.label}</span>
      {category.blurb && (
        <span className="text-[11px] text-[#8E8E93] mt-1 leading-tight">{category.blurb}</span>
      )}
      {disabled && (
        <span className="absolute top-2.5 right-2.5 text-[9px] font-semibold text-[#A09A94] uppercase tracking-wider">
          Soon
        </span>
      )}
    </button>
  );
}
