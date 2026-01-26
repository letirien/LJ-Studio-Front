import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import AnimatedEyes from "./AnimatedEyes";
import IntroIcons from "./IntroIcons";

export default function RoundedIcon({
  color = "",
  icon = "lj",
  size = 120,
  rotationFactor = 0.15,
  className = "",
  circularContinue = false,
  menu = false,
}) {
  function useIsMobile(maxWidth = 768) {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
      const check = () => setIsMobile(window.innerWidth <= maxWidth);
      check();
      window.addEventListener("resize", check);
      return () => window.removeEventListener("resize", check);
    }, [maxWidth]);

    return isMobile;
  }

  const isIntro = icon === "intro";
  const isWhite = color === "white";
  const isBlack = color === "black";

  const circularRef = useRef(null);
  const [angle, setAngle] = useState(0);

  const iconSrc =
    icon === "main"
      ? "/images/roundedSVG/ICONE_MAIN.svg"
      : icon === "yeux"
        ? "/images/roundedSVG/ICONE_YEUX.svg"
        : "/images/roundedSVG/ICONE_LJ.svg";

  const backgroundSrc = "/images/roundedSVG/FOND_ORANGE.svg";
  const circularSrc = "/images/roundedSVG/CIRCULAR_TXT.svg";
  const iconCross = "/images/roundedSVG/ICONE_LJ_CROSS_FINAL.svg";

  const invertStyle = isBlack ? { filter: "invert(1)" } : {};
  const blackBgStyle = isBlack ? { filter: "brightness(0)" } : {};

  useEffect(() => {
    if (circularContinue) return;
    if (typeof window === "undefined") return;

    let lastScrollY = window.scrollY;
    let rafId = 0;
    let pendingDelta = 0;

    const onScroll = () => {
      const currentY = window.scrollY;
      const dy = currentY - lastScrollY;
      lastScrollY = currentY;
      pendingDelta += dy * rotationFactor;

      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          setAngle((prev) => prev + pendingDelta);
          pendingDelta = 0;
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [rotationFactor, circularContinue]);

  const isMobile = useIsMobile();
  const shrinkFactor = isMobile ? 0.75 : 1;

  const containerStyle = {
    position: "relative",
    width: `${size * shrinkFactor}px`,
    height: `${size * shrinkFactor}px`,
  };

  const layerStyle = {
    position: "absolute",
    inset: 0,
  };

  const centeredLayerStyle = {
    ...layerStyle,
    display: "grid",
    placeItems: "center",
  };

  const circularStyle = {
    position: "absolute",
    inset: isWhite ? "-4%" : "-1%",
    transform: `rotate(${angle}deg)`,
    transformOrigin: "50% 50%",
    willChange: "transform",
    animation: circularContinue ? "spin 20s linear infinite" : "none",
  };

  return (
    <div className={className} style={containerStyle}>
      {!menu && (
        <>
          {/* Fond */}
          <div style={layerStyle}>
            {isWhite ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  background: "#fff",
                }}
              />
            ) : (
              <Image
                src={backgroundSrc}
                alt="fond"
                fill
                style={{ objectFit: "contain", ...blackBgStyle }}
              />
            )}
          </div>

          {/* Icône centrée */}
          <div style={centeredLayerStyle}>
            {isIntro ? (
              <IntroIcons />
            ) : icon === "yeux" ? (
              <AnimatedEyes />
            ) : (
              <Image
                src={iconSrc}
                alt={`icone-${icon}`}
                fill
                style={{ objectFit: "contain", ...invertStyle }}
              />
            )}
          </div>
        </>
      )}

      {menu && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "50%",
          }}
        >
          <Image
            src={iconCross}
            alt="close"
            fill
            style={{ objectFit: "contain", ...invertStyle }}
          />
        </div>
      )}

      {/* Texte circulaire */}
      <div ref={circularRef} style={circularStyle}>
        <Image
          src={circularSrc}
          alt="circular"
          fill
          style={{ objectFit: "contain", ...invertStyle }}
        />
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
