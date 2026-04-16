import React, { useState } from 'react';
import {
  ChevronLeft, ChevronRight, MapPin, Star, Camera, Bell,
  CreditCard, Shield, Phone, Info, Calendar, PawPrint,
  MessageCircle, User, Trash2, Heart,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════
   65 — USER PROFILE v1
   Full user profile with settings, edit view, and logout
   ═══════════════════════════════════════════════════════ */

const MOCK_USER = {
  firstName: 'Talita',
  lastName: 'Kowalski',
  email: 'talita.k@email.com',
  phone: '+41 78 555 1234',
  address: 'Bahnhofstrasse 12, 8001 Zurich',
  location: 'Zurich, Switzerland',
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

const TABS = [
  { id: 'home', label: 'Home', icon: Calendar },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Star },
  { id: 'activity', label: 'Activity', icon: Heart },
  { id: 'profile', label: 'Profile', icon: User },
];

/* ── Shared Components ── */

const Toggle = ({ value, onChange }) => (
  <div
    role="button"
    tabIndex={0}
    onClick={() => onChange(!value)}
    className="relative flex-shrink-0 cursor-pointer"
    style={{
      width: 48, height: 28, borderRadius: 9999,
      backgroundColor: value ? '#E85D2A' : '#F3EFEB',
      transition: 'background-color 200ms ease',
    }}
  >
    <div
      className="absolute top-[2px] rounded-full bg-white shadow-sm"
      style={{
        width: 24, height: 24,
        transform: value ? 'translateX(22px)' : 'translateX(2px)',
        transition: 'transform 200ms cubic-bezier(0.34, 1.56, 0.64, 1)',
      }}
    />
  </div>
);

const SettingRow = ({ icon: Icon, label, value, toggle, toggleValue, onToggle, onClick, danger, isLast }) => (
  <div
    onClick={onClick}
    role="button"
    tabIndex={0}
    className="flex items-center w-full text-left gap-3 active:bg-black/[0.02] transition-colors cursor-pointer"
    style={{ padding: '13px 20px', borderBottom: isLast ? 'none' : '1px dashed #CFCFD4' }}
  >
    {Icon && (
      <div
        className="flex items-center justify-center flex-shrink-0 rounded-[10px]"
        style={{
          width: 36, height: 36,
          backgroundColor: danger ? 'rgba(255,59,48,0.06)' : '#F3EFEB',
        }}
      >
        <Icon size={18} color={danger ? '#FF3B30' : '#6E6058'} />
      </div>
    )}
    <span className="flex-1 text-[15px]" style={{ color: danger ? '#FF3B30' : '#111' }}>
      {label}
    </span>
    {toggle ? (
      <Toggle value={toggleValue} onChange={onToggle} />
    ) : value ? (
      <div className="flex items-center gap-1">
        <span className="text-[13px] text-[#A09A94]">{value}</span>
        <ChevronRight size={16} className="text-[#A09A94]" />
      </div>
    ) : !danger ? (
      <ChevronRight size={16} className="text-[#A09A94]" />
    ) : null}
  </div>
);

const SectionCard = ({ label, children }) => (
  <div className="mb-3.5">
    {label && (
      <span className="block text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-2 pl-1">
        {label}
      </span>
    )}
    <div className="rounded-[20px] overflow-hidden" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
      {children}
    </div>
  </div>
);

const InputField = ({ label, value, onChange, type = 'text' }) => (
  <div className="mb-4">
    <span className="block text-[12px] font-bold text-[#A09A94] uppercase tracking-widest mb-1.5 px-1">
      {label}
    </span>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full h-[52px] px-4 rounded-[16px] text-[16px] text-[#111] placeholder:text-[#A09A94] focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10 transition-all duration-200"
      style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}
    />
  </div>
);

/* ── Bottom Sheet ── */
const BottomSheet = ({ open, onClose, children }) => {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" style={{ transition: 'opacity 200ms' }} />
      <div
        className="relative w-full rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)]"
        style={{ backgroundColor: '#F7F5F2' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-full flex flex-col items-center pt-5 pb-3">
          <div className="w-10 h-1 rounded-full" style={{ backgroundColor: '#D5CEC7' }} />
        </div>
        <div className="px-6 pb-8">
          {children}
        </div>
      </div>
    </div>
  );
};

/* ── Tab Bar ── */
const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[22px] left-0 w-full px-5 z-40 pointer-events-none">
    <div className="pointer-events-auto backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.06)] rounded-[9999px] h-[55px] flex justify-between items-center px-0.5" style={{ backgroundColor: 'rgba(247,245,242,0.7)' }}>
      {TABS.map(tab => {
        const active = tab.id === activeTab;
        const Icon = tab.icon;
        return (
          <button
            key={tab.id}
            onClick={() => {
              if (tab.id !== 'profile') { window.location.href = '/'; }
              else { onTabChange(tab.id); }
            }}
            className="relative flex-1 h-full flex flex-col items-center justify-center gap-[3px] active:scale-[0.95]"
            style={{ background: 'none', border: 'none', cursor: 'pointer' }}
          >
            <Icon
              size={18}
              strokeWidth={active ? 2 : 1.5}
              className={`transition-all ${active ? 'text-[#E85D2A] scale-110' : 'text-[#A09A94] opacity-60'}`}
            />
            <span
              className={`text-[10px] font-medium transition-all ${active ? 'text-[#E85D2A] opacity-100' : 'opacity-0'}`}
            >
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

/* ── Profile Overview ── */
const ProfileOverview = ({ user, onEditProfile, onRowTap, onToggleTwoFactor, onToggleFaceId, onLogout, onDeleteAccount }) => (
  <div className="absolute inset-0 flex flex-col" style={{ backgroundColor: '#F7F5F2' }}>
    <div className="h-[54px] flex-shrink-0" />

    <div className="flex-1 overflow-y-auto pb-[100px]" style={{ scrollbarWidth: 'none' }}>
      {/* Avatar + name */}
      <div className="flex flex-col items-center pt-2 pb-5 px-6">
        <div
          className="flex items-center justify-center mb-3"
          style={{
            width: 80, height: 80, borderRadius: 9999,
            background: 'linear-gradient(to bottom, #FF7240, #E85D2A)',
            boxShadow: '0 4px 16px rgba(232,93,42,0.3)',
          }}
        >
          <span className="text-white font-semibold text-[28px]">{user.initials}</span>
        </div>
        <h2 className="text-[22px] font-semibold text-[#111] tracking-tight mb-0.5">
          {user.firstName} {user.lastName}
        </h2>
        <p className="text-[13px] text-[#6E6058] mb-1">{user.email}</p>
        <div className="flex items-center gap-1 mb-3">
          <MapPin size={13} className="text-[#6E6058]" />
          <span className="text-[13px] text-[#6E6058]">{user.location}</span>
        </div>
        <button
          onClick={onEditProfile}
          className="px-5 py-2 rounded-full text-[13px] font-medium active:scale-[0.97] transition-all duration-[120ms] cursor-pointer text-[#111]"
          style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}
        >
          Edit Profile
        </button>
      </div>

      {/* Stats */}
      <div className="px-5 mb-5">
        <div className="rounded-[20px] p-5 flex" style={{ backgroundColor: '#F3EFEB', border: '1px solid #EDE8E2' }}>
          {[
            { val: user.pets, label: 'Pets' },
            { val: user.bookings, label: 'Bookings' },
            { val: user.rating, label: 'Rating' },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className="flex-1 flex flex-col items-center"
              style={{ borderRight: i < 2 ? '1px dashed #CFCFD4' : 'none' }}
            >
              <span className="text-[22px] font-semibold text-[#111] tracking-tight">{stat.val}</span>
              <span className="text-[12px] font-bold text-[#A09A94] uppercase tracking-widest">{stat.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Setting sections */}
      <div className="px-5">
        <SectionCard label="Personal">
          <SettingRow icon={User} label="Full Name" value={`${user.firstName} ${user.lastName}`} onClick={() => onRowTap('name')} />
          <SettingRow icon={MessageCircle} label="Email" value={user.email} onClick={() => onRowTap('email')} />
          <SettingRow icon={Phone} label="Phone" value={user.phone} onClick={() => onRowTap('phone')} />
          <SettingRow icon={MapPin} label="Address" value="Zurich" onClick={() => onRowTap('address')} isLast />
        </SectionCard>

        <SectionCard label="Preferences">
          <SettingRow icon={Info} label="Language" value={user.language} onClick={() => onRowTap('language')} />
          <SettingRow icon={Bell} label="Notifications" onClick={() => onRowTap('notifications')} />
          <SettingRow icon={CreditCard} label="Payment Methods" value={user.paymentMethod} onClick={() => onRowTap('payment')} />
          <SettingRow icon={Star} label="Subscription" value={user.subscription} onClick={() => onRowTap('subscription')} isLast />
        </SectionCard>

        <SectionCard label="Security">
          <SettingRow icon={Shield} label="Change Password" onClick={() => onRowTap('password')} />
          <SettingRow icon={Shield} label="Two-Factor Auth" toggle toggleValue={user.twoFactor} onToggle={onToggleTwoFactor} />
          <SettingRow icon={Star} label="Face ID" toggle toggleValue={user.faceId} onToggle={onToggleFaceId} isLast />
        </SectionCard>

        <SectionCard label="Support">
          <SettingRow icon={Info} label="Help Center" onClick={() => onRowTap('help')} />
          <SettingRow icon={Info} label="Report a Problem" onClick={() => onRowTap('report')} />
          <SettingRow icon={Info} label="Terms of Service" onClick={() => onRowTap('terms')} />
          <SettingRow icon={Shield} label="Privacy Policy" onClick={() => onRowTap('privacy')} isLast />
        </SectionCard>

        <SectionCard label="Danger Zone">
          <SettingRow icon={Shield} label="Log Out" danger onClick={onLogout} />
          <SettingRow icon={Trash2} label="Delete Account" danger onClick={onDeleteAccount} isLast />
        </SectionCard>

        <div className="h-4" />
      </div>
    </div>
  </div>
);

/* ── Edit Profile View ── */
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
    <div className="absolute inset-0 z-20" style={{ backgroundColor: '#F7F5F2' }}>
      {/* Header */}
      <header
        className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent"
        style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}
      >
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <button
            onClick={onBack}
            className="w-[44px] h-[44px] flex items-center justify-center rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            style={{ background: '#F3EFEB', border: '1px solid #EDE8E2' }}
          >
            <ChevronLeft size={22} color="#111" />
          </button>
          <h2 className="text-[17px] font-semibold text-[#111]">Edit Profile</h2>
          <button
            onClick={() => onSave(form)}
            className="text-[15px] font-semibold text-[#E85D2A] active:opacity-60 transition-opacity cursor-pointer"
            style={{ width: 44, textAlign: 'center', background: 'none', border: 'none' }}
          >
            Save
          </button>
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto pb-[120px]" style={{ paddingTop: 100, paddingLeft: 20, paddingRight: 20, scrollbarWidth: 'none' }}>
        {/* Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div
              className="flex items-center justify-center"
              style={{
                width: 80, height: 80, borderRadius: 9999,
                background: 'linear-gradient(to bottom, #FF7240, #E85D2A)',
                boxShadow: '0 4px 16px rgba(232,93,42,0.3)',
              }}
            >
              <span className="text-white font-semibold text-[28px]">{user.initials}</span>
            </div>
            <div
              className="absolute bottom-0 right-0 flex items-center justify-center"
              style={{
                width: 28, height: 28, borderRadius: 9999,
                background: 'linear-gradient(to bottom, #FF7240, #E85D2A)',
                border: '2px solid #F7F5F2',
                boxShadow: '0 2px 8px rgba(232,93,42,0.3)',
              }}
            >
              <Camera size={14} color="white" />
            </div>
          </div>
        </div>

        <InputField label="First Name" value={form.firstName} onChange={(v) => update('firstName', v)} />
        <InputField label="Last Name" value={form.lastName} onChange={(v) => update('lastName', v)} />
        <InputField label="Email" value={form.email} onChange={(v) => update('email', v)} type="email" />
        <InputField label="Phone" value={form.phone} onChange={(v) => update('phone', v)} type="tel" />
        <InputField label="Address" value={form.address} onChange={(v) => update('address', v)} />

        <button
          onClick={() => onSave(form)}
          className="w-full flex items-center justify-center font-semibold text-[16px] text-white mt-4 bg-[#111] rounded-[14px] py-3.5 active:scale-[0.97] transition-all duration-[120ms]"
          style={{
            border: 'none', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,0,0,0.12)',
          }}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════ */
export default function App() {
  const [activeTab, setActiveTab] = useState('profile');
  const [view, setView] = useState('overview');
  const [showLogout, setShowLogout] = useState(false);
  const [user, setUser] = useState({ ...MOCK_USER });

  const handleToggleTwoFactor = (val) => setUser((prev) => ({ ...prev, twoFactor: val }));
  const handleToggleFaceId = (val) => setUser((prev) => ({ ...prev, faceId: val }));
  const handleSave = (formData) => { setUser((prev) => ({ ...prev, ...formData })); setView('overview'); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .up-scroll::-webkit-scrollbar { display: none; }
        .up-scroll { scrollbar-width: none; }
      `}</style>

      <div
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20,
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          className="relative"
          style={{
            width: 390, height: 844, borderRadius: 50,
            border: '8px solid #000', overflow: 'hidden',
            backgroundColor: '#F7F5F2',
          }}
        >
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]"
               style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Home indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]"
               style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Views */}
          <div className="relative w-full h-full overflow-hidden">
            {view === 'overview' ? (
              <ProfileOverview
                user={user}
                onEditProfile={() => setView('edit')}
                onRowTap={(row) => {
                  if (row === 'language') window.location.href = '/language';
                  else if (row === 'notifications') window.location.href = '/notification-prefs';
                  else if (row === 'payment') window.location.href = '/wallet';
                  else if (row === 'subscription') window.location.href = '/subscription';
                  else if (row === 'help') window.location.href = '/help';
                  else setView('edit');
                }}
                onToggleTwoFactor={handleToggleTwoFactor}
                onToggleFaceId={handleToggleFaceId}
                onLogout={() => setShowLogout(true)}
                onDeleteAccount={() => {}}
              />
            ) : (
              <EditProfileView user={user} onBack={() => setView('overview')} onSave={handleSave} />
            )}

            <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>

          {/* Logout sheet */}
          <BottomSheet open={showLogout} onClose={() => setShowLogout(false)}>
            <div className="flex flex-col items-center">
              <h3 className="text-[18px] font-semibold text-[#111] mb-2">Are you sure?</h3>
              <p className="text-[13px] text-[#6E6058] mb-6 text-center">
                You will be logged out of your Fylos account on this device.
              </p>
              <button
                onClick={() => setShowLogout(false)}
                className="w-full flex items-center justify-center font-semibold text-[16px] text-white mb-3 active:scale-[0.97] transition-all duration-[120ms] rounded-[14px] py-3.5"
                style={{ backgroundColor: '#FF3B30', border: 'none', cursor: 'pointer' }}
              >
                Log Out
              </button>
              <button
                onClick={() => setShowLogout(false)}
                className="w-full flex items-center justify-center font-semibold text-[16px] text-[#111] active:scale-[0.97] transition-all duration-[120ms] rounded-[14px] py-3.5 cursor-pointer"
                style={{ backgroundColor: '#F3EFEB', border: 'none' }}
              >
                Cancel
              </button>
            </div>
          </BottomSheet>
        </div>
      </div>
    </>
  );
}
