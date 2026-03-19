import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { 
  Search, ChevronLeft, ChevronRight, MoreHorizontal, X, CheckCircle2, MapPin, 
  Navigation, Image as ImageIcon, Phone, Globe, Star, Plus, Map, 
  Share2, Compass, Loader2, ChevronDown, Trash2
} from 'lucide-react';

// --- MOCK DATA ---
const MOCK_DATA = {
  pet: { id: 'pet_001', name: 'Luna', breed: 'Golden Retriever' },
  userLocation: { lat: 47.3667, lng: 8.5500 },
  categories: [
    { id: 'all', label: 'All', count: 5, icon: '📍' },
    { id: 'parks', label: 'Parks', count: 2, icon: '🌳' },
    { id: 'groomers', label: 'Groomers', count: 1, icon: '✂️' },
    { id: 'pet-stores', label: 'Pet Stores', count: 1, icon: '🏪' },
    { id: 'restaurants', label: 'Cafes', count: 1, icon: '☕' }
  ],
  places: [
    {
      id: 'place_001', category: 'parks', name: 'Zurichhorn Park', icon: '🌳',
      rating: 5.0,
      address: { full: 'Seestrasse, 8008 Zürich, Switzerland' },
      location: { lat: 47.3547, lng: 8.5496 }, // ~1.5km South
      phone: null, website: null,
      notes: "Luna's favorite park! Great off-leash area with lake access. Usually empty on weekday mornings.",
      tags: ['Off-leash', 'Lake', 'Quiet'],
      visitCount: 12, firstVisit: '2023-06-15', lastVisit: '2026-02-20',
      photos: ['url1', 'url2', 'url3'],
      visits: [{ id: 'v1', date: '2026-02-20', notes: 'Great walk today! Luna swam in the lake.', photos: [] }]
    },
    {
      id: 'place_002', category: 'parks', name: 'Rieterpark', icon: '🌳',
      rating: 4.0,
      address: { full: 'Gablerstrasse, 8002 Zürich, Switzerland' },
      location: { lat: 47.3589, lng: 8.5253 }, // ~2km South West
      phone: null, website: null,
      notes: 'Good for training sessions. Quieter than Zurichhorn.',
      tags: ['Training', 'Quiet'],
      visitCount: 5, firstVisit: '2024-09-10', lastVisit: '2026-01-15',
      photos: [], visits: []
    },
    {
      id: 'place_003', category: 'groomers', name: 'Paws & Claws Grooming', icon: '✂️',
      rating: 5.0,
      address: { full: 'Bahnhofstrasse 25, 8001 Zürich, Switzerland' },
      location: { lat: 47.3769, lng: 8.5417 }, // ~1km North West
      phone: '+41 44 555 1234', website: 'https://www.pawsandclaws.ch',
      notes: 'Excellent with Golden Retrievers! Very gentle.',
      tags: ['Professional', 'Gentle'],
      visitCount: 8, firstVisit: '2023-08-20', lastVisit: '2025-12-10',
      nextAppointment: 'Mar 15, 2026',
      photos: [], visits: []
    },
    {
      id: 'place_004', category: 'pet-stores', name: 'Qualipet Zürich', icon: '🏪',
      rating: 4.0,
      address: { full: 'Europaallee 33, 8004 Zürich, Switzerland' },
      location: { lat: 47.3782, lng: 8.5306 }, // ~2km North West
      phone: '+41 44 555 2345', website: 'https://www.qualipet.ch',
      notes: 'Wide selection, good prices on food.',
      tags: ['Food', 'Toys'],
      visitCount: 15, firstVisit: '2023-06-01', lastVisit: '2026-02-18',
      photos: [], visits: []
    },
    {
      id: 'place_005', category: 'restaurants', name: 'Café Felix', icon: '☕',
      rating: 5.0,
      address: { full: 'Bellevue, 8001 Zürich, Switzerland' },
      location: { lat: 47.3667, lng: 8.5458 }, // ~0.3km West
      phone: '+41 44 555 3456', website: 'https://www.cafefelix.ch',
      notes: 'Outdoor seating with water bowls provided. Very dog-friendly!',
      tags: ['Dog-friendly', 'Outdoor'],
      visitCount: 6, firstVisit: '2024-05-12', lastVisit: '2026-02-15',
      photos: ['url1'], visits: []
    }
  ]
};

