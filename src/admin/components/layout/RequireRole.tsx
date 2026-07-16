// Route/page guard. Renders the access-denied state when the signed-in role is
// below the required level, otherwise renders the protected content.

import type { ReactNode } from 'react';
import { useAuth } from '../../context/AuthContext';
import { AccessDenied } from '../states';
import type { AdminRole } from '../../types';

export function RequireRole({ role, children }: { role: AdminRole; children: ReactNode }) {
  const { can, role: current } = useAuth();
  if (!can(role)) return <AccessDenied required={role} current={current} />;
  return <>{children}</>;
}
