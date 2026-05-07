import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle } from 'lucide-react';
import useServicesData from './useServicesData';
import ServicesSubTabs from './components/shared/ServicesSubTabs';
import PetSelectorPill from './components/shared/PetSelectorPill';
import DiscoverMode from './discover/DiscoverMode';
import BookingsMode from './bookings/BookingsMode';
import SavedMode from './saved/SavedMode';
import ProviderProfile from './subscreens/ProviderProfile';
import ProviderReviews from './subscreens/ProviderReviews';
import CategoryDetail from './subscreens/CategoryDetail';
import SearchProviders from './subscreens/SearchProviders';
import BookingDetails from './subscreens/BookingDetails';
import MessageThread from './subscreens/MessageThread';
import MessagesInbox from './subscreens/MessagesInbox';
import BookingFlow from './flows/BookingFlow';
import Payment from './flows/Payment';
import RequestSent from './flows/RequestSent';
import CancelRescheduleSheet from './sheets/CancelRescheduleSheet';
import AddReviewModal from './sheets/AddReviewModal';

// FYLOS · Services tab — orchestrator.
//
// 3 sub-tabs (Discover · Bookings · Saved) + a slide-in stack of sub-screens
// portalled through #fylos-phone-root at z-[80] (notch + dock visible).
// Surface conventions match FYLOS_SURFACE_PLAN.md:
//   - slide-in full pages: stack
//   - bottom sheet (cancel/reschedule): overlay z-[110]
//   - center modal (review): overlay z-[110]

