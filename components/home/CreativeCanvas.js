import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

const CreativeCanvas = ({ images }) => {
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [randomPositions, setRandomPositions] = useState([]);
  
  const containerRef = useRef(null);
  const scrollContainerRef = useRef(null);
  
  const [inViewRef, inView] = useInView({
    threshold: 0.2,
    triggerOnce: false,
    rootMargin: '0px 0px 0px 0px'
  });

  // Générer des positions Y aléatoires au montage du composant
  useEffect(() => {
    if (images && images.length > 0) {
      const positions = images.map(() => Math.random() * 200 - 70); // Entre -100px et +100px
      setRandomPositions(positions);
    }
  }, [images]);

  // Gestion du scroll horizontal avec grab
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Gestion du touch pour mobile
  const handleTouchStart = (e) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - scrollContainerRef.current.offsetLeft);
    setScrollLeft(scrollContainerRef.current.scrollLeft);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2;
    scrollContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  return (
    <section ref={containerRef} className="bg-black text-white py-24">
      <div ref={inViewRef}>
        <motion.div className="max-w-none">
          {/* Galerie d'images scrollable */}
          <div 
            ref={scrollContainerRef}
            className="relative overflow-x-auto"
            style={{ 
              cursor: isDragging ? 'grabbing' : 'grab',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
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
              {images && images.map((image, index) => (
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
                      width: `${image.fields.IMAGE[0].width / 2}px`,
                      height: `${image.fields.IMAGE[0].height / 2}px`
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
                    
                    {/* Overlay avec le nom */}
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                      <h3 className="text-white font-bold text-lg">
                        {image.fields.Name}
                      </h3>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        /* Masquer la scrollbar */
        .overflow-x-auto::-webkit-scrollbar {
          display: none;
        }
        
        /* Empêcher la sélection de texte pendant le drag */
        .overflow-x-auto {
          user-select: none;
          -webkit-user-select: none;
          -moz-user-select: none;
          -ms-user-select: none;
        }
      `}</style>
    </section>
  );
};

export default CreativeCanvas;