import React, { useState } from 'react';

/* ──────────────────────────────────────────────────────────────────────
   ONBOARDING_PREVIEW_v1.jsx
   Showcase wrapper that embeds /onboarding-v4 inside an iPhone-shaped
   frame so the full flow (splash → 5 slides → create account) can be
   viewed end-to-end. Replay button reloads the iframe to restart the
   splash animation.
   ────────────────────────────────────────────────────────────────────── */

const T = {
  coral: '#E85D2A',
  bg: '#EFEDE8',
  card: '#FFFFFF',
  text: '#1A1410',
  textMuted: '#6E6058',
  divider: '#E5E5E5',
};

export default function OnboardingPreview() {
  const [replayKey, setReplayKey] = useState(0);

  const replay = () => setReplayKey((k) => k + 1);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: T.bg,
        padding: '24px 16px 32px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Title */}
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
          Onboarding · Full Flow
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
          Splash to sign up
        </h1>
        <p
          style={{
            fontSize: 13,
            color: T.textMuted,
            marginTop: 4,
            lineHeight: 1.45,
            maxWidth: 380,
          }}
        >
          Live preview of the full onboarding inside an iPhone frame. Tap
          Replay to restart from the splash animation.
        </p>
      </div>

      {/* iPhone frame — smaller scaled version so the full canvas
          (title + frame + controls) fits in the visible viewport */}
      <div
        style={{
          width: 320,
          height: 640,
          borderRadius: 38,
          overflow: 'hidden',
          boxShadow:
            '0 22px 60px rgba(60,30,15,0.14), 0 8px 22px rgba(60,30,15,0.08)',
          border: '1px solid rgba(0,0,0,0.06)',
          background: '#F2EFE6',
          position: 'relative',
        }}
      >
        {/* Inner iframe sized to 375x812 then scaled down to fit the frame */}
        <iframe
          key={replayKey}
          src="/onboarding-v4"
          title="Onboarding preview"
          style={{
            width: 375,
            height: 812,
            border: 'none',
            display: 'block',
            background: '#F2EFE6',
            transform: 'scale(0.853)',
            transformOrigin: 'top left',
          }}
        />
      </div>

      {/* Controls */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 10,
          marginTop: 18,
        }}
      >
        <button
          onClick={replay}
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            border: `1px solid ${T.divider}`,
            background: T.card,
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
        <a
          href="/onboarding-v4"
          target="_blank"
          rel="noreferrer"
          style={{
            padding: '10px 22px',
            borderRadius: 999,
            border: `1px solid ${T.divider}`,
            background: T.card,
            fontSize: 13,
            fontWeight: 700,
            cursor: 'pointer',
            color: T.text,
            textDecoration: 'none',
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            boxShadow: '0 2px 6px rgba(0,0,0,0.04)',
          }}
        >
          Open fullscreen ↗
        </a>
      </div>

      {/* Small caption with route info */}
      <div
        style={{
          marginTop: 14,
          fontSize: 11.5,
          color: T.textMuted,
          textAlign: 'center',
          lineHeight: 1.5,
          maxWidth: 380,
        }}
      >
        Direct route: <code>/onboarding-v4</code>
      </div>
    </div>
  );
}
