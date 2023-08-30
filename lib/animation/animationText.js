import { useEffect, useRef } from 'react';

export default function AnimateText({ children }) {
    const textRef = useRef(null);

    useEffect(() => {
        const entries = textRef
        const childs  = entries.current.children

        Array.from(childs).forEach((el, index) => {
            setTimeout(() => {
                el.classList.add('show');
            }, index * 200);
            el.children[0].style.animationDelay = `${index * 0.15}s`; // Ajoutez un délai différent pour chaque élément
            el.children[0].classList.add('revealed')
        })
    }, []);

    return (
        <>
        <div className="reveal" ref={textRef}>
            {children}
        </div>
        </>
    );
}