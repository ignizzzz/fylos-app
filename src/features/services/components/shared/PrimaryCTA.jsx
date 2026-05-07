import React from 'react';

// Peach gradient primary CTA — used as the bottom-of-screen Book / Pay /
// Continue button. Matches FYLOS_DESIGN_SYSTEM §6 (Primary).
// Replaces the legacy solid-black floating CTA from ProviderProfileScreen.

export default function PrimaryCTA({
  children,
  onTap,
  disabled = false,
  variant = 'primary',
  className = '',
  leadIcon: LeadIcon = null,
  trailIcon: TrailIcon = null,
}) {
  const base =
    'w-full h-[52px] rounded-[16px] font-semibold text-[15px] active:scale-[0.98] transition-all flex items-center justify-center gap-2';

  const variantClass =
    variant === 'secondary'
      ? 'bg-white text-[#111111] border border-black/[0.06] shadow-[0_4px_14px_rgba(0,0,0,0.04)]'
      : variant === 'ghost'
      ? 'bg-[#F2F2F7] text-[#111111]'
      : 'text-white shadow-[0_4px_14px_rgba(232,93,42,0.25)]';

  const style =
    variant === 'primary' && !disabled
      ? { background: 'linear-gradient(180deg, #FF7240 0%, #E85D2A 100%)' }
      : variant === 'primary' && disabled
      ? { background: '#EDE8E2', color: '#A09A94', boxShadow: 'none' }
      : undefined;

  return (
    <button
      onClick={() => !disabled && onTap && onTap()}
      disabled={disabled}
      className={`${base} ${variantClass} ${disabled && variant === 'primary' ? 'cursor-not-allowed' : ''} ${className}`}
      style={style}
    >
      {LeadIcon && <LeadIcon size={17} strokeWidth={2.2} />}
      {children}
      {TrailIcon && <TrailIcon size={17} strokeWidth={2.2} />}
    </button>
  );
}
