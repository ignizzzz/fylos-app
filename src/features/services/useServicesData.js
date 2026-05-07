import { useCallback, useMemo, useState } from 'react';
import {
  SERVICES_PROVIDERS,
  SERVICES_BOOKINGS,
  SERVICES_MESSAGE_THREADS,
  SERVICES_REVIEWS,
  SAVED_PAYMENT_METHODS,
  findProvider,
  findReviewsForProvider,
} from '../../data/services';

// Central data hook for the Services tab.
//
// Owns mutable state for the slices the UI needs to react to:
// bookings, messages (threads + read state), saved providers, recently
// viewed, reviews authored by the user. Provider catalogue is read-only
// from the seed.

const STATUS_BUCKETS = {
  upcoming: ['confirmed', 'pending'],
  inProgress: ['in-progress'],
  completed: ['completed'],
  cancelled: ['cancelled', 'declined'],
};

export function useServicesData() {
  const [bookings, setBookings] = useState(SERVICES_BOOKINGS);
  const [threads, setThreads] = useState(SERVICES_MESSAGE_THREADS);
  const [reviews, setReviews] = useState(SERVICES_REVIEWS);
  const [savedProviderIds, setSavedProviderIds] = useState(
    () => new Set(['provider_001', 'provider_007'])
  );
  const [recentlyViewedIds, setRecentlyViewedIds] = useState([
    'provider_005',
    'provider_002',
    'provider_008',
  ]);
  const [paymentMethods] = useState(SAVED_PAYMENT_METHODS);

  // ── Saved providers ──────────────────────────────────────────────────
  const toggleSaveProvider = useCallback((providerId) => {
    setSavedProviderIds((prev) => {
      const next = new Set(prev);
      if (next.has(providerId)) next.delete(providerId);
      else next.add(providerId);
      return next;
    });
  }, []);

  const isSaved = useCallback(
    (providerId) => savedProviderIds.has(providerId),
    [savedProviderIds]
  );

  const savedProviders = useMemo(
    () =>
      Array.from(savedProviderIds)
        .map((id) => findProvider(id))
        .filter(Boolean),
    [savedProviderIds]
  );

  // ── Recently viewed ──────────────────────────────────────────────────
  const markRecentlyViewed = useCallback((providerId) => {
    setRecentlyViewedIds((prev) => {
      const without = prev.filter((id) => id !== providerId);
      return [providerId, ...without].slice(0, 6);
    });
  }, []);

  const recentlyViewed = useMemo(
    () =>
      recentlyViewedIds
        .map((id) => findProvider(id))
        .filter(Boolean),
    [recentlyViewedIds]
  );

  // ── Bookings ─────────────────────────────────────────────────────────
  const bookingsByStatus = useCallback(
    (bucketKey, petId) => {
      const buckets = STATUS_BUCKETS[bucketKey] || [bucketKey];
      let list = bookings.filter((b) => buckets.includes(b.status));
      if (petId && petId !== 'all') list = list.filter((b) => b.pet?.id === petId);
      return list;
    },
    [bookings]
  );

  const findBooking = useCallback(
    (bookingId) => bookings.find((b) => b.id === bookingId) || null,
    [bookings]
  );

  const requestBooking = useCallback((booking) => {
    if (!booking) return;
    setBookings((prev) => [
      {
        ...booking,
        id: booking.id || `booking_${Date.now()}`,
        status: 'pending',
        timeline: [
          ...(booking.timeline || []),
          { event: 'requested', at: new Date().toISOString(), by: 'user' },
        ],
      },
      ...prev,
    ]);
  }, []);

  const cancelBooking = useCallback((bookingId, reason) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              status: 'cancelled',
              helper: 'Cancelled by you',
              timeline: [
                ...(b.timeline || []),
                { event: 'cancelled', at: new Date().toISOString(), by: 'user', reason },
              ],
            }
          : b
      )
    );
  }, []);

  const rescheduleBooking = useCallback((bookingId, newDateTime) => {
    setBookings((prev) =>
      prev.map((b) =>
        b.id === bookingId
          ? {
              ...b,
              dateTime: { ...b.dateTime, ...newDateTime },
              status: 'pending',
              helper: 'Reschedule sent · awaiting response',
              timeline: [
                ...(b.timeline || []),
                { event: 'rescheduled', at: new Date().toISOString(), by: 'user' },
              ],
            }
          : b
      )
    );
  }, []);

  // ── Messages ─────────────────────────────────────────────────────────
  const findThread = useCallback(
    (threadId) => threads.find((t) => t.id === threadId) || null,
    [threads]
  );

  const findThreadByProvider = useCallback(
    (providerId, bookingId = null) =>
      threads.find(
        (t) =>
          t.providerId === providerId &&
          (bookingId == null || t.bookingId === bookingId)
      ) ||
      threads.find((t) => t.providerId === providerId) ||
      null,
    [threads]
  );

  const ensureThread = useCallback(
    (providerId, bookingId = null) => {
      const existing = threads.find((t) => t.providerId === providerId);
      if (existing) return existing.id;
      const id = `thread_${Date.now()}`;
      setThreads((prev) => [
        ...prev,
        {
          id,
          providerId,
          bookingId,
          unread: 0,
          lastMessageAt: new Date().toISOString(),
          pinnedContext: bookingId
            ? { kind: 'booking', bookingId, label: '', petName: '' }
            : { kind: 'pre-booking', label: 'No active booking' },
          messages: [],
        },
      ]);
      return id;
    },
    [threads]
  );

  const sendMessage = useCallback((threadId, text) => {
    if (!text || !text.trim()) return;
    const at = new Date().toISOString();
    setThreads((prev) =>
      prev.map((t) =>
        t.id === threadId
          ? {
              ...t,
              lastMessageAt: at,
              messages: [
                ...t.messages,
                {
                  id: `m_${Date.now()}`,
                  senderId: 'me',
                  text: text.trim(),
                  at,
                  status: 'delivered',
                },
              ],
            }
          : t
      )
    );
  }, []);

  const markThreadRead = useCallback((threadId) => {
    setThreads((prev) =>
      prev.map((t) => (t.id === threadId ? { ...t, unread: 0 } : t))
    );
  }, []);

  const totalUnreadMessages = useMemo(
    () => threads.reduce((sum, t) => sum + (t.unread || 0), 0),
    [threads]
  );

  // ── Reviews ──────────────────────────────────────────────────────────
  const addReview = useCallback((review) => {
    if (!review) return;
    const id = review.id || `review_${Date.now()}`;
    setReviews((prev) => [{ ...review, id, isMine: true }, ...prev]);
    if (review.bookingId) {
      setBookings((prev) =>
        prev.map((b) =>
          b.id === review.bookingId
            ? {
                ...b,
                reviewed: true,
                reviewId: id,
                helper: 'Reviewed',
                timeline: [
                  ...(b.timeline || []),
                  { event: 'reviewed', at: new Date().toISOString(), by: 'user' },
                ],
              }
            : b
        )
      );
    }
  }, []);

  const reviewsForProvider = useCallback(
    (providerId) => reviews.filter((r) => r.providerId === providerId),
    [reviews]
  );

  // ── Selectors / projections ─────────────────────────────────────────
  const recommendedFor = useCallback(
    (_petId) =>
      // Simple ranking: rating × recent jobs, prefer 'available' state.
      [...SERVICES_PROVIDERS]
        .sort((a, b) => {
          const aWeight = a.rating * 10 + (a.availabilityState === 'available' ? 5 : 0);
          const bWeight = b.rating * 10 + (b.availabilityState === 'available' ? 5 : 0);
          return bWeight - aWeight;
        })
        .slice(0, 6),
    []
  );

  const newProviders = useMemo(
    () => SERVICES_PROVIDERS.filter((p) => p.cornerBadge === 'New' || p.jobsCompleted < 100),
    []
  );

  const topRatedNearYou = useMemo(
    () =>
      [...SERVICES_PROVIDERS]
        .sort((a, b) => b.rating - a.rating || a.distanceKm - b.distanceKm)
        .slice(0, 8),
    []
  );

  return {
    // catalogue
    providers: SERVICES_PROVIDERS,
    findProvider,
    findReviewsForProvider,

    // bookings
    bookings,
    bookingsByStatus,
    findBooking,
    requestBooking,
    cancelBooking,
    rescheduleBooking,

    // messages
    threads,
    findThread,
    findThreadByProvider,
    ensureThread,
    sendMessage,
    markThreadRead,
    totalUnreadMessages,

    // reviews
    reviews,
    reviewsForProvider,
    addReview,

    // saved & history
    savedProviderIds,
    isSaved,
    toggleSaveProvider,
    savedProviders,
    recentlyViewed,
    markRecentlyViewed,

    // selectors
    recommendedFor,
    newProviders,
    topRatedNearYou,

    // payment
    paymentMethods,
  };
}

export default useServicesData;
