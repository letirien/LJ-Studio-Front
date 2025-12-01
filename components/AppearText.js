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
  style = {}
}) {
  const containerRef = useRef(null);
  const wordsRef = useRef([]);
  const tlRef = useRef(null);
  const inView = useInView(containerRef, { once });

  useEffect(() => {
    let gsapLib;
    let tl;
    let alive = true;

    async function run() {
      if (!containerRef.current) return;
      try {
        gsapLib = await import('gsap');
        const CustomEase = (await import('gsap/CustomEase')).CustomEase;
        gsapLib.gsap.registerPlugin(CustomEase);
        try { CustomEase.create('main', '0.65, 0.01, 0.05, 0.99'); } catch (e) {}
      } catch (err) {
        console.warn('Failed to load GSAP', err);
        return;
      }

      const gsap = gsapLib.gsap;

      // Flatten words into an array of DOM elements
      const allWords = (wordsRef.current || []).flat().filter(Boolean);

      if (!allWords.length) return;

      // allow layout to settle (fonts etc.)
      await new Promise((res) => setTimeout(res, 40));

      // Measure lines by top offset BEFORE we set transforms
      const lineMap = {};
      allWords.forEach((el) => {
        const top = Math.round(el.getBoundingClientRect().top);
        if (!lineMap[top]) lineMap[top] = [];
        lineMap[top].push(el);
      });
      const sortedKeys = Object.keys(lineMap).sort((a, b) => a - b);
      const lines = sortedKeys.map((k) => lineMap[k]);

      // initial state
      gsap.set(allWords, { yPercent, rotate, opacity: 0 });

      tl = gsap.timeline({ defaults: { ease: 'main', duration } });

      if (type === 'words') {
        tl.to(allWords, { yPercent: 0, rotate: 0, opacity: 1, stagger: wordStagger }, 0);
      } else {
        lines.forEach((line, li) => {
          tl.to(line, { yPercent: 0, rotate: 0, opacity: 1, stagger: wordStagger }, li * lineStagger);
        });
      }

      tlRef.current = tl;
    }

    // run when inView
    if (inView) {
      run();
    }

    const handleResize = () => {
      if (!inView) return;
      tlRef.current?.kill();
      run();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      alive = false;
      window.removeEventListener('resize', handleResize);
      try { tlRef.current?.kill(); } catch (e) {}
    };
  }, [inView, type, duration, wordStagger, lineStagger, yPercent, rotate, once]);

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

  return (
    <div ref={containerRef} className={className} style={{ ...style }}>
      <p aria-label={text} className="m-0 leading-[1.2]">
        {segments.map((segment, i) => {
          // If it's a space, render it directly (no animation)
          if (segment.isSpace) {
            return <span key={segment.key} style={{ whiteSpace: 'pre' }}>{segment.text}</span>;
          }
          
          // Otherwise it's a word - animate it
          return (
            <span
              key={segment.key}
              ref={(el) => {
                if (!wordsRef.current[0]) wordsRef.current[0] = [];
                wordsRef.current[0][i] = el;
              }}
              style={{ display: 'inline-block', opacity: 0, whiteSpace: 'pre' }}
              aria-hidden={true}
            >
              {segment.text}
            </span>
          );
        })}
      </p>
    </div>
  );
}
    