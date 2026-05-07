import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Search, Sparkles, MapPin, Hand, CalendarClock } from 'lucide-react';

/**
 * TwinFinderSheet — "find your pet's twin" mini flow.
 * 2 states: scanning (animated) → revealed (twin + reasons + actions).
 *
 * Opens from the Twin Finder card in Pack > Network.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const DEFAULT_PET = {
  name: 'Leo',
  archetype: 'The Diplomat',
  avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop',
};

const TWIN = {
  name: 'Bruno',
  archetype: 'The Guardian',
  avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=300&h=300&fit=crop',
  location: 'Madrid · Salamanca',
  reasons: [
    'Calm-tempered, same energy curve',
    'Both polite with cats',
    'Long-walk endurance match',
    'Sleep schedule overlap (19:00–07:30)',
  ],
};

export default function TwinFinderSheet({ open, onClose, pet = DEFAULT_PET }) {
  const [phase, setPhase] = useState('scanning'); // 'scanning' | 'revealed'
  const [waved, setWaved] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // Reset + start scan
      setPhase('scanning');
      setWaved(false);
      const t = setTimeout(() => setPhase('revealed'), 2200);
      return () => {
        document.body.style.overflow = prev;
        clearTimeout(t);
      };
    }
  }, [open]);

  const mount = getMount();
  if (!open || !mount) return null;

  const markup = (
    <>
      <style>{`
        @keyframes tf-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes tf-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tf-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes tf-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes tf-pulse {
          0%, 100% { transform: scale(1); opacity: 1; }
          50%      { transform: scale(1.06); opacity: 0.85; }
        }
        @keyframes tf-orbit {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes tf-reveal-pop {
          0%   { opacity: 0; transform: scale(0.7); }
          70%  { opacity: 1; transform: scale(1.06); }
          100% { opacity: 1; transform: scale(1); }
        }
        .tf-overlay { animation: tf-overlay-in 200ms ease forwards; }
        .tf-sheet { animation: tf-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .tf-item { opacity: 0; animation: tf-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .tf-spin { animation: tf-spin 1.6s linear infinite; }
        .tf-pulse { animation: tf-pulse 1.4s ease-in-out infinite; }
        .tf-orbit { animation: tf-orbit 3.2s linear infinite; }
        .tf-reveal-pop { animation: tf-reveal-pop 540ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      <div
        className="tf-overlay"
        onClick={onClose}
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(0,0,0,0.42)',
          backdropFilter: 'blur(2px)',
          zIndex: 10001,
          display: 'flex',
          alignItems: 'flex-end',
          opacity: 0,
        }}
      >
        <div
          className="tf-sheet"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxHeight: '88%',
            background: '#FFFFFF',
            borderRadius: '24px 24px 0 0',
            boxShadow: '0 -10px 40px rgba(0,0,0,0.18)',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            opacity: 0,
          }}
        >
          {/* Drag handle */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '12px 0 6px' }}>
            <div style={{ width: 40, height: 4, borderRadius: 9999, background: '#D1D1D6' }} />
          </div>

          {/* Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 10, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              <Search size={11} strokeWidth={2.4} />
              Twin Finder · Beta
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ width: 32, height: 32, borderRadius: 9999, background: '#F7F5F2', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ padding: '0 20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16, minHeight: 360 }}>
            {phase === 'scanning' && (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 18, paddingTop: 28, paddingBottom: 28 }}>
                {/* Scanning visual: pet avatar with orbiting ring */}
                <div style={{ position: 'relative', width: 140, height: 140 }}>
                  <div
                    className="tf-spin"
                    style={{
                      position: 'absolute',
                      inset: 0,
                      borderRadius: 9999,
                      border: '2px dashed rgba(232,93,42,0.4)',
                    }}
                  />
                  <div
                    className="tf-pulse"
                    style={{
                      position: 'absolute',
                      inset: 14,
                      borderRadius: 9999,
                      background: 'radial-gradient(circle, rgba(232,93,42,0.18), transparent 70%)',
                    }}
                  />
                  <img
                    src={pet.avatar}
                    alt={pet.name}
                    style={{
                      position: 'absolute',
                      inset: 28,
                      borderRadius: 9999,
                      objectFit: 'cover',
                      width: 'calc(100% - 56px)',
                      height: 'calc(100% - 56px)',
                      border: '3px solid #FFF',
                      boxShadow: '0 4px 14px rgba(232,93,42,0.25)',
                    }}
                  />
                  <div className="tf-orbit" style={{ position: 'absolute', inset: 0 }}>
                    <div style={{ position: 'absolute', top: -4, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, borderRadius: 9999, background: '#E85D2A', boxShadow: '0 0 12px rgba(232,93,42,0.5)' }} />
                  </div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 18, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', marginBottom: 6 }}>
                    Looking for {pet.name}'s twin…
                  </div>
                  <div style={{ fontSize: 12, color: '#76767D', maxWidth: 260, margin: '0 auto', lineHeight: 1.45 }}>
                    Comparing 4,210 pets across visual + behavioural + schedule signals.
                  </div>
                </div>
                {/* Scanning chips */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5, justifyContent: 'center', maxWidth: 280 }}>
                  {['Visual match', 'Energy curve', 'Calm-with-cats', 'Sleep overlap'].map((c, i) => (
                    <span
                      key={c}
                      className="tf-pulse"
                      style={{
                        padding: '4px 9px',
                        borderRadius: 9999,
                        background: '#FBE7DD',
                        color: '#7A2F12',
                        fontSize: 10,
                        fontWeight: 700,
                        letterSpacing: '0.04em',
                        animationDelay: `${i * 200}ms`,
                      }}
                    >
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {phase === 'revealed' && (
              <>
                <div className="tf-item" style={{ animationDelay: '40ms', textAlign: 'center', paddingTop: 4 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Twin found
                  </div>
                  <div style={{ fontSize: 26, fontWeight: 700, color: '#111', letterSpacing: '-0.022em', lineHeight: 1.05 }}>
                    Meet {TWIN.name}
                    <span style={{ color: '#E85D2A' }}>.</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#76767D', marginTop: 4 }}>
                    {TWIN.archetype} · {TWIN.location}
                  </div>
                </div>

                {/* Twin avatar pair, "snapping" together */}
                <div className="tf-reveal-pop" style={{ display: 'flex', justifyContent: 'center', padding: '6px 0' }}>
                  <div style={{ position: 'relative', width: 132, height: 64 }}>
                    <img
                      src={pet.avatar}
                      alt={pet.name}
                      style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: 64,
                        height: 64,
                        borderRadius: 9999,
                        objectFit: 'cover',
                        border: '3px solid #FFF',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        zIndex: 2,
                      }}
                    />
                    <img
                      src={TWIN.avatar}
                      alt={TWIN.name}
                      style={{
                        position: 'absolute',
                        left: 68,
                        top: 0,
                        width: 64,
                        height: 64,
                        borderRadius: 9999,
                        objectFit: 'cover',
                        border: '3px solid #FFF',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                        zIndex: 1,
                      }}
                    />
                    <div
                      style={{
                        position: 'absolute',
                        left: '50%',
                        top: '50%',
                        transform: 'translate(-50%, -50%)',
                        width: 24,
                        height: 24,
                        borderRadius: 9999,
                        background: '#E85D2A',
                        color: '#FFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 11,
                        fontWeight: 800,
                        zIndex: 3,
                        boxShadow: '0 3px 8px rgba(232,93,42,0.4)',
                      }}
                    >
                      ×
                    </div>
                  </div>
                </div>

                {/* Reasons */}
                <div className="tf-item" style={{ animationDelay: '120ms' }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                    Why they match
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {TWIN.reasons.map((r, i) => (
                      <div
                        key={r}
                        className="tf-item"
                        style={{
                          animationDelay: `${160 + i * 60}ms`,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 12px',
                          background: '#F7F5F2',
                          border: '1px solid #EDE8E2',
                          borderRadius: 12,
                        }}
                      >
                        <div
                          style={{
                            width: 22,
                            height: 22,
                            borderRadius: 9999,
                            background: '#FBE7DD',
                            color: '#E85D2A',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 10,
                            fontWeight: 700,
                            flexShrink: 0,
                          }}
                        >
                          {i + 1}
                        </div>
                        <span style={{ fontSize: 12.5, color: '#3A332C', fontWeight: 500 }}>
                          {r}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="tf-item" style={{ animationDelay: '440ms', display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setWaved(true)}
                    disabled={waved}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 14,
                      background: waved ? '#FBE7DD' : '#FFFFFF',
                      color: waved ? '#7A2F12' : '#111',
                      border: '1px solid',
                      borderColor: waved ? 'rgba(232,93,42,0.16)' : 'rgba(0,0,0,0.08)',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: waved ? 'default' : 'pointer',
                    }}
                  >
                    <Hand size={14} strokeWidth={2.2} color="#E85D2A" />
                    {waved ? 'Wave sent' : 'Send a wave'}
                  </button>
                  <button
                    onClick={onClose}
                    style={{
                      flex: 1,
                      height: 48,
                      borderRadius: 14,
                      background: '#E85D2A',
                      color: '#FFFFFF',
                      border: 'none',
                      fontSize: 13,
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      cursor: 'pointer',
                      boxShadow: '0 6px 16px rgba(232,93,42,0.25)',
                    }}
                  >
                    <CalendarClock size={14} strokeWidth={2.2} />
                    Suggest a playdate
                  </button>
                </div>

                <div className="tf-item" style={{ animationDelay: '500ms', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFF7F2', border: '1px dashed #F2D6C5', borderRadius: 12 }}>
                  <Sparkles size={13} color="#E85D2A" strokeWidth={2.2} />
                  <span style={{ fontSize: 11.5, color: '#7A2F12', fontWeight: 500, lineHeight: 1.4 }}>
                    Twin matches refresh weekly. We never share locations precisely — just region.
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}
