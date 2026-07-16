// The top utility bar: mobile menu button, a session-expiry hint, and the
// account menu (role switch + demo session-expiry + sign out). Role switching
// and forced expiry are how the access-denied and session-expired states are
// exercised.

import { useEffect, useState } from 'react';
import { Menu as MenuIcon, ChevronDown, Clock, LogOut, ShieldAlert, UserCog } from 'lucide-react';
import { tokens } from '../../theme';
import { Avatar, Badge } from '../ui';
import { Menu } from '../ui/overlays';
import { useAuth } from '../../context/AuthContext';
import { ROLE_LABEL } from '../../types';
import type { AdminRole } from '../../types';

const ROLES: AdminRole[] = ['owner', 'admin', 'manager', 'viewer'];

function timeLeftLabel(expiresAt: string): string {
  const ms = Date.parse(expiresAt) - Date.now();
  if (ms <= 0) return 'expired';
  const mins = Math.round(ms / 60000);
  if (mins >= 60) return `${Math.round(mins / 60)}h left`;
  return `${mins}m left`;
}

export function Topbar({ onOpenSidebar }: { onOpenSidebar: () => void }) {
  const { session, role, setRole, expireNow, signOut } = useAuth();
  const [, force] = useState(0);

  // Tick so the "time left" hint stays roughly current.
  useEffect(() => {
    const id = window.setInterval(() => force((n) => n + 1), 30_000);
    return () => window.clearInterval(id);
  }, []);

  if (!session) return null;
  const user = session.user;

  return (
    <header
      className="h-16 shrink-0 flex items-center gap-3 px-5 border-b"
      style={{ background: tokens.appBg, borderColor: tokens.border }}
    >
      <button
        onClick={onOpenSidebar}
        aria-label="Open menu"
        className="lg:hidden inline-flex items-center justify-center w-9 h-9 rounded-[10px]"
        style={{ color: tokens.ink2, border: `1px solid ${tokens.border}` }}
      >
        <MenuIcon size={18} />
      </button>

      <div className="flex-1" />

      <span className="hidden sm:inline-flex items-center gap-1.5 text-[12px]" style={{ color: tokens.ink3 }}>
        <Clock size={13} /> Session {timeLeftLabel(session.expiresAt)}
      </span>

      {role && <Badge tone="neutral">{ROLE_LABEL[role]}</Badge>}

      <Menu
        width={220}
        align="right"
        trigger={({ toggle, open }) => (
          <button
            onClick={toggle}
            className="inline-flex items-center gap-2 h-9 pl-1 pr-2 rounded-[10px] transition-colors"
            style={{ border: `1px solid ${open ? tokens.borderStrong : 'transparent'}`, background: open ? tokens.surfaceAlt : 'transparent' }}
          >
            <Avatar name={user.name} color={user.avatarColor} size={26} />
            <span className="hidden sm:block text-[13px] font-semibold max-w-[140px] truncate" style={{ color: tokens.ink }}>{user.name}</span>
            <ChevronDown size={14} style={{ color: tokens.ink3 }} />
          </button>
        )}
        items={[
          { label: `${user.email}`, disabled: true },
          'separator',
          { label: 'Switch role (demo)', disabled: true, icon: <UserCog size={14} /> },
          ...ROLES.map((r) => ({
            label: ROLE_LABEL[r],
            checked: role === r,
            onClick: () => setRole(r),
          })),
          'separator',
          { label: 'Expire session (demo)', icon: <ShieldAlert size={14} />, onClick: expireNow },
          { label: 'Sign out', icon: <LogOut size={14} />, danger: true, onClick: () => void signOut() },
        ]}
      />
    </header>
  );
}
