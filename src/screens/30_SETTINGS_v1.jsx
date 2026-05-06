import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, PawPrint, Calendar, Activity, Folder, Search, Bell, 
  ChevronLeft, ChevronRight, MoreHorizontal, X, CheckCircle2, 
  AlertCircle, AlertTriangle, Info, Loader2, ChevronDown, 
  User, Shield, CreditCard, Sliders, Database, HelpCircle,
  Smartphone, Mail, Lock, Globe, Moon, Sun, Trash2, Download,
  LogOut, Plus, Camera, Image as ImageIcon, Settings,
  HeartPulse, Rocket, Sparkles, ShieldCheck
} from 'lucide-react';

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ textColor = '#000000', dotColor = '#E85D2A', fontSize = '2rem', className = '' }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize: fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// --- MOCK DATA ---
const MOCK_USER = {
  id: 'user_001',
  name: 'Alex Mueller',
  email: 'alex@example.com',
  phone: '+41 79 123 4567',
  avatar: 'https://i.pravatar.cc/150?u=alex_fylos',
  location: 'Zürich, Switzerland',
  notifications: 1,
  verified: { email: true, phone: true }
};

const MOCK_SETTINGS = {
  notifications: {
    push: { likes: true, friendRequests: true, playdates: true, bookingUpdates: true, healthReminders: true, marketing: false },
    email: { weeklyDigest: true, importantUpdates: true, marketing: false },
    inApp: { badge: true, sounds: true, vibration: true },
    quietHours: { enabled: true, start: '22:00', end: '08:00' }
  },
  privacy: {
    activitySharing: { photos: 'friends', checkIns: 'friends', milestones: 'friends', serviceReviews: 'public' },
    profileVisibility: 'friends',
    locationSharing: { precision: 'approximate', showInCommunity: false },
    dataCollection: { analytics: true, personalization: true }
  },
  preferences: { theme: 'dark', language: 'en', units: { weight: 'kg', distance: 'km', temperature: 'celsius' }, currency: 'CHF', defaultPet: 'pet_001' }
};

const MOCK_PETS = [
  { id: 'pet_001', name: 'Luna', breed: 'Golden Retriever', age: '3 years old', avatar: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&q=80&w=150&h=150', isActive: true },
  { id: 'pet_002', name: 'Max', breed: 'Beagle', age: '1 year old', avatar: 'https://images.unsplash.com/photo-1537151608804-ea2f1ea14a15?auto=format&fit=crop&q=80&w=150&h=150', isActive: false }
];

const MOCK_CARDS = [
  { id: 'pm_001', type: 'Visa', last4: '4242', exp: '12/25', isDefault: true },
  { id: 'pm_002', type: 'Mastercard', last4: '8888', exp: '06/26', isDefault: false }
];

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

const THEME = {
  colors: { accent: '#E85D2A', primaryText: '#111', secondaryText: '#6E6058', danger: '#FF3B30', success: '#00C060', divider: '#CFCFD4' }
};

// --- DESIGN SYSTEM COMPONENTS ---
const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[24px] font-bold text-[#111] tracking-tight",
    subtitle: "text-[17px] font-semibold text-[#111]",
    body: "text-[15px] text-[#111] leading-relaxed",
    caption: "text-[13px] text-[#6E6058]",
    label: "text-[12px] font-semibold text-[#A09A94] uppercase tracking-wider"
  };
  return <div className={`${variants[variant]} ${className}`} {...props}>{children}</div>;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F3EFEB] text-[#6E6058]",
    count: "bg-[#FF3B30] text-white px-1.5 py-0 min-w-[18px] justify-center text-[10px]",
    success: "bg-[#E5F9ED] text-[#00C060]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    error: "bg-[#FFE5E5] text-[#FF3B30]",
    info: "bg-[#E5F0FF] text-[#007AFF]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, initials, size = 48, badge, badgeColor = THEME.colors.danger }) => (
  <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
    {src ? (
      <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
    ) : (
      <div className="w-full h-full rounded-full bg-[#F3EFEB] border border-[#EDE8E2] flex items-center justify-center text-[#111] font-semibold" style={{ fontSize: size * 0.4 }}>
        {initials}
      </div>
    )}
    {badge && <div className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center px-1 text-[10px] font-bold text-white z-10" style={{ backgroundColor: badgeColor }}>{badge}</div>}
  </div>
);

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const variants = {
    primary: "bg-[#111] text-white shadow-[0_4px_20px_rgba(0,0,0,0.12)]",
    secondary: "bg-transparent text-[#111] border-[1.5px] border-[#EDE8E2] hover:bg-[#F3EFEB]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]"
  };
  const sizes = { small: "px-3 py-2 text-[14px] rounded-xl", medium: "px-4 py-[14px] text-[16px]", large: "px-6 py-4 text-[18px] rounded-[20px]" };
  
  return (
    <button 
      disabled={disabled || isLoading}
      className={`relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2 ${variants[variant]} ${sizes[size]} ${fullWidth ? "w-full" : "w-auto inline-flex"} ${(disabled || isLoading) ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : ""} ${className}`}
      {...props}
    >
      {isLoading ? <Loader2 className="animate-spin" size={16} color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={size === 'small' ? 16 : 20} />}{children}</>}
    </button>
  );
};

