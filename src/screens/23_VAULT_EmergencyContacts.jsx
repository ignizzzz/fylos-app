import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, PawPrint, Calendar, Activity, Folder, Search, Bell, ChevronLeft, ChevronRight,
  MoreHorizontal, X, CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2,
  ChevronDown, Settings, Star, Share2, FileDown, Stethoscope, FileText, Phone,
  MapPin, Pill, ShieldAlert, Syringe, Fingerprint, QrCode, Copy, Cloud, Lock,
  DownloadCloud, Link as LinkIcon, ArrowLeft, MessageCircle, Mail, Map as MapIcon,
  Globe, Printer, Plus
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

const MOCK_VAULT_DATA = {
  pet: {
    id: 'pet_001',
    name: 'Luna',
    breed: 'Golden Retriever',
    photo: 'url',
    age: 3,
    weight: 28,
    microchipId: '981020000394857'
  },
  emergencyBundle: {
    lastUpdated: 'Feb 22, 2026',
    shareLink: 'fylos.app/e/luna-abc123',
    expiresIn: '7 days'
  },
  criticalInfo: {
    medications: [
      { id: 'med_001', name: 'Apoquel', dosage: '16mg daily', active: true },
      { id: 'med_002', name: 'NexGard', dosage: 'Monthly', active: true }
    ],
    allergies: [
      { id: 'all_001', allergen: 'Bee Stings', severity: 'SEVERE' },
      { id: 'all_002', allergen: 'Chicken', severity: 'MODERATE' },
      { id: 'all_003', allergen: 'Dust Mites', severity: 'MILD' }
    ],
    vaccinations: [
      { id: 'vac_001', name: 'Rabies', statusText: 'Valid until Dec 2026', isWarning: false },
      { id: 'vac_002', name: 'DHPP', statusText: 'Expires in 8 days', isWarning: true }
    ]
  },
  emergencyContacts: [
    { id: 'c_001', name: 'Alex (Owner)', type: 'PRIMARY', phone: '+41 79 123 4567' },
    { id: 'c_002', name: 'Zurich Animal Hospital', type: 'PRIMARY VET', phone: '+41 44 123 4567' },
    { id: 'c_003', name: 'Tierspital Zurich (24/7)', type: 'EMERGENCY VET', phone: '+41 44 987 6543' }
  ],
  recentDocuments: [
    { id: 'd_001', title: 'Rabies Vaccination', type: 'PDF', size: 1258291, date: 'May 2023', icon: FileText },
    { id: 'd_002', title: 'Blood Test Results', type: 'PDF', size: 870400, date: 'Jan 2026', icon: FileText }
  ]
};

const mockVaultEmergencyContacts = {
  pet: { id: 'pet_001', name: 'Luna', breed: 'Golden Retriever' },
  emergencySigns: [
    'Difficulty breathing',
    'Seizures',
    'Severe bleeding',
    'Bee sting (SEVERE allergy)',
    'Unconsciousness',
    'Choking'
  ],
  emergencyContacts: [
    {
      id: 'contact_001', name: 'Alex', relationship: 'Owner', phone: '+41 79 123 4567', email: 'alex@example.com',
      address: { street: 'Bellevuestrasse 12', city: 'Zürich', postalCode: '8008', country: 'Switzerland' },
      priority: 'PRIMARY', notes: 'Always available, key holder'
    },
    {
      id: 'contact_002', name: 'Maria Schmidt', relationship: 'Partner', phone: '+41 79 987 6543', email: 'maria@example.com',
      address: null, priority: 'SECONDARY', notes: 'Works from home'
    }
  ],
  veterinaryContacts: [
    {
      id: 'vet_001', type: 'primary', name: 'Zurich Animal Hospital', vetName: 'Dr. Sarah Schmidt', phone: '+41 44 123 4567',
      email: 'info@zurichvet.ch', website: 'https://www.zurichvet.ch',
      address: { street: 'Bahnhofstrasse 10', city: 'Zürich', postalCode: '8001', country: 'Switzerland', full: 'Bahnhofstrasse 10, 8001 Zürich, Switzerland' },
      hoursFormatted: 'Mon-Fri: 8:00-18:00\nSat: 9:00-14:00', available24_7: false, notes: "Luna's primary vet since 2021"
    },
    {
      id: 'vet_002', type: 'emergency', name: 'Tierspital Zurich', vetName: null, phone: '+41 44 987 6543',
      email: 'emergency@tierspital.ch', website: 'https://www.tierspital.ch',
      address: { street: 'Winterthurerstrasse 260', city: 'Zürich', postalCode: '8057', country: 'Switzerland', full: 'Winterthurerstrasse 260, 8057 Zürich, Switzerland' },
      hoursFormatted: '⏰ Open 24/7', available24_7: true, notes: 'Emergency vet, always open'
    },
    {
      id: 'vet_003', type: 'specialist', name: 'OrthoPet Specialists', vetName: 'Dr. Thomas Weber', phone: '+41 44 555 1234',
      email: 'info@orthopet.ch', website: 'https://www.orthopet.ch',
      address: { street: 'Seestrasse 45', city: 'Zürich', postalCode: '8002', country: 'Switzerland', full: 'Seestrasse 45, 8002 Zürich, Switzerland' },
      hoursFormatted: 'By appointment only', available24_7: false, notes: 'Orthopedic specialist'
    }
  ],
  emergencyProtocols: [
    {
      id: 'protocol_001', type: 'bee-sting', icon: '⚠️', title: 'Bee Sting (SEVERE allergy)', severity: 'critical',
      summary: ['Call emergency vet', 'Administer EpiPen if trained', 'Monitor breathing'],
      fullSteps: [
        { step: 1, title: 'Call emergency vet', description: 'Contact emergency vet immediately', phone: '+41 44 987 6543' },
        { step: 2, title: 'Remove stinger', description: "Scrape stinger out, don't squeeze" },
        { step: 3, title: 'Administer EpiPen', description: 'Only if trained. Inject into thigh muscle.' },
        { step: 4, title: 'Monitor breathing', description: 'Watch for swelling, check gum color' },
        { step: 5, title: 'Transport to vet', description: 'Keep Luna calm, bring EpiPen packaging' }
      ],
      warningSigns: ['Difficulty breathing', 'Excessive swelling', 'Pale gums', 'Collapse']
    },
    {
      id: 'protocol_002', type: 'bleeding', icon: '🩹', title: 'Bleeding', severity: 'moderate',
      summary: ['Apply pressure', 'Call vet if severe'],
      fullSteps: [
        { step: 1, title: 'Apply pressure', description: 'Use clean cloth, apply firm pressure for 5-10 minutes' },
        { step: 2, title: 'Assess severity', description: 'Minor: Clean and bandage. Severe: Call vet immediately' },
        { step: 3, title: 'Call vet if needed', description: 'If bleeding does not stop after 10 minutes' }
      ],
      warningSigns: ['Continuous bleeding >10 min', 'Spurting blood', 'Deep wound', 'Pale gums']
    }
  ]
};

