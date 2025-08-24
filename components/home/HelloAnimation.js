'use client';

import { useEffect, useState } from 'react';

export default function AnimationPage({ onAnimationComplete }) {
  const [textVisible, setTextVisible] = useState({ line1: false, line2: false, line3: false });
  const [loaderVisible, setLoaderVisible] = useState(true);
  const [textDisappear, setTextDisappear] = useState(false);
  const [blocksDisappear, setBlocksDisappear] = useState(false);
  const [blocks2Disappear, setBlocks2Disappear] = useState(false);

  useEffect(() => {
    const timeline = async () => {
      // Étape 1: Apparition du texte ligne par ligne
      setTimeout(() => setTextVisible((prev) => ({ ...prev, line1: true })), 400);
      setTimeout(() => setTextVisible((prev) => ({ ...prev, line2: true })), 700);
      setTimeout(() => setTextVisible((prev) => ({ ...prev, line3: true })), 1000);

      // Étape 2: Disparition du loader
      setTimeout(() => setLoaderVisible(false), 1800);

      // Étape 3: Disparition du texte
      setTimeout(() => setTextDisappear(true), 2450);

      // Étape 4: Disparition des blocs avec animation
      setTimeout(() => setBlocksDisappear(true), 2200);
      setTimeout(() => setBlocks2Disappear(true), 2600);

      // Étape 5: Signaler que l'animation est terminée
      setTimeout(() => {
        onAnimationComplete();
      }, 3600);
    };

    timeline();
  }, [onAnimationComplete]);

  return (
    <div className="absolute inset-0 w-screen h-screen overflow-hidden z-50">
      {/* Blocs orange animés (premier set - plus clair, au-dessus) */}
      <div className="absolute inset-0 z-20">
        {/* Bloc 1 - Gauche */}
        <div
          className={`absolute top-0 left-0 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocksDisappear ? '-translate-y-full' : ''
          } after:content-[''] after:absolute after:inset-0 after:bg-[#fa6218] after:transform after:origin-bottom after:transition-all after:duration-1000 after:ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocksDisappear ? 'after:-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
          className={`absolute top-0 left-1/3 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocksDisappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '100ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
          className={`absolute top-0 right-0 w-1/3 h-full bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocksDisappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '200ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#fa6218] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
          className={`absolute top-0 left-0 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          } after:content-[''] after:absolute after:inset-0 after:bg-[#c74d11] after:transform after:origin-bottom after:transition-all after:duration-1000 after:ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocks2Disappear ? 'after:-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
          className={`absolute top-0 left-1/3 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '100ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
          className={`absolute top-0 right-0 w-1/3 h-full bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
            blocks2Disappear ? '-translate-y-full' : ''
          }`}
          style={{ transformOrigin: 'bottom center', transitionDelay: '200ms' }}
        >
          <div
            className={`absolute inset-0 bg-[#c74d11] transform origin-bottom transition-all duration-1000 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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

      {/* Contenu texte */}
      <div className="absolute inset-0 flex items-center justify-center z-30">
        <div className="text-center space-y-4 px-8">
          <h1 className="hardbopBlack leading-[0.8]">
            {/* Ligne 1 */}
            <div className="overflow-hidden">
              <p className="text-[22vw] md:text-[180pt] font-black text-black">
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
                <span className="inline-block w-4"></span>
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
              </p>
            </div>

            {/* Ligne 2 */}
            <div className="overflow-hidden">
              <p className="text-[22vw] md:text-[180pt] font-black text-black">
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
                <span className="inline-block w-4"></span>
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
              </p>
            </div>

            {/* Ligne 3 */}
            <div className="overflow-hidden">
              <p className="text-[22vw] md:text-[180pt] font-black text-black">
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
                <span className="inline-block w-4"></span>
                <span
                  className={`inline-block transform transition-all duration-500 ease-[ cubic-bezier(0.95, 0.05, 0.795, 0.035)] ${
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
              </p>
            </div>
          </h1>

          {/* Loader et texte en bas */}
          <div
            className={`mt-16 transition-all duration-500 ${
              loaderVisible ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <div className="flex items-center justify-center space-x-8 text-sm text-black">
              <span className='robotoRegular text-[19pt]'>CREATIVE STUDIO</span>
              <div className="flex items-center space-x-2">
                <span className="text-[92pt] hardbopBlack font-bold">100%</span>
              </div>
              <span className='robotoRegular text-[19pt]'>FRENCH ACCENT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}