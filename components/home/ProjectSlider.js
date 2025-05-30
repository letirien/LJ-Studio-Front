"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import home from "../../styles/home.module.scss";
import Section from './Section.js';
import dynamic from 'next/dynamic';
import {
  fadeInRight,
  fadeInUp,
  fadeInLeft
} from "../../lib/animation/variant";

// Bibliothèque GSAP externe - chargée dynamiquement
const gsapLib = {
  gsap: null,
  Observer: null,
  loaded: false
};

export function SliderDot({ Nb, idProject, home, onButtonClick }) {
  const handleDotClick = (index) => {
    onButtonClick(index);
  };
  
  const circles = Array.from({ length: Nb }, (_, index) => (
    <motion.div
      key={index}
      variants={fadeInRight}
      className={`${home.cercle} ${
        index === idProject - 1 ? home.current : ""
      }`}
      onClick={() => handleDotClick(index + 1)}
    />
  ));

  return <div className={home.cercleContainer}>{circles}</div>;
}

export default function ProjectSlider({ projects, navRef }) {
    const [idProject, setIdProject] = useState(1);
    const [idProjectDelay, setDelayIdProject] = useState(1);
    const sectionRef = useRef(null);
    const [isVisible, setIsVisible] = useState(false)
    const [isAnimating, setIsAnimating] = useState(false);
    const [direction, setDirection] = useState(0);
    const containerRef = useRef(null);
    const slideRefs = useRef([]);
    const slideInnerRefs = useRef([]);
    const decoRef = useRef(null);
    const totalProjects = projects.length;

    // Initialiser les refs pour chaque slide
    useEffect(() => {
        // Créer des références DOM réelles pour tous les slides dès le début
        slideRefs.current = Array(totalProjects).fill().map((_, i) => {
            const existing = slideRefs.current[i];
            return existing || React.createRef();
        });
        
        slideInnerRefs.current = Array(totalProjects).fill().map((_, i) => {
            const existing = slideInnerRefs.current[i];
            return existing || React.createRef();
        });
        
        // Force un re-render pour s'assurer que les refs sont attachées
        // aux éléments DOM avant la première animation
        setIdProject(idProject);
    }, [totalProjects]);

    const anim = () => {
      const secondParagraph = document.querySelectorAll(".container-txt p:nth-of-type(2)");
    
      // Vérifier si le deuxième <p> existe
      if (secondParagraph) {
        // Appliquer l'animation à ses enfants
        Array.from(secondParagraph).forEach(el=>el.classList.add("slideUpInfoImg"))

        // Après l'animation, enlever la classe d'animation
        setTimeout(() => {
          Array.from(secondParagraph).forEach(el=> el.classList.remove("slideUpInfoImg"))
        }, 1600);
      }
    };
    const [firstClickHandled, setFirstClickHandled] = useState(false);

    // Handler pour la navigation
    const handleNavigation = (dir) => {
        if (isAnimating || !gsapLib.loaded) return false;
        setIsAnimating(true);
        setDirection(dir);

        const previousId = idProject;
        const newId =
            dir === 1
                ? previousId < totalProjects
                    ? previousId + 1
                    : 1
                : previousId > 1
                ? previousId - 1
                : totalProjects;
        
        // Effectuer l'animation de transition
        const currentSlide = slideRefs.current[previousId - 1].current;
        const currentInner = slideInnerRefs.current[previousId - 1].current;
        const upcomingSlide = slideRefs.current[newId - 1].current;
        const upcomingInner = slideInnerRefs.current[newId - 1].current;
        const deco = decoRef.current;

        if (!currentSlide || !currentInner || !upcomingSlide || !upcomingInner || !deco) {
            console.error('Some slide references are missing', {
                currentSlide, currentInner, upcomingSlide, upcomingInner, deco
            });
            setIsAnimating(false);
            return;
        }
        // Animation séquence avec GSAP
        setIdProject(newId);
        anim()
        setTimeout(()=>{
          setDelayIdProject(newId)
        }, 300)

        if (!firstClickHandled) {
            // Force l'état visible pour le slide actuel avant l'animation
            gsapLib.gsap.set(currentSlide, { autoAlpha: 1 });
            gsapLib.gsap.set(currentInner, { autoAlpha: 1 });
            setFirstClickHandled(true);
        }

        gsapLib.gsap.timeline({
            defaults: {
                duration: 1.3
            },
            onComplete: () => {
                setIsAnimating(false);
            }
        })
        .addLabel('start', 0)
        .to(currentSlide, {
            duration: 0.4,
            ease: 'power2.in',
            yPercent: -dir * 100
        }, 'start')
        .to(currentInner, {
            duration: 0.4,
            ease: 'power2.in',
            yPercent: dir * 75,
            rotation: -dir * 2
        }, 'start')
        .fromTo(deco, {
            yPercent: dir * 100,
            autoAlpha: 1
        }, {
            duration: 0.4,
            ease: 'power2.in',
            yPercent: 0,
        }, 'start')
        
        .addLabel('middle', 'start+=0.5')
        .to(deco, {
            ease: 'expo',
            yPercent: -dir * 100,
        }, 'middle')
        .fromTo(upcomingSlide, {
            autoAlpha: 1,
            yPercent: dir * 100
        }, {
            ease: 'expo',
            yPercent: 0
        }, 'middle')
        .fromTo(upcomingInner, {
            yPercent: -dir * 75,
            rotation: dir * 2
        }, {
            ease: 'expo',
            yPercent: 0,
            rotation: 0
        }, 'middle');
    };

    // Navigation handlers
    const navigationHandler = useRef({
        handleNext: () => handleNavigation(1),
        handlePrev: () => handleNavigation(-1)
    });

    // Update navigation handlers when needed
    useEffect(() => {
        navigationHandler.current = {
            handleNext: () => handleNavigation(1),
            handlePrev: () => handleNavigation(-1),
        };
    }, [idProject, isAnimating, totalProjects]);

    // Exposer les méthodes de navigation au parent via la ref
    useEffect(() => {
        if (navRef) {
            navRef.current = {
                handleNext: navigationHandler.current.handleNext,
                handlePrev: navigationHandler.current.handlePrev
            };
        }
    }, [navRef, idProject, isAnimating]);

    // Charger GSAP et initialiser l'Observer
    useEffect(() => {
        let observer = null;
        
        const loadGSAP = async () => {
            try {
                const gsapModule = await import('gsap');
                const observerModule = await import('gsap/Observer');
                
                gsapLib.gsap = gsapModule.gsap;
                gsapLib.Observer = observerModule.Observer;
                gsapLib.gsap.registerPlugin(gsapLib.Observer);
                gsapLib.loaded = true;
                
                // Attendre un court délai pour s'assurer que tout est initialisé
                setTimeout(() => {
                    setSliderReady(true);
                }, 200);
                // Initialiser l'Observer pour le scroll et les interactions tactiles
                observer = gsapLib.Observer.create({
                    type: "touch,pointer",
                    onDown: () => navigationHandler.current.handlePrev(),
                    onUp: () => navigationHandler.current.handleNext(),
                    wheelSpeed: -1,
                    tolerance: 10,
                });
            } catch (error) {
                console.error("Erreur lors du chargement de GSAP:", error);
            }
        };
        
        loadGSAP();
        
        // Nettoyage
        return () => {
            if (observer) {
                observer.kill();
            }
        };
    }, []);

    // Fonction pour précharger les images
    useEffect(() => {
        const preloadImages = async () => {
            const imagePromises = projects.map(project => {
                return new Promise((resolve) => {
                    const img = new Image();
                    img.onload = resolve;
                    img.onerror = resolve; // Continuer même si l'image ne charge pas
                    img.src = project.fields.Image[0].url;
                });
            });
            
            await Promise.all(imagePromises);
            
            // Ajouter une classe loaded ou autre effet quand tout est chargé
            if (containerRef.current) {
                containerRef.current.classList.add(home.loaded || 'loaded');
            }
        };
        
        preloadImages();
    }, [projects]);

    useEffect(()=>{
      const observer = new IntersectionObserver(
          ([entry]) => {
              setIsVisible(entry.isIntersecting);
          },
          { threshold: 0.7 } // Ajuste le seuil pour déclencher l'effet plus tôt ou plus tard
      );

      if (sectionRef.current) {
          observer.observe(sectionRef.current);
      }

      return () => {
          if (sectionRef.current) {
              observer.unobserve(sectionRef.current);
          }
      };
    },[])
    return (
        <div 
            ref={sectionRef} 
            className={`relative transition-all duration-500 ease-in-out ${isVisible ? "-mt-[6%]" : "mt-0"}`}
        > 
         <div id="sliderContainer" className={`${home.sliderContainer} mx-auto rounded-md`}>
              <div className={`rounded-md ${home.sliderWrapper}`} ref={containerRef}>
                  {/* Élément décoratif pour les transitions */}
                  <div className={`rounded-md ${home.deco}`} ref={decoRef}></div>
                  
                  {projects.map((project, index) => (
                      <div
                          key={project.id}
                          className={
                              index + 1 === idProject
                                  ? `${home.projectSlide} ${home.active}`
                                  : home.projectSlide
                          }
                          ref={slideRefs.current[index]}
                      >
                          <div 
                              className={`rounded-md ${home.slideInner}`}
                              ref={slideInnerRefs.current[index]}
                          >
                              <Image
                                  src={project.fields.Image[0].url}
                                  alt={project.title}
                                  width={1920}
                                  height={1080}
                                  priority
                                  className={`${home.slideImg} rounded-xs`}
                              />
                          </div>
                      </div>
                  ))}
              </div>
          </div>
          <div className={home.slideBlock}>
                <Section>
                    <div className={home.containerSlideInfo}>
                        <SliderDot
                            Nb={totalProjects}
                            idProject={idProject}
                            home={home}
                            onButtonClick={(id) => {
                                if (isAnimating) return;
                                const dir = id > idProject ? 1 : -1;
                                setDirection(dir);
                                handleNavigation(dir);
                            }}
                        />
                    </div>
                </Section>
            </div>

            <Section>
                <motion.div className={`items-top lg:items-center ${home.projectFooter}`} variants={fadeInUp}>
                    {['Team', 'Match Day', 'Game Plan', 'Perf'].map((field) => (
                        <div className={home.footerInfo} key={field}>
                            <div className="container-txt flex flex-col lg:flex-row items-center flex-wrap gap-2">
                                <p className='harbop !text-[48px] uppercase leading-9'>{field}</p>
                                <motion.p variants={fadeInUp} className={`${home.subInfo} flex-1 text-center lg:text-left`}>
                                    {projects[idProjectDelay - 1].fields[field]}
                                </motion.p>
                            </div>
                        </div>
                    ))}
                    <div className={`${home.footerInfo}`}>
                        <p className={home.slideCount}>
                            0
                            <motion.span key={idProject}>{idProject}</motion.span>.
                        </p>
                    </div>
                </motion.div>
            </Section>
        </div>
    );
}