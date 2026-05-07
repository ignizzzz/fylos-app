import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Users, Footprints, MapPin, Plus, Check } from 'lucide-react';

/**
 * PackPageSheet — detail view of a Tribe pack group (Athens Hounds, etc.).
 * Opens from the Tribe Packs rail in Pack > Network.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const DEFAULT_PACK_DETAILS = {
  'athens-hounds': {
    members: 312,
    weeklyMiles: 1240,
    nextWalk: { day: 'SAT · MAY 02', time: '08:30', place: 'Lycabettus base' },
    sample: [
      { name: 'Bruno',  avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop' },
      { name: 'Tao',    avatar: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=200&h=200&fit=crop' },
      { name: 'Max',    avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop' },
      { name: 'Milo',   avatar: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=200&h=200&fit=crop' },
      { name: 'Rocco',  avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop' },
    ],
    rules: [
      'Long city walks · weekly meetups',
      'Vaccination required · vet card on profile',
      'Welcoming to dogs of all sizes',
    ],
  },
  'senior-cats': {
    members: 184,
    weeklyMiles: 0,
    nextWalk: { day: 'INDOOR', time: 'Always', place: 'Sunbeam corner' },
    sample: [
      { name: 'Zyon',  avatar: 'https://images.unsplash.com/photo-1633722715463-d30f4f325e24?w=200&h=200&fit=crop' },
      { name: 'Luna',  avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop' },
      { name: 'Misha', avatar: 'https://images.unsplash.com/photo-1571566882372-1598d88abd90?w=200&h=200&fit=crop' },
    ],
    rules: [
      'Slow days, sun-drenched naps',
      'Indoor-friendly, no field trips',
      'Health-record sharing welcomed',
    ],
  },
  'hiking-pups': {
    members: 96,
    weeklyMiles: 480,
    nextWalk: { day: 'SUN · MAY 03', time: '07:00', place: 'Mount Hymettus' },
    sample: [
      { name: 'Milo',  avatar: 'https://images.unsplash.com/photo-1505628346881-b72b27e84530?w=200&h=200&fit=crop' },
      { name: 'Bruno', avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop' },
    ],
    rules: [
      'Trails before tails · weekend hikes',
      'Must clear 5 km comfortably',
      'Off-leash okay where allowed',
    ],
  },
};

export default function PackPageSheet({ open, onClose, pack, onOpenPersonality }) {
  const [joined, setJoined] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setJoined(false);
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = getMount();
  if (!open || !pack || !mount) return null;

  const details = DEFAULT_PACK_DETAILS[pack.id] || DEFAULT_PACK_DETAILS['athens-hounds'];
  const accent = pack.accent || '#E85D2A';

  const markup = (
    <>
      <style>{`
        @keyframes pp-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes pp-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes pp-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .pp-overlay { animation: pp-overlay-in 200ms ease forwards; }
        .pp-sheet { animation: pp-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .pp-item { opacity: 0; animation: pp-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div
        className="pp-overlay"
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
          className="pp-sheet"
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
              Pack
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
            {/* Hero */}
            <div className="pp-item" style={{ animationDelay: '40ms' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10 }}>
                <div
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 16,
                    background: `${accent}14`,
                    color: accent,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    border: `1px solid ${accent}33`,
                    flexShrink: 0,
                  }}
                >
                  <Users size={22} strokeWidth={2} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', lineHeight: 1.05 }}>
                    {pack.name}
                  </div>
                  <div style={{ fontSize: 12, color: '#76767D', fontStyle: 'italic', marginTop: 3 }}>
                    {pack.motto}
                  </div>
                </div>
              </div>
              <div
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '4px 10px',
                  borderRadius: 9999,
                  background: `${accent}14`,
                  color: accent,
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: 9999, background: accent }} />
                {details.members} members
              </div>
            </div>

            {/* Stats card */}
            <div
              className="pp-item"
              style={{
                animationDelay: '90ms',
                background: '#F7F5F2',
                border: '1px solid #EDE8E2',
                borderRadius: 14,
                padding: '14px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Stat Icon={Users} value={details.members} label="members" accent={accent} />
              <span style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
              <Stat
                Icon={Footprints}
                value={details.weeklyMiles ? `${details.weeklyMiles}` : '—'}
                label={details.weeklyMiles ? 'km / week' : 'indoor'}
                accent={accent}
              />
              <span style={{ width: 1, height: 32, background: 'rgba(0,0,0,0.06)' }} />
              <Stat Icon={MapPin} value="Athens" label="region" accent={accent} />
            </div>

            {/* Next walk */}
            <div className="pp-item" style={{ animationDelay: '140ms' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Next gathering
              </div>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '12px 14px',
                  background: '#FFFFFF',
                  border: '1px solid rgba(0,0,0,0.06)',
                  borderRadius: 14,
                }}
              >
                <div
                  style={{
                    width: 56,
                    flexShrink: 0,
                    padding: '8px 4px',
                    borderRadius: 12,
                    background: `${accent}14`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                  }}
                >
                  <span style={{ fontSize: 8, fontWeight: 700, color: accent, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                    {details.nextWalk.day.split(' · ')[0]}
                  </span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: '#111', lineHeight: 1.05, marginTop: 2 }}>
                    {details.nextWalk.day.split(' · ')[1] || details.nextWalk.day}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: accent, marginTop: 1 }}>
                    {details.nextWalk.time}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#111', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <MapPin size={11} color={accent} strokeWidth={2.2} />
                    {details.nextWalk.place}
                  </div>
                  <div style={{ fontSize: 11, color: '#76767D', marginTop: 3 }}>
                    Pack walk · all welcome
                  </div>
                </div>
              </div>
            </div>

            {/* Members preview */}
            {details.sample.length > 0 && (
              <div className="pp-item" style={{ animationDelay: '180ms' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Some members
                </div>
                <div
                  style={{
                    display: 'flex',
                    gap: 8,
                    overflowX: 'auto',
                    scrollbarWidth: 'none',
                    paddingBottom: 2,
                  }}
                >
                  {details.sample.map((m) => (
                    <button
                      key={m.name}
                      onClick={() => onOpenPersonality?.({ name: m.name, avatar: m.avatar })}
                      style={{
                        flexShrink: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: 4,
                        width: 64,
                        background: 'transparent',
                        border: 'none',
                        cursor: 'pointer',
                      }}
                    >
                      <img
                        src={m.avatar}
                        alt={m.name}
                        style={{
                          width: 48,
                          height: 48,
                          borderRadius: 9999,
                          objectFit: 'cover',
                          border: '2px solid #FFF',
                          boxShadow: `0 2px 6px ${accent}33`,
                        }}
                      />
                      <span style={{ fontSize: 11, fontWeight: 600, color: '#111' }}>
                        {m.name}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Rules */}
            <div className="pp-item" style={{ animationDelay: '230ms' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Pack rules
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
                {details.rules.map((r, i) => (
                  <div
                    key={r}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 8,
                      padding: '9px 12px',
                      background: '#F7F5F2',
                      borderRadius: 11,
                      border: '1px solid #EDE8E2',
                    }}
                  >
                    <Check size={13} color={accent} strokeWidth={2.4} style={{ flexShrink: 0, marginTop: 1 }} />
                    <span style={{ fontSize: 12, color: '#3A332C', fontWeight: 500, lineHeight: 1.35 }}>
                      {r}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Join CTA */}
            <button
              className="pp-item"
              onClick={() => setJoined((j) => !j)}
              style={{
                animationDelay: '280ms',
                width: '100%',
                height: 50,
                borderRadius: 14,
                background: joined ? '#FFFFFF' : accent,
                color: joined ? accent : '#FFFFFF',
                border: joined ? `1px solid ${accent}` : 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: 'pointer',
                boxShadow: joined ? 'none' : `0 6px 16px ${accent}40`,
              }}
            >
              {joined ? (
                <>
                  <Check size={15} strokeWidth={2.4} />
                  Joined · You'll see pack walks
                </>
              ) : (
                <>
                  <Plus size={15} strokeWidth={2.4} />
                  Join {pack.name}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}

function Stat({ Icon, value, label, accent }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Icon size={13} color={accent} strokeWidth={2.2} />
      <div style={{ fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', lineHeight: 1, marginTop: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: '#76767D', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}
