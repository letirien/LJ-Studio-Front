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
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [randomPositions, setRandomPositions] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  const velocityRef = useRef(0);
  const momentumRef = useRef(null);
  const lastXRef = useRef(0);
  const [isMobile, setIsMobile] = useState(false);

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

  // PRELOAD images
  useEffect(() => {
    if (images && images.length > 0) {
      preloadImages(images).then(() => setIsLoaded(true));
    }
  }, [images]);

  // --- Drag & Momentum ---
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    lastXRef.current = e.pageX;
    velocityRef.current = 0;
    if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    velocityRef.current = e.pageX - lastXRef.current;
    lastXRef.current = e.pageX;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    // Momentum effect
    let momentum = velocityRef.current;
    const step = () => {
      if (Math.abs(momentum) > 0.5) {
        scrollContainerRef.current.scrollLeft -= momentum;
        momentum *= 0.92; // friction
        momentumRef.current = requestAnimationFrame(step);
      }
    };
    step();
  };

  // --- Touch for mobile ---
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
    lastXRef.current = e.touches[0].pageX;
    velocityRef.current = 0;
    if (momentumRef.current) cancelAnimationFrame(momentumRef.current);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
    velocityRef.current = e.touches[0].pageX - lastXRef.current;
    lastXRef.current = e.touches[0].pageX;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    let momentum = velocityRef.current;
    const step = () => {
      if (Math.abs(momentum) > 0.5) {
        scrollContainerRef.current.scrollLeft -= momentum;
        momentum *= 0.92;
        momentumRef.current = requestAnimationFrame(step);
      }
    };
    step();
  };

  return (
    <section ref={containerRef} className="bg-black text-white py-24">
      <div ref={inViewRef}>
        <motion.div className="max-w-none">
          <div
            ref={scrollContainerRef}
            className="relative overflow-x-auto"
            style={{
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none',
              touchAction: 'pan-x', // iOS scroll horizontal
              WebkitOverflowScrolling: 'touch', // iOS momentum
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
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
          </div>
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