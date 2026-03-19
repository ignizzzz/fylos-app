import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, PawPrint, Calendar, Activity, Folder, Search, Bell, ChevronLeft, ChevronRight,
  MoreHorizontal, X, CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2,
  ChevronDown, Settings, Star, Share2, FileDown, Stethoscope, FileText, Phone,
  MapPin, Pill, ShieldAlert, Syringe, Fingerprint, QrCode, Copy, Cloud, Lock,
  DownloadCloud, Link as LinkIcon
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
    background: '#F6F6F6', // Soft Revolut-style gray
    surface: '#FFFFFF',
    primary: '#FF6B35',
    textMain: '#111111',
    textMuted: '#8E8E93',
  }
};

const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-0', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-black/[0.04] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-black/[0.04] text-[#6E6E73]",
    success: "bg-[#E5F9ED] text-[#00C060]",
    warning: "bg-[#FFF4E5] text-[#FF9500]",
    error: "bg-[#FFE5E5] text-[#FF3B30]",
    info: "bg-[#E5F0FF] text-[#007AFF]"
  };
  return (
    <span className={`inline-flex items-center text-[10px] font-bold rounded-full px-2 py-0.5 uppercase tracking-wider leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', fullWidth = true, icon: Icon, isLoading, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-[16px] font-semibold transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2 px-4 py-[14px] text-[15px]";
  const variants = {
    primary: "bg-[#FF6B35] text-white shadow-[0_4px_14px_rgba(255,107,53,0.25)] hover:bg-[#E85D2A]",
    secondary: "bg-[#FFFFFF] text-[#111111] border-[1.5px] border-black/[0.08] hover:bg-black/[0.02]",
  };
  return (
    <button disabled={isLoading} className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : "w-auto"} ${isLoading ? "opacity-70" : ""} ${className}`} {...props}>
      {isLoading ? <Loader2 size={18} className="animate-spin" /> : <> {Icon && <Icon size={18} />} {children} </>}
    </button>
  );
};

