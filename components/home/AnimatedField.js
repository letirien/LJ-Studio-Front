import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import RoundedIcon from '../RoundedIcon.js';
import { motion, useInView } from 'framer-motion';

const FIELD_PATHS = [
    'Penalty_area_line',
    'Goal_area_line',
    'Penalty_arc',
    'Penalty_area_line1',
    'Goal_area_line1',
    'Penalty_arc1',
    'Border',
];

const Etiquette = ({ text }) => {
    const ref = useRef(null)
    useInView
    const isInView = useInView(ref)
    
  // Plus le texte est long, plus la durée est longue pour garder une vitesse constante
  const duration = Math.max(8, text.length * 0.15); // Minimum 8s, +0.15s par caractère
  
  return (
    <div  ref={ref} className="absolute top-[25%] left-[24%] rotate-[-6deg] h-[25px] overflow-hidden bg-[#fa6218] roboto text-black text-xs flex items-center transition-[width] delay-150 ease-in-out duration-200" style={{width: isInView ? '180px' : '0px'}}>
      <motion.div
        className="whitespace-nowrap flex"
        animate={{ x: ["0%", "-50%"] }} // Aller jusqu'à -50% au lieu de -100%
        transition={{
          repeat: Infinity,
          ease: "linear",
          duration: duration,
          repeatType: "loop", // Assure une boucle parfaite
        }}
      >
        <span className="px-2">{text}</span>
        <span className="px-2">{text}</span>
      </motion.div>
    </div>
  );
};

const ALL_POINTS = ['Centre_mark', 'Penalty_mark', 'Penalty_mark1'];

