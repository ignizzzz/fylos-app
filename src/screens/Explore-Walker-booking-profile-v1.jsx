import React, { useState, useMemo } from 'react';
import { 
  ChevronLeft, Star, Share, BadgeCheck, Signal, Wifi, Battery,
  ArrowRight, ChevronDown, ChevronRight, Shield, CheckCircle2,
  Heart, User, GraduationCap, Footprints, Link, Ban, Award, Check,
  Dog as DogIcon, Info, Activity, Clock, Scale, Smile, Calendar, Sparkles, Quote
} from 'lucide-react';

// ==========================================
// 1. GLOBAL STYLES
// ==========================================
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap');
    
    :root {
      --primary: #09090B; 
      --secondary: #71717A;
      --accent: #FF6A2A; 
      --bg-app: #FFFFFF;
      --divider: #F4F4F5;
      --glass: rgba(255, 255, 255, 0.95);
      --ease-spring: cubic-bezier(0.19, 1, 0.22, 1);
    }

    body { 
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif; 
      background-color: #000; 
      color: var(--primary); 
      -webkit-font-smoothing: antialiased;
    } 
    
    .font-brand { font-family: 'Inter', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    .active-press { transition: transform 0.1s ease, opacity 0.2s ease; }
    .active-press:active { transform: scale(0.98); opacity: 0.7; }

    /* Animations */
    @keyframes slideUpFade {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
    .animate-slide-up { animation: slideUpFade 0.3s var(--ease-spring) forwards; }
    
    @keyframes fadeIn {
        from { opacity: 0; }
        to { opacity: 1; }
    }
    .animate-fade-in { animation: fadeIn 0.3s ease-out forwards; }
    
    @keyframes scaleIn {
        from { opacity: 0; transform: scale(0.95); }
        to { opacity: 1; transform: scale(1); }
    }
    .animate-scale-in { animation: scaleIn 0.15s ease-out forwards; }
  `}</style>
);

// ==========================================
// 2. DATA
// ==========================================

const MY_DOG = {
    name: "Luna",
    needs: ['large', 'high-energy']
};

const QUICK_SIGNALS = [
    "Responds <1h",
    "98% reliability",
    "3 years on FYLOS"
];

const PET_MATCH_DATA = [
    { label: "Large dogs", match: true },
    { label: "Max 3 dogs", match: false },
    { label: "High energy", match: true },
    { label: "Puppy care", match: false },
    { label: "Reactive dogs", match: false },
];

const WALKER_CAPABILITIES = {
    sizes: ["Small (≤8kg)", "Medium (8–20kg)", "Large (20–35kg)", "XL dogs (35kg+)"],
    experience: [
        "Puppies", "Senior dogs", "Strong pullers", "Reactive dogs", "Rescue dogs",
        "High energy breeds", "Challenging behavior"
    ],
    specialCare: [
        "Oral medication", "Post-surgery slow walks"
    ],
    rules: [
        { label: "One dog at a time", icon: <User size={14} className="text-zinc-900" /> },
        { label: "Leash required", icon: <Link size={14} className="text-zinc-400" /> },
        { label: "No dog parks", icon: <Ban size={14} className="text-zinc-400" /> },
        { label: "Quiet routes only", icon: <Footprints size={14} className="text-zinc-400" /> }
    ]
};

const SERVICES_DATA = [
    { id: '30min', name: '30 min Walk', price: 35 },
    { id: '60min', name: '60 min Walk', price: 55 },
    { id: '90min', name: '90 min Walk', price: 75 },
];

const REVIEWS_DATA = [
    { 
        id: 1, 
        user: "Thomas K.", 
        rating: 5,
        date: "2d ago",
        text: "Lukas is incredible with Bruno! Always on time and sends great updates. He really understands how to handle high energy dogs and keeps them calm.", 
        trustHint: "Repeat client"
    },
    { 
        id: 2, 
        user: "Sarah L.", 
        rating: 5,
        date: "1w ago",
        text: "Very reliable walker. Milo loves him.", 
    },
    { 
        id: 3, 
        user: "Anna M.", 
        rating: 5,
        date: "2w ago",
        text: "Best experience we've had on Fylos so far. Highly recommend for large breeds. He handles them with so much care.", 
    },
    { 
        id: 4, 
        user: "Mike T.", 
        rating: 5,
        date: "3w ago",
        text: "Great communication and super friendly. Will book again.", 
    },
    { 
        id: 5, 
        user: "Jessica R.", 
        rating: 4,
        date: "1mo ago",
        text: "Good walker, very professional. Just wish the route maps were a bit more detailed.", 
    },
    { 
        id: 6, 
        user: "David B.", 
        rating: 5,
        date: "1mo ago",
        text: "Lukas is the best! My golden retriever gets so excited when he arrives.", 
    },
    { 
        id: 7, 
        user: "Elena S.", 
        rating: 5,
        date: "2mo ago",
        text: "Perfect service. Thank you!", 
    },
];

const REPEAT_DOGS_DATA = [
    { 
        id: 'd1', 
        name: 'Bruno', 
        breed: 'Golden Retriever', 
        age: '3y',
        label: 'Regular', 
        image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=150&q=80', 
        service: '60 min Walk',
        duration: '6 months',
        walks: 24,
        quote: "Lukas is the only one Bruno trusts completely."
    },
    { 
        id: 'd2', 
        name: 'Milo', 
        breed: 'Vizsla', 
        age: '2y',
        label: '5+ walks', 
        image: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?w=150&q=80', 
        service: '30 min Walk',
        duration: '2 months',
        walks: 8,
        quote: "So reliable with our energetic Milo."
    },
    { 
        id: 'd3', 
        name: 'Cooper', 
        breed: 'Labrador', 
        age: '5y',
        label: 'Regular', 
        image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?w=150&q=80', 
        service: '60 min Walk',
        duration: '1 year',
        walks: 45,
        quote: "Cooper waits by the door for him!"
    },
    { 
        id: 'd4', 
        name: 'Max', 
        breed: 'German Shepherd', 
        age: '4y',
        label: '5+ walks', 
        image: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5e95?w=150&q=80', 
        service: '90 min Walk',
        duration: '3 months',
        walks: 12,
        quote: "Great structure for a shepherd."
    },
    { 
        id: 'd5', 
        name: 'Bella', 
        breed: 'Border Collie', 
        age: '2y',
        label: 'Regular', 
        image: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?w=150&q=80', 
        service: '60 min Walk',
        duration: '8 months',
        walks: 32,
        quote: "Bella comes back tired and happy."
    },
];

const WALKER_OWN_DOG = {
    name: "Rocky",
    breed: "Border Collie Mix",
    age: "4y",
    image: "https://images.unsplash.com/photo-1518717758536-85ae29035b6d?w=400&q=80",
    description: "Lukas is also a dog owner", // For the mini card
    subtext: "Living with dogs for 6+ years", // For the mini card
    trustText: "I’ve lived with Rocky for 4 years and understand the needs of high-energy breeds.",
    routineText: "Rocky needs 2 walks/day — I know how important routine is."
};

const CERTIFICATIONS_LIST = [
    { id: 1, name: "First Aid (Pets)", date: "Dec 2024" },
    { id: 2, name: "Pro Dog Trainer (Level 1)", date: "Nov 2024" },
    { id: 3, name: "Canine Behavior Basics", date: "Oct 2024" },
];

const VERIFICATION_INFO = {
    id: { 
        title: "ID Verified", 
        text: "Government-issued ID verified by the FYLOS team.",
        subtext: "Verified: December 2024",
        icon: <Shield size={24} className="text-zinc-900" />
    },
    insurance: { 
        title: "Insurance Covered", 
        text: "Covered during active walks booked on FYLOS.",
        icon: <Shield size={24} className="text-zinc-900" />
    },
    certs: { 
        title: "Verified Certifications", 
        icon: <Award size={24} className="text-zinc-900" />
    }
};

const TOP_MATCH_PROVIDER = {
    id: 'walker-top',
    name: 'Lukas F.',
    image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80',
    rating: 4.9,
    reviews: 124,
    neighborhood: 'Seefeld',
    bio: "Certified dog trainer specializing in high-energy breeds. I prioritize structure, positive reinforcement, and consistent safety. Based in Seefeld, 3 years experience.",
    languages: ["English", "German"],
    certifications: CERTIFICATIONS_LIST
};

// ==========================================
// 3. UI COMPONENTS
// ==========================================

const StatusBar = () => (
  <div className="absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[150] text-[13px] font-semibold tracking-wide text-black pointer-events-none">
    <span>9:41</span>
    <div className="flex items-center gap-1.5">
      <Signal size={16} strokeWidth={2.5} />
      <Wifi size={16} strokeWidth={2.5} />
      <Battery size={18} strokeWidth={2.5} />
    </div>
  </div>
);

const CompactHeader = ({ provider, onBack }) => (
    <div className="absolute top-0 left-0 w-full z-[50] bg-transparent pt-[54px] pb-3 px-6 pointer-events-none">
        <div className="flex items-center justify-between">
            <button onClick={onBack} className="w-9 h-9 flex items-center justify-center -ml-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm active-press text-zinc-900 pointer-events-auto border border-zinc-100">
                <ChevronLeft size={22} strokeWidth={2} />
            </button>
            
            <div className="flex items-center gap-3 pointer-events-auto">
                <img src={provider.image} className="w-[34px] h-[34px] rounded-full object-cover shadow-sm border border-white" alt="Profile" />
                <div className="flex flex-col justify-center">
                    <div className="flex items-center gap-1">
                        <span className="text-[15px] font-bold text-zinc-900 leading-none">{provider.name}</span>
                        <BadgeCheck size={14} className="text-[#3b82f6] fill-blue-50" />
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] text-zinc-500 font-medium leading-none mt-1">
                        <div className="flex items-center gap-0.5">
                            <Star size={10} className="fill-zinc-800 text-zinc-800" />
                            <span className="text-zinc-800">{provider.rating}</span>
                        </div>
                        <span className="text-zinc-300">•</span>
                        <span>{provider.neighborhood}</span>
                    </div>
                </div>
            </div>

            <button className="w-9 h-9 flex items-center justify-center -mr-2 rounded-full bg-white/80 backdrop-blur-md shadow-sm active-press text-zinc-900 pointer-events-auto border border-zinc-100">
                <Share size={18} strokeWidth={2} />
            </button>
        </div>
    </div>
);

const HeaderFadeScrim = () => (
    <div 
        className="absolute top-0 left-0 w-full z-[40] pointer-events-none"
        style={{ 
            height: '120px',
            background: 'linear-gradient(to bottom, #FFFFFF 40%, rgba(255,255,255,0) 100%)' 
        }}
    />
);

const QuickSignals = () => (
    <div className="px-6 mt-3 mb-6 flex justify-center">
        <span className="text-[11px] text-zinc-400 font-normal text-center">
            {QUICK_SIGNALS.join(" · ")}
        </span>
    </div>
);

const PetMatchSection = () => {
    const displayTags = PET_MATCH_DATA.slice(0, 4);
    return (
        <div className="px-6 mb-8">
            <h3 className="text-[13px] font-semibold text-zinc-900 mb-3">Good fit for {MY_DOG.name}</h3>
            <div className="flex flex-wrap gap-2">
                {displayTags.map((item, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-full text-[12px] font-medium ${item.match ? 'bg-[#FF6A2A]/10 text-[#FF6A2A]' : 'bg-zinc-100 text-zinc-500'}`}>
                        {item.label}
                    </span>
                ))}
            </div>
        </div>
    );
};

