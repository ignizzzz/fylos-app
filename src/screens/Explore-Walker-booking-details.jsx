import React, { useState, useEffect } from 'react';
import {
  ChevronLeft, Check, X, Calendar as CalendarIcon,
  CreditCard, Star, Clock, ChevronDown, MoreHorizontal, Copy,
  Share, MessageCircle, HelpCircle,
} from 'lucide-react';
import { T, SHADOWS, RADIUS } from '../styles/theme';
import { IconBtn, Card, PrimaryBtn, GhostBtn, SectionLabel } from '../components/ui';

// --- Local styles (animations only) ---
const LocalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

    @keyframes slideUpFade { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
    .animate-slide-up { animation: slideUpFade 0.3s cubic-bezier(0.19, 1, 0.22, 1) forwards; }
    @keyframes scaleFadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
    .animate-scale-fade-in { animation: scaleFadeIn 0.15s ease-out forwards; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    @keyframes scaleIn { from { opacity: 0; transform: scale(0.98); } to { opacity: 1; transform: scale(1); } }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    @keyframes orangePulse {
      0% { box-shadow: 0 0 0 0 rgba(232, 93, 42, 0.4); }
      70% { box-shadow: 0 0 0 6px rgba(232, 93, 42, 0); }
      100% { box-shadow: 0 0 0 0 rgba(232, 93, 42, 0); }
    }
    .animate-orange-pulse { animation: orangePulse 2s infinite; }
  `}</style>
);

// --- Mock data ---
const WALKER_IMAGE = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80';

// --- Status bar / chrome ---
const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[150] text-[13px] font-semibold pointer-events-none" style={{ color: T.txt }}>
    <span>9:41</span>
    <div className="flex items-center gap-1">
      <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill={T.txt}/><rect x="4.5" y="4" width="3" height="8" rx="1" fill={T.txt}/><rect x="9" y="2" width="3" height="10" rx="1" fill={T.txt}/><rect x="13.5" y="0" width="3" height="12" rx="1" fill={T.txt}/></svg>
      <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill={T.txt}/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke={T.txt} strokeWidth="1.5" strokeLinecap="round"/></svg>
      <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke={T.txt} strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill={T.txt}/></svg>
    </div>
  </div>
);

const HeaderFadeScrim = () => (
  <div
    className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
    style={{ height: 120, background: `linear-gradient(to bottom, ${T.bg} 40%, transparent 100%)` }}
  />
);

const ToggleSwitch = ({ checked, onToggle }) => (
  <button
    onClick={onToggle}
    className="w-9 h-5 rounded-full p-0.5 transition-colors duration-200 focus:outline-none"
    style={{ backgroundColor: checked ? T.coral : '#E5E5E5' }}
  >
    <div
      className="w-4 h-4 rounded-full transition-transform duration-200"
      style={{
        backgroundColor: '#fff',
        boxShadow: SHADOWS.card,
        transform: `translateX(${checked ? 16 : 0}px)`,
      }}
    />
  </button>
);

const CancelRequestDialog = ({ onKeepWaiting, onCancelRequest }) => (
  <div className="absolute inset-0 z-[200] flex items-center justify-center px-8">
    <div className="absolute inset-0 animate-fade-in" style={{ backgroundColor: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(2px)' }} onClick={onKeepWaiting} />
    <div
      className="w-full max-w-[300px] pt-6 px-6 pb-6 animate-scale-in relative z-10 flex flex-col items-center text-center"
      style={{
        backgroundColor: T.card,
        borderRadius: 24,
        boxShadow: '0 20px 50px -10px rgba(0,0,0,0.2)',
      }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center mb-4"
        style={{ border: `1px solid rgba(232,93,42,0.4)`, color: T.coral }}
      >
        <X size={20} strokeWidth={2} />
      </div>
      <h3 className="text-[18px] font-bold mb-2 tracking-tight" style={{ color: T.txt }}>Cancel request?</h3>
      <p className="text-[13.5px] mb-5 leading-relaxed" style={{ color: T.mutedDark }}>
        Your card will not be charged.
      </p>
      <div className="flex flex-col gap-2.5 w-full">
        <PrimaryBtn onClick={onKeepWaiting}>Keep waiting</PrimaryBtn>
        <button
          onClick={onCancelRequest}
          className="w-full h-11 rounded-[14px] text-[14.5px] font-semibold active:scale-[0.98] transition-transform"
          style={{ backgroundColor: 'transparent', color: T.danger }}
        >
          Cancel request
        </button>
      </div>
    </div>
  </div>
);

const Toast = ({ message }) => (
  <div className="fixed bottom-24 left-1/2 -translate-x-1/2 px-4 py-2.5 text-[13px] font-medium animate-fade-in z-[100] flex items-center gap-2" style={{ backgroundColor: 'rgba(17,17,17,0.92)', color: '#fff', borderRadius: 12, backdropFilter: 'blur(8px)', boxShadow: SHADOWS.floating }}>
    <Check size={14} strokeWidth={3} />
    {message}
  </div>
);

// --- Main: Booking Details ---
const BookingDetailsScreen = ({ onBack, onHome, onMessage }) => {
  const [copied, setCopied] = useState(false);
  const [isPolicyExpanded, setIsPolicyExpanded] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [showActionMenu, setShowActionMenu] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [notifications, setNotifications] = useState({ sms: true, reminder: true, updates: true });
  const [countdown, setCountdown] = useState({ h: 18, m: 42 });

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev.m === 0) return prev.h === 0 ? prev : { h: prev.h - 1, m: 59 };
        return { ...prev, m: prev.m - 1 };
      });
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const handleCopyId = () => {
    setCopied(true);
    setShowToast(true);
    setTimeout(() => { setCopied(false); setShowToast(false); }, 2000);
  };

  const toggleNotification = (key) => setNotifications((p) => ({ ...p, [key]: !p[key] }));

  const handleAddToCalendar = () => {
    const ics = `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
URL:${window.location.href}
DTSTART:20260216T090000
DTEND:20260216T103000
SUMMARY:Walk with Lukas (Luna)
DESCRIPTION:Booking ID: #FY2024-00142
LOCATION:Bellevuestrasse 12, 8008 Zürich
END:VEVENT
END:VCALENDAR`;
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'walk_booking.ics');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const Divider = () => <div className="h-px w-full" style={{ backgroundColor: T.divider }} />;

  return (
    <div className="w-full h-full flex flex-col relative animate-fade-in font-sans" style={{ backgroundColor: T.bg }}>
      <HeaderFadeScrim />

      {/* Header */}
      <div className="absolute top-0 left-0 w-full z-[50] pt-[54px] pb-3 px-5 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
          <IconBtn icon={ChevronLeft} ariaLabel="Back" onClick={onBack} size={36} />
          <span className="text-[16px] font-semibold tracking-tight" style={{ color: T.txt }}>Booking Details</span>

          <div className="relative">
            <IconBtn icon={MoreHorizontal} ariaLabel="More" onClick={() => setShowActionMenu(!showActionMenu)} size={36} />

            {showActionMenu && (
              <>
                <div className="fixed inset-0 z-[100]" onClick={() => setShowActionMenu(false)} />
                <div
                  className="absolute top-[110%] right-[-8px] w-[220px] z-[101] py-1 animate-scale-fade-in origin-top-right flex flex-col"
                  style={{
                    backgroundColor: T.card,
                    borderRadius: 12,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
                    border: `1px solid ${T.border}`,
                  }}
                >
                  <ActionMenuItem icon={Share} label="Share booking" />
                  <Divider />
                  <ActionMenuItem icon={MessageCircle} label="Contact Support" />
                  <ActionMenuItem icon={HelpCircle} label="Visit Help Center" />
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto no-scrollbar pt-[110px] px-5 pb-32">
        {/* Status Banner */}
        <div className="mb-7 animate-scale-in">
          <div
            className="p-3.5 flex gap-3 items-center"
            style={{ backgroundColor: T.coralSoft, borderLeft: `3px solid ${T.coral}`, borderRadius: '4px 16px 16px 4px' }}
          >
            <Clock size={22} strokeWidth={2} color={T.coral} className="flex-shrink-0" />
            <div className="flex flex-col gap-0.5">
              <span className="text-[11px] font-bold uppercase tracking-wide" style={{ color: T.coral }}>Pending Acceptance</span>
              <span className="text-[13px] leading-tight" style={{ color: T.mutedDark }}>{countdown.h}h {countdown.m}m remaining</span>
            </div>
          </div>
        </div>

        {/* Timeline */}
        <Section label="Booking Timeline" delay="0.05s">
          <Card padding="p-5">
            <div className="flex flex-col gap-5 relative">
              <div className="absolute left-[5px] top-2.5 h-[36px] w-[1.5px] z-0" style={{ backgroundColor: T.coral }} />
              <div className="absolute left-[5px] top-[40px] bottom-3 w-[1.5px] z-0" style={{ backgroundColor: '#E5E5E5' }} />

              <TimelineStep
                state="completed"
                title="Request sent"
                subtitle="Mon, Feb 16 · 14:23"
              />
              <TimelineStep
                state="current"
                title="Waiting for walker"
                subtitle="Lukas has 24h to respond"
              />
              <TimelineStep
                state="future"
                title="Walk scheduled"
                subtitle="Mon, Feb 16 · 09:00"
              />
              <TimelineStep
                state="future"
                title="Walk completed"
              />
            </div>
          </Card>
        </Section>

        {/* Walker */}
        <Section label="Walker" delay="0.1s">
          <Card padding="p-5">
            <div className="flex items-center gap-3 mb-4">
              <img src={WALKER_IMAGE} alt="Walker" className="w-10 h-10 rounded-full object-cover" style={{ border: `1px solid ${T.card}`, boxShadow: SHADOWS.card }} />
              <div className="flex flex-col gap-1">
                <div className="flex items-center gap-1.5">
                  <span className="text-[14px] font-semibold" style={{ color: T.txt }}>Lukas F.</span>
                  <div className="flex items-center gap-1">
                    <Star size={12} fill={T.coral} color={T.coral} />
                    <span className="text-[12.5px]" style={{ color: T.mutedDark }}>4.9</span>
                  </div>
                </div>
                <span className="text-[12.5px]" style={{ color: T.muted }}>(124 reviews)</span>
              </div>
            </div>

            <div className="flex flex-col gap-2.5">
              <div className="flex gap-2.5">
                <div className="flex-1"><PrimaryBtn onClick={onMessage}>Message Lukas</PrimaryBtn></div>
                <div className="flex-1"><GhostBtn onClick={() => {}}>Call</GhostBtn></div>
              </div>
              <p className="text-[11.5px] text-center" style={{ color: T.muted }}>Response time: Usually under 1h</p>
            </div>
          </Card>
        </Section>

        {/* Booking Details */}
        <Section label="Booking Details" delay="0.2s">
          <Card padding="p-4">
            <DetailRow label="Booking ID">
              <button onClick={handleCopyId} className="flex items-center gap-2 active:opacity-60 transition-opacity w-fit">
                <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>#FY2024-00142</span>
                {copied ? <Check size={13} color={T.success} strokeWidth={2.5} /> : <Copy size={13} color={T.muted} strokeWidth={2} />}
              </button>
            </DetailRow>
            <Divider />
            <DetailRow label="Service" value="90 min Walk" />
            <Divider />
            <DetailRow label="Dog">
              <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>
                Luna <span className="font-normal" style={{ color: T.muted }}>(Golden Retriever, 3y)</span>
              </span>
            </DetailRow>
            <Divider />
            <DetailRow label="Date & Time">
              <div className="flex flex-col gap-0.5">
                <span className="text-[14px] font-medium" style={{ color: T.txt }}>Monday, Feb 16, 2026 · 09:00–10:30</span>
                <button
                  onClick={handleAddToCalendar}
                  className="text-[12.5px] font-medium mt-0.5 active:opacity-70 text-left w-fit flex items-center gap-1.5"
                  style={{ color: T.coral }}
                >
                  <CalendarIcon size={13} strokeWidth={2.2} />
                  Add to calendar
                </button>
              </div>
            </DetailRow>
            <Divider />
            <DetailRow label="Pickup Location">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>Bellevuestrasse 12, 8008 Zürich</span>
                <button className="text-[12.5px] font-medium mt-0.5 active:opacity-70 text-left w-fit" style={{ color: T.coral }}>
                  View on map
                </button>
              </div>
            </DetailRow>
            <Divider />
            <DetailRow label="Special Instructions">
              <span className="text-[13.5px] leading-relaxed" style={{ color: T.txt }}>
                Luna is nervous around bikes. Please avoid busy bike paths.
              </span>
            </DetailRow>
            <Divider />
            <DetailRow label="Created" value="Mon, Feb 16 · 14:23" />
          </Card>
        </Section>

        {/* Payment */}
        <Section label="Payment" delay="0.3s">
          <Card padding="p-4">
            <div className="flex flex-col gap-1.5">
              <div className="flex justify-between text-[13.5px]" style={{ color: T.txt }}>
                <span>90 min Walk</span>
                <span className="font-medium">CHF 75.00</span>
              </div>
              <div className="flex justify-between text-[13.5px]" style={{ color: T.mutedDark }}>
                <span>Service fee (10%)</span>
                <span className="font-medium">CHF 7.50</span>
              </div>
              <div className="my-2"><Divider /></div>
              <div className="flex justify-between text-[14.5px] font-bold" style={{ color: T.txt }}>
                <span>Total</span>
                <span>CHF 82.50</span>
              </div>
            </div>

            <div className="my-3"><Divider /></div>

            <div className="flex flex-col gap-1">
              <span className="text-[12.5px]" style={{ color: T.mutedDark }}>Payment method</span>
              <div className="flex items-center gap-1.5">
                <CreditCard size={15} color={T.txt} />
                <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>Visa ••••1234</span>
              </div>
            </div>

            <div className="my-3"><Divider /></div>

            <div className="flex flex-col gap-1">
              <span className="text-[12.5px]" style={{ color: T.mutedDark }}>Payment status</span>
              <div className="flex items-center gap-1.5">
                <Clock size={13} color={T.coral} strokeWidth={2.2} />
                <span className="text-[13.5px] font-bold" style={{ color: T.txt }}>
                  Authorized <span className="font-normal" style={{ color: T.muted }}>— not charged yet</span>
                </span>
              </div>
              <span className="text-[12px]" style={{ color: T.muted }}>Will be charged when Lukas accepts.</span>
            </div>
          </Card>
        </Section>

        {/* Cancellation Policy */}
        <div className="mb-7 animate-slide-up" style={{ animationDelay: '0.4s' }}>
          <Card padding="p-0" className="overflow-hidden">
            <button
              onClick={() => setIsPolicyExpanded(!isPolicyExpanded)}
              className="w-full p-4 flex items-center justify-between active:bg-black/5 transition-colors"
            >
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: T.muted }}>Cancellation Policy</span>
              <ChevronDown
                size={16}
                strokeWidth={2.2}
                color={T.muted}
                className={`transition-transform duration-300 ${isPolicyExpanded ? 'rotate-180' : ''}`}
              />
            </button>

            {isPolicyExpanded && (
              <div className="px-4 pb-4 animate-fade-in">
                <div className="my-3"><Divider /></div>
                <div className="flex flex-col gap-3.5">
                  <PolicyGroup
                    title="Before walker accepts"
                    items={['Free cancellation', 'Full refund']}
                  />
                  <PolicyGroup
                    title="After walker accepts"
                    items={[
                      'Free cancellation up to 24h before walk',
                      '50% refund within 24h',
                      'No refund for no-shows',
                    ]}
                  />
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Notifications */}
        <Section label="Notifications" delay="0.5s">
          <Card padding="p-4">
            <NotificationRow label="SMS when walker responds" checked={notifications.sms} onToggle={() => toggleNotification('sms')} />
            <Divider />
            <NotificationRow label="Reminder 1 day before walk" checked={notifications.reminder} onToggle={() => toggleNotification('reminder')} />
            <Divider />
            <NotificationRow label="Updates during walk" checked={notifications.updates} onToggle={() => toggleNotification('updates')} last />
          </Card>
        </Section>

        {/* Actions */}
        <div className="flex flex-col gap-2.5 mt-3 mb-7">
          <PrimaryBtn onClick={onMessage}>Message Lukas</PrimaryBtn>
          <GhostBtn onClick={onHome}>Browse other walkers</GhostBtn>
          <button
            onClick={() => setShowCancelDialog(true)}
            className="text-[13px] font-medium mt-2 py-2 active:opacity-70 transition-opacity"
            style={{ color: T.danger }}
          >
            Cancel request
          </button>
        </div>
      </div>

      {showToast && <Toast message="Booking ID copied" />}
      {showCancelDialog && (
        <CancelRequestDialog
          onKeepWaiting={() => setShowCancelDialog(false)}
          onCancelRequest={onHome}
        />
      )}
    </div>
  );
};

// --- Sub-components ---
const Section = ({ label, children, delay }) => (
  <div className="mb-7 animate-slide-up" style={{ animationDelay: delay }}>
    <SectionLabel className="ml-1">{label}</SectionLabel>
    {children}
  </div>
);

const TimelineStep = ({ state, title, subtitle }) => {
  const isCompleted = state === 'completed';
  const isCurrent = state === 'current';
  return (
    <div className="flex gap-3.5 relative z-10">
      {isCompleted ? (
        <div
          className="mt-1 w-3 h-3 rounded-full flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: T.coral, boxShadow: `0 0 0 4px ${T.bg}` }}
        >
          <Check size={8} color="#fff" strokeWidth={4} />
        </div>
      ) : isCurrent ? (
        <div
          className="mt-1 w-3 h-3 rounded-full flex-shrink-0 animate-orange-pulse"
          style={{ backgroundColor: T.coral }}
        />
      ) : (
        <div
          className="mt-1 w-3 h-3 rounded-full flex-shrink-0"
          style={{ backgroundColor: 'transparent', border: '1.5px solid #C7C7CC', boxShadow: `0 0 0 4px ${T.bg}` }}
        />
      )}
      <div className="flex flex-col -mt-1">
        <span
          className="text-[13.5px]"
          style={{
            color: isCurrent ? T.coral : T.muted,
            fontWeight: isCurrent ? 700 : 500,
          }}
        >
          {title}
        </span>
        {subtitle && (
          <span className="text-[12.5px]" style={{ color: isCurrent ? T.mutedDark : T.muted }}>{subtitle}</span>
        )}
      </div>
    </div>
  );
};

const DetailRow = ({ label, value, children }) => (
  <div className="flex flex-col gap-1 py-2.5">
    <span className="text-[12.5px]" style={{ color: T.mutedDark }}>{label}</span>
    {value ? <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>{value}</span> : children}
  </div>
);

const NotificationRow = ({ label, checked, onToggle, last }) => (
  <div className={`flex justify-between items-center py-3 ${last ? '' : ''}`}>
    <span className="text-[13.5px]" style={{ color: T.txt }}>{label}</span>
    <ToggleSwitch checked={checked} onToggle={onToggle} />
  </div>
);

const PolicyGroup = ({ title, items }) => (
  <div className="flex flex-col gap-1.5">
    <span className="text-[12.5px] font-medium" style={{ color: T.txt }}>{title}</span>
    <ul className="flex flex-col gap-1 pl-1">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <div className="w-1 h-1 rounded-full mt-2 flex-shrink-0" style={{ backgroundColor: T.muted }} />
          <span className="text-[12.5px]" style={{ color: T.mutedDark }}>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const ActionMenuItem = ({ icon: Icon, label }) => (
  <button className="w-full px-4 py-2.5 flex items-center gap-3 active:bg-black/5 transition-colors text-left">
    <Icon size={17} color={T.txt} strokeWidth={2} />
    <span className="text-[13.5px] font-medium" style={{ color: T.txt }}>{label}</span>
  </button>
);

export { BookingDetailsScreen };

// --- App Entry ---
export default function App() {
  return (
    <>
      <LocalStyles />
      <div className="flex items-center justify-center min-h-screen py-10 font-sans" style={{ backgroundColor: '#111' }}>
        <div className="relative w-[390px] h-[844px] overflow-hidden" style={{ borderRadius: 55, boxShadow: '0 0 0 12px #000, 0 0 0 14px #333', backgroundColor: T.bg }}>
          <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] rounded-[20px] z-[200] pointer-events-none" style={{ backgroundColor: '#000' }} />
          <StatusBar />
          <div className="w-full h-full relative flex flex-col">
            <BookingDetailsScreen onBack={() => {}} onHome={() => {}} onMessage={() => {}} />
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200]" style={{ backgroundColor: '#000' }} />
        </div>
      </div>
    </>
  );
}
