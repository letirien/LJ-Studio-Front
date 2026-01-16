"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export const ImagesTrails = ({ speed = 1, images}) => {
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    let ScrollTriggerLocal = null;
    let triggers = [];
    
    const init = async () => {
      try {
        const mod = await import('gsap/dist/ScrollTrigger');
        ScrollTriggerLocal = mod.ScrollTrigger;
        gsap.registerPlugin(ScrollTriggerLocal);
      } catch {}
    
    const wrapper = wrapperRef.current;
    if (!wrapper || window.innerWidth < 992) {
      return;
    }

    // config + defaults
    const trailImagesCount = wrapper.querySelectorAll('[data-trail="item"]').length;
    const options = {
      minWidth: 992,
      moveDistance: 2,
      stopDuration: 450,
      // trailLength doit être >= nombre d'images pour éviter le fade prématuré
      trailLength: Math.max(15, trailImagesCount + 5),
    };

    // State management
    const state = {
      trailInterval: null,
      globalIndex: 0,
      last: { x: 0, y: 0 },
      trailImageTimestamps: new Map(),
      trailImages: Array.from(wrapper.querySelectorAll('[data-trail="item"]')),
      isActive: false,
    };

    // Utility functions
    const MathUtils = {
      lerp: (a, b, n) => (1 - n) * a + n * b,
      distance: (x1, y1, x2, y2) => Math.hypot(x2 - x1, y2 - y1),
    };

    function getRelativeCoordinates(e, rect) {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };
    }

    function activate(trailImage, x, y) {
      if (!trailImage) return;

      const rect = trailImage.getBoundingClientRect();
      
      // Ajouter un décalage aléatoire pour espacer les images
      const randomOffsetX = (Math.random() - 0.5) * 50; // -75px à +75px
      const randomOffsetY = (Math.random() - 0.5) * 50; // -75x à +75px
      
      const styles = {
        left: `${x - rect.width / 2 + randomOffsetX}px`,
        top: `${y - rect.height / 2 + randomOffsetY}px`,
        zIndex: state.globalIndex,
        display: "block",
      };

      Object.assign(trailImage.style, styles);
      state.trailImageTimestamps.set(trailImage, Date.now());

      // Here, animate how the images will appear!
      gsap.fromTo(
        trailImage,
        { autoAlpha: 0, scale: 0.8 },
        {
          scale: 1,
          autoAlpha: 1,
          duration: 0.2,
          overwrite: true,
        }
      );
      state.last = { x, y };
    }

    function fadeOutTrailImage(trailImage) {
      if (!trailImage) return;
      // Animation de chute physique réaliste
      const rect = trailImage.getBoundingClientRect();
      const currentTop = parseFloat(trailImage.style.top) || rect.top;
      const currentLeft = parseFloat(trailImage.style.left) || rect.left;
      // Décalage vertical et léger mouvement latéral + rotation
      const fallDistance = 160 + Math.random() * 40; // px
      const sideSwing = (Math.random() - 0.5) * 40; // px
      const rotate = (Math.random() - 0.5) * 30; // deg
      gsap.to(trailImage, {
        opacity: 0,
        scale: 0.8,
        top: currentTop + fallDistance,
        left: currentLeft + sideSwing,
        rotate: rotate,
        duration: 0.4,
        // Courbe de chute physique : accélération progressive (gravité)
        ease: "power3.in",
        onComplete: () => {
          gsap.set(trailImage, { autoAlpha: 0, rotate: 0 });
        },
      });
    }

    function handleOnMove(e) {
      if (!state.isActive) return;

      const rectWrapper = wrapper.getBoundingClientRect();

      // Utiliser les coordonnées relatives pour vérifier si on est dans la zone
      const { x: relativeX, y: relativeY } = getRelativeCoordinates(e, rectWrapper);

      // Vérifier que la souris est dans les limites du wrapper (avec une petite marge)
      const margin = 10;
      const isInside = (
        relativeX >= -margin &&
        relativeX <= rectWrapper.width + margin &&
        relativeY >= -margin &&
        relativeY <= rectWrapper.height + margin
      );

      if (!isInside) return;

      const distanceFromLast = MathUtils.distance(
        relativeX,
        relativeY,
        state.last.x,
        state.last.y
      );

      const divisor = Math.max(0.0001, options.moveDistance * 8);
      const threshold = window.innerWidth / divisor;
      if (distanceFromLast > threshold) {
        const lead = state.trailImages[state.globalIndex % state.trailImages.length];
        const tail =
          state.trailImages[
            (state.globalIndex - options.trailLength) % state.trailImages.length
          ];

        activate(lead, relativeX, relativeY);
        fadeOutTrailImage(tail);
        state.globalIndex++;
      }
    }

    function cleanupTrailImages() {
      const currentTime = Date.now();
      for (const [trailImage, timestamp] of state.trailImageTimestamps.entries()) {
        if (currentTime - timestamp > options.stopDuration) {
          fadeOutTrailImage(trailImage);
          state.trailImageTimestamps.delete(trailImage);
        }
      }
    }

    function startTrail() {
      if (state.isActive) return;

      state.isActive = true;
      wrapper.addEventListener("mousemove", handleOnMove);
      state.trailInterval = setInterval(cleanupTrailImages, 100);
    }

    function stopTrail() {
      if (!state.isActive) return;

      state.isActive = false;
      wrapper.removeEventListener("mousemove", handleOnMove);
      clearInterval(state.trailInterval);
      state.trailInterval = null;

      // Clean up remaining trail images
      state.trailImages.forEach(fadeOutTrailImage);
      state.trailImageTimestamps.clear();
    }

    // Initialize ScrollTrigger
    if (ScrollTriggerLocal) {
      const t = ScrollTriggerLocal.create({
        trigger: wrapper,
        start: "top bottom",
        end: "bottom top",
        onEnter: startTrail,
        onEnterBack: startTrail,
        onLeave: stopTrail,
        onLeaveBack: stopTrail,
      });
      triggers.push(t);
    }

    // Clean up on window resize
    const handleResize = () => {
      if (window.innerWidth < options.minWidth && state.isActive) {
        stopTrail();
      } else if (window.innerWidth >= options.minWidth && !state.isActive) {
        startTrail();
      }
    };

    window.addEventListener("resize", handleResize);

    };

    init();

    return () => {
      stopTrail();
      if (triggers.length) triggers.forEach(t => t.kill());
    };
  }, [speed]);

  return (
    <div data-trail="wrapper" className="trail-section" ref={wrapperRef}>
      <div className="trail-wrap">
        <div className="trail-list">
          {images && images.map((item, index) => (
            <div key={index} data-trail="item" className="trail-item">
              <img
                src={item.fields.IMAGE[0].url}
                alt={item.fields.IMAGE[0].alt || `Image d'archive ${index + 1}`}
                // fill={true}
                className="trail-item__img"
              />
            </div>
          ))}
          {/* <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f69cd4f5ebc0676bf_cursor-trail-1.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f5d1c4cf365a233ea_cursor-trail-2.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f41234aeca6122868_cursor-trail-3.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f26b40ce34b76bd14_cursor-trail-4.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9ff0e9944f7a772a8c_cursor-trail-5.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f0bd979d3d6280fc8_cursor-trail-6.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9ff0cb7ef9ce6d4b4a_cursor-trail-7.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f7bf12612bbb66235_cursor-trail-8.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9f916943fe31e14fe7_cursor-trail-9.avif"
              alt=""
              className="trail-item__img"
            />
          </div>
          <div data-trail="item" className="trail-item">
            <img
              src="https://cdn.prod.website-files.com/679b7e7de9b9ad0339d5524e/679b8e9fcba222367b58fd97_cursor-trail-10.avif"
              alt=""
              className="trail-item__img"
            />
          </div> */}
        </div>
      </div>
      <style jsx>{`
        .trail-section {
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          display: flex;
          position: absolute;
          z-index: 1;
          left: 0;
          top: 0;
        }

        .trail-heading {
          font-size: 3em;
          font-weight: 500;
          line-height: 1;
        }

        .trail-wrap {
          z-index: 5;
          width: 100%;
          height: 100%;
          position: absolute;
          inset: 0%;
        }

        .trail-list {
          width: 100%;
          height: 100%;
          position: relative;
        }

        .trail-item {
          opacity: 0;
          border-radius: .3125em;
          width: 12em;
          height: 16em;
          position: absolute;
          overflow: hidden;
        }

        .trail-item__img {
          object-fit: cover;
          width: 100%;
          height: 100%;
        }
      `}</style>
    </div>
  );
};