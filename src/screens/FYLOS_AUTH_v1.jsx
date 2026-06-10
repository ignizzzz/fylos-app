/* ════════════════════════════════════════════════════════════════════════
   FYLOS_AUTH_v1.jsx — the entire auth flow in one file.

   Read order if you're new to this:
     1. THEME           — TAuth color tokens
     2. BRAND LOCKUP    — FylosWordmark, FylosBilingualLockup
     3. SHELL           — AuthShell (the iPhone-frame wrapper)
     4. PRIMITIVES      — AuthInput, AuthCta
     5. SSO ROW         — AuthSsoRow + Apple / Google icons
     6. SHEETS          — AuthHelpSheet (FAQ), AuthDocSheet (Terms/Privacy)
     7. SCREENS         — SignIn · SignInPassword · SignInPhone
                          CreateAccountV2 · ForgotPassword · VerifyEmail
                          ProfileCompletion (+ ProfilePrompt + ProfileSheet)

   What's wired vs placeholder:
     · All UI, validation, transitions, loading states (mock 700ms) — wired.
     · Magic-link send, password auth, OTP send/verify, Apple/Google,
       email-verify-link handlers, reset-link handlers — PLACEHOLDERS
       (look for "Placeholder" comments). Backend wiring goes there.
     · Support email: hello@fylos.me.

   Routes (wired in src/App.jsx, all default-import from this file by name):
     /sign-in            · SignIn
     /sign-in-password   · SignInPassword
     /sign-in-phone      · SignInPhone
     /create-account     · CreateAccountV2 (two-step wizard)
     /forgot-password    · ForgotPassword
     /verify-email       · VerifyEmail   (reads ?email from router state)
     /welcome            · ProfileCompletion (post-auth onboarding nudge)

   ──────────────────────────────────────────────────────────────────────── */

import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  Camera,
  Check,
  ChevronLeft,
  ExternalLink,
  Eye,
  EyeOff,
  HelpCircle,
  Loader2,
  Lock,
  Mail,
  MailCheck,
  MapPin,
  MessageSquare,
  Phone,
  User,
  X,
} from 'lucide-react';

/* ════════════════════════════════════════════════════════════════════════
   1.  THEME
   ════════════════════════════════════════════════════════════════════════ */

// Unified flow: mark the session as signed-in so / opens the app directly.
const setAuthed = () => { try { window.localStorage.setItem('fylos.auth', '1'); } catch (e) {} };

export const TAuth = {
  coral: '#E85D2A',
  coralDark: '#B85A26',
  coralSoft: '#FFEDE3',
  coralInput: 'rgba(232,93,42,0.06)',
  bg: '#F7F5F2',
  card: '#FFFFFF',
  text: '#111111',
  textMuted: '#6E6058',
  textTertiary: '#9B9B9F',
  divider: '#F1EDE8',
};

/* ════════════════════════════════════════════════════════════════════════
   2.  BRAND LOCKUP
   ════════════════════════════════════════════════════════════════════════ */

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

/* ════════════════════════════════════════════════════════════════════════
   3.  SHELL
   The iPhone-frame wrapper every auth screen uses. Handles:
   · Dynamic Island (z-300 so it always sits above any sheet)
   · Back button (when onBack provided) / Help icon (when showHelp set)
   · Brand lockup or optional heroSrc image up top
   · Title + subtitle + form (children)
   · Secondary actions slot (SSO row)
   · Footer cross-link
   · Optional overlays slot (for AuthDocSheet, ProfileSheet, etc.)
   · Built-in AuthHelpSheet, opened by the "?" icon
   ════════════════════════════════════════════════════════════════════════ */

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

        {/* Scroll area — brand at top, content stacks tight below it,
            empty cream falls at the bottom of the frame. */}
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
          {/* Top group — bilingual brand lockup. Hero image swaps in
              if heroSrc is set (used by /sign-in's sent state etc). */}
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

          {/* Middle zone — title + form, stacked right under the brand. */}
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
                  animation:
                    'auth-fadeUp 600ms 160ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
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
                animation:
                  'auth-fadeUp 600ms 240ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
              }}
            >
              {children}
            </div>
          </div>

          {/* Alt-paths block — SSO row + footer cross-link, naturally
              under the form. Empty space falls at the bottom. */}
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
                    animation:
                      'auth-fadeUp 600ms 320ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
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
                    animation:
                      'auth-fadeUp 600ms 380ms cubic-bezier(0.2, 0.7, 0.2, 1) both',
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

        {/* Extra sheets / overlays — Terms, Privacy, ProfileSheet, etc. */}
        {overlays}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════════
   4.  PRIMITIVES — AuthInput, AuthCta
   ════════════════════════════════════════════════════════════════════════ */

/* Coral-soft pill input with optional error state. */
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
          border: error
            ? `1px solid ${TAuth.coral}`
            : '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
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

/* Coral pill with optional loading spinner. */
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

