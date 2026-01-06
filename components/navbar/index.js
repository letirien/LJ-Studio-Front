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
          className="group cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width={isMobille ? 48 : 74}
            height="35"
            viewBox="0 0 74 35"
          >
            {/* Top bar — courte */}
            <path
              fill={logoColor}
              d="M10 5V1h24v4z"
              className="
                origin-left
                transition-transform duration-300 ease-out
                group-hover:scale-x-[1.55]
              "
            />

            {/* Middle bar — largeur finale (48) */}
            <path
              fill={logoColor}
              d="M9 19.7v-4.4h48v4.4z"
              className="
              origin-center
              transition-transform
              duration-300
              ease-out
              group-hover:scale-x-[0.85]
              "
            />

            {/* Bottom bar — courte */}
            <path
              fill={logoColor}
              d="M27 34.3v-4.4h32v4.4z"
              className="
                origin-right
                transition-transform duration-300 ease-out
                group-hover:scale-x-[1.3]
              "
            />
          </svg>
        </button>
        <SideMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
    </>
  );
}