// --- Updated About Section (Visual Hierarchy) ---
const AboutSection = ({ provider, onShowOwnerDog }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <div className="px-6 pt-2 pb-8 border-t border-zinc-900/5 mt-2">
            <div className="mb-5">
                <div className="w-6 h-[2px] bg-[#FF6A2A] mb-3 rounded-full" />
                <h3 className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wider">About</h3>
            </div>
            
            <div className="relative mb-6">
                <p className={`text-[15px] text-zinc-700 leading-snug font-normal transition-all duration-300 ${isExpanded ? '' : 'line-clamp-2'}`}>
                    {provider.bio}
                </p>
                <button onClick={() => setIsExpanded(!isExpanded)} className="text-[13px] font-medium text-zinc-900 mt-2 active:opacity-70 flex items-center gap-1">
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            </div>
            
            {/* Meta Rows Container */}
            <div className="flex flex-col">
                {/* Speaks Row */}
                {provider.languages && (
                    <div className="py-3 border-b border-zinc-50 flex items-center gap-2">
                        <span className="text-[12px] text-zinc-400 font-medium">Speaks</span>
                        <span className="text-[13px] text-zinc-600">{provider.languages.join(", ")}</span>
                    </div>
                )}
                
                {/* Dog Owner Row */}
                <button 
                    onClick={onShowOwnerDog}
                    className="w-full py-3 flex items-center justify-between active:opacity-60 transition-opacity group"
                >
                    <div className="flex items-center gap-2">
                        <span className="text-[12px] text-zinc-400 font-medium">Dog owner</span>
                        <span className="text-[13px] text-zinc-600">(Rocky • 6+ years)</span>
                    </div>
                    <ChevronRight size={14} className="text-zinc-300 group-hover:text-zinc-500" />
                </button>
            </div>
        </div>
    );
};

