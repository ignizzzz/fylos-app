import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, Hand, Sparkles, ArrowRight } from 'lucide-react';

/**
 * PetOfTheDaySheet — full view of the daily curated featured pet.
 * Opens from the "Featured today" section in Pack > Feed.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const DEFAULT_FEATURED = {
  name: 'Tao',
  breed: 'Border Collie',
  age: 4,
  archetype: 'The Spark',
  photo: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=600&h=600&fit=crop',
  badge: 'Most beloved this week',
  curatorNote: 'Loved by 47 humans this week. Always polite, even with the cat next door.',
  recent: { title: 'Calm afternoon', place: 'Pedion tou Areos', timeAgo: '2 days ago' },
  waves: 124,
  date: 'APR 27, 2026',
  weekday: 'Wednesday',
  location: 'Athens · Pagrati',
};

export default function PetOfTheDaySheet({ open, onClose, featured = DEFAULT_FEATURED, onOpenStory, onOpenPersonality }) {
  const [waves, setWaves] = useState(featured.waves || 0);
  const [waved, setWaved] = useState(false);

  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      setWaved(false);
      setWaves(featured.waves || 0);
      return () => { document.body.style.overflow = prev; };
    }
  }, [open, featured.waves]);

  const mount = getMount();
  if (!open || !mount) return null;

  const handleWave = () => {
    if (waved) return;
    setWaved(true);
    setWaves((n) => n + 1);
  };

  const markup = (
    <>
      <style>{`
        @keyframes potd-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes potd-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes potd-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes potd-wave-pop {
          0%   { transform: scale(1) rotate(0deg); }
          30%  { transform: scale(1.18) rotate(-12deg); }
          60%  { transform: scale(0.95) rotate(8deg); }
          100% { transform: scale(1) rotate(0deg); }
        }
        .potd-overlay { animation: potd-overlay-in 200ms ease forwards; }
        .potd-sheet { animation: potd-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .potd-item { opacity: 0; animation: potd-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
        .potd-wave-pop { animation: potd-wave-pop 520ms cubic-bezier(0.34, 1.56, 0.64, 1) both; }
      `}</style>

      <div
        className="potd-overlay"
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
          className="potd-sheet"
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
              Today · Featured
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
            {/* Date strip */}
            <div className="potd-item" style={{ animationDelay: '40ms', display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: 10, fontWeight: 700, color: '#76767D', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              <span>{featured.weekday}</span>
              <span>{featured.date}</span>
              <span>{(featured.location || '').split(' · ')[1] || featured.location}</span>
            </div>

            {/* Photo */}
            <div className="potd-item" style={{ animationDelay: '90ms' }}>
              <img
                src={featured.photo}
                alt={featured.name}
                style={{
                  width: '100%',
                  aspectRatio: '4 / 3',
                  objectFit: 'cover',
                  borderRadius: 18,
                  background: '#F1ECE6',
                  display: 'block',
                  boxShadow: '0 6px 16px rgba(0,0,0,0.06)',
                }}
              />
            </div>

            {/* Pet header — tappable to open Personality */}
            <button
              className="potd-item"
              onClick={() => onOpenPersonality?.({ name: featured.name, avatar: featured.photo })}
              style={{ animationDelay: '140ms', textAlign: 'left', background: 'transparent', border: 'none', padding: 0, cursor: 'pointer', width: '100%' }}
            >
              <div style={{ fontSize: 28, fontWeight: 700, color: '#111', letterSpacing: '-0.022em', lineHeight: 1.05, marginBottom: 4 }}>
                {featured.name}
                <span style={{ color: '#E85D2A' }}>.</span>
              </div>
              <div style={{ fontSize: 13, color: '#76767D', fontWeight: 500, marginBottom: 10 }}>
                {featured.archetype} · {featured.breed} · {featured.age} yrs
              </div>
              <span
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 5,
                  padding: '5px 11px',
                  borderRadius: 9999,
                  background: '#FBE7DD',
                  color: '#7A2F12',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                <span style={{ width: 4, height: 4, borderRadius: 9999, background: '#E85D2A' }} />
                {featured.badge}
              </span>
            </button>

            {/* Curator's note */}
            <div className="potd-item" style={{ animationDelay: '190ms' }}>
              <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                Curator's note
              </div>
              <p
                style={{
                  fontSize: 14,
                  color: '#3A332C',
                  lineHeight: 1.45,
                  fontStyle: 'italic',
                  padding: '12px 14px',
                  background: '#F7F5F2',
                  borderRadius: 14,
                  border: '1px solid #EDE8E2',
                }}
              >
                "{featured.curatorNote}"
              </p>
            </div>

            {/* Recent story */}
            {featured.recent && (
              <div className="potd-item" style={{ animationDelay: '240ms' }}>
                <div style={{ fontSize: 9, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 8 }}>
                  Recent
                </div>
                <button
                  onClick={() =>
                    onOpenStory?.({
                      title: featured.recent.title,
                      partnerName: featured.name,
                      partnerAvatar: featured.photo,
                      place: featured.recent.place,
                      date: featured.recent.timeAgo,
                      vibe: 5,
                      vibeLabel: 'Loved it',
                      note: featured.curatorNote,
                    })
                  }
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '12px 14px',
                    background: '#FFFFFF',
                    border: '1px solid rgba(0,0,0,0.06)',
                    borderRadius: 14,
                    cursor: 'pointer',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.1 }}>
                      {featured.recent.title}.
                    </div>
                    <div style={{ fontSize: 11, color: '#76767D', marginTop: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
                      <MapPin size={11} color="#E85D2A" strokeWidth={2} />
                      {featured.recent.place}
                      <span style={{ opacity: 0.5 }}>·</span>
                      <span>{featured.recent.timeAgo}</span>
                    </div>
                  </div>
                  <ArrowRight size={15} color="#E85D2A" strokeWidth={2.2} />
                </button>
              </div>
            )}

            {/* Wave button */}
            <button
              className="potd-item"
              onClick={handleWave}
              disabled={waved}
              style={{
                animationDelay: '290ms',
                width: '100%',
                height: 52,
                borderRadius: 14,
                background: waved ? '#FBE7DD' : '#E85D2A',
                color: waved ? '#7A2F12' : '#FFFFFF',
                border: waved ? '1px dashed rgba(0,0,0,0.12)' : 'none',
                fontSize: 14,
                fontWeight: 600,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                cursor: waved ? 'default' : 'pointer',
                boxShadow: waved ? 'none' : '0 6px 16px rgba(232,93,42,0.25)',
              }}
            >
              <Hand size={15} strokeWidth={2.4} className={waved ? '' : 'potd-wave-pop'} />
              {waved ? `Waved · ${waves} total` : `Send ${featured.name} a wave · ${waves}`}
            </button>

            <div className="potd-item" style={{ animationDelay: '340ms', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFF7F2', border: '1px dashed #F2D6C5', borderRadius: 12 }}>
              <Sparkles size={13} color="#E85D2A" strokeWidth={2.2} />
              <span style={{ fontSize: 11.5, color: '#7A2F12', fontWeight: 500, lineHeight: 1.4 }}>
                Featured slot rotates daily. Curated, not algorithmic.
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}
