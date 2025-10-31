import { useState, useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import Projects from './ProjectSlider.js';
import { useScrollTrigger } from '../../lib/useScrollTrigger.js';

export default function ProjectSection({ projects, home }) {
  const sectionRef = useRef(null);
  const sliderNavRef = useRef(null);
  const slideMainContainer = useRef(null);
  const titleRef = useRef(null);
  const colorBlockRef = useRef(null);
  const contentRef = useRef(null);
  const orangeBgRef = useRef(null);

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [colorBlocks, setColorBlocks] = useState([]);
  
  const lenis = useLenis();
  const { ScrollTrigger, isReady } = useScrollTrigger();

  const defaultColor = '#FA6218';

  // --- Bloc initial de couleur ---
  useEffect(() => {
    const firstColor = projects[0]?.fields?.['#hexa'] || defaultColor;
    setColorBlocks([
      {
        id: Date.now(),
        color: firstColor,
        entering: false,
        initial: true,
      },
    ]);
  }, [projects]);

  // --- Gérer le changement de slide ---
  useEffect(() => {
    const handleSlideChange = (newIndex) => {
      const color = projects[newIndex]?.fields?.['#hexa'] || defaultColor;
      const newBlock = { id: Date.now(), color, entering: true };
      setColorBlocks((prev) => [...prev, newBlock]);
      setCurrentSlideIndex(newIndex);

      setTimeout(() => {
        setColorBlocks((prev) => [prev[prev.length - 1]]);
      }, 800);
    };

    if (sectionRef.current) {
      sectionRef.current.onSlideChange = handleSlideChange;
    }
  }, [projects]);

  useEffect(() => {
    if (!isReady || !ScrollTrigger) return;
    if (!sectionRef.current || !titleRef.current || !colorBlockRef.current || !slideMainContainer.current || !orangeBgRef.current) {
      return;
    }

    gsap.delayedCall(0.1, () => {
      if (ScrollTrigger) ScrollTrigger.refresh();
    });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=300vh',
        scrub: 1,
        pin: contentRef.current,
        anticipatePin: 1,
        markers: false,
        id: 'project-section',
      },
    });

    // TITRE : disparaît progressivement (0 → 15%)
    tl.to(
      titleRef.current, 
      { 
        opacity: 0, 
        y: -100, 
        scale: 0.85, 
        ease: 'power2.inOut',
        duration: 0.2
      }, 
      0
    );

    // FOND ORANGE : réduction fluide de 100vh à 50vh (10% → 35%)
    tl.to(
      orangeBgRef.current,
      {
        height: '50vh',
        ease: "power2.out",
        duration: 0.6
      },
      0.2
    );

    // BLOC DE COULEUR : apparition douce (30% → 40%)
    tl.fromTo(
      colorBlockRef.current, 
      { opacity: 0 }, 
      { 
        opacity: 1, 
        ease: 'power2.out',
      }, 
      0.4
    );

    // SLIDER : animation fluide du bas vers le centre (20% → 100%)
    tl.fromTo(
      slideMainContainer.current,
      { 
        y: '100vh',
        opacity: 0 
      },
      { 
        y: '0vh',
        opacity: 1, 
        ease: 'none',
        duration: 0.6
      },
      0.2
    );

    return () => {
      tl.kill();
      if (tl.scrollTrigger) {
        tl.scrollTrigger.kill();
      }
    };
  }, [isReady, ScrollTrigger, lenis, projects]);

  return (
    <section
      className="bg-half-col relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Fond orange initial - 100vh au début */}
      <div
        ref={orangeBgRef}
        className="absolute inset-x-0 top-0 pointer-events-none z-[0]"
        style={{ 
          height: '100vh',
          backgroundColor: defaultColor
        }}
      />

      {/* Bloc de couleur animé - 50% hauteur en haut */}
      <div
        ref={colorBlockRef}
        className="absolute inset-x-0 top-0 h-1/2 pointer-events-none overflow-hidden z-[0]"
        style={{ opacity: 0 }}
      >
        {colorBlocks.map((block, i) => (
          <div
            key={block.id}
            className="absolute inset-x-0 h-full"
            style={{
              backgroundColor: block.color,
              zIndex: i + 1,
              transform:
                block.initial
                  ? 'translateY(0%)'
                  : block.entering
                  ? 'translateY(100%)'
                  : 'translateY(0%)',
              animation: block.initial
                ? 'none'
                : block.entering
                ? 'slideUp 0.8s ease-out forwards'
                : 'none',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes slideUp {
          from {
            transform: translateY(100%);
          }
          to {
            transform: translateY(0%);
          }
        }
      `}</style>

      {/* Contenu pinné */}
      <div 
        ref={contentRef} 
        className="relative min-h-screen flex items-center justify-center"
      >
        <div className="w-full mx-auto px-[3vw]">
          {/* === TITRE === */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[2]">
            <h2
              ref={titleRef}
              className="bigH2"
            >
              <p className="flex justify-center gap-2 md:gap-12">
                <span className={`${home.catHighlight} !text-black`}>Pitch</span>
                highlights of
                <span className={`${home.catHighlight} !text-black`}>Vison</span>
              </p>
              <p>our recent games</p>
            </h2>
          </div>

          {/* === SLIDER === */}
          <div
            ref={slideMainContainer}
            className="slider-container relative z-[2]"
            style={{ 
              transform: 'translateY(100vh)',
              opacity: 0 
            }}
          >
            <Projects
              projects={projects}
              navRef={sliderNavRef}
              onSlideChange={(index) => sectionRef.current?.onSlideChange?.(index)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}