import { useState, useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import gsap from 'gsap';
import Projects from './ProjectSlider.js';
import { useScrollTrigger } from '../../lib/useScrollTrigger.js';
import Image from "next/image";
import RoundedIcon from '../RoundedIcon.js';

export default function ProjectSection({ projects, home }) {
  const sectionRef = useRef(null);
  const scrollWrapperRef = useRef(null);
  const sliderNavRef = useRef(null);
  const slideMainContainer = useRef(null);
  const titleRef = useRef(null);
  const preTitleRef = useRef(null);
  const titleLine1Ref = useRef(null);
  const titleLine2Ref = useRef(null);
  const colorBlockRef = useRef(null);
  const orangeBgRef = useRef(null);
  const roundedIconRef = useRef(null);

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

  useEffect(() => {
    if (!isReady || !ScrollTrigger || !lenis) return;
    if (!sectionRef.current || !titleLine1Ref.current || !titleLine2Ref.current || !colorBlockRef.current || !slideMainContainer.current || !orangeBgRef.current)
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
        scrub: true, // Pas de smoothing pour éviter les sauts de transition
        pin: sectionRef.current, // section fixe
        pinSpacing: true, // Désactive le spacing pour éviter les sauts
        anticipatePin: 1,
        markers: false,
        invalidateOnRefresh: true, // Force le recalcul des valeurs
      },
    });

    tl.to(
      titleRef.current, 
      { 
        // opacity: 0, 
        y: -60,         // ease: 'power2.inOut'
        duration: 0.4
      }, 
      0
    );
    tl.to(
      roundedIconRef.current, 
      { 
        // opacity: 0, 
        y: -60,         // ease: 'power2.inOut'
        duration: 0.4
      }, 
      0
    );
    tl.to(
      preTitleRef.current, 
      { 
        opacity: 0, 
        y: isMobile ? 60 : 120,         // ease: 'power2.inOut'
        duration: 0.6,
        delay: isMobile ? 0.4 : 0.2
      }, 
      0
    );


    // TITRE LIGNE 1 : chaque mot disparaît vers le bas avec décalage
    if (titleLine1Ref.current) {
      const words1 = gsap.utils.toArray(titleLine1Ref.current.children);
      words1.forEach((word, i) => {
        tl.to(
          word,
          {
            y: '120%',
            // opacity: 0,
            ease: 'power2.in',
            duration: 0.4
          },
          i * 0.02 // Décalage de 0.02s entre chaque mot
        );
      });
    }

    // TITRE LIGNE 2 : disparaît vers le bas légèrement après la ligne 1
    if (titleLine2Ref.current) {
      tl.to(
        titleLine2Ref.current,
        {
          y: '120%',
          // opacity: 0,
          ease: 'power2.in',
          duration: 0.4
        },
        0 // Démarre 0.08s après le début (après quelques mots de la ligne 1)
      );
    }

    // FOND ORANGE : réduction fluide de 100vh à 50vh (0 → 40%)
    tl.to(
      orangeBgRef.current,
      {
        height: '50vh',
        ease: "linear",
        duration: 1
      },
      0
    );

    // BLOC DE COULEUR : apparition douce (30% → 50%)
    tl.fromTo(
      colorBlockRef.current,
      { y: "-100%", opacity: 1 },
      {
        y: "0%",
        opacity: 1,
        ease: 'linear',
        duration: 0.45
      },
      0.35
    );

    // SLIDER : animation fluide du bas vers le centre (15% → 100%)
    tl.fromTo(
      slideMainContainer.current,
      {
        y: '100vh',
        // opacity: 0
      },
      {
        y: isMobile ? '15vh' : '0vh',
        // opacity: 1,
        ease: 'linear',
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
        id="work"
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
          className="absolute inset-x-0 top-0 h-1/2 pointer-events-none overflow-hidden z-[2]"
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
              const imageAlt = imageObj?.alt || 'Project Overlay Image';

              if (!imageUrl) return null;
              return (
                <Image
                  src={imageUrl}
                  alt={imageAlt}
                  fill={true}
                  style={{ objectFit: 'cover', opacity: 0.5, filter: 'blur(10px)' }}
                  unoptimized={true}
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
        <div className="relative w-full mx-auto px-[3vw]">
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <div className="mb-8 ">
              <p ref={preTitleRef} className={`capitalize text-black instrumentSerifRegular text-[8vw]/[0.8] tracking-tight sm:opacity-90 sm:text-[4vw]/[0.8]`}>Pitch Vision</p>
            </div>
            <h2 ref={titleRef} className="bigH2 text-center">
              <div className="overflow-hidden">
                <div ref={titleLine1Ref} className="flex justify-center gap-2 md:gap-12">
                  <span>highlights</span>
                  <span>from</span>
                </div>
              </div>
              <div className="overflow-hidden">
                <p ref={titleLine2Ref}>our recent games</p>
              </div>
            </h2>
            <div className="mt-12">
              <Image src={"/images/LJSTD_WORDMARK.svg"} alt="LJ Studio wordmark" width={200} height={24}/>
            </div>
          </div>

          <div
            ref={slideMainContainer}
            className="slider-container relative !z-[4]"
            style={{ transform: 'translateY(100vh)'}}
          >
            <Projects
              projects={projects}
              navRef={sliderNavRef}
              onSlideChange={handleSlideChange} // 🔥 Restaure le changement de couleur
            />
          </div>
          
        </div>
        <div ref={roundedIconRef} className='absolute inset-0 flex items-center justify-center'>
            <RoundedIcon size={isMobile ? 90 : 120} color="black"/>
        </div>
      </section>
    </div>
  );
}
