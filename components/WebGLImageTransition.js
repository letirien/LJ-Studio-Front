"use client";

import React, { useEffect, useRef, useState, useImperativeHandle, forwardRef } from "react";
import * as THREE from "three";
import gsap from "gsap";

function WebGLImageTransitionDemo5Internal({
  images,
  transitionDuration = 1.0,
  intensity = 0.3,
  autoplay = true,
  autoplayDelay = 2000,
  pauseOnHover = true,
  className,
  onReady,
  expose
}, ref) {
  const [isReady, setIsReady] = useState(false);

  const containerRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const materialRef = useRef(null);
  const planeRef = useRef(null);
  const texturesRef = useRef([]);
  const currentIndexRef = useRef(0);
  const isRunningRef = useRef(false);
  const autoplayTimerRef = useRef(null);
  const isHoveredRef = useRef(false);

  const vertexShader = `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `;

  const fragmentShader = `
    uniform float time;
    uniform float progress;
    uniform float width;
    uniform float scaleX;
    uniform float scaleY;
    uniform float transition;
    uniform float radius;
    uniform float intensity;
    uniform sampler2D texture1;
    uniform sampler2D texture2;
    uniform vec4 resolution;

    varying vec2 vUv;

    void main() {
      vec2 newUV = (vUv - vec2(0.5)) * resolution.zw + vec2(0.5);

      vec4 d1 = texture2D(texture1, newUV);
      vec4 d2 = texture2D(texture2, newUV);

      float displace1 = (d1.r + d1.g + d1.b) * 0.33;
      float displace2 = (d2.r + d2.g + d2.b) * 0.33;

      vec4 t1 = texture2D(texture1, vec2(newUV.x, newUV.y + progress * (displace2 * intensity)));
      vec4 t2 = texture2D(texture2, vec2(newUV.x, newUV.y + (1.0 - progress) * (displace1 * intensity)));

      gl_FragColor = mix(t1, t2, progress);
    }
  `;

  useEffect(() => {
    if (!containerRef.current || !Array.isArray(images) || images.length < 2) return;

    const container = containerRef.current;
    let resizeObs = null;
    let cleanupResize = () => {};

    try {
      const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      renderer.setSize(container.clientWidth || 1, container.clientHeight || 1);
      container.appendChild(renderer.domElement);
      rendererRef.current = renderer;

      const scene = new THREE.Scene();
      sceneRef.current = scene;

      const camera = new THREE.PerspectiveCamera(
        70,
        (container.clientWidth || 1) / (container.clientHeight || 1),
        0.001,
        1000
      );
      camera.position.set(0, 0, 2);
      cameraRef.current = camera;

      const geometry = new THREE.PlaneGeometry(1, 1, 2, 2);

      const loader = new THREE.TextureLoader();
      let loadedCount = 0;
      let ready = false;
      const loaded = images.map((src, idx) => {
        const t = loader.load(src, () => {
          console.log("[WebGL] texture loaded", { idx, src });
          loadedCount++;
          if (!ready && loadedCount > 0) {
            setIsReady(true);
            ready = true;
          }
        });
        t.minFilter = THREE.LinearFilter;
        t.magFilter = THREE.LinearFilter;
        t.generateMipmaps = false;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        return t;
      });
      texturesRef.current = loaded;

      let savedIndex = 0;
      try {
        savedIndex = Number(sessionStorage.getItem("image-transition-index") || 0);
        if (isNaN(savedIndex) || savedIndex >= images.length) savedIndex = 0;
      } catch {}
      currentIndexRef.current = savedIndex;

      const uniforms = {
        time:        { value: 0.0 },
        progress:    { value: 0.0 },
        border:      { value: 0.0 },
        intensity:   { value: intensity },
        scaleX:      { value: 40.0 },
        scaleY:      { value: 40.0 },
        transition:  { value: 40.0 },
        swipe:       { value: 0.0 },
        width:       { value: 0.0 },
        radius:      { value: 0.0 },
        texture1:    { value: loaded[savedIndex]},
        texture2:    { value: loaded[(savedIndex + 1) % loaded.length] },
        resolution:  { value: new THREE.Vector4() }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader,
        fragmentShader,
        uniforms,
        side: THREE.DoubleSide,
        transparent: true,
      });
      materialRef.current = material;

      const plane = new THREE.Mesh(geometry, material);
      planeRef.current = plane;
      scene.add(plane);

      const updateResolution = () => {
        const w = container.clientWidth || 1;
        const h = container.clientHeight || 1;
        renderer.setSize(w, h);

        camera.aspect = w / h;

        const img = texturesRef.current[0]?.image;
        const imageAspect = img && img.width ? img.height / img.width : 1.0;

        let a1, a2;
        if (h / w > imageAspect) {
          a1 = (w / h) * imageAspect;
          a2 = 1.0;
        } else {
          a1 = 1.0;
          a2 = (h / w) / imageAspect;
        }

        material.uniforms.resolution.value.set(w, h, a1, a2);

        const dist = camera.position.z;
        const planeHeight = 1.0;
        camera.fov = (2 * (180 / Math.PI)) * Math.atan(planeHeight / (2 * dist));

        plane.scale.x = camera.aspect;
        plane.scale.y = 1.0;

        camera.updateProjectionMatrix();
        renderer.render(scene, camera);
      };

      if (texturesRef.current[0]?.image?.width) {
        updateResolution();
        setIsReady(true);
      } else {
        const check = setInterval(() => {
          if (texturesRef.current[0]?.image?.width) {
            clearInterval(check);
            updateResolution();
            setIsReady(true);
          }
        }, 16);
      }

      const onResize = () => updateResolution();

      if ("ResizeObserver" in window) {
        resizeObs = new ResizeObserver(onResize);
        resizeObs.observe(container);
        cleanupResize = () => resizeObs && resizeObs.disconnect();
      } else {
        window.addEventListener("resize", onResize);
        cleanupResize = () => window.removeEventListener("resize", onResize);
      }

      return () => {
        cleanupResize();
        try {
          scene.clear();
          geometry.dispose();
          material.dispose();
          texturesRef.current.forEach((t) => t && t.dispose());
          renderer.dispose();
          if (renderer.domElement?.parentNode) {
            renderer.domElement.parentNode.removeChild(renderer.domElement);
          }
        } catch {}
      };
    } catch (e) {
      console.error("[WebGLImageTransitionDemo5] init error:", e);
    }
  }, [images.join("|"), intensity]);

  useEffect(() => {
    if (isReady && typeof onReady === 'function') {
      try { console.log("[WebGL] onReady()"); onReady(); } catch {}
    }
  }, [isReady, onReady]);

  const next = () => {
    if (isRunningRef.current) return;
    const material = materialRef.current;
    if (!material) return;

    const count = texturesRef.current.length;
    const nextIndex = (currentIndexRef.current + 1) % count;
    const nextTex = texturesRef.current[nextIndex];

    isRunningRef.current = true;
    console.log("[WebGL] next()", { from: currentIndexRef.current, to: nextIndex });

    gsap.to(material.uniforms.progress, {
      value: 1,
      duration: transitionDuration,
      ease: "power2.inOut",
      onUpdate: () => {
        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current);
        }
      },
      onComplete: () => {
        currentIndexRef.current = nextIndex;
        sessionStorage.setItem("image-transition-index", nextIndex);
        material.uniforms.texture1.value = nextTex;
        material.uniforms.progress.value = 0;
        
        const followingIndex = (nextIndex + 1) % count;
        material.uniforms.texture2.value = texturesRef.current[followingIndex];
        
        isRunningRef.current = false;
        console.log("[WebGL] transition complete", { current: currentIndexRef.current, next: followingIndex });
      }
    });
  };

  useImperativeHandle(ref, () => ({
    next
  }), []);

  // Alternative d'exposition via prop pour éviter les problèmes de ref avec dynamic()
  useEffect(() => {
    if (typeof expose === 'function') {
      try { expose({ next }); } catch {}
      return () => { try { expose(null); } catch {} };
    }
  }, [expose]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const handleClick = () => { console.log("[WebGL] click -> next()"); next(); };
    el.addEventListener("click", handleClick);
    return () => el.removeEventListener("click", handleClick);
  }, []);

  useEffect(() => {
    if (!pauseOnHover) return;
    const el = containerRef.current;
    if (!el) return;
    const onEnter = () => { isHoveredRef.current = true; };
    const onLeave = () => { isHoveredRef.current = false; };
    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [pauseOnHover]);

  useEffect(() => {
    if (!autoplay) return;
    const tick = () => {
      if (!isHoveredRef.current && !isRunningRef.current) {
        next();
      }
      autoplayTimerRef.current = setTimeout(tick, autoplayDelay);
    };
    autoplayTimerRef.current = setTimeout(tick, autoplayDelay);
    return () => {
      if (autoplayTimerRef.current) clearTimeout(autoplayTimerRef.current);
    };
  }, [autoplay, autoplayDelay, transitionDuration]);

  let fallbackIndex = 0;
  try {
    fallbackIndex = Number(sessionStorage.getItem("image-transition-index") || 0);
    if (isNaN(fallbackIndex) || fallbackIndex >= images.length) fallbackIndex = 0;
  } catch {}

  return (
    <div
      ref={containerRef}
      className={className}
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        cursor: "pointer",
        overflow: "hidden",
        background: "#000"
      }}
      aria-label="WebGL Image Transition (demo5)"
      role="img"
    >
      {!isReady && images[fallbackIndex] && (
        <img
          src={images[fallbackIndex]}
          alt=""
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            zIndex: 1,
            pointerEvents: "none",
            transition: "opacity 0.3s"
          }}
        />
      )}
    </div>
  );
}

const WebGLImageTransitionDemo5 = forwardRef(WebGLImageTransitionDemo5Internal);

export default WebGLImageTransitionDemo5;