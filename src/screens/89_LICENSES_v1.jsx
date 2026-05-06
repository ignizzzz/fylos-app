import React, { useState, useMemo } from 'react';
import { ChevronLeft, Search, ChevronDown, ExternalLink, Heart } from 'lucide-react';

const THEME = { bg: '#F7F5F2', coral: '#E85D2A', txt: '#111', muted: '#6E6E73', tint: '#FBE7DD' };

const AppHeader = ({ title, onBack }) => (
  <div className="pt-14 pb-3 px-5 flex items-center justify-center relative sticky top-0 z-30" style={{ backgroundColor: 'rgba(247,245,242,0.88)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }}>
    <button onClick={onBack} className="absolute left-5 w-9 h-9 rounded-full bg-white border border-black/[0.06] flex items-center justify-center active:scale-95 transition-all">
      <ChevronLeft size={18} strokeWidth={2.2} color={THEME.txt} />
    </button>
    <h1 className="text-[17px] font-semibold" style={{ color: THEME.txt }}>{title}</h1>
  </div>
);

const PACKAGES = [
  { name: 'React',              version: '18.3.1', license: 'MIT',   author: 'Meta',                  group: 'Core' },
  { name: 'React DOM',          version: '18.3.1', license: 'MIT',   author: 'Meta',                  group: 'Core' },
  { name: 'React Router',       version: '6.22.0', license: 'MIT',   author: 'Remix Software',        group: 'Core' },
  { name: 'Vite',               version: '5.1.4',  license: 'MIT',   author: 'Evan You',              group: 'Tooling' },
  { name: 'Tailwind CSS',       version: '3.4.1',  license: 'MIT',   author: 'Tailwind Labs',         group: 'UI' },
  { name: 'Lucide Icons',       version: '0.344.0',license: 'ISC',   author: 'Lucide Contributors',   group: 'UI' },
  { name: 'Radix UI',           version: '1.0.4',  license: 'MIT',   author: 'WorkOS',                group: 'UI' },
  { name: 'Framer Motion',      version: '11.0.8', license: 'MIT',   author: 'Framer',                group: 'UI' },
  { name: 'date-fns',           version: '3.3.1',  license: 'MIT',   author: 'date-fns contributors', group: 'Utils' },
  { name: 'clsx',               version: '2.1.0',  license: 'MIT',   author: 'Luke Edwards',          group: 'Utils' },
  { name: 'Stripe.js',          version: '3.4.0',  license: 'MIT',   author: 'Stripe',                group: 'Payments' },
];

const LICENSE_TEXT = {
  MIT: 'MIT License\n\nPermission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software…',
  ISC: 'ISC License\n\nPermission to use, copy, modify, and/or distribute this software for any purpose with or without fee is hereby granted, provided that the above copyright notice and this permission notice appear in all copies…',
};

export default function LicensesScreen() {
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(null);
  const back = () => { if (window.history.length > 1) window.history.back(); else window.location.href = '/'; };

  const filtered = useMemo(() => {
    if (!query) return PACKAGES;
    const q = query.toLowerCase();
    return PACKAGES.filter(p => p.name.toLowerCase().includes(q) || p.license.toLowerCase().includes(q));
  }, [query]);

  const grouped = useMemo(() => {
    const map = {};
    filtered.forEach(p => { (map[p.group] ||= []).push(p); });
    return map;
  }, [filtered]);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#EDE8E2', padding: 20, fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif' }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');*,*::before,*::after{box-sizing:border-box;}.lic-scroll::-webkit-scrollbar{display:none;}.lic-scroll{scrollbar-width:none;}`}</style>
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

        <div className="lic-scroll absolute inset-0 overflow-y-auto pb-10">
          <AppHeader title="Licenses" onBack={back} />

          <div className="px-4">
            <div className="bg-white rounded-[18px] p-4 mb-4 border border-black/[0.04] flex items-center gap-3">
              <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ backgroundColor: THEME.tint }}>
                <Heart size={18} color={THEME.coral} strokeWidth={2} fill={THEME.coral} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-[14.5px] font-semibold" style={{ color: THEME.txt }}>Built with open source</div>
                <div className="text-[11.5px]" style={{ color: THEME.muted }}>{PACKAGES.length} packages from amazing communities</div>
              </div>
            </div>

            <div className="flex items-center gap-2 mb-3 px-3.5 py-2.5 rounded-[14px] bg-white border border-black/[0.04]">
              <Search size={15} color={THEME.muted} strokeWidth={2.2} />
              <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search package or license"
                className="flex-1 text-[13.5px] outline-none bg-transparent" style={{ color: THEME.txt }} />
            </div>

            {Object.keys(grouped).map(group => (
              <div key={group} className="mb-4">
                <div className="text-[10.5px] font-semibold uppercase tracking-wider px-2 mb-1.5" style={{ color: THEME.muted }}>{group}</div>
                <div className="bg-white rounded-[16px] border border-black/[0.04] overflow-hidden">
                  {grouped[group].map((p, i) => {
                    const isOpen = open === p.name;
                    return (
                      <div key={p.name} style={{ borderBottom: i < grouped[group].length - 1 ? '1px solid #F1EDE8' : 'none' }}>
                        <button onClick={() => setOpen(isOpen ? null : p.name)}
                          className="w-full flex items-center gap-3 px-3.5 py-3 text-left active:bg-black/[0.03]">
                          <div className="flex-1 min-w-0">
                            <div className="text-[14px] font-semibold truncate" style={{ color: THEME.txt }}>{p.name} <span className="text-[11px] font-medium" style={{ color: THEME.muted }}>{p.version}</span></div>
                            <div className="text-[11.5px] truncate" style={{ color: THEME.muted }}>{p.author}</div>
                          </div>
                          <span className="text-[10.5px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: THEME.tint, color: THEME.coral }}>{p.license}</span>
                          <ChevronDown size={14} color="#CFCFD4" className="transition-transform" style={{ transform: isOpen ? 'rotate(180deg)' : 'none' }} />
                        </button>
                        {isOpen && (
                          <div className="px-3.5 pb-3 pt-0 border-t border-[#F1EDE8] bg-[#FAFAFA]">
                            <pre className="text-[11px] whitespace-pre-wrap leading-relaxed mt-3" style={{ color: THEME.muted, fontFamily: 'ui-monospace, SFMono-Regular, monospace' }}>
                              {LICENSE_TEXT[p.license] || 'License text available at the project repository.'}
                            </pre>
                            <button className="flex items-center gap-1 mt-2 text-[11.5px] font-semibold" style={{ color: THEME.coral }}>
                              View on GitHub <ExternalLink size={11} strokeWidth={2.2} />
                            </button>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}

            <p className="text-[11.5px] text-center mt-2 px-4 leading-snug" style={{ color: THEME.muted }}>
              Thank you to everyone who maintains these projects.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
