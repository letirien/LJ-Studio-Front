import React, { useState, useEffect, useRef } from 'react';
import styles from './navbar.module.scss';
import Image from 'next/image';
import { SideMenu } from '../home/SideMenu';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isMobille, setIsMobille] = useState(false);

  const whiteLayerRef = useRef(null);
  const darkLayerRef = useRef(null);

  useEffect(() => {
    setIsMobille(window.innerWidth <= 768);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      // Use the navLayer rect as reference (clip-path is relative to this element)
      const layerEl = whiteLayerRef.current;
      if (!layerEl) return;

      const sectionsWhite = document.querySelectorAll('.intersectLogo.white');
      const sectionsBlack = document.querySelectorAll('.intersectLogo.black');
      const layerRect = layerEl.getBoundingClientRect();

      // Cache section data (rects + z-index) to avoid repeated reflows
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

      // Sort by z-index descending (highest z-index = topmost layer)
      allSections.sort((a, b) => b.zIndex - a.zIndex);

      // Find the logo color at a specific Y position
      const getColorAtY = (y) => {
        for (const { rect, color } of allSections) {
          if (rect.top <= y && rect.bottom >= y) {
            return color;
          }
        }
        return 'white'; // default for dark backgrounds
      };

      // Sample at the layer's own top/bottom (not the navbar's padded box)
      const topColor = getColorAtY(layerRect.top);
      const bottomColor = getColorAtY(layerRect.bottom);

      let whiteClip, darkClip;

      if (topColor === bottomColor) {
        // No split — show only one layer
        if (topColor === 'white') {
          whiteClip = 'inset(0)';
          darkClip = 'inset(100% 0 0 0)';
        } else {
          darkClip = 'inset(0)';
          whiteClip = 'inset(100% 0 0 0)';
        }
      } else {
        // Binary search for the exact split point
        let low = layerRect.top;
        let high = layerRect.bottom;
        while (high - low > 0.5) {
          const mid = (low + high) / 2;
          if (getColorAtY(mid) === topColor) {
            low = mid;
          } else {
            high = mid;
          }
        }

        // splitPx relative to the layer element (matches clip-path reference)
        const splitPx = high - layerRect.top;

        // 0.5px overlap to guarantee no sub-pixel gap
        if (topColor === 'white') {
          whiteClip = `inset(0 0 calc(100% - ${splitPx + 0.5}px) 0)`;
          darkClip = `inset(${Math.max(0, splitPx - 0.5)}px 0 0 0)`;
        } else {
          darkClip = `inset(0 0 calc(100% - ${splitPx + 0.5}px) 0)`;
          whiteClip = `inset(${Math.max(0, splitPx - 0.5)}px 0 0 0)`;
        }
      }

      // Direct DOM updates for performance (avoid React re-renders on scroll)
      if (whiteLayerRef.current) {
        whiteLayerRef.current.style.clipPath = whiteClip;
      }
      if (darkLayerRef.current) {
        darkLayerRef.current.style.clipPath = darkClip;
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const logoSize = isMobille ? 48 : 98;

  const menuBarsWhite = (
    <div className="flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px]">
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-white ${isHovered ? 'w-[70%]' : 'w-2/4'}`} />
      <div className={`h-[3px] self-start transition-all duration-300 ease-out bg-white ${isHovered ? 'w-[70%]' : 'w-3/4'}`} />
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-white ${isHovered ? 'w-[70%] translate-x-0' : 'w-2/4 translate-x-full'}`} />
    </div>
  );

  const menuBarsBlack = (
    <div className="flex flex-col justify-center items-center scale-[0.8] sm:scale-100 gap-[8px] w-[60px]">
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-black ${isHovered ? 'w-[70%]' : 'w-2/4'}`} />
      <div className={`h-[3px] self-start transition-all duration-300 ease-out bg-black ${isHovered ? 'w-[70%]' : 'w-3/4'}`} />
      <div className={`h-[3px] transition-all duration-300 ease-out self-start bg-black ${isHovered ? 'w-[70%] translate-x-0' : 'w-2/4 translate-x-full'}`} />
    </div>
  );

  return (
    <>
      <div id={styles.navbar} className="mainContainer pt-[2vh] sm:pt-[4vh] px-[3vw]">
        <div className={styles.navContent}>
          {/* White layer (visible over dark sections) */}
          <div ref={whiteLayerRef} className={styles.navLayer} style={{ clipPath: 'inset(0)' }}>
            <div className={`${styles.logo} ${styles.white}`}>
              <Image width={logoSize} height={logoSize} src="/images/LOGO.svg" alt="LJ Studio LOGO" style={{ objectFit: 'cover' }} />
            </div>
            {menuBarsWhite}
          </div>

          {/* Dark layer (visible over light sections) */}
          <div ref={darkLayerRef} className={styles.navLayer} style={{ clipPath: 'inset(100% 0 0 0)' }}>
            <div className={`${styles.logo} ${styles.dark}`}>
              <Image width={logoSize} height={logoSize} src="/images/LOGO.svg" alt="LJ Studio LOGO" style={{ objectFit: 'cover' }} />
            </div>
            {menuBarsBlack}
          </div>

          {/* Click & hover layer (transparent, on top) */}
          <div className={`${styles.navLayer} ${styles.navClickLayer}`}>
            <div style={{ width: logoSize, height: logoSize }} />
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
