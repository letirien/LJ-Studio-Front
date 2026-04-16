'use client';

import React from 'react';
import { useEffect, useRef, useMemo, Children } from 'react';
import { motion } from 'framer-motion';

/**
 * HighlightText - Effet de mise en évidence caractère par caractère au scroll
 * 
 * - Utilise React pour renderer les spans (pas d'innerHTML)
 * - Calculs dérivés au lieu d'imperatives mutations
 * - SSR compatible
 */
export const HighlightText = ({ 
  children, 
  custom = 0,
  className = '',
  initial = "hidden",
  animate,
  variants,
  fadedValue = 0.2,
  staggerValue = 0.1,
  scrollStart = "top 90%",
  scrollEnd = "center 40%",
  ...props 
}) => {
  const containerRef = useRef(null);
  const charsRef = useRef([]);

  const wordData = useMemo(() => {
    // Extraire le contenu texte du children
    const textContent = typeof children === 'string' 
      ? children 
      : Children.toArray(children)
          .filter(child => typeof child === 'string')
          .join('');
    
    if (!textContent) return [];
    
    const words = textContent.split(' ');
    let charIndex = 0;
    
    return words.map((word, wordIndex) => {
      const charIndices = word.split('').map(() => charIndex++);
      return { word, charIndices, wordIndex };
    });
  }, [children]);

  useEffect(() => {
    if (!containerRef.current || wordData.length === 0) return;

    // Calculer le total de caractères pour le stagger
    const totalChars = wordData.reduce((sum, w) => sum + w.charIndices.length, 0);

    const parseScrollValue = (value) => {
      const match = value.match(/(top|center|bottom)\s+(\d+)%/);
      if (!match) return window.innerHeight * 0.9;
      
      const position = match[1];
      const percentage = parseFloat(match[2]) / 100;
      
      let base = 0;
      if (position === 'center') base = window.innerHeight / 2;
      if (position === 'bottom') base = window.innerHeight;
      
      return window.innerHeight * percentage;
    };

    const handleScroll = () => {
      requestAnimationFrame(() => {
        if (!containerRef.current) return;

        const rect = containerRef.current.getBoundingClientRect();
        const windowHeight = window.innerHeight;

        const startPoint = parseScrollValue(scrollStart);
        const endPoint = parseScrollValue(scrollEnd);
        
        const scrollStartPos = rect.top - startPoint;
        const scrollEndPos = rect.top + rect.height / 2 - endPoint;
        
        const totalDistance = Math.abs(scrollEndPos - scrollStartPos);
        const currentDistance = Math.abs(scrollStartPos);
        
        const progress = Math.min(Math.max(currentDistance / totalDistance, 0), 1);

        // Appliquer l'effet stagger sur chaque caractère
        charsRef.current.forEach((span, index) => {
          if (!span) return;
          const charDelay = index * staggerValue;
          const charProgress = Math.min(Math.max((progress - charDelay) / staggerValue, 0), 1);
          const opacity = fadedValue + charProgress * (1 - fadedValue);
          span.style.opacity = opacity.toString();
        });
      });
    };

    handleScroll();
    window.addEventListener('touchmove', handleScroll, { passive: true });
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [wordData, fadedValue, staggerValue, scrollStart, scrollEnd]);

  // Séparer le texte des autres éléments (comme RoundedIcon)
  const childrenArray = Children.toArray(children);
  const otherElements = childrenArray.filter(child => typeof child !== 'string');

  return (
    <motion.div
      ref={containerRef}
      initial={initial}
      animate={animate}
      variants={variants}
      custom={custom}
      className={className}
      {...props}
    >
      {wordData.map((wordItem, wordIndex) => (
        <React.Fragment key={wordIndex}>
          <span
            style={{
              display: 'inline-block',
              whiteSpace: 'nowrap',
            }}
          >
            {wordItem.charIndices.map((charIndex) => {
              const charPosition = charIndex;
              return (
                <span
                  key={charIndex}
                  ref={(el) => {
                    charsRef.current[charIndex] = el;
                  }}
                  style={{
                    display: 'inline-block',
                    opacity: fadedValue,
                    transition: 'opacity 0.1s linear',
                    willChange: 'opacity',
                    transform: 'translateZ(0)',
                    WebkitFontSmoothing: 'antialiased',
                  }}
                >
                  {wordItem.word[charPosition - wordItem.charIndices[0]]}
                </span>
              );
            })}
          </span>
          {wordIndex < wordData.length - 1 && ' '}
        </React.Fragment>
      ))}
      {otherElements}
    </motion.div>
  );
};

export default HighlightText;