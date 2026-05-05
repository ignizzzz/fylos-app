// Personality archetypes — assigned at onboarding via a short quiz, editable later.
// Two dimensions:
//   energy: low (calm) ←→ high
//   social: independent ←→ social
//
// Each archetype carries:
//   id, label, tagline, longDescription, glyph (emoji used as accent),
//   color (hex, background tint), traits[], compatibleWith[] (ids that match well).
//
// The 12-card set covers the common pet-parent narratives without overwhelming
// onboarding. Compatibility hints feed the Discovery match-score reasons.

export const ARCHETYPES = [
  {
    id: 'diplomat',
    label: 'The Diplomat',
    tagline: 'Friendly with everyone, keeps the peace.',
    longDescription: 'Reads the room, calms tense play, makes new friends without fuss. The dog every other dog wants to befriend.',
    glyph: '🤝',
    color: '#FFE9DD',
    traits: ['Calm', 'Sociable', 'Fair player'],
    compatibleWith: ['sunshine', 'old-soul', 'mayor', 'cuddler'],
  },
  {
    id: 'adventurer',
    label: 'The Adventurer',
    tagline: 'Ready for any trail, any time.',
    longDescription: 'Endless curiosity, light on the leash, happiest with new horizons. Loves long walks more than any toy.',
    glyph: '🧭',
    color: '#FFF1DE',
    traits: ['High energy', 'Independent', 'Outdoors'],
    compatibleWith: ['athlete', 'wanderer', 'spark', 'mayor'],
  },
  {
    id: 'cuddler',
    label: 'The Cuddler',
    tagline: 'Lap is the best place in the world.',
    longDescription: 'Soft, warm, loyal at touch range. Greets everyone with a wag but really only wants to be near you.',
    glyph: '💛',
    color: '#FFEEE5',
    traits: ['Calm', 'Affectionate', 'Loves humans'],
    compatibleWith: ['old-soul', 'loyal-shadow', 'diplomat', 'sunshine'],
  },
  {
    id: 'strategist',
    label: 'The Strategist',
    tagline: 'Thinks first, then plays.',
    longDescription: 'Watches before joining. Wins puzzles. Plays carefully and chooses friends with intention.',
    glyph: '♟️',
    color: '#F1EDE8',
    traits: ['Observant', 'Smart', 'Selective'],
    compatibleWith: ['old-soul', 'spark', 'loyal-shadow', 'diplomat'],
  },
  {
    id: 'sunshine',
    label: 'The Sunshine',
    tagline: 'Boundless joy, friend to all.',
    longDescription: 'Tail-wagging optimism. Greets every person and dog like a long-lost cousin. Hard to be sad around.',
    glyph: '☀️',
    color: '#FFF4D8',
    traits: ['Joyful', 'Sociable', 'Outgoing'],
    compatibleWith: ['diplomat', 'mayor', 'goofball', 'cuddler'],
  },
  {
    id: 'old-soul',
    label: 'The Old Soul',
    tagline: 'Calm, observant, dignified.',
    longDescription: 'Slow to react, gentle with all. Watches the park more than they play in it, but everyone respects them.',
    glyph: '🪶',
    color: '#F0EBE3',
    traits: ['Calm', 'Wise', 'Quiet'],
    compatibleWith: ['cuddler', 'diplomat', 'loyal-shadow', 'strategist'],
  },
  {
    id: 'goofball',
    label: 'The Goofball',
    tagline: 'Silly, exuberant, loves attention.',
    longDescription: 'Comic timing, dramatic zoomies, perpetual smile. Will roll on anything that smells interesting.',
    glyph: '🤪',
    color: '#FFE3E0',
    traits: ['Playful', 'Bold', 'Expressive'],
    compatibleWith: ['sunshine', 'spark', 'mayor', 'athlete'],
  },
  {
    id: 'loyal-shadow',
    label: 'The Loyal Shadow',
    tagline: 'Quiet, devoted, one-person dog.',
    longDescription: 'Walks at your heel like a promise. Reserved with strangers but completely yours. Picks one human and chooses them every day.',
    glyph: '🐾',
    color: '#EEEAE3',
    traits: ['Devoted', 'Quiet', 'Selective'],
    compatibleWith: ['old-soul', 'strategist', 'cuddler', 'diplomat'],
  },
  {
    id: 'spark',
    label: 'The Spark',
    tagline: 'Quick, alert, intense focus.',
    longDescription: 'Bright eyes, fast feet, learns commands in three repetitions. Loves a job. Loves a game. Hates standing still.',
    glyph: '⚡',
    color: '#FFEFE0',
    traits: ['Smart', 'Fast', 'Trainable'],
    compatibleWith: ['athlete', 'adventurer', 'strategist', 'goofball'],
  },
  {
    id: 'wanderer',
    label: 'The Wanderer',
    tagline: 'Curious, sniff-driven, leash-light.',
    longDescription: 'A walking nose. Every blade of grass tells a story, and they need to read every one. Patient owners only.',
    glyph: '👃',
    color: '#F4EFE6',
    traits: ['Curious', 'Patient', 'Sniff-led'],
    compatibleWith: ['adventurer', 'old-soul', 'strategist', 'cuddler'],
  },
  {
    id: 'athlete',
    label: 'The Athlete',
    tagline: 'Fit, fetch-obsessed, training-keen.',
    longDescription: 'Built for the long run. Brings the ball back, every single time, and asks for one more. Thrives on routine and physical challenge.',
    glyph: '🏃',
    color: '#E9F2EE',
    traits: ['Energetic', 'Focused', 'Fit'],
    compatibleWith: ['adventurer', 'spark', 'goofball', 'mayor'],
  },
  {
    id: 'mayor',
    label: 'The Mayor',
    tagline: 'Knows everyone in the park.',
    longDescription: 'Social glue. Says hello to every dog, every owner, every regular. Will make sure the new pup feels welcome.',
    glyph: '👋',
    color: '#FFF0E5',
    traits: ['Sociable', 'Confident', 'Outgoing'],
    compatibleWith: ['sunshine', 'goofball', 'diplomat', 'adventurer'],
  },
];

