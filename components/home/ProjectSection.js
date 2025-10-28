import { useState, useRef, useEffect } from 'react';
import { useLenis } from 'lenis/react';
import Projects from './ProjectSlider.js';

export default function ProjectSection({ projects, home }) {
  const sectionRef = useRef(null);
  const sliderNavRef = useRef(null);
  const slideMainContainer = useRef(null);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [colorBlocks, setColorBlocks] = useState([]);
  const [resetToDefault, setResetToDefault] = useState(false);
  const [isSnapping, setIsSnapping] = useState(false);

  const lenis = useLenis(); // ✅ Hook pour accéder à l'instance Lenis
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
      const newBlock = {
        id: Date.now(),
        color,
        entering: true,
      };

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

  // --- Gestion du scroll / snap avec Lenis ---
  useEffect(() => {
    if (!lenis) return; // ⚠️ attendre que l'instance Lenis soit prête

    const handleScroll = () => {
      if (!sectionRef.current || !slideMainContainer.current || isSnapping) return;

      const rect = sectionRef.current.getBoundingClientRect();

      // --- Reset si on sort vers le haut ---
      if (rect.top > window.innerHeight * 0.1) {
        if (!resetToDefault) setResetToDefault(true);
      } else {
        if (resetToDefault) {
          setResetToDefault(false);
          setIsSnapping(true);

          requestAnimationFrame(() => {
            const slider = slideMainContainer.current;
            const viewportHeight = window.innerHeight;

            // --- 1. Position du slider SANS translateY(-25vh) ---
            const sliderTopWithTransform = slider.getBoundingClientRect().top + window.scrollY;
            const transformOffsetVh = -25; // ← ta valeur actuelle
            const transformOffsetPx = (transformOffsetVh / 100) * viewportHeight;

            // Position "virtuelle" comme si translateY(0)
            const sliderTopWithoutTransform = sliderTopWithTransform + transformOffsetPx;

            // --- 2. Hauteur du slider ---
            const sliderHeight = slider.offsetHeight;

            // --- 3. Centrage vertical ---
            const availableSpace = viewportHeight - sliderHeight;
            const offsetToCenter = availableSpace > 0 ? availableSpace / 2 : 0;

            // --- 4. Scroll cible ---
            let targetScroll = sliderTopWithoutTransform - offsetToCenter;

            // --- 5. Clamp ---
            const maxScroll = document.body.scrollHeight - viewportHeight;
            targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

            // --- 6. Scroll avec Lenis ---
            lenis.scrollTo(targetScroll, {
              duration: 0.8,
              easing: (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t),
              onComplete: () => setIsSnapping(false),
            });
          });

          setTimeout(() => setIsSnapping(false), 1100);
        }
      }
    };

    lenis.on('scroll', handleScroll);
    handleScroll(); // trigger initial

    return () => lenis.off('scroll', handleScroll);
  }, [lenis, resetToDefault, isSnapping]);

  return (
    <section
      className="bg-half-col py-42 relative overflow-hidden"
      ref={sectionRef}
    >
      {/* Bloc de couleur animé */}
      <div
        className="absolute inset-x-0 top-0 bottom-[50%] pointer-events-none overflow-hidden z-[1] transition-opacity duration-300"
        style={{ opacity: resetToDefault ? 0 : 1 }}
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

      <div className="mx-auto px-[3vw] relative">
        {/* === TITRE === */}
        <h2
          className="bigH2 relative z-0 transition-all duration-700 ease-in-out"
          style={{
            opacity: resetToDefault ? 1 : 0,
            transform: resetToDefault ? 'translateY(0)' : 'translateY(-20px)',
          }}
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
          className="slider-container relative z-[2] transition-transform duration-700 ease-in-out"
          style={{
            transform: resetToDefault ? 'translateY(0)' : 'translateY(-25vh)',
          }}
        >
          <Projects
            projects={projects}
            navRef={sliderNavRef}
            onSlideChange={(index) => sectionRef.current?.onSlideChange?.(index)}
          />
        </div>
      </div>
    </section>
  );
}
