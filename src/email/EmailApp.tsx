import { Navigate, Route, Routes } from 'react-router-dom'
import { ScenarioProvider } from './state/ScenarioContext'
import { paths } from './routes'
import { C, FONT } from './ui/tokens'
import EmailHome from './EmailHome'

// Public subscriber-facing states
import ConfirmSubscription from './public/ConfirmSubscription'
import EmailPreferences from './public/EmailPreferences'
import Unsubscribe from './public/Unsubscribe'
import Resubscribe from './public/Resubscribe'
import InvalidExpired from './public/InvalidExpired'

// Admin console
import CampaignList from './admin/CampaignList'
import CampaignDetail from './admin/CampaignDetail'
import CampaignDraftEditor from './admin/CampaignDraftEditor'
import AudienceSelection from './admin/AudienceSelection'
import EmailPreview from './admin/EmailPreview'
import SubscriberList from './admin/SubscriberList'
import SuppressionStatus from './admin/SuppressionStatus'

// The display serif (Fraunces) is the brand's website face; using it for
// headings and numerals gives the surface an editorial voice and pulls it away
// from the generic all-Inter look. Body/UI stays Inter. Keyframes power the
// badge pulse, skeleton shimmer, and the staggered page-load reveal.
function EmailAtmosphere() {
  return (
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,400..600,0..90,0..1&display=swap');
      @keyframes emailPulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(.8)}}
      @keyframes emailShimmer{0%{background-position:-400px 0}100%{background-position:400px 0}}
      @keyframes emailRise{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}
      .email-root ::selection{background:#E85D2A;color:#FFF3EE}
      .email-display{font-family:${FONT.display};font-optical-sizing:auto;font-variation-settings:'SOFT' 45,'WONK' 0;letter-spacing:-0.02em}
      .email-num{font-family:${FONT.display};font-optical-sizing:auto;font-feature-settings:'tnum' 1;letter-spacing:-0.01em}
      .email-rise>*{opacity:0;animation:emailRise .68s cubic-bezier(.22,1,.36,1) forwards}
      .email-rise>*:nth-child(1){animation-delay:.03s}
      .email-rise>*:nth-child(2){animation-delay:.09s}
      .email-rise>*:nth-child(3){animation-delay:.15s}
      .email-rise>*:nth-child(4){animation-delay:.21s}
      .email-rise>*:nth-child(5){animation-delay:.27s}
      .email-rise>*:nth-child(6){animation-delay:.33s}
      @media (prefers-reduced-motion: reduce){.email-rise>*{animation:none;opacity:1}}
    `}</style>
  )
}

/** A very faint film grain over the whole surface for warmth and paper texture. */
function EmailGrain() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 2,
        opacity: 0.045,
        mixBlendMode: 'multiply',
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
      }}
    />
  )
}

/**
 * The whole Email & Newsletter frontend. Mounted at /newsletter/* in
 * src/App.jsx, so the routes below are relative to that base.
 */
export default function EmailApp() {
  return (
    <ScenarioProvider>
      <div className="email-root" style={{ fontFamily: FONT.sans, color: C.ink }}>
        <EmailAtmosphere />
        <EmailGrain />
        <Routes>
          <Route index element={<EmailHome />} />

          {/* Public subscriber flows */}
          <Route path="confirm" element={<ConfirmSubscription />} />
          <Route path="preferences" element={<EmailPreferences />} />
          <Route path="unsubscribe" element={<Unsubscribe />} />
          <Route path="resubscribe" element={<Resubscribe />} />
          <Route path="expired" element={<InvalidExpired />} />

          {/* Admin console */}
          <Route path="admin" element={<Navigate to={paths.campaigns} replace />} />
          <Route path="admin/campaigns" element={<CampaignList />} />
          <Route path="admin/campaigns/:id" element={<CampaignDetail />} />
          <Route path="admin/campaigns/:id/edit" element={<CampaignDraftEditor />} />
          <Route path="admin/campaigns/:id/audience" element={<AudienceSelection />} />
          <Route path="admin/campaigns/:id/preview" element={<EmailPreview />} />
          <Route path="admin/subscribers" element={<SubscriberList />} />
          <Route path="admin/suppression" element={<SuppressionStatus />} />

          <Route path="*" element={<Navigate to={paths.home} replace />} />
        </Routes>
      </div>
    </ScenarioProvider>
  )
}
