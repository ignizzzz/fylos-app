// The left navigation rail. Role-gated items are hidden when the current role
// cannot reach them. On wide screens it is fixed; on narrow screens the shell
// renders it inside a slide-over.

import { NavLink } from 'react-router-dom';
import { tokens, fonts } from '../../theme';
import { NAV_GROUPS } from '../../nav';
import { useAuth } from '../../context/AuthContext';
import { roleAllows } from '../../types';

export function Sidebar({ onNavigate }: { onNavigate?: () => void }) {
  const { role } = useAuth();

  return (
    <nav
      className="flex flex-col h-full w-[236px] shrink-0"
      style={{ background: tokens.sidebarBg, borderRight: `1px solid ${tokens.border}` }}
    >
      <div className="px-5 h-16 flex items-center gap-2.5 shrink-0">
        <span
          className="inline-flex items-center justify-center w-8 h-8 rounded-[9px] font-extrabold text-white text-[16px]"
          style={{ background: tokens.coral, boxShadow: '0 2px 8px rgba(232,93,42,0.28)' }}
        >
          F
        </span>
        <div className="leading-none">
          <div className="text-[22px]" style={{ color: tokens.ink, fontFamily: fonts.display, letterSpacing: '0.01em' }}>Fylos</div>
          <div className="text-[9.5px] font-bold uppercase tracking-[0.16em] mt-0.5" style={{ color: tokens.ink3 }}>Growth Admin</div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-1.5 no-scrollbar">
        {NAV_GROUPS.map((group) => {
          const items = group.items.filter((it) => !it.requiredRole || (role && roleAllows(role, it.requiredRole)));
          if (items.length === 0) return null;
          return (
            <div key={group.label} className="mb-5">
              <div className="px-2.5 mb-1.5 text-[10px] font-bold uppercase tracking-[0.11em]" style={{ color: tokens.ink3 }}>
                {group.label}
              </div>
              {items.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.end}
                    onClick={onNavigate}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-2.5 h-9 rounded-[10px] mb-0.5 text-[13.5px] transition-all duration-150 ${isActive ? 'bg-[#FBEEE7]' : 'hover:bg-[#EDE4D6]'}`
                    }
                    style={({ isActive }) => ({
                      color: isActive ? tokens.coral : tokens.ink2,
                      fontWeight: isActive ? 650 : 500,
                    })}
                  >
                    {({ isActive }) => (
                      <>
                        <Icon size={17} strokeWidth={isActive ? 2.3 : 1.9} />
                        <span>{item.label}</span>
                      </>
                    )}
                  </NavLink>
                );
              })}
            </div>
          );
        })}
      </div>

      <div className="px-5 py-3.5 text-[10.5px] leading-snug shrink-0" style={{ color: tokens.ink3, borderTop: `1px solid ${tokens.border}` }}>
        Private tool. Mock data, no live backend.
      </div>
    </nav>
  );
}
