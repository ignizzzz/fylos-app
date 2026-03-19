import React, { useState, useRef } from 'react';
import {
  ChevronLeft,
  Camera,
  Calendar,
  Heart,
  PawPrint,
  Info,
  AlertTriangle,
  Check,
  X,
  Star
} from 'lucide-react';

/**
 * 38_EDIT_PET_v1.jsx
 * Edit Pet screen — Fylos design system
 */

// --- FYLOS LOGO ---
const FylosLogo = ({
  textColor = '#000000',
  dotColor = '#E85D2A',
  fontSize = '2rem',
  className = ''
}) => (
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
    <span style={{ fontSize, fontWeight: 800, color: textColor, letterSpacing: '-0.5px', lineHeight: 1 }}>
      FYLOS
    </span>
    <div style={{ width: `calc(${fontSize} * 0.25)`, height: `calc(${fontSize} * 0.25)`, borderRadius: '50%', backgroundColor: dotColor }} />
  </div>
);

// --- THEME ---
const THEME = {
  colors: {
    accent: '#E85D2A',
    accentHover: '#D04A1C',
    primaryText: '#111111',
    secondaryText: '#6E6E73',
    tertiaryText: '#8E8E93',
    background: '#F9F9FB',
    surface: '#FFFFFF',
    surfaceAlt: '#F2F2F7',
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)'
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)'
  }
};

