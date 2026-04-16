import React, { useState } from 'react';
import {
  ChevronLeft,
  MapPin,
  AlertTriangle,
  Eye,
  Navigation,
  Share2,
  Plus,
  X,
  Clock,
  Shield,
  AlertCircle,
  Info
} from 'lucide-react';

/**
 * 56_DANGER_REPORTS_v1.jsx
 * Community Safety Reports -- report and view hazardous areas
 * (poison baits, broken glass, aggressive dogs, icy paths).
 */

const DANGER_TYPES = [
  { id: 'poison', label: 'Poison Bait', icon: AlertTriangle, color: '#FF3B30' },
  { id: 'glass', label: 'Broken Glass', icon: AlertCircle, color: '#FF9500' },
  { id: 'dog', label: 'Aggressive Dog', icon: Shield, color: '#FFCC00' },
  { id: 'ice', label: 'Icy Path', icon: Info, color: '#007AFF' }
];

const MOCK_REPORTS = [
  { id: 1, type: 'poison', location: 'Lindenhof Park', timeAgo: '25 min ago', description: 'Suspicious meat pieces found near the fountain area. Multiple colored pellets visible inside.', confirms: 12, confirmed: false, coords: { x: 38, y: 42 } },
  { id: 2, type: 'glass', location: 'Seefeld Promenade', timeAgo: '1 hr ago', description: 'Broken bottle shards scattered across the walking path near the lake shore.', confirms: 7, confirmed: true, coords: { x: 65, y: 55 } },
  { id: 3, type: 'dog', location: 'Rieterpark', timeAgo: '2 hrs ago', description: 'Unleashed large dog showing aggressive behavior towards smaller dogs and people.', confirms: 4, confirmed: false, coords: { x: 45, y: 68 } },
  { id: 4, type: 'ice', location: 'Uetliberg Trail', timeAgo: '3 hrs ago', description: 'Steep section of the trail is completely frozen. Very slippery, no salt applied.', confirms: 9, confirmed: false, coords: { x: 22, y: 35 } },
  { id: 5, type: 'poison', location: 'Josefwiese', timeAgo: '4 hrs ago', description: 'Small white pellets found along the fence line near the dog park entrance.', confirms: 15, confirmed: true, coords: { x: 50, y: 28 } }
];

const getDangerType = (typeId) => DANGER_TYPES.find(t => t.id === typeId) || DANGER_TYPES[0];

/* ── Severity border color for cards ── */
const severityBorder = (type) => {
  switch (type) {
    case 'poison': return '#FF3B30';
    case 'glass':  return '#FF9500';
    case 'dog':    return '#FFCC00';
    case 'ice':    return '#007AFF';
    default:       return '#8E8E93';
  }
};

/* ── Map Pin ── */
const DangerPin = ({ report, onClick }) => {
  const type = getDangerType(report.type);
  const Icon = type.icon;
  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', left: `${report.coords.x}%`, top: `${report.coords.y}%`,
        transform: 'translate(-50%, -100%)', cursor: 'pointer'
      }}
    >
      <div style={{
        width: 32, height: 32,
        borderRadius: '50% 50% 50% 0', backgroundColor: type.color,
        transform: 'rotate(-45deg)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        boxShadow: `0 4px 12px ${type.color}44`
      }}>
        <Icon size={14} color="white" style={{ transform: 'rotate(45deg)' }} />
      </div>
    </div>
  );
};

/* ── Map Legend ── */
const MapLegend = () => (
  <div style={{
    position: 'absolute', bottom: 16, left: 16,
    backgroundColor: '#FFFFFF', borderRadius: 8, padding: '8px 12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)', display: 'flex', gap: 12,
    border: '1px solid rgba(0,0,0,0.03)'
  }}>
    {DANGER_TYPES.map(type => (
      <div key={type.id} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <div style={{ width: 8, height: 8, borderRadius: 9999, backgroundColor: type.color }} />
        <span style={{ fontSize: 11, color: '#6E6E73', fontWeight: 500 }}>{type.label.split(' ')[0]}</span>
      </div>
    ))}
  </div>
);

