import React, { useState } from 'react';
import {
  ChevronLeft, Star, MapPin, Clock, Heart, MessageCircle,
  Calendar, ArrowRight, Send, Shield, PawPrint,
} from 'lucide-react';

const PROVIDER = {
  name: 'Sofia Lehmann',
  initials: 'SL',
  role: 'Dog Walker',
  rating: 4.9,
  reviewCount: 127,
  location: 'Zurich, Seefeld',
  responseTime: 'Usually responds within 15 min',
  bio: 'Passionate animal lover with 5+ years of professional pet care experience. I treat every dog like my own — with patience, love, and lots of outdoor adventures. Certified in pet first aid and experienced with all breeds from tiny Chihuahuas to giant Great Danes. I believe every walk should be an enriching experience.',
  services: [
    { name: '30 min Walk', price: 'CHF 25' },
    { name: '60 min Walk', price: 'CHF 40' },
    { name: 'Day Care', price: 'CHF 65' },
    { name: 'Overnight Stay', price: 'CHF 85' },
  ],
  availability: [
    { day: 'Mon', available: true }, { day: 'Tue', available: true },
    { day: 'Wed', available: false }, { day: 'Thu', available: true },
    { day: 'Fri', available: true }, { day: 'Sat', available: true },
    { day: 'Sun', available: false },
  ],
  nextAvailable: 'Tomorrow, 9:00 AM',
  badges: ['Verified', 'First Aid', 'Insured', '50+ Walks'],
  reviews: [
    { id: 1, name: 'Lena M.', date: '2 weeks ago', rating: 5, initials: 'LM', color: '#E8D5F5', text: 'Sofia is absolutely wonderful with our Golden Retriever. She sends photos during every walk and Max always comes home happy and tired!' },
    { id: 2, name: 'Thomas B.', date: '1 month ago', rating: 5, initials: 'TB', color: '#D5EDE8', text: 'Very reliable and professional. Our anxious rescue dog took to her immediately which says a lot. Highly recommended.' },
    { id: 3, name: 'Mira K.', date: '1 month ago', rating: 4, initials: 'MK', color: '#F5E6D5', text: 'Great communication and really cares about the dogs. Would book again without hesitation.' },
  ],
  galleryColors: ['#FFE5D9', '#D5E8F0', '#E8F0D5', '#F0D5E8'],
};

