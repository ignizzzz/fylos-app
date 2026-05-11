import React from 'react';
import { ChevronRight, Lock } from 'lucide-react';
import { resolveIcon } from './icons';

/* List-row rendering of a service category. Mirrors Quick actions / settings
 * row style: peach circle + coral icon + label/blurb + count + chevron.
 * Coming-soon (active=false) shows a Lock and a small "Soon" pill instead. */

export default function CategoryRow({ category, onTap, last = false }) {
  const Icon = resolveIcon(category.icon);
  const disabled = !category.active;

  return (
    <button
      onClick={() => !disabled && onTap && onTap(category)}
      disabled={disabled}
      className={`relative w-full flex items-center gap-3 px-4 py-3.5 text-left transition-colors ${
        disabled ? 'cursor-default' : 'active:bg-black/[0.02]'
      }`}
    >
      {/* Icon circle */}
      <span
        className={`w-9 h-9 rounded-full flex items-center justify-center shrink-0 ${
          disabled ? 'bg-[#F1EDE8]' : 'bg-[#FFEDE3]'
        }`}
      >
        {disabled ? (
          <Lock size={14} className="text-[#A09A94]" strokeWidth={2.2} />
        ) : (
          <Icon size={16} className="text-[#E85D2A]" strokeWidth={2.2} />
        )}
      </span>

      {/* Label only — single line, minimal */}
      <span
        className={`flex-1 min-w-0 text-[15px] font-semibold leading-tight truncate ${
          disabled ? 'text-[#9A9590]' : 'text-[#111111]'
        }`}
      >
        {category.label}
      </span>

      {/* Chevron only on active */}
      {!disabled && (
        <ChevronRight size={16} className="text-[#C4BBB3] shrink-0" strokeWidth={2.2} />
      )}

      {/* Hairline divider */}
      {!last && (
        <span
          className="absolute bottom-0 left-[60px] right-4 h-px"
          style={{ backgroundColor: '#F1EDE8' }}
        />
      )}
    </button>
  );
}
