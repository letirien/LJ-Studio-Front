'use client'
import { useState, useRef, useEffect } from "react";

export const Clock = () => {
    const [currentTime, setCurrentTime] = useState(null);
    const [isMounted, setIsMounted] = useState(false);
    const clockRef = useRef(null);

    useEffect(() => {
        setIsMounted(true);
        setCurrentTime(new Date());

        const intervalId = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    // Afficher un placeholder pendant le SSR pour éviter l'erreur d'hydratation
    if (!isMounted || !currentTime) {
        return (
            <p ref={clockRef} className="robotoRegular text-[14pt] text-center">
                game time:<span className="opacity-55">--:--:-- UTC+2</span>
            </p>
        );
    }

    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');
    const seconds = String(currentTime.getSeconds()).padStart(2, '0');

    return (
        <p ref={clockRef} className="robotoRegular text-[12px] sm:text-[14pt] text-center">
            game time : <span className="opacity-55">{hours}:{minutes}:{seconds} UTC+2</span>
        </p>
    );
}