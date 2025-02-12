import '../styles/global.css';
import { AnimatePresence } from 'framer-motion';
import { ReactLenis } from 'lenis/react';
import { useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';

const Cursor = dynamic(() => import('../components/Cursor'), {
  ssr: false
});

gsap.registerPlugin(ScrollTrigger);

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
    touchMultiplier: 2
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