const Card = ({ children, className = '', clickable, ...props }) => {
  const interactive = clickable ? "cursor-pointer active:scale-[0.98] active:bg-black/[0.01]" : "";
  return (
    <div className={`bg-[#FFFFFF] border border-black/[0.03] shadow-[0_4px_20px_rgba(0,0,0,0.02)] rounded-[20px] transition-all duration-200 ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const SectionHeader = ({ title }) => (
  <h3 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em] mb-3 ml-1">{title}</h3>
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
        className="relative w-full bg-[#F6F6F6] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-4 pb-2 cursor-grab touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-12 h-1.5 bg-black/10 rounded-full" />
        </div>
        <div className="px-6 pb-4 flex items-center justify-between shrink-0">
          <h3 className="text-[20px] font-bold text-[#111111]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full active:scale-95 transition-transform">
            <X size={18} className="text-[#6E6E73]" />
          </button>
        </div>
        <div className="px-6 pb-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>,
    portalNode
  );
};

// --- VAULT SPECIFIC COMPONENTS ---

const VaultHeader = ({ onMenuClick }) => (
  <div className="flex justify-between items-center mb-6">
    <h1 className="text-[28px] font-bold text-[#111111] tracking-tight">Vault</h1>
    <button onClick={onMenuClick} className="w-10 h-10 flex items-center justify-center bg-black/[0.02] border border-black/[0.04] rounded-full active:scale-[0.96] transition-all">
      <MoreHorizontal size={22} color="#111111" />
    </button>
  </div>
);

const PetSelectorPill = ({ pet }) => (
  <button className="flex items-center gap-2.5 bg-white/60 backdrop-blur-md border border-black/[0.04] pl-1.5 pr-4 py-1.5 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.98] transition-all mb-6">
    <div className="w-7 h-7 rounded-full bg-black/5 flex items-center justify-center text-[14px]">🐕</div>
    <span className="text-[15px] font-semibold text-[#111111]">
      {pet.name} <span className="text-[#8E8E93] font-normal">· {pet.breed}</span>
    </span>
    <ChevronDown size={14} className="text-[#8E8E93] ml-1" />
  </button>
);

const EmergencyBundleCard = ({ petName, onShare, onDownload, isDownloading }) => (
  <div className="bg-[#FFF3EE] border border-[#FFD3C4] rounded-[24px] p-5 relative overflow-hidden mb-8 shadow-[0_4px_20px_rgba(255,107,53,0.04)]">
    <div className="flex items-start justify-between mb-5">
      <div>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-[20px]">🚨</span>
          <h2 className="text-[13px] font-bold text-[#111111] tracking-[0.05em] uppercase">Emergency Bundle</h2>
        </div>
        <p className="text-[14px] text-[#FF6B35] font-medium opacity-90 leading-relaxed max-w-[240px]">
          Quick access to all critical information for {petName}.
        </p>
      </div>
    </div>
    <div className="flex flex-col gap-3">
      <Button variant="primary" icon={Share2} onClick={onShare}>Share Emergency Info</Button>
      <Button variant="secondary" icon={FileDown} className="!border-[#FFD3C4] !text-[#FF6B35] hover:!bg-white/50 bg-white" isLoading={isDownloading} onClick={onDownload}>
        Download PDF
      </Button>
    </div>
  </div>
);

const QuickAccessGrid = () => (
  <div className="mb-8">
    <SectionHeader title="Quick Access" />
    <div className="grid grid-cols-2 gap-3">
      {[
        { icon: Stethoscope, label: 'Health Records', route: '/vault/health' },
        { icon: FileText, label: 'Documents', route: '/vault/documents' },
        { icon: Phone, label: 'Emergency Contacts', route: '/vault/contacts' },
        { icon: MapPin, label: 'Places', route: '/vault/places' }
      ].map((item, i) => (
        <Card key={i} clickable className="p-4 flex flex-col items-center justify-center gap-3" onClick={() => alert(`Maps to ${item.route}`)}>
          <div className="w-[42px] h-[42px] rounded-full bg-[#F6F6F6] text-[#111111] flex items-center justify-center">
            <item.icon size={20} strokeWidth={2} />
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
          <span className="font-semibold text-[15px] text-[#111111]">Medications ({data.medications.length})</span>
        </div>
        <ul className="pl-7 space-y-1.5">
          {data.medications.map(med => (
            <li key={med.id} className="text-[14px] text-[#6E6E73] flex items-start gap-2">
              <span className="text-black/20 mt-0.5">•</span> 
              <span><strong className="text-[#111111] font-medium">{med.name}</strong> ({med.dosage})</span>
            </li>
          ))}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />
      
      {/* Allergies */}
      <div className="p-4 active:bg-black/[0.02] cursor-pointer transition-colors" onClick={() => alert('Navigate to Allergies')}>
        <div className="flex items-center gap-2 mb-3">
          <ShieldAlert size={18} className="text-[#111111]" />
          <span className="font-semibold text-[15px] text-[#111111]">Allergies ({data.allergies.length})</span>
        </div>
        <ul className="pl-7 space-y-2.5">
          {data.allergies.map(alg => (
            <li key={alg.id} className="flex items-center justify-between">
              <span className="text-[14px] text-[#111111] font-medium flex items-center gap-2">
                <span className="text-black/20">•</span> {alg.allergen}
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
          <span className="font-semibold text-[15px] text-[#111111]">Vaccinations</span>
        </div>
        <ul className="pl-7 space-y-2">
          {data.vaccinations.length > 0 ? data.vaccinations.map(vac => (
            <li key={vac.id} className="text-[14px] text-[#6E6E73] flex items-start gap-2">
              <span className="text-black/20 mt-0.5">•</span>
              <span>
                <strong className="text-[#111111] font-medium">{vac.name}:</strong>{' '}
                <span className={vac.isWarning ? 'text-[#FF3B30] font-medium' : ''}>{vac.statusText}</span>
                {vac.isWarning && <AlertTriangle size={14} className="inline ml-1 text-[#FF3B30] -mt-0.5" />}
              </span>
            </li>
          )) : <li className="text-[14px] text-[#6E6E73] italic">All up to date.</li>}
        </ul>
      </div>
      <Divider spacing="small" className="ml-11" />

      {/* Microchip */}
      <div className="p-4 flex items-center justify-between bg-black/[0.01]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-white shadow-sm border border-black/[0.04] flex items-center justify-center">
            <Fingerprint size={18} className="text-[#111111]" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-[#8E8E93] uppercase tracking-[0.05em]">Microchip ID</div>
            <div className="text-[14px] font-mono font-medium text-[#111111] mt-0.5">{data.microchipId}</div>
          </div>
        </div>
        <button onClick={onCopyMicrochip} className="w-10 h-10 flex items-center justify-center bg-white border border-black/[0.04] shadow-[0_2px_8px_rgba(0,0,0,0.02)] rounded-full active:scale-95 transition-transform text-[#6E6E73]">
          <Copy size={16} />
        </button>
      </div>
    </Card>
  </div>
);

const ContactsPreview = ({ contacts, onCall }) => (
  <div className="mb-8">
    <SectionHeader title="Emergency Contacts" />
    <Card className="!p-0 overflow-hidden">
      {contacts.map((contact, index) => (
        <React.Fragment key={contact.id}>
          <div className="p-4 flex items-center justify-between active:bg-black/[0.02] transition-colors cursor-pointer" onClick={() => alert('Navigate to Contact')}>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0">
                <span className="text-[18px]">{contact.type === 'PRIMARY' ? '👤' : contact.type.includes('EMERGENCY') ? '🚑' : '🏥'}</span>
              </div>
              <div>
                <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{contact.name}</div>
                <Badge variant="default">{contact.type}</Badge>
              </div>
            </div>
            <button onClick={(e) => { e.stopPropagation(); onCall(contact.phone); }} className="w-10 h-10 rounded-full bg-[#E5F9ED] text-[#00C060] flex items-center justify-center shrink-0 active:scale-90 transition-transform">
              <Phone size={16} fill="currentColor" />
            </button>
          </div>
          {index < contacts.length - 1 && <Divider spacing="small" className="ml-[68px]" />}
        </React.Fragment>
      ))}
      <button className="w-full py-4 text-[14px] font-medium text-[#FF6B35] bg-black/[0.01] hover:bg-black/[0.03] transition-colors border-t border-black/[0.04]">
        View All Contacts →
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
            <div className="w-10 h-10 rounded-[12px] bg-[#F6F6F6] text-[#111111] flex items-center justify-center shrink-0">
              <doc.icon size={20} strokeWidth={2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-[15px] font-semibold text-[#111111] truncate mb-0.5">{doc.title}</div>
              <div className="text-[13px] text-[#8E8E93]">{doc.type} · {formatBytes(doc.size)} · {doc.date}</div>
            </div>
            <ChevronRight size={18} className="text-black/20" />
          </div>
          {index < documents.length - 1 && <Divider spacing="small" className="ml-[72px]" />}
        </React.Fragment>
      ))}
      <button className="w-full py-4 text-[14px] font-medium text-[#FF6B35] bg-black/[0.01] hover:bg-black/[0.03] transition-colors border-t border-black/[0.04]">
        View All Documents →
      </button>
    </Card>
  </div>
);

const DataManagementCard = () => (
  <div className="mb-6">
    <SectionHeader title="Data Management" />
    <Card className="!p-0 overflow-hidden">
      {[
        { icon: DownloadCloud, label: 'Export all data' },
        { icon: Cloud, label: 'Backup to cloud' },
        { icon: Lock, label: 'Privacy settings' }
      ].map((item, index) => (
        <React.Fragment key={index}>
          <button className="w-full flex items-center gap-3 p-4 hover:bg-black/[0.02] transition-colors text-left active:scale-[0.99]" onClick={() => alert(item.label)}>
            <item.icon size={20} className="text-[#111111]" strokeWidth={1.5} />
            <span className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</span>
            <ChevronRight size={18} className="text-black/20" />
          </button>
          {index < 2 && <Divider spacing="small" className="ml-12" />}
        </React.Fragment>
      ))}
    </Card>
  </div>
);

// --- MAIN VAULT SCREEN ---

const VaultScreen = () => {
  const [shareSheetOpen, setShareSheetOpen] = useState(false);
  const [menuSheetOpen, setMenuSheetOpen] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const previewData = deriveVaultPreviewData(MOCK_VAULT_DATA);

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  const handleDownloadPDF = async () => {
    setIsDownloading(true);
    await new Promise(resolve => setTimeout(resolve, 1500)); // Mock Generation
    setIsDownloading(false);
    showToast('Emergency PDF downloaded');
  };

  const handleCopyMicrochip = () => {
    navigator.clipboard?.writeText(previewData.pet.microchipId);
    showToast('Microchip ID copied');
  };

  const handleCall = (phone) => {
    if (window.confirm(`Call ${phone}?`)) window.location.href = `tel:${phone}`;
  };

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F6F6F6]">

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={() => alert('Navigate back')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Vault</h2>
          {/* Right: Menu button */}
          <button
            onClick={() => setMenuSheetOpen(true)}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreHorizontal size={22} color="#111111" />
          </button>
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ paddingTop: 54, zIndex: 0 }}>
      <div className="pb-[140px] px-5 relative z-0">

        <PetSelectorPill pet={previewData.pet} />
        
        <EmergencyBundleCard 
          petName={previewData.pet.name} 
          onShare={() => setShareSheetOpen(true)} 
          onDownload={handleDownloadPDF} 
          isDownloading={isDownloading} 
        />
        
        <QuickAccessGrid />
        
        <CriticalInfoCard 
          data={{ ...previewData.criticalInfo, microchipId: previewData.pet.microchipId }} 
          onCopyMicrochip={handleCopyMicrochip} 
        />
        
        <ContactsPreview contacts={previewData.emergencyContacts} onCall={handleCall} />
        <RecentDocumentsCard documents={previewData.recentDocuments} />
        <DataManagementCard />

      </div>
      </div>

      {/* Fade Out UI: Translucent Gradient overlaying content at the bottom */}
      <div className="fixed bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#F6F6F6] via-[#F6F6F6]/90 to-transparent pointer-events-none z-10 rounded-b-[40px]" />

      {/* Modals & Toasts */}
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

// --- SPECIFIC SHEETS ---

const EmergencyShareSheet = ({ isOpen, onClose, data, onCopy }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Share Emergency Info">
    <div className="space-y-6 pt-2">
      <div className="flex flex-col items-center justify-center p-6 bg-white rounded-[24px] border border-black/[0.04] shadow-sm">
        <div className="w-[160px] h-[160px] bg-white rounded-2xl border border-black/[0.04] p-2 mb-5 flex items-center justify-center relative">
          <QrCode size={130} strokeWidth={1} className="text-[#111111]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-md border border-black/5 text-xl">🐕</div>
        </div>
        <p className="text-[15px] font-medium text-[#111111] text-center max-w-[220px]">
          Scan to access {data.pet.name}'s emergency information
        </p>
      </div>

      <div className="relative">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-black/[0.08]" /></div>
        <div className="relative flex justify-center"><span className="bg-[#F6F6F6] px-4 text-[12px] text-[#8E8E93] uppercase tracking-wider font-semibold">Or share link</span></div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <label className="text-[13px] font-semibold text-[#8E8E93] uppercase tracking-wider">Share Link</label>
          <div className="flex items-center gap-1 text-[13px] font-medium text-[#111111] bg-white px-2.5 py-1 rounded-full border border-black/[0.04] shadow-sm">
            Expires: <span className="text-[#FF6B35]">7 days</span> <ChevronDown size={14} className="text-[#8E8E93]" />
          </div>
        </div>
        <div className="flex items-center justify-between bg-white border border-black/[0.04] p-4 rounded-[16px] shadow-sm">
          <span className="text-[15px] font-mono text-[#111111] truncate mr-4 select-all">{data.emergencyBundle.shareLink}</span>
          <button onClick={onCopy} className="w-10 h-10 rounded-full bg-[#F6F6F6] flex items-center justify-center shrink-0 active:scale-95 text-[#111111]">
            <Copy size={16} />
          </button>
        </div>
      </div>
      <Button variant="primary" icon={Share2} onClick={() => alert('Opening native share sheet...')}>Share Link...</Button>
    </div>
  </BottomSheet>
);

const VaultOptionsSheet = ({ isOpen, onClose }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title="Vault Options">
    <div className="space-y-2 pt-2 pb-4">
      {[ { label: 'Export all data', icon: DownloadCloud }, { label: 'Print emergency bundle', icon: FileText }, { label: 'Share vault access', icon: Share2 } ].map((item, i) => (
        <button key={i} className="w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm">
          <item.icon size={20} className="text-[#111111]" strokeWidth={1.5} />
          <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
        </button>
      ))}
      <Divider spacing="medium" />
      {[ { label: 'Privacy settings', icon: Lock }, { label: 'Backup settings', icon: Cloud } ].map((item, i) => (
        <button key={i} className="w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm">
          <item.icon size={20} className="text-[#6E6E73]" strokeWidth={1.5} />
          <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
        </button>
      ))}
    </div>
  </BottomSheet>
);

// --- APP SHELL (MAIN ENTRY POINT) ---
const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none">
    {/* Tab Bar uses translucent backdrop-blur to blend in softly */}
    <div className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/40 shadow-[0_8px_32px_rgba(0,0,0,0.06)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
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

export default function App() {
  const [activeTab, setActiveTab] = useState('vault');
  const [displayTab, setDisplayTab] = useState('vault');
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(timer); }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return; 
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => { setDisplayTab(tabId); setIsFading(false); }, 150);
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
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading...</p>
          </div>
        ) : (
          <div id="main-app-wrapper" className="absolute inset-0 w-full h-full bg-[#F6F6F6] origin-top">
            <main className={`absolute inset-0 w-full h-full transition-opacity duration-200 ease-in-out ${isFading ? 'opacity-0' : 'opacity-100'}`}>
              {displayTab === 'vault' ? <VaultScreen /> : (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-[14px] font-medium text-[#8E8E93]">View {displayTab} screen.</span>
                </div>
              )}
            </main>
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}