/* ════════════════════════════════════════════════════════════════════════
   5.  SSO ROW
   ════════════════════════════════════════════════════════════════════════ */

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
        boxShadow:
          '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
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
          Phone is opt-in via onPhone. */}
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

/* ════════════════════════════════════════════════════════════════════════
   6.  SHEETS — AuthHelpSheet (FAQ) and AuthDocSheet (Terms/Privacy)
   ════════════════════════════════════════════════════════════════════════ */

/* Help bottom sheet that pops up when the "?" is tapped. Renders the
   per-screen FAQ topics + a single Email us CTA. */
export function AuthHelpSheet({
  open,
  onClose,
  title = 'How can we help?',
  topics = [],
}) {
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

        {/* Contact footer — quiet line + Email us button + Close link */}
        <div
          style={{
            marginTop: topics.length > 0 ? 22 : 18,
            paddingTop: topics.length > 0 ? 18 : 0,
            borderTop:
              topics.length > 0 ? `1px dashed ${TAuth.divider}` : 'none',
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
        boxShadow:
          '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
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

/* Centered popup for long-form content (Terms, Privacy). Floating title
   and Close block sit above a mask-faded scroll. */
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
        @keyframes authDocFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes authDocPop {
          from { opacity: 0; transform: scale(0.94) translateY(6px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
        .auth-doc-scroll::-webkit-scrollbar { display: none; }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 320,
          height: '78vh',
          background: TAuth.bg,
          borderRadius: 22,
          overflow: 'hidden',
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.06), 0 22px 48px rgba(60,30,15,0.22)',
          animation: 'authDocPop 320ms cubic-bezier(0.34, 1.4, 0.64, 1) both',
        }}
      >
        {/* Scroll layer — mask gradient fades content softly at top
            and bottom so it disappears organically behind the floating
            title and Close block. */}
        <div
          className="auth-doc-scroll"
          style={{
            position: 'absolute',
            inset: 0,
            overflowY: 'auto',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
            padding: '66px 22px 116px',
            maskImage:
              'linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 90px), transparent 100%)',
            WebkitMaskImage:
              'linear-gradient(to bottom, transparent 0, black 56px, black calc(100% - 90px), transparent 100%)',
          }}
        >
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

        {/* Floating title — absolute layer above the scroll mask, no
            background, no blur. */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            padding: '20px 22px 10px',
            zIndex: 2,
            pointerEvents: 'none',
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

        {/* Floating bottom block — Read the full version + Close */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '10px 22px 18px',
            zIndex: 2,
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
  );
}

/* ════════════════════════════════════════════════════════════════════════
   7.  SCREENS
   ════════════════════════════════════════════════════════════════════════ */

/* ─────────────── 7a · SignIn (magic-link primary) ──────────────────── */
export function SignIn() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);
  const error = touched && !valid ? 'That looks off. Try again?' : '';

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires this to Supabase / Resend.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <AuthShell
        onBack={() => setSent(false)}
        title="Link sent."
        subtitle={`Tap the link we just sent to ${email} and you're in.`}
        footer={
          <span>
            Didn't land?{' '}
            <span
              onClick={submit}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Resend
            </span>
          </span>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            background: TAuth.coralSoft,
            borderRadius: 14,
            color: TAuth.coralDark,
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <Check size={16} strokeWidth={2.6} />
          On its way.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      showHelp
      helpTopics={[
        {
          q: 'What is a one-tap link?',
          a: "We email a secure link to you. Tap it, and you're in. No password to remember.",
        },
        {
          q: 'How long does it take?',
          a: "Usually under a minute. If it's slower, check your spam folder.",
        },
        {
          q: 'Can I use a password instead?',
          a: "Yes. Tap 'Prefer a password?' below the email field.",
        },
      ]}
      title="Look who's back."
      subtitle="Drop your email. We'll send a one-tap link."
      footer={
        <span>
          First time here?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Create account
          </span>
        </span>
      }
      secondaryActions={
        <AuthSsoRow
          onApple={() => { setAuthed(); navigate('/welcome'); }}
          onGoogle={() => { setAuthed(); navigate('/welcome'); }}
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched) setTouched(false);
          }}
          error={error}
        />

        <AuthCta onClick={submit} disabled={!valid && touched} loading={loading}>
          Ping me a link
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>

        <button
          onClick={() => navigate('/sign-in-password')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: TAuth.textTertiary,
            padding: '4px 8px',
            margin: '2px auto 0',
            fontFamily: 'inherit',
          }}
        >
          Prefer a password?
        </button>
      </div>
    </AuthShell>
  );
}

