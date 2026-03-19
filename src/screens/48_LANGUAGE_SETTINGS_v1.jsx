import React, { useState } from 'react';
import { ChevronLeft, Check, Globe } from 'lucide-react';

/**
 * 48_LANGUAGE_SETTINGS_v1.jsx
 * Language selection settings screen for the Fylos pet care app.
 */

// ─── THEME ────────────────────────────────────────────────────────────────────
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
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .lang-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .lang-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .lang-scroll::-webkit-scrollbar { display: none; }

    .lang-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .lang-tap:active { opacity: 0.7; transform: scale(0.97); }

    .lang-row {
      transition: background ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .lang-row:active { background: ${THEME.colors.surfaceAlt}; }

    @keyframes lang-check-pop {
      0%   { transform: scale(0); opacity: 0; }
      60%  { transform: scale(1.15); opacity: 1; }
      100% { transform: scale(1); opacity: 1; }
    }
    .lang-check-pop { animation: lang-check-pop 200ms ${THEME.motion.spring} forwards; }

    @keyframes lang-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .lang-fade-in { animation: lang-fade-in ${THEME.motion.fade} ease forwards; }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const LANGUAGES = [
  { id: 'de', flag: '\u{1F1E9}\u{1F1EA}', name: 'German', nativeName: 'Deutsch' },
  { id: 'en', flag: '\u{1F1EC}\u{1F1E7}', name: 'English', nativeName: 'English' },
  { id: 'fr', flag: '\u{1F1EB}\u{1F1F7}', name: 'French', nativeName: 'Fran\u00e7ais' },
  { id: 'it', flag: '\u{1F1EE}\u{1F1F9}', name: 'Italian', nativeName: 'Italiano' },
  { id: 'el', flag: '\u{1F1EC}\u{1F1F7}', name: 'Greek', nativeName: '\u0395\u03BB\u03BB\u03B7\u03BD\u03B9\u03BA\u03AC' },
];

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const LanguageSettingsScreen = () => {
  const [selectedLang, setSelectedLang] = useState('en');

  const handleSelect = (id) => {
    if (id !== selectedLang) setSelectedLang(id);
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#E5E5E5',
      padding: '20px',
      fontFamily: '"Inter", sans-serif',
    }}>
      <GlobalStyles />

      {/* iPhone Frame */}
      <div className="relative lang-screen" style={{
        width: 390,
        height: 844,
        borderRadius: 50,
        border: '8px solid #000',
        overflow: 'hidden',
        backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
      }}>

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

        {/* Floating Header */}
        <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
          <div className="flex justify-between items-center w-full pointer-events-auto">
            <button
              onClick={() => { window.history.back(); }}
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <ChevronLeft size={22} color="#111111" />
            </button>
            <h2 className="text-[17px] font-semibold text-[#111111]">Language</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="absolute inset-0 overflow-y-auto lang-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* Current Language Indicator */}
          <div style={{ padding: '0 20px 8px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '12px 16px',
              background: `${THEME.colors.accent}0A`,
              borderRadius: THEME.radius.small,
            }}>
              <Globe size={16} color={THEME.colors.accent} strokeWidth={2} />
              <span style={{
                fontSize: 13,
                fontWeight: 500,
                color: THEME.colors.secondaryText,
              }}>
                Current:
              </span>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: THEME.colors.accent,
              }}>
                {LANGUAGES.find(l => l.id === selectedLang)?.name}
              </span>
              <div style={{ marginLeft: 'auto' }}>
                <Check size={16} color={THEME.colors.accent} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Language List Card */}
          <div style={{ padding: '12px 20px 16px' }}>
            <div style={{
              background: THEME.colors.surface,
              borderRadius: 20,
              padding: '4px 0',
              boxShadow: THEME.shadows.soft,
              border: '1px solid rgba(0,0,0,0.03)',
              overflow: 'hidden',
            }}>
              {LANGUAGES.map((lang, idx) => {
                const isSelected = selectedLang === lang.id;
                const isLast = idx === LANGUAGES.length - 1;

                return (
                  <div key={lang.id}>
                    <div
                      className="lang-row"
                      onClick={() => handleSelect(lang.id)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 14,
                        padding: '15px 20px',
                        background: isSelected ? `${THEME.colors.accent}08` : 'transparent',
                        position: 'relative',
                      }}
                    >
                      {/* Flag */}
                      <span style={{ fontSize: 26, lineHeight: 1, flexShrink: 0 }}>
                        {lang.flag}
                      </span>

                      {/* Names */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{
                          fontSize: 15,
                          fontWeight: isSelected ? 700 : 500,
                          color: isSelected ? THEME.colors.primaryText : THEME.colors.primaryText,
                          lineHeight: 1.3,
                          marginBottom: 1,
                        }}>
                          {lang.name}
                        </p>
                        <p style={{
                          fontSize: 13,
                          fontWeight: 400,
                          color: THEME.colors.tertiaryText,
                          lineHeight: 1.3,
                        }}>
                          {lang.nativeName}
                        </p>
                      </div>

                      {/* Check / Radio Indicator */}
                      <div style={{ flexShrink: 0, width: 24, height: 24, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        {isSelected ? (
                          <div className="lang-check-pop" style={{
                            width: 24,
                            height: 24,
                            borderRadius: THEME.radius.full,
                            background: THEME.colors.accent,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}>
                            <Check size={14} color="#FFFFFF" strokeWidth={3} />
                          </div>
                        ) : (
                          <div style={{
                            width: 22,
                            height: 22,
                            borderRadius: THEME.radius.full,
                            border: `2px solid ${THEME.colors.divider}`,
                          }} />
                        )}
                      </div>
                    </div>

                    {/* Divider */}
                    {!isLast && (
                      <div style={{
                        height: 1,
                        background: THEME.colors.divider,
                        marginLeft: 60,
                        marginRight: 20,
                        opacity: 0.6,
                      }} />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Caption */}
          <div style={{ padding: '4px 20px 32px' }}>
            <p style={{
              fontSize: 13,
              fontWeight: 400,
              color: THEME.colors.tertiaryText,
              textAlign: 'center',
              lineHeight: 1.5,
            }}>
              App will restart to apply changes
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default LanguageSettingsScreen;
