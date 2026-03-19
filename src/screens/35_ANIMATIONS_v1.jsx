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
  Heart,
  Trash2,
  Archive
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
  avatar: 'https://i.pravatar.cc/150?u=alex_fylos',
  notifications: 1,
};

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

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

// --- UTILS ---
const triggerHaptic = (type = 'light') => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    if (type === 'light') window.navigator.vibrate(10);
    if (type === 'medium') window.navigator.vibrate(30);
    if (type === 'heavy') window.navigator.vibrate(50);
    if (type === 'success') window.navigator.vibrate([20, 50, 20]);
    if (type === 'error') window.navigator.vibrate([40, 60, 40]);
  }
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
  const colors = { primary: THEME.colors.accent, grey: THEME.colors.tertiaryText, white: '#FFFFFF' };
  return <Loader2 className={`animate-spin ${className}`} size={sizes[size] || sizes.medium} color={colors[color] || color} />;
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[${THEME.colors.divider}] ${spacings[spacing]} ${className}`} />;
};

const IconWrapper = ({ icon: Icon, color = THEME.colors.primaryText, size = 24, strokeWidth = 2, className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Icon color={color} size={size} strokeWidth={strokeWidth} />
  </div>
);

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

// --- ANIMATED MICRO-INTERACTION COMPONENTS (STEP 35) ---

const Button = ({ children, variant = 'primary', size = 'medium', fullWidth = true, icon: Icon, isLoading, disabled, onPress, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-2xl font-semibold transition-all duration-200 active:scale-[0.95] overflow-hidden gap-2";
  
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A] active:shadow-[0_2px_8px_rgba(255,107,53,0.20)]",
    secondary: "bg-transparent text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-[#F7F7F8]",
    destructive: "bg-[#FFF0F0] text-[#FF3B30] hover:bg-[#FFE5E5]"
  };
  
  const sizes = {
    small: "px-3 py-2 text-[14px] rounded-xl",
    medium: "px-4 py-[14px] text-[16px]",
    large: "px-6 py-4 text-[18px] rounded-[20px]"
  };
  
  const isDisabled = disabled || isLoading;
  const disabledStyles = isDisabled ? "opacity-50 cursor-not-allowed active:scale-100 shadow-none hover:bg-auto" : "";
  const widthClass = fullWidth ? "w-full" : "w-auto inline-flex";

  const handlePress = (e) => {
    if (!isDisabled) {
      triggerHaptic('light');
      if (onPress) onPress(e);
      if (props.onClick) props.onClick(e);
    }
  };

  return (
    <button 
      disabled={isDisabled}
      onClick={handlePress}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${widthClass} ${disabledStyles} ${className}`}
      {...props}
    >
      {isLoading ? (
        <div className="absolute inset-0 flex items-center justify-center animate-in fade-in duration-200">
          <Spinner size="small" color={variant === 'primary' ? 'white' : 'primary'} />
        </div>
      ) : null}
      
      <div className={`flex items-center gap-2 transition-opacity duration-200 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
        {Icon && <Icon size={size === 'small' ? 16 : 20} />}
        {children}
      </div>
    </button>
  );
};

const LikeButton = () => {
  const [liked, setLiked] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handlePress = () => {
    triggerHaptic(liked ? 'light' : 'medium');
    setLiked(!liked);
    setAnimating(true);
    setTimeout(() => setAnimating(false), 300);
  };

  return (
    <button
      onClick={handlePress}
      className="w-[44px] h-[44px] bg-[#FFFFFF] border border-black/[0.06] shadow-[0_4px_12px_rgba(0,0,0,0.05)] rounded-full flex items-center justify-center active:scale-90 transition-transform duration-200"
    >
      <div className={`transition-all duration-300 ${animating ? 'scale-125 -rotate-12' : 'scale-100 rotate-0'}`}>
        <Heart
          size={22}
          fill={liked ? '#FF3B30' : 'transparent'}
          color={liked ? '#FF3B30' : '#111111'}
          className="transition-colors duration-200"
        />
      </div>
    </button>
  );
};

const SuccessCheckmark = () => (
  <div className="animate-[checkPop_0.6s_cubic-bezier(0.34,1.56,0.64,1)_forwards]">
    <div className="w-[48px] h-[48px] bg-[#00C060] rounded-full flex items-center justify-center text-white shadow-[0_8px_16px_rgba(0,192,96,0.25)]">
      <CheckCircle2 size={28} strokeWidth={3} />
    </div>
  </div>
);

const ErrorShake = ({ trigger, children }) => {
  const [isShaking, setIsShaking] = useState(false);
  
  useEffect(() => {
    if (trigger) {
      triggerHaptic('error');
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 400);
    }
  }, [trigger]);

  return <div className={isShaking ? 'animate-[shake_0.4s_ease-in-out]' : ''}>{children}</div>;
};

const StaggeredList = ({ items }) => {
  return (
    <div className="space-y-3">
      {items.map((item, index) => (
        <div
          key={item.id}
          className="animate-[slideUpFade_0.5s_ease-out_forwards] opacity-0"
          style={{ animationDelay: `${index * 80}ms` }}
        >
          <Card clickable className="py-4 px-5">
            <div className="flex justify-between items-center">
              <span className="font-semibold text-[#111111]">{item.title}</span>
              <ChevronRight size={18} color="#CFCFD4" />
            </div>
          </Card>
        </div>
      ))}
    </div>
  );
};

// Tappable Card
const Card = ({ variant = 'default', clickable, children, className = '', ...props }) => {
  const baseStyles = "rounded-[20px] p-5 transition-all duration-200";
  const variants = {
    default: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)]",
    highlighted: "bg-[#FFFFFF] border border-black/[0.04] shadow-[0_4px_20px_rgba(0,0,0,0.03)] border-l-[4px] border-l-[#FF6B35]",
    grey: "bg-[#F7F7F8]"
  };
  const interactive = clickable ? "cursor-pointer hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] active:scale-[0.98] active:shadow-[0_4px_10px_rgba(0,0,0,0.03)]" : "";
  
  return (
    <div className={`${baseStyles} ${variants[variant]} ${interactive} ${className}`} onClick={() => clickable && triggerHaptic('light')} {...props}>
      {children}
    </div>
  );
};

const Skeleton = ({ className = '', rounded = 'rounded-[16px]', ...props }) => (
  <div className={`relative overflow-hidden bg-black/[0.04] ${rounded} ${className}`} {...props}>
    <div className="absolute inset-0 -translate-x-full animate-[shimmerSlide_1.5s_infinite_linear] bg-gradient-to-r from-transparent via-white/40 to-transparent" />
  </div>
);

// --- END MICRO-INTERACTIONS ---

const TextInput = ({ label, error, helperText, disabled, className = '', ...props }) => (
  <div className={`flex flex-col gap-1.5 w-full ${className} ${disabled ? 'opacity-50' : ''}`}>
    {label && <label className="text-[13px] font-medium text-[#6E6E73] ml-1">{label}</label>}
    <input 
      disabled={disabled}
      className={`w-full h-[52px] px-4 bg-[#FFFFFF] border text-[16px] text-[#111111] rounded-2xl transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#FF6B35]/10 ${
        error 
          ? 'border-[#FF3B30] focus:border-[#FF3B30]' 
          : 'border-black/[0.08] focus:border-[#FF6B35]'
      } placeholder:text-[#8E8E93]`}
      {...props}
    />
    {error ? (
      <span className="text-[12px] text-[#FF3B30] ml-1 flex items-center gap-1"><AlertCircle size={12}/>{error}</span>
    ) : helperText ? (
      <span className="text-[12px] text-[#8E8E93] ml-1">{helperText}</span>
    ) : null}
  </div>
);

const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);
};

