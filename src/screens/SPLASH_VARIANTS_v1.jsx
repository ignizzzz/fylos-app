import React, { useState, useEffect } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   SPLASH_VARIANTS_v1.jsx
   App-open splash. Logo stays static in center. The dot grows and
   floods the screen with coral, then the next screen is revealed.

   Two variants of the expansion anchor:
     A · From the dot   → the actual dot scales up (slightly off-center)
     B · From center    → a separate centered coral circle expands
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  // Slightly tinted off-white background (warmer than pure white,
  // still neutral enough to feel like an "empty" canvas).
  bg: '#F2EBDD',
  text: '#111111',
  textMuted: '#6E6058',
  divider: '#E5E5E5',
};

/* Canonical-style FylosLogo */
function FylosLogo({ textColor, dotColor, fontSize, dotStyle = {} }) {
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
          color: textColor,
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
          backgroundColor: dotColor,
          ...dotStyle,
        }}
      />
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Variant A — expansion from the dot itself (the dot scales up to cover)
   ════════════════════════════════════════════════════════════════════ */
function SplashFromDot({ replayKey }) {
  return (
    <div
      key={replayKey}
      style={{
        width: '100%',
        height: '100%',
        background: T.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Bottom layer — next screen (revealed last) */}
      <NextScreenPreview />

      {/* Splash layer — bg covers next screen, fades away at end */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: T.bg,
          zIndex: 2,
          animation: 'splashLayerOut 3.6s ease-in-out infinite',
        }}
      >
        {/* Static centered stack — FYLOS + dot row, tagline below.
            Wordmark + tagline fade together. Dot stays opaque and expands. */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            fontFamily: '"Nunito", sans-serif',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 56 * 0.15,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: T.text,
                letterSpacing: '-0.5px',
                lineHeight: 1,
                animation: 'splashLogoTextFade 3.6s ease-in-out infinite',
              }}
            >
              FYLOS
            </span>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: T.coral,
                transformOrigin: 'center',
                animation:
                  'splashDotExpand 3.6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
              }}
            />
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.coral,
              letterSpacing: '0.02em',
              fontFamily: 'Inter, -apple-system, sans-serif',
              animation: 'splashLogoTextFade 3.6s ease-in-out infinite',
            }}
          >
            A calmer way to care.
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Variant B — expansion from screen center (perfectly symmetric)
   ════════════════════════════════════════════════════════════════════ */
