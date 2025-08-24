'use client'
import { useState, useRef, useEffect } from "react";

export const Clock = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const clockRef = useRef(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const options = {
                root: null,
                rootMargin: '0px',
                threshold: 1.0,
            };
            
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) {
                const intervalId = setInterval(() => {
                    setCurrentTime(new Date());
                }, 1000);
                
            return () => clearInterval(intervalId);
            }
        }, options);
            
        if (clockRef.current) {
            observer.observe(clockRef.current);
        }
            
        return () => {
            if (clockRef.current) {
                observer.unobserve(clockRef.current);
            }
        };
        }
    }, []);

        
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    return(
        <>
            <p ref={clockRef} className="robotoRegular text-[14pt]">
                game time : <span className="opacity-55">{hours}:{minutes}:{seconds} UTC+2</span>
            </p>
            
        </>
    )

}