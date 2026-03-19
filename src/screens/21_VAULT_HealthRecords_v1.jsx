import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Home, PawPrint, Calendar, Activity, Folder, Search, Bell, ChevronLeft, ChevronRight,
  MoreHorizontal, X, CheckCircle2, AlertCircle, AlertTriangle, Info, Loader2,
  ChevronDown, Settings, Star, Share2, FileDown, Stethoscope, FileText, Phone,
  MapPin, Pill, ShieldAlert, Syringe, Fingerprint, QrCode, Copy, Cloud, Lock,
  DownloadCloud, Link as LinkIcon, ArrowLeft, Printer, Mail, History, LineChart, Edit3, XCircle, Plus
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

const TABS = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'pets', label: 'Pets', icon: PawPrint },
  { id: 'services', label: 'Services', icon: Calendar },
  { id: 'activity', label: 'Activity', icon: Activity },
  { id: 'vault', label: 'Vault', icon: Folder },
];

// --- MOCK HEALTH DATA ---
const mockVaultHealthData = {
  pet: {
    id: 'pet_001',
    name: 'Luna',
    breed: 'Golden Retriever',
    age: 3,
    photo: 'url'
  },
  
  summary: {
    lastVetVisit: {
      id: 'visit_001',
      date: '2026-01-10',
      reason: 'Annual Checkup',
      vet: 'Dr. Sarah Schmidt',
      clinic: 'Tierarzt Zürich Zentrum'
    },
    currentWeight: {
      value: 28,
      unit: 'kg',
      status: 'healthy',
      idealRange: { min: 26, max: 29 }
    },
    activeMedicationsCount: 2,
    allergiesCount: 3,
    severeAllergiesCount: 1
  },
  
  vaccinations: [
    {
      id: 'vac_001',
      name: 'Rabies',
      givenDate: '2023-12-15',
      nextDue: '2026-12-15',
      status: 'valid',
      daysUntilExpiry: 297,
      clinic: 'Vet Clinic Zurich'
    },
    {
      id: 'vac_002',
      name: 'DHPP',
      givenDate: '2025-03-02',
      nextDue: '2026-03-02',
      status: 'expiring',
      daysUntilExpiry: 8,
      clinic: 'Vet Clinic Zurich'
    },
    {
      id: 'vac_003',
      name: 'Bordetella',
      givenDate: '2025-08-15',
      nextDue: '2026-08-15',
      status: 'valid',
      daysUntilExpiry: 175,
      clinic: 'Vet Clinic Zurich'
    }
  ],
  
  medications: {
    active: [
      {
        id: 'med_001',
        name: 'Apoquel',
        purpose: 'Allergy management',
        dosage: '16mg',
        frequency: 'Daily',
        startDate: '2025-01-15',
        nextDose: null
      },
      {
        id: 'med_002',
        name: 'NexGard Spectra',
        purpose: 'Flea & Tick prevention',
        dosage: '1 chewable',
        frequency: 'Monthly',
        startDate: '2025-02-01',
        nextDose: '2026-03-01'
      }
    ],
    past: [
      {
        id: 'med_003',
        name: 'Rimadyl',
        purpose: 'Pain relief',
        dosage: '25mg',
        frequency: 'Twice daily',
        startDate: '2025-08-22',
        endDate: '2025-08-27'
      }
    ]
  },
  
  allergies: [
    {
      id: 'allergy_001',
      allergen: 'Bee Stings',
      severity: 'severe',
      reaction: 'Anaphylaxis',
      diagnosedDate: '2023-06-10'
    },
    {
      id: 'allergy_002',
      allergen: 'Chicken',
      severity: 'moderate',
      reaction: 'Digestive issues',
      diagnosedDate: '2024-03-15'
    },
    {
      id: 'allergy_003',
      allergen: 'Dust Mites',
      severity: 'mild',
      reaction: 'Sneezing',
      diagnosedDate: '2024-01-20'
    }
  ],
  
  vetVisits: [
    {
      id: 'visit_001',
      date: '2026-01-10',
      reason: 'Annual Checkup',
      vet: 'Dr. Sarah Schmidt',
      clinic: 'Tierarzt Zürich Zentrum',
      notes: 'Everything looks good. Weight stable.',
      prescriptions: [],
      cost: 120
    },
    {
      id: 'visit_002',
      date: '2025-08-22',
      reason: 'Limping front right leg',
      vet: 'Dr. Sarah Schmidt',
      clinic: 'Tierarzt Zürich Zentrum',
      notes: 'Mild strain. Prescribed Rimadyl for 5 days.',
      prescriptions: ['Rimadyl 25mg'],
      cost: 85
    }
  ],
  
  weightHistory: [
    { date: '2026-02-15', weight: 28 },
    { date: '2026-01-15', weight: 28.5 },
    { date: '2025-12-15', weight: 27 },
    { date: '2025-11-15', weight: 27.5 },
    { date: '2025-10-15', weight: 28 },
    { date: '2025-09-15', weight: 27 }
  ],
  
  medicalConditions: []
};

