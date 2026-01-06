"use client"
import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { SeeMore } from '../SeeMoreResp';
import GifDemo from "../../public/images/demo_gif.gif"
import AppearText from '../AppearText.js';
// todo: checl labelPosition, et régler les espaces verticales sur le texte
const Etiquette = ({ text }) => {
  const duration = Math.max(8, text.length * 0.15);
  
  return (
    <div className="relative w-[130px] h-[20px] overflow-hidden bg-[#fa6218] roboto text-black text-xs flex items-center">
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
  const [preloadedGifs, setPreloadedGifs] = useState(new Set());

  // Précharger tous les GIFs au montage
  useEffect(() => {
    if (!gamePlan) return;

    gamePlan.forEach((item) => {
      if (item.fields.GIF && item.fields.GIF[0]?.url) {
        const img = new window.Image();
        img.src = item.fields.GIF[0].url;
        img.onload = () => {
          setPreloadedGifs((prev) => new Set([...prev, item.fields.GIF[0].url]));
        };
      }
    });
  }, [gamePlan]);

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
    const labelWidth = 130;
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
    // Seul le bloc orange (index % 3 === 2) doit être text-white, le reste text-[#707777]
    if (index % 3 === 2) return 'text-white';
    return 'text-[#707777]';
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
        // labelPosition peut être un nombre (px) ou une string en pourcentage (ex: '50%')
        let labelLeft;
        if (item.labelPosition !== undefined) {
          console.log(item.labelPosition)
          if (typeof item.labelPosition === 'string' && item.labelPosition.endsWith('%')) {
            const percent = parseFloat(item.labelPosition) / 100;
            const titleRef = titleRefs.current[index];
            const titleWidth = titleRef ? titleRef.getBoundingClientRect().width : 0;
            labelLeft = Math.round(titleWidth * percent);
          } else {  
            labelLeft = item.labelPosition;
          }
        } else {
          labelLeft = calculateLabelPosition(index);
        }
        
        const yTransform = useTransform(
          scrollYProgress,
          [0, 1],
          [index * 100, 0]
        );

        return (
          <motion.div
            key={index}
            className={`flex flex-col-reverse md:flex-row items-center min-h-[400px] py-12 sm:py-24 gap-3 md:gap-0 px-[3vw] sm:px-[9vw] ${getBackgroundColor(index)} ${hasRadius(index)}`}
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
            <div className='md:w-1/2 w-content md:h-[90%] flex flex-col justify-around gap-3 sm:gap-6 mx-6 sm:mx-0'>
              <div className="inline-block">
                <h2
                  ref={(el) => (titleRefs.current[index] = el)}
                  className={`bigH2 z-20 gamePlan  text-[22vw] md:!text-[12vw]/[0.85] !text-left mx-xl relative ${item.fields["TITRE METIER"].length > 13 ? 'text-nowrap sm:text-wrap': 'text-nowrap'} w-min ${getTitleColor(index)}`}
                >
                  {item.fields["TITRE METIER"]}
                  <div
                    className="absolute"
                    style={{
                      top: item.fields["TITRE METIER"].length > 13 ? '80%' : '50%',
                      left: `${labelLeft}px`,
                      rotate: '-12deg',
                      willChange: 'transform',
                    }}
                  >
                    <Etiquette text={item.fields["SOUS METIERS"]}/>
                  </div>
                </h2>
              </div>
              <p className={`lg:w-3/4 ${getTextColor(index)} text-[#707777] robotoReg text-[12px] sm:text-[20px]  ${index % 3 === 2 ? "!opacity-100": ""}`}>
                {item.fields['DESCRIPTION METIER']}
              </p>
              <Link 
                className={`${getTextColor(index)} uppercase w-max robotoMonoBold text-[12px] sm:text-[16px] mt-4 ${index % 3 === 2 ? "!opacity-100": ""}`} 
                href=""
              >
                <AppearText type="words" hover={true}>
                  › check an highlight
                </AppearText>
                
              </Link>
            </div>
            <div className={`mx-6 sm:mx-0 md:w-1/2 flex-grow relative md:my-auto xl:my-0`}>
              <Image
                onMouseOver={() => setGif(index)}
                onMouseLeave={() => setShowGif(null)}
                className={`w-full h-auto object-cover`}
                src={showGif === index && item.fields.GIF ? item.fields.GIF[0].url : item.fields.Image[0].url}
                alt={item.fields.Image[0].filename || 'Game plan image'}
                width={item.fields.Image[0].width || gamePlan[0].fields.Image[0].width}
                height={item.fields.Image[0].height || gamePlan[0].fields.Image[0].height}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                unoptimized={true}
                priority={index === 0}
              />
              {/* <SeeMore/> */}
            </div>
          </motion.div>
        );
      })}
    </section>
  );
}