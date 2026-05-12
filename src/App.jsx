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
import OnboardingV2 from './screens/36_ONBOARDING_v2'
import OnboardingDirections from './screens/ONBOARDING_DIRECTIONS_v1'
import OnboardingConnected from './screens/ONBOARDING_CONNECTED_v1'
import OnboardingV3 from './screens/ONBOARDING_v3'
import OnboardingV4 from './screens/ONBOARDING_v4'
import OnboardingPreview from './screens/ONBOARDING_PREVIEW_v1'
import SplashVariants from './screens/SPLASH_VARIANTS_v1'
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
import ProviderDetailScreen from './screens/62_PROVIDER_DETAIL_v1'
import BookingFlowScreen from './screens/63_BOOKING_FLOW_v1'
import ChatMessagingScreen from './screens/64_CHAT_MESSAGING_v1'
import UserProfileScreen from './screens/65_USER_PROFILE_v1'
import PetProfileDetailScreen from './screens/66_PET_PROFILE_DETAIL_v1'
import EmergencySOSScreen from './screens/67_EMERGENCY_SOS_v1'
import ProviderReviewsScreen from './screens/68_PROVIDER_REVIEWS_v1'
import CreateAccountScreen from './screens/69_CREATE_ACCOUNT_v1'
import CreateAccountV2 from './screens/69_CREATE_ACCOUNT_v2'
import SignIn from './screens/SIGN_IN_v1'
import SecurityPasswordScreen from './screens/70_SECURITY_PASSWORD_v1'
import SecurityTwoFactorScreen from './screens/71_SECURITY_2FA_v1'
import SecurityBiometricScreen from './screens/72_SECURITY_BIOMETRIC_v1'
import SecuritySessionsScreen from './screens/73_SECURITY_SESSIONS_v1'
import SecurityAccountsScreen from './screens/74_SECURITY_ACCOUNTS_v1'
import PrivacyVisibilityScreen from './screens/75_PRIVACY_VISIBILITY_v1'
import PrivacyDiscoverableScreen from './screens/76_PRIVACY_DISCOVERABLE_v1'
import PrivacyLocationScreen from './screens/77_PRIVACY_LOCATION_v1'
import PrivacyActivityScreen from './screens/78_PRIVACY_ACTIVITY_v1'
import RegionScreen from './screens/79_REGION_v1'
import CurrencyScreen from './screens/80_CURRENCY_v1'
import HealthSyncScreen from './screens/81_HEALTH_SYNC_v1'
import CalendarSyncScreen from './screens/82_CALENDAR_SYNC_v1'
import PrimaryVetScreen from './screens/83_PRIMARY_VET_v1'
import WhatsComingScreen from './screens/84_WHATS_COMING_v1'
import ExportDataScreen from './screens/86_EXPORT_DATA_v1'
import TermsScreen from './screens/87_TERMS_v1'
import PrivacyPolicyScreen from './screens/88_PRIVACY_POLICY_v1'
import LicensesScreen from './screens/89_LICENSES_v1'
import InvitePublicScreen from './screens/90_INVITE_PUBLIC_v1'
import MarketingShowcase from './screens/MARKETING_SHOWCASE_v1'
import IconographyLab from './screens/ICONOGRAPHY_LAB_v1'
import FeltIconSystem from './screens/FELT_ICON_SYSTEM_v1'
import IconsCompare from './screens/ICONS_COMPARE_v1'
import BrandKit from './screens/BRAND_KIT_v1'
import ProfileHeroVariants from './screens/PROFILE_HERO_VARIANTS_v1'
import ServicesCategoriesVariants from './screens/SERVICES_CATEGORIES_VARIANTS_v1'
import NextUpVariants from './screens/NEXT_UP_VARIANTS_v1'
import ProviderCardVariants from './screens/PROVIDER_CARD_VARIANTS_v1'

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
      <Route path="/onboarding-v2" element={<OnboardingV2 />} />
      <Route path="/onboarding-directions" element={<OnboardingDirections />} />
      <Route path="/onboarding-connected" element={<OnboardingConnected />} />
      <Route path="/onboarding-v3" element={<OnboardingV3 />} />
      <Route path="/onboarding-v4" element={<OnboardingV4 />} />
      <Route path="/onboarding-preview" element={<OnboardingPreview />} />
      <Route path="/splash-variants" element={<SplashVariants />} />
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
      <Route path="/provider-detail" element={<ProviderDetailScreen />} />
      <Route path="/booking-flow" element={<BookingFlowScreen />} />
      <Route path="/chat" element={<ChatMessagingScreen />} />
      <Route path="/user-profile" element={<UserProfileScreen />} />
      <Route path="/pet-profile" element={<PetProfileDetailScreen />} />
      <Route path="/emergency" element={<EmergencySOSScreen />} />
      <Route path="/provider-reviews" element={<ProviderReviewsScreen />} />
      <Route path="/create-account" element={<CreateAccountV2 />} />
      <Route path="/create-account-v1" element={<CreateAccountScreen />} />
      <Route path="/sign-in" element={<SignIn />} />
      <Route path="/security/password" element={<SecurityPasswordScreen />} />
      <Route path="/security/2fa" element={<SecurityTwoFactorScreen />} />
      <Route path="/security/biometric" element={<SecurityBiometricScreen />} />
      <Route path="/security/sessions" element={<SecuritySessionsScreen />} />
      <Route path="/security/connected-accounts" element={<SecurityAccountsScreen />} />
      <Route path="/privacy/visibility" element={<PrivacyVisibilityScreen />} />
      <Route path="/privacy/discoverable" element={<PrivacyDiscoverableScreen />} />
      <Route path="/privacy/location" element={<PrivacyLocationScreen />} />
      <Route path="/privacy/activity" element={<PrivacyActivityScreen />} />
      <Route path="/region" element={<RegionScreen />} />
      <Route path="/currency" element={<CurrencyScreen />} />
      <Route path="/integrations/health-sync" element={<HealthSyncScreen />} />
      <Route path="/integrations/calendar" element={<CalendarSyncScreen />} />
      <Route path="/vet/primary" element={<PrimaryVetScreen />} />
      <Route path="/upcoming" element={<WhatsComingScreen />} />
      <Route path="/data/export" element={<ExportDataScreen />} />
      <Route path="/legal/terms" element={<TermsScreen />} />
      <Route path="/legal/privacy" element={<PrivacyPolicyScreen />} />
      <Route path="/legal/licenses" element={<LicensesScreen />} />

      {/* Public invite (Partiful-style, no iPhone frame, no auth) */}
      <Route path="/invite/:inviteId" element={<InvitePublicScreen />} />
      <Route path="/invite" element={<InvitePublicScreen />} />

      {/* Marketing showcase (no iPhone frame, full-width landing-style preview) */}
      <Route path="/marketing-preview" element={<MarketingShowcase />} />

      {/* Iconography lab — 4 material variants side-by-side, no iPhone frame */}
      <Route path="/iconography-lab" element={<IconographyLab />} />

      {/* Felt icon system — 12 felt-styled icons, animated, full-page showcase */}
      <Route path="/felt-icons" element={<FeltIconSystem />} />

      {/* Icon comparison — current lucide vs proposed felt, side-by-side */}
      <Route path="/icons-compare" element={<IconsCompare />} />

      {/* Brand kit — standalone logo assets, color palette, downloads */}
      <Route path="/brand" element={<BrandKit />} />
      <Route path="/profile-hero-variants" element={<ProfileHeroVariants />} />
      <Route path="/services-variants" element={<ServicesCategoriesVariants />} />
      <Route path="/next-up-variants" element={<NextUpVariants />} />
      <Route path="/provider-card-variants" element={<ProviderCardVariants />} />

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

