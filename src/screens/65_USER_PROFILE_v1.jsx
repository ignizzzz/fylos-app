import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Star, Camera, Check, X, Heart,
  Bell, CreditCard, Shield, Phone, Settings, Info, Circle, Calendar,
  PawPrint, MessageCircle, Moon, User, LogOut, Trash2, ChevronDown
} from 'lucide-react';

/* ─────────── THEME ─────────── */
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

/* ─────────── MOCK DATA ─────────── */
const MOCK_USER = {
  firstName: 'Talita',
  lastName: 'Kowalski',
  email: 'talita.k@email.com',
  phone: '+41 78 555 1234',
  address: 'Bahnhofstrasse 12, 8001 Zürich',
  location: 'Zürich, Switzerland',
  initials: 'TK',
  pets: 2,
  bookings: 14,
  rating: 4.9,
  language: 'English',
  paymentMethod: 'Visa ••42',
  subscription: 'Fylos Free',
  twoFactor: false,
  faceId: true,
};

/* ─────────── FYLOS LOGO ─────────── */
const FylosLogo = ({ textColor = '#000', dotColor = '#E85D2A', fontSize = '2rem', className = '' }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

/* ─────────── DESIGN TOKENS ─────────── */
const Text = ({ variant = 'body', className = '', style = {}, children, ...props }) => {
  const variants = {
    title: 'text-[22px] font-semibold text-[#111111] tracking-tight',
    subtitle: 'text-[16px] font-medium text-[#111111]',
    body: 'text-[15px] text-[#111111] leading-relaxed',
    caption: 'text-[13px] text-[#6E6E73]',
    label: 'text-[12px] font-semibold text-[#8E8E93] uppercase tracking-widest',
  };
  return <div className={`${variants[variant]} ${className}`} style={style} {...props}>{children}</div>;
};

/* ─────────── TOGGLE ─────────── */
const Toggle = ({ value, onChange }) => (
  <button
    onClick={() => onChange(!value)}
    className="relative flex-shrink-0 transition-colors"
    style={{
      width: 48, height: 28, borderRadius: 9999,
      backgroundColor: value ? THEME.colors.accent : THEME.colors.surfaceAlt,
      transition: `background-color ${THEME.motion.fade}`,
    }}
  >
    <div
      className="absolute top-[2px] rounded-full bg-white shadow-sm transition-transform"
      style={{
        width: 24, height: 24,
        transform: value ? 'translateX(22px)' : 'translateX(2px)',
        transition: `transform ${THEME.motion.fade} ${THEME.motion.spring}`,
      }}
    />
  </button>
);

/* ─────────── SETTING ROW ─────────── */
const SettingRow = ({ icon: Icon, label, value, toggle, toggleValue, onToggle, onClick, danger, isLast }) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    className="flex items-center w-full text-left gap-3 px-4 py-3 active:bg-black/[0.02] transition-colors cursor-pointer"
    style={{ borderBottom: isLast ? 'none' : `1px solid ${THEME.colors.divider}` }}
  >
    {Icon && (
      <div className="flex items-center justify-center flex-shrink-0" style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: THEME.colors.surfaceAlt }}>
        <Icon size={20} color={danger ? THEME.colors.danger : THEME.colors.secondaryText} />
      </div>
    )}
    <span className="flex-1 text-[15px]" style={{ color: danger ? THEME.colors.danger : THEME.colors.primaryText }}>
      {label}
    </span>
    {toggle ? (
      <Toggle value={toggleValue} onChange={onToggle} />
    ) : value ? (
      <div className="flex items-center gap-1">
        <span className="text-[13px]" style={{ color: THEME.colors.tertiaryText }}>{value}</span>
        <ChevronRight size={16} color={THEME.colors.tertiaryText} />
      </div>
    ) : !danger ? (
      <ChevronRight size={16} color={THEME.colors.tertiaryText} />
    ) : null}
  </div>
);

/* ─────────── SECTION CARD ─────────── */
const SectionCard = ({ label, children }) => (
  <div className="mb-4">
    {label && <Text variant="label" className="px-4 mb-2">{label}</Text>}
    <div style={{ backgroundColor: THEME.colors.surface, borderRadius: 20, boxShadow: THEME.shadows.soft, overflow: 'hidden' }}>
      {children}
    </div>
  </div>
);

