import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.scss';
import Image from 'next/image';
import { SideMenu } from '../home/SideMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobille, setIsMobille] = useState(false);

  const whiteLogoRef = useRef(null);
  const darkLogoRef = useRef(null);
  const whiteMenuRef = useRef(null);
  const darkMenuRef = useRef(null);

  useEffect(() => {
    setIsMobille(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const logoEl = whiteLogoRef.current;
      if (!logoEl) return;

      const sectionsWhite = document.querySelectorAll('.intersectLogo.white');
      const sectionsBlack = document.querySelectorAll('.intersectLogo.black');
      const logoRect = logoEl.getBoundingClientRect();

      const allSections = [
        ...Array.from(sectionsWhite).map(s => ({
          rect: s.getBoundingClientRect(),
          zIndex: parseInt(window.getComputedStyle(s).zIndex) || 0,
          color: 'dark'
        })),
        ...Array.from(sectionsBlack).map(s => ({
          rect: s.getBoundingClientRect(),
          zIndex: parseInt(window.getComputedStyle(s).zIndex) || 0,
          color: 'white'
        }))
      ];

      allSections.sort((a, b) => b.zIndex - a.zIndex);

      const getColorAtY = (y) => {
        for (const { rect, color } of allSections) {
          if (rect.top <= y && rect.bottom >= y) {
            return color;
          }
        }
        return 'white';
      };

      const topColor = getColorAtY(logoRect.top);
      const bottomColor = getColorAtY(logoRect.bottom);

      let whiteClip, darkClip;

      if (topColor === bottomColor) {
        if (topColor === 'white') {
          whiteClip = 'inset(0)';
          darkClip = 'inset(100% 0 0 0)';
        } else {
          darkClip = 'inset(0)';
          whiteClip = 'inset(100% 0 0 0)';
        }
      } else {
        let low = logoRect.top;
        let high = logoRect.bottom;
        while (high - low > 0.5) {
          const mid = (low + high) / 2;
          if (getColorAtY(mid) === topColor) {
            low = mid;
          } else {
            high = mid;
          }
        }

        const splitPx = high - logoRect.top;

        if (topColor === 'white') {
          whiteClip = `inset(0 0 calc(100% - ${splitPx + 0.5}px) 0)`;
          darkClip = `inset(${Math.max(0, splitPx - 0.5)}px 0 0 0)`;
        } else {
          darkClip = `inset(0 0 calc(100% - ${splitPx + 0.5}px) 0)`;
          whiteClip = `inset(${Math.max(0, splitPx - 0.5)}px 0 0 0)`;
        }
      }

      // Appliquer le clip-path sur les logos ET les menus
      if (whiteLogoRef.current) whiteLogoRef.current.style.clipPath = whiteClip;
      if (darkLogoRef.current) darkLogoRef.current.style.clipPath = darkClip;
      if (whiteMenuRef.current) whiteMenuRef.current.style.clipPath = whiteClip;
      if (darkMenuRef.current) darkMenuRef.current.style.clipPath = darkClip;
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoSize = isMobille ? 48 : 98;
  const logoContainerSize = logoSize * 0.45;

  const menuBarsWhite = (
    <div ref={whiteMenuRef} className="flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px]">
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-white ${isHovered ? 'w-[70%]' : 'w-2/4'}`} />
      <div className={`h-[3px] self-start transition-all duration-300 ease-out bg-white ${isHovered ? 'w-[70%]' : 'w-3/4'}`} />
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-white ${isHovered ? 'w-[70%] translate-x-0' : 'w-2/4 translate-x-full'}`} />
    </div>
  );

  const menuBarsBlack = (
    <div ref={darkMenuRef} className="flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px]">
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-black ${isHovered ? 'w-[70%]' : 'w-2/4'}`} />
      <div className={`h-[3px] self-start transition-all duration-300 ease-out bg-black ${isHovered ? 'w-[70%]' : 'w-3/4'}`} />
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-black ${isHovered ? 'w-[70%] translate-x-0' : 'w-2/4 translate-x-full'}`} />
    </div>
  );

  return (
    <>
      <div id={styles.navbar} className="mainContainer pt-[2vh] sm:pt-[4vh] px-[3vw]">
        <div className={styles.navContent}>
          {/* White layer */}
          <div className={styles.navLayer}>
            <div className={`${styles.logo} ${styles.white}`} style={{ width: logoContainerSize }}>
              <div ref={whiteLogoRef}>
                <Image width={logoSize} height={logoSize} src="/images/LOGO.svg" alt="LJ Studio Logo" />
              </div>
            </div>
            {menuBarsWhite}
          </div>

          {/* Dark layer */}
          <div className={styles.navLayer}>
            <div className={`${styles.logo} ${styles.dark}`} style={{ width: logoContainerSize }}>
              <div ref={darkLogoRef}>
                <Image width={logoSize} height={logoSize} src="/images/LOGO.svg" alt="LJ Studio Logo" />
              </div>
            </div>
            {menuBarsBlack}
          </div>

          {/* Click layer */}
          <div className={`${styles.navLayer} ${styles.navClickLayer}`}>
            <div style={{ width: logoContainerSize }} />
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              className="cursor-pointer flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px] bg-transparent border-none p-0 opacity-0"
            >
              <div className="h-[3px] w-2/4 self-start" />
              <div className="h-[3px] w-3/4 self-start" />
              <div className="h-[3px] w-2/4 self-start" />
            </button>
          </div>
        </div>

        <SideMenu isOpen={isMenuOpen} onToggle={() => setIsMenuOpen(!isMenuOpen)} />
      </div>
    </>
  );
}