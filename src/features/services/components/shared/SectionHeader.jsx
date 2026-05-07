import React from 'react';
import { ChevronRight } from 'lucide-react';

// Reusable section header with optional trailing action link.
// Matches the type scale of FYLOS_DESIGN_SYSTEM §7 (Section header prominent).

export default function SectionHeader({ title, action, onAction, className = '' }) {
  return (
    <div className={`flex justify-between items-center mb-3 ${className}`}>
      <h3 className="text-[15px] font-semibold text-[#111111]">{title}</h3>
      {action && onAction ? (
        <button
          onClick={onAction}
          className="flex items-center gap-0.5 text-[12px] font-medium text-[#E85D2A] active:opacity-70 transition-opacity"
        >
          {action}
          <ChevronRight size={12} strokeWidth={2.2} />
        </button>
      ) : null}
    </div>
  );
}