/* ─────────── INPUT FIELD ─────────── */
const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <Text variant="label" className="mb-1.5 px-1">{label}</Text>
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      className="w-full outline-none text-[15px] text-[#111111] placeholder:text-[#C7C7CC]"
      style={{
        height: 52, borderRadius: 16,
        border: '1px solid rgba(0,0,0,0.08)',
        padding: '0 16px',
        backgroundColor: THEME.colors.surface,
        transition: `border-color ${THEME.motion.fade}`,
      }}
      onFocus={e => (e.target.style.borderColor = THEME.colors.accent)}
      onBlur={e => (e.target.style.borderColor = 'rgba(0,0,0,0.08)')}
    />
  </div>
);

/* ─────────── BOTTOM SHEET ─────────── */
const BottomSheet = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/30" style={{ transition: `opacity ${THEME.motion.fade}` }} />
      <div
        className="relative w-full px-4 pb-8 pt-6"
        style={{ backgroundColor: THEME.colors.surface, borderRadius: '24px 24px 0 0', maxWidth: 390 }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-10 h-1 rounded-full bg-[#D1D1D6] mx-auto mb-5" />
        {children}
      </div>
    </div>
  );
};

/* ─────────── TAB BAR ─────────── */
const TABS = [
  { id: 'home', label: 'Home', icon: Circle },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
];

const TabBar = ({ activeTab, onTabChange }) => (
  <nav
    className="absolute bottom-0 left-0 right-0 flex items-end justify-around pb-7 pt-2"
    style={{ backgroundColor: THEME.colors.surface, borderTop: `1px solid ${THEME.colors.divider}` }}
  >
    {TABS.map(tab => {
      const active = tab.id === activeTab;
      const Icon = tab.icon;
      return (
        <button key={tab.id} onClick={() => {
          if (tab.id === 'home') { window.location.href = '/'; }
          else if (tab.id === 'pets') { window.location.href = '/'; }
          else if (tab.id === 'services') { window.location.href = '/'; }
          else if (tab.id === 'activity') { window.location.href = '/'; }
          else { onTabChange(tab.id); }
        }} className="flex flex-col items-center gap-0.5 min-w-[56px]">
          <Icon size={22} color={active ? THEME.colors.accent : THEME.colors.tertiaryText} strokeWidth={active ? 2.2 : 1.6} />
          <span className="text-[10px] font-medium" style={{ color: active ? THEME.colors.accent : THEME.colors.tertiaryText }}>{tab.label}</span>
        </button>
      );
    })}
  </nav>
);

