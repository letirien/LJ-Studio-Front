import { useEffect, useRef } from 'react';

/**
 * Custom hook pour l'autoplay avec pause au hover
 * Remplace le pattern "flag relay" dans WebGLImageTransition.js
 * 
 * Problème éliminé:
 * - Pas de setState -> render -> useEffect -> setState chains
 * - Logique claire et centralisée
 * - Facile à tester et déboguer
 * 
 * @param {Function} callback - Fonction à appelée chaque tick (ex: next())
 * @param {number} delay - Délai entre chaque tick en ms
 * @param {boolean} isEnabled - Si autoplay est activé
 * @param {boolean} isPaused - Si le curseur est au-dessus (ref.current)
 * 
 * Usage:
 * const autoplayRef = useRef(false);
 * useAutoplay(() => next(), 5000, autoplay, autoplayRef.current);
 */
export function useAutoplay(callback, delay = 5000, isEnabled = true, isPaused = false) {
  const timerRef = useRef(null);

  useEffect(() => {
    if (!isEnabled || isPaused) {
      // Nettoyer le timer si disabled ou paused
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
      return;
    }

    // Lancer la boucle d'autoplay
    const tick = () => {
      callback();
      timerRef.current = setTimeout(tick, delay);
    };

    timerRef.current = setTimeout(tick, delay);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [isEnabled, isPaused, delay, callback]);

  // Optionnel: exposer la cancel pour contrôle manuel
  return {
    stop: () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    }
  };
}

/**
 * Hook pour les timeouts qui se nettoient automatiquement
 * Remplace les `const [state, setState]` + `useEffect` avec setTimeout
 * 
 * Usage:
 * useTimeout(() => setLogoVisible(true), 3100);
 */
export function useTimeout(callback, delay) {
  const savedCallback = useRef(callback);

  // Mettre à jour la ref si callback change
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay !== null && delay !== undefined) {
      const timer = setTimeout(() => savedCallback.current(), delay);
      return () => clearTimeout(timer);
    }
  }, [delay]);
}

/**
 * Hook pour les intervals (ex: clock)
 * Remplace les useEffect avec setInterval
 * 
 * Usage:
 * useInterval(() => setCurrentTime(new Date()), 1000);
 */
export function useInterval(callback, delay) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delay === null) return;

    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}
