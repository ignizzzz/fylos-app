import React from 'react';
import { ChevronLeft, FileText, Download, Info } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD' };

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const SECTIONS = [
  { id: 1,  title: '1. Acceptance of terms',   body: 'By creating an account or using Fylos, you agree to these Terms of Service. If you do not agree, please do not use the app.' },
  { id: 2,  title: '2. Your account',          body: 'You must be at least 18 and provide accurate information. You are responsible for keeping your credentials secure and for all activity under your account.' },
  { id: 3,  title: '3. Content you post',      body: 'You retain ownership of photos, posts and records you upload. You grant Fylos a licence to display and process them solely to provide the service. You must not post illegal, harmful or infringing content.' },
  { id: 4,  title: '4. Pro services',          body: 'Walkers, sitters and other professionals on Fylos are independent providers. Fylos is a marketplace — we verify, but do not employ them. Disputes are handled per our Resolution Policy.' },
  { id: 5,  title: '5. Payments & refunds',    body: 'Payments are processed by Stripe. Cancellations are refunded per each service\'s policy. Fylos charges a service fee disclosed at checkout.' },
  { id: 6,  title: '6. Health information',   body: 'Health records stored in Fylos are for your convenience. They are not medical advice and do not replace a veterinarian. In emergencies, call your vet or Emergency SOS.' },
  { id: 7,  title: '7. Liability',            body: 'To the maximum extent permitted by law, Fylos is not liable for indirect or consequential damages. Our total liability is limited to fees paid in the last 12 months.' },
  { id: 8,  title: '8. Changes',              body: 'We may update these terms. Material changes will be notified 30 days in advance. Continued use after the effective date constitutes acceptance.' },
  { id: 9,  title: '9. Governing law',        body: 'These terms are governed by the laws of Switzerland. Disputes are subject to the exclusive jurisdiction of the courts of Zürich.' },
  { id: 10, title: '10. Contact',             body: 'Questions? legal@fylos.app · Fylos GmbH, Seestrasse 42, 8002 Zürich, Switzerland.' },
];

export default function TermsScreen() {
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.tos-scroll::-webkit-scrollbar{display:none;}.tos-scroll{scrollbar-width:none;}`}</style>
      <div className="relative" style={{ width: 390, height: 844, borderRadius: 50, border: '8px solid #000', overflow: 'hidden', backgroundColor: THEME.bg, WebkitFontSmoothing: 'antialiased' }}>
        <div className="absolute left-1/2 -translate-x-1/2 z-[100]" style={{ top: 12, width: 120, height: 32, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-[100]" style={{ width: 134, height: 5, backgroundColor: '#000', borderRadius: 9999 }} />
        <div className="absolute top-0 left-0 right-0 z-50 flex items-center justify-between px-8" style={{ height: 54 }}>
          <span style={{ fontSize: 15, fontWeight: 600, color: '#111' }}>9:41</span>
          <div className="flex items-center gap-1">
            <svg width="17" height="12" viewBox="0 0 17 12" fill="none"><rect x="0" y="6" width="3" height="6" rx="1" fill="#111"/><rect x="4.5" y="4" width="3" height="8" rx="1" fill="#111"/><rect x="9" y="2" width="3" height="10" rx="1" fill="#111"/><rect x="13.5" y="0" width="3" height="12" rx="1" fill="#111"/></svg>
            <svg width="16" height="12" viewBox="0 0 16 12" fill="none"><path d="M8 9.5a1 1 0 110 2 1 1 0 010-2z" fill="#111"/><path d="M4.9 7.1a4.5 4.5 0 016.2 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/><path d="M2.2 4.4a8 8 0 0111.6 0" stroke="#111" strokeWidth="1.5" strokeLinecap="round"/></svg>
            <svg width="27" height="13" viewBox="0 0 27 13" fill="none"><rect x="0.5" y="0.5" width="21" height="12" rx="3.5" stroke="#111" strokeOpacity="0.35"/><rect x="2" y="2" width="16" height="9" rx="2" fill="#111"/><path d="M23 4.5v4a2 2 0 000-4z" fill="#111" fillOpacity="0.4"/></svg>
          </div>
        </div>

        <div className="tos-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Terms of service" onBack={back} />

          <div className="px-4">
            <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                <FileText size={18} color={THEME.coral} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Version 3.2</div>
                <div className="text-[12px]" style={{ color: THEME.muted }}>Effective Mar 01, 2026 · Accepted Mar 01, 2026</div>
              </div>
              <button className="w-9 h-9 rounded-full bg-[#F3EFEB] flex items-center justify-center active:scale-95">
                <Download size={15} color={THEME.txt} strokeWidth={2} />
              </button>
            </div>

            <div className="bg-white rounded-[18px] border border-black/[0.04] p-4 mb-4">
              <div className="space-y-4">
                {SECTIONS.map(s => (
                  <div key={s.id}>
                    <h3 className="text-[14.5px] font-bold mb-1.5" style={{ color: THEME.txt }}>{s.title}</h3>
                    <p className="text-[12.5px] leading-relaxed" style={{ color: THEME.muted }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                This is a simplified summary. The full legal version is available at fylos.app/legal/terms.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
