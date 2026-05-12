import React from 'react';
import { ChevronLeft, MessageSquare, Loader2 } from 'lucide-react';

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

        {/* Header — back button only, padded down so it clears the
            Dynamic Island instead of sitting in front of it. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            padding: '52px 16px 12px',
            position: 'relative',
            zIndex: 5,
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

        {/* Scroll area — wordmark anchored near the top, the rest of the
            stack (title → form → footer) centered in the space below. */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: heroSrc ? '0 24px 28px' : '0 24px 28px',
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

          {/* Top region: FYLOS wordmark + tagline, anchored near the top
              so the brand sits high (less empty space above it). */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 6,
              paddingTop: heroSrc ? 0 : 4,
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

          {/* Middle region: title + form + footer stack right under the
              wordmark, with empty space falling naturally at the bottom. */}
          <div
            style={{
              flex: 1,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              paddingTop: 28,
              paddingBottom: 4,
            }}
          >
            {(eyebrow || title || subtitle) && (
              <div
                style={{
                  textAlign: 'center',
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

            {/* Footer cross-link — sits right under the form. */}
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
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthInput — coral-soft pill input with optional error state.
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
  maxLength,
  onFocus,
  onBlur,
  error,
}) {
  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 52,
          padding: '0 16px',
          background: TAuth.coralInput,
          border: error ? `1px solid ${TAuth.coral}` : '1px solid transparent',
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
          maxLength={maxLength}
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
      {error && (
        <div
          style={{
            fontSize: 11.5,
            color: TAuth.coralDark,
            marginTop: 4,
            paddingLeft: 12,
            fontWeight: 600,
            animation: 'auth-fadeIn 200ms ease both',
          }}
        >
          {error}
        </div>
      )}
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthCta — coral pill with optional loading spinner.
   ────────────────────────────────────────────────────────────────────── */
export function AuthCta({ children, onClick, disabled, loading, type = 'button' }) {
  const isDown = disabled || loading;
  return (
    <button
      type={type}
      onClick={loading ? undefined : onClick}
      disabled={isDown}
      style={{
        width: '100%',
        height: 54,
        borderRadius: 27,
        border: 'none',
        cursor: isDown ? 'not-allowed' : 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        color: '#FFFFFF',
        fontWeight: 700,
        fontSize: 15.5,
        background: TAuth.coral,
        boxShadow: isDown ? 'none' : '0 6px 18px rgba(232,93,42,0.30)',
        fontFamily: 'inherit',
        opacity: loading ? 0.85 : disabled ? 0.45 : 1,
        transition: 'opacity 180ms ease, transform 120ms ease',
      }}
    >
      {loading ? (
        <>
          <Loader2 size={17} className="animate-spin" strokeWidth={2.6} />
          One sec…
        </>
      ) : (
        children
      )}
    </button>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   SSO row — Apple / Google / SMS. Coral-soft cards so they sit visually
   below the primary CTA (clearly secondary, but readable).
   ────────────────────────────────────────────────────────────────────── */

function AppleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="#111" aria-hidden="true">
      <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35-4.71-4.85-4.16-12.39 1.39-12.67 1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 6.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function GoogleIcon({ size = 18 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 18 18" aria-hidden="true">
      <path d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 01-1.8 2.72v2.26h2.92a8.78 8.78 0 002.68-6.62z" fill="#4285F4" />
      <path d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.26c-.8.54-1.83.86-3.04.86-2.34 0-4.33-1.58-5.04-3.71H.96v2.33A9 9 0 009 18z" fill="#34A853" />
      <path d="M3.96 10.71A5.41 5.41 0 013.68 9c0-.6.1-1.17.28-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.82.96 4.04l3-2.33z" fill="#FBBC05" />
      <path d="M9 3.58c1.32 0 2.5.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 00.96 4.96l3 2.33C4.67 5.16 6.66 3.58 9 3.58z" fill="#EA4335" />
    </svg>
  );
}

function SsoButton({ icon, label, onClick, ariaLabel }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={ariaLabel || label}
      style={{
        flex: 1,
        height: 48,
        background: TAuth.coralInput,
        border: '1px solid transparent',
        borderRadius: 14,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 7,
        cursor: 'pointer',
        fontFamily: 'inherit',
        transition: 'background 180ms ease, transform 120ms ease',
      }}
    >
      {icon}
      <span
        style={{
          fontSize: 12.5,
          color: TAuth.text,
          fontWeight: 600,
        }}
      >
        {label}
      </span>
    </button>
  );
}

export function AuthSsoRow({ onApple, onGoogle, onPhone, label = 'or' }) {
  return (
    <div style={{ marginTop: 18 }}>
      {/* Divider with label */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          marginBottom: 14,
        }}
      >
        <div style={{ flex: 1, height: 1, background: TAuth.divider }} />
        <span
          style={{
            fontSize: 11,
            color: TAuth.textTertiary,
            fontWeight: 600,
            letterSpacing: '0.06em',
            textTransform: 'lowercase',
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: TAuth.divider }} />
      </div>
      {/* Buttons */}
      <div style={{ display: 'flex', gap: 10 }}>
        <SsoButton
          icon={<AppleIcon />}
          label="Apple"
          ariaLabel="Continue with Apple"
          onClick={onApple}
        />
        <SsoButton
          icon={<GoogleIcon />}
          label="Google"
          ariaLabel="Continue with Google"
          onClick={onGoogle}
        />
        <SsoButton
          icon={<MessageSquare size={17} color={TAuth.coral} strokeWidth={2.2} />}
          label="Text"
          ariaLabel="Continue with SMS"
          onClick={onPhone}
        />
      </div>
    </div>
  );
}
