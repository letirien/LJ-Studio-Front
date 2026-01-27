import '/styles/global.css';
import Head from 'next/head';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';
import CustomCursor from "../components/CustomCursor";
import { LoadingProvider } from '../lib/LoadingManager';

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

function App({ Component, pageProps }) {
  useEffect(() => {
    function update(time) {
      window.lenis?.raf(time * 1000);
    }

    gsap.ticker.add(update);

    return () => {
      gsap.ticker.remove(update);
    };
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
    
  };

  return (
      <>
        <Head>
          <meta name="robots" content="noindex, nofollow" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link href="https://fonts.googleapis.com/css2?family=Roboto+Mono:ital,wght@0,100..700;1,100..700&display=swap" rel="stylesheet" />
        </Head>
        <LoadingProvider>
          <ReactLenis root options={lenisOptions}>
            <AnimatePresence mode="wait" initial={false}>
              <Cursor />
              <Component {...pageProps} />
              <CustomCursor />
            </AnimatePresence>
          </ReactLenis>
        </LoadingProvider>
      </>
  );
}

export default App;