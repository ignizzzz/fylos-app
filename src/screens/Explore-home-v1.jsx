import React, { useState, useEffect, useRef } from 'react';
import { 
  Home, Activity, Map as MapIcon, User, Calendar, Bell, Search, Plus, Check, X, 
  Menu, ChevronLeft, ChevronRight, ChevronDown, Send, Sun, Moon, Cloud, 
  Droplet, MapPin, Shield, CreditCard, ShoppingBag, Coffee, FileText, 
  Music, Play, Pause, Camera, Video, Phone, Bluetooth, Wifi, Signal, 
  Battery, Lock, QrCode, Scan, BarcodeIcon, Syringe, Trash2, Heart, 
  Thermometer, Wind, Dog, Ruler, Smile, Sparkles, Star, AlertCircle, 
  Volume2, ArrowRight, List, Filter, Clock, Info, Navigation, Siren, Eye, Share2, Settings,
  Users, CalendarClock, SlidersHorizontal, Stethoscope, Footprints, Medal, Zap, MessageCircle,
  Car, Download, Sofa, CheckCircle2
} from 'lucide-react';

// --- WALKER FLOW IMPORTS ---
import { WalkerProfileView } from './Explore-Walker-booking-profile-v1'
import { WalkerBookingFlow } from './Explore-Walker-Payment-v1'

