import React, { useState, useEffect } from 'react';
import styles from './navbar.module.scss';
import layoutStyle from '../layout.module.scss';
import Image from 'next/image';
import { SideMenu } from '../home/SideMenu';

export default function Navbar() {
  const [logoColor, setLogoColor] = useState('white');
  const [isBetweenSections, setIsBetweenSections] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isMobille, setIsMobille] = useState(false);
  
  useEffect(() => {
    setIsMobille(window.innerWidth <= 768);
  }, );
  useEffect(() => {
    const handleScroll = () => {
      const sectionsWhite = document.querySelectorAll('.intersectLogo.white');
      const sectionsBlack = document.querySelectorAll('.intersectLogo.black');
      const navbar = document.getElementById(styles.navbar);
      if (!navbar) return;
  
      const navbarRect = navbar.getBoundingClientRect();
      const navbarCenter = navbarRect.top + (navbarRect.height / 2); // Centre du navbar
      
      let currentColor = 'white'; // Couleur par défaut
  
      // Vérifier toutes les sections et trouver celle qui est visible au centre du navbar
      const allSections = [
        ...Array.from(sectionsWhite).map(s => ({ el: s, color: 'dark' })),
        ...Array.from(sectionsBlack).map(s => ({ el: s, color: 'white' }))
      ];
  
      // Trier par z-index pour gérer les sticky sections
      allSections.sort((a, b) => {
        const zIndexA = parseInt(window.getComputedStyle(a.el).zIndex) || 0;
        const zIndexB = parseInt(window.getComputedStyle(b.el).zIndex) || 0;
        return zIndexB - zIndexA; // Plus grand z-index en premier
      });
  
      // Trouver la première section visible qui intersecte le navbar
      for (const { el, color } of allSections) {
        const rect = el.getBoundingClientRect();
        
        // Vérifier si la section est visible et intersecte le navbar
        if (rect.top <= navbarCenter && rect.bottom >= navbarCenter) {
          currentColor = color;
          break; // Prendre la première (plus haute z-index)
        }
      }
  
      setLogoColor(currentColor);
    };
  
    window.addEventListener('scroll', handleScroll);
    handleScroll();
  
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  

  return (
    <>
      <div id={styles.navbar} className="mainContainer pt-[2vh] sm:pt-[4vh] px-[3vw]">
        <div className={`${styles.logo} ${styles[logoColor]}`}>
          <Image
            width={isMobille ? 48 : 98}
            height={isMobille ? 48 : 98}
            src="/images/LOGO.svg"
            alt="LJ Studio LOGO"
            style={{ objectFit: 'cover' }}
          />
        </div>
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="group cursor-pointer flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px] bg-transparent border-none p-0"
        >
          {/* Top bar — courte, alignée à gauche */}
          <div
            className={`h-[3px]  transition-all duration-300 ease-out w-2/4 self-start group-hover:w-[70%] group-hover:translate-x-0 ${logoColor === 'white' ? 'bg-white' : 'bg-black'}`}
          />
          {/* Middle bar — longue */}
          <div
            className={`h-[3px] self-start transition-all duration-300 ease-out w-3/4 group-hover:w-[70%] group-hover:translate-x-0 ${logoColor === 'white' ? 'bg-white' : 'bg-black'}`}
          />
          {/* Bottom bar — courte, alignée à droite */}
          <div
            className={`h-[3px] transition-all duration-300 ease-out w-2/4 self-start translate-x-full group-hover:w-[70%] group-hover:translate-x-0 ${logoColor === 'white' ? 'bg-white' : 'bg-black'}`}
          />
        </button>
        <SideMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
    </>
  );
}