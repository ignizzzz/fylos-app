// Dependency injection for the service layer. The app reads services through
// this context, so tests (or a future HTTP backend) can supply a different
// AdminServices implementation without touching any component.

import { createContext, useContext } from 'react';
import type { ReactNode } from 'react';
import { services as defaultServices } from '../services';
import type { AdminServices } from '../services';

const ServicesContext = createContext<AdminServices>(defaultServices);

export function ServicesProvider({
  services = defaultServices,
  children,
}: {
  services?: AdminServices;
  children: ReactNode;
}) {
  return <ServicesContext.Provider value={services}>{children}</ServicesContext.Provider>;
}

export function useServices(): AdminServices {
  return useContext(ServicesContext);
}