// --- STYLES & ANIMATIONS ---
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');
    
    body { font-family: 'Inter', sans-serif; background-color: #F9FAFB; color: #1A1A1A; } /* Off-White & Charcoal Primary */
    .font-brand { font-family: 'Nunito', sans-serif; }
    .no-scrollbar::-webkit-scrollbar { display: none; }
    .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
    
    /* Animations */
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideUpFull { from { transform: translateY(100%); } to { transform: translateY(0); } }
    @keyframes slideUpFade { from { transform: translateY(15px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    @keyframes slideInRight { from { transform: translateX(100%); } to { transform: translateX(0); } }
    @keyframes scaleIn { from { transform: scale(0.95); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes radar-ping { 0% { width: 0; height: 0; opacity: 0.8; } 100% { width: 300px; height: 300px; opacity: 0; } }
    @keyframes fill-dot { 0% { transform: scale(0); } 100% { transform: scale(1); } }
    
    .animate-fade-in { animation: fadeIn 0.4s ease-out forwards; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-up-full { animation: slideUpFull 0.4s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-up-fade { animation: slideUpFade 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-in-right { animation: slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
    .animate-scale-in { animation: scaleIn 0.2s ease-out forwards; }
    .animate-radar { animation: radar-ping 2s infinite; }
    .animate-fill-dot { animation: fill-dot 0.6s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    
    .active-press:active { transform: scale(0.97); transition: transform 0.1s; }
    .hover-lift:hover { transform: translateY(-2px); transition: transform 0.2s; box-shadow: 0 10px 30px -10px rgba(255, 104, 53, 0.15); }
    
    /* Smooth Transitions for Header */
    .transition-all-smooth { transition: all 0.4s cubic-bezier(0.25, 0.8, 0.25, 1); }
  `}</style>
);

// --- DATA MOCKS ---
const SERVICES_DATA = [
  { 
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
    description: "Premium grooming in the heart of Seefeld. Specialized in calming treatments for anxious pets.",
    team: [{name: 'Sarah', role: 'Head Groomer', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80'}],
    menu: [
        { name: 'Bath & Tidy', price: 'CHF 85', duration: '1h' }, 
        { name: 'Full Grooming', price: 'CHF 140', duration: '2h' },
        { name: 'Puppy Intro', price: 'CHF 60', duration: '45m' } 
    ],
    coords: { top: '35%', left: '45%' },
    verified: true,
    travelTime: '12 min drive',
    isLoved: true // SELECTED ITEM 1
  },
  { 
    id: 2, 
    name: 'Bahnhofstrasse Vet', 
    type: 'Veterinary', 
    rating: 5.0, 
    reviews: 89, 
    dist: '0.8km', 
    price: 120,
    currency: 'CHF ',
    unit: '/visit',
    image: 'https://images.unsplash.com/photo-1628009368231-7bb7cfcb0def?auto=format&fit=crop&q=80',
    status: 'Open',
    tags: ['Checkup', 'Vaccines', 'Surgery'],
    description: "Top-tier veterinary care with state-of-the-art diagnostics.",
    team: [{name: 'Dr. Weber', role: 'Veterinarian', img: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'General Checkup', price: 'CHF 120', duration: '30m' }, { name: 'Vaccination', price: 'CHF 80', duration: '15m' }],
    coords: { top: '55%', left: '32%' },
    verified: true,
    travelTime: '8 min walk',
    emergency: true,
    isLoved: false
  },
  { 
    id: 3, 
    name: 'Limmat Walkers', 
    type: 'Walking', 
    rating: 4.8, 
    reviews: 210, 
    dist: '0.5km', 
    price: 35,
    currency: 'CHF ',
    unit: '/hr',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&q=80',
    status: 'Available',
    tags: ['River Walk', 'Solo', 'Park'],
    description: "Scenic walks along the Limmat river. GPS tracking included.",
    team: [{name: 'Mike', role: 'Walker', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'Group Walk', price: 'CHF 35', duration: '1h' }],
    coords: { top: '48%', left: '65%' },
    verified: false,
    travelTime: '5 min walk',
    isLoved: true // SELECTED ITEM 2
  },
  { 
    id: 4, 
    name: 'Swiss Canine Academy', 
    type: 'Training', 
    rating: 4.9, 
    reviews: 56, 
    dist: '5.0km', 
    price: 90,
    currency: 'CHF ',
    unit: '/class',
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80',
    status: 'Classes Full',
    tags: ['Obedience', 'Agility'],
    description: "Positive reinforcement training for puppies. Certified trainers.",
    team: [{name: 'Elena', role: 'Trainer', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'Puppy Class', price: 'CHF 90', duration: '1h' }],
    coords: { top: '25%', left: '75%' },
    isLoved: false
  },
  {
    id: 5,
    name: 'Enge Vet Center',
    type: 'Veterinary', 
    rating: 4.7,
    reviews: 45,
    dist: '1.8km',
    price: 100,
    currency: 'CHF ',
    unit: '/visit',
    image: 'https://images.unsplash.com/photo-1512413316925-fd4b93f31521?auto=format&fit=crop&q=80',
    status: 'Closing Soon',
    tags: ['Dental', 'Checkup'],
    description: "Holistic veterinary care near Enge station.",
    team: [{name: 'Dr. Nikos', role: 'Vet', img: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'Wellness Exam', price: 'CHF 100', duration: '20m' }],
    coords: { top: '70%', left: '25%' },
    isLoved: false
  },
  {
    id: 6,
    name: 'Luxury Pet Spa',
    type: 'Grooming', 
    rating: 4.8,
    reviews: 82,
    dist: '3.1km',
    price: 150,
    currency: 'CHF ',
    unit: '/session',
    image: 'https://images.unsplash.com/photo-1558230571-0a6ea14b5dfd?auto=format&fit=crop&q=80',
    status: 'Open',
    tags: ['Spa', 'Massage'],
    description: "Luxury spa treatments including blueberry facials and paw massages.",
    team: [{name: 'Anna', role: 'Stylist', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'Full Spa Day', price: 'CHF 200', duration: '3h' }],
    coords: { top: '30%', left: '20%' },
    isLoved: false
  },
  {
    id: 8,
    name: 'Zürichberg Training',
    type: 'Training', 
    rating: 5.0,
    reviews: 34,
    dist: '4.2km',
    price: 110,
    currency: 'CHF ',
    unit: '/class',
    image: 'https://images.unsplash.com/photo-1541599540903-216a46ca1dc0?auto=format&fit=crop&q=80',
    status: 'Open',
    tags: ['Behavior', 'Recall'],
    description: "Outdoor training sessions in the Zürichberg forest.",
    team: [{name: 'Sofia', role: 'Behaviorist', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80'}],
    menu: [{ name: 'Behavior Consult', price: 'CHF 110', duration: '1.5h' }],
    coords: { top: '40%', left: '80%' },
    isLoved: false
  },
  {
      id: 9,
      name: 'Happy Paws Daycare',
      type: 'Sit',
      rating: 4.9,
      reviews: 42,
      dist: '2.5km',
      price: 45,
      currency: 'CHF ',
      unit: '/day',
      image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&q=80', // Reusing image for demo
      status: 'Open',
      tags: ['Daycare', 'Overnight', 'Playgroup'],
      description: "A fun and safe environment for your dog to socialize while you're at work.",
      team: [{name: 'Lisa', role: 'Sitter', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80'}],
      menu: [{ name: 'Full Day Care', price: 'CHF 45', duration: '8h' }],
      coords: { top: '20%', left: '60%' },
      verified: true,
      travelTime: '15 min drive',
      isLoved: true // SELECTED ITEM 3
  },
  {
      id: 10,
      name: 'Lukas F.',
      type: 'Walking',
      rating: 4.9,
      reviews: 124,
      dist: '0.6km',
      price: 35,
      currency: 'CHF ',
      unit: '/walk',
      image: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=800&q=80',
      status: 'Available',
      tags: ['Large Breeds', 'Solo Walks', 'Structured'],
      description: "Certified trainer. Calm, structured walks for high-energy breeds.",
      team: [{name: 'Lukas', role: 'Walker', img: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80'}],
      menu: [{ name: '30 min Walk', price: 'CHF 35', duration: '30m' }, { name: '60 min Walk', price: 'CHF 55', duration: '1h' }],
      coords: { top: '42%', left: '50%' },
      verified: true,
      travelTime: '6 min walk',
      isLoved: false,
      walkerData: {
          neighborhood: 'Seefeld',
          bio: "Certified dog trainer specializing in high-energy breeds. I prioritize structure, positive reinforcement, and consistent safety. Based in Seefeld, 3 years experience.",
          languages: ["English", "German"],
          certifications: [
              { id: 1, name: "First Aid (Pets)", date: "Dec 2024" },
              { id: 2, name: "Pro Dog Trainer (Level 1)", date: "Nov 2024" },
          ]
      }
  },
  {
      id: 11,
      name: 'Sophie M.',
      type: 'Walking',
      rating: 4.8,
      reviews: 89,
      dist: '1.1km',
      price: 30,
      currency: 'CHF ',
      unit: '/walk',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800&q=80',
      status: 'Available',
      tags: ['Puppies', 'Park Walks', 'Gentle'],
      description: "Gentle and patient. Perfect for puppies and senior dogs.",
      team: [{name: 'Sophie', role: 'Walker', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80'}],
      menu: [{ name: '30 min Walk', price: 'CHF 30', duration: '30m' }, { name: '60 min Walk', price: 'CHF 50', duration: '1h' }],
      coords: { top: '55%', left: '70%' },
      verified: true,
      travelTime: '10 min walk',
      isLoved: true,
      walkerData: {
          neighborhood: 'Wiedikon',
          bio: "I love working with puppies and senior dogs. Patient, attentive, and always sending photo updates. Based in Wiedikon, 2 years with FYLOS.",
          languages: ["English", "German", "French"],
          certifications: [
              { id: 1, name: "Canine Behavior Basics", date: "Oct 2024" },
          ]
      }
  },
  {
      id: 12,
      name: 'Marco T.',
      type: 'Walking',
      rating: 5.0,
      reviews: 42,
      dist: '0.9km',
      price: 40,
      currency: 'CHF ',
      unit: '/walk',
      image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800&q=80',
      status: 'Available',
      tags: ['Reactive Dogs', 'River Walk', 'Experienced'],
      description: "Specialist in reactive and rescue dogs. Calm and confident.",
      team: [{name: 'Marco', role: 'Walker', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80'}],
      menu: [{ name: '45 min Walk', price: 'CHF 40', duration: '45m' }, { name: '90 min Walk', price: 'CHF 70', duration: '1.5h' }],
      coords: { top: '38%', left: '35%' },
      verified: true,
      travelTime: '8 min walk',
      isLoved: false,
      walkerData: {
          neighborhood: 'Enge',
          bio: "Former rescue center volunteer. I specialize in reactive dogs and dogs with behavioral challenges. Based in Enge, 4 years experience.",
          languages: ["English", "Italian", "German"],
          certifications: [
              { id: 1, name: "Reactive Dog Handling", date: "Jan 2025" },
              { id: 2, name: "First Aid (Pets)", date: "Mar 2024" },
              { id: 3, name: "Canine Behavior Advanced", date: "Sep 2024" },
          ]
      }
  }
];

// --- REUSABLE COMPONENTS ---

const StatusBar = ({ dark }) => (
  <div className={`absolute top-0 left-0 w-full h-[54px] flex justify-between items-end px-7 pb-3 z-[60] text-[13px] font-semibold tracking-wide ${dark ? 'text-white' : 'text-[#1A1A1A]'}`}>
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

// --- NEW COMPONENTS FOR PARTNERSHIP FLOW ---

const PartnershipCard = ({ onClick }) => (
  <div onClick={onClick} className="mx-5 mb-8 mt-2 bg-[#1A1A1A] rounded-[32px] p-6 relative overflow-hidden shadow-xl shadow-gray-200 active-press cursor-pointer group">
    {/* Background Decorations */}
    <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-[#FF5500]/20 to-transparent rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none transition-opacity duration-700 group-hover:opacity-100 opacity-70"></div>
    <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl -ml-10 -mb-10 pointer-events-none"></div>
    
    <div className="relative z-10">
       <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white border border-white/10 backdrop-blur-sm">
             <Sparkles size={20} className="fill-white/20"/>
          </div>
          <div className="bg-[#FF5500] px-3 py-1 rounded-full text-[10px] font-extrabold text-white shadow-sm tracking-wide">NEW</div>
       </div>
       <h3 className="text-xl font-black text-white font-brand mb-2 leading-tight">Work with Fylos</h3>
       <p className="text-gray-300 text-xs font-medium mb-6 leading-relaxed max-w-[80%]">Help pet owners. Do meaningful work. Earn on your terms.</p>
       <div className="flex items-center gap-2 text-white text-xs font-extrabold group-hover:gap-3 transition-all">
          Explore partnerships <ArrowRight size={14} strokeWidth={3} />
       </div>
    </div>
  </div>
);

const PartnershipFlow = ({ onClose }) => {
    const [selectedRole, setSelectedRole] = useState(null);

    // Simple role onboarding placeholder screen
    if (selectedRole) {
        return (
            <div className="absolute inset-0 bg-[#FAFAF9] z-[65] flex flex-col animate-slide-in-right overflow-hidden">
                {/* Header */}
                <div className="pt-[60px] pb-4 px-6 flex items-center bg-[#FAFAF9] sticky top-0 z-20">
                    <button onClick={() => setSelectedRole(null)} className="w-10 h-10 rounded-full bg-white flex items-center justify-center active-press shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors">
                        <ChevronLeft size={20} className="text-[#1A1A1A]"/>
                    </button>
                    <div className="flex-1 text-center pr-10">
                         <h2 className="text-base font-extrabold font-brand text-[#1A1A1A]">{selectedRole.title}</h2>
                    </div>
                </div>
                
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center animate-fade-in">
                    <div className={`w-24 h-24 rounded-[32px] ${selectedRole.colorBg} flex items-center justify-center mb-6 shadow-xl`}>
                        <selectedRole.icon size={40} className={selectedRole.colorText} strokeWidth={1.5} />
                    </div>
                    <h1 className="text-2xl font-black text-[#1A1A1A] font-brand mb-3">Become a {selectedRole.title}</h1>
                    <p className="text-sm text-gray-500 font-medium leading-relaxed max-w-xs mb-8">
                        Join our network of trusted {selectedRole.title.toLowerCase()}s. We're currently reviewing applications for your area.
                    </p>
                    <button onClick={onClose} className="w-full py-4 rounded-[24px] bg-[#1A1A1A] text-white font-extrabold text-sm shadow-xl active-press hover:bg-black transition-all">
                        Start Application
                    </button>
                </div>
            </div>
        );
    }

    // Role Selection Screen
    return (
        <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col animate-slide-up-full overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="pt-[60px] pb-6 px-6 flex items-center justify-between bg-[#FAFAF9] sticky top-0 z-20">
                 <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                    <X size={20} className="text-[#1A1A1A]" />
                 </button>
            </div>

            <div className="px-6 pb-20">
                <h1 className="text-2xl font-black text-[#1A1A1A] font-brand mb-8 leading-tight">How would you like to<br/>work with Fylos?</h1>

                {/* Independent Care Section */}
                <div className="mb-10">
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 ml-1">Independent Care Services</h3>
                    <div className="grid gap-4">
                        {[
                            { id: 'walker', title: 'Walker', desc: 'Walk pets on your schedule', icon: Footprints, colorBg: 'bg-green-50', colorText: 'text-green-600' },
                            { id: 'sitter', title: 'Sitter', desc: 'Care for pets in your space or theirs', icon: Sofa, colorBg: 'bg-yellow-50', colorText: 'text-yellow-600' },
                            { id: 'trainer', title: 'Trainer', desc: 'Help pets learn and improve behavior', icon: Medal, colorBg: 'bg-purple-50', colorText: 'text-purple-600' }
                        ].map((role) => (
                            <div 
                                key={role.id} 
                                onClick={() => setSelectedRole(role)}
                                className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 active-press cursor-pointer hover:border-gray-200 transition-all hover:shadow-md"
                            >
                                <div className={`w-14 h-14 rounded-[18px] ${role.colorBg} flex items-center justify-center shrink-0`}>
                                    <role.icon size={24} className={role.colorText} />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-[#1A1A1A] font-brand mb-1">{role.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{role.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Professional Partners Section */}
                <div>
                    <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-4 ml-1">For Registered Professionals</h3>
                    <div className="grid gap-4">
                         {[
                            { id: 'groomer', title: 'Groomer', desc: 'Grow your grooming client base', icon: Sparkles, colorBg: 'bg-orange-50', colorText: 'text-[#FF5500]' },
                            { id: 'vet', title: 'Veterinary Clinic', desc: 'Connect with local pet owners', icon: Stethoscope, colorBg: 'bg-blue-50', colorText: 'text-blue-600' }
                        ].map((role) => (
                            <div 
                                key={role.id} 
                                onClick={() => setSelectedRole(role)}
                                className="bg-white p-5 rounded-[24px] border border-gray-100 shadow-sm flex items-center gap-5 active-press cursor-pointer hover:border-gray-200 transition-all hover:shadow-md"
                            >
                                <div className={`w-14 h-14 rounded-[18px] ${role.colorBg} flex items-center justify-center shrink-0`}>
                                    <role.icon size={24} className={role.colorText} />
                                </div>
                                <div>
                                    <h4 className="text-base font-black text-[#1A1A1A] font-brand mb-1">{role.title}</h4>
                                    <p className="text-xs text-gray-500 font-medium">{role.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- COMPONENTS ---

const FilterBottomSheet = ({ onClose, onApply, currentFilters }) => {
    const [localFilters, setLocalFilters] = useState(currentFilters || {
        distance: 5,
        rating4Plus: false,
        availability: '',
        services: [],
        price: 'any'
    });

    const toggleService = (service) => {
        setLocalFilters(prev => {
            const exists = prev.services.includes(service);
            return {
                ...prev,
                services: exists 
                    ? prev.services.filter(s => s !== service)
                    : [...prev.services, service]
            };
        });
    };

    return (
        <div className="absolute inset-0 z-[60] flex items-end justify-center overflow-hidden">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm animate-fade-in" onClick={onClose}></div>
            
            {/* Sheet - Flex layout with fixed footer, properly constrained */}
            <div className="bg-[#FAFAF9] w-full rounded-t-[32px] shadow-2xl animate-slide-up-full relative z-10 flex flex-col h-[85%]">
                
                {/* Fixed Header */}
                <div className="flex justify-between items-center p-6 pb-2 shrink-0">
                    <h2 className="text-xl font-black text-[#1A1A1A] font-brand">Filters</h2>
                    <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
                        <X size={18} className="text-[#1A1A1A]" />
                    </button>
                </div>

                {/* Scrollable Content - flex-1 ensures it takes remaining space */}
                <div className="flex-1 overflow-y-auto no-scrollbar px-6 space-y-8 pb-4">
                    {/* Distance */}
                    <div>
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Distance</h3>
                        <div className="bg-white p-1 rounded-full border border-gray-100 flex shadow-sm">
                            {[1, 3, 5, 10].map(km => (
                                <button 
                                    key={km}
                                    onClick={() => setLocalFilters({...localFilters, distance: km})}
                                    className={`flex-1 py-2.5 rounded-full text-xs font-bold transition-all ${
                                        localFilters.distance === km 
                                        ? 'bg-[#1A1A1A] text-white shadow-md' 
                                        : 'text-gray-500 hover:text-[#1A1A1A]'
                                    }`}
                                >
                                    &lt; {km}km
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Rating */}
                    <div>
                        <div 
                            className="flex justify-between items-center bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm active-press cursor-pointer"
                            onClick={() => setLocalFilters({...localFilters, rating4Plus: !localFilters.rating4Plus})}
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-yellow-50 flex items-center justify-center text-yellow-500">
                                    <Star size={18} className="fill-current" />
                                </div>
                                <span className="text-sm font-bold text-[#1A1A1A]">4.0+ Rating Only</span>
                            </div>
                            <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${localFilters.rating4Plus ? 'bg-[#FF5500] border-[#FF5500]' : 'border-gray-200'}`}>
                                {localFilters.rating4Plus && <Check size={12} className="text-white" strokeWidth={4} />}
                            </div>
                        </div>
                    </div>

                    {/* Availability */}
                    <div>
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Availability</h3>
                        <div className="flex gap-3">
                            {['Open now', 'Available today'].map(opt => (
                                <button
                                    key={opt}
                                    onClick={() => setLocalFilters({...localFilters, availability: localFilters.availability === opt ? '' : opt})}
                                    className={`px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                                        localFilters.availability === opt
                                        ? 'bg-[#FF5500]/10 border-[#FF5500] text-[#FF5500]'
                                        : 'bg-white border-gray-100 text-gray-500'
                                    }`}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Service Type */}
                    <div>
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Service Type</h3>
                        <div className="flex flex-wrap gap-2">
                            {['Veterinary', 'Grooming', 'Walking', 'Training', 'Sit'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => toggleService(type)}
                                    className={`px-4 py-2.5 rounded-[16px] text-xs font-bold border transition-all ${
                                        localFilters.services.includes(type)
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-gray-500 hover:border-gray-300'
                                    }`}
                                >
                                    {type}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Price */}
                    <div>
                        <h3 className="text-xs font-extrabold text-gray-400 uppercase tracking-widest mb-3">Price</h3>
                        <div className="flex gap-3">
                            {[
                                { id: 'best', label: 'Best Price', icon: Zap },
                                { id: 'any', label: 'No Preference', icon: CheckCircle2 }
                            ].map(opt => (
                                <button
                                    key={opt.id}
                                    onClick={() => setLocalFilters({...localFilters, price: opt.id})}
                                    className={`flex-1 py-4 rounded-[20px] border flex flex-col items-center gap-2 transition-all ${
                                        localFilters.price === opt.id
                                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg'
                                        : 'bg-white border-gray-100 text-gray-500'
                                    }`}
                                >
                                    <opt.icon size={20} className={localFilters.price === opt.id ? 'text-[#FF5500]' : 'text-gray-300'} />
                                    <span className="text-xs font-bold">{opt.label}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Fixed Footer Buttons - shrink-0 ensures it stays fixed size */}
                <div className="p-6 border-t border-gray-100 bg-[#FAFAF9] flex flex-col gap-3 shrink-0">
                    <button 
                        onClick={() => onApply(localFilters)}
                        className="w-full py-4 rounded-[24px] bg-[#FF5500] text-white font-extrabold text-sm shadow-xl shadow-orange-500/20 active-press hover:shadow-orange-500/40 transition-all"
                    >
                        Apply Filters
                    </button>
                    <button 
                        onClick={() => {
                            setLocalFilters({ distance: 10, rating4Plus: false, availability: '', services: [], price: 'any' });
                        }}
                        className="w-full py-2 text-xs font-bold text-gray-400 hover:text-[#1A1A1A] transition-colors"
                    >
                        Reset all
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProviderProfile = ({ provider, onClose, onBookClick }) => {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <div className="absolute inset-0 bg-[#FAFAF9] z-[55] flex flex-col animate-slide-in-right overflow-y-auto no-scrollbar">
            {/* Hero Image Header */}
            <div className="relative h-[280px] w-full shrink-0">
                <img src={provider.image} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#FAFAF9]"></div>
                
                {/* Nav Buttons */}
                <div className="absolute top-[60px] left-6">
                    <button onClick={onClose} className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active-press border border-white/30 shadow-lg hover:bg-white/30 transition-colors"><ChevronLeft size={20}/></button>
                </div>
                <div className="absolute top-[60px] right-6 flex gap-3">
                    {provider.emergency && (
                        <button className="w-10 h-10 rounded-full bg-red-500/90 backdrop-blur-md flex items-center justify-center text-white active-press border border-red-400 shadow-lg animate-pulse-orange">
                            <Siren size={18} fill="currentColor"/>
                        </button>
                    )}
                    <button onClick={() => setIsFavorite(!isFavorite)} className={`w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center active-press border border-white/30 shadow-lg hover:bg-white/30 transition-colors ${isFavorite ? 'text-[#FF5500] fill-current' : 'text-white'}`}>
                        <Heart size={18} fill={isFavorite ? 'currentColor' : 'none'}/>
                    </button>
                    <button className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-white active-press border border-white/30 shadow-lg hover:bg-white/30 transition-colors"><Share2 size={18}/></button>
                </div>

                {/* Info Overlay (Floating Card) */}
                <div className="absolute bottom-0 left-5 right-5 translate-y-1/4 p-5 bg-white rounded-[24px] shadow-[0_20px_40px_-10px_rgba(0,0,0,0.08)] border border-gray-100">
                    <div className="flex justify-between items-start">
                        <h1 className="text-2xl font-black text-[#1A1A1A] font-brand mb-1.5">{provider.name}</h1>
                        {provider.verified && <Shield size={18} className="text-[#FF5500] fill-current mt-1.5" />}
                    </div>
                    <div className="flex items-center gap-2.5 text-xs text-gray-500 font-bold">
                        <span className="flex items-center gap-1 text-[#FF5500]"><Star size={12} className="fill-current"/> {provider.rating}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="text-green-600">{provider.status}</span>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="flex items-center gap-1"><Car size={12}/> {provider.travelTime}</span>
                    </div>
                </div>
            </div>

            <div className="px-5 pt-20 pb-32">
                {/* Team Section with Pet Match */}
                <div className="mb-6 flex justify-between items-end">
                    <div>
                      <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-3 ml-1 font-brand">Team</h3>
                      <div className="flex gap-3 overflow-x-auto no-scrollbar py-1">
                          {provider.team.map((member, i) => (
                             <div key={i} className="flex items-center gap-2.5 bg-white p-2.5 pr-5 rounded-full border border-gray-100 shadow-sm shrink-0 active-press">
                                 <img src={member.img} className="w-9 h-9 rounded-full object-cover ring-2 ring-gray-50"/>
                                 <div>
                                     <span className="text-xs font-bold block text-[#1A1A1A]">{member.name}</span>
                                     <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wide">{member.role}</span>
                                 </div>
                             </div>
                          ))}
                      </div>
                    </div>
                </div>
                
                {/* Pet Match Indicator (Feature 6) */}
                <div className="mb-6 bg-green-50 p-3 rounded-2xl border border-green-100 flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                        <Dog size={16} />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-green-800">Great Match for Baxter!</p>
                        <p className="text-[10px] text-green-600">Specializes in large breeds and anxious pets.</p>
                    </div>
                </div>

                {/* About Section */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1 font-brand">About</h3>
                    <p className="text-sm text-gray-600 leading-relaxed font-medium">{provider.description}</p>
                    
                    {/* Tags */}
                    <div className="flex gap-2 mt-3 flex-wrap">
                        {provider.tags.map(tag => (
                            <span key={tag} className="text-[10px] font-bold bg-white border border-gray-200 text-gray-500 px-3 py-1.5 rounded-lg">{tag}</span>
                        ))}
                    </div>
                </div>

                {/* Location Snippet */}
                <div className="mb-6">
                    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1 font-brand">Location</h3>
                    <div className="h-36 bg-[#F9F5F1] rounded-[24px] relative overflow-hidden border border-gray-100 shadow-inner">
                          <iframe 
                            width="100%" 
                            height="100%" 
                            frameBorder="0" 
                            scrolling="no" 
                            marginHeight="0" 
                            marginWidth="0" 
                            src={`https://www.openstreetmap.org/export/embed.html?bbox=8.53,47.36,8.56,47.38&layer=mapnik&marker=${47.37},${8.55}`}
                            style={{ filter: 'grayscale(100%) opacity(0.6) contrast(0.8) brightness(1.1)' }} 
                            className="w-full h-full pointer-events-none"
                          ></iframe>
                          <button className="absolute bottom-3 right-3 bg-white px-3.5 py-2 rounded-xl shadow-lg flex items-center gap-2 text-[10px] font-extrabold text-[#1A1A1A] border border-gray-100 active-press z-10 hover:bg-gray-50 transition-colors">
                              <Navigation size={12} className="text-[#FF5500]"/> Directions
                          </button>
                    </div>
                </div>

                {/* Service Menu */}
                <div>
                    <h3 className="text-[10px] font-extrabold text-gray-400 uppercase tracking-widest mb-2 ml-1 font-brand">Services</h3>
                    <div className="space-y-2.5">
                        {provider.menu.map((item, i) => (
                            <button key={i} onClick={() => onBookClick(item)} className="w-full bg-white p-4 rounded-[20px] border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] flex items-center justify-between active-press hover:border-[#FF5500] transition-all group hover:shadow-[0_8px_20px_-8px_rgba(255,85,0,0.15)]">
                                <div className="text-left">
                                    <span className="text-sm font-extrabold text-[#1A1A1A] block mb-0.5 font-brand">{item.name}</span>
                                    <span className="text-[10px] text-gray-400 font-bold flex items-center gap-1"><Clock size={10}/> {item.duration}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-sm font-extrabold text-[#1A1A1A] font-brand">{item.price}</span>
                                    <div className="w-8 h-8 rounded-full bg-[#FAFAF9] group-hover:bg-[#FF5500] flex items-center justify-center transition-all">
                                        <Plus size={16} className="text-gray-400 group-hover:text-white transition-colors"/>
                                    </div>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- BOOKING FLOW ---

const BookingFlow = ({ provider, service, onClose, showToast }) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(24);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [calendarSync, setCalendarSync] = useState(true); // Feature 8
  const [note, setNote] = useState("");
  const scrollRef = useRef(null);

  // Feature 1: Availability Dots logic
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

  // Feature 10: Post-Booking "Calm" Screen
  if (step === 2) return (
      <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col items-center justify-center animate-fade-in">
          {/* Success Card Animation */}
          <div className="w-[300px] bg-white p-6 rounded-[32px] shadow-2xl border border-gray-50 flex flex-col items-center text-center animate-slide-up relative overflow-hidden">
              <div className="w-20 h-20 rounded-full border-[4px] border-[#FAFAF9] shadow-inner flex items-center justify-center mb-6 bg-green-50">
                  <div className="w-16 h-16 bg-[#FF5500] rounded-full animate-fill-dot origin-center shadow-lg shadow-orange-500/30 flex items-center justify-center">
                      <Check size={32} className="text-white animate-scale-in" strokeWidth={4} />
                  </div>
              </div>
              <h2 className="text-xl font-black font-brand text-[#1A1A1A] mb-2">All set, Nikos!</h2>
              <p className="text-gray-500 text-xs font-medium mb-6 leading-relaxed">
                  Your appointment for <br/><span className="text-[#1A1A1A] font-bold">{service.name}</span> is confirmed.
              </p>
              
              {/* Feature 7: Appointment "Card" Visual */}
              <div className="w-full bg-[#FAFAF9] rounded-[20px] p-4 mb-6 border border-gray-100">
                  <div className="flex justify-between items-center mb-2">
                      <span className="text-[10px] font-bold text-gray-400 uppercase">DATE</span>
                      <span className="text-[10px] font-bold text-gray-400 uppercase">TIME</span>
                  </div>
                  <div className="flex justify-between items-center">
                      <span className="text-sm font-black text-[#1A1A1A]">Oct {selectedDate}</span>
                      <span className="text-sm font-black text-[#1A1A1A]">{selectedSlot}</span>
                  </div>
              </div>

              <button onClick={() => { showToast('Saved to Wallet'); onClose(); }} className="text-white font-extrabold text-xs bg-[#1A1A1A] px-10 py-4 rounded-full shadow-lg active-press hover:bg-black transition-colors w-full">Done</button>
              <button className="mt-4 text-[10px] font-bold text-gray-400 hover:text-[#FF5500]">Add to Apple Wallet</button>
          </div>
      </div>
  );

  return (
    <div className="absolute inset-0 bg-[#FAFAF9] z-[60] flex flex-col animate-slide-in-right h-full overflow-hidden">
      {/* Sticky Header */}
      <div className="absolute top-0 w-full pt-[60px] pb-3 px-5 flex items-center justify-between bg-[#FAFAF9]/95 backdrop-blur-sm z-20 border-b border-gray-100/50">
         <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center active-press shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"><ChevronLeft size={20} className="text-[#1A1A1A]"/></button>
         <h2 className="text-base font-extrabold font-brand text-[#1A1A1A]">Booking</h2>
         <div className="w-10"></div>
      </div>

      {/* Scrollable Content - Booking Info + Notes */}
      <div ref={scrollRef} className="flex-1 overflow-hidden pt-[105px] pb-0" style={{ minHeight: 0 }}>
         <div className="p-4 pb-2">
            <div className="bg-white p-4 rounded-[20px] border border-gray-100 shadow-sm flex items-center gap-3.5 mb-4.5 animate-scale-in origin-top">
                <div className="w-14 h-14 bg-[#FF5500]/10 rounded-[16px] flex items-center justify-center text-[#FF5500]"><Calendar size={22}/></div>
                <div>
                    <h3 className="font-extrabold text-[#1A1A1A] text-sm leading-tight font-brand">{service.name}</h3>
                    <p className="text-[10px] text-gray-500 mt-0.5 font-medium">{provider.name} • {service.duration}</p>
                </div>
            </div>
         </div>

         <div className="px-4 mb-[13px]">
            <div className="flex justify-between items-center mb-4">
                <h4 className="font-extrabold text-[#1A1A1A] text-base font-brand">October 2025</h4>
                <div className="flex gap-2">
                    <button className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active-press"><ChevronLeft size={16}/></button>
                    <button className="w-8 h-8 rounded-full bg-white border border-gray-100 flex items-center justify-center text-gray-600 active-press"><ChevronRight size={16}/></button>
                </div>
            </div>
            <div className="flex justify-between">
                {dates.map((item, i) => (
                    <button 
                        key={i} 
                        disabled={item.busy === 'full'}
                        onClick={() => setSelectedDate(item.d)}
                        style={{ transitionDelay: `${i * 0.05}s` }}
                        className={`flex flex-col items-center justify-center w-[44px] h-[66px] rounded-[14px] transition-all duration-300 animate-slide-up-fade ${
                            selectedDate === item.d ? 'bg-[#FF5500] text-white shadow-lg shadow-orange-500/30 scale-105' : 
                            item.busy === 'full' ? 'bg-gray-50 text-gray-300 cursor-not-allowed' : 'bg-white text-gray-400 border border-gray-100 hover:border-gray-300'
                        }`}
                    >
                        <span className={`text-[10px] font-bold mb-1 ${selectedDate === item.d ? 'opacity-90' : 'opacity-60'}`}>{item.day}</span>
                        <span className="text-xl font-black font-brand">{item.d}</span>
                        
                        {/* Feature 1: Availability Dots */}
                        {selectedDate !== item.d && item.busy !== 'full' && (
                            <div className={`w-1 h-1 rounded-full mt-1 ${
                                item.busy === 'high' ? 'bg-green-400' : 
                                item.busy === 'med' ? 'bg-orange-300' : 'bg-red-400'
                            }`}></div>
                        )}
                        {selectedDate === item.d && <div className="w-1 h-1 bg-white rounded-full mt-1"></div>}
                    </button>
                ))}
            </div>
            {/* Feature 2: Waitlist option if full */}
            <div className="mt-4 flex justify-end">
                <button className="text-[10px] font-bold text-[#FF5500] flex items-center gap-1"><Bell size={10}/> Join Waitlist</button>
            </div>
         </div>

         <div className="px-4 mb-5">
            <h4 className="font-extrabold text-[#1A1A1A] text-base font-brand mb-4">Time Slot</h4>
            <div className="grid grid-cols-3 gap-3.5">
                {slots.map((slot, i) => (
                    <button 
                        key={i}
                        onClick={() => setSelectedSlot(slot)}
                        style={{ animationDelay: `${0.2 + (i * 0.05)}s` }}
                        className={`py-[12px] rounded-[16px] text-base font-bold transition-all border animate-slide-up-fade ${selectedSlot === slot ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' : 'bg-white text-gray-600 border-gray-100 hover:border-gray-300 hover:bg-gray-50'}`}
                    >
                        {slot}
                    </button>
                ))}
            </div>
         </div>

         <div className="px-4 pb-4 animate-slide-up-fade" style={{animationDelay: '0.5s'}}>
             <div className="flex justify-between items-center mb-3.5">
                 <h4 className="font-extrabold text-[#1A1A1A] text-sm font-brand">Note</h4>
                 {/* Feature 8: Calendar Sync Toggle */}
                 <div className="flex items-center gap-1.5" onClick={() => setCalendarSync(!calendarSync)}>
                     <span className="text-[9px] font-bold text-gray-400">Sync Calendar</span>
                     <div className={`w-7 h-3.5 rounded-full p-0.5 transition-colors ${calendarSync ? 'bg-[#FF5500]' : 'bg-gray-200'}`}>
                         <div className={`w-2.5 h-2.5 bg-white rounded-full shadow-sm transition-transform ${calendarSync ? 'translate-x-3.5' : 'translate-x-0'}`}></div>
                     </div>
                 </div>
             </div>
             <textarea 
                placeholder="E.g., Allergies, behavioral notes..." 
                className="w-full bg-white border border-gray-200 rounded-[18px] p-4 text-xs font-medium focus:outline-none focus:border-[#FF5500] focus:ring-4 focus:ring-orange-500/10 transition-all placeholder:text-gray-300 resize-none shadow-sm"
                rows={2}
                value={note}
                onChange={(e) => setNote(e.target.value)}
             />
         </div>
      </div>

      {/* Total Price + Button - Separate section above menu */}
      <div className="flex-shrink-0 px-4 py-4 bg-[#FAFAF9] border-t border-gray-100 shadow-lg z-30" style={{ marginBottom: '80px' }}>
            <div className="flex justify-between items-center mb-3 px-1">
               <span className="text-gray-400 text-[10px] font-bold">Total</span>
               <span className="text-xl font-black text-[#1A1A1A] font-brand tracking-tight">{service.price}</span>
            </div>
            <button 
               onClick={handleBook}
               disabled={!selectedSlot}
               className={`w-full py-3 rounded-[20px] font-extrabold text-xs transition-all active-press ${selectedSlot ? 'bg-[#FF5500] text-white shadow-xl shadow-orange-500/25 hover:shadow-2xl hover:shadow-orange-500/40' : 'bg-gray-100 text-gray-300 cursor-not-allowed'}`}
            >
               Confirm Booking
            </button>
      </div>
    </div>
  );
};

// --- EXPLORE VIEW (ENHANCED) ---

const FeaturedCarousel = ({ items, onSelect }) => (
  <div className="mb-8 mt-2 animate-slide-up-fade">
    <div className="flex justify-between items-end px-5 mb-4">
        <h3 className="text-sm font-extrabold text-[#1A1A1A] font-brand tracking-wide">TRENDING</h3>
        <button 
            onClick={() => onSelect('trending-view')} // Placeholder for view all functionality
            className="text-xs font-bold text-[#FF5500] active-press hover:opacity-80 transition-opacity flex items-center gap-1"
        >
            View all <ArrowRight size={12} strokeWidth={3} />
        </button>
    </div>
    <div className="flex gap-4 overflow-x-auto px-5 pb-8 no-scrollbar snap-x">
        {items.slice(0, 4).map((item, i) => (
            <div 
                key={item.id} 
                onClick={() => onSelect(item)} 
                style={{ animationDelay: `${i * 0.1}s` }} 
                className="snap-center shrink-0 w-[240px] h-[300px] relative rounded-[32px] overflow-hidden shadow-[0_12px_30px_-8px_rgba(0,0,0,0.15)] active-press hover-lift cursor-pointer animate-slide-up-fade"
            >
                {/* Image */}
                <img src={item.image} className="w-full h-full object-cover transition-transform duration-700 hover:scale-110" />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                
                {/* Content */}
                <div className="absolute bottom-0 w-full p-5">
                    <h4 className="font-extrabold text-white text-lg mb-2 font-brand leading-tight">{item.name}</h4>
                    <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-xs font-bold text-gray-200 bg-white/20 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/10">
                            <MapPin size={10} className="text-[#FF5500]" /> {item.dist}
                        </span>
                        <span className="flex items-center gap-1 text-xs font-bold text-white">
                            <Star size={12} className="text-[#FF5500] fill-current"/> {item.rating}
                        </span>
                    </div>
                </div>
            </div>
        ))}
    </div>
  </div>
);

// --- NEW COMPONENT: TRENDING LIST VIEW ---
const TrendingListView = ({ onClose, onSelect }) => {
    // Filter services to show (e.g., top rated ones) for this view
    const trendingServices = SERVICES_DATA.filter(s => s.isLoved);

    return (
        <div className="absolute inset-0 bg-[#FAFAF9] z-[55] flex flex-col animate-slide-in-right overflow-y-auto no-scrollbar">
            {/* Header */}
            <div className="pt-[60px] pb-4 px-6 flex items-center justify-between bg-[#FAFAF9]/95 backdrop-blur-sm sticky top-0 z-20 border-b border-gray-100/50">
                 <button onClick={onClose} className="w-10 h-10 rounded-full bg-white flex items-center justify-center active-press shadow-sm border border-gray-100 hover:bg-gray-50 transition-colors"><ChevronLeft size={20} className="text-[#1A1A1A]"/></button>
                 <h2 className="text-base font-extrabold font-brand text-[#1A1A1A]">People love these</h2>
                 <div className="w-10"></div>
            </div>

            <div className="px-5 pt-4 pb-32 space-y-4">
                 {trendingServices.map((service, index) => {
                    const isAvailable = service.status === 'Open' || service.status === 'Available';
                    // Determine button text and style based on availability
                    const buttonText = isAvailable ? 'Book' : 'View';
                    const buttonStyle = isAvailable 
                        ? 'text-[#FF5500] bg-[#FF5500]/5 border-[#FF5500]/10 hover:bg-[#FF5500] hover:text-white' 
                        : 'text-gray-500 bg-gray-100 border-transparent cursor-not-allowed'; // Or a subtle view style

                    // Status Text Color Logic
                    let statusColorClass = 'text-gray-400';
                    if (service.status === 'Open' || service.status === 'Available') statusColorClass = 'text-green-600 font-semibold';
                    else if (service.status === 'Classes Full' || service.status === 'Busy') statusColorClass = 'text-orange-400 font-medium';
                    else if (service.status === 'Closing Soon') statusColorClass = 'text-orange-500 font-medium';

                    return (
                        <div 
                            key={service.id} 
                            onClick={() => onSelect(service)} 
                            style={{ animationDelay: `${index * 0.08}s` }}
                            className="bg-white p-3 rounded-[24px] border border-white shadow-[0_4px_15px_-5px_rgba(0,0,0,0.03)] active-press cursor-pointer hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] transition-all duration-300 animate-slide-up-fade group relative overflow-visible" 
                        >
                            <div className="flex gap-3.5">
                                <div className="w-[72px] h-[72px] rounded-[18px] overflow-hidden shrink-0 bg-gray-50 relative group-hover:scale-[1.02] transition-transform duration-300">
                                    <img src={service.image} className="w-full h-full object-cover" />
                                    
                                    {/* NEW: Heart Badge - Top Left Intersection - STATIC & ORANGE */}
                                    <div className="absolute -top-1.5 -left-1.5 bg-[#FF5500] p-1.5 rounded-full border-2 border-white shadow-sm z-20">
                                        <Heart size={10} className="text-white fill-current" />
                                    </div>
                                    
                                </div>
                                <div className="flex-1 py-0.5 flex flex-col justify-center">
                                    <div className="flex justify-between items-start mb-0.5">
                                        <span className="text-[15px] font-black text-[#1A1A1A] block font-brand leading-tight tracking-tight">{service.name}</span>
                                        <div className="bg-[#FAFAF9] px-1.5 py-0.5 rounded-[8px] text-[9px] font-bold border border-gray-100 flex items-center gap-1">
                                            <Star size={9} className="fill-current" /> {service.rating}
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className={`text-[10px] font-medium flex items-center gap-1 text-gray-400`}>
                                            <MapPin size={10} strokeWidth={1.5}/> {service.dist} • <span className={`text-[10px] ${statusColorClass}`}>{service.status}</span>
                                        </span>
                                        <button 
                                            onClick={(e) => { 
                                                e.stopPropagation(); 
                                                if(isAvailable) setSelectedProvider(service); // Only book if available
                                                else onSelect(service); // Just view otherwise
                                            }} 
                                            className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition-colors ${buttonStyle}`}
                                        >
                                            {buttonText}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

const SortToggle = ({ current, onSort, compact }) => (
    <div className="flex w-full gap-2 items-center">
        {[
            { id: 'recommended', label: 'Recommended', icon: Star },
            { id: 'distance', label: 'Nearest', icon: Navigation },
            { id: 'price_low', label: 'Best Price', icon: Zap }
        ].map((s) => (
            <button 
                key={s.id}
                onClick={() => onSort(s.id)}
                className={`flex-1 rounded-full font-bold border filter-transition flex items-center justify-center gap-1.5 active-press whitespace-nowrap ${
                    compact ? 'px-1 py-1.5 text-[9px]' : 'px-2 py-2 text-[10px]'
                } ${
                    current === s.id 
                    ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-md shadow-gray-200' 
                    : 'bg-white text-gray-500 border-gray-100 hover:border-gray-200 hover:bg-gray-50'
                }`}
            >
                <s.icon size={compact ? 10 : 11} strokeWidth={2.5} className={current === s.id ? 'text-[#FF5500]' : ''} />
                <span className="truncate">{s.label}</span>
            </button>
        ))}
    </div>
);

const ExploreView = ({ showToast, onOverlayChange }) => {
    const [viewMode, setViewMode] = useState('list');
    const [selectedCategory, setSelectedCategory] = useState('All');
    const [sortBy, setSortBy] = useState('recommended'); 
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilters, setShowFilters] = useState(false);
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const [filterState, setFilterState] = useState({
        distance: 5,
        rating4Plus: false,
        availability: '',
        services: [],
        price: 'any'
    });
    const [scrollProgress, setScrollProgress] = useState(0);
    const contentRef = useRef(null);
    
    const [selectedProvider, setSelectedProvider] = useState(null); 
    const [selectedService, setSelectedService] = useState(null);
    const [previewProvider, setPreviewProvider] = useState(null);
    const [showTrendingList, setShowTrendingList] = useState(false);
    
    // NEW STATE: Partnership Flow
    const [showPartnership, setShowPartnership] = useState(false);
    
    // Walker booking flow state
    const [showWalkerBooking, setShowWalkerBooking] = useState(false);

    // Notify parent to hide NavBar when walker overlay is active
    useEffect(() => {
        if (onOverlayChange) {
            const hasWalkerOverlay = !!(selectedProvider?.walkerData || showWalkerBooking);
            onOverlayChange(hasWalkerOverlay);
        }
    }, [selectedProvider, showWalkerBooking, onOverlayChange]);

    // Apply Filter Logic (Simulation)
    const applyFilters = (service) => {
        // Distance
        const distVal = parseFloat(service.dist);
        if (distVal > filterState.distance) return false;

        // Rating
        if (filterState.rating4Plus && service.rating < 4.0) return false;

        // Services (if selected)
        if (filterState.services.length > 0) {
            // Mapping app types to filter types loosely for demo
            const typeMap = { 'Veterinary': 'Vet', 'Grooming': 'Groom', 'Walking': 'Walk', 'Training': 'Train', 'Sit': 'Sit' };
            const serviceTypeFilter = typeMap[service.type];
            if (!filterState.services.includes(serviceTypeFilter)) return false;
        }

        // Availability (simple check)
        if (filterState.availability === 'Open now' && service.status !== 'Open') return false;
        
        // Price (simple check)
        // In real app, check service.price vs preference

        return true;
    };


    // Filter Logic
    let filteredServices = SERVICES_DATA.filter(s => 
        (selectedCategory === 'All' || s.type === selectedCategory) &&
        (s.name.toLowerCase().includes(searchQuery.toLowerCase())) &&
        applyFilters(s)
    );

    // Sorting Logic
    filteredServices.sort((a, b) => {
        if (sortBy === 'distance') {
            return parseFloat(a.dist) - parseFloat(b.dist);
        } else if (sortBy === 'price_low') {
            return a.price - b.price;
        } else if (sortBy === 'recommended') {
            return b.rating - a.rating; 
        }
        return 0;
    });

    const closeAll = () => {
        setSelectedService(null);
        setSelectedProvider(null);
        setPreviewProvider(null);
        setShowTrendingList(false);
        setShowPartnership(false);
        setShowWalkerBooking(false);
    };

    const handleScroll = (e) => {
        const threshold = 120; // px range for animation
        const current = e.target.scrollTop;
        const progress = Math.max(0, Math.min(current / threshold, 1));
        setScrollProgress(progress);
    };

    return (
        <div className="pt-[50px] pb-24 animate-fade-in h-full flex flex-col pointer-events-none">
            
            {/* STACK LAYERS */}
            <div className="pointer-events-auto">
                {isFilterOpen && (
                    <FilterBottomSheet 
                        onClose={() => setIsFilterOpen(false)} 
                        currentFilters={filterState}
                        onApply={(newFilters) => {
                            setFilterState(newFilters);
                            setIsFilterOpen(false);
                        }}
                    />
                )}
                {showTrendingList && <TrendingListView onClose={() => setShowTrendingList(false)} onSelect={setSelectedProvider} />}
                {showPartnership && <PartnershipFlow onClose={() => setShowPartnership(false)} />}
                
                {/* Walker-specific flow: Profile → Booking → Payment → Done */}
                {showWalkerBooking && (
                    <WalkerBookingFlow onClose={closeAll} />
                )}
                {selectedProvider && selectedProvider.walkerData && !showWalkerBooking && (
                    <div className="absolute inset-0 z-[55] bg-white animate-slide-in-right overflow-hidden">
                        <WalkerProfileView 
                            provider={{
                                id: selectedProvider.id,
                                name: selectedProvider.name,
                                image: selectedProvider.image,
                                rating: selectedProvider.rating,
                                reviews: selectedProvider.reviews,
                                neighborhood: selectedProvider.walkerData.neighborhood,
                                bio: selectedProvider.walkerData.bio,
                                languages: selectedProvider.walkerData.languages,
                                certifications: selectedProvider.walkerData.certifications,
                            }}
                            onBack={() => setSelectedProvider(null)}
                            onBook={() => setShowWalkerBooking(true)}
                        />
                    </div>
                )}
                
                {/* Generic provider flow (non-walker) */}
                {selectedService && selectedProvider && !selectedProvider.walkerData && <BookingFlow provider={selectedProvider} service={selectedService} onClose={closeAll} showToast={showToast} />}
                {selectedProvider && !selectedService && !selectedProvider.walkerData && <ProviderProfile provider={selectedProvider} onClose={() => setSelectedProvider(null)} onBookClick={(service) => setSelectedService(service)} />}
            </div>

            {/* HEADER - Sticky & Animated - UNIFIED TRANSLUCENCY ON SCROLL */}
            <div className="absolute top-[40px] left-0 w-full z-40 pointer-events-auto">
                
                {/* Unified Container - Simulates iOS blurred header */}
                <div 
                    className="px-5 transition-all-smooth"
                    style={{
                        backgroundColor: scrollProgress > 0.1 ? 'rgba(255, 255, 255, 0.95)' : '#FFFFFF', 
                        backdropFilter: scrollProgress > 0.1 ? 'blur(12px)' : 'none',
                        paddingTop: `${16 - (8 * scrollProgress)}px`, 
                        paddingBottom: `${12 - (4 * scrollProgress)}px`,
                        boxShadow: scrollProgress > 0.1 ? '0 4px 20px rgba(0,0,0,0.03)' : 'none',
                        borderBottom: scrollProgress > 0.1 ? '1px solid rgba(0,0,0,0.05)' : '1px solid transparent'
                    }}
                >
                    <div 
                        className="flex justify-between items-center"
                        style={{ marginBottom: `${20 - (12 * scrollProgress)}px` }} 
                    >
                          <div>
                              <h1 
                                className="font-black text-[#1A1A1A] font-brand tracking-tight origin-left"
                                style={{ 
                                    fontSize: `${24 - (6 * scrollProgress)}px`,
                                    lineHeight: '1.2'
                                }}
                              >Explore</h1>
                              <p 
                                className="text-[10px] font-bold text-gray-400 mt-0.5 ml-0.5 tracking-wide overflow-hidden"
                                style={{ 
                                    opacity: 1 - (scrollProgress * 2),
                                    height: `${14 * (1 - scrollProgress)}px`
                                }}
                              >Everything your pet needs</p>
                          </div>
                          <div 
                            className="bg-white/80 px-3 py-1.5 rounded-xl border border-gray-100 flex items-center gap-2 text-[10px] font-extrabold text-[#1A1A1A] shadow-sm backdrop-blur origin-right"
                            style={{ transform: `scale(${1 - (0.1 * scrollProgress)})` }}
                          >
                              <div className="w-1.5 h-1.5 rounded-full bg-[#FF5500] animate-pulse"></div> Zurich
                          </div>
                    </div>
                    
                    <div 
                        className="flex gap-2.5"
                        style={{ marginBottom: `${20 - (12 * scrollProgress)}px` }}
                    >
                        <div 
                            className="flex-1 bg-white rounded-[20px] flex items-center px-4 shadow-[0_4px_20px_rgba(0,0,0,0.02)] border border-white focus-within:border-[#FF5500]/50 focus-within:ring-4 focus-within:ring-orange-500/10 transition-all group"
                            style={{ height: `${48 - (4 * scrollProgress)}px` }}
                        >
                            <Search size={18} className="text-gray-300 mr-2.5 group-focus-within:text-[#FF5500] transition-colors" />
                            <input 
                                type="text" 
                                placeholder="Find vet, groomer..." 
                                className="bg-transparent border-none focus:outline-none text-xs font-bold w-full placeholder-gray-300 text-[#1A1A1A] h-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <button 
                            onClick={() => setViewMode(prev => prev === 'list' ? 'map' : 'list')}
                            className={`rounded-[20px] flex items-center justify-center shadow-[0_4px_20px_rgba(0,0,0,0.02)] active-press border transition-all duration-300 ${viewMode === 'map' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-white text-[#1A1A1A] border-white hover:border-gray-200'}`}
                            style={{ 
                                width: `${48 - (4 * scrollProgress)}px`,
                                height: `${48 - (4 * scrollProgress)}px`
                            }}
                        >
                            {viewMode === 'list' ? <MapIcon size={20} /> : <List size={20} />}
                        </button>
                    </div>
                    
                    {selectedCategory === 'All' && searchQuery === '' && (
                        <div 
                            className="grid grid-cols-5 gap-2 overflow-hidden"
                            style={{ marginBottom: `${20 - (12 * scrollProgress)}px` }}
                        >
                            {[
                                { id: 'Veterinary', icon: Stethoscope, label: 'Vet', color: 'bg-blue-50 text-blue-600 border-blue-100' },
                                { id: 'Grooming', icon: ShoppingBag, label: 'Groom', color: 'bg-orange-50 text-[#FF5500] border-orange-100' },
                                { id: 'Walking', icon: Footprints, label: 'Walk', color: 'bg-green-50 text-green-600 border-green-100' },
                                { id: 'Training', icon: Medal, label: 'Train', color: 'bg-purple-50 text-purple-600 border-purple-100' },
                                { id: 'Sit', icon: Sofa, label: 'Sit', color: 'bg-yellow-50 text-yellow-600 border-yellow-100' }
                            ].map((cat, i) => (
                                <button key={cat.id} onClick={() => setSelectedCategory(cat.id === selectedCategory ? 'All' : cat.id)} className="flex flex-col items-center gap-1.5 active-press group">
                                    <div 
                                        className={`rounded-[22px] flex items-center justify-center border-2 transition-all duration-75 bg-opacity-60 ${selectedCategory === cat.id ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-lg' : 'bg-white border-transparent text-gray-400 group-hover:border-current/10'}`}
                                        style={{
                                            width: `${56 - (16 * scrollProgress)}px`, 
                                            height: `${56 - (16 * scrollProgress)}px`
                                        }}
                                    >
                                        <cat.icon 
                                            size={22 - (4 * scrollProgress)}
                                            strokeWidth={2.5} 
                                            className={selectedCategory === cat.id ? 'text-white' : cat.id === 'Grooming' ? 'text-[#FF5500]' : 'text-current'}
                                        />
                                    </div>
                                    <span 
                                        className={`text-[9px] font-bold transition-colors ${selectedCategory === cat.id ? 'text-[#1A1A1A]' : 'text-gray-400 group-hover:text-[#1A1A1A]'}`}
                                        style={{
                                            opacity: 1 - (scrollProgress * 3),
                                            height: `${14 * (1 - scrollProgress)}px`,
                                            overflow: 'hidden'
                                        }}
                                    >
                                        {cat.label}
                                    </span>
                                </button>
                            ))}
                        </div>
                    )}
                    
                    {/* Sticky Filters - Always Visible & Compacted on Scroll */}
                    {viewMode === 'list' && (
                        <div className="transition-all-smooth" style={{ paddingTop: scrollProgress > 0.5 ? '4px' : '0' }}>
                            <div className="flex items-center gap-2">
                                <div className="flex-1 overflow-hidden">
                                    <SortToggle current={sortBy} onSort={setSortBy} compact={scrollProgress > 0.5} />
                                </div>
                                <button 
                                    onClick={() => setIsFilterOpen(true)}
                                    className={`rounded-full border flex items-center justify-center shrink-0 mb-2 transition-all active-press ${showFilters ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-lg' : 'bg-white text-gray-600 border-white shadow-sm hover:bg-gray-50'}`}
                                    style={{
                                        width: scrollProgress > 0.5 ? '32px' : '36px',
                                        height: scrollProgress > 0.5 ? '32px' : '36px',
                                    }}
                                >
                                    <SlidersHorizontal size={scrollProgress > 0.5 ? 12 : 14} />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* CONTENT AREA */}
            <div 
                ref={contentRef}
                onScroll={handleScroll}
                className="flex-1 overflow-y-auto relative bg-[#FAFAF9] pointer-events-auto rounded-t-[36px] -mt-4 shadow-[0_-8px_30px_rgba(0,0,0,0.02)] border-t border-white"
                style={{ paddingTop: '320px' }} // Initial padding to push content below header
            >
                {viewMode === 'list' ? (
                    <div className="pb-20 pt-5">
                        
                        {/* PARTNERSHIP CARD (New) */}
                        {selectedCategory === 'All' && !searchQuery && (
                            <PartnershipCard onClick={() => setShowPartnership(true)} />
                        )}

                        {/* FEATURED CAROUSEL (Only on main explore) */}
                        {selectedCategory === 'All' && !searchQuery && (
                            <FeaturedCarousel 
                                items={SERVICES_DATA} 
                                onSelect={(item) => item === 'trending-view' ? setShowTrendingList(true) : setSelectedProvider(item)} 
                            />
                        )}

                        <div className="px-5 space-y-4">
                            {selectedCategory === 'All' && !searchQuery && <h3 className="text-xs font-extrabold text-[#1A1A1A] mb-1.5 px-1 uppercase tracking-wide">All Spots</h3>}
                            
                            {/* Empty State Implementation */}
                            {filteredServices.length === 0 && (
                                <div className="flex flex-col items-center justify-center pt-20 px-10 text-center animate-fade-in">
                                    <div className="w-3 h-3 bg-[#FF5500] rounded-full mb-6 animate-pulse"></div> {/* Minimal Orange Dot */}
                                    <h3 className="text-[#1A1A1A] font-extrabold text-base font-brand mb-2">Δεν βρήκαμε κάτι εδώ ακόμα</h3>
                                    <p className="text-xs text-gray-400 font-medium leading-relaxed">Ψάχνουμε γύρω σου για τα καλύτερα spots.</p>
                                </div>
                            )}

                            {/* Service List with Dense Layout */}
                            {filteredServices.map((service, index) => {
                                // Add button logic to main list as well for consistency
                                const isAvailable = service.status === 'Open' || service.status === 'Available';
                                const buttonText = isAvailable ? 'Book' : 'View';
                                const buttonStyle = isAvailable 
                                    ? 'text-[#FF5500] bg-[#FF5500]/5 border-[#FF5500]/10 hover:bg-[#FF5500] hover:text-white' 
                                    : 'text-gray-400 bg-gray-50 border-gray-100 cursor-not-allowed';

                                return (
                                    <div 
                                        key={service.id} 
                                        onClick={() => setSelectedProvider(service)} 
                                        style={{ animationDelay: `${index * 0.08}s` }}
                                        className="bg-white p-3 rounded-[24px] border border-white shadow-[0_4px_15px_-5px_rgba(0,0,0,0.03)] active-press cursor-pointer hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.06)] transition-all duration-300 animate-slide-up-fade group"
                                    >
                                        <div className="flex gap-3.5">
                                            <div className="w-[72px] h-[72px] rounded-[18px] overflow-hidden shrink-0 bg-gray-50 relative group-hover:scale-[1.02] transition-transform duration-300">
                                                <img src={service.image} className="w-full h-full object-cover" />
                                                {sortBy === 'rating' && service.rating >= 4.9 && (
                                                    <div className="absolute top-0 left-0 bg-[#FF5500] text-white text-[8px] font-bold px-1.5 py-0.5 rounded-br-lg shadow-sm">TOP</div>
                                                )}
                                            </div>
                                            <div className="flex-1 py-0.5 flex flex-col justify-center">
                                                <div className="flex justify-between items-start mb-0.5">
                                                    <span className="text-[15px] font-black text-[#1A1A1A] block font-brand leading-tight tracking-tight">{service.name}</span>
                                                    <div className="bg-[#FAFAF9] px-1.5 py-0.5 rounded-[8px] text-[9px] font-bold border border-gray-100 flex items-center gap-1 group-hover:bg-[#FF5500]/10 group-hover:text-[#FF5500] group-hover:border-orange-100 transition-colors">
                                                        <Star size={9} className="fill-current" /> {service.rating}
                                                    </div>
                                                </div>
                                                <div className="flex items-center justify-between mt-1">
                                                    <span className="text-[11px] text-gray-400 font-medium flex items-center gap-1">
                                                        <MapPin size={10} strokeWidth={1.5}/> {service.dist} • <span className={service.status === 'Open' ? 'text-green-600 font-semibold' : 'text-gray-400'}>{service.status}</span>
                                                    </span>
                                                    <button 
                                                        onClick={(e) => { 
                                                            e.stopPropagation(); 
                                                            if(isAvailable) setSelectedProvider(service); 
                                                            else setSelectedProvider(service); // View anyways
                                                        }} 
                                                        className={`text-[10px] font-extrabold px-3 py-1 rounded-full border transition-colors ${buttonStyle}`}
                                                    >
                                                        {buttonText}
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    // MAP VIEW (Static Apple Maps Light Style)
                    <div className="absolute inset-0 top-[-280px] bg-[#F9F5F1] z-0">
                         {/* Static Map Container */}
                         <div 
                            className="w-full h-full relative overflow-hidden" 
                            onClick={() => setPreviewProvider(null)}
                         >
                            {/* The Map Background */}
                            <iframe 
                                width="100%" 
                                height="100%" 
                                frameBorder="0" 
                                scrolling="no" 
                                marginHeight="0" 
                                marginWidth="0" 
                                // Zoomed in to street level on Zurich center
                                src={`https://www.openstreetmap.org/export/embed.html?bbox=8.530,47.366,8.550,47.378&layer=mapnik&marker=${47.37},${8.55}`}
                                style={{ 
                                    width: '100%', 
                                    height: '100%', 
                                    border: 'none',
                                    // Filter for Apple Maps Light: Beige background (via transparency), Grey streets (via grayscale/contrast), No colors
                                    filter: 'grayscale(100%) opacity(0.5) contrast(0.7) brightness(1.2)',
                                    mixBlendMode: 'multiply'
                                }}
                                className="pointer-events-none absolute inset-0 w-full h-full"
                            ></iframe>

                            {/* Center Dot (User Location) - Static */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center z-10">
                                <div className="w-4 h-4 bg-[#3B82F6] border-[2.5px] border-white rounded-full shadow-[0_2px_8px_rgba(0,0,0,0.2)] animate-pulse"></div>
                                <div className="absolute w-16 h-16 bg-[#3B82F6]/10 rounded-full animate-radar"></div>
                            </div>

                            {/* Service Markers */}
                            {filteredServices.map((s, i) => {
                                const isSelected = previewProvider?.id === s.id;
                                return (
                                    <div 
                                        key={s.id}
                                        onClick={(e) => { e.stopPropagation(); setPreviewProvider(s); }}
                                        style={{ top: s.coords.top, left: s.coords.left }} // Positioning via percentages
                                        className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer pointer-events-auto hover:z-50 group"
                                    >
                                        <div className={`px-3 py-1.5 rounded-[12px] shadow-lg font-extrabold font-brand text-[10px] transition-all duration-300 border backdrop-blur-md flex flex-col items-center animate-scale-in ${
                                            isSelected 
                                            ? 'bg-[#FF5500] text-white border-[#FF5500] scale-125 z-30 shadow-orange-500/30' 
                                            : 'bg-white/95 text-[#1A1A1A] border-white hover:scale-110'
                                        }`}>
                                            <span>{s.price}</span>
                                            {/* Little triangle pointer */}
                                            <div className={`absolute -bottom-1 w-1.5 h-1.5 rotate-45 ${isSelected ? 'bg-[#FF5500]' : 'bg-white'}`}></div>
                                        </div>
                                    </div>
                                );
                            })}
                         </div>

                         {/* Overlay Gradient for Header Visibility */}
                         <div className="absolute top-[200px] left-0 w-full h-40 bg-gradient-to-b from-[#FAFAF9] to-transparent pointer-events-none z-10"></div>

                        {/* MINI PREVIEW CARD */}
                        {previewProvider && (
                            <div className="fixed bottom-24 left-5 right-5 z-40 animate-slide-up-fade" onClick={(e) => e.stopPropagation()}>
                                <div onClick={() => setSelectedProvider(previewProvider)} className="bg-white p-3.5 rounded-[28px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)] border border-white flex items-center gap-4 active-press cursor-pointer hover:scale-[1.02] transition-transform">
                                     <img src={previewProvider.image} className="w-14 h-14 rounded-[18px] object-cover shadow-sm" />
                                     <div className="flex-1">
                                         <h3 className="font-extrabold text-[#1A1A1A] text-sm font-brand">{previewProvider.name}</h3>
                                         <p className="text-[10px] text-gray-500 font-medium mb-1">{previewProvider.type} • {previewProvider.dist}</p>
                                         <span className="text-[9px] font-bold text-[#FF5500] bg-[#FF5500]/10 px-1.5 py-0.5 rounded-md">{previewProvider.status} • {previewProvider.rating} ★</span>
                                     </div>
                                     <button className="w-9 h-9 rounded-full bg-[#1A1A1A] flex items-center justify-center text-white shadow-lg shadow-black/20"><ChevronRight size={18} /></button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
            
        </div>
    );
};

// --- REST OF THE APP ---
const NavBar = ({ active, onChange, dark }) => (
  <div className={`absolute bottom-0 w-full h-[90px] flex justify-between items-start pt-4 px-7 z-40 transition-all duration-500 rounded-t-[28px] border-t border-white/60 bg-white/90 backdrop-blur-xl shadow-[0_-10px_40px_rgba(0,0,0,0.03)]`}>
    {[
        { id: 'home', Icon: Home, label: 'Home' }, 
        { id: 'care', Icon: Calendar, label: 'Care' }, 
        { id: 'health', Icon: Activity, label: 'Health' }, 
        { id: 'explore', Icon: MapIcon, label: 'Map' }, 
        { id: 'profile', Icon: User, label: 'Wallet' } 
    ].map(item => (
      <button key={item.id} onClick={() => onChange(item.id)} className="flex flex-col items-center gap-1 w-10 group active-press relative">
        <div className={`transition-all duration-500 p-2 rounded-[16px] relative ${
            active === item.id 
            ? '-translate-y-4' 
            : 'hover:bg-gray-50'
        }`}>
            <item.Icon 
                size={22} 
                strokeWidth={active === item.id ? 2.8 : 2} 
                className={`transition-colors duration-300 ${active === item.id ? 'text-[#1A1A1A]' : 'text-gray-400'}`}
            />
            {/* The Orange Dot - Signal of Activity */}
            {active === item.id && <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-1 h-1 bg-[#FF5500] rounded-full animate-scale-in"></div>}
        </div>
      </button>
    ))}
  </div>
);

export default function FylosApp() {
  const [activeTab, setActiveTab] = useState('explore'); 
  const [toast, setToast] = useState(null);
  const [hideNav, setHideNav] = useState(false);
  
  const showToastFn = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  return (
    <>
      <GlobalStyles />
      <div className="flex items-center justify-center min-h-screen bg-[#E5E5E5] py-10 font-sans">
        <div className={`relative w-[390px] h-[844px] rounded-[55px] shadow-[0_0_0_12px_#1a1a1a,0_0_0_14px_#333,0_40px_100px_-20px_rgba(0,0,0,0.5)] overflow-hidden transition-colors duration-500 bg-[#FAFAF9]`}>
            
            <div className="absolute top-[11px] left-1/2 -translate-x-1/2 w-[120px] h-[36px] bg-black rounded-[20px] z-[60] pointer-events-none"></div>
            <StatusBar dark={false} />
            {toast && <Toast message={toast} />}

            <div className="w-full h-full overflow-y-auto no-scrollbar relative flex flex-col">
                {activeTab === 'explore' && <ExploreView showToast={showToastFn} onOverlayChange={setHideNav} />}
                {activeTab !== 'explore' && <div className="flex flex-col items-center justify-center h-full text-gray-400 font-bold text-center px-8 animate-fade-in">
                    <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-5 animate-float shadow-inner"><Zap size={28} className="text-gray-300"/></div>
                    <h3 className="text-[#1A1A1A] font-extrabold text-lg mb-1.5 font-brand">Coming Soon</h3>
                    <p className="text-xs font-medium text-gray-400">This feature is being crafted with quiet care.</p>
                </div>}
            </div>

            {!hideNav && <NavBar active={activeTab} onChange={setActiveTab} dark={false} />}
            <div className={`absolute bottom-2 left-1/2 -translate-x-1/2 w-[130px] h-[5px] rounded-full z-50 ${hideNav ? 'bg-white/90' : 'bg-[#1A1A1A]/90'}`}></div>
        </div>
      </div>
    </>
  );
}