/* ─────────────── 7b · SignInPassword ──────────────────────────────── */
export function SignInPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const errors = {
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'That looks off. Try again?' : '',
    password: form.password.length < 6 ? 'Six characters minimum.' : '',
  };
  const valid = !errors.email && !errors.password;

  const submit = () => {
    setTouched({ email: true, password: true });
    if (!valid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires real auth here.
    setTimeout(() => {
      setLoading(false);
      setAuthed();
      navigate('/');
    }, 700);
  };

  const onField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (touched[field]) setTouched({ ...touched, [field]: false });
  };

  return (
    <AuthShell
      onBack={() => navigate('/sign-in')}
      showHelp
      helpTopics={[
        {
          q: 'Forgot your password?',
          a: "Tap 'Forgot it?' under the password field. We'll email a reset link.",
        },
        {
          q: 'Prefer no password at all?',
          a: "Tap 'Prefer a link?' under Sign in. We'll email a magic link instead.",
        },
        {
          q: 'Why are Apple and Google here?',
          a: "If you used one of them to make your account, tap it to sign in without typing anything.",
        },
      ]}
      title="Welcome back."
      subtitle="Email and password. Old school but it works."
      footer={
        <span>
          First time here?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Create account
          </span>
        </span>
      }
      secondaryActions={
        <AuthSsoRow
          onApple={() => { setAuthed(); navigate('/welcome'); }}
          onGoogle={() => { setAuthed(); navigate('/welcome'); }}
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={form.email}
          onChange={onField('email')}
          error={touched.email ? errors.email : ''}
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="current-password"
          placeholder="Password"
          value={form.password}
          onChange={onField('password')}
          error={touched.password ? errors.password : ''}
          trailing={
            <button
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: TAuth.textTertiary,
                display: 'flex',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />

        {/* Forgot password — small, right-aligned under password */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4 }}>
          <button
            onClick={() => navigate('/forgot-password')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: TAuth.coral,
              fontWeight: 600,
              padding: '4px 4px',
              fontFamily: 'inherit',
            }}
          >
            Forgot it?
          </button>
        </div>

        <div style={{ marginTop: 4 }}>
          <AuthCta
            onClick={submit}
            disabled={!valid && (touched.email || touched.password)}
            loading={loading}
          >
            Sign in
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
        </div>

        <button
          onClick={() => navigate('/sign-in')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: TAuth.textTertiary,
            padding: '4px 8px',
            margin: '2px auto 0',
            fontFamily: 'inherit',
          }}
        >
          Prefer a link?
        </button>
      </div>
    </AuthShell>
  );
}

/* ─────────────── 7c · SignInPhone (SMS OTP) ────────────────────────── */
const PHONE_RE = /^[+]?[\d\s()-]{8,}$/;

function OtpInput({ value, onChange }) {
  const inputsRef = useRef([]);
  const digits = (value + '      ').slice(0, 6).split('');

  const setDigit = (i, char) => {
    const next = value.split('');
    next[i] = char;
    const joined = next.join('').replace(/\s/g, '').slice(0, 6);
    onChange(joined);
  };

  const handleChange = (i, e) => {
    const char = (e.target.value || '').replace(/\D/g, '').slice(-1);
    if (!char) return;
    setDigit(i, char);
    if (i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handleKeyDown = (i, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[i]) {
        const next = value.slice(0, i) + value.slice(i + 1);
        onChange(next.padEnd(i, ''));
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const next = value.slice(0, i - 1) + value.slice(i);
        onChange(next);
      }
    }
    if (e.key === 'ArrowLeft' && i > 0) inputsRef.current[i - 1]?.focus();
    if (e.key === 'ArrowRight' && i < 5) inputsRef.current[i + 1]?.focus();
  };

  const handlePaste = (e) => {
    const pasted = (e.clipboardData.getData('text') || '')
      .replace(/\D/g, '')
      .slice(0, 6);
    if (pasted) {
      e.preventDefault();
      onChange(pasted);
      inputsRef.current[Math.min(pasted.length, 5)]?.focus();
    }
  };

  return (
    <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          inputMode="numeric"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digits[i].trim()}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={i === 0 ? handlePaste : undefined}
          style={{
            width: 44,
            height: 56,
            textAlign: 'center',
            fontSize: 22,
            fontWeight: 700,
            color: TAuth.text,
            background: TAuth.coralInput,
            border: '1px solid transparent',
            borderRadius: 12,
            outline: 'none',
            fontFamily: 'Inter, -apple-system, sans-serif',
          }}
        />
      ))}
    </div>
  );
}