// Lookup by id for fast UI rendering.
export const ARCHETYPE_BY_ID = ARCHETYPES.reduce((acc, a) => {
  acc[a.id] = a;
  return acc;
}, {});

// Onboarding quiz — 5 questions, each maps answers to archetype id votes.
// Highest-vote archetype is suggested at the end.
export const ARCHETYPE_QUIZ = [
  {
    id: 'q-energy',
    prompt: 'When you reach the park, your Fylos:',
    answers: [
      { id: 'a1', label: 'Bolts in for the wildest game in sight', votes: ['adventurer', 'goofball', 'athlete'] },
      { id: 'a2', label: 'Greets every person and dog there', votes: ['mayor', 'sunshine', 'diplomat'] },
      { id: 'a3', label: 'Watches a minute, then picks a friend', votes: ['strategist', 'old-soul', 'loyal-shadow'] },
      { id: 'a4', label: 'Walks the perimeter sniffing everything', votes: ['wanderer', 'old-soul', 'cuddler'] },
    ],
  },
  {
    id: 'q-social',
    prompt: 'With other dogs they:',
    answers: [
      { id: 'a1', label: 'Get along with anyone', votes: ['diplomat', 'sunshine', 'mayor'] },
      { id: 'a2', label: 'Pick a couple of regulars', votes: ['loyal-shadow', 'strategist'] },
      { id: 'a3', label: 'Wrestle and run for hours', votes: ['athlete', 'goofball', 'spark'] },
      { id: 'a4', label: 'Prefer humans, honestly', votes: ['cuddler', 'loyal-shadow'] },
    ],
  },
  {
    id: 'q-home',
    prompt: 'At home, their favorite spot is:',
    answers: [
      { id: 'a1', label: 'Wherever you are', votes: ['cuddler', 'loyal-shadow'] },
      { id: 'a2', label: 'A window with a view', votes: ['old-soul', 'wanderer', 'strategist'] },
      { id: 'a3', label: 'Toy basket, on duty', votes: ['athlete', 'goofball', 'spark'] },
      { id: 'a4', label: 'The door (always ready)', votes: ['adventurer', 'mayor'] },
    ],
  },
  {
    id: 'q-learning',
    prompt: 'Learning a new trick takes:',
    answers: [
      { id: 'a1', label: 'Three goes — they have it', votes: ['spark', 'strategist', 'athlete'] },
      { id: 'a2', label: 'A little patience and treats', votes: ['diplomat', 'sunshine', 'cuddler'] },
      { id: 'a3', label: 'Several sessions and naps in between', votes: ['old-soul', 'wanderer'] },
      { id: 'a4', label: 'They prefer to teach you, actually', votes: ['goofball', 'mayor'] },
    ],
  },
  {
    id: 'q-rain',
    prompt: 'On a rainy day they:',
    answers: [
      { id: 'a1', label: 'Beg to go out anyway', votes: ['adventurer', 'athlete', 'wanderer'] },
      { id: 'a2', label: 'Sleep on you for hours', votes: ['cuddler', 'old-soul'] },
      { id: 'a3', label: 'Find every toy in the house', votes: ['goofball', 'spark', 'sunshine'] },
      { id: 'a4', label: 'Watch the window for action', votes: ['strategist', 'loyal-shadow'] },
    ],
  },
];

export function tallyArchetype(answerIds) {
  const counts = {};
  ARCHETYPE_QUIZ.forEach((q) => {
    const aId = answerIds[q.id];
    if (!aId) return;
    const ans = q.answers.find((a) => a.id === aId);
    if (!ans) return;
    ans.votes.forEach((v) => {
      counts[v] = (counts[v] || 0) + 1;
    });
  });
  const ranked = Object.entries(counts).sort((a, b) => b[1] - a[1]);
  return ranked[0]?.[0] || 'diplomat';
}
