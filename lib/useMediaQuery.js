import { useState, useEffect } from 'react';

/**
 * Custom hook pour les media queries - élimine 10+ useEffect répétés
 * 
 * @param {string} query - Media query string (ex: '(max-width: 768px)')
 * @returns {boolean} - True si la query match
 * 
 * Usage:
 * const isMobile = useMediaQuery('(max-width: 768px)');
 * const isLandscape = useMediaQuery('(orientation: landscape)');
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Éviter les erreurs côté serveur
    if (typeof window === 'undefined') return;

    const mql = window.matchMedia(query);
    
    // État initial
    setMatches(mql.matches);

    // Listener pour les changements
    const handler = (e) => setMatches(e.matches);
    mql.addEventListener('change', handler);

    return () => mql.removeEventListener('change', handler);
  }, [query]);

  return matches;
}

/**
 * Hook pour détecter si c'est un appareil tactile
 * Remplace les checks manuels `'ontouchstart' in window`
 */
export function useTouchDevice() {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    setIsTouchDevice(isTouch);
  }, []);

  return isTouchDevice;
}

/**
 * Hook pour responsive breakpoints nommés
 * ✅ Plus lisible que des magic numbers
 */
export function useResponsive() {
  const isMobile = useMediaQuery('(max-width: 640px)');
  const isTablet = useMediaQuery('(max-width: 1024px) and (min-width: 641px)');
  const isDesktop = useMediaQuery('(min-width: 1025px)');
  const isLandscape = useMediaQuery('(orientation: landscape)');

  return { isMobile, isTablet, isDesktop, isLandscape };
}
