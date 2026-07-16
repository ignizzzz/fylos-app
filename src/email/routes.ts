// Single source of truth for the email surface's URLs. The whole module mounts
// under BASE in src/App.jsx; change BASE here to move it.
export const BASE = '/newsletter'

export const paths = {
  home: BASE,

  // Public subscriber flows (token defaults to each flow's demo token).
  confirm: (token = 'tok-confirm') => `${BASE}/confirm?token=${token}`,
  preferences: (token = 'tok-manage') => `${BASE}/preferences?token=${token}`,
  unsubscribe: (token = 'tok-unsub') => `${BASE}/unsubscribe?token=${token}`,
  resubscribe: (token = 'tok-resub') => `${BASE}/resubscribe?token=${token}`,
  expired: () => `${BASE}/expired`,

  // Admin console.
  admin: `${BASE}/admin`,
  campaigns: `${BASE}/admin/campaigns`,
  campaign: (id: string) => `${BASE}/admin/campaigns/${id}`,
  campaignEdit: (id: string) => `${BASE}/admin/campaigns/${id}/edit`,
  campaignAudience: (id: string) => `${BASE}/admin/campaigns/${id}/audience`,
  campaignPreview: (id: string) => `${BASE}/admin/campaigns/${id}/preview`,
  subscribers: `${BASE}/admin/subscribers`,
  suppression: `${BASE}/admin/suppression`,
} as const