/* ── Map View ── */
const MapView = ({ reports, onSelectReport }) => (
  <div style={{ position: 'relative', flex: 1, backgroundColor: '#F2F2F7', overflow: 'hidden' }}>
    <svg viewBox="0 0 400 500" style={{ width: '100%', height: '100%', position: 'absolute', inset: 0 }}>
      <ellipse cx="280" cy="350" rx="120" ry="180" fill="#E8F0FE" opacity={0.6} />
      <path d="M160 250 Q200 230 240 250 Q280 270 320 250 L320 500 L160 500 Z" fill="#E8F0FE" opacity={0.4} />
      <g stroke="#DDDDE1" strokeWidth="1.5" fill="none" opacity={0.5}>
        <line x1="50" y1="100" x2="350" y2="100" />
        <line x1="50" y1="180" x2="350" y2="180" />
        <line x1="50" y1="260" x2="300" y2="260" />
        <line x1="80" y1="340" x2="250" y2="340" />
        <line x1="100" y1="50" x2="100" y2="400" />
        <line x1="200" y1="50" x2="200" y2="350" />
        <line x1="300" y1="50" x2="300" y2="300" />
      </g>
      <rect x="120" y="130" width="50" height="40" rx="8" fill="#D4EDDA" opacity={0.5} />
      <rect x="220" y="200" width="40" height="50" rx="8" fill="#D4EDDA" opacity={0.5} />
      <rect x="60" y="280" width="60" height="45" rx="8" fill="#D4EDDA" opacity={0.5} />
      <path d="M180 50 Q190 100 185 150 Q180 200 190 250 Q200 300 195 350" fill="none" stroke="#C5D9F0" strokeWidth="4" opacity={0.6} />
    </svg>
    {reports.map(report => (
      <DangerPin key={report.id} report={report} onClick={() => onSelectReport(report)} />
    ))}
    <button className="active:scale-[0.97] transition-all duration-[120ms]" style={{
      position: 'absolute', top: 16, right: 16, width: 40, height: 40, borderRadius: 12,
      backgroundColor: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
      border: '1px solid rgba(0,0,0,0.03)'
    }}>
      <Navigation size={18} color="#111111" />
    </button>
    <MapLegend />
  </div>
);

/* ── Report Card with severity border ── */
const ReportCard = ({ report }) => {
  const [confirmed, setConfirmed] = useState(report.confirmed);
  const [confirms, setConfirms] = useState(report.confirms);
  const type = getDangerType(report.type);
  const Icon = type.icon;

  const handleConfirm = () => {
    if (!confirmed) { setConfirms(c => c + 1); setConfirmed(true); }
  };

  return (
    <div className="bg-white rounded-[20px] p-5 shadow-[0_2px_8px_rgba(0,0,0,0.02),inset_0_0_0_1px_rgba(0,0,0,0.03)]"
      style={{ borderLeft: `3px solid ${severityBorder(report.type)}` }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 34, height: 34, borderRadius: 9999, backgroundColor: `${type.color}14`,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <Icon size={18} color={type.color} />
          </div>
          <div>
            <span style={{ fontSize: 13, fontWeight: 600, color: type.color, display: 'block', lineHeight: 1 }}>{type.label}</span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
              <MapPin size={12} color="#6E6E73" />
              <span style={{ fontSize: 13, color: '#6E6E73' }}>{report.location}</span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Clock size={12} color="#8E8E93" />
          <span style={{ fontSize: 12, color: '#8E8E93' }}>{report.timeAgo}</span>
        </div>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 15, lineHeight: 1.5, color: '#111111', opacity: 0.9, margin: '0 0 14px',
        display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden'
      }}>
        {report.description}
      </p>

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={handleConfirm} className="active:scale-[0.97] transition-all duration-[120ms]" style={{
          display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px', borderRadius: 9999,
          backgroundColor: confirmed ? 'rgba(232,93,42,0.08)' : '#F2F2F7',
          border: 'none', cursor: 'pointer'
        }}>
          <AlertTriangle size={14} color={confirmed ? '#E85D2A' : '#6E6E73'} />
          <span style={{ fontSize: 13, fontWeight: 500, color: confirmed ? '#E85D2A' : '#6E6E73' }}>{confirms}</span>
        </button>
        <button className="active:scale-[0.97] transition-all duration-[120ms]" style={{
          width: 32, height: 32, borderRadius: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center',
          background: 'none', border: 'none', cursor: 'pointer'
        }}>
          <Share2 size={16} color="#8E8E93" />
        </button>
      </div>
    </div>
  );
};

