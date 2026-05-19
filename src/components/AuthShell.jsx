import React, { useState, useEffect } from 'react';
import { ChevronLeft, MessageSquare, Loader2, HelpCircle, X, Mail, ExternalLink } from 'lucide-react';

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

export function FylosWordmark({ text = 'FYLOS', fontSize = 28 }) {
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
        {text}
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

/* Bilingual brand lockup — handwritten watercolor φίλος above the
   typeset FYLOS wordmark. The Greek line uses the actual onboarding
   asset so the etymology reads in its hand-painted brand voice. */
export function FylosBilingualLockup({ fontSize = 32, gap = 10 }) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap,
      }}
    >
      <img
        src="/onboarding/philos.png"
        alt="φίλος"
        style={{
          height: fontSize * 1.15,
          width: 'auto',
          display: 'block',
        }}
      />
      <FylosWordmark text="FYLOS" fontSize={fontSize} />
    </div>
  );
}

export default function AuthShell({
  onBack,
  showHelp = false,
  helpTitle = 'How can we help?',
  helpTopics = [],
  heroSrc,
  heroAlt = '',
  heroHeight = 240,
  tagline, // accepted for backward compat, no longer rendered
  eyebrow,
  title,
  subtitle,
  children,
  secondaryActions,
  footer,
  overlays,
}) {
  const [helpOpen, setHelpOpen] = useState(false);

  // ESC to close help
  useEffect(() => {
    if (!helpOpen) return undefined;
    const handler = (e) => e.key === 'Escape' && setHelpOpen(false);
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [helpOpen]);

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
        {/* Dynamic Island — z-[300] keeps it above every overlay/sheet
            so the device chrome always reads as part of the surface. */}
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[300] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700;800&display=swap');

          @keyframes auth-fadeUp {
            from { opacity: 0; transform: translateY(8px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes auth-fadeIn {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
        `}</style>

        {/* Header — back button left, optional help button right.
            Padded down so the buttons clear the Dynamic Island. */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
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
          {showHelp ? (
            <button
              onClick={() => setHelpOpen(true)}
              aria-label="Help"
              style={{
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: TAuth.coralDark,
              }}
            >
              <HelpCircle size={22} strokeWidth={2} />
            </button>
          ) : (
            <div style={{ width: 36 }} />
          )}
        </div>

        {/* Scroll area — top half reserved for a future hero image, all
            text + form + SSO docked to the bottom half. */}
        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            padding: '0 24px 28px',
            overflowY: 'auto',
            minHeight: 0,
          }}
        >
          {/* Top group — bilingual brand lockup + tagline below it,
              with comfortable breathing room from the header. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 14,
              paddingTop: 20,
              animation: 'auth-fadeIn 600ms ease-out both',
            }}
          >
            {heroSrc ? (
              <img
                src={heroSrc}
                alt={heroAlt}
                style={{
                  maxWidth: '100%',
                  maxHeight: heroHeight,
                  objectFit: 'contain',
                }}
              />
            ) : (
              <FylosBilingualLockup fontSize={32} />
            )}
          </div>

          {/* Middle zone — title + form, stacked right under the brand
              lockup. No flex-grow so the alt-paths block below sits
              naturally right under the last form element. */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              paddingTop: 52,
            }}
          >
            {(eyebrow || title || subtitle) && (
              <div
                style={{
                  textAlign: 'center',
                  marginTop: 0,
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
                      fontFamily: '"Playfair Display", "Georgia", serif',
                      fontSize: 28,
                      fontWeight: 700,
                      color: TAuth.text,
                      letterSpacing: '-0.01em',
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
                      fontFamily: 'Inter, -apple-system, sans-serif',
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
          </div>

          {/* Alt-paths block — SSO + footer flowing right under the form,
              no bottom-docking. Empty space falls naturally at the
              bottom of the frame. */}
          {(secondaryActions || footer) && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: 4,
              }}
            >
              {secondaryActions && (
                <div
                  style={{
                    animation: 'auth-fadeUp 600ms 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
                  }}
                >
                  {secondaryActions}
                </div>
              )}
              {footer && (
                <div
                  style={{
                    textAlign: 'center',
                    marginTop: secondaryActions ? 16 : 28,
                    fontSize: 12.5,
                    color: TAuth.textTertiary,
                    animation: 'auth-fadeUp 600ms 380ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
                  }}
                >
                  {footer}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Help sheet — rendered inside the iPhone frame so it overlays
            only the device surface, not the surrounding desktop chrome. */}
        <AuthHelpSheet
          open={helpOpen}
          onClose={() => setHelpOpen(false)}
          title={helpTitle}
          topics={helpTopics}
        />

        {/* Extra sheets / overlays — rendered inside the iPhone frame
            so absolute positioning attaches to the device surface. */}
        {overlays}
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
          height: 54,
          padding: '0 18px',
          background: '#FFFFFF',
          border: error ? `1px solid ${TAuth.coral}` : '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow: '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
          transition: 'border-color 180ms ease, box-shadow 180ms ease',
        }}
      >
        {icon && (
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#9C8E84',
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
        width: '100%',
        height: 52,
        background: '#FFFFFF',
        border: '1px solid rgba(60,30,15,0.04)',
        borderRadius: 16,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        cursor: 'pointer',
        fontFamily: 'inherit',
        fontSize: 14.5,
        fontWeight: 600,
        color: TAuth.text,
        boxShadow: '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
        transition: 'transform 120ms ease, box-shadow 180ms ease',
        padding: '0 16px',
      }}
    >
      {icon}
      <span>{label}</span>
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
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}
        >
          {label}
        </span>
        <div style={{ flex: 1, height: 1, background: TAuth.divider }} />
      </div>
      {/* Full-width stacked SSO buttons — Apple first, then Google.
          Fills the bottom of the screen with visual weight. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <SsoButton
          icon={<AppleIcon size={18} />}
          label="Continue with Apple"
          onClick={onApple}
        />
        <SsoButton
          icon={<GoogleIcon size={18} />}
          label="Continue with Google"
          onClick={onGoogle}
        />
        {onPhone && (
          <SsoButton
            icon={<MessageSquare size={17} color={TAuth.coral} strokeWidth={2.2} />}
            label="Continue with SMS"
            onClick={onPhone}
          />
        )}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthHelpSheet — bottom sheet that pops up when the "?" is tapped.
   Cream surface, coral accents, watercolor-soft shadow. Matches the
   rest of the auth surface so it feels like an extension of the page,
   not a generic system dialog.
   ────────────────────────────────────────────────────────────────────── */
export function AuthHelpSheet({ open, onClose, title = 'How can we help?', topics = [] }) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,30,15,0.38)',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        zIndex: 200,
        animation: 'authHelpFade 220ms ease both',
      }}
    >
      <style>{`
        @keyframes authHelpFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes authHelpSlide {
          from { transform: translateY(100%); }
          to   { transform: translateY(0); }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: TAuth.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '14px 24px 28px',
          boxShadow: '0 -8px 28px rgba(60,30,15,0.18)',
          animation: 'authHelpSlide 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 44,
            height: 4,
            borderRadius: 2,
            background: 'rgba(60,30,15,0.16)',
            margin: '0 auto 18px',
          }}
        />

        <h2
          style={{
            fontFamily: '"Playfair Display", "Georgia", serif',
            fontSize: 24,
            fontWeight: 700,
            color: TAuth.text,
            letterSpacing: '-0.01em',
            lineHeight: 1.15,
            margin: 0,
            textAlign: 'center',
          }}
        >
          {title}
        </h2>

        {/* FAQ topics — Q in bold, A below, one per white card */}
        {topics.length > 0 && (
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: 10,
              marginTop: 18,
            }}
          >
            {topics.map((t, i) => (
              <HelpTopic key={i} q={t.q} a={t.a} />
            ))}
          </div>
        )}

        {/* Contact footer — quiet line + email button */}
        <div
          style={{
            marginTop: topics.length > 0 ? 22 : 18,
            paddingTop: topics.length > 0 ? 18 : 0,
            borderTop: topics.length > 0 ? `1px dashed ${TAuth.divider}` : 'none',
            textAlign: 'center',
          }}
        >
          <p
            style={{
              fontSize: 13,
              color: TAuth.textMuted,
              lineHeight: 1.5,
              margin: '0 0 12px',
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            Need more help? We're here.
          </p>
          <a
            href="mailto:hello@fylos.me"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              minWidth: 180,
              height: 46,
              padding: '0 22px',
              borderRadius: 23,
              background: TAuth.coral,
              color: '#FFFFFF',
              fontSize: 14.5,
              fontWeight: 700,
              textDecoration: 'none',
              boxShadow: '0 6px 18px rgba(232,93,42,0.28)',
              fontFamily: 'inherit',
            }}
          >
            <Mail size={16} strokeWidth={2.4} />
            Email us
          </a>

          <button
            onClick={onClose}
            style={{
              display: 'block',
              margin: '14px auto 0',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              color: TAuth.textTertiary,
              fontFamily: 'inherit',
              padding: '6px 14px',
              letterSpacing: '0.02em',
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function HelpTopic({ q, a }) {
  return (
    <div
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(60,30,15,0.04)',
        borderRadius: 14,
        padding: '12px 16px',
        boxShadow: '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
      }}
    >
      <div
        style={{
          fontSize: 13.5,
          fontWeight: 700,
          color: TAuth.text,
          lineHeight: 1.35,
          marginBottom: 4,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        {q}
      </div>
      <div
        style={{
          fontSize: 12.5,
          color: TAuth.textMuted,
          lineHeight: 1.5,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        {a}
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────────────────────────────────
   AuthDocSheet — bottom sheet for long-form content (Terms, Privacy).
   Same cream + coral language as the help sheet, but with a scrollable
   body for sections + paragraphs and a sticky close at the bottom.
   ────────────────────────────────────────────────────────────────────── */
export function AuthDocSheet({
  open,
  onClose,
  title,
  sections = [],
  fullVersionUrl,
}) {
  if (!open) return null;
  return (
    <div
      onClick={onClose}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'rgba(60,30,15,0.42)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 200,
        padding: 22,
        animation: 'authDocFade 220ms ease both',
      }}
    >
      <style>{`
        @keyframes authDocFade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes authDocPop {
          from { opacity: 0; transform: scale(0.94) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: 320,
          maxHeight: '78vh',
          background: TAuth.bg,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.06), 0 22px 48px rgba(60,30,15,0.22)',
          animation:
            'authDocPop 320ms cubic-bezier(0.34, 1.4, 0.64, 1) both',
        }}
      >
        {/* Single scrollable container. Title at top and the action
            block at the bottom use position: sticky with a translucent
            cream + backdrop-blur, so content slides behind them
            frosted-glass style — visible but softened. */}
        <div
          style={{
            maxHeight: '78vh',
            overflowY: 'auto',
          }}
        >
          <div
            style={{
              position: 'sticky',
              top: 0,
              zIndex: 2,
              padding: '20px 22px 12px',
              background: 'rgba(242, 239, 230, 0.78)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            }}
          >
            <h2
              style={{
                fontFamily: '"Playfair Display", "Georgia", serif',
                fontSize: 22,
                fontWeight: 700,
                color: TAuth.text,
                letterSpacing: '-0.01em',
                lineHeight: 1.15,
                margin: 0,
                textAlign: 'center',
              }}
            >
              {title}
            </h2>
          </div>

          <div style={{ padding: '4px 22px 14px' }}>
            {sections.map((section, i) => (
              <div key={i} style={{ marginTop: i === 0 ? 0 : 14 }}>
                <h3
                  style={{
                    fontFamily: 'Inter, -apple-system, sans-serif',
                    fontSize: 13.5,
                    fontWeight: 700,
                    color: TAuth.text,
                    margin: '0 0 6px',
                    lineHeight: 1.3,
                  }}
                >
                  {section.heading}
                </h3>
                {section.paragraphs.map((p, j) => (
                  <p
                    key={j}
                    style={{
                      fontSize: 13,
                      color: TAuth.textMuted,
                      lineHeight: 1.55,
                      margin: '0 0 6px',
                      fontFamily: 'Inter, -apple-system, sans-serif',
                    }}
                  >
                    {p}
                  </p>
                ))}
              </div>
            ))}
          </div>

          <div
            style={{
              position: 'sticky',
              bottom: 0,
              zIndex: 2,
              padding: '12px 22px 18px',
              background: 'rgba(242, 239, 230, 0.78)',
              backdropFilter: 'blur(14px) saturate(140%)',
              WebkitBackdropFilter: 'blur(14px) saturate(140%)',
            }}
          >
            {fullVersionUrl && (
              <div style={{ textAlign: 'center', marginBottom: 12 }}>
                <a
                  href={fullVersionUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 6,
                    color: TAuth.coral,
                    fontSize: 12.5,
                    fontWeight: 600,
                    textDecoration: 'none',
                    fontFamily: 'inherit',
                  }}
                >
                  Read the full version
                  <ExternalLink size={13} strokeWidth={2.2} />
                </a>
              </div>
            )}
            <button
              onClick={onClose}
              style={{
                width: '100%',
                height: 44,
                borderRadius: 22,
                background: TAuth.coral,
                color: '#FFFFFF',
                fontSize: 14,
                fontWeight: 700,
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 6px 18px rgba(232,93,42,0.28)',
                fontFamily: 'inherit',
              }}
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
