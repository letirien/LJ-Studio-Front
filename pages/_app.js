import '/styles/global.css';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import dynamic from 'next/dynamic';

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
    <ReactLenis root options={lenisOptions}>
      <AnimatePresence mode="wait" initial={false}>
      <Cursor />
      <Component {...pageProps} />
      </AnimatePresence>
    </ReactLenis>
  );
}

export default App;