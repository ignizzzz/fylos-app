import React, { useState, useEffect, useRef } from 'react';
import {
  ChevronLeft,
  Phone,
  MapPin,
  Heart,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  Plus,
  X,
  Clock,
  Shield,
  Star,
  Check,
  Info,
  Circle,
  Navigation,
  PawPrint
} from 'lucide-react';

/* ─── THEME ─── */
const THEME = {
  colors: {
    accent: '#E85D2A', accentHover: '#D04A1C',
    primaryText: '#111111', secondaryText: '#6E6E73', tertiaryText: '#8E8E93',
    background: '#F9F9FB', surface: '#FFFFFF', surfaceAlt: '#F2F2F7',
    danger: '#FF3B30', success: '#00C060', warning: '#FF9500', info: '#007AFF', divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)', floating: '0 8px 24px rgba(0,0,0,0.08)' },
  motion: { tap: '120ms', fade: '200ms', tab: '240ms', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
};

/* ─── MOCK DATA ─── */
const MOCK_ALERTS = [
  { id: 1, location: 'Seefeld Park', time: '12 min ago', type: 'Poison bait' },
  { id: 2, location: 'Bellevue area', time: '45 min ago', type: 'Suspicious food' },
  { id: 3, location: 'Zürichberg trail', time: '2h ago', type: 'Poison bait' },
];

const MOCK_CONTACTS = [
  { id: 1, name: 'Tierklinik Zürich', phone: '+41 44 635 81 11' },
];

const FIRST_AID = [
  {
    id: 'toxic',
    title: 'My pet ate something toxic',
    steps: [
      'Do NOT induce vomiting unless told by a vet',
      'Note the substance, amount, and time ingested',
      'Call your vet or poison control immediately',
      'Bring packaging or a photo of the substance',
    ],
  },
  {
    id: 'choking',
    title: 'My pet is choking',
    steps: [
      'Stay calm and restrain your pet gently',
      'Open mouth carefully and look for the object',
      'Sweep mouth with finger if object is visible',
      'If stuck, perform modified Heimlich maneuver',
      'Rush to vet if you cannot dislodge it',
    ],
  },
  {
    id: 'bleeding',
    title: 'My pet is bleeding',
    steps: [
      'Apply firm pressure with a clean cloth',
      'Elevate the wound above heart level if possible',
      'Do not remove the cloth — add layers if needed',
      'Go to the nearest vet clinic immediately',
    ],
  },
  {
    id: 'bitten',
    title: 'My pet was bitten',
    steps: [
      'Clean the area gently with warm water',
      'Check for swelling, redness, or puncture wounds',
      'Do not apply ointment without vet guidance',
      'Schedule a vet visit as soon as possible',
    ],
  },
];

/* ─── KEYFRAMES (injected once) ─── */
const STYLE_ID = 'emergency-sos-keyframes';
const injectStyles = () => {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes sos-pulse {
      0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,59,48,0.4); }
      50% { transform: scale(1.06); box-shadow: 0 0 0 14px rgba(255,59,48,0); }
    }
    @keyframes sos-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
  `;
  document.head.appendChild(style);
};

/* ─── SMALL COMPONENTS ─── */

const Accordion = ({ title, steps, icon: Icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <div
      style={{
        background: THEME.colors.surface,
        borderRadius: THEME.radius.medium,
        overflow: 'hidden',
        boxShadow: THEME.shadows.soft,
      }}
    >
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          padding: '14px 16px',
          border: 'none',
          background: 'none',
          cursor: 'pointer',
          textAlign: 'left',
        }}
      >
        {Icon && (
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: THEME.radius.small,
              background: `${THEME.colors.danger}10`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
            <Icon size={16} color={THEME.colors.danger} />
          </div>
        )}
        <span
          style={{
            flex: 1,
            fontSize: 15,
            fontWeight: 600,
            color: THEME.colors.primaryText,
            fontFamily: '"SF Pro Display", -apple-system, sans-serif',
          }}
        >
          {title}
        </span>
        <ChevronDown
          size={18}
          color={THEME.colors.tertiaryText}
          style={{
            transition: `transform ${THEME.motion.fade}`,
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
          }}
        />
      </button>

      <div
        style={{
          maxHeight: open ? 300 : 0,
          opacity: open ? 1 : 0,
          overflow: 'hidden',
          transition: `max-height 300ms ease, opacity ${THEME.motion.fade}`,
        }}
      >
        <div style={{ padding: '0 16px 14px 60px' }}>
          {steps.map((s, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                gap: 8,
                alignItems: 'flex-start',
                marginBottom: i < steps.length - 1 ? 8 : 0,
              }}
            >
              <span
                style={{
                  width: 20,
                  height: 20,
                  borderRadius: THEME.radius.full,
                  background: THEME.colors.surfaceAlt,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 11,
                  fontWeight: 700,
                  color: THEME.colors.secondaryText,
                  flexShrink: 0,
                  marginTop: 1,
                }}
              >
                {i + 1}
              </span>
              <span
                style={{
                  fontSize: 13,
                  lineHeight: '18px',
                  color: THEME.colors.secondaryText,
                  fontFamily: '"SF Pro Text", -apple-system, sans-serif',
                }}
              >
                {s}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ─── MAIN SCREEN ─── */
const EmergencySOS = () => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const scrollRef = useRef(null);

  useEffect(() => {
    injectStyles();
  }, []);

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    setContacts((prev) => [
      ...prev,
      { id: Date.now(), name: newName.trim(), phone: newPhone.trim() },
    ]);
    setNewName('');
    setNewPhone('');
    setShowAddContact(false);
  };

  const font = (size, weight = 400) => ({
    fontSize: size,
    fontWeight: weight,
    fontFamily: '"SF Pro Display", -apple-system, sans-serif',
  });

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
    <div
      className="relative"
      style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        border: '8px solid #000',
        overflow: 'hidden',
        backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        fontFamily: '"SF Pro Display", -apple-system, sans-serif',
      }}
    >
      {/* Notch */}
      <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

      {/* Home indicator */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

      {/* Status bar */}
      <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
        <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
        <div className="flex items-center gap-1">
          <svg width="17" height="12" viewBox="0 0 17 12" fill="none">
            <rect x="0" y="6" width="3" height="6" rx="1" fill="#111" />
            <rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111" />
            <rect x="9" y="2" width="3" height="10" rx="1" fill="#111" />
            <rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111" />
          </svg>
          <svg width="16" height="12" viewBox="0 0 16 12" fill="none">
            <path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111" />
            <path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <svg width="27" height="13" viewBox="0 0 27 13" fill="none">
            <rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35" />
            <rect x="2" y="2" width="16" height="9" rx="2" fill="#111" />
            <path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4" />
          </svg>
        </div>
      </div>

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={() => { window.history.back(); }}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Emergency</h2>
          {/* Right: Invisible spacer */}
          <div className="w-[44px]" />
        </div>
      </header>

      {/* Scrollable content */}
      <div
        ref={scrollRef}
        className="absolute inset-0 overflow-y-auto"
        style={{
          paddingTop: 54,
          paddingBottom: 40,
        }}
      >
        {/* ── Emergency Call Card ── */}
        <div style={{ padding: '0 20px 20px' }}>
          <div
            style={{
              background: THEME.colors.surface,
              borderRadius: 20,
              padding: 24,
              boxShadow: THEME.shadows.floating,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              animation: 'sos-fade-in 400ms ease',
            }}
          >
            {/* Pulsing phone icon */}
            <div
              style={{
                width: 64,
                height: 64,
                borderRadius: THEME.radius.full,
                background: THEME.colors.danger,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                animation: 'sos-pulse 2s ease-in-out infinite',
              }}
            >
              <Phone size={28} color="#fff" />
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ ...font(20, 600), color: THEME.colors.primaryText }}>
                Emergency Vet
              </div>
              <div
                style={{
                  ...font(15, 400),
                  color: THEME.colors.secondaryText,
                  marginTop: 2,
                }}
              >
                Tierklinik Zürich — 24h
              </div>
            </div>

            <button
              style={{
                width: '100%',
                padding: '14px 0',
                background: THEME.colors.danger,
                color: '#fff',
                border: 'none',
                borderRadius: THEME.radius.medium,
                ...font(16, 600),
                cursor: 'pointer',
                transition: `opacity ${THEME.motion.tap}`,
              }}
              onMouseDown={(e) => (e.currentTarget.style.opacity = 0.85)}
              onMouseUp={(e) => (e.currentTarget.style.opacity = 1)}
            >
              Call Now
            </button>
          </div>
        </div>

        {/* ── Quick Actions Row ── */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr 1fr',
            gap: 10,
            padding: '0 20px 24px',
          }}
        >
          {[
            {
              Icon: AlertCircle,
              label: 'Poison Control',
              sub: '+41 44 251 51 51',
              color: THEME.colors.warning,
            },
            {
              Icon: MapPin,
              label: 'Nearest Clinic',
              sub: '1.2 km',
              color: THEME.colors.info,
            },
            {
              Icon: Heart,
              label: 'First Aid Guide',
              sub: '',
              color: THEME.colors.danger,
            },
          ].map(({ Icon, label, sub, color }, i) => (
            <div
              key={i}
              style={{
                background: THEME.colors.surface,
                borderRadius: THEME.radius.medium,
                padding: 16,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 8,
                textAlign: 'center',
                boxShadow: THEME.shadows.soft,
                cursor: 'pointer',
                transition: `transform ${THEME.motion.tap}`,
              }}
              onMouseDown={(e) => (e.currentTarget.style.transform = 'scale(0.96)')}
              onMouseUp={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            >
              <div
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: THEME.radius.small,
                  background: `${color}12`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Icon size={20} color={color} />
              </div>
              <span
                style={{
                  ...font(12, 600),
                  color: THEME.colors.primaryText,
                  lineHeight: '16px',
                }}
              >
                {label}
              </span>
              {sub && (
                <span
                  style={{
                    ...font(11, 400),
                    color: THEME.colors.tertiaryText,
                    lineHeight: '14px',
                  }}
                >
                  {sub}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* ── Poison Bait Alerts ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              background: THEME.colors.surface,
              borderRadius: 20,
              padding: 20,
              boxShadow: THEME.shadows.soft,
            }}
          >
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: 14,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 16 }}>⚠️</span>
                <span style={{ ...font(16, 700), color: THEME.colors.primaryText }}>
                  Active Alerts Nearby
                </span>
              </div>
              <span
                style={{
                  ...font(12, 600),
                  color: THEME.colors.danger,
                  background: `${THEME.colors.danger}12`,
                  padding: '4px 10px',
                  borderRadius: THEME.radius.full,
                }}
              >
                3 within 2 km
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {MOCK_ALERTS.map((a) => (
                <div
                  key={a.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 12,
                    padding: '10px 12px',
                    background: THEME.colors.surfaceAlt,
                    borderRadius: THEME.radius.small,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: THEME.radius.full,
                      background: `${THEME.colors.warning}18`,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <AlertCircle size={16} color={THEME.colors.warning} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ ...font(14, 600), color: THEME.colors.primaryText }}>
                      {a.type}
                    </div>
                    <div style={{ ...font(12, 400), color: THEME.colors.tertiaryText }}>
                      {a.location}
                    </div>
                  </div>
                  <span style={{ ...font(11, 500), color: THEME.colors.tertiaryText, flexShrink: 0 }}>
                    {a.time}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={() => window.location.href = '/danger-reports'}
              style={{
                marginTop: 14,
                width: '100%',
                padding: '10px 0',
                background: 'none',
                border: `1.5px solid ${THEME.colors.divider}`,
                borderRadius: THEME.radius.small,
                ...font(14, 600),
                color: THEME.colors.info,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <MapPin size={15} />
              View Map
            </button>
          </div>
        </div>

        {/* ── First Aid Quick Guide ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              ...font(13, 600),
              color: THEME.colors.tertiaryText,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            First Aid Guide
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {FIRST_AID.map((item) => (
              <Accordion
                key={item.id}
                title={item.title}
                steps={item.steps}
                icon={
                  item.id === 'toxic'
                    ? AlertCircle
                    : item.id === 'choking'
                    ? Info
                    : item.id === 'bleeding'
                    ? Heart
                    : Shield
                }
              />
            ))}
          </div>
        </div>

        {/* ── Emergency Contacts ── */}
        <div style={{ padding: '0 20px 24px' }}>
          <div
            style={{
              ...font(13, 600),
              color: THEME.colors.tertiaryText,
              textTransform: 'uppercase',
              letterSpacing: 0.8,
              marginBottom: 10,
              paddingLeft: 4,
            }}
          >
            Your Emergency Contacts
          </div>

          <div
            style={{
              background: THEME.colors.surface,
              borderRadius: 20,
              overflow: 'hidden',
              boxShadow: THEME.shadows.soft,
            }}
          >
            {contacts.map((c, i) => (
              <div
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '14px 16px',
                  borderBottom:
                    i < contacts.length - 1 || showAddContact
                      ? `1px solid ${THEME.colors.divider}`
                      : 'none',
                }}
              >
                <div
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: THEME.radius.full,
                    background: `${THEME.colors.info}12`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  <Phone size={16} color={THEME.colors.info} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ ...font(15, 600), color: THEME.colors.primaryText }}>
                    {c.name}
                  </div>
                  <div style={{ ...font(13, 400), color: THEME.colors.secondaryText }}>
                    {c.phone}
                  </div>
                </div>
                <ChevronRight size={18} color={THEME.colors.tertiaryText} />
              </div>
            ))}

            {/* Add contact inline form */}
            {showAddContact ? (
              <div style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="Clinic / Contact name"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1.5px solid ${THEME.colors.divider}`,
                    borderRadius: THEME.radius.small,
                    ...font(14, 500),
                    color: THEME.colors.primaryText,
                    outline: 'none',
                    background: THEME.colors.surfaceAlt,
                    boxSizing: 'border-box',
                  }}
                />
                <input
                  value={newPhone}
                  onChange={(e) => setNewPhone(e.target.value)}
                  placeholder="Phone number"
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: `1.5px solid ${THEME.colors.divider}`,
                    borderRadius: THEME.radius.small,
                    ...font(14, 500),
                    color: THEME.colors.primaryText,
                    outline: 'none',
                    background: THEME.colors.surfaceAlt,
                    boxSizing: 'border-box',
                  }}
                />
                <div style={{ display: 'flex', gap: 8 }}>
                  <button
                    onClick={() => setShowAddContact(false)}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      background: THEME.colors.surfaceAlt,
                      border: 'none',
                      borderRadius: THEME.radius.small,
                      ...font(14, 600),
                      color: THEME.colors.secondaryText,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddContact}
                    style={{
                      flex: 1,
                      padding: '10px 0',
                      background: THEME.colors.info,
                      border: 'none',
                      borderRadius: THEME.radius.small,
                      ...font(14, 600),
                      color: '#fff',
                      cursor: 'pointer',
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAddContact(true)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  padding: '14px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  ...font(14, 600),
                  color: THEME.colors.info,
                }}
              >
                <Plus size={16} />
                Add Contact
              </button>
            )}
          </div>
        </div>

        {/* ── Bottom disclaimer ── */}
        <div
          style={{
            padding: '0 32px 20px',
            textAlign: 'center',
            ...font(13, 400),
            color: THEME.colors.tertiaryText,
            lineHeight: '18px',
          }}
        >
          In case of life-threatening emergency, go to the nearest veterinary clinic immediately.
        </div>

        {/* spacer for home indicator */}
        <div style={{ height: 16 }} />
      </div>

    </div>
    </div>
  );
};

export default EmergencySOS;
