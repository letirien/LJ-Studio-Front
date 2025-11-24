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
          className={styles.menuBTN}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width={isMobille ? 48 : 74} height="35" viewBox="0 0 74 35">
            <g>
              <g>
                <g>
                  <path fill={logoColor} d="M.441 5.07V.683H37V5.07z"/>
                  <path fill="none" d="M.441 5.07V.683H37V5.07z"/>
                </g>
                <g>
                  <path fill={logoColor} d="M.441 19.694v-4.387h55.57v4.387z"/>
                  <path fill="none" d="M.441 19.694v-4.387h55.57v4.387z"/>
                </g>
                <g>
                  <path fill={logoColor} d="M37 34.317V29.93h36.559v4.387z"/>
                  <path fill="none" d="M37 34.317V29.93h36.559v4.387z"/>
                </g>
              </g>
            </g>
          </svg>
        </button>
        <SideMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
    </>
  );
}