// --- UTILITIES ---
const calculateDistance = (place, userLocation) => {
  const R = 6371; 
  const toRad = (value) => (value * Math.PI) / 180;
  const dLat = toRad(place.location.lat - userLocation.lat);
  const dLon = toRad(place.location.lng - userLocation.lng);
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(userLocation.lat)) * Math.cos(toRad(place.location.lat)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return (R * c).toFixed(1) + ' km';
};

const renderStars = (rating) => {
  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 >= 0.5;
  const emptyStars = 5 - Math.ceil(rating);
  return (
    <div className="flex items-center gap-1">
      <div className="flex text-[#FFB800] text-[10px] tracking-widest">
        {'★'.repeat(fullStars)}{hasHalfStar ? '★' : ''}{'☆'.repeat(emptyStars)}
      </div>
      <span className="text-[12px] font-medium text-[#8A8A8A] ml-0.5">({rating.toFixed(1)})</span>
    </div>
  );
};

const categoryColors = {
  parks: '#34C759', groomers: '#AF52DE', 'pet-stores': '#FF9500', restaurants: '#A2845E'
};

// --- CORE UI COMPONENTS ---
const Divider = () => <div className="w-full h-[1px] bg-[#EAEAEA] my-4" />;

const Toast = ({ message, isVisible }) => (
  <div className={`fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 z-[200] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
    <CheckCircle2 size={18} className="text-[#00C060]" />
    <span className="text-[14px] font-medium whitespace-nowrap">{message}</span>
  </div>
);

// --- BOTTOM SHEET COMPONENT ---
const useLockBodyScroll = (isOpen) => {
  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, [isOpen]);
};

const BottomSheet = ({ isOpen, onClose, title, children, padding = "px-6" }) => {
  const [render, setRender] = useState(isOpen);
  const [visible, setVisible] = useState(false);
  const touchStartY = useRef(0);
  const [translateY, setTranslateY] = useState(0);
  const [portalNode, setPortalNode] = useState(null);

  useLockBodyScroll(isOpen);
  useEffect(() => { setPortalNode(document.getElementById('modal-root')); }, []);

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
    if (isOpen) { setRender(true); requestAnimationFrame(() => setTimeout(() => setVisible(true), 10)); }
    else { setVisible(false); setTimeout(() => setRender(false), 300); }
  }, [isOpen]);

  const handleTouchStart = (e) => { touchStartY.current = e.touches[0].clientY; setTranslateY(0); };
  const handleTouchMove = (e) => { const delta = e.touches[0].clientY - touchStartY.current; if (delta > 0) setTranslateY(delta); };
  const handleTouchEnd = () => { if (translateY > 80) onClose(); else setTranslateY(0); };

  if (!render || !portalNode) return null;

  return createPortal(
    <div className="absolute inset-0 z-[100] overflow-hidden pointer-events-auto flex flex-col justify-end">
      <div className={`absolute inset-0 bg-black/20 transition-opacity duration-300 ${visible ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
      <div 
        className="relative w-full bg-[#FFFFFF] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[92vh]"
        style={{ transform: `translateY(${!visible ? '100%' : `${translateY}px`})`, transition: translateY > 0 ? 'none' : 'transform 300ms cubic-bezier(0.32, 0.72, 0, 1)', paddingBottom: 'calc(env(safe-area-inset-bottom) + 24px)' }}
      >
        <div className="w-full flex justify-center pt-3 pb-3 cursor-grab touch-none shrink-0" onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>
          <div className="w-10 h-1 bg-[#EAEAEA] rounded-full" />
        </div>
        <div className={`${padding} pb-4 flex items-center justify-between shrink-0`}>
          <h3 className="text-[20px] font-semibold text-[#111111]">{title}</h3>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center bg-[#F7F7F5] rounded-full active:scale-95 transition-transform">
            <X size={16} className="text-[#8A8A8A]" />
          </button>
        </div>
        <div className={`${padding} pb-6 overflow-y-auto custom-scrollbar flex-1`}>{children}</div>
      </div>
    </div>,
    portalNode
  );
};

// --- MAP MOCKUP COMPONENT ---
const MockMap = ({ places, onPinClick }) => (
  <div className="relative w-full h-full bg-[#E8EFEA] overflow-hidden">
    {/* Decorative Minimal Map Elements */}
    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#111 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
    <svg className="absolute inset-0 w-full h-full opacity-10" viewBox="0 0 100 100" preserveAspectRatio="none">
      <path d="M 0,50 Q 25,20 50,50 T 100,50 M 50,0 Q 80,25 50,100" fill="none" stroke="#111" strokeWidth="0.5" />
    </svg>
    
    {/* User Location */}
    <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2">
      <div className="w-12 h-12 bg-[#007AFF]/15 rounded-full animate-ping absolute -inset-3" />
      <div className="w-3.5 h-3.5 bg-[#007AFF] border-[2px] border-white rounded-full relative z-10 shadow-sm" />
    </div>

    {/* Place Pins (Minimal) */}
    {places.map((place, i) => {
      const positions = [{t:'20%',l:'40%'}, {t:'70%',l:'25%'}, {t:'30%',l:'75%'}, {t:'45%',l:'20%'}, {t:'55%',l:'60%'}];
      const pos = positions[i % positions.length];
      const color = categoryColors[place.category] || '#FF6B35';
      
      return (
        <div key={place.id} className="absolute -translate-x-1/2 -translate-y-full cursor-pointer hover:scale-105 transition-transform z-20" style={{ top: pos.t, left: pos.l }} onClick={() => onPinClick && onPinClick(place)}>
          <div className="relative flex flex-col items-center">
            <div className="w-6 h-6 rounded-full bg-white shadow-sm flex items-center justify-center border-2" style={{ borderColor: color }}>
              <span className="text-[10px]">{place.icon}</span>
            </div>
            <div className="w-0.5 h-1.5 opacity-80" style={{ backgroundColor: color }} />
          </div>
        </div>
      );
    })}
  </div>
);

// --- FULL MAP SCREEN ---
const FullMapScreen = ({ onClose, places, onPlaceSelect }) => (
  <div className="fixed inset-0 z-[150] bg-[#F7F7F5] flex flex-col animate-in fade-in zoom-in-95 duration-200">
    <div className="absolute top-0 left-0 right-0 z-30 pt-safe-top pointer-events-none">
      <div className="px-4 py-4 flex items-center justify-between pointer-events-auto">
        <button onClick={onClose} className="w-10 h-10 bg-white/90 backdrop-blur rounded-full flex items-center justify-center shadow-[0_2px_8px_rgba(0,0,0,0.04)] active:scale-95 border border-[#EAEAEA]">
          <ChevronLeft size={24} className="text-[#111111] -ml-0.5" />
        </button>
        <div className="bg-white/90 backdrop-blur px-5 py-2 rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[15px] font-semibold text-[#111111] border border-[#EAEAEA]">
          Places Map
        </div>
        <div className="w-10 h-10" /> {/* Spacer for centering */}
      </div>
      {/* Floating Filters */}
      <div className="px-4 mt-1 flex gap-2 overflow-x-auto custom-scrollbar pointer-events-auto pb-4">
        {MOCK_DATA.categories.filter(c => c.count > 0).map(cat => (
          <button key={cat.id} className="bg-white/95 backdrop-blur shadow-[0_2px_6px_rgba(0,0,0,0.03)] border border-[#EAEAEA] px-4 py-2 rounded-full whitespace-nowrap text-[13px] font-medium text-[#111111] flex items-center gap-1.5 active:scale-95">
            <span className="text-[14px]">{cat.icon}</span> {cat.label}
          </button>
        ))}
      </div>
    </div>
    
    <div className="flex-1 relative">
      <MockMap places={places} onPinClick={onPlaceSelect} />
    </div>
  </div>
);

// --- MAIN VAULT PLACES SCREEN ---
const VaultPlacesScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedPlace, setSelectedPlace] = useState(null);
  
  // Modals state
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [showDiscoverSheet, setShowDiscoverSheet] = useState(false);
  const [showFullMap, setShowFullMap] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };

  // Handlers
  const handleDirections = (place) => {
    // Only use formatted address, never raw coordinates in UI intent
    const addressString = place.address?.full || place.name; 
    const address = encodeURIComponent(addressString);
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isAndroid = /Android/.test(navigator.userAgent);
    if (isIOS) window.location.href = `maps://?daddr=${address}`;
    else if (isAndroid) window.location.href = `google.navigation:q=${address}`;
    else window.open(`https://www.google.com/maps/dir/?api=1&destination=${address}`);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: "Luna's Places", text: "Check out Luna's favorite spots!" });
    } else {
      showToast('Share dialog opened');
    }
  };

  // Derived Data
  const filteredPlaces = MOCK_DATA.places.filter(place => {
    const matchesSearch = place.name.toLowerCase().includes(searchQuery.toLowerCase()) || place.notes.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = activeCategory === 'all' || place.category === activeCategory;
    return matchesSearch && matchesCat;
  });

  const categoriesToShow = activeCategory === 'all' 
    ? MOCK_DATA.categories.filter(c => c.id !== 'all' && c.count > 0)
    : MOCK_DATA.categories.filter(c => c.id === activeCategory);

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#F7F7F5]">

      {/* Floating Header */}
      <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
        <div className="flex justify-between items-center w-full pointer-events-auto">
          {/* Left: Back button */}
          <button
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <ChevronLeft size={22} color="#111111" />
          </button>
          {/* Center: Title */}
          <h2 className="text-[17px] font-semibold text-[#111111]">Places & Favorites</h2>
          {/* Right: Menu button */}
          <button
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreHorizontal size={22} color="#111111" />
          </button>
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto overflow-x-hidden custom-scrollbar" style={{ paddingTop: 54, zIndex: 0 }}>
      <div className="px-4 pt-5 pb-[100px]">
        {/* Softer Pet Row */}
        <div className="flex justify-center mb-5">
          <div className="bg-white border border-[#EAEAEA] px-3 py-1.5 rounded-full shadow-[0_2px_6px_rgba(0,0,0,0.02)] text-[13px] font-medium text-[#111111] flex items-center gap-1.5">
            <span className="text-[16px]">🐕</span>
            <span>{MOCK_DATA.pet.name} <span className="text-[#8A8A8A] font-normal">· {MOCK_DATA.pet.breed}</span></span>
          </div>
        </div>

        {/* Refined Search Bar */}
        <div className="relative mb-6">
          <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
            <Search size={18} className="text-[#8A8A8A]" />
          </div>
          <input 
            type="text" 
            placeholder="Search places..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[44px] bg-black/[0.03] shadow-[inset_0_1px_3px_rgba(0,0,0,0.02)] rounded-[12px] pl-10 pr-10 text-[15px] text-[#111111] placeholder-[#8A8A8A] outline-none focus:bg-white focus:ring-1 focus:ring-[#FF6B35]/30 transition-all border border-transparent focus:border-[#FF6B35]/30"
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className="absolute inset-y-0 right-3 flex items-center">
              <div className="w-4 h-4 bg-black/15 rounded-full flex items-center justify-center"><X size={10} className="text-white"/></div>
            </button>
          )}
        </div>

        {/* Refined Quick Filters */}
        <div className="flex gap-2 overflow-x-auto custom-scrollbar pb-2 mb-6 -mx-4 px-4">
          {MOCK_DATA.categories.map(cat => (
            <button 
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-2.5 rounded-full text-[13px] font-medium border transition-all active:scale-95 ${activeCategory === cat.id ? 'bg-[#FFF6F2] border-[#FF6B35]/20 text-[#FF6B35]' : 'bg-white border-[#EAEAEA] text-[#6E6E73] hover:bg-black/[0.01]'}`}
            >
              <span className="text-[14px]">{cat.icon}</span>
              <span>{cat.label}</span>
            </button>
          ))}
        </div>

        {/* Refined Map Preview */}
        {activeCategory === 'all' && !searchQuery && (
          <div className="relative h-[200px] bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden mb-8 shadow-[0_2px_6px_rgba(0,0,0,0.02)] group cursor-pointer" onClick={() => setShowFullMap(true)}>
            <MockMap places={MOCK_DATA.places} />
            <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-[#F7F7F5]/90 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
              <span className="text-[13px] font-medium text-[#111111] drop-shadow-sm">12 saved places</span>
              <span className="text-[13px] font-medium text-[#FF6B35]/90">View Full Map →</span>
            </div>
          </div>
        )}

        {/* Sections */}
        {categoriesToShow.map(cat => {
          const categoryPlaces = filteredPlaces.filter(p => p.category === cat.id);
          if (categoryPlaces.length === 0) return null;

          return (
            <div key={cat.id} className="mb-8">
              {/* Refined Section Header */}
              <div className="flex items-center justify-between mt-8 mb-4 px-1">
                <h3 className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px]">
                  {cat.label} ({categoryPlaces.length})
                </h3>
                <button onClick={() => setShowAddSheet(true)} className="w-6 h-6 flex items-center justify-center text-[#8A8A8A] hover:text-[#111111] transition-colors">
                  <Plus size={16} />
                </button>
              </div>

              <div className="space-y-4">
                {categoryPlaces.map(place => (
                  <div key={place.id} className="bg-white border border-[#EAEAEA] rounded-[16px] p-[18px] shadow-[0_2px_6px_rgba(0,0,0,0.02)] active:scale-[0.99] transition-all cursor-pointer" onClick={() => setSelectedPlace(place)}>
                    <div className="flex items-start gap-3.5">
                      {/* Refined Icon */}
                      <div className="w-10 h-10 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[20px] shrink-0 border border-[#EAEAEA]/60">
                        {place.icon}
                      </div>
                      
                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-0.5">
                          <h4 className="text-[16px] font-semibold text-[#111111] truncate pr-2">{place.name}</h4>
                          <span className="text-[13px] font-normal text-[#8A8A8A] shrink-0 mt-0.5">{calculateDistance(place, MOCK_DATA.userLocation)}</span>
                        </div>
                        
                        <div className="mb-1.5">
                          {renderStars(place.rating)}
                        </div>
                        
                        <p className="text-[13px] text-[#8A8A8A] truncate mb-2">{place.address?.full?.split(',')[0] || 'Location saved'}</p>
                        
                        {/* Refined Business Info */}
                        {(place.phone || place.nextAppointment) && (
                          <div className="flex flex-wrap gap-2.5 mb-3 items-center">
                            {place.phone && <span className="text-[13px] text-[#6E6E73]">{place.phone}</span>}
                            {place.nextAppointment && <span className="text-[12px] font-medium bg-[#FFF6F2] text-[#FF6B35]/80 px-2 py-0.5 rounded-full border border-[#FF6B35]/10">Next: {place.nextAppointment}</span>}
                          </div>
                        )}

                        {/* Refined Notes Preview */}
                        {place.notes && (
                          <div className="border-l border-[#FF6B35]/40 pl-3 my-3">
                            <p className="text-[13px] text-[#8A8A8A] italic line-clamp-2 leading-relaxed">"{place.notes}"</p>
                          </div>
                        )}
                        
                        <div className="text-[12px] font-normal text-[#8A8A8A]">
                          {place.visitCount} visits · Last: {place.lastVisit}
                        </div>
                      </div>
                    </div>

                    {/* Refined Action Row */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#EAEAEA]">
                      <div className="flex gap-2">
                        <button onClick={(e) => { e.stopPropagation(); handleDirections(place); }} className="w-9 h-9 rounded-full bg-[#F7F7F5] text-[#6E6E73] flex items-center justify-center hover:bg-[#EAEAEA] active:scale-95 transition-all">
                          <Navigation size={16} />
                        </button>
                        {place.photos?.length > 0 && (
                          <button onClick={(e) => { e.stopPropagation(); showToast('Opening photos...'); }} className="w-9 h-9 rounded-full bg-[#F7F7F5] text-[#6E6E73] flex items-center justify-center hover:bg-[#EAEAEA] active:scale-95 transition-all">
                            <ImageIcon size={16} />
                          </button>
                        )}
                        {place.phone && (
                          <button onClick={(e) => { e.stopPropagation(); window.location.href = `tel:${place.phone}`; }} className="w-9 h-9 rounded-full bg-[#F7F7F5] text-[#6E6E73] flex items-center justify-center hover:bg-[#EAEAEA] active:scale-95 transition-all">
                            <Phone size={16} />
                          </button>
                        )}
                        {place.website && (
                          <button onClick={(e) => { e.stopPropagation(); window.open(place.website); }} className="w-9 h-9 rounded-full bg-[#F7F7F5] text-[#6E6E73] flex items-center justify-center hover:bg-[#EAEAEA] active:scale-95 transition-all">
                            <Globe size={16} />
                          </button>
                        )}
                      </div>
                      <span className="text-[12px] font-medium text-[#FF6B35]/80">More details →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Refined Quick Actions */}
        <div className="mt-10 mb-6">
          <h3 className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px] mb-4 pl-1">Quick Actions</h3>
          <div className="bg-white border border-[#EAEAEA] rounded-[16px] overflow-hidden shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
            {[
              { icon: Plus, label: 'Add new place', onClick: () => setShowAddSheet(true) },
              { icon: Map, label: 'View all on map', onClick: () => setShowFullMap(true) },
              { icon: Compass, label: 'Discover nearby', onClick: () => setShowDiscoverSheet(true) },
              { icon: Share2, label: 'Share favorites', onClick: handleShare }
            ].map((item, index) => (
              <React.Fragment key={index}>
                <button className="w-full h-[52px] flex items-center gap-3.5 px-4 hover:bg-[#F7F7F5] transition-colors text-left active:scale-[0.99]" onClick={item.onClick}>
                  <div className="text-[#6E6E73]"><item.icon size={20} strokeWidth={1.5} /></div>
                  <span className="text-[15px] font-medium text-[#111111] flex-1">{item.label}</span>
                  <ChevronRight size={18} className="text-[#EAEAEA]" />
                </button>
                {index < 3 && <div className="w-full h-[1px] bg-[#EAEAEA] ml-12" />}
              </React.Fragment>
            ))}
          </div>
        </div>

      </div>
      </div>

      {/* Sheets & Modals */}
      <PlaceDetailsSheet
        isOpen={!!selectedPlace}
        onClose={() => setSelectedPlace(null)}
        place={selectedPlace}
        onDirections={() => handleDirections(selectedPlace)}
        onLogVisit={() => showToast('✓ Visit logged')}
      />
      <AddPlaceSheet 
        isOpen={showAddSheet} 
        onClose={() => setShowAddSheet(false)} 
        onSave={() => { setShowAddSheet(false); showToast('Place saved successfully'); }} 
      />
      <DiscoverNearbySheet isOpen={showDiscoverSheet} onClose={() => setShowDiscoverSheet(false)} />
      {showFullMap && <FullMapScreen onClose={() => setShowFullMap(false)} places={MOCK_DATA.places} onPlaceSelect={(p) => { setShowFullMap(false); setSelectedPlace(p); }} />}
      
      <Toast message={toastMsg} isVisible={!!toastMsg} />
    </div>
  );
};

// --- SPECIFIC SHEETS ---

const PlaceDetailsSheet = ({ isOpen, onClose, place, onDirections, onLogVisit }) => {
  if (!place) return null;
  
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="">
      <div className="-mt-4">
        {/* Header Block */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-12 h-12 rounded-full bg-[#F7F7F5] flex items-center justify-center text-[24px] shrink-0 border border-[#EAEAEA]/60">
            {place.icon}
          </div>
          <div>
            <h2 className="text-[20px] font-bold text-[#111111] leading-tight mb-1">{place.name}</h2>
            {renderStars(place.rating)}
          </div>
        </div>

        {/* Minimal Action Ribbon */}
        <div className="flex gap-2 mb-8">
          <button onClick={onDirections} className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] active:bg-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
            <Navigation size={18} className="text-[#111111]" />
            <span className="text-[11px] font-medium text-[#111111]">Directions</span>
          </button>
          {place.phone && (
            <button onClick={() => window.location.href = `tel:${place.phone}`} className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] active:bg-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
              <Phone size={18} className="text-[#111111]" />
              <span className="text-[11px] font-medium text-[#111111]">Call</span>
            </button>
          )}
          <button className="flex-1 bg-[#F7F7F5] border border-[#EAEAEA] active:bg-[#EAEAEA] py-2.5 rounded-[12px] flex flex-col items-center gap-1.5 transition-colors">
            <Share2 size={18} className="text-[#111111]" />
            <span className="text-[11px] font-medium text-[#111111]">Share</span>
          </button>
        </div>

        {/* Info List */}
        <div className="space-y-6">
          {/* Location - using address.full safely */}
          <div className="flex gap-3 items-start">
            <MapPin size={18} className="text-[#8A8A8A] shrink-0 mt-0.5" />
            <div>
              <div className="text-[14px] text-[#111111] font-medium leading-snug">{place.address?.full || 'Location saved'}</div>
              <div className="text-[12px] text-[#8A8A8A] mt-0.5">{calculateDistance(place, MOCK_DATA.userLocation)} away</div>
            </div>
          </div>

          {/* Minimal Notes */}
          {place.notes && (
            <div className="bg-[#F7F7F5] border border-[#EAEAEA] rounded-[16px] p-4 relative">
              <h4 className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px] mb-2">Your Notes</h4>
              <p className="text-[14px] text-[#111111] leading-relaxed">{place.notes}</p>
            </div>
          )}

          {/* Photos Preview */}
          {place.photos?.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-[13px] font-semibold text-[#111111]">Photos ({place.photos.length})</h4>
                <button className="text-[12px] font-medium text-[#FF6B35]">View All</button>
              </div>
              <div className="flex gap-2">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex-1 aspect-square rounded-[12px] bg-[#F7F7F5] border border-[#EAEAEA] relative overflow-hidden flex items-center justify-center">
                    <ImageIcon size={20} className="text-[#8A8A8A]" />
                    {i === 3 && place.photos.length > 3 && (
                      <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white font-medium text-[14px]">
                        +{place.photos.length - 2}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Visit Stats */}
          <div className="border border-[#EAEAEA] rounded-[16px] p-4">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h4 className="text-[13px] font-semibold text-[#111111] mb-0.5">Visit History</h4>
                <p className="text-[12px] text-[#8A8A8A]">Total: {place.visitCount} · Last: {place.lastVisit}</p>
              </div>
              <button className="text-[12px] font-medium text-[#FF6B35]">Timeline →</button>
            </div>
            <button onClick={onLogVisit} className="w-full bg-[#FF6B35] text-white font-medium py-3 rounded-[12px] active:scale-[0.98] transition-all shadow-sm">
              Log New Visit
            </button>
          </div>

          {/* Tags */}
          {place.tags && place.tags.length > 0 && (
            <div>
              <div className="flex flex-wrap gap-2">
                {place.tags.map(tag => (
                  <span key={tag} className="bg-[#F7F7F5] border border-[#EAEAEA] text-[#6E6E73] px-3 py-1.5 rounded-full text-[12px] font-medium">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
          
          <Divider />
          
          <button className="w-full py-2 flex items-center justify-center gap-2 text-[#FF3B30] font-medium active:opacity-70 transition-opacity">
            <Trash2 size={16} /> Delete Place
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

const AddPlaceSheet = ({ isOpen, onClose, onSave }) => {
  const [addressInput, setAddressInput] = useState('');

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Add New Place" padding="px-5">
      <div className="space-y-5 pt-2">
        <div className="space-y-4">
          {/* Category Select */}
          <div className="relative">
            <label className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider pl-1 mb-2 block">Category</label>
            <select className="w-full h-[48px] bg-white border border-[#EAEAEA] rounded-[12px] px-4 text-[15px] text-[#111111] appearance-none outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all">
              <option>🌳 Park</option>
              <option>🏥 Vet Clinic</option>
              <option>✂️ Groomer</option>
              <option>🏪 Pet Store</option>
              <option>☕ Cafe / Restaurant</option>
              <option>📌 Other</option>
            </select>
            <ChevronDown size={18} className="absolute right-4 top-[35px] text-[#8A8A8A] pointer-events-none" />
          </div>

          {/* Name */}
          <div>
            <label className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider pl-1 mb-2 block">Place Name</label>
            <input type="text" placeholder="e.g. Happy Paws Park" className="w-full h-[48px] bg-white border border-[#EAEAEA] rounded-[12px] px-4 text-[15px] text-[#111111] placeholder-[#8A8A8A] outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all" />
          </div>

          {/* Address */}
          <div>
            <label className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider pl-1 mb-2 block">Address</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none"><MapPin size={18} className="text-[#8A8A8A]" /></div>
              <input 
                type="text" 
                value={addressInput}
                onChange={(e) => setAddressInput(e.target.value)}
                placeholder="Search or enter address..." 
                className="w-full h-[48px] bg-white border border-[#EAEAEA] rounded-[12px] pl-11 pr-4 text-[15px] text-[#111111] placeholder-[#8A8A8A] outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all" 
              />
            </div>
            {/* Fallback to formatting string, never raw coordinates */}
            <button onClick={() => setAddressInput('Current location (approximate)')} className="mt-2.5 text-[13px] font-medium text-[#007AFF] flex items-center gap-1.5 ml-1 active:opacity-70">
              <Navigation size={14} /> Use Current Location
            </button>
          </div>

          {/* Rating Mock */}
          <div>
            <label className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider pl-1 mb-2 block">Your Rating</label>
            <div className="flex gap-1.5 pl-1">
              {[1,2,3,4,5].map(i => <Star key={i} size={28} className="text-[#EAEAEA] fill-current cursor-pointer hover:text-[#FFB800] transition-colors" />)}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="text-[11px] font-medium text-[#8A8A8A] uppercase tracking-wider pl-1 mb-2 block">Notes</label>
            <textarea placeholder="Add any details, rules, or experiences..." className="w-full h-[120px] bg-white border border-[#EAEAEA] rounded-[12px] p-4 text-[15px] text-[#111111] placeholder-[#8A8A8A] outline-none focus:border-[#FF6B35]/50 focus:ring-1 focus:ring-[#FF6B35]/20 transition-all resize-none" />
          </div>
        </div>

        <button onClick={onSave} className="w-full bg-[#FF6B35] text-white font-medium py-[14px] rounded-[14px] active:scale-[0.98] transition-all shadow-[0_4px_12px_rgba(255,107,53,0.15)] mt-6">
          Save Place
        </button>
      </div>
    </BottomSheet>
  );
};

const DiscoverNearbySheet = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(false);
  
  const handleCategoryClick = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); alert("Mock: Shows list of Google Places results here."); }, 1000);
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Discover Nearby" padding="px-5">
      <div className="pt-1 pb-4">
        <p className="text-[14px] text-[#8A8A8A] mb-5">Find new pet-friendly spots around your current location.</p>
        
        {loading ? (
          <div className="py-12 flex flex-col items-center justify-center gap-3">
            <Loader2 size={28} className="text-[#FF6B35] animate-spin" />
            <span className="text-[13px] font-medium text-[#8A8A8A]">Searching nearby...</span>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3">
            {[
              { icon: '🌳', label: 'Dog Parks' },
              { icon: '✂️', label: 'Groomers' },
              { icon: '🏥', label: 'Vets / Clinics' },
              { icon: '🏪', label: 'Pet Stores' },
              { icon: '☕', label: 'Cafes & Dining' },
              { icon: '🏨', label: 'Pet Hotels' }
            ].map((cat, i) => (
              <button key={i} onClick={handleCategoryClick} className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 flex flex-col items-center justify-center gap-2.5 active:scale-95 transition-transform shadow-[0_2px_6px_rgba(0,0,0,0.02)]">
                <span className="text-[28px]">{cat.icon}</span>
                <span className="text-[13px] font-medium text-[#111111]">{cat.label}</span>
              </button>
            ))}
            
            {/* Mocking a Result List appearance */}
            <div className="col-span-2 mt-4 pt-4 border-t border-[#EAEAEA]">
              <h4 className="text-[12px] font-medium text-[#8A8A8A] uppercase tracking-[1.2px] mb-3">Suggested</h4>
              <div className="bg-white border border-[#EAEAEA] rounded-[16px] p-4 shadow-[0_2px_6px_rgba(0,0,0,0.02)] flex justify-between items-center">
                 <div>
                    <h5 className="text-[14px] font-semibold text-[#111111] mb-0.5">Rieterpark</h5>
                    <div className="text-[12px] text-[#8A8A8A] flex items-center gap-1.5">
                       <span className="text-[#FFB800]">★ 4.5</span> <span>(120)</span> · <span>2.5 km away</span>
                    </div>
                 </div>
                 <button className="px-3 py-1.5 border border-[#EAEAEA] rounded-full text-[12px] font-medium text-[#111111] hover:border-[#FF6B35]/40 transition-colors">
                   + Add
                 </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </BottomSheet>
  );
};

// --- APP SHELL ---
export default function App() {
  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#FF6B35]/20 selection:text-[#FF6B35]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .pt-safe-top { padding-top: env(safe-area-inset-top, 0px); }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-black sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-[200] pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        <div id="main-app-wrapper" className="absolute inset-0 w-full h-full bg-[#F7F7F5] origin-top">
          <VaultPlacesScreen />
        </div>
        
        <div id="modal-root" className="absolute inset-0 z-[150] pointer-events-none" />
      </div>
    </div>
  );
}