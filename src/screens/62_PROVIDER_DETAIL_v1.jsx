import React, { useState } from 'react';
import {
  ChevronLeft, Star, MapPin, Clock, Heart, MessageCircle,
  Calendar, ArrowRight, Send, Shield, PawPrint, ImageIcon,
} from 'lucide-react';
import {
  Screen, ScreenHeader, IconBtn, Section, SectionLabel, Card, LargeCard,
  PrimaryBtn, GhostBtn, TrustChip, Avatar,
  T, SHADOWS, RADIUS,
} from '../components/ui';

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
    { name: 'Day Care',     price: 'CHF 65' },
    { name: 'Overnight Stay', price: 'CHF 85' },
  ],
  availability: [
    { day: 'Mon', available: true }, { day: 'Tue', available: true },
    { day: 'Wed', available: false }, { day: 'Thu', available: true },
    { day: 'Fri', available: true }, { day: 'Sat', available: true },
    { day: 'Sun', available: false },
  ],
  nextAvailable: 'Tomorrow, 9:00 AM',
  badges: [
    { label: 'Verified',  icon: Shield,   color: T.success },
    { label: 'First Aid', icon: Shield,   color: T.coral },
    { label: 'Insured',   icon: Shield,   color: T.warn },
    { label: '50+ Walks', icon: PawPrint, color: T.coral },
  ],
  reviews: [
    { id: 1, name: 'Lena M.',   date: '2 weeks ago', rating: 5, initials: 'LM', text: 'Sofia is absolutely wonderful with our Golden Retriever. She sends photos during every walk and Max always comes home happy and tired!' },
    { id: 2, name: 'Thomas B.', date: '1 month ago',  rating: 5, initials: 'TB', text: 'Very reliable and professional. Our anxious rescue dog took to her immediately which says a lot. Highly recommended.' },
    { id: 3, name: 'Mira K.',   date: '1 month ago',  rating: 4, initials: 'MK', text: 'Great communication and really cares about the dogs. Would book again without hesitation.' },
  ],
  galleryColors: ['#FFE5D9', '#D5E8F0', '#E8F0D5', '#F0D5E8'],
};

