import React, { useEffect, useRef } from 'react';
import { useInView } from 'framer-motion';

// AppearText: animate a string by words or by visual lines using GSAP
// Props:
// - children: string
// - type: 'words' | 'lines' (default 'words')
// - className: string
// - duration: number (default 0.6)
// - wordStagger: number (default 0.02)
// - lineStagger: number (default 0.08)
// - yPercent, rotate
// - once: bool (default true)
export default function AppearText({
  children,
  type = 'lines',
  className = '',
  duration = 0.6,
  wordStagger = 0.02,
  lineStagger = 0.08,
  yPercent = 140,
  rotate = 10,
  once = false,
  style = {},
  hover = false
}) {
  const containerRef = useRef(null);
  const wordsRef = useRef([]); // [0] = original, [1] = duplicate
  const tlRef = useRef(null);
  const inView = useInView(containerRef, { once });

  // Animation runner
  const animateText = async (wordSet, from, to, appear = true) => {
    if (!containerRef.current) return;
    let gsapLib;
    try {
      gsapLib = await import('gsap');
      const CustomEase = (await import('gsap/CustomEase')).CustomEase;
      gsapLib.gsap.registerPlugin(CustomEase);
      try { CustomEase.create('main', '0.65, 0.01, 0.05, 0.99'); } catch (e) {}
    } catch (err) {
      return;
    }
    const gsap = gsapLib.gsap;
    const allWords = (wordsRef.current[wordSet] || []).filter(Boolean);
    if (!allWords.length) return;
    await new Promise((res) => setTimeout(res, 20));
    gsap.set(allWords, { yPercent: from, opacity: appear ? 0 : 1 });
    await gsap.to(allWords, { 
      yPercent: to, 
      opacity: appear ? 1 : 0, 
      duration, 
      stagger: wordStagger, 
      ease: 'main' 
    });
  };

  // Effet pour la visibilité (inView)
  useEffect(() => {
    if (hover) return;
    let alive = true;
    if (inView) {
      animateText(0, yPercent, 0, true); // apparition classique du bas
    } else {
      // Si pas inView, afficher normalement
      const showWords = async () => {
        let gsapLib;
        try {
          gsapLib = await import('gsap');
        } catch (err) {
          return;
        }
        const gsap = gsapLib.gsap;
        const allWords = (wordsRef.current[0] || []).filter(Boolean);
        if (!allWords.length) return;
        gsap.set(allWords, { yPercent: 0, rotate: 0, opacity: 1 });
      };
      showWords();
    }
    const handleResize = () => {
      if (!inView) return;
      tlRef.current?.kill();
      animateText(0, yPercent, 0, true);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      alive = false;
      window.removeEventListener('resize', handleResize);
      try { tlRef.current?.kill(); } catch (e) {}
    };
  }, [inView, type, duration, wordStagger, lineStagger, yPercent, rotate, once, hover]);

  // Animation au hover avec texte dupliqué
  const handleMouseEnter = async () => {
    if (!hover) return;
    // Animation simultanée : original part vers le haut, duplicate arrive du bas
    Promise.all([
      animateText(0, 0, -yPercent, false), // original disparaît vers le haut
      animateText(1, yPercent, 0, true)    // duplicate apparaît du bas
    ]);
  };

  const handleMouseLeave = async () => {
    if (!hover) return;
    // Animation simultanée : duplicate part vers le bas, original revient du haut
    Promise.all([
      animateText(1, 0, yPercent, false),  // duplicate disparaît vers le bas
      animateText(0, -yPercent, 0, true)   // original revient du haut
    ]);
  };

  // Render: split words and render as inline-block spans
  const text = typeof children === 'string' ? children : (children ? String(children) : '');
  
  // Split by spaces while preserving them
  const tokens = text.split(/(\s+)/);
  
  // Filter out empty strings and map to word/space objects
  const segments = tokens.filter(Boolean).map((token, i) => ({
    text: token,
    isSpace: /^\s+$/.test(token),
    key: i
  }));

  const renderSegments = (wordSetIndex) => (
    segments.map((segment, i) => {
      if (segment.isSpace) {
        return <span key={segment.key} style={{ whiteSpace: 'pre' }}>{segment.text}</span>;
      }
      return (
        <span
          key={segment.key}
          ref={(el) => {
            if (!wordsRef.current[wordSetIndex]) wordsRef.current[wordSetIndex] = [];
            wordsRef.current[wordSetIndex][i] = el;
          }}
          style={{ display: 'inline-block', opacity: 1, whiteSpace: 'pre' }}
          aria-hidden={wordSetIndex === 1}
        >
          {segment.text}
        </span>
      );
    })
  );

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ ...style, position: 'relative' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Texte original */}
      <p aria-label={text} className="m-0 leading-[1.2]">
        {renderSegments(0)}
      </p>
      
      {/* Texte dupliqué (seulement si hover activé) */}
      {hover && (
        <p 
          aria-hidden={true} 
          className="m-0 leading-[1.2]"
          style={{ position: 'absolute', top: 0, left: 0, width: '100%' }}
        >
          {renderSegments(1)}
        </p>
      )}
    </div>
  );
}