export function SignInPhone() {
  const navigate = useNavigate();
  const [step, setStep] = useState('phone'); // 'phone' | 'code'
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);

  const phoneValid = PHONE_RE.test(phone);
  const codeValid = code.length === 6;
  const phoneError = touched && !phoneValid ? 'Use a real number, please.' : '';

  const sendCode = () => {
    setTouched(true);
    if (!phoneValid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires Twilio (or similar). SMS to GR
    // numbers is ~$0.05+ per text; rate-limit server-side + captcha.
    setTimeout(() => {
      setLoading(false);
      setStep('code');
    }, 700);
  };

  const verify = () => {
    if (!codeValid) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setAuthed();
      navigate('/');
    }, 500);
  };

  if (step === 'code') {
    return (
      <AuthShell
        onBack={() => setStep('phone')}
        title="Pop in the code."
        subtitle={`We just texted a six-digit code to ${phone}.`}
        footer={
          <span>
            Didn't land?{' '}
            <span
              onClick={sendCode}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Resend
            </span>
          </span>
        }
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <OtpInput value={code} onChange={setCode} />
          <AuthCta onClick={verify} disabled={!codeValid} loading={loading}>
            Sign in
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
          <button
            onClick={() => navigate('/sign-in')}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontSize: 12.5,
              color: TAuth.textTertiary,
              padding: '4px 8px',
              margin: '0 auto',
              fontFamily: 'inherit',
            }}
          >
            Use email instead
          </button>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      onBack={() => navigate('/sign-in')}
      showHelp
      helpTopics={[
        {
          q: 'How does the code work?',
          a: "We text a 6-digit code to your number. Type it in and you're signed in.",
        },
        {
          q: 'Do I get charged?',
          a: 'Your carrier may charge standard SMS rates for the text.',
        },
        {
          q: 'Prefer email?',
          a: "Tap 'Use email instead' to switch to the one-tap link.",
        },
      ]}
      title="Got a phone?"
      subtitle="Drop your number and we'll text a six-digit code."
      footer={
        <span>
          First time here?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Create account
          </span>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          icon={<Phone size={17} strokeWidth={2.2} />}
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+30 690 000 0000"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            if (touched) setTouched(false);
          }}
          error={phoneError}
        />
        <AuthCta onClick={sendCode} disabled={!phoneValid && touched} loading={loading}>
          Send code
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>
        <button
          onClick={() => navigate('/sign-in')}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: TAuth.textTertiary,
            padding: '4px 8px',
            margin: '2px auto 0',
            fontFamily: 'inherit',
          }}
        >
          Use email instead
        </button>
      </div>
    </AuthShell>
  );
}

/* ─────────────── 7d · CreateAccountV2 (two-step wizard) ────────────── */
const CREATE_STEP_COUNT = 2;

const TERMS_SECTIONS = [
  {
    heading: 'Welcome',
    paragraphs: [
      "By using Fylos, you agree to these terms. We've kept them short. Read them when you have a minute.",
    ],
  },
  {
    heading: 'Your account',
    paragraphs: [
      "You're responsible for the email and password (or the Apple/Google account) tied to your Fylos profile. Keep them safe.",
    ],
  },
  {
    heading: 'How you use Fylos',
    paragraphs: [
      "Fylos is for personal pet care. Don't use it for spam, abuse, or to harm others.",
      "If you're a service provider (walker, vet, etc.), there's a separate Pro account for that.",
    ],
  },
  {
    heading: 'Your content',
    paragraphs: [
      "You own everything you add: pet info, photos, notes. We protect it. See our Privacy Policy for the details.",
    ],
  },
  {
    heading: 'Ending your account',
    paragraphs: [
      "You can close your Fylos account anytime from Settings. Your data goes with it.",
    ],
  },
  {
    heading: 'Changes',
    paragraphs: [
      "We may update these terms occasionally. When something changes that affects you, we'll let you know.",
    ],
  },
  {
    heading: 'Questions',
    paragraphs: ['Reach us at hello@fylos.me.'],
  },
];

const PRIVACY_SECTIONS = [
  {
    heading: 'What we collect',
    paragraphs: [
      'Your name, email, and anything you add about your pets: names, health records, photos, notes.',
    ],
  },
  {
    heading: 'How we use it',
    paragraphs: ["To make the app work for you and your pets. We don't sell your data."],
  },
  {
    heading: 'Sharing',
    paragraphs: [
      'We only share what you choose to share. Vet visits with vets, walks with walkers. Nothing leaves Fylos without your tap.',
    ],
  },
  {
    heading: 'Where it lives',
    paragraphs: ['Encrypted on EU and US servers, protected by industry standards.'],
  },
  {
    heading: 'Your rights',
    paragraphs: [
      'You can see, edit, or delete your data anytime. Just ask, or do it yourself in Settings.',
    ],
  },
  {
    heading: 'Cookies',
    paragraphs: ['We use the bare minimum. Just enough to keep you signed in.'],
  },
  {
    heading: 'Questions',
    paragraphs: ['Reach us at hello@fylos.me.'],
  },
];

function CreateStepDots({ step }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        marginBottom: 20,
        height: 8,
      }}
    >
      {Array.from({ length: CREATE_STEP_COUNT }).map((_, i) => {
        const active = i === step - 1;
        return (
          <div
            key={i}
            style={{
              width: active ? 6 : 14,
              height: active ? 6 : 2,
              borderRadius: active ? '50%' : 1,
              background: active ? TAuth.coral : 'rgba(60,30,15,0.22)',
              transition: 'all 320ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          />
        );
      })}
    </div>
  );
}

