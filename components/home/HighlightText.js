'use client';

import { useEffect, useRef, Children } from 'react';
import { motion } from 'framer-motion';

/**
 * Composant qui ajoute l'effet de highlight caractère par caractère au scroll
 * Remplace motion.p pour les textes qui doivent avoir l'effet
 * 
 * Usage: Remplacez <motion.p> par <HighlightText> pour les textes sans catHighlight
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
  const textRef = useRef(null);
  const containerRef = useRef(null);
  const charsRef = useRef([]);

  useEffect(() => {
    if (!textRef.current) return;

    // Split le texte en mots
    const text = textRef.current.textContent;
    const words = text.split(' ');
    
    // Créer des spans pour chaque mot, puis pour chaque caractère
    textRef.current.innerHTML = '';
    let charIndex = 0;
    
    words.forEach((word, wordIndex) => {
      // Créer un span pour le mot (permet le wrap)
      const wordSpan = document.createElement('span');
      wordSpan.style.display = 'inline-block';
      wordSpan.style.whiteSpace = 'nowrap'; // Empêche la coupure du mot
      
      // Créer des spans pour chaque caractère du mot
      word.split('').forEach((char) => {
        const charSpan = document.createElement('span');
        charSpan.textContent = char;
        charSpan.style.opacity = fadedValue.toString();
        charSpan.style.transition = 'opacity 0.1s linear';
        charSpan.style.display = 'inline-block';
        wordSpan.appendChild(charSpan);
        charsRef.current[charIndex] = charSpan;
        charIndex++;
      });
      
      textRef.current.appendChild(wordSpan);
      
      // Ajouter un espace après chaque mot sauf le dernier
      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement('span');
        spaceSpan.textContent = ' ';
        spaceSpan.style.opacity = fadedValue.toString();
        spaceSpan.style.transition = 'opacity 0.1s linear';
        spaceSpan.style.display = 'inline-block';
        spaceSpan.style.whiteSpace = 'pre';
        textRef.current.appendChild(spaceSpan);
        charsRef.current[charIndex] = spaceSpan;
        charIndex++;
      }
    });

    const handleScroll = () => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;

      // Parser les valeurs de scroll start/end
      const parseScrollValue = (value) => {
        const match = value.match(/(top|center|bottom)\s+(\d+)%/);
        if (!match) return windowHeight * 0.9;
        
        const position = match[1];
        const percentage = parseFloat(match[2]) / 100;
        
        let base = 0;
        if (position === 'center') base = windowHeight / 2;
        if (position === 'bottom') base = windowHeight;
        
        return windowHeight * percentage;
      };

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
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [children, fadedValue, staggerValue, scrollStart, scrollEnd]);

  // Séparer le texte des autres éléments (comme RoundedIcon)
  const childrenArray = Children.toArray(children);
  const textContent = childrenArray.filter(child => typeof child === 'string').join('');
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
      <span ref={textRef}>{textContent}</span>
      {otherElements}
    </motion.div>
  );
};

export default HighlightText;