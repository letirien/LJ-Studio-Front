import { useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Collab = ({logos}) => {
  const containerRef = useRef(null);
  // Diviser les logos en deux rangées
  const topRowLogos = logos.slice(0, (logos.length / 2));
  const bottomRowLogos = logos.slice((logos.length /2), logos.length);
  bottomRowLogos.forEach((logo)=>{
    console.log(logo)
  })
  console.log(topRowLogos)
  console.log(bottomRowLogos)
  useEffect(() => {
    const initMarquees = async () => {
      // Dynamically import GSAP to avoid SSR issues
      const gsapModule = await import('gsap');
      const gsap = gsapModule.gsap;
      
      // Import ScrollTrigger dynamically
      const scrollTriggerModule = await import('gsap/dist/ScrollTrigger');
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      // Register the plugin
      gsap.registerPlugin(ScrollTrigger);
      
      // Initialize each marquee
      document.querySelectorAll('[data-marquee-scroll-direction]').forEach((marquee) => {
        // Query marquee elements
        const marqueeScroll = marquee.querySelector('[data-marquee-scroll]');
        const marqueeCollections = marquee.querySelectorAll('[data-marquee-collection]');
        
        if (!marqueeScroll || !marqueeCollections.length) return;
        
        // Get data attributes
        const speed = parseFloat(marquee.dataset.marqueeSpeed) || 20;
        const direction = marquee.dataset.marqueeDirection === 'right' ? 1 : -1; // 1 for right, -1 for left
        const scrollSpeed = parseFloat(marquee.dataset.marqueeScrollSpeed) || 10;
        
        // Calculate appropriate speed based on content width and viewport
        const speedMultiplier = window.innerWidth < 479 ? 0.25 : window.innerWidth < 991 ? 0.5 : 1;
        const collectionWidth = marqueeCollections[0].offsetWidth;
        const viewportWidth = window.innerWidth;
        const marqueeSpeed = speed * (collectionWidth / viewportWidth) * speedMultiplier;
        
        // Set width and margin for the scroll container to create parallax effect
        marqueeScroll.style.marginLeft = `${scrollSpeed * -1}%`;
        marqueeScroll.style.width = `${(scrollSpeed * 2) + 100}%`;
        
        // Ensure enough logos to cover the screen by duplicating collections if needed
        if (marqueeCollections.length < 3) {
          const fragment = document.createDocumentFragment();
          for (let i = 0; i < 3 - marqueeCollections.length; i++) {
            fragment.appendChild(marqueeCollections[0].cloneNode(true));
          }
          marqueeScroll.appendChild(fragment);
        }
        
        // Get all collections after potentially adding clones
        const allCollections = marquee.querySelectorAll('[data-marquee-collection]');
        
        // Create the main animation for infinite scrolling
        const animation = gsap.to(allCollections, {
          xPercent: -100, // Move completely out of view
          repeat: -1,
          duration: marqueeSpeed,
          ease: 'none'
        }).totalProgress(0.5);
        
        // Initialize marquee in the correct direction
        gsap.set(allCollections, { xPercent: direction === 1 ? 0 : -100 });
        animation.timeScale(direction);
        
        // Set initial status
        marquee.setAttribute('data-marquee-status', 'normal');
        
        // ScrollTrigger for direction inversion - exactly as in the original code
        ScrollTrigger.create({
          trigger: marquee,
          start: 'top bottom',
          end: 'bottom top',
          onUpdate: (self) => {
            const isInverted = self.direction === 1; // Scrolling down
            const currentDirection = isInverted ? -direction : direction;
            
            // Update animation direction and marquee status
            animation.timeScale(currentDirection);
            marquee.setAttribute('data-marquee-status', isInverted ? 'inverted' : 'normal');
          }
        });
        
        // Extra parallax effect on scroll - exactly as in the original code
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: marquee,
            start: '0% 100%',
            end: '100% 0%',
            scrub: 0
          }
        });
        
        const scrollStart = direction === -1 ? scrollSpeed : -scrollSpeed;
        const scrollEnd = -scrollStart;
        
        tl.fromTo(marqueeScroll, 
          { x: `${scrollStart}vw` }, 
          { x: `${scrollEnd}vw`, ease: 'none' }
        );
      });
    };
    
    // Initialize when DOM is ready
    if (document.readyState === 'complete') {
      initMarquees();
    } else {
      window.addEventListener('load', initMarquees);
      return () => window.removeEventListener('load', initMarquees);
    }
  }, []);

  return (
    <div className="section-collab" ref={containerRef}>
      {/* Marquee pour la rangée du haut */}
      <div 
        className="marquee-advanced" 
        data-marquee-scroll-direction 
        data-marquee-direction="left" 
        data-marquee-status="normal" 
        data-marquee-speed="15" 
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
                      alt={`Partner logo ${index}`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </a>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="logo-divider"></div>
      
      {/* Marquee pour la rangée du bas */}
      <div 
        className="marquee-advanced" 
        data-marquee-scroll-direction 
        data-marquee-direction="right" 
        data-marquee-status="normal" 
        data-marquee-speed="15" 
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
                      alt={`Partner logo ${index}`}
                      fill
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
          padding: 4rem 0;
          overflow: hidden;
        }
        
        .marquee-advanced {
          width: 100%;
          position: relative;
          overflow: hidden;
          padding: 1.5rem 0;
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
          padding: 0 1rem;
          flex-shrink: 0;
        }
        
        .logo-wrapper {
          flex-shrink: 0;
          position: relative;
          height: 80px;
          width: 150px;
          filter: grayscale(100%) brightness(0.8);
          transition: filter 0.3s ease;
        }
        
        .logo-wrapper:hover {
          filter: grayscale(0) brightness(1);
        }
        
        .logo-divider {
          width: 100%;
          height: 1px;
          background-color: rgba(255, 255, 255, 0.2);
          margin: 0.5rem 0;
        }
        
        @media (max-width: 768px) {
          .logo-wrapper {
            width: 100px;
            height: 60px;
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