// --- GLOBAL STYLES ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    .ep-font-brand { font-family: 'Nunito', sans-serif; }
    .ep-font-body  { font-family: 'Inter', sans-serif; }

    @keyframes ep-fadeIn  { from { opacity: 0; } to { opacity: 1; } }
    @keyframes ep-slideUp { from { transform: translateY(16px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

    .ep-fade  { animation: ep-fadeIn 0.3s ease-out forwards; }
    .ep-slide { animation: ep-slideUp 0.35s cubic-bezier(0.2,0.8,0.2,1) forwards; }

    .ep-input {
      transition: border-color ${THEME.motion.fade} ease, box-shadow ${THEME.motion.fade} ease;
    }
    .ep-input:focus {
      outline: none;
      border-color: ${THEME.colors.accent} !important;
      box-shadow: 0 0 0 3px rgba(232,93,42,0.10);
    }

    .ep-btn { transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease; }
    .ep-btn:active { transform: scale(0.97); }

    .ep-scroll::-webkit-scrollbar { display: none; }
    .ep-scroll { -ms-overflow-style: none; scrollbar-width: none; }

    .ep-save-btn {
      background: linear-gradient(135deg, #FF7240, #E85D2A);
      transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease;
    }
    .ep-save-btn:active { transform: scale(0.97); }

    .ep-toast-in {
      animation: ep-toastIn 0.3s cubic-bezier(0.2,0.8,0.2,1) forwards;
    }
    .ep-toast-out {
      animation: ep-toastOut 0.25s ease-in forwards;
    }
    @keyframes ep-toastIn {
      from { transform: translateY(20px) scale(0.95); opacity: 0; }
      to   { transform: translateY(0) scale(1); opacity: 1; }
    }
    @keyframes ep-toastOut {
      from { transform: translateY(0) scale(1); opacity: 1; }
      to   { transform: translateY(-20px) scale(0.95); opacity: 0; }
    }
  `}</style>
);

// --- MOCK PET DATA ---
const ORIGINAL_PET = {
  name: 'Luna',
  breed: 'Golden Retriever',
  birthdate: '2021-04-12',
  gender: 'Female',
  weight: '28',
  neutered: true,
  allergies: 'None known',
  microchip: '981020000394857',
  insurance: 'PetPlan Gold #PP-29481',
  photo: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&h=300&fit=crop'
};

// --- SECTION CARD ---
const SectionCard = ({ title, icon: Icon, children, delay = 0 }) => (
  <div
    className="ep-slide"
    style={{
      background: THEME.colors.surface,
      borderRadius: '20px',
      padding: '20px',
      boxShadow: THEME.shadows.soft,
      border: '1px solid rgba(0,0,0,0.03)',
      animationDelay: `${delay}ms`,
      opacity: 0
    }}
  >
    {title && (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
        {Icon && <Icon size={18} color={THEME.colors.accent} strokeWidth={2} />}
        <span
          className="ep-font-body"
          style={{ fontSize: 15, fontWeight: 600, color: THEME.colors.primaryText, letterSpacing: '-0.2px' }}
        >
          {title}
        </span>
      </div>
    )}
    {children}
  </div>
);

// --- FORM INPUT ---
const FormInput = ({ label, value, onChange, placeholder, type = 'text', suffix }) => (
  <div style={{ marginBottom: 12 }}>
    <label className="ep-font-body" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText, marginBottom: 6 }}>
      {label}
    </label>
    <div style={{ position: 'relative' }}>
      <input
        className="ep-input ep-font-body"
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', height: 52, borderRadius: 16,
          border: '1px solid rgba(0,0,0,0.08)', padding: '0 16px',
          paddingRight: suffix ? 48 : 16, fontSize: 15,
          color: THEME.colors.primaryText, background: THEME.colors.surface,
          boxSizing: 'border-box'
        }}
      />
      {suffix && (
        <span className="ep-font-body" style={{ position: 'absolute', right: 16, top: '50%', transform: 'translateY(-50%)', fontSize: 13, color: THEME.colors.tertiaryText, fontWeight: 500 }}>
          {suffix}
        </span>
      )}
    </div>
  </div>
);

// --- FORM TEXTAREA ---
const FormTextarea = ({ label, value, onChange, placeholder, rows = 3 }) => (
  <div style={{ marginBottom: 12 }}>
    <label className="ep-font-body" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText, marginBottom: 6 }}>
      {label}
    </label>
    <textarea
      className="ep-input ep-font-body"
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%', borderRadius: 16, border: '1px solid rgba(0,0,0,0.08)',
        padding: '14px 16px', fontSize: 15, color: THEME.colors.primaryText,
        background: THEME.colors.surface, boxSizing: 'border-box', resize: 'none', lineHeight: 1.5
      }}
    />
  </div>
);

// --- GENDER TOGGLE ---
const GenderToggle = ({ value, onChange }) => {
  const options = ['Male', 'Female'];
  return (
    <div style={{ marginBottom: 12 }}>
      <label className="ep-font-body" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText, marginBottom: 6 }}>
        Gender
      </label>
      <div style={{ display: 'flex', gap: 8, background: THEME.colors.surfaceAlt, borderRadius: 16, padding: 4 }}>
        {options.map(opt => {
          const active = value === opt;
          return (
            <button
              key={opt}
              className="ep-btn ep-font-body"
              onClick={() => onChange(opt)}
              style={{
                flex: 1, height: 44, borderRadius: 12, border: 'none', cursor: 'pointer',
                fontSize: 15, fontWeight: active ? 600 : 400,
                color: active ? THEME.colors.surface : THEME.colors.secondaryText,
                background: active ? THEME.colors.accent : 'transparent',
                transition: `all ${THEME.motion.tab} ${THEME.motion.spring}`
              }}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// --- TOGGLE SWITCH ---
const ToggleSwitch = ({ label, value, onChange }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
    <span className="ep-font-body" style={{ fontSize: 15, color: THEME.colors.primaryText }}>{label}</span>
    <button
      className="ep-btn"
      onClick={() => onChange(!value)}
      style={{
        width: 51, height: 31, borderRadius: THEME.radius.full, border: 'none', cursor: 'pointer',
        background: value ? THEME.colors.accent : '#E5E5EA', padding: 2,
        display: 'flex', alignItems: 'center', transition: `background ${THEME.motion.fade} ease`
      }}
    >
      <div style={{
        width: 27, height: 27, borderRadius: '50%', background: THEME.colors.surface,
        boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
        transform: value ? 'translateX(20px)' : 'translateX(0)',
        transition: `transform ${THEME.motion.fade} ${THEME.motion.spring}`
      }} />
    </button>
  </div>
);

// --- TOAST ---
const Toast = ({ message, visible, type = 'success' }) => {
  if (!visible) return null;
  const bg = type === 'success' ? THEME.colors.success : THEME.colors.danger;
  const Ic = type === 'success' ? Check : AlertTriangle;
  return (
    <div className="ep-toast-in" style={{
      position: 'absolute', bottom: 50, left: '50%', transform: 'translateX(-50%)', zIndex: 100,
      display: 'flex', alignItems: 'center', gap: 8, background: bg, color: '#FFFFFF',
      padding: '10px 20px', borderRadius: THEME.radius.full, boxShadow: THEME.shadows.floating
    }}>
      <Ic size={16} strokeWidth={2.5} />
      <span className="ep-font-body" style={{ fontSize: 14, fontWeight: 600 }}>{message}</span>
    </div>
  );
};

// --- DELETE CONFIRMATION MODAL ---
const DeleteModal = ({ visible, onCancel, onConfirm }) => {
  if (!visible) return null;
  return (
    <div className="ep-fade" style={{
      position: 'absolute', inset: 0, zIndex: 90,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.35)', borderRadius: 50
    }}>
      <div className="ep-slide" style={{
        background: THEME.colors.surface, borderRadius: 20, padding: 24, width: 300,
        boxShadow: THEME.shadows.floating, textAlign: 'center'
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: THEME.radius.full, background: 'rgba(255,59,48,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <AlertTriangle size={22} color={THEME.colors.danger} strokeWidth={2} />
        </div>
        <h3 className="ep-font-body" style={{ fontSize: 17, fontWeight: 600, color: THEME.colors.primaryText, margin: '0 0 8px', letterSpacing: '-0.2px' }}>
          Delete Pet Profile?
        </h3>
        <p className="ep-font-body" style={{ fontSize: 14, color: THEME.colors.secondaryText, margin: '0 0 24px', lineHeight: 1.5 }}>
          This action cannot be undone. All data associated with Luna will be permanently removed.
        </p>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="ep-btn ep-font-body" onClick={onCancel} style={{
            flex: 1, height: 48, borderRadius: 14, border: '1px solid rgba(0,0,0,0.08)',
            background: THEME.colors.surface, color: THEME.colors.primaryText, fontSize: 15, fontWeight: 600, cursor: 'pointer'
          }}>
            Cancel
          </button>
          <button className="ep-btn ep-font-body" onClick={onConfirm} style={{
            flex: 1, height: 48, borderRadius: 14, border: 'none',
            background: THEME.colors.danger, color: '#FFFFFF', fontSize: 15, fontWeight: 600, cursor: 'pointer'
          }}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================
// MAIN COMPONENT
// ============================
export default function Screen_38_EDIT_PET_v1() {
  const [name, setName] = useState(ORIGINAL_PET.name);
  const [breed, setBreed] = useState(ORIGINAL_PET.breed);
  const [birthdate, setBirthdate] = useState(ORIGINAL_PET.birthdate);
  const [gender, setGender] = useState(ORIGINAL_PET.gender);
  const [weight, setWeight] = useState(ORIGINAL_PET.weight);
  const [neutered, setNeutered] = useState(ORIGINAL_PET.neutered);
  const [allergies, setAllergies] = useState(ORIGINAL_PET.allergies);
  const [microchip, setMicrochip] = useState(ORIGINAL_PET.microchip);
  const [insurance, setInsurance] = useState(ORIGINAL_PET.insurance);

  const [toast, setToast] = useState(null);
  const [showDelete, setShowDelete] = useState(false);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2200);
  };

  const handleSave = () => {
    if (!name.trim()) { showToast('Name is required', 'error'); return; }
    showToast('Profile saved');
    setTimeout(() => { window.location.href = '/pet-profile'; }, 1200);
  };

  const handleDelete = () => {
    setShowDelete(false);
    showToast('Pet removed', 'error');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
        fontFamily: "'Inter', sans-serif"
      }}>
        {/* Notch */}
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Home indicator */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

        {/* Status Bar */}
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="8" width="3" height="4" rx="0.5" fill="#111"/><rect x="4.5" y="5" width="3" height="7" rx="0.5" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="0.5" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="0.5" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 11.5a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" fill="#111"/><path d="M4.93 7.83a4.38 4.38 0 016.14 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/><path d="M2.4 5.3a7.88 7.88 0 0111.2 0" stroke="#111" strokeWidth="1.2" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="22" height="12" rx="2.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="19" height="9" rx="1.5" fill="#111"/><path d="M24 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="absolute inset-0 overflow-y-auto ep-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>
          {/* Spacer for floating header */}
          <div style={{ height: 44 }} />

          {/* CONTENT */}
          <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {/* PET PHOTO */}
            <div className="ep-slide" style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 4, opacity: 0, animationDelay: '0ms' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: 80, height: 80, borderRadius: THEME.radius.full, overflow: 'hidden', border: `3px solid ${THEME.colors.accent}`, boxShadow: THEME.shadows.soft }}>
                  <img src={ORIGINAL_PET.photo} alt={ORIGINAL_PET.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <button className="ep-btn" style={{
                  position: 'absolute', bottom: -2, right: -2, width: 28, height: 28,
                  borderRadius: THEME.radius.full, background: THEME.colors.accent,
                  border: `2px solid ${THEME.colors.surface}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer'
                }}>
                  <Camera size={13} color="#FFFFFF" strokeWidth={2.5} />
                </button>
              </div>
            </div>

            <SectionCard title="Basic Info" icon={PawPrint} delay={60}>
              <FormInput label="Name" value={name} onChange={setName} placeholder="Pet name" />
              <FormInput label="Breed" value={breed} onChange={setBreed} placeholder="Breed" />
              <FormInput label="Birthdate" value={birthdate} onChange={setBirthdate} placeholder="YYYY-MM-DD" type="date" />
              <GenderToggle value={gender} onChange={setGender} />
            </SectionCard>

            <SectionCard title="Health Details" icon={Heart} delay={120}>
              <FormInput label="Weight" value={weight} onChange={setWeight} placeholder="0" type="number" suffix="kg" />
              <ToggleSwitch label="Spayed / Neutered" value={neutered} onChange={setNeutered} />
              <FormTextarea label="Allergies" value={allergies} onChange={setAllergies} placeholder="List any known allergies..." />
            </SectionCard>

            <SectionCard title="Identification" icon={Info} delay={180}>
              <FormInput label="Microchip Number" value={microchip} onChange={setMicrochip} placeholder="Microchip ID" />
              <FormInput label="Insurance" value={insurance} onChange={setInsurance} placeholder="Insurance provider & policy" />
            </SectionCard>

            <div className="ep-slide" style={{ display: 'flex', justifyContent: 'center', paddingTop: 8, paddingBottom: 20, opacity: 0, animationDelay: '240ms' }}>
              <button className="ep-btn ep-font-body" onClick={() => setShowDelete(true)} style={{
                background: 'none', border: 'none', cursor: 'pointer', fontSize: 14, fontWeight: 500,
                color: THEME.colors.danger, padding: '8px 0', letterSpacing: '-0.1px'
              }}>
                Delete Pet Profile
              </button>
            </div>
          </div>
        </div>

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            {/* Left: Back button */}
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            {/* Center: Title */}
            <h2 className="text-[17px] font-semibold text-[#111111]">Edit Profile</h2>
            {/* Right: Save text button */}
            <button
              onClick={handleSave}
              className="h-[44px] px-4 flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms] text-[15px] font-semibold text-[#E85D2A]"
            >
              Save
            </button>
          </div>
        </header>

        {/* TOAST */}
        {toast && <Toast message={toast.message} visible={true} type={toast.type === 'error' ? 'danger' : 'success'} />}

        {/* DELETE MODAL */}
        <DeleteModal visible={showDelete} onCancel={() => setShowDelete(false)} onConfirm={handleDelete} />
      </div>
    </div>
  );
}
