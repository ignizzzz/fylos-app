import React, { useState, useEffect, useRef } from 'react';
import { 
  Calendar, ChevronLeft, ChevronRight, Check, X, Star, MapPin, 
  Shield, Clock, Plus, Minus, Siren, Heart, Share2, Navigation, Signal, 
  Wifi, Battery, Dog, Bell, Car, Footprints, Sparkles, ChevronDown, 
  User as UserIcon, MessageCircle
} from 'lucide-react';

// --- STYLES & ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #F9FAFB; color: #1A1A1A; }
    .font-brand { font-family: 'Nunito', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideUpBar { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes slideUpFade { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes fill-dot { 0% { transform: scale(0); } 100% { transform: scale(1); } }
    
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-up-bar { animation: slideUpBar 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-up-fade { animation: slideUpFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    .animate-fill-dot { animation: fill-dot 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    
    .active-press:active { transform: scale(0.97); transition: transform 0.1s; }
    
    /* Smooth Transitions for Header */
    .transition-all-smooth { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
  `}</style>
);

// --- DATA MOCKS ---
const PROVIDER_DATA = { 
    id: 1, 
    name: 'Zürich Paws Grooming', 
    type: 'Grooming', 
    rating: 4.9, 
    reviews: 124, 
    dist: '1.2km', 
    price: 85, 
    currency: 'CHF ',
    unit: '/session',
    image: 'https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&q=80',
    status: 'Open',
    tags: ['Bath', 'Haircut', 'Spa'],
    description: "We treat every pet like family in our calm, organic studio. Come visit us in the heart of Seefeld for a stress-free spa day!",
    team: [
        {
            id: 't1',
            name: 'Sarah', 
            role: 'Head Groomer', 
            img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80',
            bio: 'With over 8 years of experience, Sarah specializes in creative styling and helping anxious pets feel at ease.',
            tags: ['Anxious Pets', 'Styling']
        },
        {
            id: 't2',
            name: 'Tom', 
            role: 'Assistant', 
            img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80',
            bio: 'Tom is a certified dog lover who ensures safety and hygiene. He has a special talent for handling large, energetic breeds.',
            tags: ['Large Breeds', 'Safety']
        }
    ],
    menu: [
        { 
            id: 's1', 
            name: 'Bath & Tidy', 
            price: 'CHF 85', 
            rawPrice: 85, 
            duration: '1h',
            desc: 'Includes warm bath, blow dry, ear cleaning, and nail trim. Best for short-haired breeds.',
            available: true
        }, 
        { 
            id: 's2', 
            name: 'Full Grooming', 
            price: 'CHF 140', 
            rawPrice: 140, 
            duration: '2h',
            desc: 'Complete styling package with haircut, bath, styling, and hygiene care. Perfect for poodles & doodles.',
            available: true
        },
        { 
            id: 's3', 
            name: 'Puppy Intro', 
            price: 'CHF 60', 
            rawPrice: 60, 
            duration: '45m',
            desc: 'A gentle first experience to get your puppy used to the sounds and sensations of grooming.',
            available: false 
        } 
    ],
    verified: true,
    travelTime: '12 min drive',
    emergency: false
};

const MOCK_REVIEWS = [
    { id: 1, name: 'Maria K.', rating: 5, text: 'Sarah was amazing with my nervous poodle. Highly recommend!', date: '2 days ago' },
    { id: 2, name: 'John D.', rating: 5, text: 'Best grooming service in Zurich. Very clean and professional.', date: '1 week ago' },
    { id: 3, name: 'Elena S.', rating: 4, text: 'Great cut, but booking was a bit tight. Worth the wait though.', date: '2 weeks ago' },
    { id: 4, name: 'Peter M.', rating: 5, text: 'My dog actually looks forward to going here!', date: '3 weeks ago' },
];

const MOCK_HOURS = [
    { day: 'Mon', hours: '09:00 - 19:00' },
    { day: 'Tue', hours: '09:00 - 19:00' },
    { day: 'Wed', hours: '09:00 - 19:00' },
    { day: 'Thu', hours: '09:00 - 19:00' },
    { day: 'Fri', hours: '09:00 - 18:00' },
    { day: 'Sat', hours: '10:00 - 16:00' },
    { day: 'Sun', hours: 'Closed' },
];

// --- REUSABLE COMPONENTS ---

const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[60] text-[13px] font-semibold tracking-wide text-[#1A1A1A]">
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal size={16} strokeWidth={2.5} />
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={18} strokeWidth={2.5} />
    </div>
  </div>
);

const Toast = ({ message }) => (
  <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[90] bg-[#1A1A1A] text-white px-5 py-3 rounded-full shadow-xl flex items-center gap-3 animate-fade-in whitespace-nowrap">
    <div className="w-5 h-5 rounded-full bg-[#FF5500] flex items-center justify-center">
      <Check size={12} className="text-white" strokeWidth={3} />
    </div>
    <span className="text-xs font-bold tracking-wide font-brand">{message}</span>
  </div>
);

// --- SHEET COMPONENTS ---

const TeamMemberSheet = ({ member, onClose }) => {
    if (!member) return null;
    return (
        <div className="absolute inset-0 z-[80] flex items-end justify-center">
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            <div className="bg-white w-full rounded-t-[32px] p-6 shadow-2xl animate-slide-up-bar relative z-10 flex flex-col items-center text-center">
                <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-50 rounded-full hover:bg-gray-100 transition-colors">
                    <X size={18} className="text-gray-400" />
                </button>
                <div className="w-20 h-20 rounded-full p-1 border-2 border-gray-100 mb-3 shadow-sm">
                    <img src={member.img} className="w-full h-full rounded-full object-cover" />
                </div>
                <h3 className="text-lg font-black text-[#1A1A1A] font-brand mb-0.5">{member.name}</h3>
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-4">{member.role}</span>
                <p className="text-sm text-gray-500 font-medium leading-relaxed mb-6 max-w-[280px]">{member.bio}</p>
                <div className="flex gap-2 justify-center w-full mb-2">
                    {member.tags.map(tag => (
                        <span key={tag} className="px-3 py-1.5 bg-[#FAFAF9] border border-gray-100 rounded-xl text-[10px] font-extrabold text-[#1A1A1A] flex items-center gap-1">
                            <Sparkles size={10} className="text-[#FF5500]" /> {tag}
                        </span>
                    ))}
                </div>
                <div className="h-4"></div>
            </div>
        </div>
    );
};

const InfoSheet = ({ provider, onClose }) => {
    const [expandedReviews, setExpandedReviews] = useState(false);
    
    // Determine status message and color
    let statusText = "Open until 19:00";
    let statusColor = "bg-green-500";
    
    if (provider.status === 'Closing Soon') {
        statusText = "Closes in 35 min";
        statusColor = "bg-orange-500";
    } else if (provider.status === 'Closed') {
        statusText = "Closed now, opens tomorrow at 09:00";
        statusColor = "bg-red-500";
    }

    const hasReviews = MOCK_REVIEWS.length > 0;
    const displayedReviews = expandedReviews ? MOCK_REVIEWS : MOCK_REVIEWS.slice(0, 3);

    return (
        <div className="absolute inset-0 z-[80] flex items-end justify-center">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            
            {/* Sheet */}
            <div className="bg-[#FAFAF9] w-full rounded-t-[32px] shadow-2xl animate-slide-up-bar relative z-10 flex flex-col h-[85%] overflow-hidden">
                {/* Drag Handle */}
                <div className="w-full flex justify-center pt-3 pb-1" onClick={onClose}>
                    <div className="w-10 h-1 bg-gray-300 rounded-full"></div>
                </div>

                {/* Header */}
                <div className="px-6 pb-4 flex justify-between items-center bg-[#FAFAF9]">
                    <h2 className="text-xl font-black text-[#1A1A1A] font-brand">Info</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={18} className="text-[#1A1A1A]" />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 pb-8 space-y-8">
                    
                    {/* Hours Section */}
                    <div>
                        <div className="flex items-center gap-2 mb-4 bg-white p-3 rounded-xl shadow-sm border border-gray-100">
                            <div className={`w-2 h-2 rounded-full ${statusColor} animate-pulse`}></div>
                            <span className="text-sm font-bold text-[#1A1A1A]">Σήμερα: {statusText}</span>
                        </div>
                        
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Weekly hours</h3>
                        <div className="bg-white rounded-[24px] border border-gray-100 p-4 space-y-2.5 shadow-sm">
                            {MOCK_HOURS.map((h, i) => (
                                <div key={i} className="flex justify-between items-center text-xs font-medium">
                                    <span className={h.day === 'Wed' ? 'text-[#1A1A1A] font-bold' : 'text-gray-500'}>{h.day}</span>
                                    <span className={h.day === 'Wed' ? 'text-[#1A1A1A] font-bold' : 'text-gray-500'}>{h.hours}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Ratings & Reviews Section */}
                    <div>
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Ratings & reviews</h3>
                        
                        {hasReviews ? (
                            <>
                                {/* Summary */}
                                <div className="bg-white rounded-[24px] border border-gray-100 p-5 shadow-sm mb-4">
                                    <div className="flex items-center gap-4 mb-4">
                                        <div className="text-center">
                                            <span className="text-4xl font-black text-[#1A1A1A] font-brand block leading-none">{provider.rating}</span>
                                            <div className="flex gap-0.5 mt-1 justify-center">
                                                {[1,2,3,4,5].map(s => <Star key={s} size={10} className="fill-current text-[#FF5500]"/>)}
                                            </div>
                                            <span className="text-[10px] text-gray-400 font-bold mt-1 block">{provider.reviews} reviews</span>
                                        </div>
                                        <div className="flex-1 space-y-1">
                                            {[5,4,3,2,1].map((s, i) => (
                                                <div key={s} className="flex items-center gap-2">
                                                    <span className="text-[10px] font-bold text-gray-400 w-2">{s}</span>
                                                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                                        <div className="h-full bg-[#FF5500]" style={{ width: i === 0 ? '80%' : i === 1 ? '15%' : '2%' }}></div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Review List */}
                                <div className="space-y-3">
                                    {displayedReviews.map(review => (
                                        <div key={review.id} className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm">
                                            <div className="flex justify-between items-start mb-2">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-black text-gray-500">
                                                        {review.name.substring(0, 2).toUpperCase()}
                                                    </div>
                                                    <div>
                                                        <span className="text-xs font-bold text-[#1A1A1A] block">{review.name}</span>
                                                        <span className="text-[10px] text-gray-400">{review.date}</span>
                                                    </div>
                                                </div>
                                                <div className="flex gap-0.5">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star key={i} size={10} className={i < review.rating ? 'fill-current text-[#FF5500]' : 'text-gray-200'} />
                                                    ))}
                                                </div>
                                            </div>
                                            <p className="text-xs text-gray-600 leading-relaxed font-medium">
                                                "{review.text}"
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                {/* See All Button */}
                                {!expandedReviews && (
                                    <button 
                                        onClick={() => setExpandedReviews(true)}
                                        className="w-full mt-4 py-3 rounded-[16px] bg-white border border-gray-200 text-xs font-extrabold text-[#1A1A1A] hover:bg-gray-50 transition-colors active-press"
                                    >
                                        See all reviews
                                    </button>
                                )}
                            </>
                        ) : (
                            // Fallback for no reviews
                            <div className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-sm flex flex-col items-center justify-center text-center">
                                <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mb-3 text-gray-300">
                                    <MessageCircle size={20} />
                                </div>
                                <p className="text-sm font-bold text-gray-400">No reviews yet</p>
                                <p className="text-xs text-gray-300 mt-1">Be the first to share your experience!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- PROVIDER PROFILE (THE AD) ---

const ProviderProfile = ({ provider, onBookClick }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const [scrollProgress, setScrollProgress] = useState(0);
    const [quantities, setQuantities] = useState({});
    const [expandedServiceId, setExpandedServiceId] = useState(null);
    const [selectedMember, setSelectedMember] = useState(null); 
    const [showInfo, setShowInfo] = useState(false); // State for Info Sheet
    const [showScrollHint, setShowScrollHint] = useState(true); // New Scroll Hint State
    
    // Toggle this to test pet profile fallback logic
    const hasActivePet = true; 

    // Auto-hide scroll hint after 4 seconds
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowScrollHint(false);
        }, 4000);
        return () => clearTimeout(timer);
    }, []);

    const handleScroll = (e) => {
        const scrollTop = e.target.scrollTop;
        
        // Logic for Sticky Header Transition
        const progress = Math.min(Math.max((scrollTop - 260) / 60, 0), 1);
        setScrollProgress(progress);

        // Hide scroll hint immediately on user interaction
        if (scrollTop > 20 && showScrollHint) {
            setShowScrollHint(false);
        }
    };

    const updateQuantity = (id, delta) => {
        setQuantities(prev => {
            const current = prev[id] || 0;
            const next = Math.max(0, current + delta);
            const newQuantities = { ...prev, [id]: next };
            if (next === 0) delete newQuantities[id];
            return newQuantities;
        });
    };

    const toggleServiceExpand = (id) => {
        setExpandedServiceId(prev => prev === id ? null : id);
    };

    const totalItems = Object.values(quantities).reduce((a, b) => a + b, 0);
    const totalPrice = Object.entries(quantities).reduce((sum, [id, qty]) => {
        const item = provider.menu.find(m => m.id === id);
        return sum + (item.rawPrice * qty);
    }, 0);
    const hasSelection = totalItems > 0;

    const getMainSelectedService = () => {
        const selectedId = Object.keys(quantities)[0];
        return provider.menu.find(m => m.id === selectedId);
    };

    return (
        <div className="absolute inset-0 bg-[#FAFAF9] z-[10] flex flex-col">
            
            {/* Scroll Hint Overlay */}
            {showScrollHint && (
                <div className="absolute bottom-24 left-1/2 -translate-x-1/2 z-40 flex flex-col items-center animate-bounce pointer-events-none transition-opacity duration-500 opacity-90">
                    <span className="text-[10px] font-bold text-gray-500 bg-white/90 px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm border border-gray-100 tracking-wide">
                        Scroll to see services
                    </span>
                    <ChevronDown size={16} className="text-gray-400 mt-1" strokeWidth={2.5} />
                </div>
            )}

            {/* Modals */}
            {selectedMember && (
                <TeamMemberSheet 
                    member={selectedMember} 
                    onClose={() => setSelectedMember(null)} 
                />
            )}
            {showInfo && (
                <InfoSheet 
                    provider={provider} 
                    onClose={() => setShowInfo(false)} 
                />
            )}

            {/* STICKY HEADER WITH ACTIONS */}
            <div 
                className="absolute top-0 left-0 w-full pt-[60px] pb-3 z-[50] flex items-center justify-center bg-white/95 backdrop-blur-sm border-b border-gray-100 transition-all duration-300"
                style={{ 
                    opacity: scrollProgress,
                    transform: `translateY(${scrollProgress === 0 ? -10 : 0}px)`,
                    pointerEvents: scrollProgress === 0 ? 'none' : 'auto'
                }}
            >
                <div className="flex flex-col items-center">
                    <span className="text-xs font-black text-[#1A1A1A] font-brand tracking-wide mb-0.5">
                        {provider.name}
                    </span>
                    <div className="flex items-center gap-1.5 opacity-80 cursor-pointer" onClick={() => setShowInfo(true)}>
                        <span className="text-[10px] font-bold text-green-600">{provider.status}</span>
                        <span className="text-[8px] text-gray-300">●</span>
                        <span className="text-[10px] font-bold text-[#1A1A1A] flex items-center gap-0.5">
                            <Star size={8} className="text-[#FF5500] fill-current"/> {provider.rating}
                        </span>
                    </div>
                </div>

                <div className="absolute right-5 flex gap-3">
                    <button onClick={() => setIsFavorite(!isFavorite)} className="active-press transition-transform">
                        <Heart size={18} className={isFavorite ? 'text-[#FF5500] fill-current' : 'text-[#1A1A1A]'} />
                    </button>
                    <button className="active-press transition-transform">
                        <Share2 size={18} className="text-[#1A1A1A]" />
                    </button>
                </div>
            </div>

            {/* Scrollable Container */}
            <div 
                className="flex-1 overflow-y-auto no-scrollbar relative pb-32"
                onScroll={handleScroll}
            >
                {/* Hero Image Header */}
                <div className="relative h-[320px] w-full shrink-0">
                    <img src={provider.image} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-[#FAFAF9]"></div>
                    
                    {/* Nav Buttons */}
                    <div className="absolute top-[60px] left-6 z-[60]">
                        <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active-press border border-white/30 shadow-lg hover:bg-white/30 transition-colors">
                            <ChevronLeft size={20}/>
                        </button>
                    </div>
                    <div className="absolute top-[60px] right-6 flex gap-3 z-[60]">
                        <button onClick={() => setIsFavorite(!isFavorite)} className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors active-press ${isFavorite ? 'text-[#FF5500] fill-current bg-white shadow-md' : 'text-white bg-black/20 backdrop-blur-sm'}`}>
                            <Heart size={16} fill={isFavorite ? 'currentColor' : 'none'}/>
                        </button>
                        <button className="w-8 h-8 rounded-full bg-black/20 backdrop-blur-sm flex items-center justify-center text-white active-press transition-colors">
                            <Share2 size={16}/>
                        </button>
                    </div>

                    {/* Info Overlay (Floating Card) */}
                    <div className="absolute bottom-0 left-5 right-5 translate-y-1/4 p-6 bg-white rounded-[32px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
                        <div className="flex justify-between items-start mb-3">
                            <h1 className="text-2xl font-black text-[#1A1A1A] font-brand leading-tight w-full">{provider.name}</h1>
                        </div>
                        
                        {/* Compact Meta Info - CLICKABLE */}
                        <div 
                            className="flex items-center gap-3 text-[11px] text-gray-500 font-bold cursor-pointer active:opacity-70 transition-opacity"
                            onClick={() => setShowInfo(true)}
                        >
                            <div className="flex items-center gap-1">
                                <Star size={12} className="text-[#FF5500] fill-current"/>
                                <span className="text-[#1A1A1A]">{provider.rating}</span>
                            </div>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <span className="text-green-600">{provider.status}</span>
                            <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                            <div className="flex items-center gap-1">
                                <Car size={12} className="text-gray-400"/>
                                <span>{provider.travelTime}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="px-5 pt-24">
                    
                    {/* About Section */}
                    <div className="mb-6">
                        <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1 font-brand">About</h3>
                        <p className="text-sm text-[#1A1A1A] leading-relaxed font-medium">{provider.description}</p>
                    </div>

                    {/* Pet Match Indicator */}
                    <div className="mb-8 bg-green-50 p-4 rounded-[24px] border border-green-100 flex items-center gap-4 animate-scale-in origin-left">
                        <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 shrink-0">
                            <Footprints size={18} fill="currentColor" />
                        </div>
                        <div>
                            {hasActivePet ? (
                                <>
                                    <p className="text-sm font-bold text-green-800">Great Match for Baxter!</p>
                                    <p className="text-[11px] text-green-600 mt-0.5 font-medium">Specializes in large breeds and anxious pets.</p>
                                </>
                            ) : (
                                <>
                                    <p className="text-sm font-bold text-green-800">Good fit for most pets</p>
                                    <p className="text-[11px] text-green-600 mt-0.5 font-medium">Experienced with various breeds and temperaments.</p>
                                </>
                            )}
                        </div>
                    </div>

                    {/* Location Snippet (Subtle Map) */}
                    <div className="mb-8">
                        <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1 font-brand">Location</h3>
                        <div className="h-20 bg-[#F9F5F1] rounded-[24px] relative overflow-hidden border border-gray-100 shadow-inner group cursor-pointer grayscale-[30%] opacity-90 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                              <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight="0" 
                                marginWidth="0" 
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=8.53,47.36,8.56,47.38&layer=mapnik&marker=${47.37},${8.55}`}
                                style={{ filter: 'grayscale(100%) opacity(0.5) contrast(0.8) brightness(1.1)' }} 
                                className="w-full h-full pointer-events-none"
                              ></iframe>
                              <button className="absolute bottom-2 right-3 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 text-[10px] font-extrabold text-[#1A1A1A] border border-gray-100 active-press z-10 hover:bg-white transition-colors">
                                  <Navigation size={10} className="text-gray-400"/> Directions
                              </button>
                        </div>
                    </div>

                    {/* Service Menu */}
                    <div className="mb-8">
                        <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1 font-brand">Services</h3>
                        <div className="space-y-3">
                            {provider.menu.map((item) => {
                                const count = quantities[item.id] || 0;
                                const isAdded = count > 0;
                                const isExpanded = expandedServiceId === item.id;
                                const isUnavailable = item.available === false;

                                return (
                                    <div 
                                        key={item.id} 
                                        onClick={() => !isUnavailable && toggleServiceExpand(item.id)}
                                        className={`w-full p-4 rounded-[24px] border transition-all cursor-pointer ${
                                            isUnavailable 
                                                ? 'bg-gray-50 border-gray-100 opacity-60 cursor-default'
                                                : isAdded 
                                                    ? 'bg-[#FF5500]/5 border-[#FF5500]/10' 
                                                    : isExpanded
                                                        ? 'bg-white border-gray-200 shadow-md'
                                                        : 'bg-white border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] active:scale-[0.99] active:shadow-none'
                                        }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <div className="text-left flex-1">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-sm font-extrabold text-[#1A1A1A] block mb-1 font-brand">{item.name}</span>
                                                    {!isUnavailable && <ChevronDown 
                                                        size={14} 
                                                        className={`text-gray-300 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                                                    />}
                                                </div>
                                                <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1">{item.duration}</span>
                                            </div>
                                            <div className="flex items-center gap-5">
                                                {/* Price or Unavailable State */}
                                                
                                                {isUnavailable ? (
                                                    <span className="text-[10px] font-bold text-gray-400 bg-gray-100 px-2 py-1 rounded-lg">Fully Booked</span>
                                                ) : (
                                                    <span className="text-lg font-black text-[#1A1A1A] font-brand">{item.price}</span>
                                                )}
                                                
                                                {/* Add Button / Counter - Stop propagation */}
                                                {!isUnavailable && (
                                                    <div onClick={(e) => e.stopPropagation()}>
                                                        {isAdded ? (
                                                            <div className="flex items-center gap-3 bg-[#1A1A1A] text-white p-1 rounded-full animate-scale-in">
                                                                <button onClick={() => updateQuantity(item.id, -1)} className="w-7 h-7 flex items-center justify-center active-press hover:text-gray-300">
                                                                    <Minus size={14} strokeWidth={3} />
                                                                </button>
                                                                <span className="text-xs font-bold w-2 text-center">{count}</span>
                                                                <button onClick={() => updateQuantity(item.id, 1)} className="w-7 h-7 flex items-center justify-center active-press hover:text-gray-300">
                                                                    <Plus size={14} strokeWidth={3} />
                                                                </button>
                                                            </div>
                                                        ) : (
                                                            <button 
                                                                onClick={() => updateQuantity(item.id, 1)}
                                                                className="w-9 h-9 rounded-full bg-[#FAFAF9] hover:bg-[#FF5500] flex items-center justify-center transition-all border border-gray-100 hover:border-[#FF5500] group active-press"
                                                            >
                                                                <Plus size={18} className="text-gray-400 group-hover:text-white transition-colors"/>
                                                            </button>
                                                        )}
                                                    </div>
                                                )}
                                                {isUnavailable && (
                                                    <button className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center border border-gray-200">
                                                        <Bell size={16} className="text-gray-400" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>

                                        {/* Accordion Description */}
                                        {!isUnavailable && (
                                            <div 
                                                className={`overflow-hidden transition-all duration-300 ease-in-out ${isExpanded ? 'max-h-20 opacity-100 mt-3' : 'max-h-0 opacity-0 mt-0'}`}
                                            >
                                                <p className="text-[11px] text-gray-500 font-medium leading-relaxed pr-4 border-t border-gray-100 pt-3">
                                                    {item.desc}
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Team Section (Moved after Services) */}
                    <div className="mb-8">
                        <div className="flex justify-between items-end mb-3">
                            <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest ml-1 font-brand">Team</h3>
                        </div>
                        <div className="flex gap-2 overflow-x-auto no-scrollbar">
                            {provider.team.map((member, i) => (
                                <div 
                                    key={i} 
                                    onClick={() => setSelectedMember(member)}
                                    className="flex items-center gap-2.5 bg-white p-2 pr-4 rounded-full border border-gray-100 shadow-sm shrink-0 active-press cursor-pointer hover:border-gray-200 transition-colors"
                                >
                                    <img src={member.img} className="w-8 h-8 rounded-full object-cover ring-2 ring-gray-50"/>
                                    <div>
                                        <span className="text-xs font-bold block text-[#1A1A1A]">{member.name}</span>
                                        <span className="text-[9px] text-gray-400 font-bold tracking-wide">{member.role}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Sticky Bottom Bar */}
            <div 
                className={`absolute bottom-0 w-full p-6 bg-[#FAFAF9] border-t border-gray-100 z-50 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] transition-transform duration-500 ${scrollProgress > 0 ? 'translate-y-0' : 'translate-y-full'}`}
            >
                <button 
                    onClick={() => hasSelection && onBookClick(getMainSelectedService())}
                    disabled={!hasSelection}
                    className={`w-full py-5 rounded-[28px] font-extrabold text-sm transition-all active-press flex items-center justify-center gap-2 ${
                        hasSelection 
                        ? 'bg-[#1A1A1A] text-white shadow-xl shadow-black/10 hover:bg-black' 
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {hasSelection ? `Continue · CHF ${totalPrice}` : 'Select services to continue'}
                </button>
            </div>
        </div>
    );
}

// --- BOOKING FLOW ---

const BookingFlow = ({ provider, service, onClose, showToast }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarSync, setCalendarSync] = useState(true);
  const [note, setNote] = useState("");
  const scrollRef = useRef(null);

  const dates = [
    { d: 22, day: 'Mo', busy: 'low' }, 
    { d: 23, day: 'Tu', busy: 'med' }, 
    { d: 24, day: 'We', busy: 'high' }, 
    { d: 25, day: 'Th', busy: 'low' }, 
    { d: 26, day: 'Fr', busy: 'full' }, 
    { d: 27, day: 'Sa', busy: 'med' }, 
    { d: 28, day: 'Su', busy: 'low' }
  ];
  
  const slots = ['09:00', '10:30', '11:00', '13:00', '14:30', '16:00'];

  const handleBook = () => { setStep(2); };

  // Auto scroll to bottom when slot is selected
  useEffect(() => {
    if (selectedSlot && scrollRef.current) {
      setTimeout(() => {
        if (scrollRef.current) {
          const element = scrollRef.current;
          element.scrollTop = element.scrollHeight - element.clientHeight;
        }
      }, 300);
    }
  }, [selectedSlot]);

  // Feature 10: Post-Booking "Calm" Screen
  if (step === 2) return (
      <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col items-center justify-center animate-fade-in">
          <div className="w-[320px] bg-white p-8 rounded-[40px] shadow-2xl border border-gray-50 flex flex-col items-center text-center animate-slide-up relative overflow-hidden">
              <div className="w-24 h-24 rounded-full border-[4px] border-[#FAFAF9] shadow-inner flex items-center justify-center mb-8 bg-green-50">
                  <div className="w-20 h-20 bg-[#FF5500] rounded-full animate-fill-dot origin-center shadow-lg shadow-orange-500/30 flex items-center justify-center">
                      <Check size={40} className="text-white animate-scale-in" strokeWidth={4} />
                  </div>
              </div>
              <h2 className="text-2xl font-black font-brand text-[#1A1A1A] mb-3">All set, Nikos!</h2>
              <p className="text-gray-500 text-sm font-medium mb-8 leading-relaxed">
                  Your appointment for <br/><span className="text-[#1A1A1A] font-bold">{service?.name || 'Grooming'}</span> is confirmed.
              </p>
              
              <div className="w-full bg-[#FAFAF9] rounded-[24px] p-5 mb-8 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">DATE</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">TIME</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-base font-black text-[#1A1A1A]">Oct {selectedDate}</span>
                      <span className="text-base font-black text-[#1A1A1A]">{selectedSlot}</span>
                  </div>
              </div>

              <button onClick={() => { showToast('Saved to Wallet'); onClose(); }} className="text-white font-extrabold text-sm bg-[#1A1A1A] px-10 py-5 rounded-full shadow-lg active-press hover:bg-black transition-colors w-full">Done</button>
              <button className="mt-6 text-[11px] font-bold text-gray-400 hover:text-[#FF5500] transition-colors">Add to Apple Wallet</button>
          </div>
      </div>
  );

  return (
    <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col animate-slide-in-right h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="absolute top-0 w-full pt-[60px] pb-4 px-6 flex items-center justify-between bg-[#FAFAF9]/95 backdrop-blur-sm z-20 border-b border-gray-100/50">
         <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center active-press shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"><ChevronLeft size={20} className="text-[#1A1A1A]"/></button>
         <h2 className="text-lg font-extrabold font-brand text-[#1A1A1A]">Booking</h2>
         <div className="w-10"></div>
      </div>

      {/* Scrollable Content - Booking Info + Notes */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto pt-[110px] pb-0" style={{ minHeight: 0 }}>
         <div className="px-5 mb-6">
            <div className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-4 animate-scale-in origin-top">
                <div className="w-14 h-14 bg-[#FF5500]/10 rounded-[18px] flex items-center justify-center text-[#FF5500] shrink-0"><Calendar size={24}/></div>
                <div>
                    <h3 className="font-extrabold text-[#1A1A1A] text-base leading-tight font-brand mb-0.5">{service?.name}</h3>
                    <p className="text-[11px] text-gray-500 font-medium">{provider.name} • {service?.duration}</p>
                </div>
            </div>
         </div>

         <div className="px-5 mb-6">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-[#1A1A1A] text-base font-brand">October 2025</h4>
                <div className="flex gap-2">
                    <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active-press"><ChevronLeft size={18}/></button>
                    <button className="w-9 h-9 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active-press"><ChevronRight size={18}/></button>
                </div>
            </div>
            <div className="flex justify-between">
                {dates.map((item, i) => (
                    <button 
                        key={i} 
                        disabled={item.busy === 'full'}
                        onClick={() => setSelectedDate(item.d)}
                        style={{ transitionDelay: `${i * 0.05}s` }}
                        className={`flex flex-col items-center justify-center w-[43px] h-[66px] rounded-[16px] transition-all duration-300 animate-slide-up-fade ${
                            selectedDate === item.d ? 'bg-[#FF5500] text-white shadow-lg shadow-orange-500/30 scale-105' : 
                            item.busy === 'full' ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                        }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedDate === item.d ? 'opacity-90' : 'opacity-60'}`}>{item.day}</span>
                        <span className="text-lg font-black font-brand">{item.d}</span>
                        
                        {selectedDate !== item.d && item.busy !== 'full' && (
                            <div className={`w-1.5 h-1.5 rounded-full mt-1.5 ${
                                item.busy === 'high' ? 'bg-green-400' : 
                                item.busy === 'med' ? 'bg-orange-300' : 'bg-red-400'
                            }`}></div>
                        )}
                        {selectedDate === item.d && <div className="w-1.5 h-1.5 bg-white rounded-full mt-1.5"></div>}
                    </button>
                ))}
            </div>
            <div className="mt-4 flex justify-end">
                <button className="text-[10px] font-bold text-[#FF5500] flex items-center gap-1"><Bell size={10}/> Join Waitlist</button>
            </div>
         </div>

         <div className="px-5 mb-6">
            <h4 className="font-extrabold text-[#1A1A1A] text-base font-brand mb-4">Time Slot</h4>
            <div className="grid grid-cols-3 gap-4">
                {slots.map((slot, i) => (
                    <button 
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        style={{ animationDelay: `${0.2 + (i * 0.05)}s` }}
                        className={`py-4 rounded-[18px] text-xs font-bold transition-all border animate-slide-up-fade ${selectedSlot === slot ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
         </div>

         <div className="px-5 pb-4 animate-slide-up-fade" style={{animationDelay: '0.5s'}}>
             <div className="flex justify-between items-center mb-4">
                 <h4 className="font-extrabold text-[#1A1A1A] text-base font-brand">Note</h4>
                 <div className="flex items-center gap-2" onClick={() => setCalendarSync(!calendarSync)}>
                     <span className="text-[10px] font-bold text-gray-400">Sync Calendar</span>
                     <div className={`w-8 h-4 rounded-full p-0.5 transition-colors ${calendarSync ? 'bg-[#FF5500]' : 'bg-gray-200'}`}>
                         <div className={`w-3 h-3 bg-white rounded-full shadow-sm transition-transform ${calendarSync ? 'translate-x-4' : 'translate-x-0'}`}></div>
                     </div>
                 </div>
             </div>
             <textarea 
                placeholder="E.g., Allergies, behavioral notes..." 
                className="w-full bg-white border border-gray-200 rounded-[20px] p-5 text-xs font-medium focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-300 resize-none shadow-sm"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
         </div>
      </div>

      {/* Total Price + Button - Separate section above menu */}
      <div className="flex-shrink-0 px-5 py-4 bg-[#FAFAF9] border-t border-gray-100 shadow-lg z-30" style={{ marginBottom: '80px' }}>
            <div className="flex justify-between items-center mb-3 px-1">
               <span className="text-gray-400 text-[10px] font-bold uppercase tracking-wide">Total Amount</span>
               <span className="text-2xl font-black text-[#1A1A1A] font-brand tracking-tight">{service?.price || '0'}</span>
            </div>
            <button 
               onClick={handleBook}
               disabled={!selectedSlot}
               className={`w-full py-3 rounded-[24px] font-extrabold text-sm transition-all active-press ${selectedSlot ? 'bg-[#FF5500] text-white shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
               Confirm Booking
            </button>
      </div>
    </div>
  );
};

// --- MAIN APP COMPONENT ---

export default function FylosApp() {
  const [selectedService, setSelectedService] = useState(null);
  const [toast, setToast] = useState(null);
  
  const showToastFn = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const handleCloseBooking = () => {
    setSelectedService(null);
  };

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#E5E5E5] py-10 font-sans">
        <div className={`relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#1a1a1a,0_0_0_14px_#333,0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500 bg-[#FAFAF9]`}>
            
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[60] pointer-events-none"></div>
            <StatusBar />
            {toast && <Toast message={toast} />}

            {/* MAIN CONTENT AREA */}
            <div className="w-full h-full relative">
                
                <ProviderProfile 
                    provider={PROVIDER_DATA} 
                    onBookClick={(service) => setSelectedService(service)}
                />

                {selectedService && (
                    <BookingFlow 
                        provider={PROVIDER_DATA} 
                        service={selectedService} 
                        onClose={handleCloseBooking} 
                        showToast={showToastFn} 
                    />
                )}

            </div>
            
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[70] bg-[#1A1A1A]/90`}></div>
        </div>
      </div>
    </>
  );
}