import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function AnimatedEyes() {
    const svgRef = useRef(null);
    const leftPupilRef = useRef(null);
    const rightPupilRef = useRef(null);
    const leftEyeRef = useRef(null);
    const rightEyeRef = useRef(null);
    const leftEyebrowRef = useRef(null);
    const rightEyebrowRef = useRef(null);

    useEffect(() => {
        if (!leftPupilRef.current || !rightPupilRef.current || 
            !leftEyeRef.current || !rightEyeRef.current || !svgRef.current) return;

        const pupilIntensity = 10;
        const eyeIntensity = 3;
        
        const pupilDuration = 0.12;
        const eyeDuration = 0.4;

        const leftPupil = {
            setX: gsap.quickTo(leftPupilRef.current, 'x', { duration: pupilDuration, ease: 'power2.out' }),
            setY: gsap.quickTo(leftPupilRef.current, 'y', { duration: pupilDuration, ease: 'power2.out' })
        };

        const rightPupil = {
            setX: gsap.quickTo(rightPupilRef.current, 'x', { duration: pupilDuration, ease: 'power2.out' }),
            setY: gsap.quickTo(rightPupilRef.current, 'y', { duration: pupilDuration, ease: 'power2.out' })
        };

        const leftEye = {
            setX: gsap.quickTo(leftEyeRef.current, 'x', { duration: eyeDuration, ease: 'power2.out' }),
            setY: gsap.quickTo(leftEyeRef.current, 'y', { duration: eyeDuration, ease: 'power2.out' })
        };

        const rightEye = {
            setX: gsap.quickTo(rightEyeRef.current, 'x', { duration: eyeDuration, ease: 'power2.out' }),
            setY: gsap.quickTo(rightEyeRef.current, 'y', { duration: eyeDuration, ease: 'power2.out' })
        };

        let isRAFRunning = false;
        let lastMouse = { x: 0, y: 0 };

        const update = () => {
            const mx = lastMouse.x;
            const my = lastMouse.y;

            const svgRect = svgRef.current.getBoundingClientRect();
            const cx = svgRect.left + svgRect.width / 2;
            const cy = svgRect.top + svgRect.height / 2;

            let dx = mx - cx;
            let dy = my - cy;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist > 0) {
                dx /= dist;
                dy /= dist;
            }

            leftEye.setX(dx * eyeIntensity);
            leftEye.setY(dy * eyeIntensity);
            rightEye.setX(dx * eyeIntensity);
            rightEye.setY(dy * eyeIntensity);

            leftPupil.setX(dx * pupilIntensity);
            leftPupil.setY(dy * pupilIntensity);
            rightPupil.setX(dx * pupilIntensity);
            rightPupil.setY(dy * pupilIntensity);

            isRAFRunning = false;
        };

        const onMouseMove = (e) => {
            lastMouse.x = e.clientX;
            lastMouse.y = e.clientY;
            if (!isRAFRunning) {
                requestAnimationFrame(update);
                isRAFRunning = true;
            }
        };

        const eyebrowRaise = () => {
            if (leftEyebrowRef.current && rightEyebrowRef.current) {
                gsap.to([leftEyebrowRef.current, rightEyebrowRef.current], {
                    y: -8,
                    duration: 0.15,
                    ease: 'power2.out',
                    onComplete: () => {
                        gsap.to([leftEyebrowRef.current, rightEyebrowRef.current], {
                            y: 0,
                            duration: 0.2,
                            ease: 'power2.in'
                        });
                    }
                });
            }
        };

        const scheduleEyebrowRaise = () => {
            const delay = 3000 + Math.random() * 5000;
            return setTimeout(() => {
                eyebrowRaise();
                eyebrowInterval = scheduleEyebrowRaise();
            }, delay);
        };

        let eyebrowInterval = scheduleEyebrowRaise();
        window.addEventListener('mousemove', onMouseMove);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            if (eyebrowInterval) clearTimeout(eyebrowInterval);
        };
    }, []);

    return (
        <svg ref={svgRef} viewBox="0 0 500 500" style={{ width: '100%', height: '100%' }}>
            {/* Sourcil gauche */}
            <g ref={leftEyebrowRef}>
                <path d="M163.35,200.38s14.96-29.21,34.2-27.55c3.8.36,11.64.12,25.41,15.56-5.34-2.26-30.22-18.85-59.62,11.99Z"/>
            </g>

            {/* Sourcil droit */}
            <g ref={rightEyebrowRef}>
                <path d="M336.65,200.38s-14.96-29.21-34.2-27.55c-3.8.36-11.64.12-25.41,15.56,5.34-2.26,30.22-18.85,59.62,11.99Z"/>
            </g>

            {/* ŒIL GAUCHE - Contour variable (épais côtés/bas, fin haut) */}
            <g ref={leftEyeRef}>
                {/* Forme noire extérieure */}
                <path 
                    fill="black"
                    d="M242.17,266.74c-.65-34.51-20.01-62.13-43.23-61.69-23.22.44-41.52,28.77-40.87,63.28.65,34.51,20.01,62.13,43.23,61.69,23.22-.44,41.52-28.77,40.87-63.28Z"
                />
                {/* Trou blanc intérieur (décalé vers le haut pour effet épaisseur variable) */}
                <ellipse cx="200" cy="262" rx="35" ry="52" fill="#fa6218"/>
            </g>

            {/* PUPILLE GAUCHE */}
            <g ref={leftPupilRef}>
                <ellipse cx="200" cy="285" rx="21" ry="24" fill="black"/>
                <ellipse cx="191" cy="278" rx="8" ry="8" fill="#fa6218"/>
            </g>

            {/* ŒIL DROIT - Contour variable (épais côtés/bas, fin haut) */}
            <g ref={rightEyeRef}>
                {/* Forme noire extérieure */}
                <path 
                    fill="black"
                    d="M298.7,330.02c23.22.44,42.58-27.18,43.23-61.69.65-34.51-17.65-62.84-40.87-63.28-23.22-.44-42.58,27.18-43.23,61.69s17.64,62.84,40.87,63.28Z"
                />
                {/* Trou blanc intérieur (décalé vers le haut pour effet épaisseur variable) */}
                <ellipse cx="300" cy="262" rx="35" ry="52" fill="#fa6218"/>
            </g>

            {/* PUPILLE DROITE */}
            <g ref={rightPupilRef}>
                <ellipse cx="300" cy="285" rx="21" ry="24" fill="black"/>
                <ellipse cx="309" cy="278" rx="8" ry="8" fill="#fa6218"/>
            </g>
        </svg>
    );
}