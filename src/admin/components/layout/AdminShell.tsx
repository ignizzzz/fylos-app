// The authenticated app frame: fixed sidebar on wide screens, a slide-over
// sidebar on narrow ones, the top utility bar, and the scrollable content area
// where routed pages render.

import { useEffect, useRef, useState } from 'react';
import { Outlet } from 'react-router-dom';
import { tokens, shadows } from '../../theme';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

export function AdminShell() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const drawerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mobileOpen) return;
    drawerRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [mobileOpen]);

  return (
    <div className="flex h-[100dvh] overflow-hidden" style={{ background: tokens.appBg }}>
      {/* Fixed rail on large screens */}
      <div className="hidden lg:block">
        <Sidebar />
      </div>

      {/* Slide-over rail on small screens */}
      {mobileOpen && (
        <>
          <div className="fixed inset-0 z-40 lg:hidden" style={{ background: 'rgba(31,26,23,0.4)' }} onClick={() => setMobileOpen(false)} aria-hidden />
          <div ref={drawerRef} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Navigation" className="fixed inset-y-0 left-0 z-50 lg:hidden outline-none" style={{ boxShadow: shadows.pop }}>
            <Sidebar onNavigate={() => setMobileOpen(false)} />
          </div>
        </>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onOpenSidebar={() => setMobileOpen(true)} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-[1440px] px-4 sm:px-6 py-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
