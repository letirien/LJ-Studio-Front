import React, { useState, useEffect } from 'react';
import styles from './navbar.module.scss';
import layoutStyle from '../layout.module.scss';
import Image from 'next/image'

export default function Navbar() {
    const [logoColor, setLogoColor] = useState('white');
    const [isBetweenSections, setIsBetweenSections] = useState(false); // New state for tracking position

    useEffect(() => {
        console.log('Navbar useEffect exécuté');
        
        const handleScroll = () => {
            const sections = document.querySelectorAll('.intersectLogo.white');
            const navbar = document.getElementById(styles.navbar);
            
            if (!navbar) return;
            
            const navbarRect = navbar.getBoundingClientRect();
            const navbarBottom = navbarRect.bottom;
            
            sections.forEach(section => {
                const rect = section.getBoundingClientRect();
                if (rect.top <= navbarBottom && rect.bottom >= navbarBottom) {
                    setLogoColor('dark');
                    return;
                }else{
                    setLogoColor('white');
                }
            });
            
            
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll(); // Vérifier immédiatement
        
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    
    return (
        <>
            <div id={styles.navbar} className="mainContainer">
                <div className={`${styles.logo} ${styles[logoColor]}`}>
                    <Image
                        width={98}
                        height={98}
                        src="/images/LOGO.svg"
                        alt="LJ Studio LOGO"
                        style={{
                            objectFit: 'cover'
                        }}
                    />
                </div>
                <button className={styles.menuBTN}><svg xmlns="http://www.w3.org/2000/svg" width="74" height="35" viewBox="0 0 74 35"><g><g><g><path fill="#fff" d="M.441 5.07V.683H37V5.07z"/><path fill="none" d="M.441 5.07V.683H37V5.07z"/></g><g><path fill="#fff" d="M.441 19.694v-4.387h55.57v4.387z"/><path fill="none" d="M.441 19.694v-4.387h55.57v4.387z"/></g><g><path fill="#fff" d="M37 34.317V29.93h36.559v4.387z"/><path fill="none" d="M37 34.317V29.93h36.559v4.387z"/></g></g></g></svg></button>
            </div>
        </>
    );
}
