import React from 'react';
import { ChevronLeft, Shield, Download, Mail, Trash2, UserCheck, ChevronRight, Info } from 'lucide-react';

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
  { title: 'Data we collect',     body: 'Account info (name, email, phone), pet profiles and photos, location (only with permission), device info, usage analytics and payment metadata (processed by Stripe — we never store card numbers).' },
  { title: 'How we use your data', body: 'To run the service, match you with walkers/sitters, send reminders, provide customer support, detect fraud and improve Fylos. We do not sell your data to third parties.' },
  { title: 'Sharing',             body: 'With service providers you book (only what they need to deliver the service), with infrastructure partners (AWS, Stripe, Twilio) under data-processing agreements, and when legally required by authorities.' },
  { title: 'Your rights (GDPR)',  body: 'You can access, correct, export, restrict or delete your data at any time. You can withdraw consent for optional processing. Contact our DPO at privacy@fylos.app.' },
  { title: 'Retention',           body: 'Account data is kept while your account is active and for 30 days after deletion. Invoices are kept for 10 years (Swiss tax law). Anonymised analytics may be kept longer.' },
  { title: 'Cookies',             body: 'We use essential cookies to run the app and optional cookies for analytics. You can manage preferences under Settings · Privacy · Data collection.' },
  { title: 'Children',            body: 'Fylos is not intended for children under 16. We do not knowingly collect their data. Contact us to remove a child\'s data.' },
  { title: 'International transfers', body: 'Your data is stored in the EU. When transferring outside the EU, we use Standard Contractual Clauses approved by the European Commission.' },
  { title: 'Changes',             body: 'We will notify you 30 days before any material change. You can withdraw consent and delete your account at any time.' },
];

export default function PrivacyPolicyScreen() {
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.pp-scroll::-webkit-scrollbar{display:none;}.pp-scroll{scrollbar-width:none;}`}</style>
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

        <div className="pp-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Privacy policy" onBack={back} />

          <div className="px-4">
            <div className="bg-white rounded-[18px] p-3.5 mb-4 border border-black/[0.04] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                <Shield size={18} color={THEME.coral} strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>GDPR-compliant</div>
                <div className="text-[12px]" style={{ color: THEME.muted }}>Effective Mar 01, 2026</div>
              </div>
              <button className="w-9 h-9 rounded-full bg-[#F3EFEB] flex items-center justify-center active:scale-95">
                <Download size={15} color={THEME.txt} strokeWidth={2} />
              </button>
            </div>

            <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>Exercise your rights</div>
            <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden mb-4">
              {[
                { Icon: Download, title: 'Export my data',  desc: 'Request a full copy' },
                { Icon: Trash2,   title: 'Delete my data',  desc: 'Permanently remove your account' },
                { Icon: UserCheck,title: 'Restrict processing', desc: 'Limit how we use your data' },
                { Icon: Mail,     title: 'Contact our DPO', desc: 'privacy@fylos.app' },
              ].map((r, i, arr) => (
                <button key={i} className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.03]"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                  <div className="w-9 h-9 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                    <r.Icon size={15} color={THEME.coral} strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-[14px] font-semibold" style={{ color: THEME.txt }}>{r.title}</div>
                    <div className="text-[11.5px]" style={{ color: THEME.muted }}>{r.desc}</div>
                  </div>
                  <ChevronRight size={16} color="#CFCFD4" />
                </button>
              ))}
            </div>

            <div className="bg-white rounded-[18px] border border-black/[0.04] p-4 mb-4">
              <div className="space-y-4">
                {SECTIONS.map((s, i) => (
                  <div key={i}>
                    <h3 className="text-[14.5px] font-bold mb-1.5" style={{ color: THEME.txt }}>{s.title}</h3>
                    <p className="text-[12.5px] leading-relaxed" style={{ color: THEME.muted }}>{s.body}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-start gap-2 px-3.5 py-2.5 rounded-[12px]" style={{ backgroundColor: 'rgba(0,122,255,0.08)' }}>
              <Info size={13} color="#007AFF" strokeWidth={2.2} className="shrink-0 mt-[2px]" />
              <span className="text-[12px] leading-snug" style={{ color: '#0B4C8F' }}>
                You can file a complaint with the Swiss FDPIC at edoeb.admin.ch if you believe we mishandled your data.
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
