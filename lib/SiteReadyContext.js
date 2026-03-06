import { createContext, useContext, useState } from 'react';

const SiteReadyContext = createContext(null);

export function SiteReadyProvider({ children }) {
  const [siteReady, setSiteReady] = useState(false);
  return (
    <SiteReadyContext.Provider value={{ siteReady, setSiteReady }}>
      {children}
    </SiteReadyContext.Provider>
  );
}

export function useSiteReady() {
  return useContext(SiteReadyContext);
}