// --- DESIGN SYSTEM COMPONENTS ---
const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-2', medium: 'my-4', large: 'my-6' };
  return <div className={`w-full h-[0.5px] bg-[#ECECEC] ${spacings[spacing]} ${className}`} />;
};

const Badge = ({ variant = 'default', children, className = '' }) => {
  const variants = {
    default: "bg-[#F5F5F5] text-[#7A7A7A]",
    success: "bg-[#E8F6ED] text-[#2E8B57]", // Soft green
    warning: "bg-[#FEF5E7] text-[#D9822B]", // Soft amber
    error: "bg-[#FDECEA] text-[#D9534F]",   // Soft coral
  };
  return (
    <span className={`inline-flex items-center text-[11px] font-medium rounded-[6px] px-2 py-0.5 uppercase tracking-wide leading-none ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
};

const Button = ({ children, variant = 'primary', fullWidth = true, icon: Icon, isLoading, className = '', ...props }) => {
  const baseStyles = "relative flex items-center justify-center rounded-[10px] font-medium transition-all duration-200 active:scale-[0.98] overflow-hidden gap-2 px-4 py-[10px] text-[14px]";
  const variants = {
    primary: "bg-[#E85D2A] text-white shadow-[0_2px_4px_rgba(232,93,42,0.15)] hover:bg-[#D45426]", 
    secondary: "bg-transparent text-[#E85D2A] border-[0.5px] border-[#ECECEC] hover:bg-black/[0.02]",
    ghost: "bg-transparent text-[#7A7A7A] hover:bg-black/[0.02]",
  };
  return (
    <button disabled={isLoading} className={`${baseStyles} ${variants[variant]} ${fullWidth ? "w-full" : "w-auto"} ${isLoading ? "opacity-70" : ""} ${className}`} {...props}>
      {isLoading ? <Loader2 size={16} className="animate-spin" /> : <> {Icon && <Icon size={16} />} {children} </>}
    </button>
  );
};

const Card = ({ children, className = '', clickable, ...props }) => {
  const interactive = clickable ? "cursor-pointer active:scale-[0.99] active:bg-black/[0.01]" : "";
  return (
    <div className={`bg-white border border-[#ECECEC] shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-[12px] transition-all duration-200 ${interactive} ${className}`} {...props}>
      {children}
    </div>
  );
};

const SectionHeader = ({ title, rightElement }) => (
  <div className="flex items-center justify-between mb-3 px-1">
    <h3 className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.8px]">{title}</h3>
    {rightElement && <div>{rightElement}</div>}
  </div>
);

const Toast = ({ message, isVisible }) => (
  <div className={`fixed bottom-[110px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3 rounded-full flex items-center gap-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.15)] transition-all duration-300 z-[120] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
    <CheckCircle2 size={16} className="text-[#34C759]" />
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

  useEffect(() => { 
    setPortalNode(document.getElementById('modal-root')); 
  }, []);

  useEffect(() => {
    const mainEl = document.getElementById('main-app-wrapper');
    if (isOpen && mainEl) {
      mainEl.style.transform = 'scale(0.96) translateY(8px)';
      mainEl.style.borderRadius = '24px';
      mainEl.style.overflow = 'hidden';
      mainEl.style.filter = 'brightness(0.9)';
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
      <div className={`absolute inset-0 bg-black/20 backdrop-blur-[2px] transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#FBFBFB] rounded-t-[24px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-3 pb-2 cursor-grab touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-10 h-1 bg-black/10 rounded-full" />
        </div>
        <div className="px-5 pb-4 flex items-center justify-between shrink-0">
          <h3 className="text-[18px] font-semibold text-[#111111]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-black/5 rounded-full active:scale-95 transition-transform">
            <X size={16} className="text-[#7A7A7A]" />
          </button>
        </div>
        <div className="px-5 pb-6 overflow-y-auto custom-scrollbar flex-1">{children}</div>
      </div>
    </div>,
    portalNode
  );
};


// --- HEALTH RECORDS DASHBOARD ---

const WeightChart = ({ history }) => {
  const data = [...history].reverse();
  const minW = 25;
  const maxW = 30;
  
  const getY = (w) => 100 - ((w - minW) / (maxW - minW)) * 100;
  const getX = (i) => (i / (data.length - 1)) * 100;
  
  const points = data.map((d, i) => `${getX(i)},${getY(d.weight)}`).join(' ');

  return (
    <div className="w-full h-[100px] relative mt-6 mb-4">
      <svg className="w-full h-full overflow-visible" preserveAspectRatio="none">
        {/* Ideal range subtle background */}
        <rect x="0" y={`${getY(29)}%`} width="100%" height={`${getY(26) - getY(29)}%`} fill="#E8F6ED" opacity="0.6" />
        
        {/* Subtle grid lines */}
        <line x1="0" y1={`${getY(29)}%`} x2="100%" y2={`${getY(29)}%`} stroke="#A1C9A8" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
        <line x1="0" y1={`${getY(26)}%`} x2="100%" y2={`${getY(26)}%`} stroke="#A1C9A8" strokeWidth="0.5" strokeDasharray="3 3" opacity="0.8" />
        
        {/* Main data line */}
        <polyline points={points} fill="none" stroke="#E85D2A" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round" />
        
        {/* Data points */}
        {data.map((d, i) => (
          <circle key={i} cx={`${getX(i)}%`} cy={`${getY(d.weight)}%`} r="3" fill="#FFFFFF" stroke="#E85D2A" strokeWidth="1.5" />
        ))}
      </svg>
    </div>
  );
};

const VaultHealthScreen = () => {
  const data = mockVaultHealthData;
  const [isExporting, setIsExporting] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => { 
    setToastMsg(msg); 
    setTimeout(() => setToastMsg(''), 3000); 
  };

  const handleExport = async (format) => {
    setIsExporting(true);
    showToast(`Generating ${format}...`);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsExporting(false);
    showToast(`✓ Health ${format} downloaded`);
  };

  const handleAction = (action) => {
    showToast(`Action: ${action}`);
  };

  return (
    <div className="absolute inset-0 z-20 bg-[#F6F6F6] overflow-hidden">

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            onClick={() => handleAction('Go Back')}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Health Records</h2>
          {/* Right: Menu button */}
          <button
            onClick={() => setMenuOpen(true)}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreHorizontal size={22} color="#111111" />
          </button>
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto custom-scrollbar pb-[140px] px-5" style={{ paddingTop: 54, zIndex: 0 }}>

      {/* PET INFO */}
      <div className="flex items-center gap-2 mb-6 px-1">
        <span className="text-[18px]">🐕</span>
        <span className="text-[15px] font-medium text-[#111111]">{data.pet.name} <span className="text-[#7A7A7A] font-normal">· {data.pet.breed}</span></span>
      </div>

      {/* HEALTH SUMMARY */}
      <div className="mb-6">
        <SectionHeader title="Health Summary" />
        <Card className="p-5 mb-4">
          <div className="grid grid-cols-2 gap-x-4 gap-y-5">
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Last Vet Visit</div>
              <div className="text-[15px] font-semibold text-[#111111]">{new Date(data.summary.lastVetVisit.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
              <div className="text-[13px] text-[#7A7A7A] mt-0.5">{data.summary.lastVetVisit.reason}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Current Weight</div>
              <div className="text-[15px] font-semibold text-[#111111]">{data.summary.currentWeight.value} {data.summary.currentWeight.unit}</div>
              <div className="text-[13px] font-medium text-[#2E8B57] mt-0.5">Healthy ({data.summary.currentWeight.idealRange.min}-{data.summary.currentWeight.idealRange.max})</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Active Medications</div>
              <div className="text-[15px] font-semibold text-[#111111]">{data.summary.activeMedicationsCount}</div>
            </div>
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-1">Allergies</div>
              <div className="text-[15px] font-semibold text-[#111111]">
                {data.summary.allergiesCount} {data.summary.severeAllergiesCount > 0 && <span className="text-[#D9534F] font-medium text-[13px]">({data.summary.severeAllergiesCount} Severe)</span>}
              </div>
            </div>
          </div>
        </Card>
        <div className="flex flex-col gap-2.5">
          <Button variant="primary" isLoading={isExporting} onClick={() => handleExport('summary')}>Export Health Summary</Button>
          <Button variant="secondary" onClick={() => handleAction('Share with Vet')}>Share με Vet</Button>
        </div>
      </div>

      {/* VACCINATIONS */}
      <div className="mb-6">
        <SectionHeader 
          title="Vaccinations Status" 
          rightElement={<CheckCircle2 size={14} className="text-black/20" />} 
        />
        <Card className="!p-0 overflow-hidden">
          {data.vaccinations.map((vac, i) => {
            const isExpiring = vac.status === 'expiring';
            const isOverdue = vac.status === 'overdue';
            const Icon = isOverdue ? XCircle : (isExpiring ? AlertTriangle : CheckCircle2);

            return (
              <div key={vac.id} className="relative p-4 flex items-start gap-3 border-b-[0.5px] border-[#ECECEC] last:border-0 bg-white">
                {isExpiring && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D9822B]" />}
                {isOverdue && <div className="absolute left-0 top-0 bottom-0 w-[3px] bg-[#D9534F]" />}
                
                <Icon size={18} className={`mt-[2px] ${isOverdue ? 'text-[#D9534F]' : (isExpiring ? 'text-[#D9822B]' : 'text-black/20')} shrink-0`} />
                
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{vac.name}</div>
                  <div className={`text-[13px] ${isExpiring || isOverdue ? 'text-[#111111] font-medium' : 'text-[#7A7A7A]'}`}>
                    {isOverdue ? 'Expired' : (isExpiring ? `Expires in ${vac.daysUntilExpiry} days` : `Valid until ${new Date(vac.nextDue).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}`)}
                  </div>
                  {isExpiring && <div className="text-[13px] text-[#D9822B] mt-0.5">Schedule appointment!</div>}
                  {!isExpiring && !isOverdue && <div className="text-[12px] text-[#7A7A7A] mt-0.5 opacity-80">({vac.daysUntilExpiry} days)</div>}
                </div>
              </div>
            );
          })}
        </Card>
      </div>

      {/* MEDICATIONS */}
      <div className="mb-6">
        <SectionHeader title="Medications" />
        <Card className="!p-0 overflow-hidden">
          {data.medications.active.map((med, i) => (
            <div key={med.id} className="p-4 border-b-[0.5px] border-[#ECECEC] last:border-0">
              <div className="flex items-start gap-3">
                <Pill size={16} className="text-black/20 mt-[3px] shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[15px] font-semibold text-[#111111] mb-1">{med.name}</div>
                  <div className="text-[14px] text-[#111111] mb-1">{med.dosage} · {med.frequency}</div>
                  {med.nextDose ? (
                    <div className="text-[13px] font-medium text-[#E85D2A]">Next dose: {new Date(med.nextDose).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                  ) : (
                    <div className="text-[13px] text-[#7A7A7A]">Started: {new Date(med.startDate).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</div>
                  )}
                </div>
              </div>
            </div>
          ))}
          <button className="w-full py-3 text-[13px] font-medium text-[#7A7A7A] hover:text-[#111111] hover:bg-black/[0.02] transition-colors border-t-[0.5px] border-[#ECECEC]" onClick={() => handleAction('View Medication History')}>
            View Medication History →
          </button>
        </Card>
      </div>

      {/* ALLERGIES */}
      <div className="mb-6">
        <SectionHeader title="Allergies & Sensitivities" />
        <Card className="!p-0 overflow-hidden">
          {data.allergies.map((allergy, i) => (
            <div key={allergy.id} className="p-4 flex items-start justify-between border-b-[0.5px] border-[#ECECEC] last:border-0">
              <div className="pr-4">
                <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{allergy.allergen}</div>
                <div className="text-[13px] text-[#7A7A7A]">Reaction: {allergy.reaction}</div>
              </div>
              <div className="shrink-0 pt-0.5">
                <Badge variant={allergy.severity === 'severe' ? 'error' : allergy.severity === 'moderate' ? 'warning' : 'success'}>{allergy.severity}</Badge>
              </div>
            </div>
          ))}
        </Card>
      </div>

      {/* VET VISITS */}
      <div className="mb-6">
        <SectionHeader title="Vet Visit History" />
        <Card className="!p-0 overflow-hidden">
          <div className="pt-2">
            {data.vetVisits.map((visit, i) => (
              <div key={visit.id} className="relative pl-7 pr-4 py-3 border-b-[0.5px] border-[#ECECEC] last:border-0">
                {/* Timeline Dot & Line */}
                <div className="absolute left-[16px] top-[20px] w-1.5 h-1.5 rounded-full bg-[#A1C9A8] z-10 ring-[3px] ring-white" />
                {i < data.vetVisits.length - 1 && <div className="absolute left-[18.5px] top-[28px] bottom-[-12px] w-[0.5px] bg-[#ECECEC]" />}
                
                <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{visit.reason}</div>
                <div className="text-[14px] text-[#111111] mb-0.5">{new Date(visit.date).toLocaleDateString('en-US', {month: 'short', day: 'numeric', year: 'numeric'})}</div>
                <div className="text-[13px] text-[#7A7A7A] mb-2">{visit.vet}</div>
                
                <button onClick={() => handleAction('View Visit Details')} className="text-[13px] font-medium text-[#E85D2A]/90">
                  View Details →
                </button>
              </div>
            ))}
          </div>
          <button className="w-full py-3 text-[13px] font-medium text-[#7A7A7A] hover:text-[#111111] hover:bg-black/[0.02] transition-colors" onClick={() => handleAction('View All Visits')}>
            View All Visits (8) →
          </button>
        </Card>
      </div>

      {/* WEIGHT TRACKER */}
      <div className="mb-6">
        <SectionHeader title="Weight Tracker" />
        <Card className="p-5">
          <div className="flex items-end justify-between mb-2">
            <div>
              <div className="text-[13px] text-[#7A7A7A] mb-0.5">Current Weight</div>
              <div className="text-[20px] font-semibold text-[#111111] leading-none">{data.summary.currentWeight.value} <span className="text-[14px] text-[#7A7A7A] font-medium">{data.summary.currentWeight.unit}</span></div>
            </div>
            <div className="text-right">
              <div className="text-[13px] text-[#7A7A7A] mb-0.5">Target</div>
              <div className="text-[14px] font-medium text-[#111111]">{data.summary.currentWeight.idealRange.min}-{data.summary.currentWeight.idealRange.max} {data.summary.currentWeight.unit}</div>
            </div>
          </div>
          
          <WeightChart history={data.weightHistory} />
          
          <div className="text-[12px] font-medium text-[#7A7A7A] uppercase tracking-[0.8px] mt-6 mb-3">Last 6 months</div>
          <div className="space-y-3 mb-4">
            {data.weightHistory.map((w, i) => (
              <div key={i} className="flex justify-between items-center">
                <span className="text-[14px] text-[#111111]">{new Date(w.date).toLocaleDateString('en-US', {month: 'short', year: 'numeric'})}</span>
                <span className="text-[14px] font-medium text-[#111111]">{w.weight} kg</span>
              </div>
            ))}
          </div>
          
          <div className="pt-3 border-t-[0.5px] border-[#ECECEC] mt-2">
            <button className="text-[13px] font-medium text-[#7A7A7A] hover:text-[#111111] transition-colors" onClick={() => handleAction('View Full History')}>
              View Full History →
            </button>
          </div>
        </Card>
      </div>

      {/* MEDICAL CONDITIONS */}
      <div className="mb-6">
        <SectionHeader title="Medical Conditions" />
        <Card className="p-4">
          {data.medicalConditions.length === 0 ? (
            <div className="text-[14px] text-[#7A7A7A]">No ongoing conditions</div>
          ) : (
            data.medicalConditions.map(cond => (
              <div key={cond.id} className="mb-3 last:mb-0">
                <div className="text-[15px] font-semibold text-[#111111] mb-0.5">{cond.name}</div>
                <div className="text-[13px] text-[#7A7A7A]">Diagnosed: {cond.diagnosedDate}</div>
              </div>
            ))
          )}
        </Card>
      </div>

      {/* QUICK ACTIONS */}
      <div className="mb-8">
        <SectionHeader title="Quick Actions" />
        <Card className="!p-0 overflow-hidden">
          {[
            { icon: DownloadCloud, label: 'Export complete record', action: 'record' },
            { icon: Printer, label: 'Print health summary', action: 'print' },
            { icon: Mail, label: 'Email to vet', action: 'email' },
            { icon: Share2, label: 'Share με caretaker', action: 'share' }
          ].map((item, index) => (
            <button key={index} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-black/[0.02] transition-colors text-left active:scale-[0.99] border-b-[0.5px] border-[#ECECEC] last:border-0" onClick={() => handleExport(item.action)}>
              <item.icon size={18} className="text-[#7A7A7A]" strokeWidth={1.5} />
              <span className="text-[15px] text-[#111111] flex-1">{item.label}</span>
            </button>
          ))}
        </Card>
      </div>

      </div>

      {/* BOTTOM SHEET FOR MENU */}
      <BottomSheet isOpen={menuOpen} onClose={() => setMenuOpen(false)} title="Health Options">
        <div className="space-y-2 pt-2 pb-4">
          {[ 
            { label: 'Export health records', icon: DownloadCloud }, 
            { label: 'Print summary', icon: Printer }, 
            { label: 'Email to vet', icon: Mail } 
          ].map((item, i) => (
            <button key={i} onClick={() => { setMenuOpen(false); handleExport(item.label); }} className="w-full flex items-center gap-3 p-4 bg-white border border-[#ECECEC] hover:bg-black/[0.02] rounded-[12px] transition-colors active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <item.icon size={18} className="text-[#111111]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
            </button>
          ))}
          <Divider spacing="medium" />
          {[ 
            { label: 'Edit health data', icon: Edit3 }, 
            { label: 'Add new record', icon: Plus } 
          ].map((item, i) => (
            <button key={i} onClick={() => { setMenuOpen(false); handleAction(item.label); }} className="w-full flex items-center gap-3 p-4 bg-white border border-[#ECECEC] hover:bg-black/[0.02] rounded-[12px] transition-colors active:scale-[0.98] shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
              <item.icon size={18} className="text-[#7A7A7A]" strokeWidth={1.5} />
              <span className="text-[15px] font-medium text-[#111111]">{item.label}</span>
            </button>
          ))}
        </div>
      </BottomSheet>

      {/* TOAST COMPONENT IN ROOT */}
      <Toast message={toastMsg} isVisible={!!toastMsg} />
    </div>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---
const TabBar = ({ activeTab, onTabChange }) => (
  <nav className="absolute bottom-[24px] left-0 w-full px-5 z-40 pointer-events-none">
    <div className="pointer-events-auto bg-white/70 backdrop-blur-xl border border-white/60 shadow-[0_4px_24px_rgba(0,0,0,0.06)] rounded-[9999px] h-[72px] flex justify-between items-center px-2">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button key={tab.id} onClick={() => onTabChange(tab.id)} className="relative flex-1 h-full flex flex-col items-center justify-center gap-[4px] group">
            <div className={`absolute top-[12px] w-[32px] h-[32px] bg-[#E85D2A] rounded-full blur-[12px] transition-opacity duration-[240ms] pointer-events-none ${isActive ? 'opacity-20' : 'opacity-0'}`} />
            <div className={`relative z-10 flex items-center justify-center transition-colors duration-[240ms] ${isActive ? 'text-[#E85D2A] animate-spring-bump' : 'text-[#7A7A7A]'}`}>
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
            </div>
            <span className={`text-[11px] font-medium leading-none transition-colors duration-[240ms] ${isActive ? 'text-[#E85D2A]' : 'text-[#7A7A7A]'}`}>
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
  const [isFading, setIsFading] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 800); return () => clearTimeout(timer); }, []);

  const handleTabChange = (tabId) => {
    if (tabId === activeTab) return; 
    setActiveTab(tabId);
    setIsFading(true);
    setTimeout(() => { setIsFading(false); }, 150);
  };

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#E85D2A]/20 selection:text-[#E85D2A]">
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
              {activeTab === 'vault' ? <VaultHealthScreen /> : (
                <div className="flex flex-col items-center justify-center h-full">
                  <span className="text-[14px] font-medium text-[#7A7A7A]">View {activeTab} screen.</span>
                </div>
              )}
            </main>
            
            {/* Fade Out Background for TabBar */}
            <div className="fixed bottom-0 left-0 right-0 h-[120px] bg-gradient-to-t from-[#F6F6F6] via-[#F6F6F6]/95 to-transparent pointer-events-none z-10 rounded-b-[40px]" />
            <TabBar activeTab={activeTab} onTabChange={handleTabChange} />
          </div>
        )}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}