export function CreateAccountV2() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirm: '',
  });
  const [touched, setTouched] = useState({
    firstName: false,
    lastName: false,
    email: false,
    password: false,
    confirm: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [privacyOpen, setPrivacyOpen] = useState(false);

  const errors = {
    firstName: form.firstName.trim().length < 2 ? 'Two letters at least.' : '',
    lastName: form.lastName.trim().length < 2 ? 'Two letters at least.' : '',
    email: !/\S+@\S+\.\S+/.test(form.email) ? 'That looks off. Try again?' : '',
    password: form.password.length < 6 ? 'Six characters minimum.' : '',
    confirm:
      form.confirm.length > 0 && form.confirm !== form.password
        ? "Passwords don't match yet."
        : '',
  };

  const step1Valid = !errors.firstName && !errors.lastName;
  const step2Valid =
    !errors.email &&
    !errors.password &&
    !errors.confirm &&
    form.confirm.length > 0;

  const onField = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
    if (touched[field]) setTouched({ ...touched, [field]: false });
  };

  const nextStep = () => {
    setTouched({ ...touched, firstName: true, lastName: true });
    if (!step1Valid) return;
    setStep(2);
  };

  const submit = () => {
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      password: true,
      confirm: true,
    });
    if (!step1Valid || !step2Valid) return;
    setLoading(true);
    // Placeholder. Panagiotis wires real signup.
    setTimeout(() => {
      setLoading(false);
      navigate('/verify-email', { state: { email: form.email } });
    }, 700);
  };

  /* ───── Step 1 — name + SSO ───── */
  if (step === 1) {
    return (
      <AuthShell
        showHelp
        helpTopics={[
          {
            q: 'Why first and last name?',
            a: "It helps us address you properly and keeps things clean on your profile. Everything else (pet info, address) waits until you're inside the app.",
          },
          {
            q: 'Can I sign up with Apple or Google instead?',
            a: 'Yes. Tap one of the buttons below and skip the typing.',
          },
        ]}
        title="Hi, friend."
        subtitle="Let's start with your name."
        footer={
          <span>
            Already with us?{' '}
            <span
              onClick={() => navigate('/sign-in')}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Sign in
            </span>
          </span>
        }
        secondaryActions={
          <AuthSsoRow
            onApple={() => { setAuthed(); navigate('/welcome'); }}
            onGoogle={() => { setAuthed(); navigate('/welcome'); }}
          />
        }
      >
        <CreateStepDots step={1} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <AuthInput
            icon={<User size={17} strokeWidth={2.2} />}
            autoComplete="given-name"
            placeholder="First name"
            autoFocus
            value={form.firstName}
            onChange={onField('firstName')}
            error={touched.firstName ? errors.firstName : ''}
          />
          <AuthInput
            icon={<User size={17} strokeWidth={2.2} />}
            autoComplete="family-name"
            placeholder="Last name"
            value={form.lastName}
            onChange={onField('lastName')}
            error={touched.lastName ? errors.lastName : ''}
          />

          <div style={{ marginTop: 6 }}>
            <AuthCta
              onClick={nextStep}
              disabled={!step1Valid && (touched.firstName || touched.lastName)}
            >
              Continue
              <ArrowRight size={17} strokeWidth={2.4} />
            </AuthCta>
          </div>
        </div>
      </AuthShell>
    );
  }

  /* ───── Step 2 — email + password ×2 ───── */
  return (
    <AuthShell
      onBack={() => setStep(1)}
      showHelp
      overlays={
        <>
          <AuthDocSheet
            open={termsOpen}
            onClose={() => setTermsOpen(false)}
            title="Terms"
            sections={TERMS_SECTIONS}
            fullVersionUrl="https://fylos.me/terms"
          />
          <AuthDocSheet
            open={privacyOpen}
            onClose={() => setPrivacyOpen(false)}
            title="Privacy"
            sections={PRIVACY_SECTIONS}
            fullVersionUrl="https://fylos.me/privacy"
          />
        </>
      }
      helpTopics={[
        {
          q: 'Why do you need a password?',
          a: "Apple and Google handle this for you on their side. When you sign up manually, your password is what proves it's you next time.",
        },
        {
          q: 'What counts as strong?',
          a: 'Six characters minimum. A mix of letters and numbers makes it easier to remember and harder to guess.',
        },
        {
          q: 'Why type it twice?',
          a: 'Catches typos before they become a reset email later.',
        },
      ]}
      title="Almost there."
      subtitle="Email and a password. That's it."
      footer={
        <span>
          Changed your mind?{' '}
          <span
            onClick={() => navigate('/sign-in')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </span>
      }
    >
      <CreateStepDots step={2} />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          autoFocus
          value={form.email}
          onChange={onField('email')}
          error={touched.email ? errors.email : ''}
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Password"
          value={form.password}
          onChange={onField('password')}
          error={touched.password ? errors.password : ''}
          trailing={
            <button
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
                color: TAuth.textTertiary,
                display: 'flex',
              }}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          }
        />
        <AuthInput
          icon={<Lock size={17} strokeWidth={2.2} />}
          type={showPassword ? 'text' : 'password'}
          autoComplete="new-password"
          placeholder="Confirm password"
          value={form.confirm}
          onChange={onField('confirm')}
          error={touched.confirm ? errors.confirm : ''}
        />

        <div style={{ marginTop: 6 }}>
          <AuthCta
            onClick={submit}
            disabled={
              !step2Valid &&
              (touched.email || touched.password || touched.confirm)
            }
            loading={loading}
          >
            Create account
            <ArrowRight size={17} strokeWidth={2.4} />
          </AuthCta>
        </div>

        <p
          style={{
            fontSize: 11.5,
            color: TAuth.textTertiary,
            textAlign: 'center',
            lineHeight: 1.55,
            margin: '6px auto 0',
            maxWidth: 280,
          }}
        >
          By tapping above, you're cool with our{' '}
          <span
            onClick={() => setTermsOpen(true)}
            style={{
              color: TAuth.coral,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(232,93,42,0.4)',
              textUnderlineOffset: 2,
            }}
          >
            Terms
          </span>{' '}
          &{' '}
          <span
            onClick={() => setPrivacyOpen(true)}
            style={{
              color: TAuth.coral,
              fontWeight: 600,
              cursor: 'pointer',
              textDecoration: 'underline',
              textDecorationColor: 'rgba(232,93,42,0.4)',
              textUnderlineOffset: 2,
            }}
          >
            Privacy
          </span>
          .
        </p>
      </div>
    </AuthShell>
  );
}

