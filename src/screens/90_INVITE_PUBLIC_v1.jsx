import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Check, Clock, MapPin, CalendarDays } from 'lucide-react';

/**
 * Public Invite Page — /invite/:inviteId
 * Partiful-style, mobile-first. Renders OUTSIDE the iPhone frame.
 * Non-users can RSVP without installing anything. The app is a reward for AFTER the playdate.
 *
 * This page IS the viral loop. Every playdate creates one URL; every URL brings one non-user in.
 */

// Demo data — keyed by inviteId. In production these would come from a lookup.
const DEMO_INVITES = {
  'demo-001': {
    id: 'demo-001',
    fromDog: {
      name: 'Luna',
      breed: 'Golden Retriever',
      photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=800&q=70',
    },
    toDog: { name: 'Buddy' },
    hostOwner: 'Talita',
    place: 'Seefeld Park',
    placeDetail: 'Lake entrance, by the willow',
    dateStr: 'Saturday',
    dateLong: 'Sat · Apr 27 · 2026',
    timeStr: '10:00 AM',
    pastTags: ['🎾 Loved fetch', '😌 Calm buddy', '🐾 Great vibes'],
    packNumber: '047',
    city: 'ZÜRICH',
  },
};

export default function InvitePublicScreen() {
  const { inviteId } = useParams();
  const invite = DEMO_INVITES[inviteId] || DEMO_INVITES['demo-001'];
  const [rsvp, setRsvp] = useState(null); // null | 'yes' | 'maybe'

  return (
    <div
      className="min-h-screen w-full flex flex-col"
      style={{
        backgroundColor: '#F5EFE8',
        fontFamily: 'Inter, -apple-system, sans-serif',
        color: '#2B2420',
        backgroundImage:
          'radial-gradient(ellipse at 30% 0%, rgba(255,255,255,0.85) 0%, rgba(245,239,232,0) 50%),' +
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.49 0 0 0 0 0.38 0 0 0 0 0.28 0 0 0 0.07 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
        backgroundRepeat: 'no-repeat, repeat',
        backgroundSize: 'auto, 200px 200px',
      }}
    >
      <main className="flex-1 mx-auto w-full max-w-[520px] px-6 pt-10 pb-40">
        {/* Postmark row */}
        <div className="flex items-center justify-between">
          <span
            style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.26em',
              color: '#8E7A6B',
              fontWeight: 500,
            }}
          >
            FYLOS · INVITATION
          </span>
          <span
            style={{
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.26em',
              color: '#8E7A6B',
              fontWeight: 500,
            }}
          >
            {invite.city} · {invite.dateLong}
          </span>
        </div>

        {/* Stamp-framed photo */}
        <div className="mt-7 relative">
          <div
            className="rounded-[20px] overflow-hidden"
            style={{
              border: '3px solid #FFFFFF',
              boxShadow: '0 22px 52px rgba(49, 33, 20, 0.22), inset 0 0 0 1px #D9CEC0',
              backgroundColor: '#EDE3D4',
            }}
          >
            <div className="aspect-[4/5]">
              <img
                src={invite.fromDog.photo}
                alt={invite.fromDog.name}
                className="w-full h-full object-cover"
                draggable={false}
              />
            </div>
          </div>
          {/* Pack # corner card */}
          <div
            className="absolute -bottom-3 right-4 px-3 py-1.5 rounded-full"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9CEC0',
              boxShadow: '0 4px 12px rgba(49, 33, 20, 0.08)',
              fontFamily: '"JetBrains Mono", ui-monospace, monospace',
              fontSize: 10,
              letterSpacing: '0.22em',
              color: '#9A5A3E',
              fontWeight: 600,
            }}
          >
            PACK #{invite.packNumber}
          </div>
        </div>

        {/* Display headline */}
        <h1
          className="mt-10 leading-[1.05]"
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 48,
            fontWeight: 400,
            color: '#2B2420',
          }}
        >
          <span className="italic">{invite.fromDog.name}</span>{' '}
          <span>would like to walk with</span>{' '}
          <span className="italic">{invite.toDog.name}</span>
          <span style={{ color: '#E85D2A' }}>.</span>
        </h1>

        {/* Info rows */}
        <div className="mt-6 space-y-3">
          <InfoRow icon={CalendarDays} label={`${invite.dateStr}`} value={invite.timeStr} />
          <InfoRow icon={MapPin} label={invite.place} value={invite.placeDetail} />
          <InfoRow icon={Clock} label="Suggested by" value={invite.hostOwner} />
        </div>

        {/* Vibe strip */}
        {invite.pastTags?.length > 0 && (
          <div className="mt-8">
            <div
              className="mb-2"
              style={{
                fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                fontSize: 10,
                letterSpacing: '0.22em',
                color: '#8E7A6B',
                fontWeight: 500,
              }}
            >
              {invite.fromDog.name.toUpperCase()} · TAGS FROM PAST WALKS
            </div>
            <div className="h-px bg-[#E4DDD3] mb-3" />
            <div className="flex flex-wrap gap-1.5">
              {invite.pastTags.map((t, i) => (
                <span
                  key={i}
                  style={{
                    backgroundColor: '#F3EFEB',
                    color: '#9A5A3E',
                    border: '1px solid #E4DDD3',
                    fontSize: 12,
                    fontWeight: 600,
                    padding: '6px 12px',
                    borderRadius: 999,
                  }}
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* RSVP state message (after click) */}
        {rsvp && (
          <div
            className="mt-10 p-4 rounded-[14px] flex items-start gap-3"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #E4DDD3',
              boxShadow: '0 4px 16px rgba(49, 33, 20, 0.06)',
            }}
          >
            <div
              className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center"
              style={{ backgroundColor: '#F3EFEB' }}
            >
              <Check size={16} color="#E85D2A" />
            </div>
            <div className="flex-1">
              <p
                style={{
                  fontFamily: '"Instrument Serif", Georgia, serif',
                  fontSize: 18,
                  color: '#2B2420',
                  lineHeight: 1.2,
                }}
              >
                {rsvp === 'yes' ? 'You\u2019re in.' : 'Maybe noted.'}
              </p>
              <p
                className="mt-1"
                style={{
                  fontFamily: '"JetBrains Mono", ui-monospace, monospace',
                  fontSize: 10,
                  letterSpacing: '0.18em',
                  color: '#8E7A6B',
                }}
              >
                {rsvp === 'yes'
                  ? 'A CONFIRMATION WAS SENT TO YOUR PHONE.'
                  : `WE'LL LET ${invite.hostOwner.toUpperCase()} KNOW.`}
              </p>
            </div>
          </div>
        )}
      </main>

      {/* Sticky bottom CTAs */}
      <footer
        className="fixed bottom-0 inset-x-0 px-6 pt-4 pb-[calc(env(safe-area-inset-bottom,0px)+16px)]"
        style={{
          background:
            'linear-gradient(to top, #F5EFE8 0%, #F5EFE8 70%, rgba(245, 239, 232, 0) 100%)',
        }}
      >
        <div className="mx-auto max-w-[520px] flex gap-2.5">
          <button
            onClick={() => setRsvp('maybe')}
            className="flex-[0.45] h-[56px] rounded-[16px] active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9CEC0',
              color: '#6E6058',
              fontSize: 15,
              fontWeight: 600,
            }}
          >
            Maybe — tell {invite.hostOwner}
          </button>
          <button
            onClick={() => setRsvp('yes')}
            className="flex-1 h-[56px] rounded-[16px] active:scale-[0.98] transition-transform"
            style={{
              backgroundColor: rsvp === 'yes' ? '#C04C1F' : '#E85D2A',
              color: '#FFFFFF',
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 8px 20px rgba(232, 93, 42, 0.22)',
            }}
          >
            {rsvp === 'yes' ? 'Confirmed · Saved to calendar' : 'Yes, we\u2019ll come'}
          </button>
        </div>
        <p
          className="mt-3 text-center"
          style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 9,
            letterSpacing: '0.22em',
            color: '#8E7A6B',
          }}
        >
          NO ACCOUNT NEEDED · RSVP TAKES 5 SECONDS
        </p>
      </footer>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-start gap-3">
      <div
        className="shrink-0 w-9 h-9 rounded-full flex items-center justify-center"
        style={{ backgroundColor: '#F3EFEB', border: '1px solid #E4DDD3' }}
      >
        <Icon size={15} color="#9A5A3E" strokeWidth={1.75} />
      </div>
      <div className="min-w-0 flex-1 pt-1">
        <div
          style={{
            fontFamily: '"JetBrains Mono", ui-monospace, monospace',
            fontSize: 10,
            letterSpacing: '0.22em',
            color: '#8E7A6B',
            fontWeight: 500,
            textTransform: 'uppercase',
          }}
        >
          {label}
        </div>
        <div
          className="mt-0.5"
          style={{
            fontFamily: '"Instrument Serif", Georgia, serif',
            fontSize: 20,
            color: '#2B2420',
            lineHeight: 1.2,
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );
}
