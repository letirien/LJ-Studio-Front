"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import Image from "next/image";

export const ImagesTrails = ({ speed = 1, images}) => {
  const wrapperRef = useRef(null);
  const stopTrailRef = useRef(null);

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
    if (!wrapper) return;

    const isMobile = window.innerWidth < 992;

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

      trailImage.dataset.falling = "false";
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
      if (!trailImage || trailImage.dataset.falling === "true") return;
      trailImage.dataset.falling = "true";

      // Décalage vertical et léger mouvement latéral + rotation
      const fallDistance = 400 + Math.random() * 40; // px
      const sideSwing = (Math.random() - 0.5) * 40; // px
      const rotate = (Math.random() - 0.5) * 30; // deg

      // Utiliser x/y (transforms) au lieu de top/left pour éviter le tremblement
      gsap.to(trailImage, {
        opacity: 0,
        scale: 0.8,
        y: fallDistance,
        x: sideSwing,
        rotate: rotate,
        duration: 0.7,
        ease: "power3.in",
        overwrite: true,
        onComplete: () => {
          gsap.set(trailImage, { autoAlpha: 0, rotate: 0, x: 0, y: 0 });
          trailImage.dataset.falling = "false";
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

    // Auto-trail for mobile: predefined path, replays each time section enters
    let autoTrailRAF = null;

    // Waypoints as % of wrapper size — natural mouse gesture
    const waypoints = [
      { x: 0.15, y: 0.18 },
      { x: 0.30, y: 0.35 },
      { x: 0.50, y: 0.50 },
      { x: 0.70, y: 0.68 },
      { x: 0.85, y: 0.82 },
      { x: 0.78, y: 0.65 },
      { x: 0.72, y: 0.48 },
      { x: 0.80, y: 0.30 },
      { x: 0.85, y: 0.18 },
      // ligne quasi droite vers la gauche
      { x: 0.55, y: 0.22 },
      { x: 0.30, y: 0.25 },
      { x: 0.12, y: 0.28 },
    ];

    // Catmull-Rom spline: smooth curves through all waypoints
    // s = tangent strength (0.5 = standard, 1.0+ = rounder curves)
    function catmullRom(p0, p1, p2, p3, t, s = 1.0) {
      const t2 = t * t;
      const t3 = t2 * t;
      const h00 = 2 * t3 - 3 * t2 + 1;
      const h10 = t3 - 2 * t2 + t;
      const h01 = -2 * t3 + 3 * t2;
      const h11 = t3 - t2;
      return {
        x: h00 * p1.x + h10 * s * (p2.x - p0.x) + h01 * p2.x + h11 * s * (p3.x - p1.x),
        y: h00 * p1.y + h10 * s * (p2.y - p0.y) + h01 * p2.y + h11 * s * (p3.y - p1.y),
      };
    }

    function getSplinePoint(points, t) {
      const n = points.length - 1;
      const seg = Math.min(Math.floor(t * n), n - 1);
      const localT = t * n - seg;
      const p0 = points[Math.max(seg - 1, 0)];
      const p1 = points[seg];
      const p2 = points[Math.min(seg + 1, n)];
      const p3 = points[Math.min(seg + 2, n)];
      return catmullRom(p0, p1, p2, p3, localT);
    }

    function runAutoTrail() {
      const rect = wrapper.getBoundingClientRect();
      const totalSteps = 20;
      let currentStep = 0;

      function step() {
        if (currentStep >= totalSteps || !state.isActive) return;

        const t = currentStep / (totalSteps - 1);
        const pos = getSplinePoint(waypoints, t);

        const x = pos.x * rect.width;
        const y = pos.y * rect.height;

        const lead = state.trailImages[state.globalIndex % state.trailImages.length];
        const tail =
          state.trailImages[
            (state.globalIndex - options.trailLength) % state.trailImages.length
          ];
        activate(lead, x, y);
        fadeOutTrailImage(tail);
        state.globalIndex++;
        currentStep++;

        autoTrailRAF = requestAnimationFrame(() => {
          setTimeout(step, 180);
        });
      }

      step();
    }

    function startTrail() {
      if (state.isActive) return;
      state.isActive = true;

      if (isMobile) {
        runAutoTrail();
      } else {
        wrapper.addEventListener("mousemove", handleOnMove);
      }
      state.trailInterval = setInterval(cleanupTrailImages, 100);
    }

    function stopTrail() {
      if (!state.isActive) return;
      state.isActive = false;

      if (isMobile) {
        cancelAnimationFrame(autoTrailRAF);
        autoTrailRAF = null;
      } else {
        wrapper.removeEventListener("mousemove", handleOnMove);
      }
      clearInterval(state.trailInterval);
      state.trailInterval = null;

      // Clean up remaining trail images
      state.trailImages.forEach(fadeOutTrailImage);
      state.trailImageTimestamps.clear();
    }

    // Store stopTrail in ref for cleanup
    stopTrailRef.current = stopTrail;

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

    // On mobile, start immediately via ScrollTrigger (no resize guard needed)
    const handleResize = () => {
      if (!isMobile) {
        if (window.innerWidth < options.minWidth && state.isActive) {
          stopTrail();
        } else if (window.innerWidth >= options.minWidth && !state.isActive) {
          startTrail();
        }
      }
    };

    window.addEventListener("resize", handleResize);

    };

    init();

    return () => {
      if (stopTrailRef.current) stopTrailRef.current();
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

        @media (max-width: 991px) {
          .trail-item {
            width: 7em;
            height: 9.5em;
          }
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