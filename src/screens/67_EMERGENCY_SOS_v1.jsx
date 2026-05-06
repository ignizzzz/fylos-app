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
  Shield,
  Info
} from 'lucide-react';

/**
 * 67_EMERGENCY_SOS_v1.jsx
 * Emergency SOS screen -- large pulsing SOS button, emergency contacts
 * quick-dial cards, active alerts, first aid guide, countdown timer.
 */

const MOCK_ALERTS = [
  { id: 1, location: 'Seefeld Park', time: '12 min ago', type: 'Poison bait' },
  { id: 2, location: 'Bellevue area', time: '45 min ago', type: 'Suspicious food' },
  { id: 3, location: 'Zurichberg trail', time: '2h ago', type: 'Poison bait' },
];

const MOCK_CONTACTS = [
  { id: 1, name: 'Tierklinik Zurich', phone: '+41 44 635 81 11' },
];

const FIRST_AID = [
  { id: 'toxic', title: 'My pet ate something toxic', icon: AlertCircle,
    steps: ['Do NOT induce vomiting unless told by a vet', 'Note the substance, amount, and time ingested', 'Call your vet or poison control immediately', 'Bring packaging or a photo of the substance'] },
  { id: 'choking', title: 'My pet is choking', icon: Info,
    steps: ['Stay calm and restrain your pet gently', 'Open mouth carefully and look for the object', 'Sweep mouth with finger if object is visible', 'If stuck, perform modified Heimlich maneuver', 'Rush to vet if you cannot dislodge it'] },
  { id: 'bleeding', title: 'My pet is bleeding', icon: Heart,
    steps: ['Apply firm pressure with a clean cloth', 'Elevate the wound above heart level if possible', 'Do not remove the cloth -- add layers if needed', 'Go to the nearest vet clinic immediately'] },
  { id: 'bitten', title: 'My pet was bitten', icon: Shield,
    steps: ['Clean the area gently with warm water', 'Check for swelling, redness, or puncture wounds', 'Do not apply ointment without vet guidance', 'Schedule a vet visit as soon as possible'] },
];