// Pure function to filter dashboard data
const deriveVaultPreviewData = (data) => ({
  ...data,
  criticalInfo: {
    medications: data.criticalInfo.medications.filter(m => m.active),
    allergies: data.criticalInfo.allergies.filter(a => ['SEVERE', 'MODERATE'].includes(a.severity)),
    vaccinations: data.criticalInfo.vaccinations.filter(v => v.isWarning).slice(0, 2)
  }
});

// --- UTILITIES ---
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// --- DESIGN SYSTEM COMPONENTS ---
const THEME = {
  colors: {
    background: '#F6F6F6',
    surface: '#FFFFFF',
    primary: '#FF6B35',
    textMain: '#111111',
    textMuted: '#7A7A7A', // Muted to exact spec
  }
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-0', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-[#ECECEC] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-black/5 text-[#111111]",
    success: "bg-[#ECFDF3] text-[#027A48]",
    warning: "bg-[#FFFAEB] text-[#B54708]", 
    error: "bg-[#FEF3F2] text-[#B42318]",   
    info: "bg-[#EFF4FF] text-[#175CD3]",
    primary: "bg-[#111111] text-white",
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold rounded-sm px-2 py-0.5 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', fullWidth = true, icon: Icon, isLoading, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-[12px] font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2 px-4 h-[48px] text-[15px]";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-sm hover:bg-[#E85D2A]", 
    secondary: "bg-[#FFFFFF] text-[#111111] border border-[#ECECEC] hover:bg-black/[0.02]",
    danger: "bg-[#E6352B] text-white shadow-sm hover:bg-[#D42B22]", // Muted Red
  };
  return (
    <button disabled={isLoading} className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : "w-auto"} ${isLoading ? "opacity-70" : ""} ${className}`} {...props}>
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <> {Icon && <Icon size={18} />} {children} </>}
    </button>
  );
};

// Refined Card component based on strict design rules
const Card = ({ children, className = '', clickable, ...props }) => {
  const interactive = clickable ? "cursor-pointer active:bg-black/[0.01]" : "";
  return (
    <div className={`bg-[#FFFFFF] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] transition-colors duration-200 ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const SectionHeader = ({ title, actionIcon: ActionIcon, onAction }) => (
  <div className="flex items-center justify-between mb-4">
    <h3 className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em]">{title}</h3>
    {ActionIcon && (
      <button onClick={onAction} className="w-8 h-8 flex items-center justify-end text-[#7A7A7A] active:opacity-70 transition-opacity">
        <ActionIcon size={18} />
      </button>
    )}
  </div>
);

