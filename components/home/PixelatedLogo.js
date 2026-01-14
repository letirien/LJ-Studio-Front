'use client';

import { useEffect, useRef, useState } from 'react';

export default function PixelatedLogo({ isComplete }) {
  const svgRef = useRef(null);
  const rectsRef = useRef([]);
  const animationStartedRef = useRef(false);
  const isCompleteRef = useRef(isComplete); // Ref pour tracker isComplete

  const [svgData, setSvgData] = useState(null);
  const [ready, setReady] = useState(false);

  // Mettre à jour la ref quand isComplete change
  useEffect(() => {
    isCompleteRef.current = isComplete;
  }, [isComplete]);

  useEffect(() => {
    fetch('/pixelatedLogoData.txt')
      .then(res => res.text())
      .then(text => {
        const lines = text.split('\n').map(l => l.trim());
        const viewBoxLine = lines.find(l => l.startsWith('viewBox='));
        const rectStart = lines.findIndex(l => l.startsWith('<rect'));
        setSvgData({
          viewBox: viewBoxLine ? viewBoxLine.replace(/viewBox=|"/g, '') : '0 0 100 100',
          rects: rectStart >= 0 ? lines.slice(rectStart).join('\n') : '',
        });
      });
  }, []);

  useEffect(() => {
    if (!svgRef.current || !svgData) return;
    const rects = svgRef.current.querySelectorAll('rect');
    rectsRef.current = Array.from(rects);

    rectsRef.current.forEach(rect => {
      rect.style.opacity = '0';
      rect.style.transform = 'scale(0.3)';
      rect.style.transformOrigin = 'center center';
      rect.style.fill = '#000';
    });

    setReady(true);
  }, [svgData]);

  useEffect(() => {
    if (!ready || animationStartedRef.current) return;
    animationStartedRef.current = true;

    const dots = rectsRef.current.map(rect => ({
      rect,
      brightness: 0,
      randomDelay: Math.random() * 30 - 15,
      randomDelayOff: Math.random() * 30 - 15,
      x: parseFloat(rect.getAttribute('x') || 0),
    }));

    dots.sort((a, b) => a.x - b.x);

    let animationProgress = 0;
    let fadeProgress = 0;
    const speed = 0.8;
    let phase = 'appearing';
    let rafId;

    function animate() {
      const total = dots.length;

      // Apparition
      if (phase === 'appearing') {
        animationProgress += speed;
        dots.forEach((dot, i) => {
          const point = (i / total) * 100 + dot.randomDelay;
          if (animationProgress >= point) {
            dot.brightness = Math.min(1, (animationProgress - point) / 3);
          }
        });

        // Une fois tous les pixels apparus → phase idle
        if (dots.every(d => d.brightness >= 0.999)) {
          dots.forEach(dot => (dot.brightness = 1));
          phase = 'idle';
        }
      }

      // Phase idle : attendre isComplete via la ref
      else if (phase === 'idle') {
        if (isCompleteRef.current) {  // Utiliser la ref au lieu de la variable
          phase = 'fading';
          fadeProgress = 0;
        }
      }

      // Disparition
      else if (phase === 'fading') {
        fadeProgress += speed;
        dots.forEach((dot, i) => {
          const point = (i / total) * 100 + dot.randomDelayOff;
          dot.brightness = fadeProgress <= point ? 1 : Math.max(0, 1 - (fadeProgress - point) / 3);
        });

        if (dots.every(d => d.brightness <= 0.001)) {
          cancelAnimationFrame(rafId);
          return;
        }
      }

      dots.forEach(dot => {
        const b = dot.brightness;
        dot.rect.style.opacity = b.toString();
        dot.rect.style.transform = `scale(${0.3 + 0.7 * b})`;
      });

      rafId = requestAnimationFrame(animate);
    }

    rafId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(rafId);
  }, [ready]); // isComplete retiré des dépendances car on utilise la ref

  if (!svgData) {
    return (
      <svg
        className="w-[160px] sm:w-[240px] h-auto"
        viewBox="0 0 100 100"
        xmlns="http://www.w3.org/2000/svg"
        shapeRendering="crispEdges"
      >
        <rect width="100%" height="100%" fill="transparent" />
      </svg>
    );
  }

  return (
    <svg
      ref={svgRef}
      viewBox={svgData.viewBox}
      xmlns="http://www.w3.org/2000/svg"
      className="w-[98px] sm:w-[240px] h-auto"
      shapeRendering="crispEdges"
    >
      {svgData.rects ? (
        <g dangerouslySetInnerHTML={{ __html: svgData.rects }} />
      ) : (
        <rect width="100%" height="100%" fill="transparent" />
      )}
    </svg>
  );
}