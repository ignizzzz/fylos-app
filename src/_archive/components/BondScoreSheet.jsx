import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Crown, Heart, Users } from 'lucide-react';

/**
 * BondScoreSheet — full friendship ladder for the user's pet across 5 tiers.
 * Opens from the "View all bonds" entry below the Pack constellation.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const BOND_TIERS = [
  { id: 'lifelong',    label: 'Lifelong',    minSessions: 31 },
  { id: 'inseparable', label: 'Inseparable', minSessions: 16 },
  { id: 'best-pals',   label: 'Best Pals',   minSessions: 6  },
  { id: 'pals',        label: 'Pals',        minSessions: 3  },
  { id: 'new-friends', label: 'New Friends', minSessions: 1  },
];

// Default bonds for Leo (the user's pet) — gets used when no friends prop passed.
const DEFAULT_BONDS = {
  inseparable: [
    { name: 'Bruno', avatar: 'https://images.unsplash.com/photo-1568572933382-74d440642117?w=200&h=200&fit=crop', sessions: 23, moment: 'Trail buddies since Jan 2026', progress: 0.85, nextLevel: 'Lifelong' },
  ],
  'best-pals': [
    { name: 'Max',  avatar: 'https://images.unsplash.com/photo-1605568427561-40dd23c2acea?w=200&h=200&fit=crop', sessions: 12, moment: 'Calm afternoons',            progress: 0.75, nextLevel: 'Inseparable' },
    { name: 'Tao',  avatar: 'https://images.unsplash.com/photo-1558788353-f76d92427f16?w=200&h=200&fit=crop',  sessions: 11, moment: 'Beach buddies',              progress: 0.65, nextLevel: 'Inseparable' },
  ],
  pals: [
    { name: 'Coco', avatar: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=200&h=200&fit=crop',  sessions: 5, moment: 'Quiet hour at Filopappou',    progress: 0.55, nextLevel: 'Best Pals' },
    { name: 'Luna', avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=200&h=200&fit=crop', sessions: 4, moment: 'Slow park strolls',         progress: 0.45, nextLevel: 'Best Pals' },
  ],
  'new-friends': [
    { name: 'Rocco', avatar: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=200&h=200&fit=crop', sessions: 2, moment: 'Park introduction',         progress: 0.3, nextLevel: 'Pals' },
  ],
};

export default function BondScoreSheet({ open, onClose, petName = 'Leo', petAvatar, bonds = DEFAULT_BONDS, onOpenPersonality }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = getMount();
  if (!open || !mount) return null;

  const totalFriends = Object.values(bonds).reduce((sum, list) => sum + (list?.length || 0), 0);
  const topTier = BOND_TIERS.find((t) => bonds[t.id] && bonds[t.id].length > 0);
  const topBond = topTier ? bonds[topTier.id][0] : null;

  const markup = (
    <>
      <style>{`
        @keyframes bond-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes bond-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes bond-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .bond-overlay { animation: bond-overlay-in 200ms ease forwards; }
        .bond-sheet { animation: bond-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .bond-item { opacity: 0; animation: bond-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div
        className="bond-overlay"
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
          className="bond-sheet"
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
              Bonds
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
            {/* Friend count headline */}
            <div className="bond-item" style={{ animationDelay: '40ms', display: 'flex', alignItems: 'baseline', gap: 8 }}>
              <span style={{ fontSize: 30, fontWeight: 700, color: '#111', letterSpacing: '-0.022em', lineHeight: 1 }}>
                {totalFriends}
              </span>
              <span style={{ fontSize: 13, color: '#76767D', fontWeight: 500 }}>
                {totalFriends === 1 ? 'friend' : 'friends'} in {petName}'s pack
              </span>
            </div>

            {/* Top bond highlight */}
            {topBond && (
              <button
                className="bond-item"
                onClick={() => onOpenPersonality?.({ name: topBond.name, avatar: topBond.avatar })}
                style={{
                  animationDelay: '90ms',
                  position: 'relative',
                  background: '#FBE7DD',
                  borderRadius: 18,
                  padding: 14,
                  border: '1px solid rgba(232,93,42,0.16)',
                  overflow: 'hidden',
                  textAlign: 'left',
                  cursor: 'pointer',
                  width: '100%',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#7A2F12', letterSpacing: '0.18em', textTransform: 'uppercase', display: 'flex', alignItems: 'center', gap: 5 }}>
                    <Crown size={11} color="#E85D2A" strokeWidth={2.4} /> Top bond
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#7A2F12', letterSpacing: '0.18em', textTransform: 'uppercase' }}>
                    {topTier.label} · {topBond.sessions} ses
                  </span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ position: 'relative', width: 70, height: 44, flexShrink: 0 }}>
                    {petAvatar && (
                      <img
                        src={petAvatar}
                        alt={petName}
                        style={{ position: 'absolute', left: 0, top: 0, width: 44, height: 44, borderRadius: 9999, objectFit: 'cover', border: '2.5px solid #FFF', boxShadow: '0 3px 8px rgba(0,0,0,0.06)', zIndex: 2 }}
                      />
                    )}
                    <img
                      src={topBond.avatar}
                      alt={topBond.name}
                      style={{ position: 'absolute', left: 26, top: 0, width: 44, height: 44, borderRadius: 9999, objectFit: 'cover', border: '2.5px solid #FFF', boxShadow: '0 3px 8px rgba(0,0,0,0.06)', zIndex: 1 }}
                    />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 17, fontWeight: 700, color: '#111', letterSpacing: '-0.018em', lineHeight: 1.1 }}>
                      {petName} &amp; {topBond.name}
                    </div>
                    <div style={{ fontSize: 11.5, color: '#7A2F12', marginTop: 3, fontStyle: 'italic' }}>
                      "{topBond.moment}"
                    </div>
                  </div>
                </div>
                {/* Bond progress */}
                <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#7A2F12', letterSpacing: '0.16em', textTransform: 'uppercase', opacity: 0.7 }}>
                    Currently {topTier.label}
                  </span>
                  <span style={{ fontSize: 9, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                    Next · {topBond.nextLevel}
                  </span>
                </div>
                <div style={{ width: '100%', height: 5, borderRadius: 9999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                  <div style={{ width: `${topBond.progress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #E85D2A, #7A2F12)' }} />
                </div>
              </button>
            )}

            {/* Tiers list */}
            {BOND_TIERS.map((tier, ti) => {
              const isTop = topTier && topTier.id === tier.id;
              const friends = bonds[tier.id] || [];
              const visible = isTop ? friends.slice(1) : friends;
              if (visible.length === 0) return null;

              return (
                <div key={tier.id} className="bond-item" style={{ animationDelay: `${140 + ti * 50}ms` }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, margin: '0 0 8px', paddingLeft: 4 }}>
                    <span style={{ fontSize: 9, fontWeight: 700, color: '#76767D', letterSpacing: '0.22em', textTransform: 'uppercase' }}>
                      {tier.label}
                    </span>
                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minWidth: 18, height: 18, padding: '0 6px', borderRadius: 9999, background: '#E85D2A', color: '#FFF', fontSize: 9, fontWeight: 700 }}>
                      {visible.length}
                    </span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(0,0,0,0.08)' }} />
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {visible.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => onOpenPersonality?.({ name: f.name, avatar: f.avatar })}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 12,
                          padding: '10px 12px',
                          background: '#FFFFFF',
                          border: '1px solid rgba(0,0,0,0.04)',
                          borderRadius: 14,
                          textAlign: 'left',
                          cursor: 'pointer',
                          width: '100%',
                        }}
                      >
                        <img
                          src={f.avatar}
                          alt={f.name}
                          style={{ width: 36, height: 36, borderRadius: 9999, objectFit: 'cover', flexShrink: 0, border: '2px solid #FFF', boxShadow: '0 2px 6px rgba(232,93,42,0.18)' }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 14, fontWeight: 600, color: '#111', lineHeight: 1.05, marginBottom: 2 }}>
                            {f.name}
                          </div>
                          <div style={{ fontSize: 11, color: '#76767D', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            {f.moment}
                          </div>
                          <div style={{ marginTop: 4, display: 'flex', alignItems: 'center', gap: 8 }}>
                            <div style={{ flex: 1, height: 3, borderRadius: 9999, background: 'rgba(0,0,0,0.06)', overflow: 'hidden' }}>
                              <div style={{ width: `${f.progress * 100}%`, height: '100%', background: 'linear-gradient(90deg, #E85D2A, #7A2F12)' }} />
                            </div>
                            <span style={{ fontSize: 9, fontWeight: 700, color: '#8E8E93', letterSpacing: '0.12em', textTransform: 'uppercase', whiteSpace: 'nowrap' }}>
                              {f.sessions} ses · → {f.nextLevel}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              );
            })}

            {totalFriends === 0 && (
              <div style={{ padding: '22px 18px', textAlign: 'center', color: '#76767D', fontSize: 13, background: '#F7F5F2', border: '1px solid #EDE8E2', borderRadius: 14 }}>
                <Users size={18} color="#E85D2A" strokeWidth={2} style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 14, fontWeight: 600, color: '#111', marginBottom: 4 }}>No bonds yet</div>
                <div>Schedule a playdate to start building {petName}'s pack.</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}
