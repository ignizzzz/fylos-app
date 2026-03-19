import React, { useState } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Camera,
  Heart,
  Share2,
  Plus,
  X,
  Calendar,
  Image,
  Star,
  Check
} from 'lucide-react';

/**
 * 43_PHOTO_GALLERY_v1.jsx
 * Pet Photo Gallery screen — Fylos design system.
 */

const THEME = {
  colors: {
    accent: '#E85D2A', accentHover: '#D04A1C',
    primaryText: '#111111', secondaryText: '#6E6E73', tertiaryText: '#8E8E93',
    background: '#F9F9FB', surface: '#FFFFFF', surfaceAlt: '#F2F2F7',
    danger: '#FF3B30', success: '#00C060', warning: '#FF9500', info: '#007AFF', divider: '#E5E5E5'
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: { soft: '0 4px 20px rgba(0,0,0,0.03)', floating: '0 8px 24px rgba(0,0,0,0.08)' },
  motion: { tap: '120ms', fade: '200ms', tab: '240ms', spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)' }
};

const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');
    .pg-font-body { font-family: 'Inter', sans-serif; }
    .pg-scroll::-webkit-scrollbar { display: none; }
    .pg-scroll { -ms-overflow-style: none; scrollbar-width: none; }
    .pg-btn { transition: transform ${THEME.motion.tap} ease, opacity ${THEME.motion.tap} ease; cursor: pointer; border: none; background: none; padding: 0; }
    .pg-btn:active { transform: scale(0.92); }
    .pg-photo-tile { cursor: pointer; transition: transform 140ms ease, box-shadow 140ms ease; position: relative; overflow: hidden; border-radius: 16px; }
    .pg-photo-tile:active { transform: scale(0.97); }
    .pg-overlay-label { position: absolute; bottom: 8px; left: 8px; background: rgba(0,0,0,0.5); backdrop-filter: blur(6px); color: #fff; font-size: 11px; font-weight: 500; padding: 2px 8px; border-radius: 6px; font-family: 'Inter', sans-serif; letter-spacing: 0.1px; }
    .pg-heart-badge { position: absolute; top: 8px; right: 8px; }
    .pg-filter-pill { cursor: pointer; white-space: nowrap; padding: 7px 16px; border-radius: 9999px; font-size: 13px; font-weight: 600; font-family: 'Inter', sans-serif; border: none; background: none; transition: all ${THEME.motion.tab} ${THEME.motion.spring}; }
    .pg-filter-pill:active { transform: scale(0.95); }
    .pg-fab { cursor: pointer; border: none; transition: transform 150ms ${THEME.motion.spring}, box-shadow 150ms ease; }
    .pg-fab:active { transform: scale(0.88); }
    @keyframes pg-fadeUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
    .pg-fade-up { animation: pg-fadeUp 260ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes pg-lightboxIn { from { opacity: 0; transform: scale(0.94); } to { opacity: 1; transform: scale(1); } }
    .pg-lightbox-in { animation: pg-lightboxIn 220ms cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    @keyframes pg-heartPop { 0% { transform: scale(1); } 40% { transform: scale(1.35); } 70% { transform: scale(0.88); } 100% { transform: scale(1); } }
    .pg-heart-pop { animation: pg-heartPop 340ms ${THEME.motion.spring}; }
  `}</style>
);

const PHOTOS = [
  { id: 1, gradient: 'linear-gradient(135deg, #FFB088 0%, #E85D2A 100%)', date: 'Mar 14', fullDate: 'March 14, 2024', category: 'walk', categoryLabel: 'Walk', isFavorite: true, tall: false },
  { id: 2, gradient: 'linear-gradient(135deg, #A8E6CF 0%, #00C060 100%)', date: 'Mar 10', fullDate: 'March 10, 2024', category: 'adventure', categoryLabel: 'Adventure', isFavorite: false, tall: true },
  { id: 3, gradient: 'linear-gradient(135deg, #87CEEB 0%, #007AFF 100%)', date: 'Mar 5', fullDate: 'March 5, 2024', category: 'grooming', categoryLabel: 'Grooming', isFavorite: true, tall: false },
  { id: 4, gradient: 'linear-gradient(135deg, #FFD700 0%, #FF9500 100%)', date: 'Feb 28', fullDate: 'February 28, 2024', category: 'walk', categoryLabel: 'Walk', isFavorite: true, tall: true },
  { id: 5, gradient: 'linear-gradient(135deg, #DDA0DD 0%, #9B59B6 100%)', date: 'Feb 20', fullDate: 'February 20, 2024', category: 'milestone', categoryLabel: 'Milestone', isFavorite: false, tall: false },
  { id: 6, gradient: 'linear-gradient(135deg, #F8B4C8 0%, #E85D75 100%)', date: 'Feb 14', fullDate: 'February 14, 2024', category: 'grooming', categoryLabel: 'Grooming', isFavorite: false, tall: true },
  { id: 7, gradient: 'linear-gradient(135deg, #B8D4E3 0%, #4A90D9 100%)', date: 'Feb 7', fullDate: 'February 7, 2024', category: 'adventure', categoryLabel: 'Adventure', isFavorite: true, tall: false },
  { id: 8, gradient: 'linear-gradient(135deg, #C8E6C9 0%, #66BB6A 100%)', date: 'Jan 30', fullDate: 'January 30, 2024', category: 'walk', categoryLabel: 'Walk', isFavorite: false, tall: false },
  { id: 9, gradient: 'linear-gradient(135deg, #FFE0B2 0%, #FF8A65 100%)', date: 'Jan 22', fullDate: 'January 22, 2024', category: 'milestone', categoryLabel: 'Milestone', isFavorite: true, tall: true },
  { id: 10, gradient: 'linear-gradient(135deg, #E1BEE7 0%, #AB47BC 100%)', date: 'Jan 15', fullDate: 'January 15, 2024', category: 'grooming', categoryLabel: 'Grooming', isFavorite: false, tall: false },
  { id: 11, gradient: 'linear-gradient(135deg, #B3E5FC 0%, #29B6F6 100%)', date: 'Jan 8', fullDate: 'January 8, 2024', category: 'adventure', categoryLabel: 'Adventure', isFavorite: false, tall: false },
  { id: 12, gradient: 'linear-gradient(135deg, #FFCCBC 0%, #FF7043 100%)', date: 'Jan 2', fullDate: 'January 2, 2024', category: 'walk', categoryLabel: 'Walk', isFavorite: true, tall: true },
];

const FILTER_TABS = [
  { id: 'all', label: 'All' }, { id: 'walk', label: 'Walks' }, { id: 'grooming', label: 'Grooming' },
  { id: 'adventure', label: 'Adventures' }, { id: 'milestone', label: 'Milestones' },
];

const FullscreenViewer = ({ photo, photos, onClose, onToggleFavorite, onNavigate }) => {
  const currentIndex = photos.findIndex(p => p.id === photo.id);
  const canPrev = currentIndex > 0;
  const canNext = currentIndex < photos.length - 1;
  return (
    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.95)', zIndex: 100, display: 'flex', flexDirection: 'column', borderRadius: 50, overflow: 'hidden' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '58px 20px 16px', flexShrink: 0 }}>
        <button className="pg-btn" onClick={onClose} style={{ width: 40, height: 40, borderRadius: THEME.radius.full, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <X size={20} color="#fff" />
        </button>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{currentIndex + 1} / {photos.length}</span>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="pg-btn" onClick={() => onToggleFavorite(photo.id)} style={{ width: 40, height: 40, borderRadius: THEME.radius.full, background: photo.isFavorite ? 'rgba(255,59,48,0.2)' : 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Heart size={18} color={photo.isFavorite ? '#FF3B30' : 'rgba(255,255,255,0.7)'} fill={photo.isFavorite ? '#FF3B30' : 'none'} />
          </button>
          <button className="pg-btn" style={{ width: 40, height: 40, borderRadius: THEME.radius.full, background: 'rgba(255,255,255,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Share2 size={18} color="rgba(255,255,255,0.7)" />
          </button>
        </div>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', padding: '0 20px' }}>
        <button className="pg-btn" onClick={() => canPrev && onNavigate(-1)} style={{ position: 'absolute', left: 12, zIndex: 2, width: 40, height: 40, borderRadius: THEME.radius.full, background: canPrev ? 'rgba(255,255,255,0.14)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canPrev ? 1 : 0.2 }}>
          <ChevronLeft size={22} color="#fff" />
        </button>
        <div className="pg-lightbox-in" style={{ width: 300, height: 380, borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)', background: photo.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Image size={48} color="rgba(255,255,255,0.3)" />
        </div>
        <button className="pg-btn" onClick={() => canNext && onNavigate(1)} style={{ position: 'absolute', right: 12, zIndex: 2, width: 40, height: 40, borderRadius: THEME.radius.full, background: canNext ? 'rgba(255,255,255,0.14)' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: canNext ? 1 : 0.2 }}>
          <ChevronRight size={22} color="#fff" />
        </button>
      </div>
      <div style={{ padding: '16px 24px 44px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, flexShrink: 0 }}>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{photo.categoryLabel}</span>
        <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, color: 'rgba(255,255,255,0.45)', display: 'flex', alignItems: 'center', gap: 4 }}>
          <Calendar size={12} />{photo.fullDate}
        </span>
      </div>
    </div>
  );
};

const PhotoTile = ({ photo, height, onTap }) => (
  <div className="pg-photo-tile" style={{ height, background: photo.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => onTap(photo)}>
    <Image size={24} color="rgba(255,255,255,0.25)" />
    <div className="pg-overlay-label">{photo.date}</div>
    {photo.isFavorite && (
      <div className="pg-heart-badge">
        <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Heart size={12} color="#FF3B30" fill="#FF3B30" />
        </div>
      </div>
    )}
    <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 36, background: 'linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 100%)', pointerEvents: 'none', borderRadius: '0 0 16px 16px' }} />
  </div>
);

export default function PhotoGalleryScreen() {
  const [activeFilter, setActiveFilter] = useState('all');
  const [photos, setPhotos] = useState(PHOTOS);
  const [lightboxPhoto, setLightboxPhoto] = useState(null);

  const filteredPhotos = activeFilter === 'all' ? photos : photos.filter(p => p.category === activeFilter);

  const handleToggleFavorite = (id) => {
    setPhotos(prev => prev.map(p => p.id === id ? { ...p, isFavorite: !p.isFavorite } : p));
    if (lightboxPhoto && lightboxPhoto.id === id) setLightboxPhoto(prev => ({ ...prev, isFavorite: !prev.isFavorite }));
  };

  const handleNavigate = (dir) => {
    const idx = filteredPhotos.findIndex(p => p.id === lightboxPhoto.id);
    const next = filteredPhotos[idx + dir];
    if (next) setLightboxPhoto(next);
  };

  const col1 = [], col2 = [], col3 = [];
  filteredPhotos.forEach((photo, i) => {
    if (i % 3 === 0) col1.push(photo);
    else if (i % 3 === 1) col2.push(photo);
    else col3.push(photo);
  });
  const getHeight = (photo) => photo.tall ? 160 : 120;

  return (
    <div className="pg-font-body" style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#E5E5E5', padding: '20px' }}>
      <GlobalStyles />

      <div className="relative" style={{
        width: 390, height: 844, borderRadius: 50, border: '8px solid #000',
        overflow: 'hidden', backgroundColor: '#F9F9FB',
        boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)'
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
        <div className="absolute inset-0 overflow-y-auto pg-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>
          {/* Spacer for floating header */}
          <div style={{ height: 52, flexShrink: 0 }} />

          {/* PHOTO COUNT */}
          <div style={{ padding: '4px 20px 8px', flexShrink: 0 }}>
            <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, color: THEME.colors.secondaryText }}>{filteredPhotos.length} photos</span>
          </div>

          {/* FILTER PILLS */}
          <div className="pg-scroll" style={{ display: 'flex', gap: 8, padding: '4px 20px 12px', overflowX: 'auto', flexShrink: 0 }}>
            {FILTER_TABS.map(tab => {
              const isActive = activeFilter === tab.id;
              return (
                <button key={tab.id} className="pg-filter-pill" onClick={() => setActiveFilter(tab.id)} style={{
                  color: isActive ? '#FFFFFF' : THEME.colors.secondaryText,
                  background: isActive ? THEME.colors.primaryText : THEME.colors.surfaceAlt,
                  fontWeight: isActive ? 600 : 500
                }}>{tab.label}</button>
              );
            })}
          </div>

          {/* PHOTO GRID */}
          {filteredPhotos.length === 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12, padding: '60px 20px' }}>
              <div style={{ width: 64, height: 64, borderRadius: THEME.radius.full, background: THEME.colors.surfaceAlt, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Image size={28} color={THEME.colors.tertiaryText} />
              </div>
              <span style={{ fontFamily: 'Inter, sans-serif', fontSize: 15, color: THEME.colors.secondaryText, fontWeight: 500 }}>No photos in this category</span>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: 4, padding: '0 12px 100px', flexShrink: 0 }}>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {col1.map(photo => <PhotoTile key={photo.id} photo={photo} height={getHeight(photo)} onTap={setLightboxPhoto} />)}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {col2.map(photo => <PhotoTile key={photo.id} photo={photo} height={getHeight(photo)} onTap={setLightboxPhoto} />)}
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
                {col3.map(photo => <PhotoTile key={photo.id} photo={photo} height={getHeight(photo)} onTap={setLightboxPhoto} />)}
              </div>
            </div>
          )}
        </div>

        {/* FAB */}
        <div style={{ position: 'absolute', bottom: 40, right: 20, zIndex: 40 }}>
          <button className="pg-fab" style={{ width: 54, height: 54, borderRadius: THEME.radius.full, background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(232,93,42,0.4)' }}>
            <Plus size={24} color="#fff" strokeWidth={2.5} />
          </button>
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Photos</h2>
            {/* Right: Camera button */}
            <button
              className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
            >
              <Camera size={22} color="#111111" />
            </button>
          </div>
        </header>

        {/* FULLSCREEN VIEWER */}
        {lightboxPhoto && (
          <FullscreenViewer photo={lightboxPhoto} photos={filteredPhotos} onClose={() => setLightboxPhoto(null)} onToggleFavorite={handleToggleFavorite} onNavigate={handleNavigate} />
        )}
      </div>
    </div>
  );
}
