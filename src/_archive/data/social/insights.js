// Activity insights summary — used by ActivityInsightsScreen inside Social tab.

export const ACTIVITY_INSIGHTS_DATA = {
  weeklySummary: {
    period: 'Feb 16 - Feb 22',
    walks: 5,
    totalMinutes: 450,
    trendPercent: 20,
    dailyWalks: [1, 0, 1, 2, 0, 1, 0],
    labels: ['M', 'T', 'W', 'T', 'F', 'S', 'S']
  },
  weightTrend: { current: 28, idealMin: 26, idealMax: 29 },
  medication: { thisWeekTaken: 7, streak: 45 },
  favoritePlaces: [
    { name: 'Zurichhorn Park', visits: 12 },
    { name: 'Rieterpark', visits: 5 },
    { name: 'Lindenhof', visits: 2 }
  ],
  activeTimes: { eveningShare: 35 }
};
