import { useState, useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import Projects from './ProjectSlider.js';
import { useScrollTrigger } from '../../lib/useScrollTrigger.js';
import Image from "next/image";

export default function ProjectSection({ projects, home }) {
  const sectionRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const sliderNavRef = useRef(null);
  const slideMainContainer = useRef(null);
  const titleRef = useRef(null);
  const colorBlockRef = useRef(null);
  const orangeBgRef = useRef(null);

  const [colorBlocks, setColorBlocks] = useState([]);
  const lenis = useLenis();
  const { ScrollTrigger, isReady } = useScrollTrigger();

  const [isMobile, setIsMobile] = useState(false);
    


  const defaultColor = '#FA6218';

  // Init premier bloc couleur
  useEffect(() => {
    const firstColor = projects?.[0]?.fields?.['#hexa'] || defaultColor;
    setColorBlocks([{ id: Date.now(), color: firstColor, entering: false, initial: true, projectIndex: 0 }]);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, [projects]);

  // Gestion du changement de slide (couleur)
  const handleSlideChange = (index) => {
    const nextColor = projects?.[index]?.fields?.['#hexa'] || defaultColor;

    setColorBlocks((prev) => {
      const updated = prev.map((b) => ({ ...b, entering: false, initial: false }));
      return [
        ...updated,
        { id: Date.now(), color: nextColor, entering: true, initial: false, projectIndex: index },
      ];
    });
  };

  // todo: animation interlignagne un peu avant quand on rentre dans la section
  useEffect(() => {
    if (!isReady || !ScrollTrigger || !lenis) return;
    if (!sectionRef.current || !titleRef.current || !colorBlockRef.current || !slideMainContainer.current || !orangeBgRef.current)
      return;

    const updateLenis = (opts) => {
      try {
        if (typeof lenis?.updateOptions === 'function') lenis.updateOptions(opts);
        else if (lenis && lenis.options) Object.assign(lenis.options, opts);
      } catch (err) {
        console.warn('Lenis update error', err);
      }
    };

    // updateLenis({ wheelMultiplier: 0.25, lerp: 0.06 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: scrollWrapperRef.current, // wrapper long
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        pin: sectionRef.current, // section fixe
        pinSpacing: true,
        anticipatePin: 1,
        markers: false,
      },
    });

    // TITRE : disparaît progressivement (0 → 15%)
    tl.to(
      titleRef.current, 
      { 
        opacity: 0, 
        y: -80, 
        scale: 0.85, 
        // ease: 'power2.inOut',
        duration: 0.4
      }, 
      0
    );

    // FOND ORANGE : réduction fluide de 100vh à 50vh (10% → 35%)
    tl.to(
      orangeBgRef.current,
      {
        height: '50vh',
        // ease: "power2.out",
        // duration: 0.6
        duration: 1
      },
      0
    );

    // BLOC DE COULEUR : apparition douce (30% → 40%)
    tl.fromTo(
      colorBlockRef.current, 
      { y: "-100%", opacity: 1 }, 
      {  
        y: "0%",
        opacity: 1,
        ease: 'easeOut',
        duration: 0.45
      }, 
      0.35
    );

    // SLIDER : animation fluide du bas vers le centre (20% → 100%)
    tl.fromTo(
      slideMainContainer.current,
      { 
        y: '100vh',
        opacity: 0 
      },
      { 
        y: isMobile ? '15vh' : '0vh',
        opacity: 1, 
        ease: 'none',
        // duration: 0.6
        duration: 1
      },
      0
    );



    gsap.delayedCall(0, ScrollTrigger.refresh);

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach((t) => t.kill());
      // updateLenis({ wheelMultiplier: 1, lerp: 0.25 });
    };
  }, [isReady, ScrollTrigger, lenis, projects]);

  return (
    <div ref={scrollWrapperRef} className="relative min-h-[150vh]">
      <section
        ref={sectionRef}
        className="bg-half-col relative overflow-hidden h-screen flex items-center justify-center"
      >
        {/* FOND ORANGE */}
        <div
          ref={orangeBgRef}
          className="absolute inset-x-0 top-0 pointer-events-none z-[0]"
          style={{ height: '100vh', backgroundColor: defaultColor }}
        />

        {/* BLOCS COULEUR */}
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
                backgroundColor: "black",
                zIndex: i + 1,
                transform: block.initial
                  ? 'translateY(0%)'
                  : block.entering
                  ? 'translateY(0%)'
                  : 'translateY(0%)',
                animation: block.initial
                  ? 'none'
                  : block.entering
                  ? 'slideUp 0.8s ease-out forwards'
                  : 'none',
              }}
              
            > 
            {/* Use block.projectIndex instead of using the loop index to retrieve the correct project */}
            {(() => {
              const projIndex = typeof block.projectIndex === 'number' ? block.projectIndex : i || 0;
              const imageObj = projects?.[projIndex]?.fields?.Image?.[0];
              const imageUrl = imageObj?.url;
              const imageAlt = imageObj?.alt || 'overlay';

              if (!imageUrl) return null;
              return (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill={true}
                  style={{ objectFit: 'cover', opacity: 0.5, filter: 'blur(10px)' }}
                />
              );
            })()}            </div>
          ))}
        </div>

        <style jsx>{`
          @keyframes slideUp {
            from {
              opacity: 0%;
            }
            to {
              opacity: 100%;
            }
          }
        `}</style>

        {/* CONTENU */}
        <div className="relative w-full mx-auto px-[3vw] z-[2]">
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <h2 ref={titleRef} className="bigH2 text-center">
              <p className="flex justify-center gap-2 md:gap-12">
                <span className={`${home.catHighlight} !text-black text-[3vw] sm:text-[1.5vw]`}>Pitch</span>
                highlights of
                <span className={`${home.catHighlight} !text-black text-[3vw] sm:text-[1.5vw]`}>Vison</span>
              </p>
              <p>our recent games</p>
            </h2>
          </div>

          <div
            ref={slideMainContainer}
            className="slider-container relative z-[2]"
            style={{ transform: 'translateY(100vh)', opacity: 0 }}
          >
            <Projects
              projects={projects}
              navRef={sliderNavRef}
              onSlideChange={handleSlideChange} // 🔥 Restaure le changement de couleur
            />
          </div>
        </div>
      </section>
    </div>
  );
}