/* ─────────── PROFILE OVERVIEW VIEW ─────────── */
const ProfileOverview = ({ user, onEditProfile, onRowTap, onToggleTwoFactor, onToggleFaceId, onLogout, onDeleteAccount }) => {
  const scrollRef = useRef(null);

  return (
    <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: THEME.colors.background }}>
      {/* Status bar spacer */}
      <div className="h-[54px] flex-shrink-0" />

      {/* Scrollable content */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pb-[100px]" style={{ WebkitOverflowScrolling: 'touch' }}>
        {/* Header / Profile Card */}
        <div className="flex flex-col items-center pt-2 pb-5 px-6">
          {/* Avatar */}
          <div
            className="flex items-center justify-center mb-3"
            style={{
              width: 80, height: 80, borderRadius: 9999,
              background: 'linear-gradient(135deg, #F4A261, #E76F51)',
            }}
          >
            <span className="text-white font-semibold text-[28px]">{user.initials}</span>
          </div>
          <Text variant="title" className="mb-0.5">{user.firstName} {user.lastName}</Text>
          <Text variant="caption" className="mb-1">{user.email}</Text>
          <div className="flex items-center gap-1 mb-3">
            <MapPin size={13} color={THEME.colors.secondaryText} />
            <span className="text-[13px]" style={{ color: THEME.colors.secondaryText }}>{user.location}</span>
          </div>
          <button
            onClick={onEditProfile}
            className="px-4 py-1.5 rounded-full text-[13px] font-medium border transition-colors active:scale-[0.97]"
            style={{ borderColor: 'rgba(0,0,0,0.08)', color: THEME.colors.primaryText }}
          >
            Edit Profile
          </button>
        </div>

        {/* Stats Row */}
        <div className="mx-4 mb-5 flex gap-0" style={{ backgroundColor: THEME.colors.surfaceAlt, borderRadius: 16, padding: 16 }}>
          {[
            { val: user.pets, label: 'Pets' },
            { val: user.bookings, label: 'Bookings' },
            { val: user.rating, label: 'Rating' },
          ].map((stat, i) => (
            <div key={stat.label} className="flex-1 flex flex-col items-center" style={{ borderRight: i < 2 ? `1px solid ${THEME.colors.divider}` : 'none' }}>
              <span className="text-[20px] font-semibold" style={{ color: THEME.colors.primaryText }}>{stat.val}</span>
              <span className="text-[12px]" style={{ color: THEME.colors.secondaryText }}>{stat.label}</span>
            </div>
          ))}
        </div>

        {/* Sections */}
        <div className="px-4">
          {/* Personal */}
          <SectionCard label="Personal">
            <SettingRow icon={User} label="Full Name" value={`${user.firstName} ${user.lastName}`} onClick={() => onRowTap('name')} />
            <SettingRow icon={MessageCircle} label="Email" value={user.email} onClick={() => onRowTap('email')} />
            <SettingRow icon={Phone} label="Phone" value={user.phone} onClick={() => onRowTap('phone')} />
            <SettingRow icon={MapPin} label="Address" value="Zürich" onClick={() => onRowTap('address')} isLast />
          </SectionCard>

          {/* Preferences */}
          <SectionCard label="Preferences">
            <SettingRow icon={Circle} label="Language" value={user.language} onClick={() => onRowTap('language')} />
            <SettingRow icon={Bell} label="Notifications" onClick={() => onRowTap('notifications')} />
            <SettingRow icon={CreditCard} label="Payment Methods" value={user.paymentMethod} onClick={() => onRowTap('payment')} />
            <SettingRow icon={Star} label="Subscription" value={user.subscription} onClick={() => onRowTap('subscription')} isLast />
          </SectionCard>

          {/* Security */}
          <SectionCard label="Security">
            <SettingRow icon={Shield} label="Change Password" onClick={() => onRowTap('password')} />
            <SettingRow icon={Shield} label="Two-Factor Auth" toggle toggleValue={user.twoFactor} onToggle={onToggleTwoFactor} />
            <SettingRow icon={Star} label="Face ID" toggle toggleValue={user.faceId} onToggle={onToggleFaceId} isLast />
          </SectionCard>

          {/* Support */}
          <SectionCard label="Support">
            <SettingRow icon={Info} label="Help Center" onClick={() => onRowTap('help')} />
            <SettingRow icon={Info} label="Report a Problem" onClick={() => onRowTap('report')} />
            <SettingRow icon={Info} label="Terms of Service" onClick={() => onRowTap('terms')} />
            <SettingRow icon={Shield} label="Privacy Policy" onClick={() => onRowTap('privacy')} isLast />
          </SectionCard>

          {/* Danger Zone */}
          <SectionCard label="Danger Zone">
            <SettingRow icon={LogOut} label="Log Out" danger onClick={onLogout} />
            <SettingRow icon={Trash2} label="Delete Account" danger onClick={onDeleteAccount} isLast />
          </SectionCard>

          <div className="h-4" />
        </div>
      </div>
    </div>
  );
};