export default function AnimatedField() {
    const svgRef = useRef(null);
    const sectionRef = useRef(null);
    const animatingRef = useRef(false);
    const leavePendingRef = useRef(false);
    const resettingRef = useRef(false);
    const playTlRef = useRef(null);
    const resetTlRef = useRef(null);
    // Facteurs de vitesse
    const PLAY_SPEED = 0.8; // vitesse globale lecture
    const RESET_SPEED = 1; // vitesse globale reset

    // Tuer tous les tweens actifs sur les éléments d'animation
    const killAllTweens = (svg, animationOrder) => {
        if (!svg || !animationOrder) return;
        animationOrder.forEach((id) => {
            const el = svg.querySelector(`#${id}`);
            if (el) gsap.killTweensOf(el);
        });
    };

    // Helpers d'état
    const isAlmost = (a, b, eps = 0.5) => Math.abs(parseFloat(a) - parseFloat(b)) <= eps;
    const isElementVisible = (el, id) => {
        if (!el) return false;
        const cs = typeof window !== 'undefined' ? window.getComputedStyle(el) : null;
        if (el.tagName === 'circle') {
            if (id === 'Centre_circle') {
                // visible si dashoffset ~ 0
                const off = cs ? parseFloat(cs.strokeDashoffset || el.style.strokeDashoffset || 0) : 0;
                return isAlmost(off, 0);
            }
            const op = cs ? parseFloat(cs.opacity || el.style.opacity || 0) : 0;
            return op >= 0.99;
        }
        // path: visible si dashoffset ~ 0
        const off = cs ? parseFloat(cs.strokeDashoffset || el.style.strokeDashoffset || 0) : 0;
        return isAlmost(off, 0);
    };

    // Fonction pour réinitialiser tous les éléments SVG à l'état caché (animé, sens inverse)
    const resetSVGAnimated = (svg, animationOrder, onComplete) => {
        // Empêche conflit avec play: marquer reset en cours et tuer les tweens
        resettingRef.current = true;
        killAllTweens(svg, animationOrder);
        // On anime dans l'ordre inverse
        const reversed = [...animationOrder].reverse();
        const resetNext = (i) => {
            if (i >= reversed.length) {
                resettingRef.current = false;
                if (onComplete) onComplete();
                return;
            }
            const id = reversed[i];
            const el = svg.querySelector(`#${id}`);
            if (!el) {
                resetNext(i + 1);
                return;
            }
            if (el.tagName === 'circle') {
                if (id === 'Centre_circle') {
                    const length = el.getTotalLength();
                    gsap.to(el, {
                        strokeDashoffset: length,
                        duration: 0.4,
                        ease: 'power1.inOut',
                        onComplete: () => resetNext(i + 1),
                    });
                } else {
                    gsap.to(el, {
                        opacity: 0,
                        duration: 0.2,
                        onComplete: () => resetNext(i + 1),
                    });
                }
            } else {
                const length = el.getTotalLength();
                gsap.to(el, {
                    strokeDashoffset: length,
                    duration: 0.4,
                    ease: 'power1.inOut',
                    onComplete: () => resetNext(i + 1),
                });
            }
        };
        resetNext(0);
    };

    // Fonction pour mettre tous les éléments SVG à l'état caché instantanément (pour le premier rendu)
    const resetSVGInstant = (svg, animationOrder) => {
        animationOrder.forEach((id) => {
            const el = svg.querySelector(`#${id}`);
            if (!el) return;
            if (el.tagName === 'path' || el.tagName === 'circle') {
                if (el.tagName === 'circle') {
                    if (id === 'Centre_circle') {
                        const length = el.getTotalLength();
                        el.style.strokeDasharray = length;
                        el.style.strokeDashoffset = length;
                        el.style.opacity = 1;
                    } else {
                        el.style.opacity = 0;
                    }
                } else {
                    const length = el.getTotalLength();
                    el.style.strokeDasharray = length;
                    el.style.strokeDashoffset = length;
                }
            }
        });
    };

    useEffect(() => {
        const svg = svgRef.current;
        if (!svg) return;

        const init = async () => {
            let ScrollTriggerLocal = null;
            if (typeof window !== 'undefined') {
                try {
                    const mod = await import('gsap/dist/ScrollTrigger');
                    ScrollTriggerLocal = mod.ScrollTrigger;
                    gsap.registerPlugin(ScrollTriggerLocal);
                } catch {}
            }

            // Récupérer tous les paths/arcs à animer
            const pathIds = [...FIELD_PATHS];
            for (let i = pathIds.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [pathIds[i], pathIds[j]] = [pathIds[j], pathIds[i]];
            }
            const animationOrder = [
                ...pathIds,
                'Centre_line',
                'Centre_circle',
                ...ALL_POINTS,
                'Corner_arcs',
            ];

            // Construit une timeline de lecture complète
            const buildPlayTimeline = () => {
                const tl = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut' } });
                animationOrder.forEach((id) => {
                    const el = svg.querySelector(`#${id}`);
                    if (!el) return;
                    // Si déjà visible (après reset partiel), on saute
                    if (isElementVisible(el, id)) return;
                    if (el.tagName === 'circle') {
                        if (id === 'Centre_circle') {
                            tl.to(el, { strokeDashoffset: 0, duration: 0.35 });
                        } else {
                            tl.to(el, { opacity: 1, duration: 0.2 });
                        }
                    } else {
                        tl.to(el, { strokeDashoffset: 0, duration: 0.35 });
                    }
                });
                return tl;
            };

            // Construit une timeline de reset (sens inverse)
            const buildResetTimeline = () => {
                const reversed = [...animationOrder].reverse();
                const tl = gsap.timeline({ paused: true, defaults: { ease: 'power1.inOut' } });
                reversed.forEach((id) => {
                    const el = svg.querySelector(`#${id}`);
                    if (!el) return;
                    if (el.tagName === 'circle') {
                        if (id === 'Centre_circle') {
                            const length = el.getTotalLength();
                            tl.to(el, { strokeDashoffset: length, duration: 0.25 });
                        } else {
                            tl.to(el, { opacity: 0, duration: 0.15 });
                        }
                    } else {
                        const length = el.getTotalLength();
                        tl.to(el, { strokeDashoffset: length, duration: 0.25 });
                    }
                });
                return tl;
            };

            // Lance play en annulant tout reset en cours
            const playAnimation = () => {
                if (animatingRef.current) return;
                
                // Si un reset est en cours, le tuer et marquer comme non-resetting
                if (resettingRef.current) {
                    if (resetTlRef.current && resetTlRef.current.isActive()) {
                        resetTlRef.current.kill();
                    }
                    resettingRef.current = false;
                }
                
                // Nettoyer les anciens tweens
                killAllTweens(svg, animationOrder);
                
                // Nettoyer l'ancienne timeline de play si elle existe
                if (playTlRef.current) {
                    playTlRef.current.kill();
                    playTlRef.current = null;
                }
                
                // Créer une nouvelle timeline basée sur l'état actuel
                playTlRef.current = buildPlayTimeline();
                
                // Si tout était déjà visible (timeline vide), rien à jouer
                if (!playTlRef.current || playTlRef.current.duration() === 0) {
                    if (leavePendingRef.current) {
                        leavePendingRef.current = false;
                        startReset();
                    }
                    return;
                }
                
                animatingRef.current = true;
                playTlRef.current.eventCallback('onComplete', () => {
                    animatingRef.current = false;
                    if (leavePendingRef.current) {
                        leavePendingRef.current = false;
                        startReset();
                    }
                });
                
                playTlRef.current.timeScale(PLAY_SPEED).play(0);
            };

            const startReset = () => {
                // Ne pas doubler
                if (resettingRef.current) return;
                
                // Si play actif, marquer pending et attendre fin
                if (animatingRef.current || (playTlRef.current && playTlRef.current.isActive())) {
                    leavePendingRef.current = true;
                    return;
                }
                
                resettingRef.current = true;
                
                // Nettoyer les tweens actifs
                killAllTweens(svg, animationOrder);
                
                // Nettoyer l'ancienne timeline de reset si elle existe
                if (resetTlRef.current) {
                    resetTlRef.current.kill();
                    resetTlRef.current = null;
                }
                
                // Créer une nouvelle timeline de reset basée sur l'état actuel
                resetTlRef.current = buildResetTimeline();
                
                // Si rien à resetter, terminer immédiatement
                if (!resetTlRef.current || resetTlRef.current.duration() === 0) {
                    resettingRef.current = false;
                    return;
                }
                
                resetTlRef.current.eventCallback('onComplete', () => {
                    resettingRef.current = false;
                    // S'assurer que tous les éléments sont bien cachés
                    animationOrder.forEach((id) => {
                        const el = svg.querySelector(`#${id}`);
                        if (!el) return;
                        if (el.tagName === 'circle') {
                            if (id === 'Centre_circle') {
                                const length = el.getTotalLength();
                                gsap.set(el, { strokeDashoffset: length });
                            } else {
                                gsap.set(el, { opacity: 0 });
                            }
                        } else {
                            const length = el.getTotalLength();
                            gsap.set(el, { strokeDashoffset: length });
                        }
                    });
                });
                
                resetTlRef.current.timeScale(RESET_SPEED).play(0);
            };

            // Initialisation à l'état caché au premier rendu
            resetSVGInstant(svg, animationOrder);

            // Créer le ScrollTrigger une fois le plugin chargé
            const trigger = ScrollTriggerLocal && ScrollTriggerLocal.create({
                trigger: sectionRef.current,
                start: 'top 80%',
                end: 'bottom 80%',
                once: false,
                onEnter: playAnimation,
                onEnterBack: playAnimation,
                onLeave: startReset,
                onLeaveBack: startReset,
            });

            return () => {
                trigger && trigger.kill();
            };
        };

        let cleanupFn;
        init().then((fn) => { cleanupFn = fn; });
        return () => { if (typeof cleanupFn === 'function') cleanupFn(); };
    }, []);

    return (
        <section ref={sectionRef} className="w-screen overflow-hidden relative">
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center pointer-events-none'>
                <h2 className='text-center bigH2 relative'>
                    <p>whenever</p>
                    <p>you play, we're</p> 
                    <p>by your side</p>
                    <div className="absolute max-[520px]:bottom-[-40%] bottom-[-4%] max-[520px]:right-[5%] right-[22%]">
                        <RoundedIcon icon="main" size={150} circularContinue={true} />
                    </div>
                    <Etiquette text="DESIGN / MOTION / 3D / DEVELOPMENT" />
                </h2>
                <p className='absolute uppercase robotoReg text-center bottom-[5%] text-[22px] hidden lg:block'>Game Plan Deployed</p>
            </div>
            <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox={`0 0 1704.95 1110`}
                preserveAspectRatio="xMidYMid meet"
                className="
                    transition-transform duration-500
                    max-[520px]:rotate-90
                    max-[520px]:h-screen
                    max-[520px]:w-[150%]!
                    max-[520px]:-ml-[25%]!
                "
                style={{
                    width: '106%',
                    maxWidth: 'none',
                    marginLeft: '-3%',
                    opacity: '0.5',
                    transformOrigin: "center center",
                }}
            >
                <g id="Calque_15">
                    <path id="Penalty_area_line" className="st0" d="M1659.75,244.71h-253.72v619.99h253.72" />
                </g>
                <g id="Calque_16">
                    <path id="Goal_area_line" className="st0" d="M1659.75,413.85h-84.57v281.7h84.57" />
                </g>
                <g id="Calque_17">
                    <circle id="Penalty_mark" className="st1" cx="1491.53" cy="554.7" r="11.53" />
                </g>
                <g id="Calque_10">
                    <path id="Penalty_arc" className="st0" d="M1406.04,442.96c-61.71,47.22-73.47,135.52-26.25,197.24,7.55,9.87,16.38,18.7,26.25,26.25" />
                </g>
                <g id="Calque_11">
                    <path id="Penalty_area_line1" data-name="Penalty_area_line" className="st0" d="M45.19,864.7h253.72V244.71H45.19" />
                </g>
                <g id="Calque_12">
                    <path id="Goal_area_line1" data-name="Goal_area_line" className="st0" d="M45.19,695.55h84.57v-281.7H45.19" />
                </g>
                <g id="Calque_2">
                    <circle id="Penalty_mark1" data-name="Penalty_mark" className="st1" cx="213.42" cy="554.7" r="11.53" />
                </g>
                <g id="Calque_3">
                    <path id="Penalty_arc1" data-name="Penalty_arc" className="st0" d="M298.91,666.45c61.71-47.22,73.47-135.52,26.25-197.24-7.55-9.87-16.38-18.7-26.25-26.25" />
                </g>
                <g id="Calque_4">
                    <circle id="Centre_mark" className="st1" cx="852.47" cy="554.7" r="11.53" />
                </g>
                <g id="Calque_5">
                    <circle id="Centre_circle" className="st0" cx="852.47" cy="554.7" r="140.7" />
                </g>
                <g id="Calque_6">
                    <path id="Centre_line" className="st0" d="M852.47,1077.51V31.89" />
                </g>
                <g id="Calque_7">
                    <path id="Border" className="st0" d="M45.19,1077.51V31.89h1614.56v1045.62H45.19Z" />
                </g>
                <g id="Calque_8">
                    <path id="Corner_arcs" className="st0" d="M75.95,1077.51c0-16.98-13.77-30.75-30.75-30.75M45.19,62.65c16.98,0,30.75-13.77,30.75-30.75M1629,31.89c0,16.98,13.77,30.75,30.75,30.75M1659.75,1046.76c-16.98,0-30.75,13.77-30.75,30.75" />
                </g>
            </svg>
        </section>
    );
} 