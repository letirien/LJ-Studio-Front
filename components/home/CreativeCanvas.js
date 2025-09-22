import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const preloadImages = (images) => {
  return Promise.all(
    images.map(img =>
      new Promise(resolve => {
        const image = new window.Image();
        image.src = img.fields.IMAGE[0].url;
        image.onload = resolve;
        image.onerror = resolve;
      })
    )
  );
};

const CreativeCanvas = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [randomPositions, setRandomPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const controls = useAnimation();
  const velocityRef = useRef(0);
  const momentumRef = useRef(null);

  // Pour l'effet visuel de velocity
  const velocityVisualRef = useRef(0);
  const [velocityVisual, setVelocityVisual] = useState(0);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const [inViewRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
    rootMargin: '0px 0px 0px 0px'
  });

  useEffect(() => {
    if (images && images.length > 0) {
      const positions = images.map(() => Math.random() * 200 - 70);
      setRandomPositions(positions);
    }
  }, [images]);

  useEffect(() => {
    if (images && images.length > 0) {
      preloadImages(images).then(() => setIsLoaded(true));
    }
  }, [images]);

useEffect(() => {
    let Draggable, gsap;
    let draggableInstance;
    let ctx;
    const initDraggable = async () => {
      const gsapModule = await import('gsap');
      const DraggableModule = await import('gsap/Draggable');
      gsap = gsapModule.gsap;
      Draggable = DraggableModule.Draggable;
      gsap.registerPlugin(Draggable);

      let lastScrollLeft = 0;
      let lastTime = 0;

      ctx = gsap.context(() => {
        if (scrollContainerRef.current) {
          draggableInstance = Draggable.create(scrollContainerRef.current, {
            type: "scrollLeft",
            edgeResistance: 0.85,
            inertia: false,
            allowNativeTouchScrolling: false,
            cursor: "grab",
            onDragStart: function() {
              setIsDragging(true);
              this.target.style.cursor = "grabbing";
              controls.start({ scale: 0.98, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" });
              lastScrollLeft = this.scrollLeft;
              lastTime = Date.now();
              if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
            },
            onDrag: function() {
              const now = Date.now();
              const dt = now - lastTime;
              if (dt > 0) {
                velocityRef.current = (this.scrollLeft - lastScrollLeft) / dt;
                lastScrollLeft = this.scrollLeft;
                lastTime = now;
              }
            },
            onDragEnd: function() {
              setIsDragging(false);
              this.target.style.cursor = "grab";
              controls.start({
                scale: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: { type: "spring", stiffness: 300, damping: 20 }
              });

              // Momentum: continue le scroll selon la velocity
              let momentum = velocityRef.current * 30; // facteur pour ressentir la vitesse
              let currentScroll = this.scrollLeft;

              function step() {
                if (Math.abs(momentum) > 0.1) {
                  currentScroll += momentum;
                  // Clamp scroll
                  currentScroll = Math.max(0, Math.min(currentScroll, scrollContainerRef.current.scrollWidth - scrollContainerRef.current.clientWidth));
                  scrollContainerRef.current.scrollLeft = currentScroll;
                  momentum *= 0.95; // friction, plus proche de 1 = plus long
                  momentumRef.current = requestAnimationFrame(step);
                }
              }
              step();
            }
          })[0];
        }
      }, scrollContainerRef);

      return () => {
        if (draggableInstance) draggableInstance.kill();
        if (ctx) ctx.revert();
      };
    };

    initDraggable();
    return () => {
      if (ctx) ctx.revert();
    };
  }, [isLoaded, controls]);

  return (
    <section ref={containerRef} className="bg-black text-white py-24">
      <div ref={inViewRef}>
        <motion.div className="max-w-none">
          <motion.div
            ref={scrollContainerRef}
            className="relative overflow-x-auto"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x',
              WebkitOverflowScrolling: 'touch',
              userSelect: 'none'
            }}
            animate={controls}
            initial={{ scale: 1, boxShadow: "0 2px 8px rgba(0,0,0,0.08)" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <motion.div
              style={{
                x: velocityVisual // translation X selon la vitesse
              }}
              transition={{ type: "spring", stiffness: 200, damping: 30 }}
            >
              <div className="flex gap-3 py-8" style={{ minWidth: 'max-content' }}>
                {isLoaded && images && images.map((image, index) => (
                  <motion.div
                    key={image.id}
                    className="relative flex-shrink-0 group"
                    initial={{
                      y: randomPositions[index] || 0
                    }}
                    animate={{
                      y: inView ? 0 : (randomPositions[index] || 0)
                    }}
                    transition={{
                      duration: 0.4,
                      delay: index * 0.02,
                      ease: "easeInOut"
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className={`relative w-full rounded-lg`} style={{
                      width: !isMobile ? `${image.fields.IMAGE[0].width / 2}px` : `${image.fields.IMAGE[0].width / 4}px`,
                      height: !isMobile ? `${image.fields.IMAGE[0].height / 2}px` : `${image.fields.IMAGE[0].height / 4}px`
                    }}>
                      <Image
                        src={image.fields.IMAGE[0].url}
                        alt={image.fields.Name}
                        fill
                        className={`transition-all duration-300 cover ${
                          hoveredIndex === index
                            ? 'filter-none'
                            : 'filter grayscale brightness-75'
                        }`}
                        style={{
                          objectFit: 'contain',
                          filter: hoveredIndex === index
                            ? 'none'
                            : 'grayscale(100%) brightness(0.75) sepia(0.1) hue-rotate(200deg)'
                        }}
                      />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      </div>
                    </div>
                  </motion.div>
                ))}
                {!isLoaded && (
                  <div className="w-full flex items-center justify-center text-lg text-gray-400">Chargement...</div>
                )}
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        .overflow-x-auto {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
          touch-action: pan-x;
        }
      `}</style>
    </section>
  );
};

export default CreativeCanvas;