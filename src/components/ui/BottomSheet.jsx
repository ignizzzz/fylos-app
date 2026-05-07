import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { T, SHADOWS, RADIUS } from '../../styles/theme';

/* ───────────────────────────────────────────────────────────
   BottomSheet — backdrop + drag handle + content
   Sits inside the iPhone frame (absolute positioning).
   ─────────────────────────────────────────────────────────── */

export const BottomSheet = ({ open, onClose, children, height = '80%', dismissible = true }) => {
  // ESC-key dismiss
  useEffect(() => {
    if (!open || !dismissible) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, dismissible, onClose]);

  if (!open) return null;

  return (
    <div
      className="absolute inset-0 z-50 flex items-end"
      onClick={dismissible ? onClose : undefined}
    >
      <div className="absolute inset-0" style={{ backgroundColor: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(2px)' }} />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full overflow-hidden flex flex-col"
        style={{
          backgroundColor: T.bg,
          borderTopLeftRadius: RADIUS.sheet,
          borderTopRightRadius: RADIUS.sheet,
          boxShadow: SHADOWS.sheet,
          maxHeight: height,
          minHeight: '40%',
        }}
      >
        {/* Drag handle */}
        <div className="w-full flex flex-col items-center pt-3 pb-2 shrink-0">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D5CEC7' }} />
        </div>
        <div className="flex-1 overflow-y-auto">
          {children}
        </div>
      </div>
    </div>
  );
};

/* SheetHeader — title + subtitle + close button */
export const SheetHeader = ({ title, subtitle, onClose }) => (
  <div className="flex items-start justify-between px-5 pb-3 mt-1">
    <div className="flex-1 pr-3">
      <h3 className="text-[18px] font-semibold mb-0.5 leading-tight" style={{ color: T.txt }}>
        {title}
      </h3>
      {subtitle && (
        <p className="text-[12.5px] leading-snug" style={{ color: T.mutedDark }}>
          {subtitle}
        </p>
      )}
    </div>
    {onClose && (
      <button
        onClick={onClose}
        aria-label="Close"
        className="w-8 h-8 rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform shrink-0"
        style={{ border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
      >
        <X size={14} color={T.txt} strokeWidth={2.2} />
      </button>
    )}
  </div>
);

/* FullScreenOverlay — for full-screen detail views (e.g. journal entry detail) */
export const FullScreenOverlay = ({ open, onClose, children }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => e.key === 'Escape' && onClose?.();
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="absolute inset-0 z-50 flex flex-col" style={{ backgroundColor: T.bg }}>
      {children}
    </div>
  );
};
