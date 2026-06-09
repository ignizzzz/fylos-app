import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarCheck, HeartPulse, MessageCircle, Sparkles, Mail, Smartphone, Bell, Activity } from 'lucide-react';

/**
 * 58_NOTIFICATION_PREFS_v1.jsx — Notifications settings.
 * Matches the app's canonical Settings exactly: sticky gradient-fade header
 * (content scrolls behind), white back button, peach-chip / coral-icon rows
 * (SetRow), 38×22 MiniToggle.
 */

const CREAM = '#F7F5F2';
const ICON_TINT = '#FBE7DD';
const ICON_COLOR = '#E85D2A';
const DIVIDER = '#F1EDE8';
const TXT_PRIMARY = '#111111';
const TXT_MUTED = '#9B9B9F';
const SHADOW = '0 1px 2px rgba(60,30,15,0.03), 0 5px 14px rgba(60,30,15,0.05)';

const StatusBar = () => (
  <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
    <span style={{ fontSize: 15, fontWeight: 600, color: TXT_PRIMARY }}>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={TXT_PRIMARY}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={TXT_PRIMARY}/><rect x="9" y="2" width="3" height="10" rx="1" fill={TXT_PRIMARY}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={TXT_PRIMARY}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={TXT_PRIMARY}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={TXT_PRIMARY} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={TXT_PRIMARY} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={TXT_PRIMARY} strokeOpacity="0.4"/><rect x="2" y="2" width="16" height="9" rx="2" fill={TXT_PRIMARY}/><path d="M23 4.5v4a2 2 0 000-4z" fill={TXT_PRIMARY} fillOpacity="0.5"/></svg>
    </div>
  </div>
);

const MiniToggle = ({ value, onChange }) => (
  <div onClick={(e) => { e.stopPropagation(); onChange(!value); }} className="shrink-0 cursor-pointer" style={{ width: 38, height: 22, borderRadius: 9999, backgroundColor: value ? ICON_COLOR : '#E5E1DC', transition: 'background-color 200ms ease', position: 'relative' }}>
    <div style={{ position: 'absolute', top: 2, left: 2, width: 18, height: 18, borderRadius: '50%', background: 'white', transform: value ? 'translateX(16px)' : 'translateX(0)', transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)', boxShadow: '0 1px 2px rgba(0,0,0,0.1)' }} />
  </div>
);

const SetRow = ({ icon: Icon, title, subtitle, trailing, last }) => (
  <div className="relative">
    <div className="w-full flex items-center gap-3 px-3.5 py-[11px] text-left">
      <div className="w-9 h-9 rounded-[11px] shrink-0 flex items-center justify-center" style={{ backgroundColor: ICON_TINT }}>
        <Icon size={16} color={ICON_COLOR} strokeWidth={2} />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[14px] font-semibold truncate leading-tight" style={{ color: TXT_PRIMARY }}>{title}</div>
        {subtitle && <div className="text-[11.5px] truncate mt-[3px] leading-tight" style={{ color: TXT_MUTED }}>{subtitle}</div>}
      </div>
      {trailing}
    </div>
    {!last && <div className="absolute bottom-0 left-[62px] right-0 h-px" style={{ background: DIVIDER }} />}
  </div>
);

const SectionLabel = ({ children }) => <div className="text-[10.5px] font-bold uppercase tracking-[0.12em] mb-2 ml-1.5 mt-6" style={{ color: '#A8A29C' }}>{children}</div>;

const Card = ({ children }) => <div className="bg-white rounded-[18px] overflow-hidden" style={{ boxShadow: SHADOW }}>{children}</div>;

const NotificationPrefsScreen = () => {
  const [s, setS] = useState({ push: true, bookingConfirm: true, bookingReminder: true, providerUpdates: true, careMeds: true, careWalks: true, healthTips: false, messages: true, promos: false, email: true, sms: false });
  const t = (k) => setS((p) => ({ ...p, [k]: !p[k] }));
  const tog = (k) => <MiniToggle value={s[k]} onChange={() => t(k)} />;
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');`}</style>
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: CREAM }}>
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
          <StatusBar />

          {/* Scroll container — content scrolls behind the sticky header */}
          <div className="absolute inset-0 overflow-y-auto" style={{ background: CREAM, scrollbarWidth: 'none' }}>
            <div className="pt-14 pb-5 px-5 flex items-center justify-center relative sticky top-0 z-30 pointer-events-none" style={{ background: 'linear-gradient(to bottom, #F7F5F2 0%, #F7F5F2 56%, rgba(247,245,242,0) 100%)' }}>
              <button onClick={back} className="absolute left-5 top-[52px] w-9 h-9 rounded-full bg-white flex items-center justify-center active:scale-95 transition-all pointer-events-auto" style={{ boxShadow: '0 1px 2px rgba(60,30,15,0.04), 0 4px 12px rgba(60,30,15,0.08)' }}>
                <ChevronLeft size={18} strokeWidth={2.2} color="#111" />
              </button>
              <h1 className="text-[17px] font-bold" style={{ color: TXT_PRIMARY }}>Notifications</h1>
            </div>

            <div className="px-4 pb-12">
              <Card><SetRow icon={Bell} title="Push notifications" subtitle={s.push ? 'On — alerts on this device' : 'Off — alerts paused'} trailing={tog('push')} last /></Card>

              <div style={{ opacity: s.push ? 1 : 0.45, pointerEvents: s.push ? 'auto' : 'none', transition: 'opacity 0.2s' }}>
                <SectionLabel>Bookings</SectionLabel>
                <Card>
                  <SetRow icon={CalendarCheck} title="Booking confirmations" subtitle="When a sitter accepts" trailing={tog('bookingConfirm')} />
                  <SetRow icon={Bell} title="Reminders" subtitle="Before an upcoming booking" trailing={tog('bookingReminder')} />
                  <SetRow icon={Activity} title="Provider updates" subtitle="Live walk & check-in updates" trailing={tog('providerUpdates')} last />
                </Card>

                <SectionLabel>Pet care</SectionLabel>
                <Card>
                  <SetRow icon={HeartPulse} title="Vaccine & med reminders" subtitle="Never miss a dose or shot" trailing={tog('careMeds')} />
                  <SetRow icon={CalendarCheck} title="Walk reminders" subtitle="Daily activity nudges" trailing={tog('careWalks')} />
                  <SetRow icon={Sparkles} title="Health tips" subtitle="Seasonal care advice" trailing={tog('healthTips')} last />
                </Card>

                <SectionLabel>Activity</SectionLabel>
                <Card>
                  <SetRow icon={MessageCircle} title="Messages" subtitle="From sitters & walkers" trailing={tog('messages')} />
                  <SetRow icon={Sparkles} title="Offers & news" subtitle="Promotions and what’s new" trailing={tog('promos')} last />
                </Card>
              </div>

              <SectionLabel>Also notify me by</SectionLabel>
              <Card>
                <SetRow icon={Mail} title="Email" subtitle="alex@fylos.app" trailing={tog('email')} />
                <SetRow icon={Smartphone} title="SMS" subtitle="+41 79 •• •• 67" trailing={tog('sms')} last />
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotificationPrefsScreen;
