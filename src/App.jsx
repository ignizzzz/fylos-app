import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

// Unified app (all screens integrated)
import UnifiedApp from './screens/06_PETS_ProfileShell_Documents_v1'

// Standalone screens (for reference/comparison)
import AppShell from './screens/01_CORE_AppShell_v1'
import DesignSystem from './screens/02_CORE_DesignSystem_v1'
import HomeDashboard from './screens/03_HOME_Dashboard_v1'
import PetsProfile from './screens/04_PETS_ProfileShell_About_v1'
import PetsHealth from './screens/05_PETS_ProfileShell_Health_v1'

// New screens
import OnboardingScreen from './screens/36_ONBOARDING_v1'
import AddPetScreen from './screens/37_ADD_PET_v1'
import EditPetScreen from './screens/38_EDIT_PET_v1'
import ReviewRatingScreen from './screens/39_REVIEW_RATING_v1'
import GPSTrackingScreen from './screens/40_GPS_TRACKING_v1'
import MapProvidersScreen from './screens/41_MAP_PROVIDERS_v1'
import CancelRescheduleScreen from './screens/42_CANCEL_RESCHEDULE_v1'
import PhotoGalleryScreen from './screens/43_PHOTO_GALLERY_v1'
import FeedingTrackerScreen from './screens/44_FEEDING_TRACKER_v1'
import LostPetAlertScreen from './screens/45_LOST_PET_ALERT_v1'
import VetTelehealthScreen from './screens/46_VET_TELEHEALTH_v1'
import TrainingTipsScreen from './screens/47_TRAINING_TIPS_v1'
import LanguageSettingsScreen from './screens/48_LANGUAGE_SETTINGS_v1'
import SubscriptionScreen from './screens/49_SUBSCRIPTION_v1'
import ProRegistrationScreen from './screens/50_PRO_REGISTRATION_v1'
import ProDashboardScreen from './screens/51_PRO_DASHBOARD_v1'
import ProRequestsScreen from './screens/52_PRO_REQUESTS_v1'
import ProWalkCheckinScreen from './screens/53_PRO_WALK_CHECKIN_v1'
import ProEarningsScreen from './screens/54_PRO_EARNINGS_v1'
import ProProfileScreen from './screens/55_PRO_PROFILE_v1'
import DangerReportsScreen from './screens/56_DANGER_REPORTS_v1'
import PaymentWalletScreen from './screens/57_PAYMENT_WALLET_v1'
import NotificationPrefsScreen from './screens/58_NOTIFICATION_PREFS_v1'
import HealthRemindersScreen from './screens/59_HEALTH_REMINDERS_v1'
import HelpCenterScreen from './screens/60_HELP_CENTER_v1'
import PlaydateMatchingScreen from './screens/61_PLAYDATE_MATCHING_v1'
import ProviderDetailScreen from './screens/62_PROVIDER_DETAIL_v1'
import BookingFlowScreen from './screens/63_BOOKING_FLOW_v1'
import ChatMessagingScreen from './screens/64_CHAT_MESSAGING_v1'
import UserProfileScreen from './screens/65_USER_PROFILE_v1'
import PetProfileDetailScreen from './screens/66_PET_PROFILE_DETAIL_v1'
import EmergencySOSScreen from './screens/67_EMERGENCY_SOS_v1'
import ProviderReviewsScreen from './screens/68_PROVIDER_REVIEWS_v1'

// Legacy screens
import HomeScreen from './screens/Explore-home-v1'
import ProvidersScreen from './screens/Explore-providers-v1'
import BookingScreen from './screens/Explore-booking-v1'
import BookingConfirmScreen from './screens/Explore-booking-confirm-v1'
import WalkerProfileScreen from './screens/Explore-Walker-booking-profile-v1'
import WalkerPaymentScreen from './screens/Explore-Walker-Payment-v1'
import BookingDetailsScreen from './screens/Explore-Walker-booking-details'
import WalkerChatScreen from './screens/Explore-walker-chat.v1'

function App() {
  return (
    <Routes>
      {/* Default: Unified App with all tabs working */}
      <Route path="/" element={<UnifiedApp />} />

      {/* Standalone screens (for reference) */}
      <Route path="/app-shell" element={<AppShell />} />
      <Route path="/design-system" element={<DesignSystem />} />
      <Route path="/home-dashboard" element={<HomeDashboard />} />
      <Route path="/pets-profile" element={<PetsProfile />} />
      <Route path="/pets-health" element={<PetsHealth />} />

      {/* New screens */}
      <Route path="/onboarding" element={<OnboardingScreen />} />
      <Route path="/add-pet" element={<AddPetScreen />} />
      <Route path="/edit-pet" element={<EditPetScreen />} />
      <Route path="/review" element={<ReviewRatingScreen />} />
      <Route path="/gps-tracking" element={<GPSTrackingScreen />} />
      <Route path="/map-providers" element={<MapProvidersScreen />} />
      <Route path="/cancel-reschedule" element={<CancelRescheduleScreen />} />
      <Route path="/photo-gallery" element={<PhotoGalleryScreen />} />
      <Route path="/feeding-tracker" element={<FeedingTrackerScreen />} />
      <Route path="/lost-pet" element={<LostPetAlertScreen />} />
      <Route path="/vet-telehealth" element={<VetTelehealthScreen />} />
      <Route path="/training-tips" element={<TrainingTipsScreen />} />
      <Route path="/language" element={<LanguageSettingsScreen />} />
      <Route path="/subscription" element={<SubscriptionScreen />} />
      <Route path="/pro-registration" element={<ProRegistrationScreen />} />
      <Route path="/pro-dashboard" element={<ProDashboardScreen />} />
      <Route path="/pro-requests" element={<ProRequestsScreen />} />
      <Route path="/pro-walk" element={<ProWalkCheckinScreen />} />
      <Route path="/pro-earnings" element={<ProEarningsScreen />} />
      <Route path="/pro-profile" element={<ProProfileScreen />} />
      <Route path="/danger-reports" element={<DangerReportsScreen />} />
      <Route path="/wallet" element={<PaymentWalletScreen />} />
      <Route path="/notification-prefs" element={<NotificationPrefsScreen />} />
      <Route path="/health-reminders" element={<HealthRemindersScreen />} />
      <Route path="/help" element={<HelpCenterScreen />} />
      <Route path="/playdate-matching" element={<PlaydateMatchingScreen />} />
      <Route path="/provider-detail" element={<ProviderDetailScreen />} />
      <Route path="/booking-flow" element={<BookingFlowScreen />} />
      <Route path="/chat" element={<ChatMessagingScreen />} />
      <Route path="/user-profile" element={<UserProfileScreen />} />
      <Route path="/pet-profile" element={<PetProfileDetailScreen />} />
      <Route path="/emergency" element={<EmergencySOSScreen />} />
      <Route path="/provider-reviews" element={<ProviderReviewsScreen />} />

      {/* Legacy screens */}
      <Route path="/home" element={<HomeScreen />} />
      <Route path="/providers" element={<ProvidersScreen />} />
      <Route path="/booking" element={<BookingScreen />} />
      <Route path="/booking-confirm" element={<BookingConfirmScreen />} />
      <Route path="/walker-profile" element={<WalkerProfileScreen />} />
      <Route path="/walker-payment" element={<WalkerPaymentScreen />} />
      <Route path="/booking-details" element={<BookingDetailsScreen />} />
      <Route path="/walker-chat" element={<WalkerChatScreen />} />
    </Routes>
  );
}

export default App;

