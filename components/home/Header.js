

import styles from "../layout.module.scss";
import Navbar from "../navbar";
import Image from "next/image";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import RoundedIcon from "../RoundedIcon";
import {Clock} from "../clock";
// import WebGLImageTransition from "../WebGLImageTransition";
import dynamic from "next/dynamic";
import React, { useEffect, useRef } from "react";

export function Header({headerImages}) {

    const imagesArray = headerImages.map(img => img.fields.IMAGE[0].url);
    const WebGLImageTransition = dynamic(
        () => import("../WebGLImageTransition"),
        { ssr: false }
    );
    const webglRef = useRef(null);
    const webglApiRef = useRef(null);
    const linesRef = useRef(null);

    const setupSync = () => {
        const el = linesRef.current;
        if (!el) return;

        let timeouts = [];
        let stepCounter = 0;

        const clearAll = () => {
            timeouts.forEach(t => clearTimeout(t));
            timeouts = [];
        };

        const scheduleStepTriggers = () => {
            clearAll();
            const stylesComputed = window.getComputedStyle(el);
            const durStr = stylesComputed.animationDuration || stylesComputed.webkitAnimationDuration || "8s";
            const durNum = parseFloat(durStr);
            const durationMs = (isNaN(durNum) ? 8 : durNum) * (durStr.includes("ms") ? 1 : 1000);
            const fractions = [0.2, 0.4, 0.6, 0.8];
            stepCounter = 0;
            fractions.forEach((f) => {
                const id = setTimeout(() => {
                    stepCounter += 1;
                    if (stepCounter % 2 === 1) {
                        try {
                            const api = webglApiRef.current;
                            api && api.next && api.next();
                        } catch (e) { console.warn('[Header] next() error', e); }
                    }
                }, Math.max(0, Math.floor(durationMs * f)));
                timeouts.push(id);
            });
        };

        const onAnimStart = () => { console.log('[Header] animationstart'); scheduleStepTriggers(); };
        const onAnimIter = () => { console.log('[Header] animationiteration'); scheduleStepTriggers(); };

        el.addEventListener('animationstart', onAnimStart);
        el.addEventListener('animationiteration', onAnimIter);

        scheduleStepTriggers();

        return () => {
            clearAll();
            el.removeEventListener('animationstart', onAnimStart);
            el.removeEventListener('animationiteration', onAnimIter);
        };
    };

    const onWebGLReady = () => {
        // Une fois le shader prêt, on branche la synchro
        setupSync();
    };
    return (
        <header className={`${styles.header} intersectLogo header` }>
                <>
                    <Navbar/>
                    <div className={`${styles.clock} !flex items-center hidden md:block w-full -bottom-[0%] md:bottom-[4%]`}>
                        <div className="self-center mx-auto hidden md:block"><Clock/></div>
                    </div>
                    {/* <div className={`${styles.currentInfoContainer} font-light`}><div>GAME TIME : 17:47:22 UTC+2</div></div> */}

                        <WebGLImageTransition
                            ref={webglRef}
                            images={imagesArray}
                            transitionDuration={1.2}
                            intensity={0.35}
                            autoplay={false}
                            pauseOnHover={false}
                            expose={(api) => { webglApiRef.current = api; console.log('[Header] expose API set', !!api); }}
                            onReady={onWebGLReady}
                        />
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
                    {/* todo: au scroll hors de la section, quand il y a plus que 30% visible augmenter la taille pour effet de paralax */}
                    <div className={`${styles.tiltedContainer} h-[60px] sm:h-[90px] md:h-[180px]`}>
                        <div className={`${styles.tiltedDiv1} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                        <div className={`${styles.tiltedDiv2} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                        <div className={`${styles.tiltedDiv3} h-[10px] sm:h-[20px] md:h-[30px]`}></div>
                    </div>
                    <div className={`${styles.imgBottom} h-[50px] sm:h-[70px] md:h-[150px]`}></div>
                </>
        </header>
    )
}