/* ── Feed View ── */
const FeedView = ({ reports }) => (
  <div style={{ flex: 1, overflowY: 'auto', padding: '0 20px 20px', display: 'flex', flexDirection: 'column', gap: 14 }}>
    {reports.map(report => <ReportCard key={report.id} report={report} />)}
  </div>
);

/* ── Report Modal ── */
const ReportModal = ({ isOpen, onClose }) => {
  const [selectedType, setSelectedType] = useState('poison');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  return (
    <>
      <div onClick={onClose} className="absolute inset-0 bg-black/40 backdrop-blur-[2px] z-50" style={{ transition: 'opacity 200ms ease' }} />
      <div className="absolute bottom-0 left-0 right-0 z-[51] bg-white rounded-t-[20px] shadow-[0_-8px_40px_rgba(0,0,0,0.12)]" style={{ padding: '12px 20px 34px', maxHeight: '75%', overflowY: 'auto' }}>
        {/* Drag handle */}
        <div className="w-full flex flex-col items-center pt-2 pb-3">
          <div className="w-10 h-1 rounded-full bg-[#D1D1D6]" />
        </div>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 600, color: '#111111', margin: 0 }}>New Report</h2>
          <button onClick={onClose} className="active:scale-[0.97] transition-all duration-[120ms]" style={{
            width: 32, height: 32, borderRadius: 9999, backgroundColor: '#F2F2F7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', border: 'none', cursor: 'pointer'
          }}>
            <X size={16} color="#6E6E73" />
          </button>
        </div>

        {/* Type selector */}
        <div style={{ marginBottom: 20 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 10 }}>Type</span>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {DANGER_TYPES.map(type => {
              const isActive = selectedType === type.id;
              const TypeIcon = type.icon;
              return (
                <button key={type.id} onClick={() => setSelectedType(type.id)}
                  className="active:scale-[0.96] transition-all duration-[180ms]"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6, padding: '8px 14px', borderRadius: 9999,
                    backgroundColor: isActive ? `${type.color}14` : '#F2F2F7',
                    border: isActive ? `1.5px solid ${type.color}` : '1.5px solid transparent',
                    cursor: 'pointer'
                  }}>
                  <TypeIcon size={14} color={isActive ? type.color : '#8E8E93'} />
                  <span style={{ fontSize: 13, fontWeight: 500, color: isActive ? type.color : '#6E6E73' }}>{type.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Location input */}
        <div style={{ marginBottom: 16 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Location</span>
          <div className="w-full h-[52px] px-4 bg-[#F9F9FB] border border-black/[0.04] rounded-[16px] flex items-center gap-3">
            <MapPin size={16} color="#8E8E93" />
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="Enter location or use current"
              className="flex-1 text-[16px] text-[#111111] placeholder:text-[#8E8E93] bg-transparent border-none outline-none focus:outline-none"
              style={{ fontFamily: 'inherit' }} />
            <Navigation size={16} color="#E85D2A" style={{ cursor: 'pointer' }} />
          </div>
        </div>

        {/* Description */}
        <div style={{ marginBottom: 24 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: '#8E8E93', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: 8 }}>Description</span>
          <textarea value={description} onChange={e => setDescription(e.target.value)} placeholder="Describe what you found..." rows={3}
            className="w-full px-4 py-3 bg-[#F9F9FB] border border-black/[0.04] rounded-[16px] text-[16px] text-[#111111] placeholder:text-[#8E8E93] focus:outline-none focus:border-[#E85D2A] focus:ring-4 focus:ring-[#E85D2A]/10 transition-all duration-200"
            style={{ fontFamily: 'inherit', resize: 'none', lineHeight: 1.5, boxSizing: 'border-box' }} />
        </div>

        {/* Submit */}
        <button className="active:scale-[0.97] transition-all duration-[120ms]" style={{
          width: '100%', padding: '15px 0', borderRadius: 16,
          background: 'linear-gradient(to bottom, #FF7240, #E85D2A)',
          color: '#FFFFFF', fontSize: 16, fontWeight: 600, textAlign: 'center',
          border: 'none', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.02), inset 0 0 0 1px rgba(0,0,0,0.03)'
        }}>
          Submit Report
        </button>
      </div>
    </>
  );
};

/* ── Main Screen ── */
export default function Screen_56_DANGER_REPORTS_v1() {
  const [activeTab, setActiveTab] = useState('map');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
        .wallet-scroll::-webkit-scrollbar { display: none; }
        .wallet-scroll { scrollbar-width: none; }
      `}</style>

      <div style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        backgroundColor: '#E5E5E5', padding: 20,
        fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif'
      }}>
        <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: '#F9F9FB' }}>
          {/* Notch */}
          <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
          {/* Home Indicator */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />

          {/* Status Bar */}
          <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
            <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
            <div className="flex items-center gap-1">
              <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
              <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
            </div>
          </div>

          {/* Floating Header */}
          <header className="absolute top-0 left-0 w-full z-40 pointer-events-none bg-gradient-to-b from-white/95 via-white/70 to-transparent" style={{ paddingTop: 56, paddingBottom: 24, paddingLeft: 20, paddingRight: 20 }}>
            <div className="flex justify-between items-center w-full pointer-events-auto">
              <button onClick={() => window.history.back()}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]">
                <ChevronLeft size={22} color="#111111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111111]">Safety Reports</h2>
              <div className="w-[44px]" />
            </div>
          </header>

          {/* Content */}
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column' }}>
            <div className="wallet-scroll" style={{ flex: 1, paddingTop: 100, paddingBottom: 40, overflowY: 'auto' }}>
              <div style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(844px - 100px - 40px)' }}>

                {/* Tab toggle */}
                <div style={{ margin: '0 20px 16px', padding: 3, borderRadius: 12, backgroundColor: '#F2F2F7', display: 'flex', flexShrink: 0 }}>
                  {['map', 'feed'].map(tab => {
                    const isActive = activeTab === tab;
                    return (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        className="active:scale-[0.97] transition-all duration-[120ms]"
                        style={{
                          flex: 1, padding: '8px 0', textAlign: 'center', fontSize: 14, fontWeight: 600,
                          borderRadius: 10, cursor: 'pointer', border: 'none',
                          backgroundColor: isActive ? '#FFFFFF' : 'transparent',
                          color: isActive ? '#111111' : '#6E6E73',
                          boxShadow: isActive ? '0 2px 8px rgba(0,0,0,0.04)' : 'none'
                        }}>
                        {tab === 'map' ? 'Map' : 'Feed'}
                      </button>
                    );
                  })}
                </div>

                {activeTab === 'map' ? (
                  <MapView reports={MOCK_REPORTS} onSelectReport={setSelectedReport} />
                ) : (
                  <FeedView reports={MOCK_REPORTS} />
                )}

                {/* FAB */}
                <button onClick={() => setModalOpen(true)}
                  className="active:scale-[0.95] transition-all duration-[120ms]"
                  style={{
                    position: 'absolute', bottom: 34, right: 20,
                    width: 52, height: 52, borderRadius: 9999,
                    background: 'linear-gradient(to bottom, #FF7240, #E85D2A)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgba(232,93,42,0.3)', zIndex: 30,
                    border: 'none', cursor: 'pointer'
                  }}>
                  <Plus size={24} color="#FFFFFF" />
                </button>

                <ReportModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