const TextInput = ({ label, error, helperText, disabled, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[#6E6058] ml-1">{label}</label>}
    <input disabled={disabled} className={`w-full h-[52px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111] rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#E85D2A]/10 ${error ? 'border-[#FF3B30] focus:border-[#FF3B30]' : 'border-[#EDE8E2] focus:border-[#E85D2A]'} placeholder:text-[#A09A94]`} {...props} />
    {error ? <span className="text-[12px] text-[#FF3B30] ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span> : helperText ? <span className="text-[12px] text-[#A09A94] ml-1">{helperText}</span> : null}
  </div>
);

const Select = ({ label, options = [], value, onChange, disabled, className = '' }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[#6E6058] ml-1">{label}</label>}
    <div className="relative">
      <select
        disabled={disabled}
        {...(onChange ? { value, onChange } : { defaultValue: value })}
        className="w-full h-[52px] px-4 pr-10 bg-[#FFFFFF] border border-[#EDE8E2] text-[16px] text-[#111] rounded-2xl appearance-none transition-all focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10"
      >
        {options.map((opt, i) => <option key={i} value={opt.value}>{opt.label}</option>)}
      </select>
      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-[#A09A94]"><ChevronDown size={18} /></div>
    </div>
  </div>
);

const Switch = ({ checked, onChange }) => (
  <button role="switch" aria-checked={checked} onClick={() => onChange(!checked)} className={`w-[50px] h-[30px] rounded-full p-1 transition-colors duration-200 ease-in-out ${checked ? 'bg-[#00C060]' : 'bg-[#D5CEC7]'} shrink-0`}>
    <div className={`w-[22px] h-[22px] bg-white rounded-full shadow-sm transition-transform duration-200 ease-in-out ${checked ? 'translate-x-[20px]' : 'translate-x-0'}`} />
  </button>
);

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useEffect(() => { setPortalNode(document.getElementById('modal-root')); }, []);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    } else {
      setVisible(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) setTranslateY(delta);
  };
  
  const handleTouchEnd = () => {
    if (translateY > 80) onClose();
    else setTranslateY(0);
  };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0" onTouchStart={(e) => touchStartY.current = e.touches[0].clientY} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto flex-1 custom-scrollbar">
          {title && <h3 className="text-[20px] font-bold text-[#111] mb-4">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};

const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none">
    <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group"
          >
            <div className={`absolute top-[12px] w-[32px] h-[32px] bg-[#E85D2A] rounded-full blur-[12px] transition-opacity duration-[240ms] ${isActive ? 'opacity-25' : 'opacity-0'}`} />
            <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#E85D2A] animate-spring-bump' : 'text-[#A09A94]'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] font-medium transition-colors ${isActive ? 'text-[#E85D2A]' : 'text-[#A09A94]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

// --- SETTINGS SPECIFIC UI COMPONENTS ---

const SettingsSection = ({ title, children, footer, variant = 'card' }) => (
  <div className="mb-4 px-5">
    {title && <h3 className="mb-2 text-[12px] font-semibold text-[#A09A94] uppercase tracking-wider ml-1">{title}</h3>}
    <div className={
      variant === 'card'
        ? "bg-white rounded-[22px] border border-black/[0.04] overflow-hidden shadow-[0_2px_10px_rgba(20,14,8,0.04)]"
        : "bg-[#F3EFEB] rounded-[20px] border border-[#EDE8E2] overflow-hidden"
    }>
      {children}
    </div>
    {footer && <p className="mt-2 text-[13px] text-[#6E6058] ml-1">{footer}</p>}
  </div>
);

const SettingsRow = ({ icon: Icon, title, subtitle, right, onClick, destructive, isLast, iconBg, iconColor, iconSize = 'sm' }) => {
  const dim = iconSize === 'lg' ? { box: 'w-10 h-10', icon: 20 } : { box: 'w-8 h-8', icon: 18 };
  return (
    <div className="relative">
      <div onClick={onClick} className={`flex items-center gap-3 px-4 py-3.5 ${onClick ? 'cursor-pointer active:bg-black/5 transition-colors' : ''}`}>
        {Icon && (
          <div className={`${dim.box} rounded-full flex items-center justify-center shrink-0 ${destructive ? 'bg-[#FFE5E5]' : iconBg || 'bg-[#F7F5F2]'}`}>
            <Icon size={dim.icon} color={destructive ? THEME.colors.danger : (iconColor || (iconBg ? '#FFFFFF' : THEME.colors.primaryText))} strokeWidth={1.9} />
          </div>
        )}
        <div className="flex-1 min-w-0 pr-2">
          <div className={`text-[16px] truncate ${destructive ? 'text-[#FF3B30] font-semibold' : 'text-[#111] font-semibold'}`}>{title}</div>
          {subtitle && <div className="text-[13px] text-[#6E6058] truncate mt-0.5 leading-snug">{subtitle}</div>}
        </div>
        {right && <div className="shrink-0">{right}</div>}
        {onClick && !right && !destructive && <ChevronRight size={18} className="text-[#CFCFD4] shrink-0" />}
      </div>
      {!isLast && <div className="absolute bottom-0 left-[60px] right-4 border-t border-[#F0ECE7]" />}
    </div>
  );
};

const SettingsScreenLayout = ({ title, onBack, children }) => (
  <div className="absolute inset-0 bg-[#F7F5F2] z-[60] flex flex-col animate-in slide-in-from-right-full duration-200 ease-out">
    <header className="pt-14 pb-4 px-5 bg-[#F7F5F2] flex items-center justify-between shrink-0">
      <button onClick={onBack} className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-95 transition-all" style={{ background: '#F3EFEB' }}>
        <ChevronLeft size={22} color="#111" />
      </button>
      <h2 className="text-[17px] font-semibold text-[#111]">{title}</h2>
      <div className="w-[44px]" />
    </header>
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
      {children}
    </div>
  </div>
);

// --- INDIVIDUAL SETTINGS SCREENS ---

const AccountSettings = ({ onBack }) => {
  const [photoSheet, setPhotoSheet] = useState(false);
  return (
    <SettingsScreenLayout title="Account" onBack={onBack}>
      <div className="flex flex-col items-center mt-4 mb-8">
        <div className="relative mb-3">
          <Avatar src={MOCK_USER.avatar} size={100} />
          <button onClick={() => setPhotoSheet(true)} className="absolute bottom-0 right-0 w-8 h-8 bg-[#E85D2A] rounded-full border-[3px] border-[#F7F5F2] flex items-center justify-center shadow-sm">
            <Camera size={14} color="white" />
          </button>
        </div>
      </div>

      <SettingsSection title="Personal Information">
        <div className="p-4 space-y-4">
          <TextInput label="Full Name" defaultValue={MOCK_USER.name} />
          <TextInput label="Email" defaultValue={MOCK_USER.email} helperText="✓ Verified" />
          <TextInput label="Phone" defaultValue={MOCK_USER.phone} helperText="✓ Verified" />
          <Select label="Location" value="zurich" options={[{label: 'Zürich, Switzerland', value: 'zurich'}]} />
        </div>
      </SettingsSection>

      <SettingsSection title="Security">
        <SettingsRow title="Password" subtitle="••••••••••••" right={<Button variant="secondary" size="small" fullWidth={false}>Change</Button>} />
        <SettingsRow title="Two-Factor Authentication" subtitle="○ Disabled" right={<Button variant="secondary" size="small" fullWidth={false}>Enable</Button>} isLast />
      </SettingsSection>

      <div className="px-5 mt-8 mb-6">
        <Button variant="primary">Save Changes</Button>
      </div>

      <BottomSheet isOpen={photoSheet} onClose={() => setPhotoSheet(false)} title="Change Photo">
        <div className="space-y-2 mt-2">
          <SettingsRow icon={Camera} title="Take Photo" onClick={() => setPhotoSheet(false)} />
          <SettingsRow icon={ImageIcon} title="Choose from Library" onClick={() => setPhotoSheet(false)} />
          <SettingsRow icon={Trash2} title="Remove Photo" destructive onClick={() => setPhotoSheet(false)} isLast />
        </div>
      </BottomSheet>
    </SettingsScreenLayout>
  );
};

const PetsManagement = ({ onBack }) => (
  <SettingsScreenLayout title="Pets" onBack={onBack}>
    <SettingsSection title="My Pets">
      {MOCK_PETS.map((pet, idx) => (
        <SettingsRow 
          key={pet.id} 
          right={<Button variant="secondary" size="small" fullWidth={false}>Edit</Button>}
          isLast={idx === MOCK_PETS.length - 1}
          title={
            <div className="flex items-center gap-2">
              {pet.name}
              {pet.isActive ? <span className="w-2 h-2 bg-[#00C060] rounded-full" /> : <span className="w-2 h-2 border border-[#A09A94] rounded-full" />}
            </div>
          }
          subtitle={`${pet.breed} • ${pet.age}`}
          icon={() => <Avatar src={pet.avatar} size={40} />}
        />
      ))}
      <div className="p-4">
        <Button variant="secondary" icon={Plus}>Add New Pet</Button>
      </div>
    </SettingsSection>
    <SettingsSection title="Default Pet" footer="Show this pet's data by default when opening the app.">
      <div className="p-4"><Select value={MOCK_PETS[0].id} options={MOCK_PETS.map(p => ({label: p.name, value: p.id}))} /></div>
    </SettingsSection>
  </SettingsScreenLayout>
);

const NotificationSettings = ({ onBack }) => {
  const [s, setS] = useState(MOCK_SETTINGS.notifications);
  const toggle = (cat, key) => setS(p => ({ ...p, [cat]: { ...p[cat], [key]: !p[cat][key] } }));

  return (
    <SettingsScreenLayout title="Notifications" onBack={onBack}>
      <SettingsSection title="Push Notifications">
        <SettingsRow title="Likes & Comments" subtitle="When friends interact with your posts" right={<Switch checked={s.push.likes} onChange={() => toggle('push', 'likes')} />} />
        <SettingsRow title="Friend Requests" subtitle="New friend requests & accepts" right={<Switch checked={s.push.friendRequests} onChange={() => toggle('push', 'friendRequests')} />} />
        <SettingsRow title="Playdate Invitations" subtitle="Invites and updates" right={<Switch checked={s.push.playdates} onChange={() => toggle('push', 'playdates')} />} />
        <SettingsRow title="Booking Updates" subtitle="Walk confirmations, reminders" right={<Switch checked={s.push.bookingUpdates} onChange={() => toggle('push', 'bookingUpdates')} />} />
        <SettingsRow title="Health Reminders" subtitle="Medication, vet appointments" right={<Switch checked={s.push.healthReminders} onChange={() => toggle('push', 'healthReminders')} />} />
        <SettingsRow title="Marketing Messages" subtitle="News, tips, promotions" right={<Switch checked={s.push.marketing} onChange={() => toggle('push', 'marketing')} />} isLast />
      </SettingsSection>

      <SettingsSection title="Email Notifications">
        <SettingsRow title="Weekly Digest" subtitle="Summary of your pet's week" right={<Switch checked={s.email.weeklyDigest} onChange={() => toggle('email', 'weeklyDigest')} />} />
        <SettingsRow title="Important Updates" subtitle="Security, account changes" right={<Switch checked={s.email.importantUpdates} onChange={() => toggle('email', 'importantUpdates')} />} />
        <SettingsRow title="Marketing Emails" right={<Switch checked={s.email.marketing} onChange={() => toggle('email', 'marketing')} />} isLast />
      </SettingsSection>

      <SettingsSection title="In-App Notifications">
        <SettingsRow title="Badge on Activity Tab" right={<Switch checked={s.inApp.badge} onChange={() => toggle('inApp', 'badge')} />} />
        <SettingsRow title="Sounds" right={<Switch checked={s.inApp.sounds} onChange={() => toggle('inApp', 'sounds')} />} />
        <SettingsRow title="Vibration" right={<Switch checked={s.inApp.vibration} onChange={() => toggle('inApp', 'vibration')} />} isLast />
      </SettingsSection>

      <SettingsSection title="Quiet Hours" footer="No notifications during quiet hours (except emergencies).">
        <SettingsRow title="Enable Quiet Hours" right={<Switch checked={s.quietHours.enabled} onChange={() => toggle('quietHours', 'enabled')} />} isLast={!s.quietHours.enabled} />
        {s.quietHours.enabled && (
          <div className="p-4 pt-0 space-y-3 flex gap-4">
            <Select label="From" value={s.quietHours.start} options={[{label: '10:00 PM', value: '22:00'}]} />
            <Select label="To" value={s.quietHours.end} options={[{label: '08:00 AM', value: '08:00'}]} />
          </div>
        )}
      </SettingsSection>
    </SettingsScreenLayout>
  );
};

const PrivacySettings = ({ onBack }) => {
  const [s, setS] = useState(MOCK_SETTINGS.privacy);
  return (
    <SettingsScreenLayout title="Privacy" onBack={onBack}>
      <SettingsSection title="Activity Sharing" footer="Control who can see your activity in Friends mode.">
        <div className="p-4 space-y-4">
          <Select label="Photos" value={s.activitySharing.photos} onChange={(e) => setS({...s, activitySharing: {...s.activitySharing, photos: e.target.value}})} options={[{label: 'Private', value: 'private'}, {label: 'Friends Only', value: 'friends'}, {label: 'Public', value: 'public'}]} />
          <Select label="Check-ins" value={s.activitySharing.checkIns} onChange={(e) => setS({...s, activitySharing: {...s.activitySharing, checkIns: e.target.value}})} options={[{label: 'Private', value: 'private'}, {label: 'Friends Only', value: 'friends'}, {label: 'Public', value: 'public'}]} />
          <Select label="Milestones" value={s.activitySharing.milestones} onChange={(e) => setS({...s, activitySharing: {...s.activitySharing, milestones: e.target.value}})} options={[{label: 'Private', value: 'private'}, {label: 'Friends Only', value: 'friends'}, {label: 'Public', value: 'public'}]} />
          <Select label="Service Reviews" value={s.activitySharing.serviceReviews} onChange={(e) => setS({...s, activitySharing: {...s.activitySharing, serviceReviews: e.target.value}})} options={[{label: 'Friends Only', value: 'friends'}, {label: 'Public', value: 'public'}]} helperText="Public reviews help the community." />
        </div>
        <div className="border-t border-dashed border-[#CFCFD4] p-4 bg-[#F7F5F2] flex items-center gap-3">
          <Lock size={16} color="#A09A94" />
          <span className="text-[13px] text-[#6E6058] font-medium">Health Data is Always Private</span>
        </div>
      </SettingsSection>

      <SettingsSection title="Location Sharing">
        <div className="p-4 space-y-4">
          <Select label="Check-in Precision" value={s.locationSharing.precision} onChange={(e) => setS({...s, locationSharing: {...s.locationSharing, precision: e.target.value}})} options={[{label: 'Approximate (Neighborhood)', value: 'approximate'}, {label: 'Exact (GPS)', value: 'exact'}, {label: 'Off', value: 'off'}]} />
          <SettingsRow title="Show in Community Feed" subtitle="Let nearby pet owners discover you" right={<Switch checked={s.locationSharing.showInCommunity} onChange={() => setS({...s, locationSharing: {...s.locationSharing, showInCommunity: !s.locationSharing.showInCommunity}})}/>} isLast className="px-0 py-0" />
        </div>
      </SettingsSection>

      <SettingsSection title="Data Collection">
        <SettingsRow title="Analytics" subtitle="Help improve FYLOS" right={<Switch checked={s.dataCollection.analytics} onChange={() => setS({...s, dataCollection: {...s.dataCollection, analytics: !s.dataCollection.analytics}})}/>} />
        <SettingsRow title="Personalization" subtitle="Better recommendations" right={<Switch checked={s.dataCollection.personalization} onChange={() => setS({...s, dataCollection: {...s.dataCollection, personalization: !s.dataCollection.personalization}})}/>} isLast />
      </SettingsSection>
    </SettingsScreenLayout>
  );
};

const PaymentMethods = ({ onBack }) => {
  const [sheet, setSheet] = useState(false);
  return (
    <SettingsScreenLayout title="Payment Methods" onBack={onBack}>
      <SettingsSection title="Saved Cards">
        {MOCK_CARDS.map((card, idx) => (
          <SettingsRow 
            key={card.id}
            icon={CreditCard}
            title={`${card.type} •••• ${card.last4}`}
            subtitle={`Expires ${card.exp} ${card.isDefault ? '• Default' : ''}`}
            right={<div className="flex gap-2"><Button variant="secondary" size="small" fullWidth={false}>Edit</Button></div>}
            isLast={idx === MOCK_CARDS.length - 1}
          />
        ))}
        <div className="p-4">
          <Button variant="secondary" icon={Plus} onClick={() => setSheet(true)}>Add Payment Method</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Billing History">
        <SettingsRow title="Feb 20, 2026 · CHF 95.00" subtitle="90 min Walk with Lukas F." right={<Button variant="secondary" size="small" fullWidth={false}>Receipt</Button>} />
        <SettingsRow title="Feb 15, 2026 · CHF 120.00" subtitle="Grooming at Paws & Claws" right={<Button variant="secondary" size="small" fullWidth={false}>Receipt</Button>} />
        <div className="p-3 text-center border-t border-dashed border-[#CFCFD4]">
          <span className="text-[14px] text-[#E85D2A] font-semibold cursor-pointer">View All Transactions</span>
        </div>
      </SettingsSection>

      <BottomSheet isOpen={sheet} onClose={() => setSheet(false)} title="Add Card">
        <div className="space-y-4 mt-2">
          <TextInput label="Card Number" placeholder="0000 0000 0000 0000" />
          <div className="flex gap-4">
            <TextInput label="Expiry" placeholder="MM/YY" />
            <TextInput label="CVV" placeholder="123" />
          </div>
          <TextInput label="Cardholder Name" placeholder="Alex Mueller" />
          <Button variant="primary" onClick={() => setSheet(false)} className="mt-4">Save Card</Button>
          <p className="text-center text-[12px] text-[#A09A94] flex items-center justify-center gap-1 mt-2"><Lock size={12}/> Secured by Stripe</p>
        </div>
      </BottomSheet>
    </SettingsScreenLayout>
  );
};

const PreferencesSettings = ({ onBack }) => {
  const [s, setS] = useState(MOCK_SETTINGS.preferences);
  return (
    <SettingsScreenLayout title="Preferences" onBack={onBack}>
      <SettingsSection title="Appearance">
        <div className="p-4">
          <Select label="Theme" value={s.theme} onChange={(e) => setS({...s, theme: e.target.value})} options={[{label: 'Light', value: 'light'}, {label: 'Dark', value: 'dark'}, {label: 'Auto (System)', value: 'auto'}]} />
        </div>
      </SettingsSection>

      <SettingsSection title="Language & Region">
        <div className="p-4 space-y-4">
          <Select label="Language" value={s.language} onChange={(e) => setS({...s, language: e.target.value})} options={[{label: 'English', value: 'en'}, {label: 'Deutsch', value: 'de'}, {label: 'Français', value: 'fr'}]} />
          <Select label="Region" value="ch" options={[{label: 'Switzerland', value: 'ch'}]} />
        </div>
      </SettingsSection>

      <SettingsSection title="Units">
        <div className="p-4 space-y-4">
          <Select label="Weight" value={s.units.weight} onChange={(e) => setS({...s, units: {...s.units, weight: e.target.value}})} options={[{label: 'Kilograms (kg)', value: 'kg'}, {label: 'Pounds (lbs)', value: 'lbs'}]} />
          <Select label="Distance" value={s.units.distance} onChange={(e) => setS({...s, units: {...s.units, distance: e.target.value}})} options={[{label: 'Kilometers (km)', value: 'km'}, {label: 'Miles (mi)', value: 'mi'}]} />
          <Select label="Temperature" value={s.units.temperature} onChange={(e) => setS({...s, units: {...s.units, temperature: e.target.value}})} options={[{label: 'Celsius (°C)', value: 'celsius'}, {label: 'Fahrenheit (°F)', value: 'fahrenheit'}]} />
        </div>
      </SettingsSection>
    </SettingsScreenLayout>
  );
};

const DataManagement = ({ onBack }) => {
  const [delSheet, setDelSheet] = useState(false);
  const [delText, setDelText] = useState('');

  return (
    <SettingsScreenLayout title="Data & Storage" onBack={onBack}>
      <SettingsSection title="Export Your Data" footer="Typically ready within 48h. We'll email you a download link.">
        <div className="p-4">
          <Button variant="secondary" icon={Download}>Request Data Export</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Backup & Restore">
        <SettingsRow title="iCloud Backup" subtitle="Last backup: Today, 3:00 AM" right={<Switch checked={true} onChange={()=>{}} />} isLast />
        <div className="flex gap-3 p-4 border-t border-dashed border-[#CFCFD4]">
          <Button variant="secondary" className="flex-1">Backup Now</Button>
          <Button variant="secondary" className="flex-1">Restore</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Storage">
        <SettingsRow title="Photos & Videos" subtitle="245 MB" />
        <SettingsRow title="Documents" subtitle="18 MB" isLast />
        <div className="p-4 border-t border-dashed border-[#CFCFD4]">
          <Button variant="secondary">Manage Storage</Button>
        </div>
      </SettingsSection>

      <SettingsSection title="Danger Zone">
        <SettingsRow title="Delete All Data" subtitle="Permanently delete all pet data. Cannot be undone." destructive />
        <SettingsRow title="Delete Account" subtitle="Permanently delete your FYLOS account." destructive isLast onClick={() => setDelSheet(true)} />
      </SettingsSection>

      <BottomSheet isOpen={delSheet} onClose={() => setDelSheet(false)} title="Delete Account">
        <div className="space-y-4 mt-2">
          <div className="p-4 bg-[#FFE5E5] rounded-2xl">
            <h4 className="text-[#FF3B30] font-bold flex items-center gap-2 mb-2"><AlertTriangle size={16}/> This action cannot be undone</h4>
            <ul className="text-[13px] text-[#FF3B30] list-disc pl-4 space-y-1">
              <li>Remove all your pet data</li>
              <li>Cancel active bookings</li>
              <li>Delete all photos & documents</li>
            </ul>
          </div>
          <TextInput label="To confirm, type 'DELETE'" value={delText} onChange={(e) => setDelText(e.target.value)} />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setDelSheet(false)}>Cancel</Button>
            <Button variant="destructive" disabled={delText !== 'DELETE'} onClick={() => { alert('Account Deleted'); setDelSheet(false); onBack(); }}>Delete Account</Button>
          </div>
        </div>
      </BottomSheet>
    </SettingsScreenLayout>
  );
};

const HelpSupport = ({ onBack }) => (
  <SettingsScreenLayout title="Help & Support" onBack={onBack}>
    <SettingsSection title="Frequently Asked Questions">
      <SettingsRow title="How do I add a pet?" />
      <SettingsRow title="How do I book a walk?" />
      <SettingsRow title="How do I cancel a booking?" />
      <div className="p-3 text-center border-t border-dashed border-[#CFCFD4]"><span className="text-[14px] text-[#E85D2A] font-semibold cursor-pointer">View All FAQs</span></div>
    </SettingsSection>

    <SettingsSection title="Contact Us">
      <SettingsRow icon={Mail} title="Email Support" subtitle="support@fylos.app (Response <24h)" />
      <SettingsRow icon={Smartphone} title="Live Chat" subtitle="Mon-Fri, 9 AM - 6 PM CET" right={<Button variant="secondary" size="small" fullWidth={false}>Start Chat</Button>} />
    </SettingsSection>

    <SettingsSection title="Resources">
      <SettingsRow title="User Guide" />
      <SettingsRow title="Community Forum" isLast />
    </SettingsSection>
  </SettingsScreenLayout>
);

const AboutScreen = ({ onBack }) => (
  <SettingsScreenLayout title="About" onBack={onBack}>
    <div className="flex flex-col items-center py-8">
      <FylosLogo fontSize="40px" className="mb-4" />
      <h3 className="text-[20px] font-bold text-[#111]">FYLOS</h3>
      <p className="text-[#6E6058] mb-1">Your Pet-Care OS</p>
      <Badge>Version 1.2.0</Badge>
    </div>

    <SettingsSection title="Legal">
      <SettingsRow title="Terms of Service" />
      <SettingsRow title="Privacy Policy" />
      <SettingsRow title="Cookie Policy" isLast />
    </SettingsSection>

    <SettingsSection title="Company">
      <div className="p-5 text-center text-[#6E6058] text-[13px] leading-relaxed">
        © 2026 FYLOS GmbH<br/>
        Zürich, Switzerland<br/><br/>
        <div className="flex justify-center gap-4 text-[#E85D2A] font-semibold">
          <span>Website</span><span>Twitter</span><span>Instagram</span>
        </div>
      </div>
    </SettingsSection>
  </SettingsScreenLayout>
);

const ComingSoonScreen = ({ onBack, title, icon: Icon, blurb }) => (
  <SettingsScreenLayout title={title} onBack={onBack}>
    <div className="flex flex-col items-center justify-center pt-16 px-8 text-center">
      <div className="w-20 h-20 rounded-full bg-[#FBE7DD] flex items-center justify-center mb-5">
        <Icon size={32} color="#E85D2A" strokeWidth={1.8} />
      </div>
      <h3 className="text-[20px] font-bold text-[#111] mb-2">{title}</h3>
      <p className="text-[15px] text-[#6E6058] leading-relaxed max-w-[280px]">{blurb}</p>
    </div>
  </SettingsScreenLayout>
);

const SettingsHome = ({ onNavigate, onClose }) => {
  const [logoutSheet, setLogoutSheet] = useState(false);

  const ICON_TINT = 'bg-[#FBE7DD]';
  const ICON_COLOR = '#E85D2A';

  return (
    <div className="absolute inset-0 bg-[#F7F5F2] z-[60] flex flex-col animate-in slide-in-from-bottom-full duration-300 ease-out">
      <header className="pt-14 pb-4 px-5 bg-[#F7F5F2] flex items-center justify-between shrink-0 sticky top-0 z-10">
        <h2 className="text-[28px] font-bold text-[#111] tracking-tight">Settings</h2>
        <button onClick={onClose} className="w-[40px] h-[40px] flex items-center justify-center rounded-full active:scale-95 transition-all bg-white border border-black/[0.06] shadow-[0_2px_8px_rgba(20,14,8,0.04)]">
          <X size={20} color="#111" />
        </button>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar pb-10">
        {/* Profile Card */}
        <div className="px-5 mb-4">
          <div onClick={() => onNavigate('account')} className="bg-white rounded-[22px] px-4 py-4 flex items-center gap-3 border border-black/[0.04] shadow-[0_2px_10px_rgba(20,14,8,0.04)] cursor-pointer active:scale-[0.99] transition-all">
            <Avatar src={MOCK_USER.avatar} size={52} />
            <div className="flex-1 min-w-0">
              <h3 className="text-[17px] font-bold text-[#111] truncate leading-tight">{MOCK_USER.name}</h3>
              <p className="text-[13px] text-[#6E6058] truncate mt-0.5">{MOCK_USER.email}</p>
            </div>
            <ChevronRight size={18} className="text-[#CFCFD4] shrink-0" />
          </div>
        </div>

        <SettingsSection>
          <SettingsRow iconSize="lg" icon={Bell} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Notifications" subtitle="Push, email, in-app" onClick={() => onNavigate('notifications')} />
          <SettingsRow iconSize="lg" icon={CreditCard} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Payment & Wallet" subtitle="Cards, balance, transactions" onClick={() => onNavigate('payments')} />
          <SettingsRow iconSize="lg" icon={ShieldCheck} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Subscription" subtitle="Fylos Free" onClick={() => onNavigate('subscription')} isLast />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow iconSize="lg" icon={Globe} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Language" subtitle="English" onClick={() => onNavigate('preferences')} />
          <SettingsRow iconSize="lg" icon={HeartPulse} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Health Reminders" subtitle="Vaccinations, medications" onClick={() => onNavigate('health')} />
          <SettingsRow iconSize="lg" icon={AlertTriangle} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Emergency SOS" subtitle="Vet hotline, first aid" onClick={() => onNavigate('sos')} isLast />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow iconSize="lg" icon={HelpCircle} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Help Center" subtitle="FAQ, support, report" onClick={() => onNavigate('support')} />
          <SettingsRow iconSize="lg" icon={Rocket} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="What's Coming" subtitle="Preview upcoming features" onClick={() => onNavigate('upcoming')} />
          <SettingsRow iconSize="lg" icon={Sparkles} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Animations Lab" subtitle="Experimental motion & effects" onClick={() => onNavigate('animlab')} isLast />
        </SettingsSection>

        <SettingsSection>
          <SettingsRow iconSize="lg" icon={PawPrint} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Pets" subtitle="Manage your pets" onClick={() => onNavigate('pets')} />
          <SettingsRow iconSize="lg" icon={Shield} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Privacy" subtitle="Activity sharing, data" onClick={() => onNavigate('privacy')} />
          <SettingsRow iconSize="lg" icon={Database} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="Data & Storage" subtitle="Export, backup, delete" onClick={() => onNavigate('data')} />
          <SettingsRow iconSize="lg" icon={Info} iconBg={ICON_TINT} iconColor={ICON_COLOR} title="About FYLOS" subtitle="Version, legal, licenses" onClick={() => onNavigate('about')} isLast />
        </SettingsSection>

        <div className="px-5 mt-2 mb-6">
          <button onClick={() => setLogoutSheet(true)} className="w-full bg-white rounded-[22px] border border-black/[0.04] shadow-[0_2px_10px_rgba(20,14,8,0.04)] py-3.5 flex items-center justify-center gap-2 text-[#FF3B30] font-semibold text-[15px] active:scale-[0.99] transition-all">
            <LogOut size={18} /> Log Out
          </button>
        </div>
      </div>

      <BottomSheet isOpen={logoutSheet} onClose={() => setLogoutSheet(false)} title="Log Out?">
        <div className="space-y-4 mt-2">
          <p className="text-[15px] text-[#6E6058]">You can always log back in to your account.</p>
          <div className="flex flex-col gap-3 pt-2">
            <Button variant="destructive" onClick={() => { setLogoutSheet(false); onClose(); }}>Log Out</Button>
            <Button variant="secondary" onClick={() => setLogoutSheet(false)}>Cancel</Button>
          </div>
        </div>
      </BottomSheet>
    </div>
  );
};


// --- MAIN APP SHELL ---
export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Settings Navigation State (null = closed, 'home' = main menu, 'account' = subscreen, etc.)
  const [settingsView, setSettingsView] = useState(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => { setDisplayTab(tabId); setIsFading(false); }, 150);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex items-center justify-center font-sans antialiased">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes springBump { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#F7F5F2] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black">
        <div className="absolute top-[12px] left-1/2 -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#F7F5F2] z-50 flex flex-col items-center justify-center">
            <FylosLogo fontSize="32px" textColor="#111" className="mb-3" />
            <p className="text-[14px] text-[#A09A94] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main className={`absolute inset-0 transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              <div className="absolute inset-0 overflow-y-auto bg-[#F7F5F2] custom-scrollbar" style={{ scrollbarWidth: 'none' }}>
                <div className="min-h-full pt-[110px] pb-[120px] flex flex-col items-center justify-center px-6 text-center">
                   <div className="w-20 h-20 rounded-full bg-[#F3EFEB] flex items-center justify-center mb-6">
                     <Sliders size={32} color="#CFCFD4" strokeWidth={1.5} />
                   </div>
                   <h2 className="text-[20px] font-bold text-[#111] mb-2">Step 30: Settings</h2>
                   <p className="text-[15px] text-[#6E6058] max-w-[260px] leading-relaxed mb-8">
                     Tap the profile picture in the top right corner to open the comprehensive Settings Hub.
                   </p>
                   <Button onClick={() => setSettingsView('home')} icon={Settings} fullWidth={false}>Open Settings</Button>
                </div>
              </div>
            </main>
            
            {/* Standard Header with Avatar opening Settings */}
            <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-[#F7F5F2] via-[#F7F5F2]/90 to-transparent">
              <div className="flex justify-between items-center w-full pointer-events-auto">
                <h1 className="font-bold tracking-tight text-[#111] ml-1 flex items-center">
                  <FylosLogo fontSize="22px" textColor="#111" />
                </h1>
                <div className="flex items-center border border-[#EDE8E2] rounded-[9999px] p-1 h-[52px]" style={{ background: '#F3EFEB' }}>
                  <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F5F2] transition-all"><Search size={20} color="#111" /></button>
                  <div className="w-[1px] h-[20px] bg-[#EDE8E2]" />
                  <button className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F5F2]"><Bell size={20} color="#111" /><span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#E85D2A] rounded-full border-[1.5px] border-[#F3EFEB]" /></button>
                  <div className="w-[1px] h-[20px] bg-[#EDE8E2]" />
                  <button onClick={() => setSettingsView('home')} className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:opacity-80 transition-opacity">
                    <img src={MOCK_USER.avatar} className="w-[32px] h-[32px] rounded-full object-cover" alt="Profile" />
                  </button>
                </div>
              </div>
            </header>

            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

            {/* SETTINGS OVERLAY NAVIGATION STACK */}
            {settingsView && (
              <>
                {settingsView === 'home' && <SettingsHome onNavigate={setSettingsView} onClose={() => setSettingsView(null)} />}
                {settingsView === 'account' && <AccountSettings onBack={() => setSettingsView('home')} />}
                {settingsView === 'pets' && <PetsManagement onBack={() => setSettingsView('home')} />}
                {settingsView === 'notifications' && <NotificationSettings onBack={() => setSettingsView('home')} />}
                {settingsView === 'privacy' && <PrivacySettings onBack={() => setSettingsView('home')} />}
                {settingsView === 'payments' && <PaymentMethods onBack={() => setSettingsView('home')} />}
                {settingsView === 'preferences' && <PreferencesSettings onBack={() => setSettingsView('home')} />}
                {settingsView === 'data' && <DataManagement onBack={() => setSettingsView('home')} />}
                {settingsView === 'support' && <HelpSupport onBack={() => setSettingsView('home')} />}
                {settingsView === 'about' && <AboutScreen onBack={() => setSettingsView('home')} />}
                {settingsView === 'subscription' && <ComingSoonScreen onBack={() => setSettingsView('home')} title="Subscription" icon={ShieldCheck} blurb="You're on the Fylos Free plan. Paid tiers with unlimited cloud backup, priority support and extended health tracking are on the way." />}
                {settingsView === 'health' && <ComingSoonScreen onBack={() => setSettingsView('home')} title="Health Reminders" icon={HeartPulse} blurb="Set up vaccination schedules, medication alerts and vet check-up reminders. Coming soon — we're finalising vet partner integrations." />}
                {settingsView === 'sos' && <ComingSoonScreen onBack={() => setSettingsView('home')} title="Emergency SOS" icon={AlertTriangle} blurb="One-tap access to the nearest 24/7 vet hotline, poison control and step-by-step first-aid guides tailored to your pet." />}
                {settingsView === 'upcoming' && <ComingSoonScreen onBack={() => setSettingsView('home')} title="What's Coming" icon={Rocket} blurb="Peek at features we're building next and opt-in to early previews. Your feedback shapes the roadmap." />}
                {settingsView === 'animlab' && <ComingSoonScreen onBack={() => setSettingsView('home')} title="Animations Lab" icon={Sparkles} blurb="A playground for motion, haptics and micro-interactions. Toggle experimental effects and help us tune them." />}
              </>
            )}
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}