/* ─────────────── 7e · ForgotPassword ──────────────────────────────── */
export function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [touched, setTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email);
  const error = touched && !valid ? 'That looks off. Try again?' : '';

  const submit = () => {
    setTouched(true);
    if (!valid) return;
    setLoading(true);
    // Placeholder — Panagiotis wires reset email.
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 700);
  };

  if (sent) {
    return (
      <AuthShell
        onBack={() => setSent(false)}
        title="Reset link sent."
        subtitle={`Tap the link we just sent to ${email} to set a new password.`}
        footer={
          <span>
            Didn't land?{' '}
            <span
              onClick={submit}
              style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
            >
              Resend
            </span>
          </span>
        }
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            background: TAuth.coralSoft,
            borderRadius: 14,
            color: TAuth.coralDark,
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          <Check size={16} strokeWidth={2.6} />
          On its way.
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      onBack={() => navigate('/sign-in-password')}
      showHelp
      helpTopics={[
        {
          q: 'How does this work?',
          a: 'Drop your email and we send you a secure link. Tap it to set a new password.',
        },
        {
          q: "Didn't get the link?",
          a: "Wait a minute, then tap Resend. Check your spam folder while you're there.",
        },
      ]}
      title="Forgot it? No drama."
      subtitle="Drop your email and we'll send a reset link."
      footer={
        <span>
          Remembered it?{' '}
          <span
            onClick={() => navigate('/sign-in-password')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Sign in
          </span>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <AuthInput
          icon={<Mail size={17} strokeWidth={2.2} />}
          type="email"
          inputMode="email"
          autoComplete="email"
          placeholder="Email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (touched) setTouched(false);
          }}
          error={error}
        />
        <AuthCta onClick={submit} disabled={!valid && touched} loading={loading}>
          Send reset link
          <ArrowRight size={17} strokeWidth={2.4} />
        </AuthCta>
      </div>
    </AuthShell>
  );
}

/* ─────────────── 7f · VerifyEmail ─────────────────────────────────── */
export function VerifyEmail() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your inbox';
  const [resentAt, setResentAt] = useState(null);

  const resend = () => {
    // Placeholder — Panagiotis wires re-send.
    setResentAt(Date.now());
  };

  return (
    <AuthShell
      onBack={() => navigate('/create-account')}
      showHelp
      helpTopics={[
        {
          q: 'Why am I here?',
          a: 'We just sent a verify link to your inbox. Tap it on this device and your account is live.',
        },
        {
          q: 'Can I skip this?',
          a: "Yes. Tap 'I'll verify later'. Some features need a verified email though.",
        },
        {
          q: 'Wrong email?',
          a: "Tap 'Edit it' under the message. We'll restart with the right address.",
        },
      ]}
      title="One last tap."
      subtitle={`We sent a verify link to ${email}. Open it on this device and you're in.`}
      footer={
        <span>
          Wrong email?{' '}
          <span
            onClick={() => navigate('/create-account')}
            style={{ color: TAuth.coral, fontWeight: 700, cursor: 'pointer' }}
          >
            Edit it
          </span>
        </span>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            padding: '14px 16px',
            background: TAuth.coralSoft,
            borderRadius: 14,
            color: TAuth.coralDark,
            fontSize: 13.5,
            fontWeight: 600,
          }}
        >
          {resentAt ? (
            <Check size={16} strokeWidth={2.6} />
          ) : (
            <MailCheck size={16} strokeWidth={2.4} />
          )}
          {resentAt ? 'Sent again.' : 'Check your inbox.'}
        </div>

        <AuthCta onClick={resend}>Resend the link</AuthCta>

        <button
          onClick={() => { setAuthed(); navigate('/welcome'); }}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: 12.5,
            color: TAuth.textTertiary,
            padding: '4px 8px',
            margin: '2px auto 0',
            fontFamily: 'inherit',
          }}
        >
          I'll verify later
        </button>
      </div>
    </AuthShell>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   7g · ProfileCompletion
   First-launch nudge that sits on top of the existing /home dashboard.
   Exports two pieces meant for direct integration into the home screen:

     · ProfilePrompt — the small floating card that nudges the user
     · ProfileSheet  — the multi-step bottom sheet that opens on tap

   The default-ish wrapper below is the thin /welcome harness used to
   review the experience without touching the dashboard code.
   ═══════════════════════════════════════════════════════════════════════ */

