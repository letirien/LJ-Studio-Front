"use client";

import { useLayoutEffect, useRef } from "react";
import { useLenis } from "lenis/react";

/**
 * Hook pour créer des effets parallax-speed.
 *
 * data-parallax-speed="X"
 * - speed > 1 : l'élément scroll plus VITE (monte plus vite, révèle ce qui est derrière)
 * - speed < 1 : l'élément scroll plus LENTEMENT (reste visible plus longtemps, effet "sticky light")
 * - speed = 1 : comportement normal
 *
 * Pour un effet "reveal" où une section A révèle une section B :
 * - Section A (au-dessus) : data-parallax-speed="1.5" → part plus vite
 * - Section B (en-dessous) : pas de speed, ou speed < 1 pour qu'elle "attende"
 */
export function useParallaxSections() {
  const lenis = useLenis();
  const elementsRef = useRef([]);

  useLayoutEffect(() => {
    if (!lenis) return;

    // Collecter tous les éléments avec data-parallax-speed
    const collectElements = () => {
      const elements = document.querySelectorAll("[data-parallax-speed]");
      elementsRef.current = Array.from(elements).map((el) => {
        const speed = parseFloat(el.dataset.parallaxSpeed) || 1;
        // Reset transform pour mesurer la vraie position
        el.style.transform = "";
        const rect = el.getBoundingClientRect();
        const initialTop = rect.top + lenis.scroll;
        return { el, speed, initialTop, height: rect.height };
      }).filter(item => item.speed !== 1);
    };

    // Calculer et appliquer le parallax
    const updateParallax = () => {
      const scrollY = lenis.scroll;
      const vh = window.innerHeight;

      elementsRef.current.forEach(({ el, speed, initialTop }) => {
        // On calcule le décalage basé sur la distance scrollée depuis que l'élément est "en jeu"
        // L'élément est "en jeu" quand il est visible ou proche du viewport

        // Pour speed > 1 : l'élément doit monter plus vite
        // Pour speed < 1 : l'élément doit monter plus lentement (rester en place plus longtemps)

        // Le point de référence : quand le haut de l'élément est au bas du viewport
        const entryPoint = initialTop - vh;

        // Distance scrollée depuis le point d'entrée
        const scrolledSinceEntry = scrollY - entryPoint;

        // Si on n'a pas encore atteint le point d'entrée, pas de parallax
        if (scrolledSinceEntry < 0) {
          el.style.transform = "translate3d(0, 0, 0)";
          return;
        }

        // Le décalage est proportionnel à la distance scrollée et au facteur (speed - 1)
        // speed = 1.5 → factor = 0.5 → pour chaque 100px scrollés, l'élément bouge de 50px en plus
        // speed = 0.8 → factor = -0.2 → pour chaque 100px scrollés, l'élément bouge de 20px en moins
        const factor = speed - 1;
        const offset = scrolledSinceEntry * factor;

        // Appliquer le décalage (négatif = monte plus vite, positif = monte plus lentement)
        el.style.transform = `translate3d(0, ${-offset}px, 0)`;
      });
    };

    // Initialiser
    const initTimeout = setTimeout(() => {
      collectElements();
      updateParallax();
    }, 100);

    // Écouter le scroll Lenis
    lenis.on("scroll", updateParallax);

    // Recalculer sur resize
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        collectElements();
        updateParallax();
      }, 100);
    };
    window.addEventListener("resize", onResize, { passive: true });

    return () => {
      clearTimeout(initTimeout);
      clearTimeout(resizeTimeout);
      lenis.off("scroll", updateParallax);
      window.removeEventListener("resize", onResize);

      // Reset transforms
      elementsRef.current.forEach(({ el }) => {
        el.style.transform = "";
      });
    };
  }, [lenis]);
}