export default function ServicesTab({
  pets = [],
  selectedPetId: selectedPetIdProp,
  onSelectPet,
  onNavigate,
  pendingView,
}) {
  const data = useServicesData();
  const router = useNavigate();
  const [subTab, setSubTab] = useState('discover');
  const [petId, setPetId] = useState(selectedPetIdProp || pets[0]?.id || null);

  // Slide-in sub-screen stack. kinds:
  //   provider · reviews · category · search · messages-inbox · message-thread
  //   booking-flow · payment · request-sent · booking-details
  const [stack, setStack] = useState([]);
  const top = stack[stack.length - 1] || null;
  const push = (entry) => setStack((s) => [...s, entry]);
  const popOnce = () => setStack((s) => s.slice(0, -1));
  const replaceTop = (entry) => setStack((s) => [...s.slice(0, -1), entry]);
  const popUntil = (kind) =>
    setStack((s) => {
      const idx = s.findIndex((e) => e.kind === kind);
      return idx >= 0 ? s.slice(0, idx + 1) : s;
    });

  // Sheet/modal overlay state (independent of slide-in stack)
  const [sheet, setSheet] = useState(null); // { kind: 'cancel'|'reschedule'|'review', booking }

  useEffect(() => {
    if (selectedPetIdProp && selectedPetIdProp !== petId) setPetId(selectedPetIdProp);
  }, [selectedPetIdProp]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!pendingView) return;
    if (pendingView === 'bookings') setSubTab('bookings');
    else if (pendingView === 'saved') setSubTab('saved');
  }, [pendingView]);

  const handlePet = (id) => {
    setPetId(id);
    if (onSelectPet) onSelectPet(id);
  };

  // ── Discover / list actions ────────────────────────────────────────
  const openProvider = (provider) => {
    if (!provider) return;
    data.markRecentlyViewed(provider.id);
    push({ kind: 'provider', params: { providerId: provider.id } });
  };

  const openCategory = (category) => {
    if (!category || !category.active) return;
    push({ kind: 'category', params: { categoryId: category.id } });
  };

  const openSearch = () => push({ kind: 'search', params: {} });

  // Cross-app surfaces that live as standalone routes outside the Services
  // tab. Use react-router rather than the legacy `navigateTo` (which only
  // knows the in-tab pushedScreen IDs).
  const openMap = () => router('/map-providers');
  const openVetTelehealth = () => router('/vet-telehealth');

  const openBookingDetails = (bookingId) =>
    push({ kind: 'booking-details', params: { bookingId } });

  // ── Booking flow ───────────────────────────────────────────────────
  const openBookingFlow = (provider, params = {}) => {
    push({ kind: 'booking-flow', params: { providerId: provider.id, ...params } });
  };

  const handleFlowContinue = (draft) =>
    replaceTop({ kind: 'payment', params: { draft } });

  const handlePaymentComplete = ({ draft }) => {
    const newId = `booking_${Date.now()}`;
    data.requestBooking({ ...draft, id: newId });
    replaceTop({ kind: 'request-sent', params: { draft, bookingId: newId } });
  };

  // ── Messaging ──────────────────────────────────────────────────────
  const openMessagesInbox = () => push({ kind: 'messages-inbox', params: {} });

  const openMessageThread = (threadId) =>
    push({ kind: 'message-thread', params: { threadId } });

  const openMessageFromProvider = (provider) => {
    const threadId = data.ensureThread(provider.id);
    push({ kind: 'message-thread', params: { threadId } });
  };

  const openMessageFromBooking = (booking) => {
    const threadId = data.ensureThread(booking.provider.id, booking.id);
    push({ kind: 'message-thread', params: { threadId } });
  };

  // ── Booking actions ────────────────────────────────────────────────
  const handleCancel = (booking) => setSheet({ kind: 'cancel', booking });
  const handleReschedule = (booking) => setSheet({ kind: 'reschedule', booking });
  const handleLeaveReview = (booking) => setSheet({ kind: 'review', booking });

  const handleTrackLive = () => router('/gps-tracking');

  const handleRebook = (booking) => {
    const provider = data.findProvider(booking.provider?.id);
    if (provider) {
      popOnce();
      openBookingFlow(provider, { preselectedServiceId: booking.service?.id });
    }
  };

  const handleSheetConfirm = (payload) => {
    if (!sheet) return;
    const { kind, booking } = sheet;
    if (kind === 'cancel') {
      data.cancelBooking(booking.id, payload?.reasonId);
    } else if (kind === 'reschedule') {
      data.rescheduleBooking(booking.id, {});
    } else if (kind === 'review') {
      const provider = data.findProvider(booking.provider?.id);
      data.addReview({
        providerId: booking.provider?.id,
        bookingId: booking.id,
        author: { name: 'You', photo: null },
        rating: payload.rating,
        date: new Date().toLocaleDateString('en', { month: 'short', day: 'numeric', year: 'numeric' }),
        text: payload.note,
        tags: payload.tagIds,
        helpful: 0,
        helpfulByMe: false,
      });
    }
    setSheet(null);
  };

  // ── UI ────────────────────────────────────────────────────────────
  const upcomingCount =
    data.bookingsByStatus('upcoming', petId).length +
    data.bookingsByStatus('inProgress', petId).length;
  const subTabBadges = {
    bookings: upcomingCount > 0 ? upcomingCount : null,
  };

  return (
    <div
      className="absolute inset-0 overflow-x-hidden overflow-y-auto bg-[#F9F9FB] custom-scrollbar"
      onScroll={(e) => {
        window.dispatchEvent(
          new CustomEvent('fylos-main-scroll', { detail: { scrollTop: e.currentTarget.scrollTop } })
        );
      }}
    >
      <div className="min-h-full pt-[110px] pb-32">
        {/* Pet selector */}
        {pets.length > 1 && (
          <div className="px-5 pt-1 pb-2">
            <PetSelectorPill
              pets={pets}
              selectedPetId={petId}
              onSelect={handlePet}
              showAll={subTab === 'bookings' || subTab === 'saved'}
            />
          </div>
        )}

        {/* Sub-tabs + Messages icon */}
        <div className="px-5 pt-1 pb-3 flex items-center gap-2">
          <div className="flex-1 min-w-0">
            <ServicesSubTabs tab={subTab} setTab={setSubTab} badges={subTabBadges} />
          </div>
          <button
            onClick={openMessagesInbox}
            className="relative w-[40px] h-[40px] rounded-full bg-white border border-black/[0.05] flex items-center justify-center active:scale-[0.96] transition-all"
            aria-label="Messages"
          >
            <MessageCircle size={17} className="text-[#111111]" strokeWidth={2.2} />
            {data.totalUnreadMessages > 0 && (
              <span className="absolute top-1 right-1 min-w-[14px] h-[14px] px-1 rounded-full text-[9px] font-bold bg-[#FF6A3D] text-white inline-flex items-center justify-center">
                {data.totalUnreadMessages}
              </span>
            )}
          </button>
        </div>

        {/* Active mode */}
        {subTab === 'discover' && (
          <DiscoverMode
            pets={pets}
            selectedPetId={petId}
            data={data}
            onOpenSearch={openSearch}
            onOpenCategory={openCategory}
            onOpenProvider={openProvider}
            onOpenMap={openMap}
            onOpenVetTelehealth={openVetTelehealth}
            onOpenBookingDetails={openBookingDetails}
          />
        )}
        {subTab === 'bookings' && (
          <BookingsMode
            pets={pets}
            selectedPetId={petId}
            data={data}
            onOpenBooking={openBookingDetails}
            onOpenDiscover={() => setSubTab('discover')}
          />
        )}
        {subTab === 'saved' && (
          <SavedMode
            data={data}
            onOpenProvider={openProvider}
            onOpenDiscover={() => setSubTab('discover')}
          />
        )}
      </div>

      {/* ── Slide-in sub-screens (z-[80] portalled to phone-root) ─── */}
      {top?.kind === 'provider' && (
        <ProviderProfile
          provider={data.findProvider(top.params.providerId)}
          data={data}
          onClose={popOnce}
          onBook={openBookingFlow}
          onMessage={openMessageFromProvider}
          onOpenReviews={(prov) =>
            push({ kind: 'reviews', params: { providerId: prov.id } })
          }
        />
      )}
      {top?.kind === 'reviews' && (
        <ProviderReviews
          provider={data.findProvider(top.params.providerId)}
          onClose={popOnce}
        />
      )}
      {top?.kind === 'category' && (
        <CategoryDetail
          categoryId={top.params.categoryId}
          data={data}
          onClose={popOnce}
          onOpenProvider={openProvider}
          onOpenMap={openMap}
        />
      )}
      {top?.kind === 'search' && (
        <SearchProviders
          data={data}
          onClose={popOnce}
          onOpenProvider={openProvider}
          onOpenCategory={openCategory}
        />
      )}
      {top?.kind === 'booking-flow' && (
        <BookingFlow
          provider={data.findProvider(top.params.providerId)}
          pets={pets}
          preselectedServiceId={top.params.preselectedServiceId}
          onClose={popOnce}
          onContinue={handleFlowContinue}
        />
      )}
      {top?.kind === 'payment' && (
        <Payment
          draft={top.params.draft}
          paymentMethods={data.paymentMethods}
          onClose={popOnce}
          onComplete={handlePaymentComplete}
        />
      )}
      {top?.kind === 'request-sent' && (
        <RequestSent
          draft={top.params.draft}
          bookingId={top.params.bookingId}
          onClose={() => setStack([])}
          onViewBooking={() =>
            replaceTop({ kind: 'booking-details', params: { bookingId: top.params.bookingId } })
          }
          onMessageProvider={() => {
            const providerId = top.params.draft?.provider?.id;
            if (providerId) {
              const threadId = data.ensureThread(providerId, top.params.bookingId);
              replaceTop({ kind: 'message-thread', params: { threadId } });
            }
          }}
          onBrowseMore={() => setStack([])}
        />
      )}
      {top?.kind === 'booking-details' && (
        <BookingDetails
          booking={data.findBooking(top.params.bookingId)}
          onClose={popOnce}
          onMessageProvider={openMessageFromBooking}
          onOpenProvider={(b) => openProvider(data.findProvider(b.provider?.id))}
          onCancel={handleCancel}
          onReschedule={handleReschedule}
          onTrackLive={handleTrackLive}
          onLeaveReview={handleLeaveReview}
          onRebook={handleRebook}
        />
      )}
      {top?.kind === 'message-thread' && (
        <MessageThread
          thread={data.findThread(top.params.threadId)}
          data={data}
          onClose={popOnce}
          onOpenBooking={openBookingDetails}
          onOpenProvider={(prov) => openProvider(prov)}
        />
      )}
      {top?.kind === 'messages-inbox' && (
        <MessagesInbox data={data} onClose={popOnce} onOpenThread={openMessageThread} />
      )}

      {/* ── Sheets / modals (z-[110]) ─────────────────────────────── */}
      {(sheet?.kind === 'cancel' || sheet?.kind === 'reschedule') && (
        <CancelRescheduleSheet
          booking={sheet.booking}
          mode={sheet.kind}
          onClose={() => setSheet(null)}
          onConfirm={handleSheetConfirm}
        />
      )}
      {sheet?.kind === 'review' && (
        <AddReviewModal
          booking={sheet.booking}
          onClose={() => setSheet(null)}
          onSubmit={handleSheetConfirm}
        />
      )}
    </div>
  );
}
