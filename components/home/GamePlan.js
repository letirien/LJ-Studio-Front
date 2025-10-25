"use client"
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { SeeMore } from '../SeeMoreResp';
import GifDemo from "../../public/images/demo_gif.gif"

const Etiquette = ({ text }) => {
  const duration = Math.max(8, text.length * 0.15);
  
  return (
    <div className="relative w-[180px] h-[20px] overflow-hidden bg-[#fa6218] roboto text-black text-xs flex items-center">
      <motion.div
        className="whitespace-nowrap flex"
        animate={{ x: ["0%", "-50%"] }}
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
          repeatType: "loop",
        }}
      >
        <span className="px-2">{text}</span>
        <span className="px-2">{text}</span>
      </motion.div>
    </div>
  );
};

export default function BrandingSection({ gamePlan }) {
  const titleRefs = useRef([]);
  const labelPositions = useRef({});
  const labelRatios = useRef({});
  const [positionsVersion, setPositionsVersion] = useState(0);
  const [showGif, setShowGif] = useState(null);

  const calculateLabelPosition = (index) => {
    const titleRef = titleRefs.current[index];
    if (!titleRef) return 60;
    
    // Si déjà calculé, réutiliser
    if (labelPositions.current[index] !== undefined) {
      return labelPositions.current[index];
    }

    // Utiliser getBoundingClientRect pour la cohérence cross-browser
    const rect = titleRef.getBoundingClientRect();
    const titleWidth = rect.width;
    const titleText = titleRef.textContent || '';
    const charCount = titleText.length;
    
    // Largeur de l'étiquette (180px) + marge de sécurité
    const labelWidth = 180;
    const safetyMargin = 20;
    const totalLabelSpace = labelWidth + safetyMargin;
    
    // Déterminer si on est en mobile ou desktop
    const isMobile = titleWidth < 768;
    
    let minPercent, maxPercent;
    
    if (isMobile) {
      minPercent = 0.05; 
      maxPercent = 0.40;
    } else {
      minPercent = 0.02;  
      maxPercent = 0.3;
    }
    
    // Ajustement selon le nombre de caractères
    // Mots longs (>10 chars) : décalage vers la droite pour éviter la superposition
    if (charCount > 10) {
      const extraShift = 0.12;
      minPercent = minPercent + extraShift;
      maxPercent = Math.min(maxPercent + extraShift, 0.85);
    }
    
    // Mots très longs (>15 chars) : décalage supplémentaire
    if (charCount > 15) {
      const extraShift = 0.08;
      minPercent = minPercent + extraShift;
      maxPercent = Math.min(maxPercent + extraShift, 0.9);
    }
    
    // Calculer la position maximale pour éviter le débordement
    const maxPossiblePosition = titleWidth - totalLabelSpace;
    
    // Si le titre est trop petit, forcer une position centrée
    if (maxPossiblePosition < 0) {
      const centeredPosition = Math.max(0, (titleWidth - labelWidth) / 2);
      labelPositions.current[index] = Math.round(centeredPosition);
      return labelPositions.current[index];
    }
    
    // Ajuster maxPercent pour ne pas dépasser
    const maxPercentFromWidth = maxPossiblePosition / titleWidth;
    maxPercent = Math.min(maxPercent, maxPercentFromWidth);
    
    // S'assurer que minPercent ne dépasse pas maxPercent
    minPercent = Math.min(minPercent, maxPercent - 0.05);
    
    // Générer et stocker le ratio une seule fois par index
    if (labelRatios.current[index] === undefined) {
      labelRatios.current[index] = minPercent + Math.random() * (maxPercent - minPercent);
    }
    
    const ratio = labelRatios.current[index];
    
    // Calculer la position en pixels
    let finalPosition = Math.round(titleWidth * ratio);
    
    // Vérification finale : s'assurer que l'étiquette ne dépasse pas
    finalPosition = Math.min(finalPosition, maxPossiblePosition);
    finalPosition = Math.max(0, finalPosition); // Pas de position négative
    
    // Stocker la position
    labelPositions.current[index] = finalPosition;
    
    return finalPosition;
  };

  // Recalcul optimisé pour tous les navigateurs
  useLayoutEffect(() => {
    const recalc = () => {
      if (!titleRefs.current || titleRefs.current.length === 0) return;
      
      // Réinitialiser les positions
      labelPositions.current = {};
      
      // Force reflow pour Safari (améliore la précision)
      titleRefs.current.forEach((ref) => {
        if (ref) void ref.offsetHeight;
      });
      
      // Recalculer toutes les positions
      titleRefs.current.forEach((_, idx) => {
        calculateLabelPosition(idx);
      });
      
      // Forcer le re-render
      setPositionsVersion((v) => v + 1);
    };

    // Double RAF pour meilleure stabilité sur Safari
    let raf1, raf2;
    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(recalc);
    });

    // Gestion du resize avec debounce
    let resizeTimeout;
    const onResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        requestAnimationFrame(recalc);
      }, 150);
    };
    
    window.addEventListener('resize', onResize, { passive: true });
    
    return () => {
      if (raf1) cancelAnimationFrame(raf1);
      if (raf2) cancelAnimationFrame(raf2);
      clearTimeout(resizeTimeout);
      window.removeEventListener('resize', onResize);
    };
  }, [gamePlan]);

  const setGif = (index) => {
    setShowGif(index);
  };

  const [containerRef, inView] = useInView({
    threshold: 0.1,
    triggerOnce: false
  });

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  });

  const getBackgroundColor = (index) => {
    const colors = ['bg-white', 'bg-black', 'bg-[#fa6218]'];
    const bgColor = colors[index % colors.length];
    const logoClass = bgColor === 'bg-white' ? 'white' : 'black';
    return `intersectLogo ${logoClass} ${bgColor}`;
  };

  const getTextColor = (index) => {
    if (index % 3 === 2) return 'text-white';
    if (index % 3 === 1) return 'text-white';
    return 'text-black';
  };

  const getTitleColor = (index) => {
    return index % 3 === 1 ? 'text-white' : 'text-black';
  };

  const hasRadius = (index) => {
    return 'rounded-t-3xl';
  };
  
  return (
    <section ref={containerRef} className="">
      {gamePlan && gamePlan.map((item, index) => {
        const labelLeft = calculateLabelPosition(index);
        
        const yTransform = useTransform(
          scrollYProgress,
          [0, 1],
          [index * 100, 0]
        );

        return (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row items-stretch min-h-[400px] py-12 sm:py-24 gap-3 sm:gap-0 px-[3vw] sm:px-[9vw] ${getBackgroundColor(index)} ${hasRadius(index)}`}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: index,
              transform: 'translateZ(0)',
            }}
            initial={{ y: index * 100 }}
            animate={{
              y: useTransform(
                scrollYProgress,
                [0, 1],
                [index * 100, 0]
              )
            }}
          >
            <div className='md:w-1/2 w-full flex flex-col justify-around gap-3 sm:gap-6'>
              <div className="inline-block">
                <h2
                  ref={(el) => (titleRefs.current[index] = el)}
                  className={`bigH2 z-20 gamePlan md:!text-[172pt]/[142pt] !text-left mx-xl relative ${item.fields["TITRE METIER"].length > 13 ? 'text-nowrap sm:text-wrap': 'text-nowrap'} w-min ${getTitleColor(index)}`}
                >
                  {item.fields["TITRE METIER"]}
                  <div
                    className="absolute"
                    style={{
                      top: '60%',
                      left: `${labelLeft}px`,
                      rotate: '-12deg',
                      willChange: 'transform',
                    }}
                  >
                    <Etiquette text={item.fields["SOUS METIERS"]} />
                  </div>
                </h2>
              </div>
              <p className={`w-full lg:w-3/4 ${getTextColor(index)} defaultText ${index % 3 === 2 ? "!opacity-100": ""}`}>
                {item.fields['DESCRIPTION METIER']}
              </p>
              <Link 
                className={`${getTextColor(index)} hidden sm:block roboto uppercase text-xs mt-4 ${index % 3 === 2 ? "!opacity-100": "opacity-55"}`} 
                href=""
              >
                › check more
              </Link>
            </div>
            <div className='md:w-1/2 relative md:my-auto xl:my-0'>
              <Image 
                onMouseOver={() => setGif(index)}
                onMouseLeave={() => setShowGif(null)}
                src={showGif === index ? GifDemo : item.fields.Image[0].url} 
                alt={item.fields.Image[0].filename || 'Game plan image'}
                width={item.fields.Image[0].width}
                height={item.fields.Image[0].height}
                objectFit='cover'
              />
              <SeeMore/>
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}