const ProviderDetailScreen = () => {
  const [bioExpanded, setBioExpanded] = useState(false);
  const [liked, setLiked] = useState(false);
  const p = PROVIDER;

  return (
    <div
      className="flex items-center justify-center min-h-screen p-5"
      style={{ backgroundColor: T.bg, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}
    >
      {/* iPhone frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 390, height: 844, borderRadius: 50,
          border: '8px solid #000', backgroundColor: T.bg,
        }}
      >
        {/* Device chrome */}
        <div
          className="absolute left-1/2 -translate-x-1/2 z-[100] rounded-full"
          style={{ top: 12, width: 120, height: 32, backgroundColor: '#000' }}
        />
        <div
          className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100] rounded-full"
          style={{ width: 134, height: 5, backgroundColor: '#000' }}
        />
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span className="text-[15px] font-semibold" style={{ color: T.txt }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Screen content (offset by status bar) */}
        <div className="absolute inset-0" style={{ paddingTop: 54 }}>
          <Screen>
            <ScreenHeader
              title={p.name}
              subtitle={p.role}
              leading={<IconBtn icon={ChevronLeft} ariaLabel="Back" onClick={() => window.history.back()} />}
              trailing={
                <>
                  <IconBtn
                    icon={Heart}
                    ariaLabel={liked ? 'Unlike' : 'Like'}
                    onClick={() => setLiked(!liked)}
                  />
                  <IconBtn icon={Send} ariaLabel="Share" onClick={() => {}} />
                </>
              }
            />

            <div className="flex-1 overflow-y-auto pb-[120px]" style={{ scrollbarWidth: 'none' }}>
              {/* Hero — avatar + stats + meta */}
              <div className="px-5 pt-4 pb-2 flex flex-col items-center text-center">
                <Avatar src={null} name={p.initials} size={88} />
                <h1 className="text-[22px] font-semibold mt-3 mb-1" style={{ color: T.txt, letterSpacing: '-0.4px' }}>
                  {p.name}
                </h1>
                <p className="text-[12.5px] mb-3" style={{ color: T.muted }}>
                  {p.role} · {p.location}
                </p>

                {/* Trust chips strip */}
                <div className="flex items-center gap-1.5 flex-wrap justify-center mb-3">
                  <TrustChip icon={Star} iconColor={T.warn} label={`${p.rating} · ${p.reviewCount} reviews`} />
                  <TrustChip icon={Clock} iconColor={T.success} label={p.responseTime.replace('Usually responds within ', '< ')} />
                </div>
              </div>

              {/* About */}
              <Section label="About">
                <Card>
                  <p
                    className="text-[14px]"
                    style={{
                      color: T.txt,
                      lineHeight: '21px',
                      display: '-webkit-box',
                      WebkitLineClamp: bioExpanded ? 'unset' : 4,
                      WebkitBoxOrient: 'vertical',
                      overflow: bioExpanded ? 'visible' : 'hidden',
                    }}
                  >
                    {p.bio}
                  </p>
                  <button
                    onClick={() => setBioExpanded(!bioExpanded)}
                    className="mt-2 text-[13px] font-semibold active:scale-[0.97] transition-transform"
                    style={{ color: T.coral }}
                  >
                    {bioExpanded ? 'Show less' : 'Read more'}
                  </button>
                </Card>
              </Section>

              {/* Services */}
              <Section label="Services">
                <LargeCard padding="p-0">
                  {p.services.map((s, i) => (
                    <div
                      key={s.name}
                      className="flex items-center justify-between px-5 py-3.5"
                      style={{
                        borderBottom: i < p.services.length - 1 ? `1px solid ${T.divider}` : 'none',
                      }}
                    >
                      <span className="text-[14px]" style={{ color: T.txt }}>{s.name}</span>
                      <span className="text-[14px] font-semibold" style={{ color: T.txt }}>{s.price}</span>
                    </div>
                  ))}
                </LargeCard>
              </Section>

              {/* Availability */}
              <Section label="Availability">
                <div className="flex gap-1.5 mb-2.5">
                  {p.availability.map((d) => (
                    <div
                      key={d.day}
                      className="flex items-center justify-center text-[12px] font-semibold"
                      style={{
                        flex: 1,
                        height: 44,
                        borderRadius: 12,
                        backgroundColor: d.available ? T.coral : T.card,
                        color: d.available ? '#FFFFFF' : T.muted,
                        border: `1px solid ${d.available ? T.coral : T.border}`,
                      }}
                    >
                      {d.day}
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1.5 px-1">
                  <Calendar size={12} color={T.muted} strokeWidth={2.2} />
                  <span className="text-[12.5px]" style={{ color: T.muted }}>
                    Next available: <span style={{ color: T.txt, fontWeight: 600 }}>{p.nextAvailable}</span>
                  </span>
                </div>
              </Section>

              {/* Certifications */}
              <Section label="Certifications">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {p.badges.map((b) => (
                    <TrustChip key={b.label} icon={b.icon} iconColor={b.color} label={b.label} />
                  ))}
                </div>
              </Section>

              {/* Reviews */}
              <Section
                label={
                  <div className="flex justify-between items-center w-full">
                    <span>Reviews</span>
                    <button
                      className="text-[12px] font-semibold flex items-center gap-1 normal-case tracking-normal active:scale-[0.97] transition-transform"
                      style={{ color: T.coral, letterSpacing: 0 }}
                    >
                      See all <ArrowRight size={12} strokeWidth={2.2} />
                    </button>
                  </div>
                }
              >
                <div className="space-y-2.5">
                  {p.reviews.map((r) => (
                    <Card key={r.id}>
                      <div className="flex items-center gap-2.5 mb-2">
                        <Avatar src={null} name={r.initials} size={32} />
                        <div className="flex-1 min-w-0">
                          <p className="text-[13.5px] font-semibold leading-tight" style={{ color: T.txt }}>{r.name}</p>
                          <p className="text-[11.5px]" style={{ color: T.muted }}>{r.date}</p>
                        </div>
                        <div className="flex gap-0.5">
                          {[1, 2, 3, 4, 5].map((i) => (
                            <Star
                              key={i}
                              size={11}
                              fill={i <= r.rating ? T.coral : 'none'}
                              stroke={i <= r.rating ? T.coral : '#D5CEC7'}
                              strokeWidth={2}
                            />
                          ))}
                        </div>
                      </div>
                      <p
                        className="text-[12.5px]"
                        style={{
                          color: T.mutedDark,
                          lineHeight: '18px',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden',
                        }}
                      >
                        {r.text}
                      </p>
                    </Card>
                  ))}
                </div>
              </Section>

              {/* Gallery */}
              <Section label="Gallery">
                <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
                  {p.galleryColors.map((c, i) => (
                    <div
                      key={i}
                      className="shrink-0 flex items-center justify-center"
                      style={{
                        width: 96, height: 96, borderRadius: 14,
                        background: `linear-gradient(135deg, ${c}, ${c}CC)`,
                      }}
                    >
                      <PawPrint size={22} color="rgba(0,0,0,0.15)" />
                    </div>
                  ))}
                </div>
              </Section>
            </div>

            {/* Sticky bottom bar */}
            <div
              className="absolute left-0 right-0 z-40 flex gap-2.5 px-5 pt-3"
              style={{
                bottom: 0,
                paddingBottom: 28,
                backgroundColor: 'rgba(247,245,242,0.92)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                borderTop: `1px solid ${T.divider}`,
              }}
            >
              <div className="flex-1">
                <GhostBtn icon={MessageCircle} onClick={() => {}}>Message</GhostBtn>
              </div>
              <div className="flex-[1.4]">
                <PrimaryBtn icon={Calendar} onClick={() => {}}>Book Now</PrimaryBtn>
              </div>
            </div>
          </Screen>
        </div>
      </div>
    </div>
  );
};

export default ProviderDetailScreen;