const ProviderDetailScreen = () => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const p = PROVIDER;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .pd-scroll::-webkit-scrollbar { display: none; }
        .pd-scroll { scrollbar-width: none; }
      `}</style>

      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        minHeight: '100vh', backgroundColor: '#F7F5F2', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        <div className="relative" style={{
          width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
          overflow: 'hidden', backgroundColor: '#F7F5F2',
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

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button
                onClick={() => window.history.back()}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111111]">{p.name}</h2>
              <div className="flex items-center bg-[#F3EFEB] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-0.5">
                <button
                  onClick={() => setLiked(!liked)}
                  className="w-[40px] h-[40px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all duration-[120ms]"
                >
                  <Heart size={18} color={liked ? '#FF3B30' : '#111111'} fill={liked ? '#FF3B30' : 'none'} strokeWidth={2} />
                </button>
                <div className="w-px h-5 bg-black/[0.06]" />
                <button className="w-[40px] h-[40px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all duration-[120ms]">
                  <Send size={18} color="#111111" strokeWidth={2} />
                </button>
              </div>
            </div>
          </header>

          {/* Scrollable Content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="pd-scroll" style={{ flex: 1, paddingTop: 100, paddingBottom: 100, overflowY: 'auto' }}>
              <div style={{ padding: '0 20px', display: 'flex', flexDirection: 'column', gap: 24, paddingBottom: 32 }}>

                {/* Profile Header */}
                <div className="flex flex-col items-center" style={{ gap: 10, paddingTop: 8 }}>
                  {/* Avatar */}
                  <div style={{
                    width: 96, height: 96, borderRadius: '50%',
                    background: 'linear-gradient(135deg, #FFE5D9, #F0D5C8)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 32, fontWeight: 600, color: '#E85D2A',
                  }}>{p.initials}</div>

                  <div className="text-center">
                    <h1 className="text-[22px] font-semibold text-[#111111]" style={{ letterSpacing: '-0.4px', marginBottom: 6 }}>{p.name}</h1>
                    <div style={{
                      display: 'inline-block', background: 'rgba(232,93,42,0.06)',
                      color: '#E85D2A', fontSize: 12, fontWeight: 600,
                      padding: '4px 12px', borderRadius: 9999,
                    }}>{p.role}</div>
                  </div>

                  {/* Stats Row */}
                  <div className="flex items-center gap-4 mt-1">
                    <div className="flex items-center gap-1.5">
                      <Star size={14} fill="#E85D2A" stroke="#E85D2A" />
                      <span className="text-[15px] font-semibold text-[#111111]">{p.rating}</span>
                      <span className="text-[13px] text-[#E85D2A]">({p.reviewCount})</span>
                    </div>
                    <div className="w-px h-4 bg-black/[0.08]" />
                    <div className="flex items-center gap-1">
                      <MapPin size={13} className="text-[#6E6058]" />
                      <span className="text-[13px] text-[#6E6058]">{p.location}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <Clock size={13} className="text-[#6E6058]" />
                    <span className="text-[13px] text-[#6E6058]">{p.responseTime}</span>
                  </div>
                </div>

                {/* About */}
                <div>
                  <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-3">About</div>
                  <p className="text-[15px] text-[#111111]" style={{
                    lineHeight: '22px',
                    display: '-webkit-box', WebkitLineClamp: bioExpanded ? 'unset' : 4,
                    WebkitBoxOrient: 'vertical', overflow: bioExpanded ? 'visible' : 'hidden',
                  }}>{p.bio}</p>
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="active:scale-[0.97] transition-all duration-[120ms]"
                    style={{
                      background: 'none', border: 'none', color: '#E85D2A',
                      fontSize: 13, fontWeight: 500, marginTop: 6, padding: 0, cursor: 'pointer',
                      fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                    }}
                  >{bioExpanded ? 'Show less' : 'Read more'}</button>
                </div>

                {/* Services */}
                <div>
                  <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-3">Services</div>
                  <div className="bg-[#F3EFEB] rounded-[20px] shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]" style={{ padding: '4px 20px' }}>
                    {p.services.map((s, i) => (
                      <div key={s.name} className="flex justify-between items-center" style={{
                        padding: '14px 0',
                        borderBottom: i < p.services.length - 1 ? '1px solid rgba(0,0,0,0.04)' : 'none',
                      }}>
                        <span className="text-[15px] text-[#111111]">{s.name}</span>
                        <span className="text-[15px] font-semibold text-[#111111]">{s.price}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Availability */}
                <div>
                  <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-3">Availability</div>
                  <div className="flex gap-2 mb-2.5">
                    {p.availability.map(d => (
                      <div key={d.day} className="flex items-center justify-center" style={{
                        flex: 1, height: 44, borderRadius: 12,
                        fontSize: 12, fontWeight: 500, letterSpacing: '-0.2px',
                        background: d.available ? '#E85D2A' : '#F3EFEB',
                        color: d.available ? '#FFFFFF' : '#A09A94',
                        transition: 'background 200ms',
                      }}>{d.day}</div>
                    ))}
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar size={12} className="text-[#A09A94]" />
                    <span className="text-[13px] text-[#A09A94]">Next available: {p.nextAvailable}</span>
                  </div>
                </div>

                {/* Badges */}
                <div>
                  <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-3">Certifications</div>
                  <div className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: 'none', paddingBottom: 4 }}>
                    {p.badges.map(b => (
                      <div key={b} className="flex items-center gap-1 shrink-0" style={{
                        background: '#F3EFEB', borderRadius: 9999,
                        padding: '6px 12px', fontSize: 12, fontWeight: 500,
                        color: '#111111', whiteSpace: 'nowrap',
                      }}>
                        {b === 'Verified' && <Shield size={12} color="#34C759" />}
                        {b}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Reviews */}
                <div>
                  <div className="flex justify-between items-center mb-3">
                    <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">Reviews</span>
                    <button
                      className="active:scale-[0.97] transition-all duration-[120ms]"
                      style={{
                        background: 'none', border: 'none', color: '#E85D2A',
                        fontSize: 13, fontWeight: 500, cursor: 'pointer',
                        display: 'flex', alignItems: 'center', gap: 2, padding: 0,
                        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
                      }}
                    >See all <ArrowRight size={13} /></button>
                  </div>
                  <div className="flex flex-col gap-3.5">
                    {p.reviews.map(r => (
                      <div key={r.id} className="bg-[#F3EFEB] rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]">
                        <div className="flex items-center gap-2.5 mb-2">
                          <div style={{
                            width: 32, height: 32, borderRadius: '50%',
                            background: `linear-gradient(135deg, ${r.color}, ${r.color}CC)`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: 12, fontWeight: 600, color: '#111111', flexShrink: 0,
                          }}>{r.initials}</div>
                          <div style={{ flex: 1 }}>
                            <div className="text-[15px] font-medium text-[#111111]">{r.name}</div>
                            <div className="text-[12px] text-[#A09A94]">{r.date}</div>
                          </div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(i => (
                              <Star key={i} size={11} fill={i <= r.rating ? '#E85D2A' : 'none'} stroke={i <= r.rating ? '#E85D2A' : '#D5CEC7'} strokeWidth={2} />
                            ))}
                          </div>
                        </div>
                        <p className="text-[13px] text-[#6E6058]" style={{
                          lineHeight: '19px',
                          display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden',
                        }}>{r.text}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Gallery */}
                <div>
                  <div className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-3">Gallery</div>
                  <div className="flex gap-2.5 overflow-x-auto" style={{ scrollbarWidth: 'none', paddingBottom: 4 }}>
                    {p.galleryColors.map((c, i) => (
                      <div key={i} style={{
                        width: 100, height: 100, borderRadius: 16, flexShrink: 0,
                        background: `linear-gradient(135deg, ${c}, ${c}CC)`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <PawPrint size={24} color="rgba(0,0,0,0.1)" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sticky Bottom Bar */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '12px 20px 34px',
            background: 'rgba(247,245,242,0.85)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderTop: '1px dashed #CFCFD4',
            display: 'flex', gap: 10, zIndex: 40,
          }}>
            <button
              className="active:scale-[0.97] transition-all duration-[120ms]"
              style={{
                flex: 1, height: 52, borderRadius: 16,
                background: '#F3EFEB', border: '1px solid #EDE8E2',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 15, fontWeight: 600, color: '#111111', cursor: 'pointer',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              <MessageCircle size={18} />Message
            </button>
            <button
              className="active:scale-[0.97] transition-all duration-[120ms]"
              style={{
                flex: 1.4, height: 52, borderRadius: 14, border: 'none',
                background: '#111', color: '#FFFFFF',
                boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                fontSize: 15, fontWeight: 600, cursor: 'pointer',
                fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
              }}
            >
              <Calendar size={18} color="white" />Book Now
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProviderDetailScreen;
