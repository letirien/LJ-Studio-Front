'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '../../lib/LoadingManager';
import PixelatedLogo from './PixelatedLogo';
import RoundedIcon from '../RoundedIcon';

export default function AnimationPage({ onAnimationComplete }) {
  const { progress, isComplete } = useLoading();

  const [textVisible, setTextVisible] = useState({ line1: false, line2: false, line3: false });
  const [textDisappear, setTextDisappear] = useState(false);
  const [blocksDisappear, setBlocksDisappear] = useState(false);
  const [blocks2Disappear, setBlocks2Disappear] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [loaderTextVisible, setLoaderTextVisible] = useState(false);
  const [fontsReady, setFontsReady] = useState(false);

  const [roundedVisible, setRoundedVisible] = useState(false);
  const [roundedDisappear, setRoundedDisappear] = useState(false);

  // Attendre que les fonts soient chargées avant d'afficher le texte
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let mounted = true;
    let fallbackTimeout;

    const markFontsReady = () => {
      if (mounted && !fontsReady) {
        setFontsReady(true);
      }
    };

    const checkFonts = async () => {
      try {
        // Attendre que les fonts soient chargées
        if (document.fonts && document.fonts.ready) {
          // Race entre fonts.ready et un timeout de 500ms
          await Promise.race([
            document.fonts.ready,
            new Promise(resolve => setTimeout(resolve, 500))
          ]);
          // Petit délai supplémentaire pour iOS
          await new Promise(resolve => setTimeout(resolve, 50));
        }
        markFontsReady();
      } catch (e) {
        // Fallback si l'API fonts n'est pas supportée
        markFontsReady();
      }
    };

    // Fallback timeout absolu au cas où tout échoue
    fallbackTimeout = setTimeout(markFontsReady, 800);

    checkFonts();

    return () => {
      mounted = false;
      clearTimeout(fallbackTimeout);
    };
  }, []);

  // Apparition des textes du loader une fois les fonts prêtes
  useEffect(() => {
    if (!fontsReady) return;

    const timer = setTimeout(() => {
      setLoaderTextVisible(true);
    }, 100);
    return () => clearTimeout(timer);
  }, [fontsReady]);

  // Apparition progressive du texte au fur et à mesure du chargement
  useEffect(() => {
    if (progress >= 20 && !textVisible.line1) {
      setTextVisible((prev) => ({ ...prev, line1: true }));
    }
    if (progress >= 40 && !textVisible.line2) {
      setTextVisible((prev) => ({ ...prev, line2: true }));
    }
    if (progress >= 60 && !textVisible.line3) {
      setTextVisible((prev) => ({ ...prev, line3: true }));
    }
    setRoundedVisible(true)
  }, [progress, textVisible]);

  // Quand le chargement est complet (100%), lancer l'animation de sortie
  useEffect(() => {
    if (isComplete && !animationStarted) {
      setAnimationStarted(true);

      // Animation de sortie
      const exitTimeline = async () => {
        // Étape 1: Disparition du loader (SVG avec effet pixel)
        setTimeout(() => setLoaderVisible(false), 1800);

        // Étape 2: Disparition du texte
        setTimeout(() => setTextDisappear(true), 2450);
        setTimeout(() => setRoundedDisappear(true), 2450);

        // Étape 3: Disparition des blocs avec animation
        setTimeout(() => setBlocksDisappear(true), 2200);
        setTimeout(() => setBlocks2Disappear(true), 2600);

        // Étape 4: Signaler que l'animation est terminée
        setTimeout(() => {
          onAnimationComplete();
        }, 3600);
      };

      exitTimeline();
    }
  }, [isComplete, animationStarted, onAnimationComplete]);

  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden z-50">
      {/* Blocs orange animés (premier set - plus clair, au-dessus) */}
      <div className="absolute inset-0 z-20">
        {/* Bloc 1 - Gauche */}
        <div
          className={`absolute top-0 left-0 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocksDisappear ? '-translate-y-full' : ''
          } after:content-[''] after:absolute after:inset-0 after:bg-[#fa6218] after:transform after:origin-bottom after:transition-all after:duration-1000 after:ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocksDisappear ? 'after:-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocksDisappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
            }}
          />
        </div>

        {/* Bloc 2 - Centre */}
        <div
          className={`absolute top-0 left-1/3 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocksDisappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '100ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocksDisappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
              transitionDelay: '100ms',
            }}
          />
        </div>

        {/* Bloc 3 - Droite */}
        <div
          className={`absolute top-0 right-0 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocksDisappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '200ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocksDisappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
              transitionDelay: '200ms',
            }}
          />
        </div>
      </div>

      {/* Blocs orange animés (deuxième set - plus foncé, en-dessous) */}
      <div className="absolute inset-0 z-10">
        {/* Bloc 1 - Gauche */}
        <div
          className={`absolute top-0 left-0 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          } after:content-[''] after:absolute after:inset-0 after:bg-[#c74d11] after:transform after:origin-bottom after:transition-all after:duration-1000 after:ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocks2Disappear ? 'after:-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocks2Disappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
            }}
          />
        </div>

        {/* Bloc 2 - Centre */}
        <div
          className={`absolute top-0 left-1/3 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '100ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocks2Disappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
              transitionDelay: '100ms',
            }}
          />
        </div>

        {/* Bloc 3 - Droite */}
        <div
          className={`absolute top-0 right-0 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '200ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
              blocks2Disappear ? '-translate-y-full' : ''
            }`}
            style={{
              clipPath: 'polygon(0 100%, 100% 100%, 100% 0)',
              transformOrigin: 'bottom center',
              transitionDelay: '200ms',
            }}
          />
        </div>
      </div>

      {/* Contenu texte - SOLUTION 1: Chaque mot dans son propre conteneur overflow-hidden */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center space-y-4 px-8 relative">
          {/* CREATIVE STUDIO / Logo / FRENCH ACCENT - au dessus du titre */}
          <div className={`absolute bottom-full left-0 right-0 mb-8 transition-all duration-500`}>
            <div className="flex items-center justify-center space-x-6 sm:space-x-8 text-sm text-black sm:whitespace-nowrap">
              {/* CREATIVE STUDIO avec overflow-hidden */}
              <div className="">
                <span
                  className={`inline-block robotoRegular text-[12pt] sm:text-[14pt] text-center leading-[0.8] transform transition-all duration-700 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${
                    !loaderTextVisible ? 'translate-y-full opacity-0' : !loaderVisible ? '-translate-y-[600%] opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: !loaderTextVisible ? '0ms' : !loaderVisible ? '0ms' : '200ms' }}
                >
                  CREATIVE STUDIO
                </span>
              </div>

              {/* Logo LED/Pixel avec animation et overflow-hidden */}
              <div className="overflow-visible shrink-0">
                <div
                  className={`transform transition-all duration-700 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${
                    !loaderTextVisible ? 'translate-y-full opacity-0' : !loaderVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: !loaderTextVisible ? '0ms' : !loaderVisible ? '50ms' : '300ms' }}
                >
                  <PixelatedLogo animationStarted={animationStarted} />
                </div>
              </div>

              {/* FRENCH ACCENT avec overflow-hidden */}
              <div className="">
                <span
                  className={`inline-block robotoRegular text-[12pt] sm:text-[14pt] text-center leading-[0.8] transform transition-all duration-700 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${
                    !loaderTextVisible ? 'translate-y-full opacity-0' : !loaderVisible ? '-translate-y-[600%] opacity-0' : 'translate-y-0 opacity-100'
                  }`}
                  style={{ transitionDelay: !loaderTextVisible ? '0ms' : !loaderVisible ? '0ms' : '200ms' }}
                >
                  FRENCH ACCENT
                </span>
              </div>
            </div>
          </div>

          <h1 className="hardbopBlack leading-[0.8]">
            {/* Ligne 1 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black  transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line1 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[2deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '0ms' : '0ms' }}
                >
                  WELCOME
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line1 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[2deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '50ms' : '100ms' }}
                >
                  TO
                </span>
              </div>
            </div>

            {/* Ligne 2 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line2 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[1deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '100ms' : '0ms' }}
                >
                  OUR
                </span>
              </div>
              <div className="relative">
                {/* Texte (reste overflow-hidden pour l'anim) */}
                <div className="overflow-hidden">
                  <span
                    className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                      textVisible.line2 && !textDisappear
                        ? 'translate-y-0'
                        : textDisappear
                        ? '-translate-y-full'
                        : 'translate-y-full rotate-[1deg]'
                    }`}
                    style={{ transitionDelay: textDisappear ? '150ms' : '120ms' }}
                  >
                    PITCH
                  </span>
                </div>

                {/* Icône ancrée au mot, mais hors overflow */}
                <div
                  className="absolute left-1/2 top-full z-30 pointer-events-none"
                  style={{
                    transform: `translateX(-50%) translateY(-50%) scale(${roundedVisible && !roundedDisappear ? 1 : 0})`,
                    transformOrigin: 'center center',
                    transition: 'transform 0.4s cubic-bezier(0.12,0,0.88,1)',
                  }}
                >
                  <RoundedIcon icon="intro" size={90} circularContinue color="white" />
                </div>
              </div>
            </div>
          </h1>
        </div>

        {/* KickOff Loading - positionné par rapport au viewport */}
        <div className={`absolute bottom-[4vh] left-0 right-0 transition-all duration-500 text-black`}>
          <div className='flex items-center justify-center space-x-2'>
            {/* KickOff Loading avec overflow-hidden */}
            <div className="overflow-hidden">
              <p
                className={`instrumentSerifRegular text-[6vw] sm:text-[32px] transform transition-all duration-700 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${
                  !loaderTextVisible ? 'translate-y-full opacity-0' : !loaderVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                }`}
                style={{ transitionDelay: !loaderTextVisible ? '0ms' : !loaderVisible ? '100ms' : '450ms' }}
              >
                KickOff Loading |
              </p>
            </div>
            {/* Pourcentage avec overflow-hidden */}
            <div className="overflow-hidden">
              <div
                className={`transform transition-all duration-700 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${
                  !loaderTextVisible ? 'translate-y-full opacity-0' : !loaderVisible ? '-translate-y-full opacity-0' : 'translate-y-0 opacity-100'
                }`}
                style={{ transitionDelay: !loaderTextVisible ? '0ms' : !loaderVisible ? '150ms' : '500ms' }}
              >
                <span className="text-[6vw] sm:text-[32px] instrumentSerifRegular tabular-nums">
                  {progress}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}