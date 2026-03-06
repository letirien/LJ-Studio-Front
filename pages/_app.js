import '/styles/global.css';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis, useLenis } from 'lenis/react';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/router';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import CustomCursor from "../components/CustomCursor";
import { LoadingProvider } from '../lib/LoadingManager';
import { GoogleAnalytics } from '@next/third-parties/google';
import CookieBanner from '../components/CookieConsent';
import { SiteReadyProvider } from '../lib/SiteReadyContext';

const Cursor = dynamic(() => import('../components/Cursor'), {
  ssr: false
});

// Enregistre ScrollTrigger côté client uniquement
if (typeof window !== 'undefined') {
  // import dynamique pour éviter SSR des modules ESM
  import('gsap/dist/ScrollTrigger').then((mod) => {
    const ScrollTrigger = mod.ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);
  }).catch(() => {});
}

// Gère la variable CSS --app-height = window.innerHeight (hauteur visible réelle).
// Résout le problème classique Safari/Chrome mobile où les barres du navigateur
// (barre d'adresse Safari en bas, barre Chrome en haut) modifient innerHeight
// et invalident toutes les mesures GSAP/ScrollTrigger.
// On utilise visualViewport si disponible (plus précis) et on debounce
// pour éviter les refreshes en cascade pendant l'animation des barres.
function ViewportHeightSync() {
  useEffect(() => {
    let rafId = null;
    let debounceTimer = null;

    const updateHeight = () => {
      // window.innerHeight = hauteur visible réelle (exclut les barres)
      document.documentElement.style.setProperty(
        '--app-height',
        `${window.innerHeight}px`
      );
    };

    const onResize = () => {
      // Annule la mise à jour immédiate via RAF
      if (rafId) cancelAnimationFrame(rafId);
      // Débounce de 120ms : les barres du navigateur animent sur ~100ms
      // → on attend la fin de l'animation avant de déclencher le refresh GSAP
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        rafId = requestAnimationFrame(updateHeight);
      }, 120);
    };

    // Mise à jour initiale immédiate
    updateHeight();

    // visualViewport est plus précis que window.resize sur mobile Safari
    // Il se déclenche quand les barres du browser changent la zone visible
    if (window.visualViewport) {
      window.visualViewport.addEventListener('resize', onResize);
    }
    // Fallback pour les navigateurs sans visualViewport
    window.addEventListener('resize', onResize);

    return () => {
      clearTimeout(debounceTimer);
      if (rafId) cancelAnimationFrame(rafId);
      if (window.visualViewport) {
        window.visualViewport.removeEventListener('resize', onResize);
      }
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return null;
}

// Synchronise Lenis avec le ticker GSAP pour que toutes les animations
// (ScrollTrigger, tweens) s'exécutent dans le même RAF que le scroll.
// Doit être monté à l'intérieur du ReactLenis pour avoir accès au contexte.
function LenisGSAPSync() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;

    const update = (time) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    // Empêche GSAP de sauter des frames sur mobile (très important sur Safari)
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}

function App({ Component, pageProps }) {
  const router = useRouter();
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);

  const handleConsentChange = useCallback((accepted) => {
    setAnalyticsEnabled(accepted);
  }, []);

  const lenisOptions = {
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    direction: 'vertical',
    gestureDirection: 'vertical',
    smooth: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 0.7,
    // autoRaf: false → Lenis ne gère plus son propre RAF.
    // C'est le ticker GSAP (via LenisGSAPSync) qui l'entraîne,
    // garantissant que scroll + animations GSAP sont dans le même tick.
    autoRaf: false,
  };

  return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>
        {analyticsEnabled && <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />}
        <SiteReadyProvider>
          <CookieBanner onConsentChange={handleConsentChange} />
          <LoadingProvider>
            <ReactLenis root options={lenisOptions}>
              <ViewportHeightSync />
              <LenisGSAPSync />
              <Cursor key="cursor" />
              <AnimatePresence mode="wait" initial={false}>
                <Component key={router.asPath} {...pageProps} />
              </AnimatePresence>
              <CustomCursor key="custom-cursor" />
            </ReactLenis>
          </LoadingProvider>
        </SiteReadyProvider>
      </>
  );
}

export default App;
