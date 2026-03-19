import React, { useState } from 'react';
import {
  ChevronLeft,
  Bookmark,
  Clock,
  Star,
  Check,
  ChevronRight,
  Heart,
  ArrowRight,
  Circle,
  Info,
  X,
} from 'lucide-react';

/**
 * 47_TRAINING_TIPS_v1.jsx
 * Training Tips screen for the Fylos pet care app.
 * Pet training guides and tips with category filtering, expanded article view, and progress tracking.
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
    danger: '#FF3B30',
    success: '#00C060',
    warning: '#FF9500',
    info: '#007AFF',
    divider: '#E5E5E5',
  },
  radius: { full: '9999px', large: '24px', medium: '16px', small: '8px' },
  shadows: {
    soft: '0 4px 20px rgba(0,0,0,0.03)',
    floating: '0 8px 24px rgba(0,0,0,0.08)',
  },
  motion: {
    tap: '120ms',
    fade: '200ms',
    tab: '240ms',
    spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  },
};

// ─── GLOBAL STYLES ────────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Nunito:wght@600;700;800;900&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    .tt-screen {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      -webkit-font-smoothing: antialiased;
      background: ${THEME.colors.background};
      color: ${THEME.colors.primaryText};
      overflow: hidden;
    }

    .tt-scroll {
      overflow-y: auto;
      -webkit-overflow-scrolling: touch;
      scrollbar-width: none;
    }
    .tt-scroll::-webkit-scrollbar { display: none; }

    .tt-scroll-x {
      overflow-x: auto;
      scrollbar-width: none;
    }
    .tt-scroll-x::-webkit-scrollbar { display: none; }

    .tt-tap {
      transition: opacity ${THEME.motion.tap} ease, transform ${THEME.motion.tap} ease;
      cursor: pointer;
      border: none;
      background: none;
      padding: 0;
    }
    .tt-tap:active { opacity: 0.7; transform: scale(0.97); }

    .tt-card-tap {
      transition: transform ${THEME.motion.tap} ease, box-shadow ${THEME.motion.tap} ease;
      cursor: pointer;
    }
    .tt-card-tap:active { transform: scale(0.98); }

    .tt-chip {
      transition: all ${THEME.motion.tab} ${THEME.motion.spring};
      cursor: pointer;
      white-space: nowrap;
      border: none;
    }
    .tt-chip:active { transform: scale(0.93); }

    .tt-line-clamp-2 {
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    @keyframes tt-fade-in {
      from { opacity: 0; transform: translateY(8px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tt-fade-in { animation: tt-fade-in ${THEME.motion.fade} ease forwards; }

    @keyframes tt-slide-up {
      from { opacity: 0; transform: translateY(100%); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .tt-slide-up { animation: tt-slide-up 300ms ${THEME.motion.spring} forwards; }
  `}</style>
);

// ─── DATA ─────────────────────────────────────────────────────────────────────
const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'basic', label: 'Basic' },
  { id: 'behavior', label: 'Behavior' },
  { id: 'tricks', label: 'Tricks' },
  { id: 'health', label: 'Health' },
  { id: 'puppy', label: 'Puppy' },
];

const TIPS_DATA = [
  {
    id: 1,
    title: 'Leash Training Fundamentals',
    description: 'Learn how to train your dog to walk calmly on a leash without pulling or lunging at distractions.',
    difficulty: 'Beginner',
    duration: '15 min',
    category: 'basic',
    bookmarked: false,
    completed: true,
    steps: [
      'Start indoors with minimal distractions. Attach the leash and let your dog get used to it.',
      'Use treats to encourage your dog to walk beside you. Reward for staying close.',
      'When your dog pulls, stop walking immediately. Wait until the leash is loose.',
      'Resume walking when your dog returns to your side. Praise and treat.',
      'Gradually increase distractions by moving to your yard, then quiet streets.',
      'Practice daily in 10-15 minute sessions for best results.',
    ],
  },
  {
    id: 2,
    title: 'Stop Excessive Barking',
    description: 'Effective techniques to manage and reduce your dog\'s excessive barking behavior at home.',
    difficulty: 'Intermediate',
    duration: '20 min',
    category: 'behavior',
    bookmarked: true,
    completed: true,
    steps: [
      'Identify the trigger: is your dog barking at strangers, other dogs, or out of boredom?',
      'Remove or reduce the stimulus. Close curtains or move to another room.',
      'Teach the "quiet" command. Wait for a pause in barking, then say "quiet" and reward.',
      'Never yell at your dog to stop barking—it sounds like you\'re barking too.',
      'Provide mental stimulation with puzzle toys and regular exercise.',
      'Be consistent. Everyone in the household must follow the same approach.',
    ],
  },
  {
    id: 3,
    title: 'Teaching "Shake" Trick',
    description: 'A fun and easy trick that impresses everyone. Perfect for building your dog\'s confidence.',
    difficulty: 'Beginner',
    duration: '10 min',
    category: 'tricks',
    bookmarked: false,
    completed: true,
    steps: [
      'Have your dog sit in front of you. Hold a treat in your closed fist.',
      'Present your fist at chest height. Wait for your dog to paw at it.',
      'The moment their paw touches your hand, say "shake" and give the treat.',
      'Repeat 5-10 times per session until reliable.',
      'Gradually open your hand so it looks like a handshake.',
      'Add duration by gently holding their paw for a second before rewarding.',
    ],
  },
  {
    id: 4,
    title: 'Dental Care Basics',
    description: 'Keep your pet\'s teeth healthy with these simple daily care routines and prevention tips.',
    difficulty: 'Beginner',
    duration: '8 min',
    category: 'health',
    bookmarked: false,
    completed: false,
    steps: [
      'Get your dog used to having their mouth touched. Lift lips gently and praise.',
      'Introduce pet-safe toothpaste on your finger. Let them lick and taste it.',
      'Use a finger brush or soft dog toothbrush. Focus on the outer surfaces.',
      'Brush in gentle circular motions along the gum line.',
      'Aim for daily brushing, but even 3 times a week helps.',
      'Provide dental chews and schedule annual professional cleanings.',
    ],
  },
  {
    id: 5,
    title: 'Crate Training Your Puppy',
    description: 'Make the crate a safe haven for your puppy with this step-by-step positive introduction guide.',
    difficulty: 'Beginner',
    duration: '25 min',
    category: 'puppy',
    bookmarked: false,
    completed: false,
    steps: [
      'Choose the right size crate—big enough to stand, turn, and lie down comfortably.',
      'Place the crate in a common area. Leave the door open with a cozy blanket inside.',
      'Toss treats inside and praise your puppy for going in voluntarily.',
      'Feed meals inside the crate with the door open, then gradually close it.',
      'Start with short periods (5 min) with the door closed. Stay nearby.',
      'Gradually increase crate time. Never use the crate as punishment.',
    ],
  },
  {
    id: 6,
    title: 'Recall Training Mastery',
    description: 'Teach your dog a bulletproof recall so they come every time you call, even with distractions.',
    difficulty: 'Intermediate',
    duration: '20 min',
    category: 'basic',
    bookmarked: false,
    completed: false,
    steps: [
      'Choose a unique recall word or whistle. Use it only for recall.',
      'Start indoors. Say the word, then immediately offer a high-value treat.',
      'Practice in low-distraction environments first, rewarding every time.',
      'Add distance gradually. Use a long training lead for safety outdoors.',
      'Never call your dog for something unpleasant (bath, leaving the park).',
      'Make coming to you the best thing that happens all day.',
    ],
  },
  {
    id: 7,
    title: 'Separation Anxiety Relief',
    description: 'Help your dog feel calm and secure when left alone with these proven desensitization techniques.',
    difficulty: 'Intermediate',
    duration: '30 min',
    category: 'behavior',
    bookmarked: false,
    completed: false,
    steps: [
      'Practice short absences. Step out for 1 minute, then return calmly.',
      'Don\'t make departures or arrivals a big deal. Keep them low-key.',
      'Leave a special treat or puzzle toy that your dog only gets when alone.',
      'Gradually increase the duration of your absences over weeks.',
      'Create a safe, comfortable space with familiar scents.',
      'Consider calming supplements or consult your vet for severe cases.',
    ],
  },
  {
    id: 8,
    title: 'Socialization for Puppies',
    description: 'Expose your puppy to new experiences safely during the critical socialization window.',
    difficulty: 'Beginner',
    duration: '15 min',
    category: 'puppy',
    bookmarked: false,
    completed: false,
    steps: [
      'Start between 3-14 weeks of age—the critical socialization period.',
      'Introduce your puppy to different people: men, women, children, uniforms.',
      'Expose them to various surfaces: grass, tile, gravel, metal grates.',
      'Let them hear different sounds: traffic, vacuum, thunder recordings.',
      'Arrange playdates with vaccinated, friendly dogs of different sizes.',
      'Always keep experiences positive. If your puppy seems scared, back off.',
    ],
  },
  {
    id: 9,
    title: 'Teaching "Roll Over"',
    description: 'A classic crowd-pleaser trick that builds on the "down" command. Great for bonding time.',
    difficulty: 'Intermediate',
    duration: '15 min',
    category: 'tricks',
    bookmarked: false,
    completed: false,
    steps: [
      'Start with your dog in a "down" position.',
      'Hold a treat near their nose and slowly move it toward their shoulder.',
      'As they follow the treat and shift their weight, guide it over their back.',
      'The moment they complete the roll, say "roll over" and reward.',
      'Break it into stages if needed—reward partial rolls at first.',
      'Practice 5-8 repetitions per session. Keep it fun!',
    ],
  },
  {
    id: 10,
    title: 'Weight Management Tips',
    description: 'Keep your pet at a healthy weight with proper portion control and exercise guidelines.',
    difficulty: 'Beginner',
    duration: '12 min',
    category: 'health',
    bookmarked: false,
    completed: false,
    steps: [
      'Check your dog\'s body condition score. You should feel ribs easily.',
      'Measure food portions precisely. Follow feeding guidelines for ideal weight.',
      'Reduce treats to no more than 10% of daily caloric intake.',
      'Increase daily exercise gradually. Aim for 30-60 min depending on breed.',
      'Use vegetables like carrots or green beans as low-calorie treats.',
      'Weigh your dog monthly and adjust food intake as needed.',
    ],
  },
  {
    id: 11,
    title: 'Impulse Control Games',
    description: 'Build your dog\'s patience and self-control with these engaging training exercises.',
    difficulty: 'Intermediate',
    duration: '18 min',
    category: 'basic',
    bookmarked: false,
    completed: false,
    steps: [
      'Start with "wait" at the food bowl. Hold the bowl and lower slowly.',
      'If your dog moves toward it, raise the bowl. Reward patience.',
      'Practice "leave it" with treats on the floor. Cover with your hand if needed.',
      'Play "it\'s your choice"—hold treats in an open palm, close if they grab.',
      'Use tug toys to practice "drop it" and "take it" on command.',
      'Gradually increase difficulty and duration of impulse control exercises.',
    ],
  },
  {
    id: 12,
    title: 'Puppy Biting Solutions',
    description: 'Redirect your puppy\'s natural nipping behavior with gentle, effective training methods.',
    difficulty: 'Beginner',
    duration: '10 min',
    category: 'puppy',
    bookmarked: false,
    completed: false,
    steps: [
      'When your puppy bites, let out a brief, high-pitched "ouch" and stop playing.',
      'Redirect to an appropriate chew toy immediately after.',
      'If biting continues, calmly stand up and turn away for 10-15 seconds.',
      'Resume play once your puppy is calm. Reward gentle mouth contact.',
      'Provide plenty of appropriate chew toys and rotate them to maintain interest.',
      'Never use physical punishment—it increases fear and aggression.',
    ],
  },
];

const completedCount = TIPS_DATA.filter(t => t.completed).length;
const totalCount = TIPS_DATA.length;

// ─── FEATURED TIP ─────────────────────────────────────────────────────────────
const FEATURED_TIP = TIPS_DATA[0];

// ─── MAIN SCREEN ──────────────────────────────────────────────────────────────
const TrainingTipsScreen = () => {
  const [activeCategory, setActiveCategory] = useState('all');
  const [bookmarks, setBookmarks] = useState(
    TIPS_DATA.reduce((acc, t) => ({ ...acc, [t.id]: t.bookmarked }), {})
  );
  const [selectedTip, setSelectedTip] = useState(null);
  const [completedTips, setCompletedTips] = useState(
    TIPS_DATA.reduce((acc, t) => ({ ...acc, [t.id]: t.completed }), {})
  );

  const toggleBookmark = (id, e) => {
    e.stopPropagation();
    setBookmarks(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const markComplete = (id) => {
    setCompletedTips(prev => ({ ...prev, [id]: true }));
  };

  const currentCompleted = Object.values(completedTips).filter(Boolean).length;

  const filteredTips = activeCategory === 'all'
    ? TIPS_DATA
    : TIPS_DATA.filter(t => t.category === activeCategory);

  const difficultyColor = (d) =>
    d === 'Beginner' ? THEME.colors.success : THEME.colors.warning;

  // ─── EXPANDED ARTICLE VIEW ─────────────────────────────────────────────────
  if (selectedTip) {
    const tip = selectedTip;
    const isCompleted = completedTips[tip.id];

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
        <div className="relative" style={{
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
                onClick={() => setSelectedTip(null)}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <ChevronLeft size={22} color="#111111" />
              </button>
              <h2 className="text-[17px] font-semibold text-[#111111]">Training Guide</h2>
              <button
                onClick={(e) => toggleBookmark(tip.id, e)}
                className="w-[44px] h-[44px] flex items-center justify-center bg-[#FFFFFF] border border-black/[0.06] shadow-[0_8px_24px_rgba(0,0,0,0.06)] rounded-[9999px] active:scale-[0.98] active:opacity-85 transition-all duration-[120ms]"
              >
                <Bookmark
                  size={22}
                  color={bookmarks[tip.id] ? THEME.colors.accent : '#111111'}
                  fill={bookmarks[tip.id] ? THEME.colors.accent : 'none'}
                />
              </button>
            </div>
          </header>

          {/* Scrollable Article Content */}
          <div className="absolute inset-0 overflow-y-auto tt-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          <div style={{ padding: '0 20px 100px' }}>
            <div className="tt-fade-in">

              {/* Title */}
              <h1 style={{
                fontSize: 24,
                fontWeight: 800,
                fontFamily: '"Nunito", sans-serif',
                color: THEME.colors.primaryText,
                lineHeight: 1.25,
                marginBottom: 12,
                letterSpacing: '-0.3px',
              }}>
                {tip.title}
              </h1>

              {/* Badges */}
              <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `${difficultyColor(tip.difficulty)}14`,
                  borderRadius: THEME.radius.full,
                  padding: '5px 12px',
                }}>
                  <Star size={12} color={difficultyColor(tip.difficulty)} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: difficultyColor(tip.difficulty),
                  }}>{tip.difficulty}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `${THEME.colors.info}14`,
                  borderRadius: THEME.radius.full,
                  padding: '5px 12px',
                }}>
                  <Clock size={12} color={THEME.colors.info} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: THEME.colors.info,
                  }}>{tip.duration}</span>
                </div>
              </div>

              {/* Description */}
              <p style={{
                fontSize: 15,
                color: THEME.colors.secondaryText,
                lineHeight: 1.6,
                marginBottom: 28,
              }}>
                {tip.description}
              </p>

              {/* Steps */}
              <div style={{ marginBottom: 24 }}>
                <h3 style={{
                  fontSize: 16,
                  fontWeight: 700,
                  fontFamily: '"Nunito", sans-serif',
                  color: THEME.colors.primaryText,
                  marginBottom: 16,
                }}>
                  Step-by-Step Guide
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {tip.steps.map((step, idx) => (
                    <div key={idx} style={{
                      display: 'flex',
                      gap: 14,
                      alignItems: 'flex-start',
                    }}>
                      <div style={{
                        width: 28,
                        height: 28,
                        borderRadius: THEME.radius.full,
                        background: THEME.colors.surfaceAlt,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        marginTop: 1,
                      }}>
                        <span style={{
                          fontSize: 13,
                          fontWeight: 700,
                          color: THEME.colors.accent,
                        }}>{idx + 1}</span>
                      </div>
                      <p style={{
                        fontSize: 14,
                        color: THEME.colors.primaryText,
                        lineHeight: 1.55,
                        flex: 1,
                        paddingTop: 4,
                      }}>
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mark Complete Button */}
          <div style={{
            padding: '16px 20px 20px',
          }}>
            <button
              className="tt-tap"
              onClick={() => !isCompleted && markComplete(tip.id)}
              style={{
                width: '100%',
                height: 52,
                borderRadius: THEME.radius.medium,
                background: isCompleted
                  ? THEME.colors.success
                  : 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                border: 'none',
                boxShadow: isCompleted
                  ? `0 4px 16px ${THEME.colors.success}40`
                  : `0 4px 16px ${THEME.colors.accent}40`,
              }}
            >
              {isCompleted ? (
                <Check size={20} color="#FFFFFF" strokeWidth={2.5} />
              ) : null}
              <span style={{
                fontSize: 16,
                fontWeight: 700,
                color: '#FFFFFF',
                fontFamily: '"Inter", sans-serif',
              }}>
                {isCompleted ? 'Completed' : 'Mark Complete'}
              </span>
            </button>
          </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── MAIN LIST VIEW ─────────────────────────────────────────────────────────
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
      <div className="relative" style={{
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
            <h2 className="text-[17px] font-semibold text-[#111111]">Training</h2>
            <div className="w-[44px]" />
          </div>
        </header>

        {/* Scrollable Content */}
        <div className="absolute inset-0 overflow-y-auto tt-scroll" style={{ paddingTop: 54, paddingBottom: 40 }}>

          {/* ── Progress Bar ── */}
          <div style={{ padding: '0 20px 16px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 8,
            }}>
              <span style={{
                fontSize: 13,
                fontWeight: 600,
                color: THEME.colors.secondaryText,
              }}>
                {currentCompleted} of {totalCount} completed
              </span>
              <span style={{
                fontSize: 12,
                fontWeight: 600,
                color: THEME.colors.accent,
              }}>
                {Math.round((currentCompleted / totalCount) * 100)}%
              </span>
            </div>
            <div style={{
              height: 6,
              borderRadius: THEME.radius.full,
              background: THEME.colors.surfaceAlt,
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${(currentCompleted / totalCount) * 100}%`,
                borderRadius: THEME.radius.full,
                background: 'linear-gradient(90deg, #FF7240 0%, #E85D2A 100%)',
                transition: 'width 400ms ease',
              }} />
            </div>
          </div>

          {/* ── Featured Tip Card ── */}
          <div style={{ padding: '0 20px 20px' }}>
            <div
              className="tt-card-tap"
              onClick={() => setSelectedTip(FEATURED_TIP)}
              style={{
                borderRadius: 20,
                background: 'linear-gradient(135deg, #FFF5F0 0%, #FFE8DB 40%, #FFDCC8 100%)',
                padding: 20,
                position: 'relative',
                overflow: 'hidden',
                boxShadow: THEME.shadows.soft,
              }}
            >
              {/* Decorative circle */}
              <div style={{
                position: 'absolute',
                top: -30,
                right: -30,
                width: 120,
                height: 120,
                borderRadius: '50%',
                background: `${THEME.colors.accent}08`,
              }} />

              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                marginBottom: 12,
              }}>
                <Star size={14} color={THEME.colors.accent} strokeWidth={2.5} />
                <span style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: THEME.colors.accent,
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                }}>Featured Guide</span>
              </div>

              <h2 style={{
                fontSize: 20,
                fontWeight: 800,
                fontFamily: '"Nunito", sans-serif',
                color: THEME.colors.primaryText,
                lineHeight: 1.25,
                marginBottom: 10,
                letterSpacing: '-0.3px',
              }}>
                {FEATURED_TIP.title}
              </h2>

              <p style={{
                fontSize: 14,
                color: THEME.colors.secondaryText,
                lineHeight: 1.5,
                marginBottom: 16,
              }}>
                {FEATURED_TIP.description}
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `${THEME.colors.success}14`,
                  borderRadius: THEME.radius.full,
                  padding: '4px 10px',
                }}>
                  <Star size={11} color={THEME.colors.success} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: THEME.colors.success,
                  }}>{FEATURED_TIP.difficulty}</span>
                </div>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 5,
                  background: `${THEME.colors.info}14`,
                  borderRadius: THEME.radius.full,
                  padding: '4px 10px',
                }}>
                  <Clock size={11} color={THEME.colors.info} strokeWidth={2.5} />
                  <span style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: THEME.colors.info,
                  }}>{FEATURED_TIP.duration}</span>
                </div>
                <div style={{ marginLeft: 'auto' }}>
                  <div style={{
                    width: 34,
                    height: 34,
                    borderRadius: THEME.radius.full,
                    background: 'linear-gradient(135deg, #FF7240 0%, #E85D2A 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    boxShadow: `0 4px 12px ${THEME.colors.accent}40`,
                  }}>
                    <ArrowRight size={16} color="#FFFFFF" strokeWidth={2.5} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Category Pills ── */}
          <div
            className="tt-scroll-x"
            style={{
              display: 'flex',
              gap: 8,
              paddingLeft: 20,
              paddingRight: 20,
              paddingBottom: 18,
            }}
          >
            {CATEGORIES.map(cat => {
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  className="tt-chip"
                  onClick={() => setActiveCategory(cat.id)}
                  style={{
                    padding: '8px 18px',
                    borderRadius: THEME.radius.full,
                    background: isActive ? THEME.colors.primaryText : THEME.colors.surfaceAlt,
                    color: isActive ? '#FFFFFF' : THEME.colors.secondaryText,
                    fontSize: 13,
                    fontFamily: '"Inter", sans-serif',
                    fontWeight: isActive ? 600 : 500,
                  }}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          {/* ── Tips List ── */}
          <div style={{ padding: '0 20px 40px', display: 'flex', flexDirection: 'column', gap: 12 }}>
            {filteredTips.map((tip) => {
              const isBookmarked = bookmarks[tip.id];
              const isCompleted = completedTips[tip.id];

              return (
                <div
                  key={tip.id}
                  className="tt-card-tap"
                  onClick={() => setSelectedTip(tip)}
                  style={{
                    background: THEME.colors.surface,
                    borderRadius: 20,
                    padding: 20,
                    boxShadow: THEME.shadows.soft,
                    display: 'flex',
                    gap: 14,
                    position: 'relative',
                  }}
                >
                  {/* Content */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    {/* Title Row */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {isCompleted && (
                        <div style={{
                          width: 18,
                          height: 18,
                          borderRadius: THEME.radius.full,
                          background: THEME.colors.success,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          flexShrink: 0,
                        }}>
                          <Check size={11} color="#FFFFFF" strokeWidth={3} />
                        </div>
                      )}
                      <h3 style={{
                        fontSize: 16,
                        fontWeight: 600,
                        color: THEME.colors.primaryText,
                        lineHeight: 1.3,
                      }}>
                        {tip.title}
                      </h3>
                    </div>

                    {/* Description */}
                    <p className="tt-line-clamp-2" style={{
                      fontSize: 13,
                      color: THEME.colors.secondaryText,
                      lineHeight: 1.5,
                      marginBottom: 12,
                    }}>
                      {tip.description}
                    </p>

                    {/* Badges */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: `${difficultyColor(tip.difficulty)}12`,
                        borderRadius: THEME.radius.full,
                        padding: '3px 9px',
                      }}>
                        <Circle size={7} color={difficultyColor(tip.difficulty)} fill={difficultyColor(tip.difficulty)} strokeWidth={0} />
                        <span style={{
                          fontSize: 11,
                          fontWeight: 600,
                          color: difficultyColor(tip.difficulty),
                        }}>{tip.difficulty}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: 4,
                        background: THEME.colors.surfaceAlt,
                        borderRadius: THEME.radius.full,
                        padding: '3px 9px',
                      }}>
                        <Clock size={10} color={THEME.colors.tertiaryText} strokeWidth={2.2} />
                        <span style={{
                          fontSize: 11,
                          fontWeight: 500,
                          color: THEME.colors.tertiaryText,
                        }}>{tip.duration}</span>
                      </div>
                    </div>
                  </div>

                  {/* Bookmark */}
                  <button
                    className="tt-tap"
                    onClick={(e) => toggleBookmark(tip.id, e)}
                    style={{
                      flexShrink: 0,
                      alignSelf: 'flex-start',
                      marginTop: 2,
                    }}
                  >
                    <Bookmark
                      size={20}
                      color={isBookmarked ? THEME.colors.accent : THEME.colors.tertiaryText}
                      strokeWidth={2}
                      fill={isBookmarked ? THEME.colors.accent : 'none'}
                    />
                  </button>
                </div>
              );
            })}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TrainingTipsScreen;
