import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useLoading } from '../../lib/LoadingManager';

const Collab = ({logos}) => {
  const containerRef = useRef(null);
  const { onLoadingComplete } = useLoading();
  const animationsRef = useRef([]);
  const scrollTriggersRef = useRef([]);

  // Diviser les logos en deux rangées
  const topRowLogos = logos.slice(0, (logos.length / 2));
  const bottomRowLogos = logos.slice((logos.length /2), logos.length);

  useEffect(() => {
    let gsap, ScrollTrigger;

    const initMarquees = async () => {
      // Dynamically import GSAP to avoid SSR issues
      const gsapModule = await import('gsap');
      gsap = gsapModule.gsap;

      // Import ScrollTrigger dynamically
      const scrollTriggerModule = await import('gsap/dist/ScrollTrigger');
      ScrollTrigger = scrollTriggerModule.ScrollTrigger;

      // Register the plugin
      gsap.registerPlugin(ScrollTrigger);

      // Refresh ScrollTrigger pour recalculer les positions
      ScrollTrigger.refresh();

      // Initialize each marquee — collect animations + directions for the shared trigger
      const marqueeAnims = []; // { animation, direction, marquee }

      document.querySelectorAll('[data-marquee-scroll-direction]').forEach((marquee) => {
        const marqueeScroll = marquee.querySelector('[data-marquee-scroll]');
        const marqueeCollections = marquee.querySelectorAll('[data-marquee-collection]');

        if (!marqueeScroll || !marqueeCollections.length) return;

        const speed = parseFloat(marquee.dataset.marqueeSpeed) || 20;
        const direction = marquee.dataset.marqueeDirection === 'right' ? 1 : -1;
        const scrollSpeed = parseFloat(marquee.dataset.marqueeScrollSpeed) || 10;

        const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
        const collectionWidth = marqueeCollections[0].offsetWidth;
        const viewportWidth = window.innerWidth;
        const marqueeSpeed = speed * (collectionWidth / viewportWidth) * speedMultiplier;

        marqueeScroll.style.marginLeft = `${scrollSpeed * -1}%`;
        marqueeScroll.style.width = `${(scrollSpeed * 2) + 100}%`;

        if (marqueeCollections.length < 3) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < 3 - marqueeCollections.length; i++) {
            fragment.appendChild(marqueeCollections[0].cloneNode(true));
          }
          marqueeScroll.appendChild(fragment);
        }

        const allCollections = marquee.querySelectorAll('[data-marquee-collection]');

        const animation = gsap.to(allCollections, {
          xPercent: -100,
          repeat: -1,
          duration: marqueeSpeed,
          ease: 'none'
        }).totalProgress(0.5);

        animationsRef.current.push(animation);
        animation.timeScale(direction);
        marquee.setAttribute('data-marquee-status', 'normal');

        marqueeAnims.push({ animation, direction, marquee });

        // Extra parallax effect on scroll (independant du trigger de direction)
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: marquee,
            start: '0% 100%',
            end: '100% 0%',
            scrub: 0
          }
        });
        scrollTriggersRef.current.push(tl.scrollTrigger);

        const scrollStart = direction === -1 ? scrollSpeed : -scrollSpeed;
        tl.fromTo(marqueeScroll,
          { x: `${scrollStart}vw` },
          { x: `${-scrollStart}vw`, ease: 'none' }
        );
      });

      // Un seul ScrollTrigger sur le container pour synchroniser les deux lignes
      // → évite que Lenis fire onEnter sur l'une et onEnterBack sur l'autre
      if (marqueeAnims.length > 0) {
        const setAll = (inverted) => {
          marqueeAnims.forEach(({ animation, direction, marquee }) => {
            animation.timeScale(inverted ? -direction : direction);
            marquee.setAttribute('data-marquee-status', inverted ? 'inverted' : 'normal');
          });
        };

        let lastDir = 0;
        const st1 = ScrollTrigger.create({
          trigger: containerRef.current,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            if (self.direction === lastDir) return; // évite les micro-oscillations Lenis
            lastDir = self.direction;
            setAll(self.direction === 1);
          },
          onLeave: () => setAll(true),
          onLeaveBack: () => setAll(false),
        });
        scrollTriggersRef.current.push(st1);
      }
    };

    // Attendre que le loader soit terminé avant d'initialiser
    const cleanup = onLoadingComplete(() => {
      // Double RAF pour s'assurer que le layout est stable
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          initMarquees();
        });
      });
    });

    return () => {
      cleanup();
      // Cleanup animations
      animationsRef.current.forEach(anim => anim?.kill?.());
      scrollTriggersRef.current.forEach(st => st?.kill?.());
      animationsRef.current = [];
      scrollTriggersRef.current = [];
    };
  }, [onLoadingComplete]);

  return (
    <div className="section-collab sm:mt-24 pb-12 sm:pb-32 relative z-3 bg-black" ref={containerRef}>
      {/* Marquee pour la rangée du haut */}
      <div 
        className="marquee-advanced" 
        data-marquee-scroll-direction 
        data-marquee-direction="left" 
        data-marquee-status="normal" 
        data-marquee-speed="30" 
        data-marquee-scroll-speed="10"
      >
        <div className="marquee-advanced__scroll" data-marquee-scroll>
          {[1, 2, 3, 4].map((group) => (
            <div key={`top-group-${group}`} className="marquee-advanced__collection" data-marquee-collection>
              {topRowLogos.map((logo, index) => (
                <div key={`top-${group}-${index}`} className="marquee-advanced__item">
                  <a className="logo-wrapper" href={logo.fields?.URL} target='_blank'>
                    <Image
                      src={logo.fields.Logo[0].url}
                      alt={logo.fields?.Name || `Partner logo ${index + 1}`}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'contain' }}
                    />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
    <div className="logo-divider my-8 sm:my-12"></div>
      
      {/* Marquee pour la rangée du bas */}
      <div 
        className="marquee-advanced" 
        data-marquee-scroll-direction 
        data-marquee-direction="right" 
        data-marquee-status="normal" 
        data-marquee-speed="30" 
        data-marquee-scroll-speed="10"
      >
        <div className="marquee-advanced__scroll" data-marquee-scroll>
          {[1, 2, 3, 4].map((group) => (
            <div key={`bottom-group-${group}`} className="marquee-advanced__collection" data-marquee-collection>
              {bottomRowLogos.map((logo, index) => (
                <div key={`bottom-${group}-${index}`} className="marquee-advanced__item">
                  <a className="logo-wrapper" href={logo.fields?.URL} target='_blank'>
                    <Image
                      src={logo.fields.Logo[0].url}
                      alt={logo.fields?.Name || `Partner logo ${index + 1}`}
                      fill
                      sizes="100px"
                      style={{ objectFit: 'contain' }}
                    />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .section-collab {
          width: 100%;
          background-color: #000;
          overflow: hidden;
        }
        
        .marquee-advanced {
          width: 100%;
          position: relative;
          overflow: hidden;
        }
        
        .marquee-advanced__scroll {
          will-change: transform;
          width: 100%;
          display: flex;
          position: relative;
        }
        
        .marquee-advanced__collection {
          will-change: transform;
          display: flex;
          position: relative;
          flex-shrink: 0;
        }
        
        .marquee-advanced__item {
          display: flex;
          align-items: center;
          padding: 0 28px;
          flex-shrink: 0;
        }
        
        .logo-wrapper {
          flex-shrink: 0;
          position: relative;
          height: 80px;
          width: 100px;
          opacity: 0.5;
          filter: grayscale(100%) brightness(0.8);
          transition: filter 0.3s ease;
        }
        
        .logo-wrapper:hover {
          filter: grayscale(0) brightness(1);
           opacity: 1;
        }
        
        .logo-divider {

          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
        }
        
        @media (max-width: 768px) {
          .logo-wrapper {
            width: 80px;
            height: 40px;
          }
          
          .marquee-advanced__item {
            padding: 0 0.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default Collab;
