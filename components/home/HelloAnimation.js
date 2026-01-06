'use client';

import { useEffect, useState } from 'react';
import { useLoading } from '../../lib/LoadingManager';

export default function AnimationPage({ onAnimationComplete }) {
  const { progress, isComplete } = useLoading();

  const [textVisible, setTextVisible] = useState({ line1: false, line2: false, line3: false });
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [textDisappear, setTextDisappear] = useState(false);
  const [blocksDisappear, setBlocksDisappear] = useState(false);
  const [blocks2Disappear, setBlocks2Disappear] = useState(false);
  const [animationStarted, setAnimationStarted] = useState(false);

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
  }, [progress, textVisible]);

  // Quand le chargement est complet (100%), lancer l'animation de sortie
  useEffect(() => {
    if (isComplete && !animationStarted) {
      setAnimationStarted(true);

      // Animation de sortie
      const exitTimeline = async () => {
        // Étape 1: Disparition du loader (pourcentage)
        setTimeout(() => setLoaderVisible(false), 1800);

        // Étape 2: Disparition du texte
        setTimeout(() => setTextDisappear(true), 2450);

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
        <div className="text-center space-y-4 px-8">
          <h1 className="hardbopBlack leading-[0.8]">
            {/* Ligne 1 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line1 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[2deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '0ms' : '0ms' }}
                >
                  TURNING
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
                  SPORT
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
                  PASSION
                </span>
              </div>
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
                  INTO
                </span>
              </div>
            </div>

            {/* Ligne 3 */}
            <div className="flex flex-wrap items-center justify-center gap-x-4">
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line3 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[0.5deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '80ms' : '0ms' }}
                >
                  ARTISTIC
                </span>
              </div>
              <div className="overflow-hidden">
                <span
                  className={`inline-block text-[22vw] md:text-[180pt] font-black text-black transform transition-all duration-500 ease-[ cubic-bezier(0.12, 0, 0.88, 1)] ${
                    textVisible.line3 && !textDisappear
                      ? 'translate-y-0'
                      : textDisappear
                      ? '-translate-y-full'
                      : 'translate-y-full rotate-[0.5deg]'
                  }`}
                  style={{ transitionDelay: textDisappear ? '200ms' : '140ms' }}
                >
                  EXPRESSION
                </span>
              </div>
            </div>
          </h1>

          {/* Loader et texte en bas */}
          <div
            className={`mt-16 transition-all duration-500 ${
              loaderVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center justify-center space-x-8 text-sm text-black">
              <span className='robotoRegular text-[12pt] sm:text-[19pt] text-center leading-[0.8]'>CREATIVE STUDIO</span>
              <div className="flex items-center space-x-2">
                <span className="text-[12vw] sm:text-[92pt] hardbopBlack font-bold tabular-nums">
                  {progress}%
                </span>
              </div>
              <span className='robotoRegular text-[12pt] sm:text-[19pt] text-center leading-[0.8]'>FRENCH ACCENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}