function SplashFromCenter({ replayKey }) {
  return (
    <div
      key={replayKey}
      style={{
        width: '100%',
        height: '100%',
        background: T.bg,
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Bottom layer — next screen */}
      <NextScreenPreview />

      {/* Splash layer */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: T.bg,
          zIndex: 2,
          animation: 'splashLayerOut 3.6s ease-in-out infinite',
        }}
      >
        {/* Static centered logo + tagline. Text fades; dot stays opaque static. */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
            fontFamily: '"Nunito", sans-serif',
            zIndex: 2,
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 56 * 0.15,
            }}
          >
            <span
              style={{
                fontSize: 56,
                fontWeight: 800,
                color: T.text,
                letterSpacing: '-0.5px',
                lineHeight: 1,
                animation: 'splashLogoTextFade 3.6s ease-in-out infinite',
              }}
            >
              FYLOS
            </span>
            <div
              style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: T.coral,
              }}
            />
          </div>
          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
              color: T.coral,
              letterSpacing: '0.02em',
              fontFamily: 'Inter, -apple-system, sans-serif',
              animation: 'splashLogoTextFade 3.6s ease-in-out infinite',
            }}
          >
            A calmer way to care.
          </div>
        </div>

        {/* Coral expanding circle from dead center */}
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 14,
            height: 14,
            borderRadius: '50%',
            background: T.coral,
            transform: 'translate(-50%, -50%) scale(0)',
            zIndex: 3,
            animation:
              'splashCenterExpand 3.6s cubic-bezier(0.65, 0, 0.35, 1) infinite',
          }}
        />
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Shared next-screen preview (what you'd see after the splash fades)
   ════════════════════════════════════════════════════════════════════ */
function NextScreenPreview() {
  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        background: T.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 14,
        zIndex: 1,
      }}
    >
      <div
        style={{
          fontFamily: '"Nunito", sans-serif',
          fontSize: 32,
          fontWeight: 800,
          color: T.text,
          letterSpacing: '-0.02em',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        Welcome back
        <span style={{ fontSize: 32 }}>👋</span>
      </div>
      <div
        style={{
          fontSize: 14,
          color: T.textMuted,
        }}
      >
        Luna says hello.
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════════════
   Page
   ════════════════════════════════════════════════════════════════════ */
const VARIANTS = {
  A: { label: 'A · From the dot', component: SplashFromDot },
  B: { label: 'B · From center', component: SplashFromCenter },
};

export default function SplashVariants() {
  const [variant, setVariant] = useState('A');
  const [replayKey, setReplayKey] = useState(0);

  const Variant = VARIANTS[variant].component;
  const replay = () => setReplayKey((k) => k + 1);

  useEffect(() => {
    setReplayKey((k) => k + 1);
  }, [variant]);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#EFEDE8',
        padding: '24px 16px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <style>{`
        /* Splash layer fade — reveals next screen for ~600ms each cycle */
        @keyframes splashLayerOut {
          0%, 72% { opacity: 1; }
          82%, 95% { opacity: 0; }
          100% { opacity: 1; }
        }

        /* Wordmark fades out once the coral wash starts taking over */
        @keyframes splashLogoTextFade {
          0%, 20% { opacity: 1; }
          40%, 100% { opacity: 0; }
        }

        /* Variant A — dot expands from its position in the wordmark.
           Dot is opaque coral throughout, so the screen turns coral as it
           grows (no white intermediate state). */
        @keyframes splashDotExpand {
          0%, 20% { transform: scale(1); }
          55%, 100% { transform: scale(80); }
        }

        /* Variant B — symmetric expansion from screen center */
        @keyframes splashCenterExpand {
          0%, 20% {
            transform: translate(-50%, -50%) scale(0);
          }
          55%, 100% {
            transform: translate(-50%, -50%) scale(80);
          }
        }
      `}</style>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 14 }}>
        <div
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: '0.10em',
            color: T.coral,
            textTransform: 'uppercase',
          }}
        >
          Splash · Variants
        </div>
        <h1
          style={{
            fontSize: 20,
            fontWeight: 700,
            color: T.text,
            marginTop: 4,
            letterSpacing: '-0.01em',
          }}
        >
          Dot fills the screen
        </h1>
        <p
          style={{
            fontSize: 13,
            color: T.textMuted,
            marginTop: 4,
            lineHeight: 1.4,
            maxWidth: 380,
          }}
        >
          Logo stays centered. The dot grows, fills with coral, then the next
          screen is revealed.
        </p>
      </div>

      {/* Variant toggle */}
      <div
        style={{
          display: 'flex',
          gap: 4,
          padding: 4,
          background: '#FFFFFF',
          borderRadius: 999,
          boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
          border: `1px solid ${T.divider}`,
          marginBottom: 18,
        }}
      >
        {Object.entries(VARIANTS).map(([id, v]) => {
          const active = variant === id;
          return (
            <button
              key={id}
              onClick={() => setVariant(id)}
              style={{
                padding: '8px 14px',
                borderRadius: 999,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12.5,
                fontWeight: 700,
                background: active ? T.text : 'transparent',
                color: active ? '#FFFFFF' : T.textMuted,
                transition: 'all 200ms ease',
              }}
            >
              {v.label}
            </button>
          );
        })}
      </div>

      {/* iPhone frame */}
      <div
        style={{
          width: 360,
          height: 720,
          borderRadius: 38,
          overflow: 'hidden',
          boxShadow:
            '0 18px 50px rgba(60,30,15,0.12), 0 6px 18px rgba(60,30,15,0.06)',
          border: '1px solid rgba(0,0,0,0.06)',
          position: 'relative',
        }}
      >
        <Variant replayKey={replayKey} />
      </div>

      {/* Replay button */}
      <button
        onClick={replay}
        style={{
          marginTop: 18,
          padding: '10px 22px',
          borderRadius: 999,
          border: `1px solid ${T.divider}`,
          background: '#FFFFFF',
          fontSize: 13,
          fontWeight: 700,
          cursor: 'pointer',
          color: T.text,
          display: 'inline-flex',
          alignItems: 'center',
          gap: 8,
          boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
        }}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <path
            d="M3 12 A9 9 0 1 1 12 21"
            stroke={T.text}
            strokeWidth="2.4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M3 6 L3 12 L9 12"
            stroke={T.text}
            strokeWidth="2.4"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </svg>
        Replay
      </button>
    </div>
  );
}
