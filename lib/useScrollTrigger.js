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
    const init = async () => {
      if (typeof window === 'undefined') return;

      // ✅ Charger et enregistrer ScrollTrigger une seule fois
      if (!isRegistered) {
        try {
          const mod = await import('gsap/dist/ScrollTrigger');
          ScrollTriggerInstance = mod.ScrollTrigger;
          gsap.registerPlugin(ScrollTriggerInstance);
          isRegistered = true;
        } catch (error) {
          console.error('❌ Erreur chargement ScrollTrigger:', error);
          return;
        }
      }

      // ✅ Synchroniser avec Lenis une seule fois
      if (lenis && ScrollTriggerInstance && !lenisListenerRef.current) {
        lenis.on('scroll', ScrollTriggerInstance.update);
        lenisListenerRef.current = true;
      }

      setIsReady(true);
    };

    init();

    return () => {
      // Ne pas détacher le listener Lenis car d'autres composants peuvent l'utiliser
    };
  }, [lenis]);

  return { ScrollTrigger: ScrollTriggerInstance, isReady };
}