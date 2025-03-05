import { useAnimation, useInView, motion } from "framer-motion";
import { useRef, useEffect } from "react";
import {
    animationContainer,
  } from "../../lib/animation/variant";

const Section = ({ children }) => {
    const controls = useAnimation();
    const ref = useRef(null);
    const isInView = useInView(ref, { once: false });
  
    useEffect(() => {
      if (isInView) {
        controls.start("visible");
      } else {
        controls.start("hidden");
      }
    }, [controls, isInView]);
    return (
      <motion.div
        ref={ref}
        initial="hidden"
        animate={controls}
        variants={animationContainer}
      >
        {children}
      </motion.div>
    );
  }

export default Section;