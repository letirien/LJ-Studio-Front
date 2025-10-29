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

  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [colorBlocks, setColorBlocks] = useState([]);
  
  const lenis = useLenis();
  const { ScrollTrigger, isReady } = useScrollTrigger(); // ✅ Utiliser le hook

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
      }, 300);
    };

    if (sectionRef.current) {
      sectionRef.current.onSlideChange = handleSlideChange;
    }
  }, [projects]);

useEffect(() => {
    // ✅ Attendre que ScrollTrigger soit prêt
    if (!isReady || !ScrollTrigger) return;
    if (!sectionRef.current || !titleRef.current || !colorBlockRef.current || !slideMainContainer.current) {
      return;
    }

    // Sécuriser l'appel à refresh
    gsap.delayedCall(0.1, () => {
      if (ScrollTrigger) ScrollTrigger.refresh();
    });

    // Créer la timeline principale
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top top',
        end: '+=400vh',
        scrub: 1.5,
        pin: contentRef.current,
        anticipatePin: 1,
        markers: false,
        id: 'project-section', // ✅ Ajouter un ID pour debug
      },
    });

    tl.to(titleRef.current, { opacity: 0, y: -30, scale: 0.8, ease: 'power2.in' }, 0);

    tl.fromTo(colorBlockRef.current, { opacity: 0 }, { opacity: 1, ease: 'power2.out' }, 0.15);

    tl.fromTo(
      slideMainContainer.current,
      { y: '50vh', opacity: 0 },
      { y: '-50vh', opacity: 1, ease: 'power2.out' },
      0.3
    );

    tl.call(() => {
      if (!slideMainContainer.current || !lenis) return;
      
      const rect = slideMainContainer.current.getBoundingClientRect();
      const targetScroll =
        rect.top + window.scrollY - window.innerHeight / 2 + rect.height / 2;

      lenis.scrollTo(targetScroll, {
        duration: 1,
        easing: (t) => 1 - Math.pow(1 - t, 3),
      });
    }, null, 0.6);

    // Cleanup
    return () => {
      tl.kill();
      // ✅ Tuer uniquement le ScrollTrigger de cette timeline
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
      {/* Bloc de couleur animé - EN DEHORS du padding */}
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

      <div ref={contentRef} className="relative min-h-screen pt-42 pb-0">
        <div className="mx-auto px-[3vw] relative min-h-screen flex flex-col justify-center">
          {/* === TITRE === */}
          <h2
            ref={titleRef}
            className="bigH2 relative z-[1]"
            style={{ opacity: 1 }}
          >
            <p className="flex justify-center gap-2 md:gap-12">
              <span className={`${home.catHighlight} !text-black`}>Pitch</span>
              highlights of
              <span className={`${home.catHighlight} !text-black`}>Vison</span>
            </p>
            <p>our recent games</p>
          </h2>

          {/* === SLIDER === */}
          <div
            ref={slideMainContainer}
            className="slider-container relative z-[2]"
            style={{ 
              transform: 'translateY(50vh)',
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