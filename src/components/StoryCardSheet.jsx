import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import {
  X,
  PawPrint,
  MapPin,
  Sparkles,
  CalendarClock,
  Footprints,
  Heart,
} from 'lucide-react';

/**
 * StoryCardSheet — captures or displays a playdate "story".
 *
 * Two modes:
 *   - mode="wrap-up"  → after-action capture flow (rate vibe, write note, save)
 *   - mode="view"     → display an existing story (name + place + vibe + bond progress)
 *
 * Opens from:
 *   - "How was it with Buddy?" prompt in Pack > Playdates
 *   - Tap on a Feed post in Pack > Feed (view mode)
 *   - Recent sessions list anywhere
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const VIBE_OPTIONS = [
  { rating: 5, label: 'Loved it', color: '#E85D2A' },
  { rating: 4, label: 'Liked it', color: '#D88E1A' },
  { rating: 3, label: 'OK',       color: '#76767D' },
  { rating: 2, label: 'Off day',  color: '#A0421C' },
];

const PLACE_SUGGESTIONS = [
  'Pedion tou Areos',
  'Filopappou Hill',
  'Schinias Beach',
  'Plaka Square',
];

export default function StoryCardSheet({ open, onClose, mode = 'wrap-up', story, onSave }) {
  const [vibe, setVibe] = useState(5);
  const [note, setNote] = useState('');
  const [place, setPlace] = useState('');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Lock body scroll while open + reset state when reopened
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      // reset on open
      setSaving(false);
      setSaved(false);
      if (mode === 'wrap-up') {
        setVibe(5);
        setNote('');
        setPlace(story?.place || '');
      }
      return () => {
        document.body.style.overflow = prev;
      };
    }
  }, [open, mode, story?.place]);

  const mount = getMount();
  if (!open || !mount) return null;

  const partnerName = story?.partnerName || 'Buddy';
  const ownerLine = story?.ownerName ? `with ${story.ownerName}` : '';

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      onSave?.({ vibe, note, place: place || PLACE_SUGGESTIONS[0] });
      setTimeout(() => {
        onClose?.();
      }, 900);
    }, 600);
  };

  const renderWrapUp = () => (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Wrap up · Session
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
        {/* Partner card */}
        <div className="story-item" style={{ animationDelay: '40ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 6 }}>
            <img
              src={story?.partnerAvatar || 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop'}
              alt={partnerName}
              style={{ width: 52, height: 52, borderRadius: 9999, objectFit: 'cover', border: '2px solid #FFF', boxShadow: '0 3px 10px rgba(232,93,42,0.18)' }}
            />
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 11, color: '#8E7A6B', fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                Just played with
              </div>
              <div style={{ fontSize: 22, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
                {partnerName}
                {ownerLine && (
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#76767D', marginLeft: 6 }}>
                    {ownerLine}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Vibe selector — paw rating */}
        <div className="story-item" style={{ animationDelay: '100ms' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            How was the vibe?
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {VIBE_OPTIONS.map((v) => {
              const isActive = vibe === v.rating;
              return (
                <button
                  key={v.rating}
                  onClick={() => setVibe(v.rating)}
                  style={{
                    flex: 1,
                    padding: '12px 8px',
                    borderRadius: 14,
                    background: isActive ? '#FBE7DD' : '#FFFFFF',
                    border: `1px solid ${isActive ? v.color + '44' : 'rgba(0,0,0,0.06)'}`,
                    cursor: 'pointer',
                    transform: isActive ? 'scale(1.03)' : 'scale(1)',
                    transition: 'all 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <div style={{ display: 'flex', gap: 1 }}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <PawPrint
                        key={i}
                        size={11}
                        strokeWidth={2}
                        color={i < v.rating ? v.color : 'rgba(0,0,0,0.15)'}
                        fill={i < v.rating ? v.color : 'transparent'}
                      />
                    ))}
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isActive ? v.color : '#111' }}>
                    {v.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Place picker */}
        <div className="story-item" style={{ animationDelay: '160ms' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            Where did it happen?
          </div>
          <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {PLACE_SUGGESTIONS.map((p) => {
              const isActive = place === p;
              return (
                <button
                  key={p}
                  onClick={() => setPlace(p)}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: 5,
                    padding: '7px 12px',
                    borderRadius: 9999,
                    background: isActive ? '#111' : '#FFFFFF',
                    color: isActive ? '#FFFFFF' : '#111',
                    border: isActive ? '1px solid transparent' : '1px solid rgba(0,0,0,0.08)',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 180ms',
                  }}
                >
                  <MapPin size={11} strokeWidth={2.2} color={isActive ? '#FFF' : '#E85D2A'} />
                  {p}
                </button>
              );
            })}
          </div>
        </div>

        {/* Note input */}
        <div className="story-item" style={{ animationDelay: '220ms' }}>
          <div style={{ fontSize: 11, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: 10 }}>
            One line about it (optional)
          </div>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Two relaxed players. Lots of polite resets."
            rows={2}
            style={{
              width: '100%',
              padding: '12px 14px',
              borderRadius: 14,
              border: '1px solid rgba(0,0,0,0.08)',
              background: '#FFFFFF',
              color: '#111',
              fontSize: 13,
              fontFamily: 'Inter, sans-serif',
              fontStyle: 'italic',
              resize: 'none',
              outline: 'none',
            }}
          />
        </div>

        {/* Save button */}
        <button
          className="story-item"
          onClick={handleSave}
          disabled={saving || saved}
          style={{
            animationDelay: '280ms',
            width: '100%',
            height: 52,
            borderRadius: 14,
            background: saved ? '#34C759' : '#E85D2A',
            color: '#FFFFFF',
            border: 'none',
            fontSize: 14,
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 8,
            cursor: saving || saved ? 'default' : 'pointer',
            boxShadow: '0 6px 16px rgba(232,93,42,0.25)',
            transition: 'background 240ms',
          }}
        >
          {saved ? (
            <>
              <Heart size={15} strokeWidth={2.4} fill="currentColor" />
              Story saved
            </>
          ) : saving ? (
            'Saving…'
          ) : (
            <>
              <Sparkles size={15} strokeWidth={2.4} />
              Save story
            </>
          )}
        </button>
      </div>
    </>
  );

  const renderView = () => (
    <>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '6px 20px 14px' }}>
        <div style={{ fontSize: 10, fontWeight: 700, color: '#8E7A6B', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
          Story · {story?.date || 'Today'}
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
        {/* Title block */}
        <div className="story-item" style={{ animationDelay: '40ms' }}>
          <div style={{ fontSize: 28, fontWeight: 700, color: '#111', letterSpacing: '-0.022em', lineHeight: 1.05, marginBottom: 6 }}>
            {story?.title || 'Calm afternoon'}
            <span style={{ color: '#E85D2A' }}>.</span>
          </div>
          <div style={{ fontSize: 13, color: '#76767D', display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <MapPin size={12} strokeWidth={2} color="#E85D2A" />
            With {story?.partnerName || 'Buddy'} at {story?.place || 'Pedion tou Areos'}
          </div>
        </div>

        {/* Avatar pair */}
        <div className="story-item" style={{ animationDelay: '100ms' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ position: 'relative', width: 76, height: 48, flexShrink: 0 }}>
              <img
                src={story?.youAvatar || 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&h=200&fit=crop'}
                alt="you"
                style={{ position: 'absolute', left: 0, top: 0, width: 48, height: 48, borderRadius: 9999, objectFit: 'cover', border: '2.5px solid #FFF', boxShadow: '0 3px 10px rgba(0,0,0,0.06)', zIndex: 2 }}
              />
              <img
                src={story?.partnerAvatar || 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop'}
                alt="partner"
                style={{ position: 'absolute', left: 28, top: 0, width: 48, height: 48, borderRadius: 9999, objectFit: 'cover', border: '2.5px solid #FFF', boxShadow: '0 3px 10px rgba(0,0,0,0.06)', zIndex: 1 }}
              />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Vibe paws */}
              <div style={{ display: 'flex', gap: 2, marginBottom: 4 }}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <PawPrint
                    key={i}
                    size={14}
                    strokeWidth={2}
                    color={i < (story?.vibe || 5) ? '#E85D2A' : 'rgba(0,0,0,0.12)'}
                    fill={i < (story?.vibe || 5) ? '#E85D2A' : 'transparent'}
                  />
                ))}
              </div>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#76767D' }}>
                {story?.vibeLabel || 'Loved it'}
              </div>
            </div>
          </div>
        </div>

        {/* Note */}
        {story?.note && (
          <p
            className="story-item"
            style={{
              animationDelay: '160ms',
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
            "{story.note}"
          </p>
        )}

        {/* Stats */}
        <div
          className="story-item"
          style={{
            animationDelay: '200ms',
            background: '#FFFFFF',
            border: '1px solid rgba(0,0,0,0.06)',
            borderRadius: 14,
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Stat Icon={CalendarClock} value={story?.duration || '45 min'} label="time" />
          <span style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.06)' }} />
          <Stat Icon={Footprints} value={story?.distance || '2.1 km'} label="distance" />
          <span style={{ width: 1, height: 28, background: 'rgba(0,0,0,0.06)' }} />
          <Stat Icon={Heart} value={story?.bondLevel || 'Best Pals'} label="bond" />
        </div>

        {/* Bond progress */}
        {typeof story?.bondProgress === 'number' && (
          <div className="story-item" style={{ animationDelay: '240ms' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#76767D', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                Bond progress
              </span>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                Next · {story?.bondNext || 'Inseparable'}
              </span>
            </div>
            <div style={{ width: '100%', height: 5, borderRadius: 9999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
              <div style={{ width: `${story.bondProgress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #E85D2A, #7A2F12)', borderRadius: 9999 }} />
            </div>
          </div>
        )}
      </div>
    </>
  );

  const markup = (
    <>
      <style>{`
        @keyframes story-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes story-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes story-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .story-overlay { animation: story-overlay-in 200ms ease forwards; }
        .story-sheet { animation: story-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .story-item { opacity: 0; animation: story-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>
      <div
        className="story-overlay"
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
          className="story-sheet"
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

          {mode === 'wrap-up' ? renderWrapUp() : renderView()}
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}

function Stat({ Icon, value, label }) {
  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Icon size={13} color="#E85D2A" strokeWidth={2.2} />
      <div style={{ fontSize: 14, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', lineHeight: 1.1, marginTop: 4 }}>
        {value}
      </div>
      <div style={{ fontSize: 9, color: '#76767D', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
        {label}
      </div>
    </div>
  );
}
