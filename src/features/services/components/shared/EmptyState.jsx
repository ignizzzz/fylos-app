import React from 'react';

// Calm empty state — no illustrations, no celebratory copy.
// Centered icon (peach circle + coral icon), title, subtext, optional CTA.

export default function EmptyServicesState({ icon: Icon, title, subtext, actionLabel, onAction }) {
  return (
    <div className="flex flex-col items-center text-center py-14 px-6">
      {Icon && (
        <span className="w-[58px] h-[58px] rounded-full bg-[#FFEDE3] flex items-center justify-center mb-4">
          <Icon size={22} className="text-[#E85D2A]" strokeWidth={2.2} />
        </span>
      )}
      <h3 className="text-[15.5px] font-semibold text-[#111111] mb-1.5">{title}</h3>
      {subtext && (
        <p className="text-[13px] text-[#6E6E73] leading-[1.5] max-w-[280px]">{subtext}</p>
      )}
      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 h-10 px-5 rounded-[14px] bg-gradient-to-b from-[#FF7240] to-[#E85D2A] text-white text-[13px] font-semibold active:scale-[0.97] transition-all shadow-[0_4px_14px_rgba(232,93,42,0.18)]"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
