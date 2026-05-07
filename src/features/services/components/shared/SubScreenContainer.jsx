import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { ChevronLeft, MoreHorizontal } from 'lucide-react';

// Slide-in sub-screen container (canonical pattern from PeerProfilePage).
//
// — Portals into #fylos-phone-root so it sits above the tab content but
//   does NOT cover the iPhone notch (z-50) or the tab dock (z-90).
// — z-[80] sits *between* notch & dock visually so they remain visible.
// — Slide-in: translate-x-full → translate-x-0 in 300ms.
// — Floating header (canonical sticky+blur) with optional right action.
// — Bottom-fade gradient to settle content into the dock area.
// — Internal scrollable body with paddingTop:100, paddingBottom:110.

export default function SubScreenContainer({
  title,
  onClose,
  rightAction = null,        // { icon: Component, onTap, ariaLabel }
  bottomCTA = null,          // ReactNode rendered above the bottom fade
  children,
  bg = '#F9F9FB',
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    return () => cancelAnimationFrame(raf);
  }, []);

  const handleClose = () => {
    setVisible(false);
    setTimeout(() => onClose && onClose(), 300);
  };

  const RightIcon = rightAction?.icon;

  const content = (
    <div
      className={`absolute inset-0 z-[80] transition-transform duration-300 ${
        visible ? 'translate-x-0' : 'translate-x-full'
      }`}
      style={{ backgroundColor: bg, transitionTimingFunction: 'cubic-bezier(0.32,0.72,0,1)' }}
    >
      {/* Scrollable body */}
      <div
        className="absolute inset-0 overflow-y-auto custom-scrollbar"
        style={{ paddingTop: 100, paddingBottom: bottomCTA ? 160 : 110 }}
      >
        {children}
      </div>

      {/* Bottom fade — content fades into the tab-dock area */}
      <div
        className="absolute left-0 right-0 z-30 pointer-events-none"
        style={{
          bottom: 0,
          height: bottomCTA ? 160 : 130,
          background: `linear-gradient(to top, ${bg} 0%, ${bg} 38%, ${hexToRgba(bg, 0)} 100%)`,
        }}
      />

      {/* Sticky CTA(s) */}
      {bottomCTA && (
        <div className="absolute left-5 right-5 z-40" style={{ bottom: 32 }}>
          {bottomCTA}
        </div>
      )}

      {/* Floating header — canonical pattern */}
      <header
        className="absolute top-0 left-0 right-0 z-40 pointer-events-none"
        style={{
          paddingTop: 56,
          paddingBottom: 24,
          paddingLeft: 20,
          paddingRight: 20,
          background: `linear-gradient(180deg, ${bg} 0%, ${hexToRgba(bg, 0.85)} 70%, ${hexToRgba(bg, 0)} 100%)`,
        }}
      >
        <div className="flex items-center justify-between pointer-events-auto">
          <button
            onClick={handleClose}
            className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-full active:scale-[0.96] transition-all duration-[120ms]"
            aria-label="Back"
          >
            <ChevronLeft size={20} className="text-[#111111]" strokeWidth={2.2} />
          </button>
          {title ? (
            <h1 className="text-[17px] font-semibold text-[#111111] truncate max-w-[200px] text-center">
              {title}
            </h1>
          ) : (
            <span />
          )}
          {RightIcon ? (
            <button
              onClick={rightAction.onTap}
              className="w-[44px] h-[44px] flex items-center justify-center bg-white border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-full active:scale-[0.96] transition-all duration-[120ms]"
              aria-label={rightAction.ariaLabel || 'Action'}
            >
              <RightIcon size={18} className="text-[#111111]" strokeWidth={2} />
            </button>
          ) : (
            <span className="w-[44px]" />
          )}
        </div>
      </header>
    </div>
  );

  const mount =
    typeof document !== 'undefined' ? document.getElementById('fylos-phone-root') : null;
  return mount ? createPortal(content, mount) : content;
}

// Util: convert hex/rgba string → rgba(...) with custom alpha. Best-effort.
function hexToRgba(input, alpha) {
  if (typeof input !== 'string') return `rgba(249,249,251,${alpha})`;
  if (input.startsWith('rgba')) return input.replace(/[\d.]+\)$/, `${alpha})`);
  if (input.startsWith('rgb')) return input.replace('rgb(', 'rgba(').replace(')', `,${alpha})`);
  if (input.startsWith('#')) {
    const h = input.replace('#', '');
    const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
    const r = parseInt(full.slice(0, 2), 16);
    const g = parseInt(full.slice(2, 4), 16);
    const b = parseInt(full.slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }
  return `rgba(249,249,251,${alpha})`;
}