/* ─────────── EDIT PROFILE VIEW ─────────── */
const EditProfileView = ({ user, onBack, onSave }) => {
  const [form, setForm] = useState({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    phone: user.phone,
    address: user.address,
  });

  const update = (key, val) => setForm(prev => ({ ...prev, [key]: val }));

  return (
    <div className="absolute inset-0" style={{ backgroundColor: THEME.colors.background, zIndex: 20 }}>
      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={onBack}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Edit Profile</h2>
          {/* Right: Save button */}
          <button onClick={() => onSave(form)} className="text-[15px] font-semibold active:opacity-60 transition-opacity pointer-events-auto" style={{ color: THEME.colors.accent, width: 44, textAlign: 'center' }}>
            Save
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="absolute inset-0 overflow-y-auto px-6 pb-[120px]" style={{ paddingTop: 54, WebkitOverflowScrolling: 'touch' }}>
        {/* Photo */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="flex items-center justify-center"
              style={{
                width: 80, height: 80, borderRadius: 9999,
                background: 'linear-gradient(135deg, #F4A261, #E76F51)',
              }}
            >
              <span className="text-white font-semibold text-[28px]">{user.initials}</span>
            </div>
            <div
              className="absolute bottom-0 right-0 flex items-center justify-center"
              style={{
                width: 28, height: 28, borderRadius: 9999,
                backgroundColor: THEME.colors.accent,
                border: '2px solid white',
              }}
            >
              <Camera size={14} color="white" />
            </div>
          </div>
        </div>

        {/* Fields */}
        <InputField label="First Name" value={form.firstName} onChange={v => update('firstName', v)} />
        <InputField label="Last Name" value={form.lastName} onChange={v => update('lastName', v)} />
        <InputField label="Email" value={form.email} onChange={v => update('email', v)} type="email" />
        <InputField label="Phone" value={form.phone} onChange={v => update('phone', v)} type="tel" />
        <InputField label="Address" value={form.address} onChange={v => update('address', v)} />

        {/* Save Button */}
        <button
          onClick={() => onSave(form)}
          className="w-full flex items-center justify-center font-semibold text-[16px] text-white mt-4 active:scale-[0.98] transition-transform"
          style={{
            height: 52, borderRadius: 16,
            backgroundColor: THEME.colors.accent,
            boxShadow: '0 4px 14px rgba(232,93,42,0.25)',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ─────────── MAIN APP ─────────── */
export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [view, setView] = useState('overview'); // 'overview' | 'edit'
  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState({ ...MOCK_USER });

  const handleToggleTwoFactor = (val) => setUser(prev => ({ ...prev, twoFactor: val }));
  const handleToggleFaceId = (val) => setUser(prev => ({ ...prev, faceId: val }));

  const handleSave = (formData) => {
    setUser(prev => ({ ...prev, ...formData }));
    setView('overview');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px', fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", system-ui, sans-serif' }}>
      {/* iPhone Frame */}
      <div
        className="relative"
        style={{
          width: 390, height: 844,
          borderRadius: 50,
          border: '8px solid #000',
          overflow: 'hidden',
          backgroundColor: '#F9F9FB',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
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

        {/* Screen Content */}
        <div className="relative w-full h-full overflow-hidden">
          {view === 'overview' ? (
            <ProfileOverview
              user={user}
              onEditProfile={() => setView('edit')}
              onRowTap={(row) => {
                if (row === 'language') { window.location.href = '/language'; }
                else if (row === 'notifications') { window.location.href = '/notification-prefs'; }
                else if (row === 'payment') { window.location.href = '/wallet'; }
                else if (row === 'subscription') { window.location.href = '/subscription'; }
                else if (row === 'help') { window.location.href = '/help'; }
                else { setView('edit'); }
              }}
              onToggleTwoFactor={handleToggleTwoFactor}
              onToggleFaceId={handleToggleFaceId}
              onLogout={() => setShowLogout(true)}
              onDeleteAccount={() => {}}
            />
          ) : (
            <EditProfileView
              user={user}
              onBack={() => setView('overview')}
              onSave={handleSave}
            />
          )}

          {/* Tab Bar */}
          <TabBar activeTab={activeTab} onTabChange={setActiveTab} />

        </div>

        {/* Logout Bottom Sheet */}
        <BottomSheet open={showLogout} onClose={() => setShowLogout(false)}>
          <div className="flex flex-col items-center">
            <Text variant="title" className="mb-2">Are you sure?</Text>
            <Text variant="caption" className="mb-6 text-center">You will be logged out of your Fylos account on this device.</Text>
            <button
              onClick={() => setShowLogout(false)}
              className="w-full flex items-center justify-center font-semibold text-[16px] text-white mb-3 active:scale-[0.98] transition-transform"
              style={{ height: 52, borderRadius: 16, backgroundColor: THEME.colors.danger }}
            >
              Log Out
            </button>
            <button
              onClick={() => setShowLogout(false)}
              className="w-full flex items-center justify-center font-semibold text-[16px] active:scale-[0.98] transition-transform"
              style={{ height: 52, borderRadius: 16, color: THEME.colors.primaryText }}
            >
              Cancel
            </button>
          </div>
        </BottomSheet>
      </div>
    </div>
  );
}
