import { useEffect, useRef, useState } from 'react';
import { useInView } from "framer-motion";

export default function AnimateText({ children, once }) {
    const textRef = useRef()
    const ref = useRef()
    const isInView = useInView(ref, { once: true });


    useEffect(() => {
            const animateElements = (elements) => {
              Array.from(elements).forEach((el, index) => {
                setTimeout(() => {
                  el.classList.add('show');
                }, index * 200);
                el.children[0].style.animationDelay = `${index * 0.15}s`;
                el.children[0].classList.add('revealed');
              });
            };
        
            if (once) {
              const entries = textRef;
              const childs  = entries.current.children
              animateElements(childs);
            }else{
                if(isInView){
                    const entries = ref;
                    const childs  = entries.current.children
                    animateElements(childs);
                }
            }

    }, [once, isInView]);

    if (once){
        return (
            <>
            <div className="reveal" ref={textRef}>
                {children}
            </div>
            </>
        );
    }else{
        return (
            <>
            <div className="reveal" ref={ref}>
                {children}
            </div>
            </>
        );
    }

}