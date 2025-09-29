// Hooks React et libs d'animation/observateur
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CreativeCanvas = ({ images }) => {
  // Etats d'UI
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [randomPositions, setRandomPositions] = useState([]);
  const [isMobile, setIsMobile] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Pour suivre le chargement individuel des images
  const [loadedImages, setLoadedImages] = useState({});

  // Refs principaux et contrôles d'animation
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const controls = useAnimation();
  const velocityRef = useRef(0);
  const momentumRef = useRef(null);

  // Pour l'effet visuel de velocity
  const velocityVisualRef = useRef(0);
  const [velocityVisual, setVelocityVisual] = useState(0);
  const isTouchRef = useRef(false);

  // Détection responsive (mobile en-dessous de 768px)
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Déclenche les animations d'entrée quand la section est visible
  const [inViewRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
    rootMargin: '0px 0px 0px 0px'
  });

  // Positionnement initial pseudo-aléatoire pour un effet d'entrée
  useEffect(() => {
    if (images && images.length > 0) {
      const positions = images.map(() => Math.random() * 200 - 70);
      setRandomPositions(positions);
    }
  }, [images]);

  // Précharge en tâche de fond, mais ne bloque pas l'affichage
  useEffect(() => {
    if (!images || images.length === 0) return;
    images.forEach((img) => {
      const url = img.fields.IMAGE[0].url;
      if (!loadedImages[url]) {
        const image = new window.Image();
        image.src = url;
        image.onload = () => setLoadedImages(prev => ({ ...prev, [url]: true }));
        image.onerror = () => setLoadedImages(prev => ({ ...prev, [url]: false }));
      }
    });
    // eslint-disable-next-line
  }, [images]);

  const lastDragRef = useRef({ time: 0, pos: 0, velocity: 0 }); // dernier échantillon vitesse
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
          isTouchRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
          // Sur mobile: désactiver Draggable et laisser l’inertie native
          if (isTouchRef.current) {
            scrollContainerRef.current.style.overflowX = 'auto';
            scrollContainerRef.current.style.webkitOverflowScrolling = 'touch';
            return;
          }
          draggableInstance = Draggable.create(scrollContainerRef.current, {
            type: "scrollLeft",
            edgeResistance: 0.5,
            inertia: false,
            allowNativeTouchScrolling: false,
            cursor: "grab",
            dragClickables: false,
            onPress: function() {
              scrollContainerRef.current.style.overflowX = 'hidden';
            },
            onRelease: function() {
              scrollContainerRef.current.style.overflowX = 'auto';
            },
            onDragStart: function() {
              setIsDragging(true);
              this.target.style.cursor = "grabbing";
              controls.start({ scale: 0.98, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" });
              lastScrollLeft = this.scrollLeft;
              lastTime = Date.now();
              if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
              velocityVisualRef.current = 0;
              setVelocityVisual(0);
              lastDragRef.current = { time: lastTime, pos: lastScrollLeft, velocity: 0 };
            },
            onDrag: function() {
              setIsDragging(true);
              const now = Date.now();
              const dt = now - lastTime;
              if (dt > 0) {
                const deltaScroll = this.target.scrollLeft - lastScrollLeft; // px
                const velocity = deltaScroll / dt; // px/ms
                velocityRef.current = velocity;
                lastDragRef.current = { time: now, pos: this.target.scrollLeft, velocity };
                lastScrollLeft = this.target.scrollLeft;
                lastTime = now;
                // Ne pas faire de setState par frame pour éviter les lags
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

              // Inertie / momentum avec rebond aux bords
              const maxScroll = this.target.scrollWidth - this.target.clientWidth;
              let currentScroll = this.target.scrollLeft;
              let currentVelocity = (lastDragRef.current?.velocity || 0) * 1000; // px/s
              const frictionPerFrame = 0.95; // friction à 60fps
              const bounceDamping = 0.35; // restitution aux bords
              const minVelocity = 5; // px/s seuil d'arrêt
              let lastTs = 0;

              const step = (ts) => {
                if (!lastTs) lastTs = ts;
                const dt = (ts - lastTs) / 1000; // s
                lastTs = ts;

                if (Math.abs(currentVelocity) < minVelocity) {
                  return;
                }

                currentScroll += currentVelocity * dt;

                if (currentScroll < 0) {
                  currentScroll = 0;
                  currentVelocity = -currentVelocity * bounceDamping;
                } else if (currentScroll > maxScroll) {
                  currentScroll = maxScroll;
                  currentVelocity = -currentVelocity * bounceDamping;
                }

                this.target.scrollLeft = currentScroll;

                // appliquer friction proportionnelle au temps écoulé
                const frames = dt * 60;
                currentVelocity *= Math.pow(frictionPerFrame, frames);

                momentumRef.current = requestAnimationFrame(step);
              };
              momentumRef.current = requestAnimationFrame(step);
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
  }, [images, controls]);

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
            transition={{ type: "spring", stiffness: 280, damping: 22, mass: 0.9 }}
          >
            <motion.div
              style={{
                x: velocityVisual
              }}
              transition={{ type: "spring", stiffness: 180, damping: 18, mass: 0.9 }}
            >
              <div className="flex gap-3 py-8" style={{ minWidth: 'max-content' }}>
                {images && images.map((image, index) => {
                  const url = image.fields.IMAGE[0].url;
                  const isLoadedImg = loadedImages[url];
                  return (
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
                        height: !isMobile ? `${image.fields.IMAGE[0].height / 2}px` : `${image.fields.IMAGE[0].height / 4}px`,
                        background: !isLoadedImg ? "#222" : undefined // couleur de fond si pas chargé
                      }}>
                        {isLoadedImg ? (
                          <Image
                            src={url}
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
                        ) : (
                          // Placeholder (fond sombre ou skeleton)
                          <div style={{
                            width: "100%",
                            height: "100%",
                            background: "#fa6218",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#fa6218",
                            fontSize: 18
                          }}>
                            {/* Optionnel : <span>...</span> */}
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
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