export function ProfileCompletion() {
  const navigate = useNavigate();
  const [promptOpen, setPromptOpen] = useState(true);
  const [sheetOpen, setSheetOpen] = useState(false);

  const openSheet = () => setSheetOpen(true);
  const closeSheet = () => setSheetOpen(false);
  const finishProfile = () => {
    setSheetOpen(false);
    setPromptOpen(false);
    setAuthed();
    setTimeout(() => navigate('/add-pet'), 220);
  };

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
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[300] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {/* Surface intentionally left blank — the real dashboard
            (/home, src/screens/Explore-home-v1.jsx) takes this spot
            when wired up in the next iteration. */}
        <div style={{ flex: 1 }} />

        {promptOpen && !sheetOpen && <ProfilePrompt onTap={openSheet} />}
        {sheetOpen && <ProfileSheet onClose={closeSheet} onDone={finishProfile} />}
      </div>
    </div>
  );
}

/* The floating popup — small card nudging the user to finish profile. */
export function ProfilePrompt({ onTap }) {
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 22,
        left: 16,
        right: 16,
        zIndex: 50,
        animation: 'promptFadeIn 420ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
      }}
    >
      <style>{`
        @keyframes promptFadeIn {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      <button
        onClick={onTap}
        style={{
          width: '100%',
          background: TAuth.bg,
          border: '1px solid rgba(60,30,15,0.06)',
          borderRadius: 18,
          padding: '14px 16px 14px 18px',
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.04), 0 14px 36px rgba(60,30,15,0.16)',
          cursor: 'pointer',
          fontFamily: 'inherit',
          textAlign: 'left',
        }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 12,
            background: 'rgba(232,93,42,0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: TAuth.coral,
            flexShrink: 0,
          }}
        >
          <ArrowRight size={18} strokeWidth={2.4} />
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 14.5,
              fontWeight: 700,
              color: TAuth.text,
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            Finish your profile
          </div>
          <div
            style={{
              fontSize: 12.5,
              color: TAuth.textMuted,
              marginTop: 2,
              fontFamily: 'Inter, -apple-system, sans-serif',
            }}
          >
            Three quick things and you're set.
          </div>
        </div>
      </button>
    </div>
  );
}

/* Multi-step bottom sheet with photo / phone / city. */
const PROFILE_STEPS = 3;

export function ProfileSheet({ onClose, onDone }) {
  const [step, setStep] = useState(1);
  const [avatar, setAvatar] = useState(null);
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const fileInputRef = useRef(null);

  const next = () => {
    if (step < PROFILE_STEPS) setStep(step + 1);
    else onDone();
  };
  const back = () => {
    if (step > 1) setStep(step - 1);
  };
  const skip = () => next();

  const onAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setAvatar(URL.createObjectURL(file));
  };

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
        animation: 'pcFade 220ms ease both',
      }}
    >
      <style>{`
        @keyframes pcFade { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pcSlide { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes pcStep { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          background: TAuth.bg,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          padding: '14px 24px 24px',
          boxShadow: '0 -8px 28px rgba(60,30,15,0.18)',
          animation: 'pcSlide 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
        }}
      >
        {/* Drag handle */}
        <div
          style={{
            width: 44,
            height: 4,
            borderRadius: 2,
            background: 'rgba(60,30,15,0.16)',
            margin: '0 auto 16px',
          }}
        />

        {/* Header — back + step dots + close */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: 18,
          }}
        >
          {step > 1 ? (
            <button
              onClick={back}
              aria-label="Back"
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'rgba(232,93,42,0.08)',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: TAuth.coralDark,
              }}
            >
              <ChevronLeft size={16} />
            </button>
          ) : (
            <div style={{ width: 32 }} />
          )}

          <ProfileStepDots step={step} />

          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              padding: 6,
              color: TAuth.textTertiary,
              display: 'flex',
            }}
          >
            <X size={18} strokeWidth={2.2} />
          </button>
        </div>

        {/* Step content */}
        <div
          key={step}
          style={{
            animation: 'pcStep 320ms cubic-bezier(0.2, 0.8, 0.2, 1) both',
            minHeight: 280,
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {step === 1 && (
            <ProfileStepAvatar
              avatar={avatar}
              onPick={() => fileInputRef.current?.click()}
              fileInputRef={fileInputRef}
              onAvatarChange={onAvatarChange}
            />
          )}
          {step === 2 && <ProfileStepPhone phone={phone} setPhone={setPhone} />}
          {step === 3 && <ProfileStepCity city={city} setCity={setCity} />}
        </div>

        {/* Footer — Skip + Next/Done */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            marginTop: 18,
          }}
        >
          <button
            onClick={skip}
            style={{
              flex: 1,
              height: 50,
              borderRadius: 25,
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: 14,
              fontWeight: 600,
              color: TAuth.textTertiary,
              fontFamily: 'inherit',
            }}
          >
            Skip
          </button>
          <button
            onClick={next}
            style={{
              flex: 2,
              height: 50,
              borderRadius: 25,
              background: TAuth.coral,
              color: '#FFFFFF',
              fontSize: 14.5,
              fontWeight: 700,
              border: 'none',
              cursor: 'pointer',
              boxShadow: '0 6px 18px rgba(232,93,42,0.28)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 8,
              fontFamily: 'inherit',
            }}
          >
            {step === PROFILE_STEPS ? 'Done' : 'Next'}
            <ArrowRight size={16} strokeWidth={2.4} />
          </button>
        </div>
      </div>
    </div>
  );
}

