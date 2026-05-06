import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Users, Clock, ShieldCheck, Hand, CalendarClock } from 'lucide-react';

/**
 * HotspotPlaceSheet — detail view for a neighborhood hotspot
 * (Seefeld Park, Limmat riverside, Belvoirpark, etc.).
 *
 * Opens from the Hotspots row in Pack > Playdates.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

// Default details per known hotspot id. Fallback for unknown ones.
const DEFAULT_DETAILS = {
  h1: {
    rating: 'Vet-cleared',
    schedule: 'Best 07:00–10:00 / 17:00–20:00',
    rules: ['Off-leash zone', 'Water fountains', 'Shaded paths'],
    activeNow: [
      { name: 'Bruno', avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop' },
      { name: 'Tao',   avatar: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=200&h=200&fit=crop' },
      { name: 'Max',   avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop' },
    ],
  },
  h2: {
    rating: 'Calm trail',
    schedule: 'Quiet midday, busy at sunset',
    rules: ['On-leash recommended', 'Cyclists pass through', 'Riverside benches'],
    activeNow: [
      { name: 'Coco',  avatar: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop' },
      { name: 'Luna',  avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop' },
    ],
  },
  h3: {
    rating: 'Family-friendly',
    schedule: 'Open daily',
    rules: ['Mixed-use park', 'Picnic spots', 'Drinking fountain'],
    activeNow: [
      { name: 'Milo',  avatar: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=200&h=200&fit=crop' },
      { name: 'Rocco', avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
    ],
  },
};

export default function HotspotPlaceSheet({ open, onClose, hotspot, onOpenPersonality }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = getMount();
  if (!open || !hotspot || !mount) return null;

  const details = DEFAULT_DETAILS[hotspot.id] || DEFAULT_DETAILS.h1;

  const markup = (
    <>
      <style>{`
        @keyframes hp-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes hp-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes hp-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .hp-overlay { animation: hp-overlay-in 200ms ease forwards; }
        .hp-sheet { animation: hp-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .hp-item { opacity: 0; animation: hp-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div
        className="hp-overlay"
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
          className="hp-sheet"
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
            <div style={{ fontSize: 10, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Hotspot
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ width: 32, height: 32, borderRadius: 9999, background: '#F7F5F2', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ padding: '0 20px 24px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* Hero photo */}
            <div className="hp-item" style={{ animationDelay: '40ms' }}>
              <img
                src={hotspot.photo}
                alt={hotspot.name}
                style={{
                  width: '100%',
                  aspectRatio: '16 / 9',
                  objectFit: 'cover',
                  borderRadius: 16,
                  background: '#F1ECE6',
                  display: 'block',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                }}
              />
            </div>

            {/* Title row */}
            <div className="hp-item" style={{ animationDelay: '90ms' }}>
              <div style={{ fontSize: 24, fontWeight: 700, color: '#111', letterSpacing: '-0.022em', lineHeight: 1.05, marginBottom: 6 }}>
                {hotspot.name}
                <span style={{ color: '#E85D2A' }}>.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#76767D' }}>
                  <MapPin size={12} color="#E85D2A" strokeWidth={2.2} />
                  {hotspot.distance}
                </span>
                <span style={{ width: 3, height: 3, borderRadius: 9999, background: 'rgba(0,0,0,0.2)' }} />
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12, fontWeight: 600, color: '#E85D2A' }}>
                  <Users size={12} strokeWidth={2.2} />
                  {hotspot.pups} pups today
                </span>
                <span
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 4,
                    padding: '3px 8px',
                    borderRadius: 9999,
                    background: '#FBE7DD',
                    color: '#7A2F12',
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                  }}
                >
                  <ShieldCheck size={10} strokeWidth={2.4} color="#E85D2A" />
                  {details.rating}
                </span>
              </div>
            </div>

            {/* Schedule */}
            <div className="hp-item" style={{ animationDelay: '140ms' }}>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '12px 14px',
                  background: '#F7F5F2',
                  border: '1px solid #EDE8E2',
                  borderRadius: 14,
                }}
              >
                <Clock size={16} color="#E85D2A" strokeWidth={2.2} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 1 }}>
                    Best times
                  </div>
                  <div style={{ fontSize: 13, color: '#111', fontWeight: 500 }}>
                    {details.schedule}
                  </div>
                </div>
              </div>
            </div>

            {/* Active now */}
            {details.activeNow?.length > 0 && (
              <div className="hp-item" style={{ animationDelay: '180ms' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                  <span style={{ width: 7, height: 7, borderRadius: 9999, background: '#E85D2A', boxShadow: '0 0 0 3px rgba(232,93,42,0.18)' }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                    Active now
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 8, overflowX: 'auto', scrollbarWidth: 'none', paddingBottom: 2 }}>
                  {details.activeNow.map((p) => (
                    <button
                      key={p.name}
                      onClick={() => onOpenPersonality?.({ name: p.name, avatar: p.avatar })}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        width: 60,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={p.avatar}
                        alt={p.name}
                        style={{
                          width: 44,
                          height: 44,
                          borderRadius: 9999,
                          objectFit: 'cover',
                          border: '2px solid #FFF',
                          boxShadow: '0 2px 6px rgba(232,93,42,0.18)',
                        }}
                      />
                      <span style={{ fontSize: 10.5, fontWeight: 600, color: '#111' }}>{p.name}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rules / amenities */}
            <div className="hp-item" style={{ animationDelay: '230ms' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Notes
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {details.rules.map((r) => (
                  <div
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '9px 12px',
                      background: '#F7F5F2',
                      borderRadius: 11,
                      border: '1px solid #EDE8E2',
                    }}
                  >
                    <span style={{ width: 5, height: 5, borderRadius: 9999, background: '#E85D2A', flexShrink: 0 }} />
                    <span style={{ fontSize: 12, color: '#3A332C', fontWeight: 500 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="hp-item" style={{ animationDelay: '280ms', display: 'flex', gap: 8 }}>
              <button
                style={{
                  flex: 1,
                  height: 50,
                  borderRadius: 14,
                  background: '#FFFFFF',
                  color: '#111',
                  border: '1px solid rgba(0,0,0,0.08)',
                  fontSize: 13,
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  cursor: 'pointer',
                }}
              >
                <Hand size={14} strokeWidth={2.2} color="#E85D2A" />
                Wave nearby
              </button>
              <button
                style={{
                  flex: 1,
                  height: 50,
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
                Plan a meet
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}
