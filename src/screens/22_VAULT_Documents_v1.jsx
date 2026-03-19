import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import {
  ArrowLeft, Image as ImageIcon, File as FileIcon, Archive, Printer,
  Plus, Search as SearchIcon, XCircle, MoreVertical, CheckCircle2, X,
  DownloadCloud, Settings, ChevronLeft
} from 'lucide-react';

// --- MOCK DATA ---
const DOC_CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'medical', label: 'Medical' },
  { id: 'insurance', label: 'Insurance' },
  { id: 'adoption', label: 'Adoption/Purchase' },
  { id: 'photos', label: 'Photos' },
  { id: 'other', label: 'Other' }
];

const MOCK_VAULT_DOCS = [
  { id: 'doc_001', title: 'Rabies Vaccination', category: 'medical', type: 'pdf', size: 1228800, date: 'May 10, 2023', source: 'Vet Clinic Zurich' },
  { id: 'doc_002', title: 'Blood Test Results', category: 'medical', type: 'pdf', size: 870400, date: 'Jan 15, 2026', source: 'Tierarzt Zürich', notes: 'Annual checkup' },
  { id: 'doc_003', title: 'X-Ray - Front Leg', category: 'medical', type: 'image', size: 2457600, date: 'Aug 22, 2025', source: 'Tierarzt Zürich' },
  { id: 'doc_004', title: 'DHPP Vaccination Record', category: 'medical', type: 'pdf', size: 654000, date: 'Mar 02, 2025', source: 'Vet Clinic Zurich' },
  { id: 'doc_005', title: 'Pet Insurance Policy', category: 'insurance', type: 'pdf', size: 552960, date: 'Jan 01, 2024', source: 'Helvetia Insurance' },
  { id: 'doc_006', title: 'Insurance Card', category: 'insurance', type: 'image', size: 1153433, date: 'Jan 01, 2024', source: 'Helvetia Insurance' },
  { id: 'doc_007', title: 'Adoption Certificate', category: 'adoption', type: 'image', size: 2516582, date: 'Jun 20, 2021', source: 'Zurich Animal Rescue' },
  ...Array.from({ length: 12 }).map((_, i) => ({
    id: `photo_${i}`, title: `Photo ${i+1}`, category: 'photos', type: 'image', size: 3145728, date: 'Feb 15, 2026', source: null, url: `https://picsum.photos/seed/luna${i}/150/150`
  }))
];

// --- UTILITIES ---
const formatBytes = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

// --- SHARED UI COMPONENTS ---
const Divider = ({ spacing = 'medium', className = '' }) => {
  const spacings = { small: 'my-0', medium: 'my-4', large: 'my-8' };
  return <div className={`w-full h-[1px] bg-black/[0.04] ${spacings[spacing]} ${className}`} />;
};

