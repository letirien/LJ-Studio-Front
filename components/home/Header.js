

import styles from "../layout.module.scss";
import Navbar from "../navbar";
import Image from "next/image";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import RoundedIcon from "../RoundedIcon";
import { Clock } from "../clock";
import dynamic from "next/dynamic";
import React, { useEffect, useRef, useMemo, useState } from "react";
import { useLoading } from "../../lib/LoadingManager";

// Charger WebGLImageTransition en dehors du composant pour éviter les re-créations
const WebGLImageTransition = dynamic(
    () => import("../WebGLImageTransition"),
    { ssr: false }
);

export function Header({ headerImages }) {
    const { setWebGLProgress, isComplete } = useLoading();

    const imagesArray = useMemo(() => headerImages.map(img => img.fields.IMAGE[0].url), [headerImages]);
    const webglRef = useRef(null);
    const webglApiRef = useRef(null);
    const headerRef = useRef(null);
    const tiltedRef = useRef(null);
    const imgBottomRef = useRef(null);
    const [logoVisible, setLogoVisible] = useState(false);

    // Effet parallax : les décorations du bas grandissent au scroll
    useEffect(() => {
        const header = headerRef.current;
        if (!header) return;

        let ticking = false;

        const handleScroll = () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrollY = window.scrollY;
                    const headerHeight = header.offsetHeight;

                    // progress 0 → 1 quand le header sort de l'écran
                    const progress = Math.min(Math.max(scrollY / headerHeight, 0), 1);

                    // Scale de 1 à 2.5 au fur et à mesure du scroll
                    const scale = 1 + progress * 1.5;

                    if (tiltedRef.current) {
                        tiltedRef.current.style.transform = `scaleY(${scale})`;
                    }
                    if (imgBottomRef.current) {
                        imgBottomRef.current.style.transform = `scaleY(${scale})`;
                    }

                    ticking = false;
                });
                ticking = true;
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Animation du logo lettre par lettre quand l'animation est complète
    useEffect(() => {
        if (isComplete) {
            // Délai avant de commencer l'animation du logo dans le header
            setTimeout(() => {
                setLogoVisible(true);
            }, 3100); // Commence juste avant que l'animation complète ne se termine

            // Le logo RESTE VISIBLE - pas de disparition
        }
    }, [isComplete]);

    return (
        <header ref={headerRef} className={`${styles.header} intersectLogo header`}>
            <>
                <Navbar />
                <div className={`${styles.clock} !flex items-center block w-full -bottom-[0%] md:bottom-[4%]`}>
                    <div className="self-center mx-auto block"><Clock /></div>
                </div>
                {/* <div className={`${styles.currentInfoContainer} font-light`}><div>GAME TIME : 17:47:22 UTC+2</div></div> */}
                
                <WebGLImageTransition
                    ref={webglRef}
                    images={imagesArray}
                    transitionDuration={1.2}
                    intensity={0.35}
                    autoplay={true}
                    pauseOnHover={false}
                    expose={(api) => { webglApiRef.current = api }}
                    onLoadProgress={setWebGLProgress}
                />
                <div
                    style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    background: "black",
                    opacity: 0.25,
                    zIndex: 0,
                    pointerEvents: "none", // pour ne pas bloquer les interactions
                    }}
                />
                {/* Logo animé au centre du header - lettre par lettre */}
                <div className="absolute inset-0 mb-[60px] sm:mb-[90px] md:mb-[180px] flex items-center justify-center pointer-events-none">
                    <svg
                        viewBox="0 0 689.83765 89.09131"
                        className="w-[300px] sm:w-[400px] md:w-[400px] h-auto"
                        style={{ filter: 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}
                    >
                        {/* L */}
                        <g className="overflow-hidden">
                            <polygon
                                className={`transform transition-all duration-500 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${logoVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                style={{ transitionDelay: logoVisible ? '0ms' : '0ms' }}
                                fill="white"
                                points="19.66699 0 0 0 0 69.18579 19.84973 89.05493 101.63208 89.05493 101.63208 68.47412 19.66699 68.47412 19.66699 0"
                            />
                        </g>

                        {/* J */}
                        <g className="overflow-hidden">
                            <polygon
                                className={`transform transition-all duration-500 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${logoVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                style={{ transitionDelay: logoVisible ? '100ms' : '0ms' }}
                                fill="white"
                                points="209.05078 .00757 127.05737 .00757 127.05737 19.66504 209.05078 19.66504 209.05078 69.43115 127.05737 69.43115 127.05737 53.62988 107.39038 53.62988 107.39038 69.67139 127.39429 88.96338 208.83984 89.08838 228.71777 69.19067 228.71777 .00488 209.05078 .00488 209.05078 .00757"
                            />
                        </g>

                        {/* S */}
                        <g className="overflow-hidden">
                            <polygon
                                className={`transform transition-all duration-500 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${logoVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                style={{ transitionDelay: logoVisible ? '200ms' : '0ms' }}
                                fill="white"
                                points="375.49048 .00757 279.49731 .00757 255.33569 19.91821 255.34448 32.85107 278.88379 53.2583 366.87598 53.2583 366.87598 69.68018 256.49829 69.68018 256.49829 89.08838 366.56909 89.08838 390.20654 69.68286 390.20654 53.2583 365.95557 32.85107 279.19067 32.85107 279.19067 19.91064 375.49048 19.91064 375.49048 19.91553 427.55469 19.91553 427.55469 89.08838 452.07568 89.08838 452.07568 19.91553 506.27734 19.91553 506.27734 .00757 382.20483 .00757 375.49048 .00757"
                            />
                        </g>

                        {/* T */}
                        <g className="overflow-hidden">
                            <path
                                className={`transform transition-all duration-500 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${logoVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                style={{ transitionDelay: logoVisible ? '300ms' : '0ms' }}
                                fill="white"
                                d="M639.06226.0105h-123.96802v89.08081h123.96802l24.88232-19.40845-.15991-49.76465L639.06226.0105ZM639.37183,69.68286h-99.12573V19.91821h99.12573v49.76465Z"
                            />
                        </g>

                        {/* D */}
                        <g className="overflow-hidden">
                            <rect
                                className={`transform transition-all duration-500 ease-[cubic-bezier(0.12, 0, 0.88, 1)] ${logoVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
                                    }`}
                                style={{ transitionDelay: logoVisible ? '400ms' : '0ms' }}
                                fill="white"
                                x="670.4292"
                                y="69.67993"
                                width="19.40845"
                                height="19.40845"
                            />
                        </g>
                    </svg>
                </div>

                {/* <div className={styles.headimg}>
                        <Image
                            src="/images/HEADER.webp"
                            alt="Footbal Cover Design"
                            fill={true}
                            quality={100}
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div> */}
                <div ref={tiltedRef} className={`${styles.tiltedContainer} h-[60px] sm:h-[90px] md:h-[180px]`}>
                    <div className={`${styles.tiltedDiv1} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                    <div className={`${styles.tiltedDiv2} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                    <div className={`${styles.tiltedDiv3} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                </div>
                <div ref={imgBottomRef} className={`${styles.imgBottom} h-[50px] sm:h-[70px] md:h-[150px]`}></div>
            </>
        </header>
    )
}
