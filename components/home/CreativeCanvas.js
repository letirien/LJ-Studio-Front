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
  const [scrollProgress, setScrollProgress] = useState(0);

  // Pour suivre le chargement individuel des images
  const [loadedImages, setLoadedImages] = useState({});

  // Pour la boucle infinie
  const [infiniteImages, setInfiniteImages] = useState([]);

  // Précharger toutes les images dès le montage
  useEffect(() => {
    if (!images || images.length === 0) return;

    const preloadImages = async () => {
      const loadPromises = images.map((img) => {
        const url = img.fields.IMAGE[0].url;
        return new Promise((resolve) => {
          const image = new window.Image();
          image.src = url;
          image.onload = () => {
            setLoadedImages(prev => ({ ...prev, [url]: true }));
            resolve();
          };
          image.onerror = () => {
            setLoadedImages(prev => ({ ...prev, [url]: false }));
            resolve();
          };
        });
      });

      await Promise.all(loadPromises);
    };

    preloadImages();
  }, [images]);

  // Créer un tableau avec 3 copies pour la boucle infinie
  useEffect(() => {
    if (!images || images.length === 0) return;

    // On crée 3 sets d'images pour permettre la boucle
    const tripleImages = [
      ...images.map((img, i) => ({ ...img, uniqueKey: `prev-${i}` })),
      ...images.map((img, i) => ({ ...img, uniqueKey: `main-${i}` })),
      ...images.map((img, i) => ({ ...img, uniqueKey: `next-${i}` }))
    ];

    setInfiniteImages(tripleImages);
  }, [images]);

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

  // Positionnement initial pseudo-aléatoire pour un effet d'entrée, (position plus aléatoire (1 sur 2))
  // faire en sorte que le décallage soit à l'origine puis une fois centrée ne plus le faire pour la suite du scroll. 
  useEffect(() => {
    if (images && images.length > 0) {
      const positions = images.map((_, index) => index % 2 === 0 ? 130 : -70);
      setRandomPositions(positions);
    }
  }, [images]);

  // Calcul de la progression du scroll (alignement progressif)
  useEffect(() => {
    if (!containerRef.current) return;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      const elementHeight = rect.height;

      // Calculer la position de l'élément par rapport au viewport
      const elementTop = rect.top;
      const elementBottom = rect.bottom;
      const screenCenter = windowHeight / 2;
      const elementCenter = elementTop + elementHeight / 2;

      // Déterminer si on est au-dessus, centré ou en-dessous
      if (elementCenter > screenCenter) {
        // Section en dessous du centre (pas encore arrivée)
        // Calculer la progression d'entrée (0 = loin en bas, 1 = centré)
        const distanceToCenter = elementCenter - screenCenter;
        const maxDistance = windowHeight / 2 + elementHeight / 2;
        const progress = Math.max(0, Math.min(1, 1 - (distanceToCenter / maxDistance)));
        setScrollProgress(progress);
      } else {
        // Section au centre ou au-dessus du centre
        // Une fois centrée, elle reste centrée (progress = 1)
        setScrollProgress(1);
      }

      // Si on scroll au-dessus de la section (elle sort complètement par le haut)
      if (elementBottom < 0) {
        // Remettre le décalage initial
        setScrollProgress(0);
      }
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, []);

  const lastDragRef = useRef({ time: 0, pos: 0, velocity: 0 }); // dernier échantillon vitesse

  // Gestion de la boucle infinie
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container || !infiniteImages.length || !images?.length) return;

    const handleInfiniteScroll = () => {
      const scrollLeft = container.scrollLeft;
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;

      // Calcul de la largeur d'un set d'images
      const oneSetWidth = scrollWidth / 3;

      // Si on atteint la fin du deuxième set, on revient au début du deuxième set
      if (scrollLeft >= oneSetWidth * 2 - clientWidth / 2) {
        container.scrollLeft = scrollLeft - oneSetWidth;
      }
      // Si on remonte avant le début du deuxième set, on saute à la fin du deuxième set
      else if (scrollLeft <= oneSetWidth / 2) {
        container.scrollLeft = scrollLeft + oneSetWidth;
      }
    };

    container.addEventListener('scroll', handleInfiniteScroll, { passive: true });

    // Positionner au milieu (deuxième set) au démarrage
    const scrollWidth = container.scrollWidth;
    const oneSetWidth = scrollWidth / 3;
    container.scrollLeft = oneSetWidth;

    return () => container.removeEventListener('scroll', handleInfiniteScroll);
  }, [infiniteImages, images]);

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
          // Sur mobile: désactiver Draggable et laisser l'inertie native
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
            cursor: "none",
            activeCursor: "none",
            dragClickables: false,
            onPress: function() {
              scrollContainerRef.current.style.overflowX = 'hidden';
            },
            onRelease: function() {
              scrollContainerRef.current.style.overflowX = 'auto';
            },
            onDragStart: function() {
              setIsDragging(true);
              // this.target.style.cursor = "grabbing";
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
              // this.target.style.cursor = "grab";
              controls.start({
                scale: 1,
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                transition: { type: "spring", stiffness: 300, damping: 20 }
              });

              // Inertie / momentum avec boucle infinie (pas de rebond aux bords)
              const maxScroll = this.target.scrollWidth - this.target.clientWidth;
              const oneSetWidth = this.target.scrollWidth / 3;
              let currentScroll = this.target.scrollLeft;
              let currentVelocity = (lastDragRef.current?.velocity || 0) * 1000; // px/s
              const frictionPerFrame = 0.95; // friction à 60fps
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

                // Gestion de la boucle infinie pendant le momentum
                if (currentScroll >= oneSetWidth * 2 - this.target.clientWidth / 2) {
                  currentScroll = currentScroll - oneSetWidth;
                } else if (currentScroll <= oneSetWidth / 2) {
                  currentScroll = currentScroll + oneSetWidth;
                }

                // Clamp pour éviter les débordements extrêmes
                currentScroll = Math.max(0, Math.min(maxScroll, currentScroll));

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
    <section ref={containerRef} className="bg-black text-white py-12 sm:py-24">
      <div ref={inViewRef} onMouseEnter={() => !isMobile ? window.dispatchEvent(new Event("cursor-show")) : null}
                            onMouseLeave={() => !isMobile ? window.dispatchEvent(new Event("cursor-hide")) : null}>
        <motion.div className="max-w-none" >
          <motion.div
            ref={scrollContainerRef}
            className="relative overflow-x-auto"
            style={{
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x pan-y',
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
                {infiniteImages.map((image, index) => {
                  const url = image.fields.IMAGE[0].url;
                  const thumbnailUrl = image.fields.IMAGE[0].thumbnails?.large?.url ||
                                      image.fields.IMAGE[0].thumbnails?.small?.url;
                  const isLoadedImg = loadedImages[url];
                  const originalIndex = index % (images?.length || 1);

                  return (
                    <motion.div
                      key={image.uniqueKey}
                      className="relative flex-shrink-0 group"
                      style={{
                        y: Math.max(-32, Math.min(32, randomPositions[originalIndex] * (1 - scrollProgress)))
                      }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20
                      }}
                      onMouseEnter={() => setHoveredIndex(index)}
                      onMouseLeave={() => setHoveredIndex(null)}
                      whileHover={{ scale: 1.02 }}
                      data-cursor
                    >
                      <div className={`relative w-full overflow-hidden`} style={{
                        width: !isMobile ? `${image.fields.IMAGE[0].width / 3}px` : `${image.fields.IMAGE[0].width / 4}px`,
                        height: !isMobile ? `${image.fields.IMAGE[0].height / 3}px` : `${image.fields.IMAGE[0].height / 4}px`,
                        background: "#222"
                      }}>
                        {/* Thumbnail en arrière-plan (chargement immédiat) */}
                        {thumbnailUrl && !isLoadedImg && (
                          <Image
                            quality={30}
                            src={thumbnailUrl}
                            alt={image.fields.Name || "Project thumbnail"}
                            fill
                            sizes="(max-width: 768px) 25vw, 33vw"
                            className="blur-sm"
                            style={{
                              objectFit: 'contain',
                              filter: 'grayscale(100%) brightness(0.75) blur(4px)'
                            }}
                            priority={index < 5} // Prioriser les 5 premières
                          />
                        )}

                        {/* Image haute qualité */}
                        {isLoadedImg ? (
                          <Image
                            quality={50}
                            src={url}
                            alt={image.fields.Name || "Project image"}
                            fill
                            sizes="(max-width: 768px) 25vw, 33vw"
                            className="transition-opacity duration-300"
                            style={{
                              objectFit: 'contain',
                              opacity: hoveredIndex === index ? 1 : 0.8
                            }}
                            priority={index < 5}
                          />
                        ) : (
                          // Fallback si pas de thumbnail - fond orange uniquement
                          !thumbnailUrl && (
                            <div style={{
                              width: "100%",
                              height: "100%",
                              background: "#fa6218"
                            }} />
                          )
                        )}
                        <div
                          className="absolute inset-0 bg-black/60 transition-opacity duration-300 flex items-end p-4"
                          style={{
                            opacity: hoveredIndex === index ? 0.2 : 1
                          }}
                        >
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
          touch-action: pan-x pan-y;
          cursor: none !important;
        }
      `}</style>
    </section>
  );
};

export default CreativeCanvas;