/* ── Accordion ── */
const Accordion = ({ title, steps, icon: Icon }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="rounded-[20px] overflow-hidden" style={{ marginBottom: 10, backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', display: 'flex', alignItems: 'center', gap: 12,
        padding: '16px 20px', border: 'none', background: 'none', cursor: 'pointer', textAlign: 'left'
      }}>
        {Icon && (
          <div style={{
            width: 34, height: 34, borderRadius: 9999, background: '#FFEBEA',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
          }}>
            <Icon size={18} color="#FF3B30" />
          </div>
        )}
        <span style={{ flex: 1, fontSize: 15, fontWeight: 600, color: '#111' }}>{title}</span>
        <ChevronDown size={18} color="#A09A94" style={{
          transition: 'transform 200ms', transform: open ? 'rotate(180deg)' : 'rotate(0deg)'
        }} />
      </button>
      <div style={{
        maxHeight: open ? 300 : 0, opacity: open ? 1 : 0, overflow: 'hidden',
        transition: 'max-height 300ms ease, opacity 200ms ease'
      }}>
        <div style={{ padding: '0 20px 16px 66px' }}>
          {steps.map((s, i) => (
            <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: i < steps.length - 1 ? 8 : 0 }}>
              <span style={{
                width: 22, height: 22, borderRadius: 9999, background: '#EDE8E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, color: '#6E6058', flexShrink: 0, marginTop: 1
              }}>
                {i + 1}
              </span>
              <span style={{ fontSize: 13, lineHeight: '18px', color: '#6E6058' }}>{s}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

/* ── Main Screen ── */
const EmergencySOS = () => {
  const [contacts, setContacts] = useState(MOCK_CONTACTS);
  const [showAddContact, setShowAddContact] = useState(false);
  const [newName, setNewName] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [sosCountdown, setSosCountdown] = useState(null);
  const scrollRef = useRef(null);

  const handleAddContact = () => {
    if (!newName.trim() || !newPhone.trim()) return;
    setContacts(prev => [...prev, { id: Date.now(), name: newName.trim(), phone: newPhone.trim() }]);
    setNewName(''); setNewPhone(''); setShowAddContact(false);
  };

  // SOS countdown timer
  useEffect(() => {
    if (sosCountdown === null || sosCountdown <= 0) return;
    const id = setTimeout(() => setSosCountdown(c => c - 1), 1000);
    return () => clearTimeout(id);
  }, [sosCountdown]);

  const handleSOS = () => {
    if (sosCountdown !== null) { setSosCountdown(null); return; }
    setSosCountdown(5);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        @keyframes sos-pulse { 0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(255,59,48,0.4); } 50% { transform: scale(1.06); box-shadow: 0 0 0 18px rgba(255,59,48,0); } }
        @keyframes sos-ring { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(2.2); opacity: 0; } }
        .sos-pulse { animation: sos-pulse 2s ease-in-out infinite; }
        .sos-ring { animation: sos-ring 2s ease-out infinite; }
        .sos-ring-delay { animation: sos-ring 2s ease-out 0.6s infinite; }
        .wallet-scroll::-webkit-scrollbar { display: none; }
        .wallet-scroll { scrollbar-width: none; }
        input::placeholder { color: #A09A94; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#EDE8E2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden', backgroundColor: '#F7F5F2'
        }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Scrollable content with canonical transparent header */}
          <div ref={scrollRef} className="absolute inset-0 overflow-y-auto pb-[140px]" style={{ scrollbarWidth: 'none' }}>
            <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none">
              <button
                onClick={() => window.history.back()}
                className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all pointer-events-auto"
              >
                <ChevronLeft size={18} strokeWidth={2.2} color="#111" />
              </button>
              <h1 className="text-[17px] font-semibold text-[#111]">Emergency</h1>
            </div>
            <div className="px-5" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>

              {/* Large pulsing SOS button */}
              <div className="rounded-[20px] p-6"
                style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>

                <div style={{ position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* Ripple rings */}
                  <div className="sos-ring" style={{ position: 'absolute', width: 88, height: 88, borderRadius: 9999, border: '2px solid rgba(255,59,48,0.3)', pointerEvents: 'none' }} />
                  <div className="sos-ring-delay" style={{ position: 'absolute', width: 88, height: 88, borderRadius: 9999, border: '2px solid rgba(255,59,48,0.2)', pointerEvents: 'none' }} />
                  <button onClick={handleSOS} className="sos-pulse active:scale-[0.95] transition-all duration-[120ms]" style={{
                    width: 88, height: 88, borderRadius: 9999,
                    background: '#FF3B30', border: 'none', cursor: 'pointer',
                    display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 2
                  }}>
                    {sosCountdown !== null && sosCountdown > 0 ? (
                      <span style={{ fontSize: 28, fontWeight: 700, color: '#FFFFFF' }}>{sosCountdown}</span>
                    ) : (
                      <>
                        <Phone size={28} color="#FFFFFF" />
                        <span style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.9)', letterSpacing: 1 }}>SOS</span>
                      </>
                    )}
                  </button>
                </div>

                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: 17, fontWeight: 600, color: '#111' }}>Emergency Vet</div>
                  <div style={{ fontSize: 13, color: '#6E6058', marginTop: 2 }}>Tierklinik Zurich -- 24h</div>
                </div>

                {sosCountdown !== null && sosCountdown > 0 ? (
                  <button onClick={() => setSosCountdown(null)}
                    className="active:scale-[0.97] transition-all duration-[120ms]"
                    style={{
                      width: '100%', padding: '14px 0', background: '#EDE8E2', color: '#111',
                      border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer'
                    }}>
                    Cancel
                  </button>
                ) : (
                  <button className="active:scale-[0.97] transition-all duration-[120ms]" style={{
                    width: '100%', padding: '14px 0',
                    background: '#FF3B30', color: '#FFFFFF',
                    border: 'none', borderRadius: 14, fontSize: 16, fontWeight: 600, cursor: 'pointer'
                  }}>
                    Call Now
                  </button>
                )}
              </div>

              {/* Quick Actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10 }}>
                {[
                  { Icon: AlertCircle, label: 'Poison Control', sub: '+41 44 251 51 51', color: '#E85D2A' },
                  { Icon: MapPin, label: 'Nearest Clinic', sub: '1.2 km', color: '#E85D2A' },
                  { Icon: Heart, label: 'First Aid Guide', sub: '', color: '#FF3B30' }
                ].map(({ Icon, label, sub, color }, i) => (
                  <button key={i} className="active:scale-[0.97] transition-all duration-[120ms]"
                    style={{
                      borderRadius: 20, padding: 16,
                      display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, textAlign: 'center',
                      backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2',
                      cursor: 'pointer'
                    }}>
                    <div style={{
                      width: 34, height: 34, borderRadius: 9999, background: `${color}10`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: '#111', lineHeight: '16px' }}>{label}</span>
                    {sub && <span style={{ fontSize: 11, color: '#A09A94', lineHeight: '14px' }}>{sub}</span>}
                  </button>
                ))}
              </div>

              {/* Active Alerts */}
              <div className="rounded-[20px] p-5" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,149,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <AlertCircle size={16} color="#FF9500" />
                    </div>
                    <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>Active Alerts</span>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600, color: '#FF3B30', background: '#FFEBEA', padding: '4px 10px', borderRadius: 9999 }}>
                    3 within 2 km
                  </span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {MOCK_ALERTS.map(a => (
                    <div key={a.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      background: '#EDE8E2', borderRadius: 12
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 9999, background: 'rgba(255,149,0,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <AlertCircle size={16} color="#FF9500" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{a.type}</div>
                        <div style={{ fontSize: 13, color: '#A09A94' }}>{a.location}</div>
                      </div>
                      <span style={{ fontSize: 12, fontWeight: 500, color: '#A09A94', flexShrink: 0 }}>{a.time}</span>
                    </div>
                  ))}
                </div>
                <button onClick={() => window.location.href = '/danger-reports'}
                  className="active:scale-[0.97] transition-all duration-[120ms]"
                  style={{
                    marginTop: 14, width: '100%', padding: '12px 0',
                    background: '#F7F5F2', border: '1px solid #EDE8E2', borderRadius: 14,
                    fontSize: 15, fontWeight: 600, color: '#E85D2A', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                  }}>
                  <MapPin size={16} /> View Map
                </button>
              </div>

              {/* First Aid Guide */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#A09A94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingLeft: 4 }}>
                  First Aid Guide
                </div>
                {FIRST_AID.map(item => (
                  <Accordion key={item.id} title={item.title} steps={item.steps} icon={item.icon} />
                ))}
              </div>

              {/* Emergency Contacts */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 700, color: '#A09A94', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10, paddingLeft: 4 }}>
                  Your Emergency Contacts
                </div>
                <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
                  {contacts.map((c, i) => (
                    <div key={c.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '14px 20px',
                      borderBottom: i < contacts.length - 1 || showAddContact ? '1px dashed #CFCFD4' : 'none'
                    }}>
                      <div style={{
                        width: 34, height: 34, borderRadius: 9999, background: 'rgba(232,93,42,0.08)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                      }}>
                        <Phone size={16} color="#E85D2A" />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>{c.name}</div>
                        <div style={{ fontSize: 13, color: '#6E6058' }}>{c.phone}</div>
                      </div>
                      <ChevronRight size={18} color="#A09A94" />
                    </div>
                  ))}

                  {showAddContact ? (
                    <div style={{ padding: 20, display: 'flex', flexDirection: 'column', gap: 10 }}>
                      <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Clinic / Contact name"
                        className="w-full h-[52px] px-4 rounded-[16px] text-[16px] text-[#111] placeholder:text-[#A09A94] focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10 transition-all duration-200"
                        style={{ fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#F7F5F2', border: '1px solid #EDE8E2' }} />
                      <input value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Phone number"
                        className="w-full h-[52px] px-4 rounded-[16px] text-[16px] text-[#111] placeholder:text-[#A09A94] focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10 transition-all duration-200"
                        style={{ fontFamily: 'inherit', boxSizing: 'border-box', backgroundColor: '#F7F5F2', border: '1px solid #EDE8E2' }} />
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button onClick={() => setShowAddContact(false)}
                          className="active:scale-[0.97] transition-all duration-[120ms]"
                          style={{ flex: 1, padding: '14px 0', background: '#EDE8E2', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#6E6058', cursor: 'pointer', textAlign: 'center' }}>
                          Cancel
                        </button>
                        <button onClick={handleAddContact}
                          className="active:scale-[0.97] transition-all duration-[120ms]"
                          style={{ flex: 1, padding: '14px 0', background: '#111', border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 600, color: '#FFFFFF', cursor: 'pointer', textAlign: 'center', boxShadow: '0 4px 20px rgba(0,0,0,0.12)' }}>
                          Save
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddContact(true)}
                      className="active:scale-[0.97] transition-all duration-[120ms]"
                      style={{
                        width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        padding: '14px 0', background: 'none', border: 'none', cursor: 'pointer',
                        fontSize: 15, fontWeight: 600, color: '#E85D2A'
                      }}>
                      <Plus size={16} /> Add Contact
                    </button>
                  )}
                </div>
              </div>

              {/* Disclaimer */}
              <div style={{ padding: '0 12px', textAlign: 'center', fontSize: 13, color: '#A09A94', lineHeight: '18px' }}>
                In case of life-threatening emergency, go to the nearest veterinary clinic immediately.
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmergencySOS;
