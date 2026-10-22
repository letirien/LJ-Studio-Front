import Head from 'next/head';
import styles from './layout.module.scss';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import AnimateText from '../lib/animation/animationText';
import dynamic from 'next/dynamic';
import Footer from './footer';
import AnimationPage from './home/HelloAnimation';
import { useState, useEffect } from 'react';
import { useSiteReady } from '../lib/SiteReadyContext';
import { useLoading } from '../lib/LoadingManager';
import { useLenis } from 'lenis/react';
import { useRouter } from 'next/router';
import gsap from 'gsap';

// Importer dynamiquement le Clock sans rendu côté serveur
const Clock = dynamic(() => import('../components/clock').then(mod => mod.Clock), {
  ssr: false,
});

export default function Layout({ children, home, skipIntro = false }) {
  const [animationComplete, setAnimationComplete] = useState(skipIntro);
  const { setSiteReady } = useSiteReady();
  const lenis = useLenis();
  const router = useRouter();
  const {
    setDataLoaded,
    setWebGLProgress,
    setPageImagesProgress,
    setEffectsReady,
    setRefsReady,
  } = useLoading();

  useEffect(() => {
    if (skipIntro) {
      setSiteReady(true);
      return;
    }
    if (home) {
      if (lenis) {
        lenis.scrollTo(0, { immediate: true, force: true });
      } else {
        window.scrollTo(0, 0);
      }
      return;
    }

    setDataLoaded();
    setWebGLProgress(1, 1);
    setPageImagesProgress(1, 1);
    setEffectsReady();
    setRefsReady();
  }, [
    skipIntro,
    home,
    lenis,
    setSiteReady,
    setDataLoaded,
    setWebGLProgress,
    setPageImagesProgress,
    setEffectsReady,
    setRefsReady,
  ]);

  useEffect(() => {
    if (!animationComplete || !home) return;

    const hash = router.asPath.split('#')[1];
    if (!hash) return undefined;

    let sectionId;
    try {
      sectionId = decodeURIComponent(hash);
    } catch (error) {
      console.error('Unable to decode navigation hash:', error);
      return undefined;
    }

    let cancelled = false;
    let frameId;

    const scheduleScroll = async () => {
      let ScrollTrigger;
      try {
        ({ ScrollTrigger } = await import('gsap/dist/ScrollTrigger'));
        gsap.registerPlugin(ScrollTrigger);
      } catch (error) {
        console.error('Unable to refresh scroll positions before anchor navigation:', error);
      }

      if (cancelled) return;
      ScrollTrigger?.refresh();
      lenis?.resize();

      frameId = requestAnimationFrame(() => {
        if (cancelled) return;
        const section = document.getElementById(sectionId);
        if (!section) return;

        if (lenis) {
          lenis.start();
          lenis.scrollTo(section, { duration: 1.5, force: true });
        } else {
          section.scrollIntoView({ behavior: 'smooth' });
        }
      });
    };

    scheduleScroll();

    return () => {
      cancelled = true;
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, [animationComplete, home, lenis, router.asPath]);

  const handleAnimationComplete = () => {
    setAnimationComplete(true);
    setSiteReady(true);
  };

  return (
    <div className={`relative ${!animationComplete ? 'h-screen overflow-hidden' : ''}`}>
      <Head>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="relative">
        <main className="relative">
          {/* Contenu principal — au-dessus du footer fixe */}
          <div className="content-above-footer relative z-10">
            {children}
          </div>
        </main>
        <section id="contact">
          <Footer />
        </section>

        {/* Animation d'introduction par-dessus */}
        {!animationComplete && (
          <AnimationPage onAnimationComplete={handleAnimationComplete} />
        )}
      </div>
    </div>
  );
}