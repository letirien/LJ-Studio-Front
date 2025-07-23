import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';

export default function BrandingSection({ gamePlan }) {

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
      {gamePlan && gamePlan.map((item, index) => (
        
        <motion.div
          key={index}
          className={`flex items-stretch min-h-[400px] py-24 gap-12 px-[3vw] ${getBackgroundColor(index)} ${hasRadius(index)}`}
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
          <div className='w-1/2 flex flex-col justify-around'>
            <h2 className={`HardbopH2 !text-left mx-xl ${getTitleColor(index)}`}>{item.fields['TITRE METIER']}</h2>
            <p className={`${getTextColor(index)} defaultText ${index % 3 === 2 ? "!opacity-100": ""}`}>{item.fields['DESCRIPTION METIER']}</p>
            <p className={`${getTextColor(index)}`}>{item.fields['SOUS METIERS']}</p>
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
      ))}
    </section>
  );
}