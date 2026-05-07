import React from 'react';
import { ChevronRight, Plus } from 'lucide-react';
import { T, SHADOWS, RADIUS } from '../../styles/theme';

/* ───────────────────────────────────────────────────────────
   Fylos · UI Primitives
   Reusable layout building blocks. Μέγεθος και spacing
   ταιριάζει με την iPhone frame (375px width).
   ─────────────────────────────────────────────────────────── */

/* Container με cream background — wrap κάθε screen */
export const Screen = ({ children, className = '' }) => (
  <div
    className={`w-full h-full overflow-hidden flex flex-col ${className}`}
    style={{ backgroundColor: T.bg }}
  >
    {children}
  </div>
);

/* Sticky header — title + optional actions left/right */
export const ScreenHeader = ({ title, subtitle, leading, trailing, sticky = true }) => (
  <header
    className={`flex items-center justify-between px-5 py-3 ${sticky ? 'sticky top-0 z-30' : ''}`}
    style={{
      backgroundColor: T.bg,
      borderBottom: subtitle ? 'none' : `1px solid ${T.divider}`,
    }}
  >
    <div className="flex items-center gap-2 min-w-0 flex-1">
      {leading}
      <div className="min-w-0">
        <h1 className="text-[20px] font-semibold leading-tight truncate" style={{ color: T.txt }}>
          {title}
        </h1>
        {subtitle && (
          <p className="text-[12px] leading-tight mt-0.5 truncate" style={{ color: T.muted }}>
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {trailing && <div className="flex items-center gap-1 shrink-0 ml-2">{trailing}</div>}
  </header>
);

/* Round icon button — header actions, sheet close, etc. */
export const IconBtn = ({ icon: Icon, onClick, ariaLabel, size = 36 }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="rounded-full bg-white flex items-center justify-center active:scale-95 transition-transform"
    style={{
      width: size,
      height: size,
      border: `1px solid ${T.border}`,
      boxShadow: SHADOWS.card,
    }}
  >
    <Icon size={size === 36 ? 18 : 16} color={T.txt} strokeWidth={2.1} />
  </button>
);

/* Section label — small uppercase header above content groups */
export const SectionLabel = ({ children, className = '' }) => (
  <div
    className={`text-[11px] font-bold uppercase tracking-[0.06em] mb-2.5 px-1 ${className}`}
    style={{ color: T.muted }}
  >
    {children}
  </div>
);

/* Standard card — rounded-[16px], subtle border */
export const Card = ({ children, className = '', onClick, padding = 'p-4' }) => {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-white border w-full text-left ${onClick ? 'active:scale-[0.99] transition-transform' : ''} ${padding} ${className}`}
      style={{
        borderRadius: RADIUS.lg,
        borderColor: T.border,
        boxShadow: SHADOWS.card,
      }}
    >
      {children}
    </Comp>
  );
};

/* Hero card — rounded-[20px], slightly bigger */
export const LargeCard = ({ children, className = '', onClick, padding = 'p-5' }) => {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`bg-white border w-full text-left ${onClick ? 'active:scale-[0.99] transition-transform' : ''} ${padding} ${className}`}
      style={{
        borderRadius: RADIUS.xl,
        borderColor: T.border,
        boxShadow: SHADOWS.card,
      }}
    >
      {children}
    </Comp>
  );
};

/* Pill chip — generic filter/status indicator */
export const Pill = ({ children, active = false, onClick, icon: Icon, color }) => (
  <button
    onClick={onClick}
    className="h-[30px] px-3 rounded-full inline-flex items-center gap-1.5 shrink-0 active:scale-95 transition-all whitespace-nowrap"
    style={{
      backgroundColor: active ? T.txt : T.card,
      color: active ? T.card : (color || T.txt),
      border: `1px solid ${active ? T.txt : T.border}`,
      boxShadow: active ? 'none' : SHADOWS.card,
    }}
  >
    {Icon && <Icon size={12} strokeWidth={2.4} />}
    <span className="text-[12px] font-semibold">{children}</span>
  </button>
);

/* Trust chip — icon + label, micro-shadow */
export const TrustChip = ({ icon: Icon, iconColor, label }) => (
  <div
    className="h-[26px] px-2.5 rounded-full bg-white flex items-center gap-1.5 shrink-0"
    style={{ border: `1px solid ${T.border}`, boxShadow: SHADOWS.card }}
  >
    <Icon size={11} color={iconColor || T.coral} strokeWidth={2.5} />
    <span className="text-[11px] font-semibold" style={{ color: T.txt }}>{label}</span>
  </div>
);

/* Primary button — coral fill, full-width, h-11 */
export const PrimaryBtn = ({ children, onClick, disabled, icon: Icon }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className="w-full h-11 rounded-[14px] font-semibold text-[14.5px] text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    style={{
      backgroundColor: disabled ? '#D4D4D8' : T.coral,
      boxShadow: disabled ? 'none' : '0 2px 6px rgba(232,93,42,0.24)',
    }}
  >
    {Icon && <Icon size={16} strokeWidth={2.4} />}
    {children}
  </button>
);

/* Ghost button — transparent + border, secondary action */
export const GhostBtn = ({ children, onClick, icon: Icon }) => (
  <button
    onClick={onClick}
    className="w-full h-11 rounded-[14px] font-semibold text-[14.5px] active:scale-[0.98] transition-all flex items-center justify-center gap-2"
    style={{
      backgroundColor: 'transparent',
      color: T.txt,
      border: `1px solid ${T.border}`,
    }}
  >
    {Icon && <Icon size={16} strokeWidth={2.4} />}
    {children}
  </button>
);

/* Pref row — icon-circle + label + value + chevron, with divider */
export const PrefRow = ({ icon: Icon, iconBg, label, value, onTap, last }) => (
  <button
    onClick={onTap}
    className="w-full flex items-center gap-3 px-4 py-[11px] text-left active:bg-black/[0.02] transition-colors relative"
  >
    <div
      className="w-8 h-8 rounded-full shrink-0 flex items-center justify-center"
      style={{ backgroundColor: iconBg || T.tint }}
    >
      <Icon size={14} color={T.coral} strokeWidth={2.2} />
    </div>
    <div className="flex-1 min-w-0">
      <span className="text-[14px] font-semibold block leading-tight truncate" style={{ color: T.txt }}>
        {label}
      </span>
    </div>
    {value && (
      <span className="text-[12.5px] font-medium shrink-0 max-w-[140px] truncate" style={{ color: T.mutedDark }}>
        {value}
      </span>
    )}
    {onTap && <ChevronRight size={14} color="#D4D4D8" strokeWidth={2.2} className="shrink-0 ml-1" />}
    {!last && (
      <div
        className="absolute bottom-0 left-[58px] right-0 h-px"
        style={{ background: T.divider }}
      />
    )}
  </button>
);

/* FAB — floating coral "+" button, bottom-right */
export const FAB = ({ onClick, icon: Icon = Plus, ariaLabel = 'Add' }) => (
  <button
    onClick={onClick}
    aria-label={ariaLabel}
    className="absolute bottom-24 right-5 w-14 h-14 rounded-full flex items-center justify-center active:scale-95 transition-transform z-20"
    style={{
      backgroundColor: T.coral,
      boxShadow: SHADOWS.fab,
    }}
  >
    <Icon size={24} color="#FFFFFF" strokeWidth={2.4} />
  </button>
);

/* Empty state — icon + title + body + optional CTA */
export const EmptyState = ({ icon: Icon, title, body, action }) => (
  <div className="flex flex-col items-center justify-center px-8 py-16 text-center">
    <div
      className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
      style={{ backgroundColor: T.tint }}
    >
      <Icon size={28} color={T.coral} strokeWidth={1.8} />
    </div>
    <h3 className="text-[17px] font-semibold mb-1.5" style={{ color: T.txt }}>{title}</h3>
    <p className="text-[13.5px] leading-snug max-w-[260px]" style={{ color: T.mutedDark }}>
      {body}
    </p>
    {action && <div className="mt-5 w-full max-w-[260px]">{action}</div>}
  </div>
);

/* Section wrapper — label + content with consistent spacing */
export const Section = ({ label, children, className = '' }) => (
  <div className={`px-5 mb-6 ${className}`}>
    {label && <SectionLabel>{label}</SectionLabel>}
    {children}
  </div>
);

/* Avatar — circular photo με fallback initial */
export const Avatar = ({ src, name, size = 40, ring = false }) => {
  const initial = (name || '?').charAt(0).toUpperCase();
  return (
    <div
      className="rounded-full overflow-hidden flex items-center justify-center shrink-0"
      style={{
        width: size,
        height: size,
        backgroundColor: T.tint,
        border: ring ? `2px solid ${T.card}` : 'none',
        boxShadow: ring ? SHADOWS.card : 'none',
      }}
    >
      {src ? (
        <img src={src} alt={name} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold" style={{ color: T.coral, fontSize: size * 0.4 }}>
          {initial}
        </span>
      )}
    </div>
  );
};