// --- Updated Verification Section (Visual Hierarchy) ---
const VerificationSection = ({ onVerifyClick }) => (
    <div className="px-6 pt-8 pb-10 border-t border-zinc-900/5">
        <div className="mb-5">
            <div className="w-6 h-[2px] bg-[#FF6A2A] mb-3 rounded-full" />
            <h3 className="text-[13px] font-semibold text-zinc-500 uppercase tracking-wider">Trust & Verification</h3>
        </div>
        
        <div className="flex flex-wrap gap-x-5 gap-y-3">
            <button onClick={() => onVerifyClick('id')} className="flex items-center gap-1.5 active:opacity-60 transition-opacity group">
                <CheckCircle2 size={14} className="text-zinc-400" />
                <span className="text-[13px] text-zinc-700 font-medium">ID verified</span>
                <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-500" />
            </button>
            <button onClick={() => onVerifyClick('insurance')} className="flex items-center gap-1.5 active:opacity-60 transition-opacity group">
                <CheckCircle2 size={14} className="text-zinc-400" />
                <span className="text-[13px] text-zinc-700 font-medium">Insurance covered</span>
                <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-500" />
            </button>
            <button onClick={() => onVerifyClick('certs')} className="flex items-center gap-1.5 active:opacity-60 transition-opacity group">
                <CheckCircle2 size={14} className="text-zinc-400" />
                <span className="text-[13px] text-zinc-700 font-medium">Verified certifications</span>
                <ChevronRight size={12} className="text-zinc-300 group-hover:text-zinc-500" />
            </button>
        </div>
    </div>
);

