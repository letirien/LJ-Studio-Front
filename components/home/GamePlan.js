import { useState, useEffect, useMemo, useRef, useLayoutEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';
import { SeeMore } from '../SeeMoreResp';
import GifDemo from "../../public/images/demo_gif.gif"
const Etiquette = ({ text }) => {
  // Calculer la durée basée sur la longueur du texte
  // Plus le texte est long, plus la durée est longue pour garder une vitesse constante
  const duration = Math.max(8, text.length * 0.15); // Minimum 8s, +0.15s par caractère
  
  return (
    <div className="relative w-[180px] h-[20px] overflow-hidden bg-[#fa6218] roboto text-black text-xs flex items-center">
      <motion.div
        className="whitespace-nowrap flex"
        animate={{ x: ["0%", "-50%"] }} // Aller jusqu'à -50% au lieu de -100%
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
          repeatType: "loop", // Assure une boucle parfaite
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
  const labelRatios = useRef({}); // conserve un ratio aléatoire stable par index
  const [positionsVersion, setPositionsVersion] = useState(0); // force un rerender après mesure
  const [showGif, setShowGif] = useState(null)
  // Fonction pour calculer la position d'une étiquette basée sur la taille réelle du titre
  const calculateLabelPosition = (index) => {
    const titleRef = titleRefs.current[index];
    if (!titleRef) return 60; // Position par défaut
    // Si on a déjà calculé la position pour cet index, la réutiliser
    if (labelPositions.current[index] !== undefined) {
      return labelPositions.current[index];
    }
    const title = titleRef.getBoundingClientRect();
    // Mesurer la largeur réelle de l'élément h2
    const titleWidth = titleRef.offsetWidth;
    
    // Adapter les pourcentages selon la taille du titre
    let minPercent, maxPercent;
    
    if (titleWidth < 768) {
      // Mobile : position plus centrée
      minPercent = 0.15;
      maxPercent = 0.35;
    } else {
      // Desktop : position plus étendue
      minPercent = 0.1;
      maxPercent = 0.5;
    }
    
    // Choisir (et mémoriser) un ratio aléatoire stable dans la plage
    if (labelRatios.current[index] === undefined) {
      const ratio = minPercent + Math.random() * (maxPercent - minPercent);
      labelRatios.current[index] = ratio;
    }
    const ratio = labelRatios.current[index];
    const finalPosition = Math.floor(titleWidth * ratio);
    
    // Stocker la position pour cet index
    labelPositions.current[index] = finalPosition;
    
    return finalPosition;
  };

  // Recalcule toutes les positions après rendu/layout et au resize
  useLayoutEffect(() => {
    const recalc = () => {
      if (!titleRefs.current) return;
      labelPositions.current = {};
      // recalcul simple, les ratios restent stables
      titleRefs.current.forEach((_, idx) => {
        calculateLabelPosition(idx);
      });
      setPositionsVersion((v) => v + 1);
    };

    // attendre la fin du layout courant
    const raf = requestAnimationFrame(recalc);

    // recalcul au resize (debounce léger)
    let resizeRaf = 0;
    const onResize = () => {
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      resizeRaf = requestAnimationFrame(recalc);
    };
    window.addEventListener('resize', onResize, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      if (resizeRaf) cancelAnimationFrame(resizeRaf);
      window.removeEventListener('resize', onResize);
    };
  }, [gamePlan]);

  useEffect(() => {
    console.log(gamePlan)
    console.log(showGif)
  },[]);

  const setGif = (index) => {
    setShowGif(index)
  }
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
    
    // Pour white : logo doit être dark (noir)
    // Pour black/orange : logo doit être white
    const logoClass = bgColor === 'bg-white' ? 'white' : 'black';
    
    return `intersectLogo ${logoClass} ${bgColor}`;
  };

  const getTextColor = (index) => {
    // Si c'est le block orange (multiple de 3)
    if (index % 3 === 2) {
      return 'text-white'; // texte blanc par défaut sur orange
    }
    // Si c'est le block noir
    if (index % 3 === 1) {
      return 'text-white'; // texte blanc sur noir
    }
    // Si c'est le block blanc
    return 'text-black'; // texte noir sur blanc
  };

  const getTitleColor = (index) => {
    return index % 3 === 1 ? 'text-white' : 'text-black';
  };

  const hasRadius = (index) => {
    return 'rounded-t-3xl'
  };
  
  return (
    <section ref={containerRef} className="">
      {gamePlan && gamePlan.map((item, index) => {
        // Calculer la position pour cette étiquette spécifique
        const labelLeft = calculateLabelPosition(index);
        
        // Calculer la transformation Y pour cet élément
        const yTransform = useTransform(
          scrollYProgress,
          [0, 1],
          [index * 100, 0]
        );

        return (
          <motion.div
            key={index}
            className={`flex flex-col md:flex-row items-stretch min-h-[400px] py-12 sm:py-24 gap-3 sm:gap-0 px-[9vw] ${getBackgroundColor(index)} ${hasRadius(index)}`}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: index,
              transform: 'translateZ(0)', // Performance optimization
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
                      className={`bigH2 z-20 gamePlan md:!text-[172pt]/[142pt] !text-left mx-xl relative ${item.fields["TITRE METIER"].length > 13 ? 'text-wrap': 'text-nowrap'} w-min ${getTitleColor(
                        index
                      )}`}
                    >
                      {item.fields["TITRE METIER"]}
                      <div
                      className="absolute"
                      style={{
                        top: `60%`,
                        left: `${labelLeft}px`,
                        rotate: `-12deg`,
                      }}
                    >
                      <Etiquette text={item.fields["SOUS METIERS"]} />
                    </div>
                    </h2>
                </div>
              <p className={`w-full lg:w-3/4 ${getTextColor(index)} defaultText ${index % 3 === 2 ? "!opacity-100": ""}`}>{item.fields['DESCRIPTION METIER']}</p>
              <Link className={`${getTextColor(index)} hidden sm:block roboto uppercase text-xs mt-4 ${index % 3 === 2 ? "!opacity-100": "opacity-55"}`} href="">› check more</Link>
            </div>
            <div className='md:w-1/2 relative md:my-auto xl:my-0'>
              <Image 
                onMouseOver={()=>setGif(index)}
                onMouseLeave={()=> setShowGif(null)}
                src={showGif === index ? GifDemo: item.fields.Image[0].url} 
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