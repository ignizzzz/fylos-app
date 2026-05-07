import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, MapPin, BookOpen, Sparkles, Heart, Share2 } from 'lucide-react';

/**
 * MemoryOfTheWeekSheet — long-form curated essay, weekly pick.
 * Different rhythm from the auto-generated artifacts: human-written, slow,
 * photo-led. Opens from a "Memory of the week" entry on the Feed sub-tab.
 */

const getMount = () =>
  typeof document !== 'undefined'
    ? document.getElementById('fylos-phone-root') || document.body
    : null;

const DEFAULT_MEMORY = {
  series: 'Sunday Reads',
  issue: 'Issue 14',
  title: 'Sundays at Filopappou',
  subtitle: "How a hill in Athens became the city's softest waiting room.",
  heroPhoto: 'https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?w=1200&h=675&fit=crop',
  location: 'Filopappou Hill · Athens',
  readTime: '4 min read',
  author: 'Curated by the Fylos team',
  paragraphs: [
    "Every Sunday, before the sun is fully up, the hill fills with a quiet trickle of people and pets. Nobody calls them. The hill calls them.",
    "There's a couple with a senior beagle who walks the same route at the same pace, three loops, never four. There's the trainer with two retrievers who run the bench-line as if it were a track. There's the grandmother whose terrier has a sweater for every season; she pretends the sweater is for the dog.",
    "Half-greetings from across the trail. The unspoken etiquette of off-leash people who know each other's dogs better than each other. By the time the city wakes, the hill is empty again — only paw prints and a small accumulation of joy.",
  ],
  featuredPet: {
    name: 'Coco',
    archetype: 'The Philosopher',
    avatar: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=300&h=300&fit=crop',
    line: 'Senior whippet · regular at the hill since 2022',
  },
  reactions: 412,
};