// --- Updated Capabilities Section (Refactored) ---
const CapabilitiesDetailSection = () => (
    <div className="px-6 py-8 bg-zinc-50/50 border-t border-zinc-900/5">
        <div className="flex flex-col gap-8">
            <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Dog Sizes</h4>
                <div className="flex flex-wrap gap-2">
                    {WALKER_CAPABILITIES.sizes.map((size, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-zinc-100 text-[13px] font-medium text-zinc-700 shadow-sm shadow-zinc-100">{size}</span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Experience</h4>
                <div className="flex flex-wrap gap-2">
                    {WALKER_CAPABILITIES.experience.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-zinc-100 text-[13px] font-medium text-zinc-700 shadow-sm shadow-zinc-100">{item}</span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Special Care</h4>
                <div className="flex flex-wrap gap-2">
                    {WALKER_CAPABILITIES.specialCare.map((item, i) => (
                        <span key={i} className="px-3 py-1.5 rounded-full bg-white border border-zinc-100 text-[13px] font-medium text-zinc-700 shadow-sm shadow-zinc-100">{item}</span>
                    ))}
                </div>
            </div>

            <div>
                <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-3">Safety Rules</h4>
                <div className="flex flex-col gap-3">
                    {WALKER_CAPABILITIES.rules.map((item, i) => (
                        <div key={i} className="flex items-center gap-3">
                            <div className="w-5 flex justify-center">{item.icon}</div>
                            <span className="text-[13px] font-medium text-zinc-700">{item.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
);

// --- 6. SERVICES LIST SECTION (New) ---
const ServicesListSection = () => (
    <div className="px-6 py-8 border-t border-zinc-900/5 pb-32">
        <h4 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider mb-5">Services</h4>
        <div className="flex flex-col gap-4">
            {SERVICES_DATA.map((service) => (
                <div key={service.id} className="flex items-center justify-between">
                    <span className="text-[15px] font-semibold text-zinc-900">{service.name}</span>
                    <span className="text-[15px] font-medium text-zinc-600">CHF {service.price}</span>
                </div>
            ))}
        </div>
    </div>
);

// --- 7. SERVICES CTA (Updated) ---
const FloatingServicesCTA = ({ onBook }) => {
    return (
        <div className={`
            absolute bottom-10 left-1/2 -translate-x-1/2 z-[100]
            animate-fade-in
        `}>
            <button 
                onClick={() => onBook ? onBook() : console.log('Navigate to Booking')}
                className="
                    group relative
                    pl-6 pr-2 py-2 flex items-center gap-3
                    rounded-full
                    bg-white/80 backdrop-blur-2xl 
                    border border-white/60
                    shadow-[0_8px_30px_rgba(0,0,0,0.12)]
                    active:scale-95 transition-all duration-300
                "
            >
                <span className="text-[15px] font-bold text-zinc-900 tracking-wide">Book a walk</span>
                
                {/* Circle Icon Container */}
                <div className="
                    w-10 h-10 rounded-full 
                    bg-[#FF6A2A] 
                    shadow-lg shadow-orange-500/30
                    flex items-center justify-center
                    group-hover:scale-105 transition-transform duration-300
                ">
                    <ArrowRight size={18} className="text-white" strokeWidth={3} />
                </div>
            </button>
        </div>
    );
};

// --- Helper: Expandable Review Text ---
const ExpandableReviewText = ({ text }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const shouldTruncate = text.length > 100; 

    return (
        <div>
            <p className={`text-[14px] text-zinc-600 leading-relaxed font-normal ${!isExpanded && shouldTruncate ? 'line-clamp-2' : ''}`}>
                {text}
            </p>
            {shouldTruncate && (
                <button 
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="text-[13px] font-medium text-[#FF6A2A] mt-1 active:opacity-60"
                >
                    {isExpanded ? 'Show less' : 'Read more'}
                </button>
            )}
        </div>
    );
};

// --- Updated Reviews Section (Cleaned up) ---
const ReviewsSection = () => {
    // No more sorting state or UI in the preview
    const visibleReviews = REVIEWS_DATA.slice(0, 3);
    
    return (
        <div className="px-6 py-8 bg-zinc-50/50 border-t border-zinc-900/5 relative">
            <div className="mb-6 relative">
                <div className="w-6 h-[2px] bg-[#FF6A2A] mb-3 rounded-full" />
                <h3 className="text-[18px] font-bold text-zinc-900 leading-tight">124 reviews</h3>
            </div>
            
            <div className="flex flex-col gap-8">
                {visibleReviews.map((review) => (
                    <div key={review.id} className="flex flex-col gap-2 animate-fade-in">
                        <div className="flex items-center justify-between">
                            <span className="text-[15px] font-semibold text-zinc-900">{review.user}</span>
                            <span className="text-[12px] text-zinc-400 font-normal">{review.date}</span>
                        </div>
                        <div className="flex gap-0.5">
                            {[...Array(5)].map((_, i) => (
                                <Star key={i} size={12} className={`${i < review.rating ? 'fill-[#FF6A2A] text-[#FF6A2A]' : 'fill-zinc-200 text-zinc-200'}`} />
                            ))}
                        </div>
                        <ExpandableReviewText text={review.text} />
                    </div>
                ))}
                
                <button className="flex items-center gap-1.5 text-[14px] font-medium text-zinc-900 mt-2 active:opacity-60 transition-opacity self-start">
                    See all reviews
                    <ArrowRight size={14} className="text-zinc-400" />
                </button>
            </div>
        </div>
    );
};

// --- Updated Repeat Dogs Section (Repositioned) ---
const RepeatDogsSection = ({ onShowDog }) => {
    return (
        <div className="py-8 border-t border-zinc-900/5">
            <div className="px-6 mb-5">
                <div className="w-6 h-[2px] bg-[#FF6A2A] mb-3 rounded-full" />
                <h3 className="text-[18px] font-bold text-zinc-900">Repeat dogs</h3>
                <p className="text-[11px] text-zinc-400 mt-0.5">Dogs who booked Lukas more than once.</p>
            </div>
            
            <div className="flex overflow-x-auto no-scrollbar gap-4 px-6">
                {REPEAT_DOGS_DATA.map((dog) => (
                    <button 
                        key={dog.id} 
                        onClick={() => onShowDog(dog)}
                        className="
                            group flex flex-col items-center gap-2 min-w-[72px]
                            transition-all duration-200 ease-[cubic-bezier(0.19,1,0.22,1)]
                            active:scale-[0.97]
                        "
                    >
                        {/* Avatar */}
                        <div className="
                            w-[60px] h-[60px] rounded-full p-[2px] border border-zinc-100 
                            shadow-sm transition-shadow duration-200
                            group-active:shadow-md bg-white
                        ">
                            <img src={dog.image} alt={dog.name} className="w-full h-full rounded-full object-cover" />
                        </div>

                        {/* Info */}
                        <div className="flex flex-col items-center gap-0.5">
                            {/* Name Row */}
                            <div className="flex items-center gap-0.5 pl-1">
                                <span className="text-[12px] font-semibold text-zinc-900">{dog.name}</span>
                                <ChevronRight size={10} className="text-zinc-400/60" strokeWidth={2.5} />
                            </div>

                            {/* Label Row */}
                            <div className="flex items-center gap-1.5">
                                <div className="w-1 h-1 rounded-full bg-[#FF6A2A]" />
                                <span className="text-[11px] font-medium text-zinc-500">
                                    {dog.walks} walks
                                </span>
                            </div>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
};

// --- VERIFICATION SHEET CONTENT ---
const VerificationSheetContent = ({ type, certifications }) => {
    const info = VERIFICATION_INFO[type] || {};
    
    // REDESIGNED: Compact, minimal layout for ID Verified
    if (type === 'id') {
        return (
            <div className="pb-12 pt-6 px-8 flex flex-col items-center text-center">
                {/* Minimal Shield Icon */}
                <div className="mb-4 text-zinc-900">
                    <Shield size={24} strokeWidth={2} />
                </div>
                
                {/* Title */}
                <h3 className="text-[18px] font-bold text-zinc-900 mb-3">{info.title}</h3>
                
                {/* Body Text */}
                <p className="text-[15px] text-zinc-900 font-medium leading-relaxed mb-1.5">
                    {info.text}
                </p>
                
                {/* Secondary Line */}
                <p className="text-[13px] text-zinc-400 font-normal">
                    {info.subtext}
                </p>
            </div>
        );
    }

    // REDESIGNED: Compact layout for Insurance
    if (type === 'insurance') {
        return (
            <div className="pb-12 pt-6 px-8 flex flex-col items-center text-center">
                {/* Minimal Shield Icon */}
                <div className="mb-4 text-zinc-900">
                    <Shield size={24} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-zinc-900 mb-3">{info.title}</h3>

                {/* Body Text */}
                <p className="text-[15px] text-zinc-900 font-medium leading-relaxed mb-1">
                    CHF 1,000,000 liability insurance provided by AXA.
                </p>
                <p className="text-[15px] text-zinc-600 leading-relaxed mb-4">
                    Covers injuries and property damage during booked walks.
                </p>

                {/* Secondary Lines */}
                <div className="flex flex-col gap-0.5">
                    <p className="text-[13px] text-zinc-400 font-normal">
                        Coverage active only for services booked through FYLOS.
                    </p>
                    <p className="text-[13px] text-zinc-400 font-normal">
                        Policy valid through: December 2026
                    </p>
                </div>
            </div>
        );
    }

    // REDESIGNED: Compact layout for Verified Certifications
    if (type === 'certs') {
        return (
            <div className="pb-12 pt-6 px-8 flex flex-col items-center text-center">
                {/* Minimal Icon */}
                <div className="mb-4 text-zinc-900">
                    <Award size={24} strokeWidth={2} />
                </div>

                {/* Title */}
                <h3 className="text-[18px] font-bold text-zinc-900 mb-6">{info.title}</h3>

                {/* List */}
                <div className="w-full flex flex-col gap-4 text-left">
                    {certifications.map((cert) => (
                        <div key={cert.id} className="flex flex-col gap-0.5 border-b border-zinc-50 pb-3 last:border-0 last:pb-0">
                            <span className="text-[15px] font-semibold text-zinc-900">{cert.name}</span>
                            <span className="text-[13px] text-zinc-500 font-normal">Verified by FYLOS · {cert.date}</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Fallback (should not be reached with current types)
    return null;
};

// --- UPDATED DOG PROFILE SHEET ---
const DogProfileSheet = ({ dog, isWalkerDog }) => {
    if (!dog) return null;

    if (isWalkerDog) {
        return (
            <div className="pb-10 pt-4 px-8 flex flex-col items-center text-center">
                {/* Circular Photo */}
                <div className="w-24 h-24 rounded-full p-1 border border-zinc-100 shadow-sm mb-5 relative">
                    <img src={dog.image} alt={dog.name} className="w-full h-full rounded-full object-cover" />
                </div>
                
                {/* Name & Details */}
                <h3 className="text-[20px] font-bold text-zinc-900 mb-1.5">{dog.name}</h3>
                <p className="text-[14px] text-zinc-500 font-medium mb-6">
                    {dog.breed} • {dog.age}
                </p>

                {/* Trust Text */}
                <div className="max-w-[280px]">
                    <p className="text-[15px] text-zinc-700 leading-relaxed mb-4">
                        {dog.trustText}
                    </p>
                    <p className="text-[14px] text-zinc-500 leading-relaxed">
                        {dog.routineText}
                    </p>
                </div>
            </div>
        );
    }

    // Default view for repeat dogs (clients)
    return (
        <div className="pb-8 pt-4">
            {/* Top: Centered Photo & Info */}
            <div className="flex flex-col items-center text-center mb-8 px-6">
                <div className="w-20 h-20 rounded-full p-0.5 border border-zinc-100 shadow-sm mb-4 relative">
                    <img src={dog.image} alt={dog.name} className="w-full h-full rounded-full object-cover" />
                    {/* Optional Status Indicator */}
                    <div className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-zinc-50 shadow-sm">
                        <Heart size={12} className="fill-[#FF6A2A] text-[#FF6A2A]" />
                    </div>
                </div>
                <h3 className="text-[20px] font-bold text-zinc-900 mb-1 tracking-tight">{dog.name}</h3>
                <span className="text-[13px] text-zinc-500 font-medium">{dog.breed} • {dog.age}</span>
            </div>

            {/* Relationship Proof - Minimal Vertical List */}
            <div className="px-8 mb-8">
                <div className="flex flex-col gap-5">
                    {/* Item 1: Duration */}
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100/50">
                            <Calendar size={15} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[14px] font-medium text-zinc-900 tracking-tight">With Lukas for {dog.duration}</span>
                        </div>
                    </div>

                    {/* Item 2: Volume */}
                    <div className="flex items-center gap-4">
                        <div className="w-9 h-9 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-400 border border-zinc-100/50">
                            <Footprints size={15} strokeWidth={2} />
                        </div>
                        <div className="flex flex-col gap-0.5">
                            <span className="text-[14px] font-medium text-zinc-900 tracking-tight">{dog.walks} completed walks</span>
                            <span className="text-[12px] text-zinc-400">100% reliability rating</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subtle Divider */}
            <div className="mx-8 h-px bg-zinc-100/80 mb-8" />

            {/* USUALLY BOOKS (was Typical Service) */}
            <div className="px-8 mb-6">
                <span className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider mb-3 block">Usually books</span>
                <div className="flex items-center gap-2">
                    <Activity size={16} className="text-zinc-300" />
                    <span className="text-[15px] text-zinc-900 font-medium">{dog.service} • High energy</span>
                </div>
            </div>

            {/* Quote */}
            {dog.quote && (
                <div className="px-8 mb-4">
                    <div className="bg-zinc-50/50 p-4 rounded-2xl border border-zinc-100/60 relative">
                        <Quote size={12} className="text-zinc-300 absolute top-4 left-4 fill-zinc-300 opacity-50" />
                        <p className="text-[13px] text-zinc-600 italic leading-relaxed pl-6">
                            "{dog.quote}"
                        </p>
                        {/* Attribution */}
                        <p className="text-[11px] text-zinc-400 mt-2 font-medium pl-6">— {dog.name}'s owner, Oct 2025</p>
                    </div>
                </div>
            )}

            {/* CTA below quote */}
            <div className="px-8 flex justify-center mt-2">
                 <button className="text-[14px] font-medium text-zinc-900 active:text-[#FF6A2A] transition-colors flex items-center gap-1">
                    Book same service <ArrowRight size={14} />
                 </button>
            </div>
        </div>
    );
};

// --- BOTTOM SHEET (Reused) ---
const BottomSheet = ({ isOpen, onClose, children }) => {
    if (!isOpen) return null;
    return (
        <div className="absolute inset-0 z-[200] flex flex-col justify-end">
            <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] transition-opacity duration-300" onClick={onClose} />
            <div className="bg-white rounded-t-[24px] z-10 animate-slide-up shadow-[0_-8px_40px_rgba(0,0,0,0.1)] safe-area-bottom w-full max-h-[85vh] overflow-hidden flex flex-col">
                <div className="w-full flex justify-center pt-3 pb-1">
                    <div className="w-10 h-1 rounded-full bg-zinc-200"></div>
                </div>
                <div className="flex-1 overflow-y-auto no-scrollbar p-6">
                    {children}
                </div>
            </div>
        </div>
    );
};

// ==========================================
// 4. MAIN SCREEN ORCHESTRATOR
// ==========================================
const ProviderScreen = ({ provider, onBack, onBook }) => {
    const [activeModal, setActiveModal] = useState(null); 

    const handleVerificationClick = (type) => {
        setActiveModal({ type: 'verification', data: type });
    };

    const handleShowRepeatDog = (dog) => {
        setActiveModal({ type: 'repeat_dog', data: dog });
    };

    const handleShowWalkerDog = () => {
        setActiveModal({ type: 'walker_dog', data: WALKER_OWN_DOG });
    };

    return (
        <div className="w-full h-full bg-white relative flex flex-col overflow-hidden">
            
            {/* Header stays locked */}
            <CompactHeader provider={provider} onBack={onBack} />
            <HeaderFadeScrim />

            {/* Scrollable Content */}
            <div className="flex-1 overflow-y-auto no-scrollbar relative z-[10]">
                <div className="pt-[120px] pb-0">
                    <QuickSignals />
                    <PetMatchSection />
                    
                    <AboutSection 
                        provider={provider} 
                        onShowOwnerDog={handleShowWalkerDog}
                    />
                    
                    <VerificationSection onVerifyClick={handleVerificationClick} />

                    <RepeatDogsSection onShowDog={handleShowRepeatDog} />
                    
                    <CapabilitiesDetailSection />
                    
                    <ReviewsSection />

                    <ServicesListSection />

                </div>
            </div>

            {/* Floating Services CTA */}
            <FloatingServicesCTA onBook={onBook} />

            {/* Bottom Sheet */}
            <BottomSheet 
                isOpen={!!activeModal} 
                onClose={() => setActiveModal(null)} 
            >
                {activeModal?.type === 'verification' && (
                    <VerificationSheetContent 
                        type={activeModal.data} 
                        certifications={provider.certifications} 
                    />
                )}
                {(activeModal?.type === 'repeat_dog' || activeModal?.type === 'walker_dog') && (
                    <DogProfileSheet 
                        dog={activeModal.data} 
                        isWalkerDog={activeModal.type === 'walker_dog'}
                    />
                )}
            </BottomSheet>

        </div>
    );
};

// Export for use in Explore Home flow
export { ProviderScreen as WalkerProfileView };

// ==========================================
// 5. APP ENTRY
// ==========================================
function App() {
  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#111] py-10 font-sans">
        <div className="relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#000000,0_0_0_14px_#333333] overflow-hidden bg-white">
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[200] pointer-events-none"></div>
            <StatusBar /> 
            <div className="w-full h-full relative flex flex-col">
                <ProviderScreen provider={TOP_MATCH_PROVIDER} onBack={() => {}} />
            </div>
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-[200] bg-black"></div>
        </div>
      </div>
    </>
  );
}

export default App;