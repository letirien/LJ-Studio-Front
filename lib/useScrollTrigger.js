// hooks/useScrollTrigger.js
import { useEffect, useState, useRef } from 'react';
import gsap from 'gsap';
import { useLenis } from 'lenis/react';

let ScrollTriggerInstance = null;
let isRegistered = false;

export function useScrollTrigger() {
  const [isReady, setIsReady] = useState(false);
  const lenis = useLenis();
  const lenisListenerRef = useRef(false);

  useEffect(() => {
    if (typeof window === 'undefined') {
      console.warn('useScrollTrigger — pas de window (ssr)');
      return;
    }

    const init = async () => {
      if (!isRegistered) {
        try {
          const mod = await import('gsap/dist/ScrollTrigger');
          ScrollTriggerInstance = mod.ScrollTrigger;
          gsap.registerPlugin(ScrollTriggerInstance);
          isRegistered = true;
        } catch (error) {
          console.error('useScrollTrigger — erreur chargement ScrollTrigger:', error);
          return;
        }
      }

      setIsReady(true);
    };

    init();
  }, []);

  useEffect(() => {
    if (!isRegistered || !ScrollTriggerInstance || !lenis) {
      return;
    }

    // ✅ Une seule mise à jour par frame via lenis.on('scroll')
    // Pas besoin de gsap.ticker car Lenis gère déjà le RAF
    if (!lenisListenerRef.current) {
      try {
        if (typeof lenis?.on === 'function') {
          lenis.on('scroll', ScrollTriggerInstance.update);
          lenisListenerRef.current = true;
        }
      } catch (err) {
        console.warn('useScrollTrigger — impossible d\'attacher lenis listener', err);
      }
    }

    // Initial refresh
    try {
      ScrollTriggerInstance.refresh();
    } catch (e) {
      console.warn('useScrollTrigger — refresh failed', e);
    }

    return () => {
      try {
        if (lenisListenerRef.current && typeof lenis?.off === 'function') {
          lenis.off('scroll', ScrollTriggerInstance.update);
          lenisListenerRef.current = false;
        }
      } catch (e) {}
    };
  }, [lenis, isReady]);

  return { ScrollTrigger: ScrollTriggerInstance, isReady };
}