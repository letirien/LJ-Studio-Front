import {useEffect, useRef, useState} from "react";
import Image from "next/image";

/**
 * Empile des SVGs pour composer une icône ronde.
 * - Fond (constant)
 * - Icône principale: "main" | "lj" | "yeux"
 * - Texte circulaire (constant) qui tourne selon la vitesse de scroll
 */
export default function RoundedIcon({ icon = "lj", size = 120, rotationFactor = 0.15, className = "", circularContinue = false}) {
    const circularRef = useRef(null);
    const [angle, setAngle] = useState(0);

    const iconSrc = icon === "main"
        ? "/images/roundedSVG/ICONE_MAIN.svg"
        : icon === "yeux"
            ? "/images/roundedSVG/ICONE_YEUX.svg"
            : "/images/roundedSVG/ICONE_LJ.svg";

    // FOND + CIRCULAR constants
    const backgroundSrc = "/images/roundedSVG/FOND_ORANGE.svg";
    const circularSrc = "/images/roundedSVG/CIRCULAR_TXT.svg";

    useEffect(() => {
        if(circularContinue) return;
        if (typeof window === "undefined") return;

        let lastScrollY = window.scrollY;
        let rafId = 0;
        let pendingDelta = 0; // intégration douce

        const onScroll = () => {
            const currentY = window.scrollY;
            const dy = currentY - lastScrollY; // vitesse approx. par frame scroll
            lastScrollY = currentY;
            pendingDelta += dy * rotationFactor; // pondère la rotation par la vitesse

            if (!rafId) {
                rafId = requestAnimationFrame(() => {
                    rafId = 0;
                    setAngle(prev => prev + pendingDelta);
                    pendingDelta = 0;
                });
            }
        };

        window.addEventListener("scroll", onScroll, { passive: true });
        return () => {
            window.removeEventListener("scroll", onScroll);
            if (rafId) cancelAnimationFrame(rafId);
        };
    }, [rotationFactor]);

    // Style du conteneur (carré) + calques absolus
    const containerStyle = {
        position: "relative",
        width: `${size}px`,
        height: `${size}px`,
    };

    const layerStyle = {
        position: "absolute",
        inset: 0,
    };

    const circularStyle = {
        ...layerStyle,
        transform: `rotate(${angle}deg)`,
        transformOrigin: "50% 50%",
        willChange: "transform",
        animation: circularContinue ? "spin 20s linear infinite" : "none",
    };

    return (
        <div className={className} style={containerStyle}>
            {/* Fond */}
            <div style={layerStyle}>
                <Image src={backgroundSrc} alt="fond" fill={true} style={{ objectFit: "contain" }} />
            </div>

            {/* Icône principale */}
            <div style={layerStyle}>
                <Image src={iconSrc} alt={`icone-${icon}`} fill={true} style={{ objectFit: "contain" }} />
            </div>

            {/* Texte circulaire tournant */}
            <div ref={circularRef} style={circularStyle}>
                <Image src={circularSrc} alt="circular" fill={true} style={{ objectFit: "contain" }} />
            </div>
            <style jsx>{`
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
}


