import { useRef, useCallback } from 'react';

// PNG images paths
const ICONS = [
  '/images/emojiRain/ICONE_EMOJI.png',
  '/images/emojiRain/ICONE_LJ.png',
];

export default function IconRain({ containerRef }) {
  const isAnimating = useRef(false);
  const iconElements = useRef([]);

  const getRandomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

  const triggerRain = useCallback(async () => {
    if (isAnimating.current || !containerRef?.current) return;
    isAnimating.current = true;

    let gsap;
    try {
      const gsapModule = await import('gsap');
      gsap = gsapModule.gsap;
    } catch (err) {
      console.error('GSAP not available');
      isAnimating.current = false;
      return;
    }

    const container = containerRef.current;
    const containerHeight = container.offsetHeight;
    const iconQuantity = 30;

    const createIconElement = () => {
      const iconSrc = ICONS[getRandomInt(0, ICONS.length - 1)];
      const iconSize = getRandomInt(70, 220);
      const iconScale = Math.random() * 1.2 + 0.8;
      const iconRotate = getRandomInt(-30, 30);
      const iconDelay = 0.001 * getRandomInt(0, 1200);
      const iconSpeed = getRandomInt(600, 1400) * 0.001;
      const iconPosition = `${getRandomInt(5, 95)}%`;

      const wrapper = document.createElement('div');
      wrapper.className = 'icon-rain-item';
      wrapper.style.cssText = `
        position: absolute;
        left: ${iconPosition};
        bottom: -${iconSize + 20}px;
        transform: translateX(-50%);
        pointer-events: none;
        will-change: transform;
        z-index: 30;
      `;

      const img = document.createElement('img');
      img.src = iconSrc;
      img.width = iconSize;
      img.height = iconSize;
      img.style.cssText = `
        width: ${iconSize}px;
        height: ${iconSize}px;
        object-fit: contain;
      `;

      wrapper.appendChild(img);
      container.appendChild(wrapper);
      iconElements.current.push(wrapper);

      // Animate from bottom (outside container) to top (outside container)
      gsap.fromTo(
        wrapper,
        {
          y: 0,
          scale: iconScale,
          rotation: iconRotate * 0.3
        },
        {
          y: -(containerHeight + iconSize + 100),
          scale: iconScale,
          rotation: iconRotate,
          duration: iconSpeed,
          delay: iconDelay,
          ease: 'power1.out',
        }
      );

      // Add wobble animation
      gsap.to(wrapper, {
        x: getRandomInt(-20, 20),
        duration: 0.4,
        repeat: 3,
        yoyo: true,
        ease: 'sine.inOut',
        delay: iconDelay
      });
    };

    // Create all icons
    for (let i = 0; i < iconQuantity; i++) {
      createIconElement();
    }

    // Cleanup after animation
    setTimeout(() => {
      iconElements.current.forEach(el => el.remove());
      iconElements.current = [];
      isAnimating.current = false;
    }, 2500);
  }, [containerRef]);

  return { triggerRain };
}
