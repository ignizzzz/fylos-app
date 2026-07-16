// Navigation model for the admin: grouped sections, each item with its route,
// icon, and the minimum role required to see it (drives the access-denied path).

import {
  LayoutDashboard, Sparkles, Users, Building2, GitBranch, Inbox, LineChart,
  CheckSquare, CalendarClock, StickyNote, Tag as TagIcon, Radio,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { AdminRole } from './types';

export interface NavItem {
  to: string;
  label: string;
  icon: LucideIcon;
  /** Minimum role to access; absent means everyone signed in. */
  requiredRole?: AdminRole;
  /** True to match the route exactly (used for the index route). */
  end?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Overview',
    items: [{ to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true }],
  },
  {
    label: 'Records',
    items: [
      { to: '/admin/leads', label: 'Leads', icon: Sparkles },
      { to: '/admin/contacts', label: 'Contacts', icon: Users },
      { to: '/admin/companies', label: 'Companies', icon: Building2 },
      { to: '/admin/pipeline', label: 'Sales pipeline', icon: GitBranch },
    ],
  },
  {
    label: 'Inbound',
    items: [
      { to: '/admin/submissions', label: 'Form submissions', icon: Inbox, requiredRole: 'manager' },
      { to: '/admin/attribution', label: 'UTM attribution', icon: LineChart, requiredRole: 'manager' },
    ],
  },
  {
    label: 'Work',
    items: [
      { to: '/admin/tasks', label: 'Tasks', icon: CheckSquare },
      { to: '/admin/follow-ups', label: 'Follow ups', icon: CalendarClock },
      { to: '/admin/notes', label: 'Notes', icon: StickyNote },
    ],
  },
  {
    label: 'Taxonomy',
    items: [
      { to: '/admin/tags', label: 'Tags', icon: TagIcon },
      { to: '/admin/sources', label: 'Lead sources', icon: Radio },
    ],
  },
];

export const ALL_NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((g) => g.items);
