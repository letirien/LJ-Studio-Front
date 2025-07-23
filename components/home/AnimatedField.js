import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const FIELD_PATHS = [
    'Penalty_area_line',
    'Goal_area_line',
    'Penalty_arc',
    'Penalty_area_line1',
    'Goal_area_line1',
    'Penalty_arc1',
    'Border',
];

const ALL_POINTS = ['Centre_mark', 'Penalty_mark', 'Penalty_mark1'];

export default function AnimatedField() {
    const svgRef = useRef(null);
    const sectionRef = useRef(null);

    // Fonction pour réinitialiser tous les éléments SVG à l'état caché (animé, sens inverse)
    const resetSVGAnimated = (svg, animationOrder, onComplete) => {
        // On anime dans l'ordre inverse
        const reversed = [...animationOrder].reverse();
        const resetNext = (i) => {
            if (i >= reversed.length) {
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

        // Fonction d'animation séquentielle (apparition)
        const animateNext = (i) => {
            if (i >= animationOrder.length) return;
            const id = animationOrder[i];
            const el = svg.querySelector(`#${id}`);
            if (!el) {
                animateNext(i + 1);
                return;
            }
            if (el.tagName === 'circle') {
                if (id === 'Centre_circle') {
                    const length = el.getTotalLength();
                    gsap.to(el, {
                        strokeDashoffset: 0,
                        duration: 0.5,
                        ease: 'power1.inOut',
                        onComplete: () => animateNext(i + 1),
                    });
                } else {
                    gsap.to(el, {
                        opacity: 1,
                        duration: 0.3,
                        onComplete: () => animateNext(i + 1),
                    });
                }
            } else {
                const length = el.getTotalLength();
                gsap.to(el, {
                    strokeDashoffset: 0,
                    duration: 0.5,
                    ease: 'power1.inOut',
                    onComplete: () => animateNext(i + 1),
                });
            }
        };

        // ScrollTrigger pour lancer l'animation à chaque entrée/sortie de la section
        const trigger = ScrollTrigger.create({
            trigger: sectionRef.current,
            start: 'top 80%',
            end: 'bottom 80%',
            once: false,
            onEnter: () => {
                animateNext(0);
            },
            onEnterBack: () => {
                animateNext(0);
            },
            onLeave: () => {
                resetSVGAnimated(svg, animationOrder);
            },
            onLeaveBack: () => {
                resetSVGAnimated(svg, animationOrder);
            },
        });

        // Initialisation à l'état caché au premier rendu
        resetSVGInstant(svg, animationOrder);

        return () => {
            trigger && trigger.kill();
        };
    }, []);

    return (
        <section ref={sectionRef} className="overflow-hidden relative">
            <div className='absolute top-0 left-0 w-full h-full flex justify-center items-center'>
                <h2 className='text-center HardbopH2'>
                    <p>whenever</p>
                    <p>you play, we're</p> 
                    <p>by your side</p>
                </h2>
            </div>
            <svg
                ref={svgRef}
                xmlns="http://www.w3.org/2000/svg"
                version="1.1"
                viewBox={`0 0 1704.95 1110`}
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: '106%',
                    maxWidth: 'none',
                    marginLeft: '-3%',
                    opacity: '0.5',
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