const BottomSheet = ({ isOpen, onClose, title, children }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);

  useEffect(() => {
    setPortalNode(document.getElementById('modal-root'));
  }, []);

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      setRender(true);
      window.addEventListener('keydown', handleEsc);
      const raf = requestAnimationFrame(() => {
        setTimeout(() => setVisible(true), 10);
      });
      return () => {
        cancelAnimationFrame(raf);
        window.removeEventListener('keydown', handleEsc);
      };
    } else {
      setVisible(false);
      const timer = setTimeout(() => setRender(false), 300);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);

  const handleTouchStart = (e) => { 
    touchStartY.current = e.touches[0].clientY; 
    setTranslateY(0);
  };
  
  const handleTouchMove = (e) => {
    const delta = e.touches[0].clientY - touchStartY.current;
    if (delta > 0) {
      setTranslateY(delta);
    }
  };
  
  const handleTouchEnd = () => {
    if (translateY > 80) onClose();
    else setTranslateY(0);
  };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div 
        className={`absolute inset-0 bg-black/40 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
        aria-hidden="true"
        style={{ touchAction: 'none' }}
      />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ 
          transform: `translateY(${!visible ? '100%' : `${translateY}px`})`,
          transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)',
          paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)'
        }}
      >
        <div 
          className="w-full flex justify-center pt-4 pb-5 cursor-grab active:cursor-grabbing touch-none shrink-0"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div className="w-12 h-1.5 bg-black/[0.08] rounded-full" />
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1">
          {title && <h3 className="text-[20px] font-bold text-[#111111] mb-4">{title}</h3>}
          {children}
        </div>
      </div>
    </div>,
    portalNode
  );
};

const Header = ({ title, variant = 'default', user }) => {
  const handleAction = (action) => console.log(`${action} triggered`);

  return (
    <header className="absolute top-0 left-0 w-full z-40 pt-14 pb-6 px-5 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent">
      {variant === 'default' && (
        <div className="flex justify-between items-center w-full pointer-events-auto">
          <h1 className="font-bold tracking-tight text-[#111111] drop-shadow-sm ml-1 flex items-center">
            {title === 'FYLOS' || !title ? <FylosLogo fontSize="22px" textColor="#111111" /> : title}
          </h1>

          <div className="flex items-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] p-1 h-[52px]">
            <button 
              onClick={() => handleAction('Search')}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-90 transition-all duration-[120ms]"
              aria-label="Search"
            >
              <Search size={20} color="#111111" strokeWidth={2} />
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button 
              onClick={() => handleAction('Inbox')}
              className="relative w-[44px] h-[44px] flex items-center justify-center rounded-full hover:bg-[#F7F7F8] active:scale-90 transition-all duration-[120ms]"
              aria-label="Notifications"
            >
              <Bell size={20} color="#111111" strokeWidth={2} />
              {user?.notifications > 0 && (
                <span className="absolute top-[12px] right-[12px] w-[8px] h-[8px] bg-[#FF6B35] rounded-full border-[1.5px] border-white" aria-hidden="true" />
              )}
            </button>
            <div className="w-[1px] h-[20px] bg-black/[0.06]" />
            <button 
              onClick={() => handleAction('Profile')}
              className="w-[44px] h-[44px] flex items-center justify-center rounded-full active:scale-90 transition-all duration-[120ms]"
              aria-label="Profile"
            >
              <img src={user?.avatar} className="w-[32px] h-[32px] rounded-full object-cover border border-black/[0.04]" alt="Profile avatar" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <nav 
      className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none"
      role="tablist" 
    >
      <div className="pointer-events-auto bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.08)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              role="tab"
              aria-selected={isActive}
              onClick={() => {
                triggerHaptic('selection');
                onTabChange(tab.id);
              }}
              className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group"
            >
              <div 
                className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} 
              />
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

// --- SCREENS ---

const InteractionsScreen = () => {
  const [shake, setShake] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [listKey, setListKey] = useState(0);

  const triggerError = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  const triggerSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 2000);
  };

  const handleFakeLoad = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      triggerSuccess();
    }, 1500);
  };

  return (
    <ScreenContainer>
      <div className="px-5 pb-8 space-y-10">
        <div className="pt-2">
          <h2 className="text-[24px] font-bold text-[#111111] mb-1">Micro-interactions</h2>
          <p className="text-[15px] text-[#6E6E73]">Step 35: Animation & Polish Catalog</p>
        </div>

        <section className="space-y-4">
          <Text variant="label">Feedback Buttons</Text>
          <div className="flex gap-4 items-center">
            <LikeButton />
            <Button variant="secondary" onClick={triggerError} fullWidth={false} className="flex-1">Trigger Error</Button>
          </div>
          <div className="flex gap-4 items-center min-h-[52px]">
            <Button variant="primary" onClick={handleFakeLoad} isLoading={isLoading} fullWidth={false} className="flex-1">Complete Action</Button>
            <div className="w-[48px] flex justify-center">
               {showSuccess && <SuccessCheckmark />}
            </div>
          </div>
          
          <ErrorShake trigger={shake}>
            <TextInput placeholder="Try triggering an error..." error={shake ? "Animation triggered!" : ""} disabled={shake} />
          </ErrorShake>
        </section>

        <section className="space-y-4">
          <div className="flex justify-between items-center">
            <Text variant="label">Staggered List</Text>
            <button onClick={() => setListKey(k => k + 1)} className="text-[#FF6B35] text-[13px] font-bold active:scale-95 transition-transform">REPLAY</button>
          </div>
          <StaggeredList key={listKey} items={[
            {id: 1, title: 'Morning Walk'},
            {id: 2, title: 'Vet Appointment'},
            {id: 3, title: 'Lunch Time'},
            {id: 4, title: 'Play Date'}
          ]} />
        </section>

        <section className="space-y-4">
          <Text variant="label">Loading States (Shimmer)</Text>
          <div className="flex gap-4 items-center p-4 border border-black/[0.04] rounded-[20px] bg-[#FFFFFF]">
            <Skeleton className="w-12 h-12 rounded-full shrink-0" />
            <div className="flex-1 space-y-3">
              <Skeleton className="h-3 w-3/4 rounded-full" />
              <Skeleton className="h-3 w-1/2 rounded-full" />
            </div>
          </div>
        </section>
      </div>
    </ScreenContainer>
  );
};

const PlaceholderScreen = ({ title }) => (
  <ScreenContainer>
    <div className="flex flex-col items-center justify-center w-full h-full min-h-[50vh] px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-[#F7F7F8] flex items-center justify-center mb-6">
        <Activity size={32} color="#CFCFD4" strokeWidth={1.5} />
      </div>
      <h2 className="text-[20px] font-semibold text-[#111111] mb-2">{title}</h2>
      <p className="text-[15px] text-[#6E6E73] max-w-[260px] leading-relaxed">
        Navigate to Home to see the Step 35 interactions catalog.
      </p>
    </div>
  </ScreenContainer>
);

// --- APP SHELL (MAIN ENTRY POINT) ---

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [displayTab, setDisplayTab] = useState('home');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 800);
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
      case 'home': return <InteractionsScreen />;
      default: return <PlaceholderScreen title={TABS.find(t => t.id === displayTab)?.label || 'Screen'} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F0F2] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      
      {/* Step 35 Global CSS Animations */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }

        @keyframes springBump {
          0% { transform: scale(1); }
          40% { transform: scale(1.06); }
          100% { transform: scale(1); }
        }
        .animate-spring-bump {
          animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }

        @keyframes checkPop {
          0% { transform: scale(0.5) rotate(-45deg); opacity: 0; }
          70% { transform: scale(1.15) rotate(10deg); opacity: 1; }
          100% { transform: scale(1) rotate(0deg); opacity: 1; }
        }

        @keyframes slideUpFade {
          0% { transform: translateY(20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }

        @keyframes shimmerSlide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FFFFFF] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FFFFFF] z-50 flex flex-col items-center justify-center">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3 animate-[springBump_1s_infinite]" />
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Warming up engines...</p>
          </div>
        ) : (
          <>
            <main 
              className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}
            >
              {renderScreen()}
            </main>
            
            <Header 
              title={activeTab === 'home' ? 'FYLOS' : TABS.find(t => t.id === activeTab)?.label} 
              variant="default"
              user={MOCK_USER} 
            />
            
            <TabBar 
              activeTab={activeTab} 
              onTabChange={handleTabChange} 
            />
          </>
        )}

        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}