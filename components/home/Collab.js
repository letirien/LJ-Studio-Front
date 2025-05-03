import { useEffect, useRef } from 'react';
import Image from 'next/image';

const Collab = () => {
  const containerRef = useRef(null);
  
  const logoFiles = [
    'Ligue_1_Uber_Eats.svg',
    'Eurosport New.png',
    'Paris_Saint-Germain_F.C..png',
    'ffbb.png',
    'sb29.png',
    'LFP_e5d2655ef3.webp',
    '6214aaace5b628591b3144b5_EAJF_HD.png',
    'lille@logotyp.us.png',
    'Logo_Roland-Garros.svg.webp',
    'Amazon_Prime_Video_logo.svg.png',
    'Logo_Ligue_2_BKT_2024.svg.png',
    'Logo_AS_Monaco_FC_-_2021.svg.png'
  ];

  // Diviser les logos en deux rangées
  const topRowLogos = logoFiles.slice(0, Math.ceil(logoFiles.length / 2));
  const bottomRowLogos = logoFiles.slice(Math.ceil(logoFiles.length / 2));

  useEffect(() => {
    // Dynamically import GSAP to avoid SSR issues
    const initMarquees = async () => {
      const gsapModule = await import('gsap');
      const gsap = gsapModule.gsap;
      
      // Import ScrollTrigger dynamically
      const scrollTriggerModule = await import('gsap/dist/ScrollTrigger');
      const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
      
      // Register the plugin
      gsap.registerPlugin(ScrollTrigger);
      
      // Variables for scroll effects
      let lastScrollPosition = 0;
      let scrollTimeout;
      let isAccelerating = false;
      let lastScrollDirection = null;
      let scrollDetectionThreshold = 2; // Seuil minimal de défilement pour détecter un changement de direction
      let lastDirectionChangeTime = 0;
      let directionChangeCooldown = 300; // Temps minimal entre deux changements de direction (en ms)
      let isDirectionLocked = false;
      let wheelEvents = [];
      let wheelProcessTimeout;
      
      // Store animation references
      const marqueeData = [];
      
      // Initialize each marquee
      document.querySelectorAll('[data-marquee-scroll-direction]').forEach((marquee) => {
        // Query marquee elements
        const marqueeScroll = marquee.querySelector('[data-marquee-scroll]');
        const marqueeCollections = marquee.querySelectorAll('[data-marquee-collection]');
        
        if (!marqueeScroll || !marqueeCollections.length) return;
        
        // Get data attributes
        const baseSpeed = parseFloat(marquee.dataset.marqueeSpeed) || 35;
        const baseDirection = marquee.dataset.marqueeDirection === 'right' ? 1 : -1;
        const scrollSpeed = parseFloat(marquee.dataset.marqueeScrollSpeed) || 5;
        const boostFactor = parseFloat(marquee.dataset.marqueeBoostFactor) || 3;
        
        // Ensure enough logos to cover the screen
        const collectionWidth = marqueeCollections[0].offsetWidth;
        const viewportWidth = window.innerWidth;
        const totalWidth = collectionWidth * marqueeCollections.length;
        
        if (totalWidth < viewportWidth * 3) {
          const cloneCount = Math.ceil((viewportWidth * 3 - totalWidth) / collectionWidth);
          for (let i = 0; i < cloneCount; i++) {
            const clone = marqueeCollections[0].cloneNode(true);
            marqueeScroll.appendChild(clone);
          }
        }
        
        // Get all collections after potentially adding clones
        const allCollections = marquee.querySelectorAll('[data-marquee-collection]');
        
        // Calculate appropriate speed
        const speedMultiplier = window.innerWidth < 479 ? 0.4 : window.innerWidth < 991 ? 0.6 : 1;
        const duration = baseSpeed * (collectionWidth / viewportWidth) * speedMultiplier;
        
        // Create and configure the main animation
        const animation = gsap.to(allCollections, {
          xPercent: -100,
          repeat: -1,
          duration,
          ease: "none",
        }).totalProgress(0.5);
        
        // Set initial direction
        animation.timeScale(baseDirection);
        
        // Store reference to animation and its configuration
        marqueeData.push({
          element: marquee,
          animation,
          baseDirection,
          currentDirection: baseDirection,
          baseSpeed: duration,
          boostFactor,
          isInverted: false
        });
        
        // Create a separate timeline for the subtle parallax effect
        gsap.timeline({
          scrollTrigger: {
            trigger: marquee,
            start: '0% 100%',
            end: '100% 0%',
            scrub: 0.8
          }
        }).fromTo(
          marqueeScroll, 
          { x: `${baseDirection * -scrollSpeed}vw` }, 
          { x: `${baseDirection * scrollSpeed}vw`, ease: 'none' }
        );
      });
      
      // Fonction pour changer la direction des marquees avec une protection contre les changements trop fréquents
      const changeMarqueeDirection = (shouldBeInverted) => {
        const now = Date.now();
        
        // Vérifier si nous sommes en période de cooldown pour éviter des changements trop rapides
        if (isDirectionLocked || now - lastDirectionChangeTime < directionChangeCooldown) {
          return false;
        }
        
        // Vérifier si l'état demandé est différent de l'état actuel
        const firstMarquee = marqueeData[0];
        if (!firstMarquee || firstMarquee.isInverted === shouldBeInverted) {
          return false; // Pas de changement nécessaire
        }
        
        // Mettre à jour le timestamp du dernier changement
        lastDirectionChangeTime = now;
        
        // Verrouiller temporairement la direction pour éviter les oscillations
        isDirectionLocked = true;
        setTimeout(() => {
          isDirectionLocked = false;
        }, directionChangeCooldown / 2);
        
        marqueeData.forEach(data => {
          // Mettre à jour l'état d'inversion
          data.isInverted = shouldBeInverted;
          
          // Calculer la nouvelle direction
          data.currentDirection = shouldBeInverted ? -data.baseDirection : data.baseDirection;
          
          // Récupérer le facteur d'accélération actuel (si une accélération est en cours)
          const currentSpeedFactor = Math.abs(data.animation.timeScale()) / Math.abs(data.currentDirection || 1);
          
          // Appliquer immédiatement la nouvelle direction
          data.animation.timeScale(data.currentDirection * currentSpeedFactor);
          
          // Mettre à jour l'attribut de statut pour le style CSS
          data.element.setAttribute('data-marquee-status', shouldBeInverted ? 'inverted' : 'normal');
        });
        
        return true; // Changement effectué
      };
      
      // Fonction pour appliquer le boost de vitesse
      const applySpeedBoost = (intensity) => {
        if (isAccelerating) return;
        isAccelerating = true;
        
        marqueeData.forEach(data => {
          // Calculer la vitesse boostée, en préservant la direction
          const boostMultiplier = 1 + (data.boostFactor - 1) * intensity;
          
          // Appliquer immédiatement la vitesse boostée
          data.animation.timeScale(data.currentDirection * boostMultiplier);
        });
        
        // Réinitialiser le timeout pour revenir à la vitesse normale
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
          // Revenir progressivement à la vitesse normale (en gardant la direction)
          marqueeData.forEach(data => {
            gsap.to(data.animation, {
              timeScale: data.currentDirection,
              duration: 0.5,
              ease: "power1.out"
            });
          });
          
          isAccelerating = false;
        }, 120);
      };
      
      // Fonction de lissage des événements wheel - collecte plusieurs événements sur une courte période
      const processWheelEvents = () => {
        if (wheelEvents.length === 0) return;
        
        // Déterminer la tendance dominante
        let sumDeltaY = 0;
        wheelEvents.forEach(e => {
          sumDeltaY += e.deltaY;
        });
        
        // Direction majoritaire
        const dominantDirection = sumDeltaY > 0 ? 'down' : 'up';
        
        // Si la direction dominante est différente de la dernière direction enregistrée, changer le sens
        if (lastScrollDirection === null || dominantDirection !== lastScrollDirection) {
          const shouldBeInverted = dominantDirection === 'up';
          if (changeMarqueeDirection(shouldBeInverted)) {
            lastScrollDirection = dominantDirection;
          }
        }
        
        // Calculer l'intensité du boost basée sur l'amplitude moyenne des événements
        const avgDelta = Math.abs(sumDeltaY) / wheelEvents.length;
        const boostIntensity = Math.min(avgDelta / 60, 1);
        
        // Appliquer le boost
        if (avgDelta >= scrollDetectionThreshold) {
          applySpeedBoost(boostIntensity);
        }
        
        // Réinitialiser la liste d'événements
        wheelEvents = [];
      };
      
      // Gestionnaire d'événement wheel - plus précis pour détecter la direction
      const handleWheel = (e) => {
        // Collecter l'événement
        wheelEvents.push(e);
        
        // Déclencher le traitement des événements après un court délai
        clearTimeout(wheelProcessTimeout);
        wheelProcessTimeout = setTimeout(processWheelEvents, 50);
      };
      
      // Gestionnaire de scroll standard pour la compatibilité
      const handleScroll = () => {
        const currentScrollPosition = window.pageYOffset || document.documentElement.scrollTop;
        const scrollDelta = Math.abs(currentScrollPosition - lastScrollPosition);
        
        if (scrollDelta < scrollDetectionThreshold) return;
        
        // Détecter la direction seulement pour les défilements significatifs
        const currentDirection = currentScrollPosition > lastScrollPosition ? 'down' : 'up';
        
        // Éviter les oscillations rapides en vérifiant le temps depuis le dernier changement
        const now = Date.now();
        if (lastScrollDirection !== currentDirection && now - lastDirectionChangeTime >= directionChangeCooldown) {
          const shouldBeInverted = currentDirection === 'up';
          if (changeMarqueeDirection(shouldBeInverted)) {
            lastScrollDirection = currentDirection;
          }
        }
        
        // Mettre à jour la position de scroll pour la prochaine comparaison
        lastScrollPosition = currentScrollPosition;
      };
      
      // Ajouter les écouteurs d'événements
      window.addEventListener('wheel', handleWheel, { passive: true });
      window.addEventListener('scroll', handleScroll, { passive: true });
      
      // Fonction de nettoyage
      return () => {
        window.removeEventListener('wheel', handleWheel);
        window.removeEventListener('scroll', handleScroll);
        clearTimeout(scrollTimeout);
        clearTimeout(wheelProcessTimeout);
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
        marqueeData.forEach(data => data.animation.kill());
      };
    };
    
    // Initialize on load or when DOM is ready
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
        data-marquee-speed="35" 
        data-marquee-scroll-speed="5"
        data-marquee-boost-factor="3"
      >
        <div className="marquee-advanced__scroll" data-marquee-scroll>
          {[1, 2, 3, 4].map((group) => (
            <div key={`top-group-${group}`} className="marquee-advanced__collection" data-marquee-collection>
              {topRowLogos.map((logo, index) => (
                <div key={`top-${group}-${index}`} className="marquee-advanced__item">
                  <div className="logo-wrapper">
                    <Image
                      src={`/images/logo/${logo}`}
                      alt={`Partner logo ${index}`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
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
        data-marquee-speed="35" 
        data-marquee-scroll-speed="5"
        data-marquee-boost-factor="3"
      >
        <div className="marquee-advanced__scroll" data-marquee-scroll>
          {[1, 2, 3, 4].map((group) => (
            <div key={`bottom-group-${group}`} className="marquee-advanced__collection" data-marquee-collection>
              {bottomRowLogos.map((logo, index) => (
                <div key={`bottom-${group}-${index}`} className="marquee-advanced__item">
                  <div className="logo-wrapper">
                    <Image
                      src={`/images/logo/${logo}`}
                      alt={`Partner logo ${index}`}
                      fill
                      style={{ objectFit: 'contain' }}
                    />
                  </div>
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
