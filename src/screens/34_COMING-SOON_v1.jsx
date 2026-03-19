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
  Globe,
  Sparkles,
  Stethoscope,
  MapPin,
  BrainCircuit,
  Check,
  Copy,
  Share2,
  ShieldAlert,
  Rocket,
  PartyPopper
} from 'lucide-react';

/**
 * FYLOS Logo Component
 */
const FylosLogo = ({ 
  textColor = '#000000', 
  dotColor = '#FF6B35',  
  fontSize = '2rem',     
  className = ''         
}) => {
  return (
    <div 
      className={className}
      style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        gap: `calc(${fontSize} * 0.15)`,
        fontFamily: '"Nunito", sans-serif'
      }}
    >
      <span 
        style={{ 
          fontSize: fontSize, 
          fontWeight: 800, 
          color: textColor, 
          letterSpacing: '-0.5px',
          lineHeight: 1
        }}
      >
        FYLOS
      </span>
      
      <div 
        style={{ 
          width: `calc(${fontSize} * 0.25)`, 
          height: `calc(${fontSize} * 0.25)`, 
          borderRadius: '50%', 
          backgroundColor: dotColor 
        }}
      />
    </div>
  );
};

// --- MOCK DATA ---
const MOCK_USER = {
  name: 'Alex',
  email: 'alex@example.com',
  avatar: 'https://i.pravatar.cc/150?u=alex_fylos',
  notifications: 1,
};

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'settings', label: 'Settings', icon: Settings }, // Settings tab replacing Community
];

const UPCOMING_FEATURES = [
  {
    id: 'community-mode',
    title: 'Community Mode',
    tagline: 'Connect with pet owners nearby',
    icon: Globe,
    launchDate: '2026-03-15T00:00:00Z',
    description: 'Join local communities, discover breed-specific groups, and meet nearby pet owners who share your interests.',
    features: [
      'Breed communities & advice',
      'Local neighborhood groups',
      'Expert-verified content',
      'Community events & meetups'
    ],
    waitlistCount: 1247,
    color: '#00C060',
    bg: '#E5F9ED',
    isHero: true
  },
  {
    id: 'smart-matching',
    title: 'Smart Playdate Matching',
    tagline: 'Find perfect playmates automatically',
    icon: Sparkles,
    launchDate: '2026-04-10T00:00:00Z',
    description: 'AI-powered compatibility matching finds dogs that are perfect playmates based on size, energy, and play style.',
    waitlistCount: 523,
    color: '#007AFF',
    bg: '#E5F0FF'
  },
  {
    id: 'expert-content',
    title: 'Expert Health Content',
    tagline: 'Trusted advice from verified vets',
    icon: Stethoscope,
    launchDate: '2026-05-05T00:00:00Z',
    description: 'Access vet-verified articles, breed-specific health guides, and expert Q&A tailored to your pet.',
    waitlistCount: 892,
    color: '#FF9500',
    bg: '#FFF4E5'
  },
  {
    id: 'lost-pet-alerts',
    title: 'Lost Pet Alert Network',
    tagline: 'Community-powered pet recovery',
    icon: ShieldAlert,
    launchDate: '2026-06-01T00:00:00Z',
    description: 'Instant alerts to nearby pet owners when your dog goes missing. The community helps bring your pet home.',
    waitlistCount: 634,
    color: '#FF3B30',
    bg: '#FFE5E5'
  },
  {
    id: 'behavior-insights',
    title: 'Behavior Insights',
    tagline: 'Understand your dog better with AI',
    icon: BrainCircuit,
    launchDate: '2026-09-01T00:00:00Z',
    description: 'Track behaviors, identify patterns, and get personalized training recommendations powered by AI.',
    waitlistCount: 412,
    color: '#9C27B0',
    bg: '#F3E5F5'
  }
];

// --- THEME & TOKENS ---
const THEME = {
  colors: {
    accent: '#FF6B35',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    divider: '#E5E5E5',
    danger: '#FF3B30'
  }
};