const Toast = ({ message, isVisible }) => (
  <div className={`fixed bottom-[40px] left-1/2 -translate-x-1/2 bg-[#111111]/90 backdrop-blur-md text-white px-5 py-3.5 rounded-full flex items-center gap-2.5 shadow-[0_8px_30px_rgba(0,0,0,0.12)] transition-all duration-300 z-[120] ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}>
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
        className="relative w-full bg-[#FAFAFA] rounded-t-[32px] flex flex-col shadow-[0_-8px_40px_rgba(0,0,0,0.12)] max-h-[90vh]"
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

const GenericActionSheet = ({ isOpen, onClose, title, options }) => (
  <BottomSheet isOpen={isOpen} onClose={onClose} title={title}>
    <div className="space-y-2 pt-2 pb-4">
      {options.map((opt, i) => {
        if (opt.divider) return <Divider key={`div-${i}`} spacing="medium" />;
        return (
          <button key={i} onClick={() => { opt.onClick?.(); onClose(); }} className={`w-full flex items-center gap-4 p-4 bg-white border border-black/[0.03] hover:bg-black/[0.02] rounded-[16px] transition-colors active:scale-[0.98] shadow-sm ${opt.style === 'cancel' ? 'justify-center' : ''}`}>
            {opt.icon && <span className="text-[20px]">{opt.icon}</span>}
            {opt.LucideIcon && <opt.LucideIcon size={20} className={opt.style === 'cancel' ? 'text-red-500' : 'text-[#111111]'} strokeWidth={1.5} />}
            <span className={`text-[15px] font-medium ${opt.style === 'cancel' ? 'text-red-500' : 'text-[#111111]'}`}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  </BottomSheet>
);

// --- VAULT DOCUMENTS SCREEN COMPONENTS ---

const SearchBar = ({ value, onChange, onClear }) => (
  <div className="relative mb-6">
    <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
      <SearchIcon size={18} className="text-[#A1A1A6]" />
    </div>
    <input 
      type="text" 
      value={value} 
      onChange={(e) => onChange(e.target.value)} 
      placeholder="Search documents..." 
      className="w-full h-[40px] bg-[#FFFFFF] border border-[#ECECEC] rounded-[12px] pl-10 pr-10 text-[15px] text-[#111111] placeholder:text-[#A1A1A6] focus:outline-none focus:border-[#E56D48] focus:ring-1 focus:ring-[#E56D48] transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)]" 
    />
    {value && (
      <button onClick={onClear} className="absolute inset-y-0 right-3.5 flex items-center text-[#A1A1A6] hover:text-[#111111] transition-colors">
        <XCircle size={16} />
      </button>
    )}
  </div>
);

const CategoryFilters = ({ categories, activeCategory, onChange, counts }) => (
  <div className="flex overflow-x-auto gap-3 no-scrollbar mb-8 -mx-5 px-5 custom-scrollbar">
    {categories.map(cat => {
      const isActive = activeCategory === cat.id;
      const count = counts[cat.id] || 0;
      return (
        <button key={cat.id} onClick={() => onChange(cat.id)} className={`whitespace-nowrap flex items-center gap-1.5 px-4 py-1.5 rounded-[12px] text-[14px] font-medium transition-all shadow-[0_2px_8px_rgba(0,0,0,0.04)] border ${ isActive ? 'bg-[#E56D48] text-white border-[#E56D48]' : 'bg-white text-[#6E6E73] border-[#ECECEC] hover:bg-[#F9F9F9]' }`}>
          {cat.label} <span className={`text-[12px] ${isActive ? 'text-white/80' : 'text-[#A1A1A6]'}`}>{count}</span>
        </button>
      )
    })}
  </div>
);

const DocumentCard = ({ document, onClick }) => (
  <div className="p-4 flex items-start gap-4 mb-3 bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] cursor-pointer active:scale-[0.98] active:bg-[#F9F9F9] transition-all" onClick={() => onClick(document)}>
    <div className="w-[36px] h-[36px] rounded-[10px] bg-[#F9F9F9] flex items-center justify-center shrink-0 border border-[#ECECEC]">
      {document.type === 'pdf' ? <FileIcon size={18} className="text-[#E56D48]/80" /> : <ImageIcon size={18} className="text-[#4B93E6]/80" />}
    </div>
    <div className="flex-1 min-w-0 pt-0.5">
      <div className="text-[16px] font-semibold text-[#111111] truncate mb-1 leading-tight">{document.title}</div>
      <div className="text-[13px] text-[#8E8E93] flex items-center gap-1.5 leading-snug flex-wrap">
        <span className="uppercase">{document.type}</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[#D1D1D6]" />
        <span>{formatBytes(document.size)}</span>
        <span className="w-[3px] h-[3px] rounded-full bg-[#D1D1D6]" />
        <span>{document.date}</span>
        {document.source && (
          <>
            <span className="w-[3px] h-[3px] rounded-full bg-[#D1D1D6]" />
            <span className="truncate">{document.source}</span>
          </>
        )}
      </div>
    </div>
  </div>
);

const PhotosGrid = ({ photos, onViewAll, onViewPhoto }) => {
  const displayPhotos = photos.slice(0, 8);
  return (
    <div className="mb-4">
      <div className="grid grid-cols-4 gap-3">
        {displayPhotos.map(p => (
          <div key={p.id} onClick={() => onViewPhoto(p)} className="aspect-square bg-[#F9F9F9] rounded-[12px] overflow-hidden relative cursor-pointer active:scale-95 transition-transform border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
            <img src={p.url} className="w-full h-full object-cover" alt={p.title}/>
          </div>
        ))}
      </div>
      {photos.length > 8 && (
        <button onClick={onViewAll} className="w-full mt-4 py-3 text-[14px] font-medium text-[#E56D48]/85 bg-white rounded-[12px] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#F9F9F9] transition-colors">
          View All Photos ({photos.length}) →
        </button>
      )}
    </div>
  )
};

const EmptySearchState = ({ query, onClear }) => (
  <div className="flex flex-col items-center justify-center py-12 text-center px-6">
    <div className="w-16 h-16 bg-[#F9F9F9] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] flex items-center justify-center mb-4">
      <SearchIcon size={24} className="text-[#A1A1A6]" />
    </div>
    <h3 className="text-[16px] font-semibold text-[#111111] mb-2">No documents found</h3>
    <p className="text-[14px] text-[#8E8E93] mb-6">We couldn't find anything matching "{query}". Try different keywords or browse by category.</p>
    <button onClick={onClear} className="px-6 py-2.5 bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F9F9F9] transition-colors">
      Clear Search
    </button>
  </div>
);

// --- MAIN SCREEN ---
const VaultDocumentsScreen = ({ onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [sheetConfig, setSheetConfig] = useState({ isOpen: false, title: '', options: [] });
  const [toastMsg, setToastMsg] = useState('');

  const showToast = (msg) => { setToastMsg(msg); setTimeout(() => setToastMsg(''), 3000); };
  const closeSheet = () => setSheetConfig(prev => ({ ...prev, isOpen: false }));
  const openSheet = (config) => setSheetConfig({ ...config, isOpen: true });

  const handleSearch = (query) => { setSearchQuery(query); setActiveCategory('all'); };
  
  const filteredDocs = MOCK_VAULT_DOCS.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchQuery.toLowerCase()) || doc.source?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'all' || doc.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const counts = DOC_CATEGORIES.reduce((acc, cat) => {
    acc[cat.id] = cat.id === 'all' ? MOCK_VAULT_DOCS.length : MOCK_VAULT_DOCS.filter(d => d.category === cat.id).length;
    return acc;
  }, {});

  const handleExportCategory = (categoryLabel, categoryId) => {
    openSheet({
      title: `Export ${categoryLabel}`,
      options: [
        { label: 'Download as ZIP', LucideIcon: Archive, onClick: () => showToast(`✓ ${categoryLabel} ZIP downloaded`) },
        { label: 'Generate PDF', LucideIcon: FileIcon, onClick: () => showToast(`✓ ${categoryLabel} PDF generated`) },
        { label: 'Cancel', style: 'cancel' }
      ]
    });
  };

  const handleMenuClick = () => {
    openSheet({
      title: 'Document Options',
      options: [
        { label: 'Export all documents', LucideIcon: Archive, onClick: () => showToast('✓ All documents downloaded') },
        { label: 'Download by category', LucideIcon: DownloadCloud, onClick: () => showToast('Select category to download') },
        { label: 'Print bundle', LucideIcon: Printer, onClick: () => showToast('Preparing print bundle...') },
        { divider: true },
        { label: 'Manage documents', LucideIcon: Settings, onClick: () => alert('Navigating to manage documents...') },
        { label: 'Add document', LucideIcon: Plus, onClick: () => alert('Opening Add Document flow...') },
        { label: 'Cancel', style: 'cancel' }
      ]
    });
  };

  const groupedDocs = DOC_CATEGORIES.filter(c => c.id !== 'all').map(cat => ({
    ...cat,
    items: filteredDocs.filter(d => d.category === cat.id)
  })).filter(cat => cat.items.length > 0 || (activeCategory === cat.id && !searchQuery));

  return (
    <div className="absolute inset-0 bg-[#FAFAFA] overflow-hidden z-10">

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
          <h2 className="text-[17px] font-semibold text-[#111111]">Documents</h2>
          {/* Right: Menu button */}
          <button
            onClick={handleMenuClick}
            className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
          >
            <MoreVertical size={22} color="#111111" />
          </button>
        </div>
      </header>

      <div className="absolute inset-0 overflow-y-auto custom-scrollbar flex flex-col" style={{ paddingTop: 54, zIndex: 0 }}>
      <div className="px-5 pt-6 pb-[40px] flex-1">
        <SearchBar value={searchQuery} onChange={handleSearch} onClear={() => handleSearch('')} />
        {!searchQuery && <CategoryFilters categories={DOC_CATEGORIES} activeCategory={activeCategory} onChange={setActiveCategory} counts={counts} />}

        {searchQuery && filteredDocs.length === 0 ? (
          <EmptySearchState query={searchQuery} onClear={() => handleSearch('')} />
        ) : (
          <div className="space-y-10">
            {groupedDocs.map(group => (
              <div key={group.id}>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-[1px] flex items-center">{`${group.label} (${group.items.length})`}</h3>
                  {group.items.length > 0 && (
                    <button onClick={() => handleExportCategory(group.label, group.id)} className="w-8 h-8 flex items-center justify-center rounded-[8px] bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] text-[#8E8E93] hover:text-[#111111] transition-colors">
                      <DownloadCloud size={14} strokeWidth={2} />
                    </button>
                  )}
                </div>
                
                {group.items.length === 0 ? (
                  <div className="text-center py-8 bg-white rounded-[12px] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] mb-8">
                    <p className="text-[#8E8E93] text-[14px] mb-4">No {group.label.toLowerCase()} documents yet</p>
                    <button onClick={() => alert('Add Document')} className="px-6 py-2.5 bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] text-[14px] font-semibold text-[#111111] hover:bg-[#F9F9F9] transition-colors mx-auto flex items-center gap-2">
                      <Plus size={16} /> Add Document
                    </button>
                  </div>
                ) : group.id === 'photos' ? (
                  <PhotosGrid photos={group.items} onViewAll={() => setActiveCategory('photos')} onViewPhoto={() => alert('Opening photo gallery')} />
                ) : (
                  <div className="space-y-3">
                    {group.items.map(doc => <DocumentCard key={doc.id} document={doc} onClick={() => alert('Opening document viewer')} />)}
                    {group.items.length > 3 && activeCategory === 'all' && (
                      <button onClick={() => setActiveCategory(group.id)} className="w-full py-3.5 text-[13px] font-semibold text-[#E56D48] bg-white rounded-[12px] border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] hover:bg-[#F9F9F9] transition-colors">
                        View All {group.label} ({group.items.length}) →
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Quick Actions Footer */}
        {!searchQuery && activeCategory === 'all' && (
          <div className="mt-12 mb-8">
            <h3 className="text-[12px] font-semibold text-[#8E8E93] uppercase tracking-[1px] mb-3">Quick Actions</h3>
            <div className="bg-white border border-[#ECECEC] shadow-[0_2px_8px_rgba(0,0,0,0.04)] rounded-[12px] overflow-hidden">
              {[
                { icon: Archive, label: 'Export all documents', onClick: () => showToast('✓ Documents exported') },
                { icon: DownloadCloud, label: 'Download by category', onClick: () => showToast('Select category...') },
                { icon: Printer, label: 'Print document bundle', onClick: () => showToast('Preparing print...') },
                { icon: Plus, label: 'Add new document', onClick: () => alert('Opening add dialog') }
              ].map((action, index) => (
                <React.Fragment key={index}>
                  <button onClick={action.onClick} className="w-full flex items-center gap-3 px-4 py-3 hover:bg-[#F9F9F9] transition-colors text-left active:scale-[0.99]">
                    <action.icon size={18} className="text-[#8E8E93]" strokeWidth={1.5} />
                    <span className="text-[15px] font-medium text-[#111111] flex-1">{action.label}</span>
                  </button>
                  {index < 3 && <div className="w-full h-[1px] bg-[#ECECEC] ml-11" />}
                </React.Fragment>
              ))}
            </div>
          </div>
        )}
      </div>
      </div>

      <GenericActionSheet isOpen={sheetConfig.isOpen} onClose={closeSheet} title={sheetConfig.title} options={sheetConfig.options} />
      <Toast message={toastMsg} isVisible={!!toastMsg} />
    </div>
  );
};

// --- APP SHELL (MAIN ENTRY POINT) ---
export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { const timer = setTimeout(() => setIsLoading(false), 500); return () => clearTimeout(timer); }, []);

  return (
    <div className="min-h-screen bg-[#E5E5E5] flex items-center justify-center sm:p-8 font-sans antialiased selection:bg-[#E56D48]/20 selection:text-[#E56D48]">
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { display: none; }
        .custom-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}} />

      <div className="relative w-full h-[100dvh] sm:h-[844px] sm:w-[390px] bg-[#FAFAFA] sm:rounded-[50px] shadow-2xl overflow-hidden sm:border-[8px] border-black sm:ring-1 sm:ring-gray-200">
        <div className="absolute top-[12px] left-1/2 transform -translate-x-1/2 w-[120px] h-[32px] bg-black rounded-full z-50 pointer-events-none hidden sm:block shadow-[inset_0_-1px_2px_rgba(255,255,255,0.1)]" />

        {isLoading ? (
          <div className="absolute inset-0 bg-[#FAFAFA] z-50 flex flex-col items-center justify-center">
            <p className="text-[14px] text-[#8E8E93] animate-pulse">Loading Documents...</p>
          </div>
        ) : (
          <div id="main-app-wrapper" className="absolute inset-0 w-full h-full bg-[#FAFAFA] origin-top">
            <VaultDocumentsScreen onBack={() => alert('Return to Vault Home')} />
          </div>
        )}
        <div id="modal-root" className="absolute inset-0 z-[100] pointer-events-none" />
      </div>
    </div>
  );
}