function ProfileStepDots({ step }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
      {Array.from({ length: PROFILE_STEPS }).map((_, i) => {
        const active = i === step - 1;
        return (
          <div
            key={i}
            style={{
              width: active ? 6 : 14,
              height: active ? 6 : 2,
              borderRadius: active ? '50%' : 1,
              background: active ? TAuth.coral : 'rgba(60,30,15,0.22)',
              transition: 'all 280ms cubic-bezier(0.34, 1.4, 0.64, 1)',
            }}
          />
        );
      })}
    </div>
  );
}

function ProfileStepHeading({ title, sub }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 22 }}>
      <h2
        style={{
          fontFamily: '"Playfair Display", "Georgia", serif',
          fontSize: 24,
          fontWeight: 700,
          color: TAuth.text,
          letterSpacing: '-0.01em',
          lineHeight: 1.15,
          margin: 0,
        }}
      >
        {title}
      </h2>
      <p
        style={{
          fontSize: 13.5,
          color: TAuth.textMuted,
          lineHeight: 1.5,
          margin: '6px auto 0',
          maxWidth: 280,
          fontFamily: 'Inter, -apple-system, sans-serif',
        }}
      >
        {sub}
      </p>
    </div>
  );
}

function ProfileStepAvatar({ avatar, onPick, fileInputRef, onAvatarChange }) {
  return (
    <>
      <ProfileStepHeading
        title="A photo?"
        sub="So you spot your account in a glance. Optional."
      />
      <div
        style={{
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={onAvatarChange}
          style={{ display: 'none' }}
        />
        <button
          type="button"
          onClick={onPick}
          aria-label={avatar ? 'Change photo' : 'Add a photo'}
          style={{
            width: 120,
            height: 120,
            borderRadius: '50%',
            background: avatar
              ? `center / cover no-repeat url(${avatar})`
              : 'rgba(232,93,42,0.06)',
            border: avatar
              ? '2px solid rgba(232,93,42,0.18)'
              : '2px dashed rgba(60,30,15,0.18)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: TAuth.coral,
            padding: 0,
            transition: 'background 180ms ease, border-color 180ms ease',
          }}
        >
          {!avatar && <Camera size={30} strokeWidth={1.8} />}
        </button>
      </div>
    </>
  );
}

function ProfileStepPhone({ phone, setPhone }) {
  return (
    <>
      <ProfileStepHeading
        title="Your number?"
        sub="For vet alerts and reminders we don't want you to miss."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 54,
          padding: '0 18px',
          background: '#FFFFFF',
          border: '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
        }}
      >
        <Phone size={17} color="#9C8E84" strokeWidth={2.2} />
        <input
          type="tel"
          inputMode="tel"
          autoComplete="tel"
          placeholder="+30 690 000 0000"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          autoFocus
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
      </div>
    </>
  );
}

function ProfileStepCity({ city, setCity }) {
  return (
    <>
      <ProfileStepHeading
        title="Where are you based?"
        sub="So we can show vets and walkers near you."
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          height: 54,
          padding: '0 18px',
          background: '#FFFFFF',
          border: '1px solid rgba(60,30,15,0.04)',
          borderRadius: 16,
          boxShadow:
            '0 1px 2px rgba(60,30,15,0.03), 0 6px 16px rgba(60,30,15,0.04)',
        }}
      >
        <MapPin size={17} color="#9C8E84" strokeWidth={2.2} />
        <input
          type="text"
          autoComplete="address-level2"
          placeholder="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          autoFocus
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
      </div>
    </>
  );
}