export default function MemoryOfTheWeekSheet({ open, onClose, memory = DEFAULT_MEMORY, onOpenPersonality }) {
  useEffect(() => {
    if (open) {
      const prev = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      return () => { document.body.style.overflow = prev; };
    }
  }, [open]);

  const mount = getMount();
  if (!open || !mount) return null;

  const markup = (
    <>
      <style>{`
        @keyframes mw-overlay-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes mw-sheet-in {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes mw-item-in {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .mw-overlay { animation: mw-overlay-in 200ms ease forwards; }
        .mw-sheet { animation: mw-sheet-in 360ms cubic-bezier(0.32, 0.72, 0, 1) forwards; }
        .mw-item { opacity: 0; animation: mw-item-in 360ms cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}</style>

      <div
        className="mw-overlay"
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
          className="mw-sheet"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: '100%',
            maxHeight: '92%',
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
              <BookOpen size={11} strokeWidth={2.4} />
              {memory.series} · {memory.issue}
            </div>
            <button
              onClick={onClose}
              aria-label="Close"
              style={{ width: 32, height: 32, borderRadius: 9999, background: '#F7F5F2', border: '1px solid rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#111' }}
            >
              <X size={15} strokeWidth={2.2} />
            </button>
          </div>

          <div style={{ overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
            {/* Hero photo */}
            <div className="mw-item" style={{ animationDelay: '40ms', padding: '0 20px' }}>
              <img
                src={memory.heroPhoto}
                alt={memory.title}
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

            <div style={{ padding: '20px 22px 24px', display: 'flex', flexDirection: 'column', gap: 14 }}>
              {/* Title block */}
              <div className="mw-item" style={{ animationDelay: '90ms' }}>
                <div
                  style={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: '#111',
                    letterSpacing: '-0.022em',
                    lineHeight: 1.15,
                    marginBottom: 6,
                  }}
                >
                  {memory.title}
                </div>
                <div
                  style={{
                    fontSize: 14,
                    color: '#3A332C',
                    lineHeight: 1.45,
                    fontStyle: 'italic',
                    marginBottom: 10,
                  }}
                >
                  {memory.subtitle}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap', fontSize: 11, color: '#76767D', fontWeight: 500 }}>
                  <MapPin size={11} color="#E85D2A" strokeWidth={2.2} />
                  {memory.location}
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{memory.readTime}</span>
                  <span style={{ opacity: 0.5 }}>·</span>
                  <span>{memory.author}</span>
                </div>
              </div>

              {/* Body */}
              <div className="mw-item" style={{ animationDelay: '160ms', display: 'flex', flexDirection: 'column', gap: 14 }}>
                {memory.paragraphs.map((p, i) => (
                  <p
                    key={i}
                    style={{
                      fontSize: 14.5,
                      color: '#1A1614',
                      lineHeight: 1.62,
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {/* Drop-cap on first paragraph */}
                    {i === 0 ? (
                      <>
                        <span
                          style={{
                            fontSize: 36,
                            fontWeight: 700,
                            color: '#E85D2A',
                            float: 'left',
                            lineHeight: 0.9,
                            paddingRight: 6,
                            paddingTop: 2,
                            letterSpacing: '-0.02em',
                          }}
                        >
                          {p[0]}
                        </span>
                        {p.slice(1)}
                      </>
                    ) : (
                      p
                    )}
                  </p>
                ))}
              </div>

              {/* Featured pet card */}
              {memory.featuredPet && (
                <button
                  className="mw-item"
                  onClick={() => onOpenPersonality?.({ name: memory.featuredPet.name, avatar: memory.featuredPet.avatar })}
                  style={{
                    animationDelay: '220ms',
                    background: '#FBE7DD',
                    border: '1px solid rgba(232,93,42,0.16)',
                    borderRadius: 16,
                    padding: 14,
                    width: '100%',
                    textAlign: 'left',
                    cursor: 'pointer',
                  }}
                >
                  <div style={{ fontSize: 9, fontWeight: 700, color: '#E85D2A', letterSpacing: '0.22em', textTransform: 'uppercase', marginBottom: 10 }}>
                    Featured in this issue
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <img
                      src={memory.featuredPet.avatar}
                      alt={memory.featuredPet.name}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: 9999,
                        objectFit: 'cover',
                        border: '2.5px solid #FFF',
                        boxShadow: '0 3px 8px rgba(232,93,42,0.18)',
                      }}
                    />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, flexWrap: 'wrap' }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: '#111', letterSpacing: '-0.018em' }}>
                          {memory.featuredPet.name}
                        </span>
                        <span style={{ fontSize: 11, fontWeight: 600, color: '#E85D2A', fontStyle: 'italic' }}>
                          {memory.featuredPet.archetype}
                        </span>
                      </div>
                      <div style={{ fontSize: 11.5, color: '#7A2F12', marginTop: 3, lineHeight: 1.35 }}>
                        {memory.featuredPet.line}
                      </div>
                    </div>
                  </div>
                </button>
              )}

              {/* Footer actions */}
              <div className="mw-item" style={{ animationDelay: '280ms', display: 'flex', alignItems: 'center', gap: 8, paddingTop: 4 }}>
                <button
                  style={{
                    flex: 1,
                    height: 46,
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
                  <Heart size={14} strokeWidth={2.2} color="#E85D2A" />
                  {memory.reactions} loved this
                </button>
                <button
                  style={{
                    flex: 1,
                    height: 46,
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
                  <Share2 size={14} strokeWidth={2.2} />
                  Share
                </button>
              </div>

              <div className="mw-item" style={{ animationDelay: '340ms', display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', background: '#FFF7F2', border: '1px dashed #F2D6C5', borderRadius: 12 }}>
                <Sparkles size={13} color="#E85D2A" strokeWidth={2.2} />
                <span style={{ fontSize: 11.5, color: '#7A2F12', fontWeight: 500, lineHeight: 1.4 }}>
                  Sunday Reads · curated by humans, not algorithms. New issue every week.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  return createPortal(markup, mount);
}
