import React, { useState, useEffect } from 'react';
import styles from './navbar.module.scss';
import layoutStyle from '../layout.module.scss';
export default function Navbar() {
    const [logoColor, setLogoColor] = useState('white');
    const [isBetweenSections, setIsBetweenSections] = useState(false); // New state for tracking position

    useEffect(() => {
        const scrollToSlowly = (targetTop, duration) => {
            const start = window.pageYOffset;
            const distance = targetTop - start;
            const startTime = performance.now();
        
            const easeOutCubic = t => 1 - Math.pow(1 - t, 3); // Adjust the easing function
        
            const scrollStep = timestamp => {
                const currentTime = timestamp - startTime;
                const progress = Math.min(currentTime / duration, 1);
                const easedProgress = easeOutCubic(progress);
        
                window.scrollTo(0, start + distance * easedProgress);
        
                if (currentTime < duration) {
                    requestAnimationFrame(scrollStep);
                }
            };
        
            requestAnimationFrame(scrollStep);
        };

        const handleIntersection = (entries) => {
            entries.forEach(entry => {
                const top = entry.target.getBoundingClientRect().top + window.pageYOffset;
                if (entry.isIntersecting) {
                        // scrollToSlowly(top, 1000);
                    if (entry.target.classList.contains('white')) {
                        setLogoColor('dark');
                    } else {
                        setLogoColor('white');
                    }
                }                
            });
        };

        let observer = new IntersectionObserver(handleIntersection, {
            root: null,
            rootMargin: '0px',
            threshold: 0.15
        });

        const sections = document.querySelectorAll('.intersectLogo');
        sections.forEach(section => {
            observer.observe(section);
        });
        
        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <>
            <div id={styles.navbar} className={layoutStyle.container}>
                <div className={`${styles.logo} ${styles[logoColor]}`}>
                    <img src="../images/logo.svg"/>
                </div>
                <button className={styles.menuBTN}><svg xmlns="http://www.w3.org/2000/svg" width="74" height="35" viewBox="0 0 74 35"><g><g><g><path fill="#fff" d="M.441 5.07V.683H37V5.07z"/><path fill="none" d="M.441 5.07V.683H37V5.07z"/></g><g><path fill="#fff" d="M.441 19.694v-4.387h55.57v4.387z"/><path fill="none" d="M.441 19.694v-4.387h55.57v4.387z"/></g><g><path fill="#fff" d="M37 34.317V29.93h36.559v4.387z"/><path fill="none" d="M37 34.317V29.93h36.559v4.387z"/></g></g></g></svg></button>
            </div>
        </>
    );
}
