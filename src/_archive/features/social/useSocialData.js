import { useCallback, useMemo, useState } from 'react';
import {
  ACTIVITY_FRIEND_DATA,
  ACTIVITY_PLAYDATE_DATA,
  ACTIVITY_SOCIAL_FEED,
  ACTIVITY_NOTIFICATIONS,
  INITIAL_MEMORIES,
} from '../../data/social';

// Central data hook for the Social tab.
//
// Phase 2: only owns the slices the top-level ActivityScreen used to own
// directly (memories, notifications, schedule events).
//
// Phase 4 will widen this to cover friend graph + feed posts + playdate lists,
// at which point NetworkMode / PlaydatesMode read from the same hook instead of
// duplicating ACTIVITY_FRIEND_DATA / ACTIVITY_SOCIAL_FEED / ACTIVITY_PLAYDATE_DATA
// into their own component-local state.
export function useSocialData() {
  const [memories, setMemories] = useState(INITIAL_MEMORIES);
  const addMemory = useCallback((m) => {
    if (!m) return;
    setMemories((prev) => [m, ...prev]);
  }, []);

  const [notifications, setNotifications] = useState(ACTIVITY_NOTIFICATIONS);
  const markNotificationRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((group) => ({
        ...group,
        items: group.items.map((item) =>
          item.id === notificationId ? { ...item, read: true } : item
        ),
      }))
    );
  }, []);
  const totalUnreadNotifications = useMemo(
    () =>
      notifications.reduce(
        (acc, group) => acc + group.items.filter((item) => !item.read).length,
        0
      ),
    [notifications]
  );

  // Playdate events the user schedules from the in-tab "Schedule Playdate" sheet.
  // The full PlaydateMatching screen (61_*) still maintains its own state today;
  // those will fold into here in Phase 7.
  const [fylosPlaydateEvents, setFylosPlaydateEvents] = useState([]);
  const schedulePlaydateEvent = useCallback((event) => {
    if (!event) return;
    setFylosPlaydateEvents((prev) => [event, ...prev]);
  }, []);

  // Read-only mirrors of the seed fixtures so consumers can pull from one source.
  // Phase 4 will replace these with stateful mirrors + mutators.
  const seed = useMemo(
    () => ({
      friends: ACTIVITY_FRIEND_DATA.friends,
      receivedRequests: ACTIVITY_FRIEND_DATA.receivedRequests,
      sentRequests: ACTIVITY_FRIEND_DATA.sentRequests,
      suggestions: ACTIVITY_FRIEND_DATA.suggestions,
      feedPosts: ACTIVITY_SOCIAL_FEED,
      upcomingPlaydates: ACTIVITY_PLAYDATE_DATA.upcomingPlaydates,
      pendingPlaydates: ACTIVITY_PLAYDATE_DATA.pendingInvitations,
      completedPlaydates: ACTIVITY_PLAYDATE_DATA.completedPlaydates,
    }),
    []
  );

  return {
    memories,
    addMemory,
    notifications,
    markNotificationRead,
    totalUnreadNotifications,
    fylosPlaydateEvents,
    schedulePlaydateEvent,
    seed,
  };
}

export default useSocialData;
