import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, 
  PawPrint, 
  Calendar, 
  Activity, 
  Folder, 
  Search, 
  Bell, 
  ChevronLeft, 
  ChevronRight,
  MoreHorizontal, 
  X,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  Loader2,
  ChevronDown,
  Settings,
  Star,
  Users,
  HeartPulse,
  Megaphone,
  Archive,
  Check,
  Clock,
  ArrowRight
} from 'lucide-react';

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ textColor = '#000000', dotColor = '#FF6B35', fontSize = '2rem', className = '' }) => (
  <div className={className} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: `calc(${fontSize} * 0.15)`, fontFamily: '"Nunito", sans-serif' }}>
    <span style={{ fontSize: fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>FYLOS</span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// --- THEME & TOKENS ---
const THEME = {
  colors: {
    accent: '#FF6B35',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#FFFFFF',
    surface: '#F7F7F8',
    surfaceAlt: '#F0F0F2',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  }
};

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

// --- MOCK INBOX DATA ---
const INITIAL_NOTIFICATIONS = [
  {
    id: 'inbox_001',
    category: 'social',
    type: 'friend-request',
    priority: 'normal',
    sender: { name: "Max's owner", petName: 'Max', photo: 'https://i.pravatar.cc/150?u=max_dog' },
    title: 'Friend Request',
    body: 'Max wants to be friends with Luna!',
    actions: [
      { id: 'accept', label: 'Accept', type: 'primary' },
      { id: 'decline', label: 'Decline', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'TODAY',
    timeAgo: '2 hours ago'
  },
  {
    id: 'inbox_002',
    category: 'bookings',
    type: 'booking-reminder',
    priority: 'high',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk Tomorrow',
    body: 'Walk with Lukas F. tomorrow at 2:00 PM',
    actions: [
      { id: 'view', label: 'View Booking', type: 'primary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'TODAY',
    timeAgo: '1 hour ago'
  },
  {
    id: 'inbox_003',
    category: 'health',
    type: 'medication-reminder',
    priority: 'critical',
    sender: { name: 'FYLOS Health', icon: HeartPulse },
    title: 'Medication Reminder',
    body: "Time for Luna's Apoquel (16mg)",
    actions: [
      { id: 'given', label: 'Mark Given', type: 'primary' },
      { id: 'snooze', label: 'Snooze 30m', type: 'secondary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'TODAY',
    timeAgo: '30 mins ago'
  },
  {
    id: 'inbox_006',
    category: 'health',
    type: 'vaccination-overdue',
    priority: 'critical',
    sender: { name: 'FYLOS Health', icon: AlertTriangle },
    title: 'Vaccination Overdue',
    body: 'Rabies vaccination expired 5 days ago.',
    actions: [
      { id: 'schedule', label: 'Schedule Vet', type: 'primary' }
    ],
    read: false,
    archived: false,
    timeGroup: 'TODAY',
    timeAgo: 'Just now'
  },
  {
    id: 'inbox_004',
    category: 'bookings',
    type: 'booking-completed',
    priority: 'normal',
    sender: { name: 'Lukas F.', photo: 'https://i.pravatar.cc/150?u=lukas_walker' },
    title: 'Walk Completed',
    body: '90 min with Lukas F. at Zurichhorn Park',
    actions: [],
    read: true,
    archived: false,
    timeGroup: 'YESTERDAY',
    timeAgo: 'Yesterday'
  },
  {
    id: 'inbox_005',
    category: 'system',
    type: 'new-feature',
    priority: 'low',
    sender: { name: 'FYLOS Team', icon: Megaphone },
    title: 'New Feature',
    body: 'Activity Insights now available! Check out your new dashboard.',
    actions: [
      { id: 'check', label: 'Check it out', type: 'secondary' }
    ],
    read: true,
    archived: false,
    timeGroup: 'YESTERDAY',
    timeAgo: 'Yesterday'
  }
];

const INBOX_CATEGORIES = [
  { id: 'all', label: 'All', icon: null },
  { id: 'social', label: 'Social', icon: Users },
  { id: 'bookings', label: 'Bookings', icon: Calendar },
  { id: 'health', label: 'Health', icon: HeartPulse },
  { id: 'system', label: 'Updates', icon: Megaphone }
];

// --- DESIGN SYSTEM COMPONENTS ---

const Text = ({ variant = 'body', className = '', children, ...props }) => {
  const variants = {
    title: "text-[24px] font-bold text-[#111111] tracking-tight",
    subtitle: "text-[17px] font-semibold text-[#111111]",
    body: "text-[15px] text-[#111111] leading-relaxed",
    caption: "text-[13px] text-[#6E6E73]",
    label: "text-[12px] font-semibold text-[#8E8E93] uppercase tracking-wider"
  };
  return <div className={`${variants[variant]} ${className}`} {...props}>{children}</div>;
};

const Spinner = ({ size = 'medium', color = 'primary', className = '' }) => {
  const sizes = { small: 16, medium: 24, large: 32 };
  const colors = { primary: THEME.colors.accent, grey: THEME.colors.tertiaryText, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-black/[0.04] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F7F7F8] text-[#6E6E73]",
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

const Avatar = ({ src, initials, icon: Icon, size = 48, badge, badgeColor = THEME.colors.danger }) => {
  const fontSize = size * 0.4;
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
      ) : Icon ? (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#FF6B35]">
          <Icon size={size * 0.5} />
        </div>
      ) : (
        <div className="w-full h-full rounded-full bg-[#F7F7F8] border border-black/[0.04] flex items-center justify-center text-[#111111] font-semibold" style={{ fontSize }}>
          {initials}
        </div>
      )}
      {badge && (
        <div 
          className="absolute -top-1 -right-1 min-w-[18px] h-[18px] rounded-full border-2 border-white flex items-center justify-center px-1 text-[10px] font-bold text-white z-10"
          style={{ backgroundColor: badgeColor }}
        >
          {badge}
        </div>
      )}
    </div>
  );
};

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]"
  };
  const sizes = { small: "px-3 py-2 text-[13px] rounded-xl", medium: "px-4 py-[14px] text-[16px]", large: "px-6 py-4 text-[18px] rounded-[20px]" };
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button disabled={isDisabled} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`} {...props}>
      {isLoading ? <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={size === 'small' ? 14 : 20} />}{children}</>}
    </button>
  );
};

const SearchInput = ({ value, onChange, onClear, placeholder = 'Search...', className = '' }) => (
   <div className={`relative flex items-center w-full ${className}`}>
     <div className="absolute left-4 text-[#8E8E93] pointer-events-none">
       <Search size={18} strokeWidth={2.5} />
     </div>
     <input 
       type="text" value={value} onChange={onChange} placeholder={placeholder}
       className="w-full h-[48px] pl-11 pr-11 bg-[#F7F7F8] text-[#111111] rounded-[16px] text-[16px] placeholder:text-[#8E8E93] focus:outline-none focus:bg-[#FFFFFF] focus:border focus:border-[#FF6B35] focus:ring-4 focus:ring-[#FF6B35]/10 transition-all duration-200 border border-transparent"
     />
     {value && (
       <button onClick={onClear} className="absolute right-4 text-[#8E8E93] hover:text-[#111111] transition-colors p-1 rounded-full active:bg-black/5">
         <X size={16} strokeWidth={2.5} />
       </button>
     )}
   </div>
);

const SegmentedControl = ({ segments, activeIndex, onChange, className = '' }) => (
  <div className={`flex bg-[#F7F7F8] p-1 rounded-[14px] relative ${className}`}>
    <div 
      className="absolute top-1 bottom-1 bg-[#FFFFFF] rounded-[10px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] transition-all duration-300 ease-out"
      style={{ width: `calc(${100 / segments.length}% - 4px)`, left: `calc(${(100 / segments.length) * activeIndex}% + 2px)` }}
    />
    {segments.map((seg, i) => (
      <button key={seg} onClick={() => onChange(i)} className={`relative z-10 flex-1 py-1.5 text-[13px] font-semibold transition-colors duration-200 ${activeIndex === i ? 'text-[#111111]' : 'text-[#8E8E93]'}`}>
        {seg}
      </button>
    ))}
  </div>
);

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
    {illustration ? <div className="mb-6">{illustration}</div> : (
      <div className="w-20 h-20 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-6">
        <Icon size={32} color="#CFCFD4" strokeWidth={1.5} />
      </div>
    )}
    <h2 className="text-[20px] font-semibold text-[#111111] mb-2">{title}</h2>
    <p className="text-[15px] text-[#6E6E73] max-w-[260px] leading-relaxed mb-8">{description}</p>
    {actionLabel && onAction && <Button variant="primary" onClick={onAction} fullWidth={false} className="min-w-[160px]">{actionLabel}</Button>}
  </div>
);

/**
 * App Shell Header
 */
const Header = ({ title, variant = 'default', unreadCount, onOpenInbox }) => {
  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="#111111" /> : title}
          </h1>

          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[52px]">
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all duration-[120ms]">
              <Search size={20} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button 
              onClick={onOpenInbox}
              className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all duration-[120ms]"
            >
              <Bell size={20} color="#111111" strokeWidth={2} />
              {unreadCount > 0 && (
                <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#FF6B35] rounded-full border-[1.5px] border-white" />
              )}
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all duration-[120ms]">
              <img src="https://i.pravatar.cc/150?u=alex_fylos" className="w-[32px] h-[32px] rounded-full object-cover border border-black/[0.04]" alt="Profile" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none">
    <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group">
            <div className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} />
            <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35] animate-spring-bump' : 'text-[#8E8E93]'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] font-medium leading-none transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35]' : 'text-[#8E8E93]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

const ScreenContainer = ({ children }) => (
  <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] custom-scrollbar">
    <div className="min-h-full pt-[110px] pb-[120px]">
      {children}
    </div>
  </div>
);

// --- SHARED INBOX/ALERT COMPONENTS ---

const AlertBanner = ({ type = 'warning', icon: Icon, title, body, actionLabel, onAction }) => {
  const styles = {
    critical: "bg-[#FFF0F0] border-[#FFE5E5]",
    warning: "bg-[#FFF4E5] border-[#FFE5B4]",
    info: "bg-[#E5F0FF] border-[#CCE0FF]"
  };
  
  const iconColors = {
    critical: "#FF3B30",
    warning: "#FF9500",
    info: "#007AFF"
  };

  return (
    <div className={`flex flex-col gap-2 p-4 rounded-[16px] border ${styles[type]} mb-4`}>
      <div className="flex items-start gap-3">
        <div className="mt-0.5">
          <Icon size={20} color={iconColors[type]} />
        </div>
        <div className="flex-1">
          <h4 className="text-[15px] font-bold text-[#111111] mb-0.5">{title}</h4>
          <p className="text-[14px] text-[#6E6E73] leading-snug">{body}</p>
        </div>
      </div>
      {actionLabel && (
        <button 
          onClick={onAction}
          className="mt-2 self-start flex items-center gap-1.5 text-[14px] font-bold text-[#111111] bg-white/60 px-3 py-1.5 rounded-lg border border-black/[0.04] active:scale-[0.98] transition-all"
        >
          {actionLabel} <ArrowRight size={14} />
        </button>
      )}
    </div>
  );
};

const NotificationCard = ({ notification, onAction, onMarkRead }) => {
  const { id, read, sender, title, body, timeAgo, actions } = notification;

  return (
    <div 
      className={`relative p-4 mb-2 rounded-[20px] transition-all duration-200 ${read ? 'bg-transparent' : 'bg-[#F7F7F8] border border-black/[0.04]'}`}
      onClick={() => onMarkRead && !read && onMarkRead(id)}
    >
      {!read && <div className="absolute top-[28px] left-[6px] w-[8px] h-[8px] rounded-full bg-[#FF6B35]" />}
      
      <div className="flex gap-3 pl-3">
        <Avatar src={sender.photo} icon={sender.icon} initials={sender.name.charAt(0)} size={44} />
        <div className="flex-1 min-w-0 flex flex-col gap-1 pt-0.5">
          <div className="flex justify-between items-start gap-2">
            <span className={`text-[15px] truncate ${read ? 'font-medium text-[#111111]' : 'font-bold text-[#111111]'}`}>
              {title}
            </span>
            <span className="text-[12px] text-[#8E8E93] shrink-0 pt-0.5">{timeAgo}</span>
          </div>
          <p className={`text-[14px] leading-snug ${read ? 'text-[#6E6E73]' : 'text-[#111111]'}`}>
            {body}
          </p>
          
          {actions && actions.length > 0 && onAction && (
            <div className="flex gap-2 mt-3 mb-1">
              {actions.map((act) => (
                <Button 
                  key={act.id} 
                  variant={act.type} 
                  size="small" 
                  fullWidth={false}
                  onClick={(e) => { e.stopPropagation(); onAction(id, act.id); }}
                  className="flex-1 max-w-[140px]"
                >
                  {act.label}
                </Button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};


// --- MODULE-SPECIFIC ALERT WIDGETS ---

const InboxSummaryWidget = ({ notifications, onOpenInbox }) => {
  const unreadCount = notifications.filter(n => !n.read).length;
  if (unreadCount === 0) return null;
  
  const topNotifications = notifications.filter(n => !n.read).slice(0, 3);

  return (
    <div className="bg-[#FFFFFF] border border-black/[0.06] shadow-[0_4px_20px_rgba(0,0,0,0.04)] rounded-[24px] p-5 mb-6">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Bell size={20} color="#FF6B35" />
          <h3 className="text-[17px] font-bold text-[#111111]">Inbox Summary</h3>
        </div>
        <Badge variant="count">{unreadCount}</Badge>
      </div>

      <div className="space-y-4 mb-4">
        {topNotifications.map(notif => (
          <div key={notif.id} className="flex gap-3 items-start cursor-pointer active:opacity-70" onClick={onOpenInbox}>
            <div className="w-2 h-2 rounded-full bg-[#FF6B35] mt-1.5 shrink-0" />
            <div className="flex-1">
              <p className="text-[14px] font-semibold text-[#111111]">{notif.title}</p>
              <p className="text-[13px] text-[#6E6E73] truncate">{notif.body}</p>
            </div>
            <span className="text-[12px] text-[#8E8E93]">{notif.timeAgo}</span>
          </div>
        ))}
      </div>

      <button onClick={onOpenInbox} className="w-full flex items-center justify-center gap-2 text-[14px] font-bold text-[#111111] bg-[#F7F7F8] py-3 rounded-xl hover:bg-[#F0F0F2] transition-colors">
        View All ({unreadCount}) <ArrowRight size={16} />
      </button>
    </div>
  );
};

const HealthAlertsBanner = ({ notifications, onOpenInbox }) => {
  const alerts = notifications.filter(n => n.category === 'health' && (n.priority === 'critical' || n.priority === 'high') && !n.read);
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <Text variant="label" className="mb-2 ml-1">Health Alerts</Text>
      {alerts.map(alert => (
        <AlertBanner 
          key={alert.id}
          type={alert.priority === 'critical' ? 'critical' : 'warning'}
          icon={alert.priority === 'critical' ? AlertTriangle : AlertCircle}
          title={alert.title}
          body={alert.body}
          actionLabel="View in Inbox"
          onAction={onOpenInbox}
        />
      ))}
    </div>
  );
};

const BookingAlertsSection = ({ notifications, onOpenInbox }) => {
  const alerts = notifications.filter(n => n.category === 'bookings' && !n.read);
  if (alerts.length === 0) return null;

  return (
    <div className="mb-6">
      <Text variant="label" className="mb-2 ml-1">Booking Updates</Text>
      {alerts.map(alert => (
        <AlertBanner 
          key={alert.id}
          type={alert.priority === 'high' ? 'warning' : 'info'}
          icon={alert.priority === 'high' ? Clock : Info}
          title={alert.title}
          body={alert.body}
          actionLabel="View Details"
          onAction={onOpenInbox}
        />
      ))}
    </div>
  );
};

const FriendRequestsBanner = ({ notifications, onOpenInbox }) => {
  const requests = notifications.filter(n => n.category === 'social' && !n.read);
  if (requests.length === 0) return null;

  return (
    <div className="mb-6 bg-[#FFFFFF] border border-black/[0.06] shadow-[0_4px_16px_rgba(0,0,0,0.04)] rounded-[20px] p-4">
      <div className="flex items-center gap-2 mb-3">
        <Users size={18} color="#FF6B35" />
        <h3 className="text-[16px] font-bold text-[#111111]">
          {requests.length} Social {requests.length === 1 ? 'Notification' : 'Notifications'}
        </h3>
      </div>
      <div className="flex -space-x-3 mb-4 pl-2">
        {requests.map((req, i) => (
          <img key={req.id} src={req.sender.photo} alt="Avatar" className="w-10 h-10 rounded-full border-2 border-white object-cover" style={{ zIndex: 10 - i }} />
        ))}
      </div>
      <Button variant="secondary" size="small" onClick={onOpenInbox} icon={ArrowRight}>Review Requests</Button>
    </div>
  );
};


// --- MAIN INBOX MODAL ---

const InboxScreen = ({ isOpen, onClose, notifications, setNotifications }) => {
  const [activeView, setActiveView] = useState(0); // 0: All, 1: Unread, 2: Actionable
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Animation state for sliding in
  const [isVisible, setIsVisible] = useState(false);
  const [render, setRender] = useState(isOpen);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      requestAnimationFrame(() => setTimeout(() => setIsVisible(true), 10));
    } else {
      setIsVisible(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  if (!render) return null;

  // Filter Logic
  let filtered = notifications.filter(n => !n.archived);
  
  if (activeView === 1) filtered = filtered.filter(n => !n.read);
  if (activeView === 2) filtered = filtered.filter(n => n.actions && n.actions.length > 0 && !n.read);
  if (activeCategory !== 'all') filtered = filtered.filter(n => n.category === activeCategory);
  if (searchQuery) filtered = filtered.filter(n => n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.body.toLowerCase().includes(searchQuery.toLowerCase()));

  // Group Logic
  const grouped = filtered.reduce((acc, notif) => {
    const group = notif.timeGroup;
    if (!acc[group]) acc[group] = [];
    acc[group].push(notif);
    return acc;
  }, {});

  const handleAction = (id, actionId) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleMarkRead = (id) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleArchiveAll = () => {
    setNotifications(prev => prev.map(n => ({ ...n, archived: true })));
  };

  return createPortal(
    <div className="absolute inset-0 z-50 overflow-hidden pointer-events-auto">
      <div 
        className="absolute inset-0 bg-[#FFFFFF] flex flex-col"
        style={{ 
          transform: `translateX(${isVisible ? '0%' : '100%'})`,
          transition: 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)'
        }}
      >
        <header className="pt-14 pb-4 px-5 bg-white border-b border-black/[0.04] shrink-0 z-10">
          <div className="flex justify-between items-center w-full mb-4">
            <button onClick={onClose} className="w-[44px] h-[44px] flex items-center justify-center bg-[#F7F7F8] rounded-full active:scale-[0.98] transition-all">
              <ChevronLeft size={22} color="#111111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Inbox</h2>
            <button onClick={handleArchiveAll} className="w-[44px] h-[44px] flex items-center justify-center bg-[#F7F7F8] rounded-full active:scale-[0.98] transition-all">
              <Archive size={20} color="#111111" />
            </button>
          </div>

          <SegmentedControl 
            segments={['All', 'Unread', 'Actionable']} 
            activeIndex={activeView} 
            onChange={setActiveView} 
            className="mb-4"
          />

          <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-1 -mx-5 px-5">
            {INBOX_CATEGORIES.map(cat => {
              const Icon = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`flex items-center gap-1.5 px-4 py-2 rounded-full whitespace-nowrap text-[14px] font-semibold transition-colors shrink-0 ${
                    isActive ? 'bg-[#111111] text-white' : 'bg-[#F7F7F8] text-[#6E6E73] hover:bg-[#F0F0F2]'
                  }`}
                >
                  {Icon && <Icon size={16} strokeWidth={isActive ? 2.5 : 2} />}
                  {cat.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar px-5 pt-4 pb-12">
          {filtered.length === 0 ? (
            <div className="h-full flex items-center justify-center -mt-10">
              <EmptyState 
                icon={Check} 
                title={activeView === 2 ? "Nothing to do!" : "All caught up!"} 
                description={activeView === 2 ? "You have no pending action items." : "You have no new notifications right now."} 
              />
            </div>
          ) : (
            Object.entries(grouped).map(([group, items]) => (
              <div key={group} className="mb-6">
                <Text variant="label" className="mb-3 ml-2">{group}</Text>
                {items.map(notif => (
                  <NotificationCard 
                    key={notif.id} 
                    notification={notif} 
                    onAction={handleAction}
                    onMarkRead={handleMarkRead}
                  />
                ))}
              </div>
            ))
          )}
        </div>
      </div>
    </div>,
    document.getElementById('modal-root') || document.body
  );
};


// --- SCREENS ---

const HomeScreen = ({ notifications, onOpenInbox }) => (
  <ScreenContainer>
    <div className="px-5 pb-8 pt-4 space-y-6">
      <div>
        <h2 className="text-[28px] font-bold text-[#111111] mb-2">Welcome back, Alex!</h2>
        <p className="text-[16px] text-[#6E6E73]">Here's what's happening today.</p>
      </div>
      
      <InboxSummaryWidget notifications={notifications} onOpenInbox={onOpenInbox} />
      
      <EmptyState icon={PawPrint} title="Dashboard" description="Your pet's daily summary will appear here." />
    </div>
  </ScreenContainer>
);

const PetsScreen = ({ notifications, onOpenInbox }) => (
  <ScreenContainer>
    <div className="px-5 pb-8 pt-4 space-y-6">
      <h2 className="text-[24px] font-bold text-[#111111]">Pets Overview</h2>
      <HealthAlertsBanner notifications={notifications} onOpenInbox={onOpenInbox} />
      <EmptyState icon={PawPrint} title="My Pets" description="Manage your pet profiles here." />
    </div>
  </ScreenContainer>
);

const ServicesScreen = ({ notifications, onOpenInbox }) => (
  <ScreenContainer>
    <div className="px-5 pb-8 pt-4 space-y-6">
      <h2 className="text-[24px] font-bold text-[#111111]">Services</h2>
      <BookingAlertsSection notifications={notifications} onOpenInbox={onOpenInbox} />
      <EmptyState icon={Calendar} title="Bookings" description="Manage your upcoming services." />
    </div>
  </ScreenContainer>
);

const ActivityScreen = ({ notifications, onOpenInbox }) => (
  <ScreenContainer>
    <div className="px-5 pb-8 pt-4 space-y-6">
      <h2 className="text-[24px] font-bold text-[#111111]">Activity & Social</h2>
      <FriendRequestsBanner notifications={notifications} onOpenInbox={onOpenInbox} />
      <EmptyState icon={Activity} title="Feed" description="See what your friends are up to." />
    </div>
  </ScreenContainer>
);

const VaultScreen = ({ notifications, onOpenInbox }) => (
  <ScreenContainer>
    <div className="px-5 pb-8 pt-4 space-y-6">
      <h2 className="text-[24px] font-bold text-[#111111]">Vault</h2>
      <HealthAlertsBanner notifications={notifications} onOpenInbox={onOpenInbox} /> {/* Health alerts belong here too based on spec */}
      <EmptyState icon={Folder} title="Documents" description="Store your pet's important files securely." />
    </div>
  </ScreenContainer>
);

// --- APP SHELL ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Central Inbox State
  const [isInboxOpen, setIsInboxOpen] = useState(false);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  const unreadCount = notifications.filter(n => !n.read && !n.archived).length;

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
      case 'pets': return <PetsScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
      case 'services': return <ServicesScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
      case 'activity': return <ActivityScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
      case 'vault': return <VaultScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
      default: return <HomeScreen notifications={notifications} onOpenInbox={() => setIsInboxOpen(true)} />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    return TABS.find(t => t.id === activeTab)?.label || 'FYLOS';
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes springBump {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {renderScreen()}
            </main>
            <Header 
              title={getHeaderTitle()} 
              variant="default" 
              unreadCount={unreadCount}
              onOpenInbox={() => setIsInboxOpen(true)}
            />
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </>
        )}
        
        {/* Render Inbox Overlay */}
        <InboxScreen 
          isOpen={isInboxOpen} 
          onClose={() => setIsInboxOpen(false)} 
          notifications={notifications}
          setNotifications={setNotifications}
        />

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}