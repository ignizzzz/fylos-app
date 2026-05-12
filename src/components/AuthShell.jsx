import React from 'react';
import { ChevronLeft } from 'lucide-react';

/* ──────────────────────────────────────────────────────────────────────
   AuthShell — shared wrapper for /sign-in and /create-account.
   Matches the canonical iPhone frame + cream canvas used everywhere
   else in the app (see ONBOARDING_v4 wrapper), so auth feels like a
   natural continuation of onboarding.

   Layout (top → bottom):
     · back button (optional)
     · watercolor hero (fixed 240px tall, breathes the brand)
     · FYLOS wordmark + tagline
     · children (the form)
     · footer cross-link (e.g. "New to Fylos? Create account")
   ────────────────────────────────────────────────────────────────────── */

export const TAuth = {
  coral: '#E85D2A',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  coralInput: 'rgba(232,93,42,0.06)',
  bg: '#F2EFE6',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#A09A94',
  divider: '#ECE6DE',
};

export function FylosWordmark({ fontSize = 28 }) {
  return (
    <div
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: fontSize * 0.15,
        fontFamily: '"Nunito", sans-serif',
      }}
    >
      <span
        style={{
          fontSize,
          fontWeight: 800,
          color: TAuth.text,
          letterSpacing: '-0.5px',
          lineHeight: 1,
        }}
      >
        FYLOS
      </span>
      <div
        style={{
          width: fontSize * 0.25,
          height: fontSize * 0.25,
          borderRadius: '50%',
          backgroundColor: TAuth.coral,
        }}
      />
    </div>
  );
}

export default function AuthShell({
  onBack,
  heroSrc,
  heroAlt = '',
  heroHeight = 240,
  tagline,
  eyebrow,
  title,
  subtitle,
  children,
  footer,
}) {
  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased">
      <div
        className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200"
        style={{
          background: TAuth.bg,
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        {/* Dynamic Island */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        <style>{`
          @keyframes auth-fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes auth-fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>

        {/* Header — back button only (no title; the hero carries identity) */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px 16px 8px',
            position: 'relative',
            zIndex: 5,
            minHeight: 52,
          }}
        >
          {onBack ? (
            <button
              onClick={onBack}
              aria-label="Back"
              style={{
                width: 36,
                height: 36,
                borderRadius: '50%',
                background: TAuth.coralSoft,
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ChevronLeft size={18} color={TAuth.coralDark} />
            </button>
          ) : (
            <div style={{ width: 36 }} />
          )}
        </div>

        {/* Scroll area — vertically centers the full stack so the screen
            doesn't feel top-heavy with empty space below the form. */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            padding: heroSrc ? '0 24px 28px' : '24px 24px 28px',
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {/* Hero watercolor (optional) */}
          {heroSrc && (
            <div
              style={{
                width: '100%',
                height: heroHeight,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'auth-fadeIn 600ms ease-out both',
              }}
            >
              <img
                src={heroSrc}
                alt={heroAlt}
                style={{
                  maxWidth: '100%',
                  maxHeight: '100%',
                  objectFit: 'contain',
                }}
              />
            </div>
          )}

          {/* FYLOS wordmark + tagline.
              No-hero layout leans on a larger wordmark to anchor the page. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              marginTop: heroSrc ? -4 : 0,
              animation: 'auth-fadeUp 600ms 80ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
            }}
          >
            <FylosWordmark fontSize={heroSrc ? 28 : 40} />
            {tagline && (
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 600,
                  color: TAuth.coral,
                  letterSpacing: '0.02em',
                  fontFamily: 'Inter, -apple-system, sans-serif',
                }}
              >
                {tagline}
              </div>
            )}
          </div>

          {/* Eyebrow + title + subtitle */}
          {(eyebrow || title || subtitle) && (
            <div
              style={{
                textAlign: 'center',
                marginTop: 18,
                animation: 'auth-fadeUp 600ms 160ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
              }}
            >
              {eyebrow && (
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 700,
                    letterSpacing: '0.10em',
                    color: TAuth.coral,
                    textTransform: 'uppercase',
                    marginBottom: 6,
                  }}
                >
                  {eyebrow}
                </div>
              )}
              {title && (
                <h1
                  style={{
                    fontFamily: '"Nunito", sans-serif',
                    fontSize: 24,
                    fontWeight: 800,
                    color: TAuth.text,
                    letterSpacing: '-0.015em',
                    lineHeight: 1.15,
                    marginBottom: subtitle ? 6 : 0,
                  }}
                >
                  {title}
                </h1>
              )}
              {subtitle && (
                <p
                  style={{
                    fontSize: 13.5,
                    color: TAuth.textMuted,
                    lineHeight: 1.5,
                    maxWidth: 300,
                    margin: '0 auto',
                  }}
                >
                  {subtitle}
                </p>
              )}
            </div>
          )}

          {/* Form slot */}
          <div
            style={{
              marginTop: 18,
              animation: 'auth-fadeUp 600ms 240ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
            }}
          >
            {children}
          </div>

          {/* Footer cross-link — sits right under the form so the stack
              reads as one centered block, not split with a bottom-pinned link. */}
          {footer && (
            <div
              style={{
                textAlign: 'center',
                marginTop: 22,
                fontSize: 12.5,
                color: TAuth.textTertiary,
                animation: 'auth-fadeUp 600ms 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
              }}
            >
              {footer}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthInput — coral-soft pill input.
   ────────────────────────────────────────────────────────────────────── */
export function AuthInput({
  icon,
  trailing,
  value,
  onChange,
  type = 'text',
  placeholder,
  autoComplete,
  inputMode,
  autoFocus,
  onFocus,
  onBlur,
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        height: 52,
        padding: '0 16px',
        background: TAuth.coralInput,
        border: '1px solid transparent',
        borderRadius: 14,
        transition: 'border-color 180ms ease, background 180ms ease',
      }}
    >
      {icon && (
        <span
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: TAuth.coral,
            flexShrink: 0,
          }}
        >
          {icon}
        </span>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        autoFocus={autoFocus}
        onFocus={onFocus}
        onBlur={onBlur}
        style={{
          flex: 1,
          border: 'none',
          outline: 'none',
          background: 'transparent',
          fontSize: 15,
          fontWeight: 500,
          color: TAuth.text,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      />
      {trailing}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthCta — coral pill, identical sizing to onboarding CTA.
   ────────────────────────────────────────────────────────────────────── */
export function AuthCta({ children, onClick, disabled, type = 'button' }) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      style={{
        width: '100%',
        height: 54,
        borderRadius: 27,
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: 15.5,
        background: TAuth.coral,
        boxShadow: disabled ? 'none' : '0 6px 18px rgba(232,93,42,0.30)',
        fontFamily: 'inherit',
        opacity: disabled ? 0.45 : 1,
        transition: 'opacity 180ms ease, transform 120ms ease',
      }}
    >
      {children}
    </button>
  );
}