const Toast = ({ message, isVisible }) => (
  <div className={`fixed bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 z-[120] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
    <CheckCircle2 size={18} className="text-[#00C060]" />
    <span className="text-[14px] font-medium whitespace-nowrap">{message}</span>
  </div>
);

// --- BOTTOM SHEET ---
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

  // iOS-style Background Suppression (Dim + Scale)
  useEffect(() => {
    const mainEl = document.getElementById('main-app-wrapper');
    if (isOpen && mainEl) {
      mainEl.style.transform = 'scale(0.94) translateY(12px)';
      mainEl.style.borderRadius = '32px';
      mainEl.style.overflow = 'hidden';
      mainEl.style.filter = 'brightness(0.85)';
      mainEl.style.transition = 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1), border-radius 300ms, filter 300ms';
    } else if (mainEl) {
      mainEl.style.transform = 'none';
      mainEl.style.borderRadius = '0px';
      mainEl.style.filter = 'brightness(1)';
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      setRender(true);
      requestAnimationFrame(() => setTimeout(() => setVisible(true), 10));
    } else {
      setVisible(false);
      setTimeout(() => setRender(false), 300);
    }
  }, [isOpen]);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); };
  const handleTouchMove = (e) => { const delta = e.touches[0].clientY - touchStartY.current; if (delta > 0) setTranslateY(delta); };
  const handleTouchEnd = () => { if (translateY > 80) onClose(); else setTranslateY(0); };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#F6F6F6] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1 bg-[#ECECEC] rounded-full" />
        </div>
        <div className="px-5 pb-4 flex items-center justify-between shrink-0">
          <h3 className="text-[18px] font-semibold text-[#111111]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full active:opacity-70 transition-opacity">
            <X size={18} className="text-[#111111]" />
          </button>
        </div>
        <div className="px-5 pb-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>,
    portalNode
  );
};

// --- VAULT SPECIFIC COMPONENTS ---

const VaultHeader = ({ onMenuClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Vault</h1>
    <button onClick={onMenuClick} className="w-10 h-10 flex items-center justify-center bg-transparent active:opacity-70 transition-opacity -mr-2">
      <MoreHorizontal size={24} color="#111111" />
    </button>
  </div>
);

const PetSelectorPill = ({ pet }) => (
  <button className="flex items-center gap-2 bg-white border border-[#ECECEC] pl-2 pr-3 py-1.5 rounded-full shadow-sm active:bg-black/[0.02] transition-colors mb-6">
    <div className="w-6 h-6 rounded-full bg-[#F6F6F6] flex items-center justify-center text-[12px]">🐕</div>
    <span className="text-[14px] font-semibold text-[#111111]">
      {pet.name} <span className="text-[#7A7A7A] font-normal">· {pet.breed}</span>
    </span>
    <ChevronDown size={14} className="text-[#7A7A7A] ml-1" />
  </button>
);

const EmergencyBundleCard = ({ petName, onShare, onDownload, isDownloading }) => (
  <div className="bg-[#FFF4F4] border border-[#FF3B30]/40 rounded-[12px] p-5 relative overflow-hidden mb-8 shadow-[0_2px_8px_rgba(255,59,48,0.04)]">
    <div className="flex items-start justify-between mb-4">
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[28px] leading-none">🚨</span>
          <h2 className="text-[14px] font-semibold text-[#D92D20] tracking-[0.05em] uppercase">Emergency Bundle</h2>
        </div>
        <p className="text-[14px] text-[#111111] font-medium leading-[1.5] max-w-[240px]">
          Quick access to all critical information for {petName}.
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <Button variant="danger" icon={Share2} onClick={onShare} className="!bg-[#E6352B]">Share Emergency Info</Button>
      <Button variant="secondary" icon={FileDown} isLoading={isDownloading} onClick={onDownload}>
        Download PDF
      </Button>
    </div>
  </div>
);

const QuickAccessGrid = ({ onNavigate }) => (
  <div className="mb-8">
    <SectionHeader title="Quick Access" />
    <div className="grid grid-cols-2 gap-4">
      {[
        { icon: Stethoscope, label: 'Health Records', route: '/vault/health' },
        { icon: FileText, label: 'Documents', route: '/vault/documents' },
        { icon: Phone, label: 'Emergency Contacts', route: '/vault/contacts' },
        { icon: MapPin, label: 'Places', route: '/vault/places' }
      ].map((item, i) => (
        <Card key={i} clickable className="p-4 flex flex-col items-center justify-center gap-3" onClick={() => onNavigate(item.route)}>
          <div className="w-10 h-10 rounded-full bg-[#F6F6F6] text-[#111111] flex items-center justify-center">
            <item.icon size={20} strokeWidth={1.5} />
          </div>
          <span className="text-[14px] font-semibold text-[#111111] text-center">{item.label}</span>
        </Card>
      ))}
    </div>
  </div>
);

const CriticalInfoCard = ({ data, onCopyMicrochip }) => (
  <div className="mb-8">
    <SectionHeader title="Critical Information" />
    <Card className="!p-0 overflow-hidden">
      
      {/* Medications */}
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors" onClick={() => alert('Navigate to Medications')}>
        <div className="flex items-center gap-2 mb-3">
          <Pill size={18} className="text-[#111111]" />
          <span className="font-semibold text-[16px] text-[#111111]">Medications ({data.medications.length})</span>
        </div>
        <ul className="pl-7 space-y-1.5">
          {data.medications.map(med => (
            <li key={med.id} className="text-[14px] text-[#111111] flex items-start gap-2 leading-[1.4]">
              <span className="text-[#7A7A7A] mt-0.5">•</span> 
              <span><span className="font-semibold">{med.name}</span> ({med.dosage})</span>
            </li>
          ))}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />
      
      {/* Allergies */}
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors" onClick={() => alert('Navigate to Allergies')}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-[#111111]" />
          <span className="font-semibold text-[16px] text-[#111111]">Allergies ({data.allergies.length})</span>
        </div>
        <ul className="pl-7 space-y-2.5">
          {data.allergies.map(alg => (
            <li key={alg.id} className="flex items-center justify-between">
              <span className="text-[14px] text-[#111111] font-medium flex items-center gap-2">
                <span className="text-[#7A7A7A]">•</span> {alg.allergen}
              </span>
              <Badge variant={alg.severity === 'SEVERE' ? 'error' : 'warning'}>{alg.severity}</Badge>
            </li>
          ))}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />

      {/* Vaccinations */}
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors" onClick={() => alert('Navigate to Vaccinations')}>
        <div className="flex items-center gap-2 mb-3">
          <Syringe size={18} className="text-[#111111]" />
          <span className="font-semibold text-[16px] text-[#111111]">Vaccinations</span>
        </div>
        <ul className="pl-7 space-y-2">
          {data.vaccinations.length > 0 ? data.vaccinations.map(vac => (
            <li key={vac.id} className="text-[14px] text-[#111111] flex items-start gap-2 leading-[1.4]">
              <span className="text-[#7A7A7A] mt-0.5">•</span>
              <span>
                <span className="font-semibold">{vac.name}:</span>{' '}
                <span className={vac.isWarning ? 'text-[#D92D20] font-medium' : ''}>{vac.statusText}</span>
              </span>
            </li>
          )) : <li className="text-[14px] text-[#7A7A7A] italic">All up to date.</li>}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />

      {/* Microchip */}
      <div className="p-4 flex items-center justify-between bg-[#F6F6F6]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow-sm flex items-center justify-center border border-[#ECECEC]">
            <Fingerprint size={18} className="text-[#111111]" />
          </div>
          <div>
            <div className="text-[11px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em]">Microchip ID</div>
            <div className="text-[14px] font-mono font-medium text-[#111111] mt-0.5">{data.microchipId}</div>
          </div>
        </div>
        <button onClick={onCopyMicrochip} className="w-10 h-10 flex items-center justify-center bg-white border border-[#ECECEC] rounded-full active:bg-black/5 transition-colors text-[#111111]">
          <Copy size={16} />
        </button>
      </div>
    </Card>
  </div>
);

const ContactsPreview = ({ contacts, onNavigate }) => (
  <div className="mb-8">
    <SectionHeader title="Emergency Contacts" />
    <Card className="!p-0 overflow-hidden">
      {contacts.map((contact, index) => (
        <React.Fragment key={contact.id}>
          <div className="p-4 flex items-center justify-between active:bg-black/[0.02] transition-colors cursor-pointer" onClick={() => onNavigate('/vault/contacts')}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0">
                <span className="text-[16px]">{contact.type === 'PRIMARY' ? '👤' : contact.type.includes('EMERGENCY') ? '🚑' : '🏥'}</span>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111] leading-tight mb-0.5">{contact.name}</div>
                <div className="text-[12px] text-[#7A7A7A] uppercase tracking-wide">{contact.type}</div>
              </div>
            </div>
            <ChevronRight size={18} className="text-[#7A7A7A]" />
          </div>
          {index < contacts.length - 1 && <Divider spacing="small" className="ml-[64px]" />}
        </React.Fragment>
      ))}
      <button onClick={() => onNavigate('/vault/contacts')} className="w-full py-3.5 text-[14px] font-medium text-[#111111] bg-[#F6F6F6] hover:bg-[#ECECEC] transition-colors border-t border-[#ECECEC]">
        View All Contacts
      </button>
    </Card>
  </div>
);

const RecentDocumentsCard = ({ documents }) => (
  <div className="mb-8">
    <SectionHeader title="Recent Documents" />
    <Card className="!p-0 overflow-hidden">
      {documents.map((doc, index) => (
        <React.Fragment key={doc.id}>
          <div className="p-4 flex items-center gap-4 active:bg-black/[0.02] cursor-pointer transition-colors" onClick={() => alert('Open PDF Viewer')}>
            <div className="w-10 h-10 rounded-[10px] bg-[#F6F6F6] text-[#111111] flex items-center justify-center shrink-0">
              <doc.icon size={20} strokeWidth={1.5} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-[#111111] truncate mb-0.5">{doc.title}</div>
              <div className="text-[13px] text-[#7A7A7A]">{doc.type} · {formatBytes(doc.size)} · {doc.date}</div>
            </div>
            <ChevronRight size={18} className="text-[#7A7A7A]" />
          </div>
          {index < documents.length - 1 && <Divider spacing="small" className="ml-[72px]" />}
        </React.Fragment>
      ))}
      <button className="w-full py-3.5 text-[14px] font-medium text-[#111111] bg-[#F6F6F6] hover:bg-[#ECECEC] transition-colors border-t border-[#ECECEC]">
        View All Documents
      </button>
    </Card>
  </div>
);

const DataManagementCard = () => (
  <div className="mb-12">
    <SectionHeader title="Data Management" />
    <Card className="!p-0 overflow-hidden">
      {[
        { icon: DownloadCloud, label: 'Export all data' },
        { icon: Cloud, label: 'Backup to cloud' },
        { icon: Lock, label: 'Privacy settings' }
      ].map((item, index) => (
        <React.Fragment key={index}>
          <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors text-left active:bg-black/[0.04]" onClick={() => alert(item.label)}>
            <item.icon size={22} className="text-[#111111]" strokeWidth={1.5} />
            <span className="text-[14px] text-[#111111] flex-1">{item.label}</span>
          </button>
          {index < 2 && <Divider spacing="small" className="ml-12" />}
        </React.Fragment>
      ))}
    </Card>
  </div>
);

// --- MAIN SCREENS ---

const VaultScreen = ({ onNavigate }) => {
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const previewData = deriveVaultPreviewData(MOCK_VAULT_DATA);
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); 
    setIsDownloading(false);
    showToast('Emergency PDF downloaded');
  };

  const handleCopyMicrochip = () => {
    navigator.clipboard?.writeText(previewData.pet.microchipId);
    showToast('Microchip ID copied');
  };

  return (
    <div className="absolute inset-0 overflow-y-auto overflow-x-hidden bg-[#F6F6F6] custom-scrollbar">
      <div className="pt-14 pb-[140px] px-5 relative z-0">
        
        <VaultHeader onMenuClick={() => setMenuSheetOpen(true)} />
        <PetSelectorPill pet={previewData.pet} />
        
        <EmergencyBundleCard 
          petName={previewData.pet.name} 
          onShare={() => setShareSheetOpen(true)} 
          onDownload={handleDownloadPDF} 
          isDownloading={isDownloading} 
        />
        
        <QuickAccessGrid onNavigate={onNavigate} />
        
        <CriticalInfoCard 
          data={{ ...previewData.criticalInfo, microchipId: previewData.pet.microchipId }} 
          onCopyMicrochip={handleCopyMicrochip} 
        />
        
        <ContactsPreview contacts={previewData.emergencyContacts} onNavigate={onNavigate} />
        <RecentDocumentsCard documents={previewData.recentDocuments} />
        <DataManagementCard />

      </div>

      <div className="fixed bottom-0 left-0 right-0 h-[140px] bg-gradient-to-t from-[#F6F6F6] via-[#F6F6F6]/80 to-transparent pointer-events-none z-10 rounded-b-[40px]" />

      <EmergencyShareSheet 
        isOpen={shareSheetOpen} 
        onClose={() => setShareSheetOpen(false)} 
        data={previewData} 
        onCopy={() => { showToast('Link copied'); setShareSheetOpen(false); }} 
      />
      <VaultOptionsSheet isOpen={menuSheetOpen} onClose={() => setMenuSheetOpen(false)} />
      <Toast message={toastMsg} isVisible={!!toastMsg} />
    </div>
  );
};

// --- EMERGENCY CONTACTS SCREEN ---

const EmergencyContactsScreen = ({ onBack }) => {
  const [toastMsg, setToastMsg] = useState('');
  const [selectedContact, setSelectedContact] = useState(null);
  const [selectedVet, setSelectedVet] = useState(null);
  const [selectedProtocol, setSelectedProtocol] = useState(null);
  const [shareMenuOpen, setShareMenuOpen] = useState(false);
  const [headerMenuOpen, setHeaderMenuOpen] = useState(false);

  const data = mockVaultEmergencyContacts;
  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const handleCallEmergencyVet = () => {
    const emergencyVet = data.veterinaryContacts.find(v => v.type === 'emergency');
    if (window.confirm(`Call Emergency Vet?\n${emergencyVet.name}\n${emergencyVet.phone}`)) {
      window.location.href = `tel:${emergencyVet.phone}`;
    }
  };

  const handleCall = (phone) => window.location.href = `tel:${phone}`;
  const handleMessage = (phone) => window.location.href = `sms:${phone}`;
  const handleEmail = (email) => window.location.href = `mailto:${email}`;
  const handleDirections = (address) => window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address.full)}`);
  const handleWebsite = (url) => window.open(url, '_blank');

  return (
    <div className="absolute inset-0 bg-[#F6F6F6] z-50 overflow-hidden">

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
          <h2 className="text-[17px] font-semibold text-[#111111]">Emergency Contacts</h2>
          {/* Right: Menu button */}
          <button
            onClick={() => setHeaderMenuOpen(true)}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreHorizontal size={22} color="#111111" />
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="absolute inset-0 overflow-y-auto custom-scrollbar px-5 py-6" style={{ paddingTop: 54, zIndex: 0 }}>
        
        {/* Compact Pet Info Row */}
        <div className="flex items-center gap-2 mb-8 px-1">
          <div className="w-6 h-6 rounded-full bg-black/5 flex items-center justify-center text-[12px]">🐕</div>
          <div className="text-[14px]">
            <span className="font-semibold text-[#111111]">{data.pet.name}</span>
            <span className="text-[#7A7A7A]"> · {data.pet.breed}</span>
          </div>
        </div>

        {/* Refined Emergency Alert Banner */}
        <div className="bg-[#FFF4F4] border border-[#FF3B30]/40 rounded-[12px] p-5 mb-8 shadow-[0_2px_8px_rgba(255,59,48,0.04)]">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[28px] leading-none">🚨</span>
            <h3 className="text-[14px] font-semibold text-[#D92D20] tracking-[0.05em] uppercase">In Case of Emergency</h3>
          </div>
          <p className="text-[14px] font-medium text-[#111111] mb-3 leading-[1.5]">
            Call emergency vet immediately if Luna shows signs of:
          </p>
          <ul className="mb-5 pl-1 space-y-1.5">
            {data.emergencySigns.map((sign, idx) => (
              <li key={idx} className="text-[14px] text-[#111111] flex items-start gap-2 leading-[1.4]">
                <span className="text-[#D92D20] mt-0.5">•</span> 
                <span>{sign}</span>
              </li>
            ))}
          </ul>
          <button onClick={handleCallEmergencyVet} className="w-full h-[48px] bg-[#E6352B] text-white rounded-[12px] text-[15px] font-semibold shadow-sm active:scale-[0.98] transition-transform flex items-center justify-center gap-2">
            🚑 Call Emergency Vet
          </button>
        </div>

        {/* Emergency Contacts Section */}
        <div className="mb-8">
          <SectionHeader title="Emergency Contacts" actionIcon={Plus} onAction={() => showToast('Add Contact')} />
          <div className="space-y-4">
            {data.emergencyContacts.map((contact) => (
              <Card key={contact.id} clickable className="p-4" onClick={() => setSelectedContact(contact)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0 text-[18px]">👤</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[16px] font-semibold text-[#111111] leading-tight">{contact.name}</div>
                      <div className={`text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase ${contact.priority === 'PRIMARY' ? 'bg-[#111111] text-white' : 'bg-black/5 text-[#111111]'}`}>
                        {contact.priority}
                      </div>
                    </div>
                    <div className="text-[13px] text-[#7A7A7A] mb-2">{contact.relationship}</div>
                    <div className="text-[14px] text-[#111111]">{contact.phone}</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); handleCall(contact.phone); }} className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center active:scale-95 transition-transform"><Phone size={18} fill="currentColor" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleMessage(contact.phone); }} className="w-10 h-10 rounded-full bg-[#EFF4FF] text-[#175CD3] flex items-center justify-center active:scale-95 transition-transform"><MessageCircle size={18} fill="currentColor" /></button>
                  {contact.email && <button onClick={(e) => { e.stopPropagation(); handleEmail(contact.email); }} className="w-10 h-10 rounded-full bg-[#FFFAEB] text-[#B54708] flex items-center justify-center active:scale-95 transition-transform"><Mail size={18} fill="currentColor" /></button>}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Veterinary Contacts Section */}
        <div className="mb-8">
          <SectionHeader title="Veterinary Contacts" actionIcon={Plus} onAction={() => showToast('Add Vet')} />
          <div className="space-y-4">
            {data.veterinaryContacts.map((vet) => (
              <Card key={vet.id} clickable className={`p-4 ${vet.type === 'emergency' ? 'border-l-[3px] border-l-[#D92D20]' : ''}`} onClick={() => setSelectedVet(vet)}>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0 text-[18px]">
                    {vet.type === 'primary' ? '🏥' : vet.type === 'emergency' ? '🚑' : '🦴'}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="text-[16px] font-semibold text-[#111111] leading-tight">{vet.name}</div>
                    </div>
                    <div className="mb-2">
                      <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase ${vet.type === 'primary' ? 'bg-[#ECFDF3] text-[#027A48]' : vet.type === 'emergency' ? 'bg-[#FEF3F2] text-[#B42318]' : 'bg-[#EFF4FF] text-[#175CD3]'}`}>
                        {vet.type === 'emergency' ? 'EMERGENCY (24/7)' : vet.type === 'primary' ? 'PRIMARY VET' : 'SPECIALIST'}
                      </span>
                    </div>
                    {vet.vetName && <div className="text-[13px] text-[#7A7A7A] mb-2">{vet.vetName}</div>}
                    <div className="text-[14px] text-[#111111] mb-1">{vet.phone}</div>
                    <div className="text-[13px] text-[#7A7A7A] leading-relaxed mb-2 line-clamp-2">{vet.address.street}, {vet.address.postalCode} {vet.address.city}</div>
                    <div className={`text-[12px] font-medium ${vet.available24_7 ? 'text-[#D92D20]' : 'text-[#7A7A7A]'}`}>{vet.hoursFormatted}</div>
                  </div>
                </div>
                <div className="flex gap-3 mt-4">
                  <button onClick={(e) => { e.stopPropagation(); handleCall(vet.phone); }} className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center active:scale-95 transition-transform"><Phone size={18} fill="currentColor" /></button>
                  <button onClick={(e) => { e.stopPropagation(); handleDirections(vet.address); }} className="w-10 h-10 rounded-full bg-[#EFF4FF] text-[#175CD3] flex items-center justify-center active:scale-95 transition-transform"><MapIcon size={18} /></button>
                  {vet.website && <button onClick={(e) => { e.stopPropagation(); handleWebsite(vet.website); }} className="w-10 h-10 rounded-full bg-[#FFFAEB] text-[#B54708] flex items-center justify-center active:scale-95 transition-transform"><Globe size={18} /></button>}
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Emergency Protocols Section */}
        <div className="mb-8">
          <SectionHeader title="Emergency Protocols" />
          <div className="space-y-4">
            {data.emergencyProtocols.map(protocol => (
              <Card key={protocol.id} clickable className="p-4 bg-[#FFFBF2] border-[#ECECEC]" onClick={() => setSelectedProtocol(protocol)}>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[20px]">{protocol.icon}</span>
                  <div className="text-[16px] font-semibold text-[#111111]">{protocol.title}</div>
                </div>
                <ol className="pl-6 space-y-1 mb-3 list-decimal text-[14px] text-[#111111] leading-[1.5]">
                  {protocol.summary.map((step, idx) => <li key={idx}>{step}</li>)}
                </ol>
                <div className="text-[13px] font-medium text-[#FF6B35]/85">View Full Protocol →</div>
              </Card>
            ))}
            <button className="w-full py-3.5 text-[14px] font-medium text-[#111111] bg-white border border-[#ECECEC] rounded-[12px] transition-colors shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:bg-black/[0.02]">
              View All Protocols (6)
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-12">
          <SectionHeader title="Quick Actions" />
          <div className="bg-white border border-[#ECECEC] rounded-[12px] shadow-[0_2px_8px_rgba(0,0,0,0.04)] overflow-hidden">
            {[
              { icon: Share2, label: 'Share emergency contacts', onClick: () => setShareMenuOpen(true) },
              { icon: Printer, label: 'Print contact list', onClick: () => showToast('Printing contact list...') },
              { icon: DownloadCloud, label: 'Export as vCard', onClick: () => showToast('vCard downloaded') },
              { icon: Plus, label: 'Add new contact', onClick: () => showToast('Navigate: Add Contact') }
            ].map((action, idx) => (
              <React.Fragment key={idx}>
                <button onClick={action.onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors text-left active:bg-black/[0.04]">
                  <action.icon size={22} className="text-[#111111]" strokeWidth={1.5} />
                  <span className="text-[14px] text-[#111111] flex-1">{action.label}</span>
                </button>
                {idx < 3 && <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* Detail Sheets */}
      <ContactDetailsSheet isOpen={!!selectedContact} onClose={() => setSelectedContact(null)} contact={selectedContact} onCall={handleCall} onEmail={handleEmail} />
      <VetDetailsSheet isOpen={!!selectedVet} onClose={() => setSelectedVet(null)} vet={selectedVet} onCall={handleCall} onDirections={handleDirections} onWebsite={handleWebsite} />
      <ProtocolDetailsSheet isOpen={!!selectedProtocol} onClose={() => setSelectedProtocol(null)} protocol={selectedProtocol} onCallEmergencyVet={handleCallEmergencyVet} />
      
      {/* Share / Menu Sheets */}
      <ShareContactsSheet isOpen={shareMenuOpen} onClose={() => setShareMenuOpen(false)} onShareMessage={() => { showToast('Contacts copied for message'); setShareMenuOpen(false); }} />
      <EmergencyHeaderMenuSheet isOpen={headerMenuOpen} onClose={() => setHeaderMenuOpen(false)} onNavigate={() => { showToast('Navigate to Edit'); setHeaderMenuOpen(false); }} />
      
      <Toast message={toastMsg} isVisible={!!toastMsg} />
    </div>
  );
};

// --- SPECIFIC SHEETS FOR EMERGENCY CONTACTS ---

const ContactDetailsSheet = ({ isOpen, onClose, contact, onCall, onEmail }) => {
  if (!contact) return null;
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Contact Details">
      <div className="pt-2 pb-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#F6F6F6] text-[24px] flex items-center justify-center shrink-0">👤</div>
          <div>
            <div className="text-[20px] font-semibold text-[#111111] leading-tight mb-1">{contact.name}</div>
            <div className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase mb-1 ${contact.priority === 'PRIMARY' ? 'bg-[#111111] text-white' : 'bg-black/5 text-[#111111]'}`}>
              {contact.priority}
            </div>
            <div className="text-[13px] text-[#7A7A7A]">{contact.relationship}</div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Phone</div>
              <div className="text-[16px] text-[#111111]">{contact.phone}</div>
            </div>
            <button onClick={() => onCall(contact.phone)} className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0 active:scale-95"><Phone size={18} fill="currentColor" /></button>
          </div>

          {contact.email && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Email</div>
                <div className="text-[16px] text-[#111111]">{contact.email}</div>
              </div>
              <button onClick={() => onEmail(contact.email)} className="w-10 h-10 rounded-full bg-[#FFFAEB] text-[#B54708] flex items-center justify-center shrink-0 active:scale-95"><Mail size={18} fill="currentColor" /></button>
            </div>
          )}

          {contact.address && (
            <div>
              <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Address</div>
              <div className="text-[14px] text-[#111111] leading-[1.5]">{contact.address.street}<br/>{contact.address.postalCode} {contact.address.city}</div>
            </div>
          )}

          {contact.notes && (
            <div>
              <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-2">Notes</div>
              <div className="text-[14px] text-[#111111] bg-[#F6F6F6] border border-[#ECECEC] p-3 rounded-[10px] leading-[1.5]">{contact.notes}</div>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-8">
          <Button variant="secondary" className="flex-1 h-[48px]" onClick={() => alert('Edit Contact')}>Edit</Button>
        </div>
      </div>
    </BottomSheet>
  );
};

const VetDetailsSheet = ({ isOpen, onClose, vet, onCall, onDirections, onWebsite }) => {
  if (!vet) return null;
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Veterinary Details">
      <div className="pt-2 pb-6">
        <div className="flex items-start gap-4 mb-8">
          <div className="w-12 h-12 rounded-full bg-[#F6F6F6] text-[24px] flex items-center justify-center shrink-0">
            {vet.type === 'primary' ? '🏥' : vet.type === 'emergency' ? '🚑' : '🦴'}
          </div>
          <div>
            <div className="text-[20px] font-semibold text-[#111111] leading-tight mb-1">{vet.name}</div>
            <div className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded-sm tracking-wide uppercase mb-1 ${vet.type === 'primary' ? 'bg-[#ECFDF3] text-[#027A48]' : vet.type === 'emergency' ? 'bg-[#FEF3F2] text-[#B42318]' : 'bg-[#EFF4FF] text-[#175CD3]'}`}>
              {vet.type === 'emergency' ? 'EMERGENCY (24/7)' : vet.type.toUpperCase()}
            </div>
            {vet.vetName && <div className="text-[13px] text-[#7A7A7A]">{vet.vetName}</div>}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Phone</div>
              <div className="text-[16px] text-[#111111]">{vet.phone}</div>
            </div>
            <button onClick={() => onCall(vet.phone)} className="w-10 h-10 rounded-full bg-[#ECFDF3] text-[#027A48] flex items-center justify-center shrink-0 active:scale-95"><Phone size={18} fill="currentColor" /></button>
          </div>

          <div>
            <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Address</div>
            <div className="text-[14px] text-[#111111] leading-[1.5] mb-3">{vet.address.street}<br/>{vet.address.postalCode} {vet.address.city}</div>
            <button onClick={() => onDirections(vet.address)} className="h-[40px] px-4 bg-white border border-[#ECECEC] text-[#111111] rounded-[10px] text-[14px] font-semibold flex items-center justify-center gap-2 active:bg-black/[0.02]">
              <MapIcon size={16} /> Get Directions
            </button>
          </div>

          <div>
            <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Hours</div>
            <div className="text-[14px] text-[#111111] whitespace-pre-line leading-[1.5]">{vet.hoursFormatted}</div>
          </div>

          {vet.website && (
            <div className="flex items-center justify-between">
              <div>
                <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-1">Website</div>
                <div className="text-[14px] text-[#175CD3] underline">{vet.website.replace('https://www.', '')}</div>
              </div>
              <button onClick={() => onWebsite(vet.website)} className="w-10 h-10 rounded-full bg-[#FFFAEB] text-[#B54708] flex items-center justify-center shrink-0 active:scale-95"><Globe size={18} /></button>
            </div>
          )}
        </div>

        <div className="flex gap-3 pt-8">
          <Button variant="secondary" className="flex-1 h-[48px]" onClick={() => alert('Edit Vet')}>Edit</Button>
        </div>
      </div>
    </BottomSheet>
  );
};

const ProtocolDetailsSheet = ({ isOpen, onClose, protocol, onCallEmergencyVet }) => {
  if (!protocol) return null;
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title={`${protocol.icon} ${protocol.title}`}>
      <div className="pt-2 pb-6">
        {protocol.severity === 'critical' && (
          <div className="text-[13px] font-bold text-[#D92D20] tracking-[0.05em] uppercase mb-6 bg-[#FFF4F4] px-3 py-1.5 inline-block rounded-md border border-[#FF3B30]/20">
            Severe Allergy - Act Fast
          </div>
        )}

        <h4 className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.05em] mb-4">Immediate Steps</h4>
        <div className="space-y-5 mb-8">
          {protocol.fullSteps.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="w-6 h-6 rounded-full bg-[#F6F6F6] text-[#111111] font-semibold text-[13px] flex items-center justify-center shrink-0">
                {step.step}
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111] mb-1">{step.title}</div>
                <div className="text-[14px] text-[#7A7A7A] leading-[1.5] mb-2">{step.description}</div>
                {step.phone && (
                  <button onClick={onCallEmergencyVet} className="h-[40px] px-4 bg-[#E6352B] text-white rounded-[10px] text-[14px] font-semibold shadow-sm active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2">
                    <Phone size={16} fill="currentColor" /> Call Now
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#FFF4F4] border border-[#FF3B30]/20 rounded-[12px] p-4 mb-8">
          <h4 className="text-[12px] font-medium text-[#D92D20] uppercase tracking-[0.05em] mb-3">Warning Signs</h4>
          <ul className="space-y-1.5">
            {protocol.warningSigns.map((sign, idx) => (
              <li key={idx} className="text-[14px] text-[#111111] flex items-center gap-2">
                <span className="text-[#D92D20]">•</span> {sign}
              </li>
            ))}
          </ul>
        </div>

        <div className="flex gap-3">
          <button className="flex-1 h-[44px] bg-white border border-[#ECECEC] text-[#111111] rounded-[10px] text-[14px] font-semibold flex items-center justify-center gap-2 active:bg-black/[0.02]">
            <Share2 size={16} /> Share Protocol
          </button>
          <button className="flex-1 h-[44px] bg-white border border-[#ECECEC] text-[#111111] rounded-[10px] text-[14px] font-semibold flex items-center justify-center gap-2 active:bg-black/[0.02]">
            <Printer size={16} /> Print
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

const ShareContactsSheet = ({ isOpen, onClose, onShareMessage }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Emergency Contacts">
    <div className="space-y-0 pt-2 pb-4 bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-sm">
      <button onClick={onShareMessage} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]">
        <MessageCircle size={22} className="text-[#111111]" strokeWidth={1.5} />
        <span className="text-[14px] text-[#111111] flex-1 text-left">Share as Message</span>
      </button>
      <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />
      <button onClick={() => alert('Sharing via Email...')} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]">
        <Mail size={22} className="text-[#111111]" strokeWidth={1.5} />
        <span className="text-[14px] text-[#111111] flex-1 text-left">Share as Email</span>
      </button>
      <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />
      <button onClick={() => alert('Generating QR...')} className="w-full flex items-center gap-4 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]">
        <QrCode size={22} className="text-[#111111]" strokeWidth={1.5} />
        <span className="text-[14px] text-[#111111] flex-1 text-left">Generate QR Code</span>
      </button>
    </div>
  </BottomSheet>
);

const EmergencyHeaderMenuSheet = ({ isOpen, onClose, onNavigate }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Emergency Options">
    <div className="space-y-4 pt-2 pb-4">
      <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-sm">
        {[ { label: 'Share emergency contacts', icon: Share2 }, { label: 'Print contact list', icon: Printer }, { label: 'Export as vCard', icon: DownloadCloud } ].map((item, i) => (
          <React.Fragment key={i}>
            <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]" onClick={() => alert(item.label)}>
              <item.icon size={22} className="text-[#111111]" strokeWidth={1.5} />
              <span className="text-[14px] text-[#111111] flex-1 text-left">{item.label}</span>
            </button>
            {i < 2 && <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />}
          </React.Fragment>
        ))}
      </div>
      
      <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden shadow-sm">
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]" onClick={onNavigate}>
          <Settings size={22} className="text-[#111111]" strokeWidth={1.5} />
          <span className="text-[14px] text-[#111111] flex-1 text-left">Edit contacts</span>
        </button>
        <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />
        <button className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors active:bg-black/[0.04]" onClick={() => alert('Emergency Protocols')}>
          <ShieldAlert size={22} className="text-[#111111]" strokeWidth={1.5} />
          <span className="text-[14px] text-[#111111] flex-1 text-left">Manage protocols</span>
        </button>
      </div>
    </div>
  </BottomSheet>
);

// --- HELPERS FOR VAULT SCREEN ---
const EmergencyShareSheet = ({ isOpen, onClose, data, onCopy }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Emergency Bundle">
    <div className="pt-2 pb-6">
      <p className="text-[14px] text-[#7A7A7A] mb-6 leading-[1.5]">
        Generate a secure temporary link that allows anyone to view Luna's critical info without an account.
      </p>
      <div className="bg-white border border-[#ECECEC] rounded-[12px] p-4 flex items-center justify-between mb-8 shadow-sm">
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-[#7A7A7A] uppercase tracking-wide">Secure Link</span>
          <span className="text-[14px] font-medium text-[#111111] truncate max-w-[180px]">{data.emergencyBundle.shareLink}</span>
        </div>
        <button onClick={onCopy} className="flex items-center gap-2 px-3 py-2 bg-black text-white rounded-lg text-[13px] font-semibold active:scale-95 transition-transform">
          <Copy size={14} /> Copy
        </button>
      </div>
      <Button icon={MessageCircle} onClick={() => alert('Sending Message...')}>Share via WhatsApp</Button>
    </div>
  </BottomSheet>
);

const VaultOptionsSheet = ({ isOpen, onClose }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Vault Options">
    <div className="space-y-4 pt-2">
      <div className="bg-white border border-[#ECECEC] rounded-[12px] overflow-hidden">
        {[ { label: 'Pet Profile Settings', icon: Settings }, { label: 'Manage Vault Access', icon: Lock } ].map((item, i) => (
          <React.Fragment key={i}>
            <button className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-black/[0.02] text-left" onClick={() => alert(item.label)}>
              <item.icon size={20} className="text-[#111111]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</span>
            </button>
            {i === 0 && <div className="w-full h-[1px] bg-[#ECECEC] ml-12" />}
          </React.Fragment>
        ))}
      </div>
    </div>
  </BottomSheet>
);

// --- APP SHELL (MAIN ENTRY POINT) ---
const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none">
    <div className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group">
            <div className={`absolute top-[12px] w-[32px] h-[32px] bg-[#FF6B35] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-25' : 'opacity-0'}`} />
            <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35] animate-spring-bump' : 'text-[#7A7A7A]'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] font-medium leading-none transition-colors duration-[240ms] ${isActive ? 'text-[#FF6B35]' : 'text-[#7A7A7A]'}`}>
              {tab.label}
            </span>
          </button>
        );
      })}
    </div>
  </nav>
);

export default function App() {
  const [activeTab, setActiveTab] = useState('vault');
  const [currentPath, setCurrentPath] = useState('/vault/contacts'); // Set direct to contacts for demo
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(timer); }, []);

  const handleNavigate = (path) => {
    if (path === currentPath) return;
    setIsFading(true);
    setTimeout(() => { 
      setCurrentPath(path);
      if (path.startsWith('/vault')) setActiveTab('vault');
      setIsFading(false); 
    }, 150);
  };

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return; 
    setActiveTab(tabId);
    handleNavigate(`/${tabId}`);
  };

  const renderScreen = () => {
    if (currentPath === '/vault/contacts') {
      return <EmergencyContactsScreen onBack={() => handleNavigate('/vault')} />;
    }
    if (currentPath.startsWith('/vault')) {
      return <VaultScreen onNavigate={handleNavigate} />;
    }
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <span className="text-[14px] font-medium text-[#7A7A7A]">View {currentPath} screen.</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        @keyframes springBump { 0% { transform: scale(1); } 40% { transform: scale(1.06); } 100% { transform: scale(1); } }
        .animate-spring-bump { animation: springBump 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#F6F6F6] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#F6F6F6] z-50 flex flex-col items-center justify-center">
            <FylosLogo fontSize="32px" textColor="#111111" className="mb-3" />
            <p className="text-[14px] text-[#7A7A7A] animate-pulse">Loading...</p>
          </div>
        ) : (
          <div id="main-app-wrapper" className="absolute inset-0 w-full h-full bg-[#F6F6F6] origin-top">
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {renderScreen()}
            </main>
            {/* Show Tab Bar only on root screens */}
            {currentPath.split('/').length <= 2 && (
              <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
            )}
          </div>
        )}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}