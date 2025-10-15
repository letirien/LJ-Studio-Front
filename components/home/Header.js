

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
            console.log('[Header] animation duration (ms):', durationMs);
            const fractions = [0.2, 0.4, 0.6, 0.8];
            stepCounter = 0;
            fractions.forEach((f) => {
                const id = setTimeout(() => {
                    stepCounter += 1;
                    console.log('[Header] step', stepCounter, 'fraction', f);
                    if (stepCounter % 2 === 1) {
                        try {
                            const api = webglApiRef.current;
                            console.log('[Header] trigger WebGL next(), api?', !!api);
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

        console.log('[Header] setupSync mounted');
        scheduleStepTriggers();

        return () => {
            clearAll();
            el.removeEventListener('animationstart', onAnimStart);
            el.removeEventListener('animationiteration', onAnimIter);
        };
    };

    const onWebGLReady = () => {
        // Une fois le shader prêt, on branche la synchro
        console.log('[Header] onWebGLReady received');
        setupSync();
    };
    return (
        <header className={`${styles.header} intersectLogo header` }>
                <>
                    <Navbar/>
            
					<h1 className={`${styles.mainTitle} text-[30vw] sm:text-[158px] top-[45%] md:top-[inherit] mainContainer`}>
                                <p>LJ STUDIO</p>
                                <p>WELCOME ON</p>
							<div className={`flex h-full ${styles.linesViewport}`}>
									<span className={`${styles.linesTrack}`} ref={linesRef}>
                                            <p>OUR PITCH</p>
                                            <p>OUR GAME</p>
                                            <p>OUR CRAFT</p>
                                            <p>BOARD</p>
                                            <p>OUR PITCH</p>
                                        </span>
                                </div>
							<div className={styles.centerIcon}>
                                <RoundedIcon icon="main" size={120} rotationFactor={0.45} circularContinue={true} />
								{/* <Image
									src="/images/roundedSVG/Mickey.svg"
									alt="centre"
									width={100}
									height={100}
								/> */}
							</div>
                        </h1>
                    <div className={`${styles.currentInfoContainer} -bottom-[4%] sm:bottom-[4%]`}><div><Clock/></div></div>
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
                    <div className={styles.tiltedContainer}>
                        <div className={styles.tiltedDiv1}></div>
                        <div className={styles.tiltedDiv2}></div>
                        <div className={styles.tiltedDiv3}></div>
                    </div>
                    <div className={styles.imgBottom}></div>
                </>
            )
        </header>
    )
}
