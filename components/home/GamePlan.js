import { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Link from 'next/link';

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
  // Générer des positions aléatoires uniques pour chaque élément
  const randomPositions = useMemo(() => {
    if (!gamePlan) return [];
    return gamePlan.map(() => Math.floor(Math.random() * 300));
  }, [gamePlan?.length]);

  useEffect(() => {
    console.log(gamePlan)
  },[]);

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
    return colors[index % colors.length];
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
    return index % 2 === 0 ? 'rounded-t-3xl' : '';
  };
  
  return (
    <section ref={containerRef} className="bg-white intersectLogo">
      {gamePlan && gamePlan.map((item, index) => {
        // Utiliser la position aléatoire spécifique à cet index
        const randomLeft = randomPositions[index] || 60;
        
        // Calculer la transformation Y pour cet élément
        const yTransform = useTransform(
          scrollYProgress,
          [0, 1],
          [index * 100, 0]
        );

        return (
          <motion.div
            key={index}
            className={`flex items-stretch min-h-[400px] py-24 gap-12 px-[3vw] ${getBackgroundColor(index)} ${hasRadius(index)}`}
            style={{
              position: 'sticky',
              top: 0,
              zIndex: index,
              transform: 'translateZ(0)', // Performance optimization
              y: yTransform, // Utiliser la valeur transformée directement
            }}
          >
            <div className='w-1/2 flex flex-col justify-around'>
                 <div className="relative inline-block">
                    <h2
                      className={`TenTwentyH2 !text-[172pt]/[142pt] !text-left mx-xl ${getTitleColor(
                        index
                      )}`}
                    >
                      {item.fields["TITRE METIER"]}
                    </h2>

                    {/* L'étiquette au-dessus du h2, position aléatoire */}
                    <div
                      className="absolute"
                      style={{
                        top: `60%`,
                        left: `${randomLeft}px`,
                        rotate: `-12deg`,
                      }}
                    >
                      <Etiquette text={item.fields["SOUS METIERS"]} />
                    </div>
                </div>
              <p className={`${getTextColor(index)} defaultText ${index % 3 === 2 ? "!opacity-100": ""}`}>{item.fields['DESCRIPTION METIER']}</p>
              <Link className={`${getTextColor(index)} roboto uppercase text-xs mt-4 ${index % 3 === 2 ? "!opacity-100": "opacity-55"}`} href="">› check more</Link>
            </div>
            <div className='w-1/2'>
              <Image 
                src={item.fields.Image[0].url} 
                alt={item.fields.Image[0].filename || 'Game plan image'}
                width={item.fields.Image[0].width}
                height={item.fields.Image[0].height}
                objectFit='cover'
              />
            </div>

          </motion.div>
        );
      })}
    </section>
  );
}