// components/Cursor.js
import { useEffect } from 'react';
import gsap from 'gsap';

export default function Cursor() {
  useEffect(() => {
    gsap.set(".cursor", {xPercent: -50, yPercent: -50});
    
    let xTo = gsap.quickTo(".cursor", "x", {duration: 0.6, ease: "power3"});
    let yTo = gsap.quickTo(".cursor", "y", {duration: 0.6, ease: "power3"});
  
    const handleMouseMove = (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    window.addEventListener("mousemove", handleMouseMove);
    
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return <div className="cursor" />;
}