// --- HELPER HOOKS & FUNCTIONS ---

const calculateDaysUntil = (dateString) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const launch = new Date(dateString);
  launch.setHours(0, 0, 0, 0);
  return Math.round((launch - today) / (1000 * 60 * 60 * 24));
};

const useLaunchingFeature = () => {
  const [feature, setFeature] = useState(null);
  const BANNER_THRESHOLD_DAYS = 14;

  useEffect(() => {
    const checkLaunchingFeature = () => {
      const upcoming = UPCOMING_FEATURES
        .map(f => ({ ...f, daysUntil: calculateDaysUntil(f.launchDate) }))
        .filter(f => f.daysUntil >= -3 && f.daysUntil <= BANNER_THRESHOLD_DAYS)
        .sort((a, b) => a.daysUntil - b.daysUntil);

      setFeature(upcoming[0] || null);
    };

    checkLaunchingFeature();
    const interval = setInterval(checkLaunchingFeature, 24 * 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return feature;
};

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
  const colors = { primary: THEME.colors.accent, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[#E5E5E5] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F7F7F8] text-[#6E6E73]",
    success: "bg-[#E5F9ED] text-[#00C060]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    accent: "bg-[#FF6B35]/10 text-[#FF6B35]"
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-bold rounded-full px-2.5 py-1 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Avatar = ({ src, initials, size = 48, badge, badgeColor = THEME.colors.danger }) => {
  const fontSize = size * 0.4;
  return (
    <div className="relative inline-flex flex-shrink-0" style={{ width: size, height: size }}>
      {src ? (
        <img src={src} className="w-full h-full rounded-full object-cover border border-black/[0.04]" alt="Avatar" />
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
    secondary: "bg-[#F7F7F8] text-[#111111] hover:bg-[#E5E5E5]",
    outline: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    success: "bg-[#E5F9ED] text-[#00C060] border border-[#00C060]/20"
  };
  const sizes = {
    small: "px-3 py-2 text-[14px] rounded-xl",
    medium: "px-4 py-[14px] text-[16px]",
    large: "px-6 py-4 text-[18px] rounded-[20px]"
  };
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  return (
    <button disabled={disabled || isLoading} className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabled || isLoading ? 'opacity-50 cursor-not-allowed' : ''} ${className}`} {...props}>
      {isLoading ? <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} /> : <>{Icon && <Icon size={size === 'small' ? 16 : 20} />}{children}</>}
    </button>
  );
};

const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "rounded-[20px] p-5 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
    grey: "bg-[#F7F7F8]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98]" : "";
  return <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} {...props}>{children}</div>;
};

const ListRow = ({ icon: Icon, title, subtitle, rightAccessory, onClick, className = '' }) => (
  <div onClick={onClick} className={`flex items-center gap-4 py-3 ${onClick ? 'cursor-pointer active:scale-[0.98] transition-transform' : ''} ${className}`}>
    {Icon && (
      <div className="w-10 h-10 rounded-full bg-[#F7F7F8] flex items-center justify-center shrink-0">
        <Icon size={20} color={THEME.colors.accent} />
      </div>
    )}
    <div className="flex-1 flex flex-col justify-center min-w-0">
      <span className="text-[16px] font-semibold text-[#111111] truncate">{title}</span>
      {subtitle && <span className="text-[13px] text-[#6E6E73] truncate">{subtitle}</span>}
    </div>
    {rightAccessory && <div className="shrink-0 ml-2 text-[#CFCFD4]">{rightAccessory}</div>}
  </div>
);

const EmptyState = ({ icon: Icon, illustration, title, description, actionLabel, onAction }) => (
  <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
    {illustration ? (
      <div className="mb-6">{illustration}</div>
    ) : (
      <div className="w-20 h-20 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-6">
        <Icon size={32} color="#CFCFD4" strokeWidth={1.5} />
      </div>
    )}
    <h2 className="text-[20px] font-semibold text-[#111111] mb-2">{title}</h2>
    <p className="text-[15px] text-[#6E6E73] max-w-[260px] leading-relaxed mb-8">
      {description}
    </p>
    {actionLabel && onAction && (
      <Button variant="primary" onClick={onAction} fullWidth={false} className="min-w-[160px]">
        {actionLabel}
      </Button>
    )}
  </div>
);

const Header = ({ title, variant = 'default', user }) => {
  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="#111111" /> : title}
          </h1>

          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[52px]">
            <button className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-[0.98] transition-all">
              <Bell size={20} color="#111111" strokeWidth={2} />
              {user?.notifications > 0 && (
                <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#FF6B35] rounded-full border-[1.5px] border-white" />
              )}
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-[0.98] transition-all">
              <img src={user?.avatar} className="w-[32px] h-[32px] rounded-full object-cover border border-black/[0.04]" alt="Profile" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none" role="tablist">
      <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => onTabChange(tab.id)}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group"
            >
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
};

const ScreenContainer = ({ children }) => {
  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#FFFFFF] custom-scrollbar">
      <div className="min-h-full pt-[110px] pb-[120px]">
        {children}
      </div>
    </div>
  );
};

const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [isOpen]);
};

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);

  useEffect(() => { setPortalNode(document.getElementById('modal-root')); }, []);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      const raf = requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
      return () => cancelAnimationFrame(raf);
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); };
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
      <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} style={{ touchAction: 'none' }} />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        <div className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1 relative">
          {title && (
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
              <button onClick={onClose} className="p-2 -mr-2 text-[#8E8E93] hover:text-[#111111] transition-colors rounded-full active:bg-black/5"><X size={20} /></button>
            </div>
          )}
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};

// --- PREVIEW COMPONENTS (STEP 34) ---

const LaunchBanner = ({ feature, onDismiss, onJoinWaitlist }) => {
  const isLaunched = feature.daysUntil < 0;
  
  return (
    <div className="mb-6 relative overflow-hidden rounded-[24px] bg-[#111111] text-white shadow-[0_8px_30px_rgba(0,0,0,0.15)] animate-in fade-in slide-in-from-top-4">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 right-0 w-48 h-48 opacity-20 blur-[30px] rounded-full -mr-10 -mt-10" style={{ backgroundColor: feature.color }} />
      
      <div className="p-5">
        <div className="flex items-center justify-between mb-3 relative z-10">
          <Badge variant={isLaunched ? 'success' : 'warning'} className="!bg-white/10 !text-white backdrop-blur-md border border-white/10">
            {isLaunched ? (
              <span className="flex items-center gap-1"><PartyPopper size={12}/> NEW FEATURE!</span>
            ) : (
              <span className="flex items-center gap-1"><Rocket size={12}/> LAUNCHING SOON</span>
            )}
          </Badge>
          <button onClick={onDismiss} className="w-8 h-8 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <X size={16} className="text-white" />
          </button>
        </div>

        <div className="flex gap-4 items-start relative z-10">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 border border-white/10" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }}>
            <feature.icon size={28} color={feature.color} />
          </div>
          <div className="flex-1">
            <h3 className="text-[20px] font-bold text-white mb-1 leading-tight">{feature.title}</h3>
            <p className="text-[14px] text-white/70 mb-2">
              {isLaunched 
                ? 'Just launched! Try it now.' 
                : `Launches ${new Date(feature.launchDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' })} (${feature.daysUntil} days)`}
            </p>
            <p className="text-[14px] text-white/90 font-medium mb-4">{feature.tagline}</p>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3 mt-2 relative z-10">
          {!isLaunched && (
            <span className="text-[13px] text-white/60 font-medium">
              {feature.waitlistCount.toLocaleString()} on waitlist
            </span>
          )}
          
          <div className="flex-1 flex justify-end gap-2">
            {isLaunched ? (
              <Button variant="primary" size="small" fullWidth={false} className="!w-auto !px-5">
                Explore Now
              </Button>
            ) : (
              <Button variant="primary" size="small" fullWidth={false} className="!w-auto !bg-white !text-[#111111] hover:!bg-[#F0F0F2]" onClick={() => onJoinWaitlist(feature)}>
                Join Waitlist
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const FeaturePreviewCard = ({ feature, onJoinWaitlist, hasJoined, size = 'medium' }) => {
  const Icon = feature.icon;
  const isLarge = size === 'large' || feature.isHero;
  const daysUntil = calculateDaysUntil(feature.launchDate);
  const isHighlighted = daysUntil <= 14;

  return (
    <div className={`w-full bg-[#FFFFFF] border ${isHighlighted ? `border-[${feature.color}] shadow-[0_8px_30px_rgba(0,0,0,0.08)]` : 'border-black/[0.06] shadow-sm'} rounded-[24px] overflow-hidden group`}>
      {isLarge && (
        <div className="h-[160px] w-full relative flex items-center justify-center overflow-hidden" style={{ backgroundColor: feature.bg }}>
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent"></div>
          <div className="relative z-10 w-20 h-20 bg-white rounded-full shadow-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <Icon size={32} color={feature.color} strokeWidth={1.5} />
          </div>
        </div>
      )}

      <div className="p-5">
        {!isLarge && (
          <div className="w-12 h-12 rounded-[14px] flex items-center justify-center mb-4" style={{ backgroundColor: feature.bg }}>
            <Icon size={24} color={feature.color} />
          </div>
        )}

        <div className="flex items-center justify-between mb-2">
          <Badge variant="default" className="!bg-[#F7F7F8] !text-[#6E6E73]">{feature.status}</Badge>
          {isHighlighted && <Badge variant="accent" className="!text-[10px]">SOON</Badge>}
        </div>

        <h3 className="text-[20px] font-bold text-[#111111] mb-1">{feature.title}</h3>
        <p className="text-[14px] text-[#6E6E73] leading-relaxed mb-4">{feature.description}</p>

        {isLarge && feature.features && (
          <div className="space-y-2.5 mb-6">
            {feature.features.map((item, idx) => (
              <div key={idx} className="flex items-center gap-2">
                <Check size={14} className="text-[#00C060]" />
                <span className="text-[14px] text-[#111111]">{item}</span>
              </div>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between mt-auto">
          <div className="text-[13px] font-semibold text-[#8E8E93]">
            +{feature.waitlistCount} interested
          </div>
          
          {hasJoined ? (
            <Button variant="success" size="small" icon={Check} fullWidth={false} className="!w-auto !px-4 !bg-[#E5F9ED]/50">Joined</Button>
          ) : (
            <Button variant="outline" size="small" fullWidth={false} className="!w-auto !px-4" onClick={() => onJoinWaitlist(feature)}>
              Notify Me
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

const WaitlistForm = ({ feature, onSubmit, isSubmitting }) => {
  return (
    <div className="space-y-6 pt-2 animate-in fade-in slide-in-from-bottom-4 duration-300">
      <div className="flex items-center gap-4 p-4 bg-[#F7F7F8] rounded-[16px]">
        <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 bg-white shadow-sm">
          <feature.icon size={24} color={feature.color} />
        </div>
        <div>
          <h4 className="font-bold text-[#111111]">{feature.title}</h4>
          <p className="text-[13px] text-[#6E6E73]">{feature.status}</p>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        <label className="flex items-center justify-between cursor-pointer w-full group">
          <div className="flex flex-col pr-4">
            <span className="text-[15px] font-semibold text-[#111111]">Notify me on launch</span>
            <span className="text-[13px] text-[#6E6E73] mt-0.5">Get an email the moment it's live.</span>
          </div>
          <div className="relative">
            <div className="block w-12 h-7 rounded-full transition-colors duration-300 ease-in-out bg-[#FF6B35]"></div>
            <div className="absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform duration-300 ease-in-out shadow-sm transform translate-x-5"></div>
          </div>
        </label>
      </div>

      <div className="pt-4 pb-2">
        <Button variant="primary" size="large" isLoading={isSubmitting} onClick={onSubmit}>
          Join Waitlist Now
        </Button>
      </div>
    </div>
  );
};

const WaitlistSuccess = ({ feature, onDone }) => {
  const position = feature.waitlistCount + 1;
  const referralCode = `FYLOS-${feature.id.substring(0,4).toUpperCase()}-26`;

  return (
    <div className="flex flex-col items-center text-center pt-6 pb-2 space-y-6 animate-in fade-in zoom-in-95 duration-400">
      <div className="w-20 h-20 bg-[#E5F9ED] rounded-full flex items-center justify-center mb-2 animate-spring-bump">
        <CheckCircle2 size={40} color="#00C060" strokeWidth={2.5} />
      </div>
      <div>
        <h3 className="text-[24px] font-bold text-[#111111] mb-2">You're on the list!</h3>
        <p className="text-[15px] text-[#6E6E73] px-4">We'll email you when <strong className="text-[#111111]">{feature.title}</strong> is ready.</p>
      </div>
      <div className="bg-[#F7F7F8] border border-black/[0.04] rounded-[20px] p-5 w-full">
        <p className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider mb-1">Your Position</p>
        <p className="text-[32px] font-bold text-[#111111] mb-4">#{position.toLocaleString()}</p>
        <Divider spacing="small" className="!my-4" />
        <div className="flex items-center gap-2 mb-3">
          <Sparkles size={16} className="text-[#FF9500]" />
          <p className="text-[14px] font-bold text-[#111111]">Move up faster!</p>
        </div>
        <p className="text-[13px] text-[#6E6E73] text-left mb-4">Share your link. Every friend who joins moves you up 10 spots.</p>
        <div className="flex gap-2">
          <div className="flex-1 h-11 bg-[#FFFFFF] border border-black/[0.08] rounded-xl flex items-center px-3 text-[13px] font-mono text-[#111111] truncate">
            fylos.app/r/{referralCode}
          </div>
          <button className="w-11 h-11 bg-[#111111] text-white rounded-xl flex items-center justify-center active:scale-95 transition-transform shrink-0"><Copy size={18} /></button>
        </div>
      </div>
      <Button variant="secondary" onClick={onDone}>Done</Button>
    </div>
  );
};

// --- SCREENS ---

const HomeScreen = ({ onJoinWaitlist }) => {
  const launchingFeature = useLaunchingFeature();
  const [bannerDismissed, setBannerDismissed] = useState(false);
  
  const shouldShowBanner = launchingFeature && !bannerDismissed;

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 pt-2">
        {/* SMART HOME BANNER */}
        {shouldShowBanner && (
          <LaunchBanner 
            feature={launchingFeature} 
            onDismiss={() => setBannerDismissed(true)} 
            onJoinWaitlist={onJoinWaitlist}
          />
        )}

        <div className="mb-6">
          <h2 className="text-[24px] font-bold text-[#111111] mb-1">Home</h2>
          <p className="text-[15px] text-[#6E6E73]">Step 34: Smart Launch Banner Active</p>
        </div>
        
        <Card className="mb-4">
          <div className="flex items-center gap-3">
            <Avatar initials="L" size={40} />
            <div>
              <p className="text-[16px] font-bold text-[#111111]">Luna · Golden Retriever</p>
              <p className="text-[13px] text-[#6E6E73]">Active & Healthy</p>
            </div>
          </div>
        </Card>

        <Text variant="label" className="mb-3 mt-8">Quick Actions</Text>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-[#F7F7F8] p-4 rounded-[16px] flex flex-col items-center justify-center gap-2 active:bg-[#E5E5E5] transition-colors cursor-pointer">
            <Calendar size={24} color={THEME.colors.accent} />
            <span className="text-[14px] font-semibold text-[#111111]">Book Walk</span>
          </div>
          <div className="bg-[#F7F7F8] p-4 rounded-[16px] flex flex-col items-center justify-center gap-2 active:bg-[#E5E5E5] transition-colors cursor-pointer">
            <Activity size={24} color={THEME.colors.info} />
            <span className="text-[14px] font-semibold text-[#111111]">Log Activity</span>
          </div>
        </div>
      </div>
    </ScreenContainer>
  );
};

// --- WHATS COMING SCREEN (Inside Settings) ---
const WhatsComingScreen = ({ onBack, joinedWaitlists, onJoinWaitlist }) => {
  // Filter features that haven't launched yet (> 0 days)
  const upcomingFeatures = UPCOMING_FEATURES.filter(f => calculateDaysUntil(f.launchDate) > 0);

  // Group by month
  const groupedByMonth = upcomingFeatures.reduce((acc, feature) => {
    const d = new Date(feature.launchDate);
    const key = d.toLocaleString('en-US', { month: 'long', year: 'numeric' }).toUpperCase();
    if (!acc[key]) acc[key] = [];
    acc[key].push(feature);
    return acc;
  }, {});

  return (
    <div className="absolute inset-0 bg-[#F0F0F2] z-50 animate-in slide-in-from-right-full duration-300">
      <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-4 px-5 bg-white/95 backdrop-blur-md border-b border-black/[0.04]">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="w-10 h-10 flex items-center justify-center bg-[#F7F7F8] rounded-full active:scale-95 transition-transform">
            <ChevronLeft size={24} color="#111111" />
          </button>
          <h2 className="text-[17px] font-bold text-[#111111]">What's Coming</h2>
        </div>
      </header>

      <div className="h-full overflow-y-auto custom-scrollbar pt-[110px] pb-[120px] px-5">
        <div className="mb-8">
          <h1 className="text-[28px] font-bold text-[#111111] mb-2">New features launching soon</h1>
          <p className="text-[15px] text-[#6E6E73]">{upcomingFeatures.length} major updates on the roadmap.</p>
        </div>

        {Object.entries(groupedByMonth).map(([month, features], index) => (
          <div key={month} className="mb-10 animate-in fade-in slide-in-from-bottom-4" style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}>
            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-[13px] font-bold text-[#8E8E93] uppercase tracking-wider">{month}</h3>
              <div className="h-[1px] flex-1 bg-black/[0.06]"></div>
            </div>
            
            <div className="space-y-4">
              {features.map(feature => (
                <FeaturePreviewCard 
                  key={feature.id} 
                  feature={feature}
                  size={calculateDaysUntil(feature.launchDate) <= 30 ? 'large' : 'medium'}
                  onJoinWaitlist={onJoinWaitlist}
                  hasJoined={joinedWaitlists.includes(feature.id)}
                />
              ))}
            </div>
          </div>
        ))}
        
        <div className="text-center pt-4 pb-8">
          <p className="text-[14px] text-[#8E8E93] mb-2">More features in development</p>
          <button className="text-[15px] font-bold text-[#FF6B35]">View Product Roadmap →</button>
        </div>
      </div>
    </div>
  );
};

const SettingsScreen = ({ onOpenWhatsComing }) => (
  <ScreenContainer>
    <div className="px-5 pt-2 pb-8">
      <Text variant="title" className="mb-6">Settings</Text>
      
      <Text variant="label" className="mb-2">Product & Roadmap</Text>
      <div className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-sm overflow-hidden mb-8">
        <ListRow 
          icon={Sparkles} 
          title="What's Coming" 
          subtitle="Preview new features & waitlists" 
          rightAccessory={<ChevronRight size={20}/>} 
          onClick={onOpenWhatsComing}
          className="px-5 hover:bg-[#F7F7F8]"
        />
        <Divider spacing="small" className="!my-0 ml-16" />
        <ListRow 
          icon={Info} 
          title="App Version" 
          subtitle="v2.1.0 Beta" 
          rightAccessory={<span className="text-[14px] text-[#8E8E93]">Up to date</span>}
          className="px-5"
        />
      </div>

      <Text variant="label" className="mb-2">Account</Text>
      <div className="bg-[#FFFFFF] rounded-[20px] border border-black/[0.04] shadow-sm overflow-hidden">
        <ListRow icon={Users} title="Profile & Family" rightAccessory={<ChevronRight size={20}/>} className="px-5" />
        <Divider spacing="small" className="!my-0 ml-16" />
        <ListRow icon={Bell} title="Notifications" rightAccessory={<ChevronRight size={20}/>} className="px-5" />
      </div>
    </div>
  </ScreenContainer>
);

const PlaceholderScreen = ({ icon: Icon, title }) => (
  <ScreenContainer>
    <EmptyState icon={Icon} title={title} description="This tab is functionally complete in previous steps." />
  </ScreenContainer>
);

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Navigation state for Settings -> What's Coming
  const [showWhatsComing, setShowWhatsComing] = useState(false);

  // Waitlist State
  const [joinedWaitlists, setJoinedWaitlists] = useState([]);
  const [waitlistSheetOpen, setWaitlistSheetOpen] = useState(false);
  const [activeWaitlistFeature, setActiveWaitlistFeature] = useState(null);
  const [waitlistStep, setWaitlistStep] = useState('form');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Reset drill-down navigation if tab changes
  useEffect(() => {
    if (activeTab !== 'settings') {
      setShowWhatsComing(false);
    }
  }, [activeTab]);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return;
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => {
      setDisplayTab(tabId);
      setIsFading(false);
    }, 150);
  };

  const handleOpenWaitlist = (feature) => {
    setActiveWaitlistFeature(feature);
    setWaitlistStep('form');
    setWaitlistSheetOpen(true);
  };

  const handleSubmitWaitlist = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      setJoinedWaitlists(prev => [...prev, activeWaitlistFeature.id]);
      setIsSubmitting(false);
      setWaitlistStep('success');
    }, 1000);
  };

  const closeWaitlist = () => {
    setWaitlistSheetOpen(false);
    setTimeout(() => {
      setActiveWaitlistFeature(null);
      setWaitlistStep('form');
    }, 300);
  };

  const renderScreen = () => {
    switch (displayTab) {
      case 'home': return <HomeScreen onJoinWaitlist={handleOpenWaitlist} />;
      case 'pets': return <PlaceholderScreen icon={PawPrint} title="Pets" />;
      case 'services': return <PlaceholderScreen icon={Calendar} title="Services" />;
      case 'activity': return <PlaceholderScreen icon={Activity} title="Activity" />;
      case 'settings': return <SettingsScreen onOpenWhatsComing={() => setShowWhatsComing(true)} />;
      default: return <HomeScreen onJoinWaitlist={handleOpenWaitlist} />;
    }
  };

  const getHeaderTitle = () => {
    if (activeTab === 'home') return 'FYLOS';
    const tab = TABS.find(t => t.id === activeTab);
    return tab ? tab.label : 'FYLOS';
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
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center animate-out fade-out duration-500 fill-mode-forwards delay-700">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          <>
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {renderScreen()}
            </main>
            
            <Header title={getHeaderTitle()} variant="default" user={MOCK_USER} />
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />

            {/* Drill-down Screen for Settings -> What's Coming */}
            {showWhatsComing && (
              <WhatsComingScreen 
                onBack={() => setShowWhatsComing(false)} 
                joinedWaitlists={joinedWaitlists}
                onJoinWaitlist={handleOpenWaitlist}
              />
            )}
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>

      <BottomSheet isOpen={waitlistSheetOpen} onClose={closeWaitlist} title={waitlistStep === 'form' ? 'Join Waitlist' : null}>
        {activeWaitlistFeature && (
          waitlistStep === 'form' ? (
            <WaitlistForm feature={activeWaitlistFeature} onSubmit={handleSubmitWaitlist} isSubmitting={isSubmitting} />
          ) : (
            <WaitlistSuccess feature={activeWaitlistFeature} onDone={closeWaitlist} />
          )
        )}
      </BottomSheet>

    </div>
  );
}