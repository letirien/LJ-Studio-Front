'use client';

import { useEffect, useRef, useState } from 'react';

export default function PixelatedLogo({ isComplete, disappearDelay = 2450 }) {
  const [appearProgress, setAppearProgress] = useState(0);
  const [disappearProgress, setDisappearProgress] = useState(0);
  const appearAnimationRef = useRef(null);
  const disappearAnimationRef = useRef(null);

  const easeInOutCubic = (t) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

  // Phase 1: Apparition au montage
  useEffect(() => {
    const appearDuration = 600;
    const startTime = Date.now();

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / appearDuration, 1);
      setAppearProgress(easeInOutCubic(progress));

      if (progress < 1) {
        appearAnimationRef.current = requestAnimationFrame(animate);
      }
    };

    appearAnimationRef.current = requestAnimationFrame(animate);

    return () => {
      if (appearAnimationRef.current) {
        cancelAnimationFrame(appearAnimationRef.current);
      }
    };
  }, []);

  // Phase 2: Disparition après isComplete
  useEffect(() => {
    if (!isComplete) return;

    const disappearDuration = 600;
    const delayTimer = setTimeout(() => {
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / disappearDuration, 1);
        setDisappearProgress(easeInOutCubic(progress));

        if (progress < 1) {
          disappearAnimationRef.current = requestAnimationFrame(animate);
        }
      };

      disappearAnimationRef.current = requestAnimationFrame(animate);
    }, disappearDelay);

    return () => {
      clearTimeout(delayTimer);
      if (disappearAnimationRef.current) {
        cancelAnimationFrame(disappearAnimationRef.current);
      }
    };
  }, [isComplete, disappearDelay]);

  const finalOpacity = (1 - disappearProgress) * appearProgress;

  return (
    <div
      className="flex items-center space-x-2 relative w-[200px] sm:w-[300px] h-[40px] sm:h-[60px] overflow-hidden"
      style={{
        opacity: finalOpacity,
      }}
    >
      <svg
        viewBox="0 0 689.83765 89.09131"
        className="w-full h-full"
        style={{
          clipPath: `inset(0 ${(1 - appearProgress) * 100}% 0 ${disappearProgress * 100}%)`,
        }}
      >
        <g fill="black">
          <polygon points="375.49048 .00757 279.49731 .00757 255.33569 19.91821 255.34448 32.85107 278.88379 53.2583 366.87598 53.2583 366.87598 69.68018 256.49829 69.68018 256.49829 89.08838 366.56909 89.08838 390.20654 69.68286 390.20654 53.2583 365.95557 32.85107 279.19067 32.85107 279.19067 19.91064 375.49048 19.91064 375.49048 19.91553 427.55469 19.91553 427.55469 89.08838 452.07568 89.08838 452.07568 19.91553 506.27734 19.91553 506.27734 .00757 382.20483 .00757 375.49048 .00757"/>
          <path d="M639.06226.0105h-123.96802v89.08081h123.96802l24.88232-19.40845-.15991-49.76465L639.06226.0105ZM639.37183,69.68286h-99.12573V19.91821h99.12573v49.76465Z"/>
          <rect x="670.4292" y="69.67993" width="19.40845" height="19.40845"/>
          <polygon points="19.66699 0 0 0 0 69.18579 19.84973 89.05493 101.63208 89.05493 101.63208 68.47412 19.66699 68.47412 19.66699 0"/>
          <polygon points="209.05078 .00757 127.05737 .00757 127.05737 19.66504 209.05078 19.66504 209.05078 69.43115 127.05737 69.43115 127.05737 53.62988 107.39038 53.62988 107.39038 69.67139 127.39429 88.96338 208.83984 89.08838 228.71777 69.19067 228.71777 .00488 209.05078 .00488 209.05078 .00757"/>
        </g>
      </svg>
    </div>
  );
}
