import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import LinkedInIcon from '../../public/images/logosRs/LINKEDIN.svg';
import XIcon from '../../public/images/logosRs/X.svg';
import InstagramIcon from '../../public/images/logosRs/INSTA.svg';
import BehanceIcon from '../../public/images/logosRs/BEHANCE.svg';
import RoundedIcon from '../RoundedIcon';

// Enregistrer le plugin GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(CustomEase);
  CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
}

export const SideMenu = ({ isOpen: initialIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  
  // Refs pour les animations
  const menuContainerRef = useRef(null);
  const menuLinksRef = useRef([]);
  const socialsRef = useRef([]);
  const sideTextRef = useRef(null);
  const linkTextRefs = useRef([]);
  const tlRef = useRef(null);

  // Initialiser le timeline GSAP
  useEffect(() => {
    tlRef.current = gsap.timeline({
      defaults: {
        ease: "main",
        duration: 0.7
      }
    });

    return () => {
      if (tlRef.current) {
        tlRef.current.kill();
      }
    };
  }, []);

  // Synchroniser l'état local avec la prop initialIsOpen si elle change
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Animer à l'ouverture/fermeture
  useEffect(() => {
    if (isOpen) {
      openMenu();
    } else {
      closeMenu();
    }
  }, [isOpen]);

  const openMenu = () => {
    const tl = tlRef.current;
    
    tl.clear()
      .set(menuContainerRef.current, { x: '100%' })
      .to(menuContainerRef.current, { 
        x: '0%',
        duration: 0.7,
        ease: "main"
      })
      .fromTo(
        menuLinksRef.current,
        { yPercent: 140, rotate: 10, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.05, duration: 0.6 },
        "-=0.35"
      )
      .fromTo(
        socialsRef.current,
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        sideTextRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        "-=0.3"
      );
  };

  const closeMenu = () => {
    const tl = tlRef.current;
    
    tl.clear()
      .to(menuContainerRef.current, { 
        x: '100%',
        duration: 0.6,
        ease: "main"
      });
  };

  // Fonction pour basculer l'état et notifier le parent
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(!isOpen); // Notifie le parent de la mise à jour
  };
  const handleLinkHover = (index, isHovering) => {
    const linkRefs = linkTextRefs.current[index];
    if (!linkRefs?.top || !linkRefs?.bottom) return;

    gsap.killTweensOf([linkRefs.top, linkRefs.bottom]);

    if (isHovering) {
      const tl = gsap.timeline({ defaults: { ease: "main", duration: 0.45 } });
      tl.to(linkRefs.top, { yPercent: -100, rotate: -10, opacity: 0 })
        .fromTo(
          linkRefs.bottom,
          { yPercent: 100, rotate: 10, opacity: 0 },
          { yPercent: 0, rotate: 0, opacity: 1 },
          "-=0.35"
        );
    } else {
      const tl = gsap.timeline({ defaults: { ease: "main", duration: 0.45 } });
      tl.to(linkRefs.bottom, { yPercent: 100, rotate: 10, opacity: 0 })
        .to(linkRefs.top, { yPercent: 0, rotate: 0, opacity: 1 }, "-=0.35");
    }
  };
  

  // Fermeture avec Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        handleToggle();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  return (
    <>
      <div
        ref={menuContainerRef}
        className={`fixed top-0 right-0 h-[100vh] w-[100vw] sm:w-[50vw] bg-[#fa6218] flex flex-col items-start py-[4vh] px-[3vw] z-[500]`}
        style={{ transform: 'translateX(100%)' }}
      >
        <div className="flex w-full items-top my-auto">
          <div className='flex flex-1 flex-col space-y-6 font-bold uppercase text-black my-auto pl-[3vw]'>
            <div className="relative overflow-hidden">
              <a 
                ref={(el) => (menuLinksRef.current[0] = el)}
                href="#services" 
                className="text-[21vw] sm:text-[8vw] hover:text-white relative w-content hardbopBlack block w-min"
                onClick={handleToggle}
                onMouseEnter={() => handleLinkHover(0, true)}
                onMouseLeave={() => handleLinkHover(0, false)}
              >
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[0]) linkTextRefs.current[0] = {};
                    linkTextRefs.current[0].top = el;
                  }}
                  className="block text-layer text-top"
                >
                  SERVICES
                </span>
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[0]) linkTextRefs.current[0] = {};
                    linkTextRefs.current[0].bottom = el;
                  }}
                  className="block text-layer text-bottom absolute top-0 left-0 text-white"
                >
                  SERVICES
                </span>
                <span className='absolute text-black -right-9 top-0  mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular'>01</span>
              </a>
            </div>
            <div className="relative overflow-hidden">
              <a 
                ref={(el) => (menuLinksRef.current[1] = el)}
                href="#work" 
                className="hardbopBlack text-[19vw] sm:text-[8vw] hover:text-white block relative w-min"
                onClick={handleToggle}
                onMouseEnter={() => handleLinkHover(1, true)}
                onMouseLeave={() => handleLinkHover(1, false)}
              >
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[1]) linkTextRefs.current[1] = {};
                    linkTextRefs.current[1].top = el;
                  }}
                  className="block text-layer text-top"
                >
                  WORK
                </span>
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[1]) linkTextRefs.current[1] = {};
                    linkTextRefs.current[1].bottom = el;
                  }}
                  className="block text-layer text-bottom absolute top-0 left-0 text-white"
                >
                  WORK
                </span>
                <span className='absolute text-black -right-9 top-0 mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular'>02</span>
              </a>
            </div>
            <div className="relative overflow-hidden">
              <a 
                ref={(el) => (menuLinksRef.current[2] = el)}
                href="#archive" 
                className="hardbopBlack text-[19vw] leading-[0.8] sm:text-[8vw] hover:text-white block relative w-min"
                onClick={handleToggle}
                onMouseEnter={() => handleLinkHover(2, true)}
                onMouseLeave={() => handleLinkHover(2, false)}
              >
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[2]) linkTextRefs.current[2] = {};
                    linkTextRefs.current[2].top = el;
                  }}
                  className="block text-layer text-top"
                >
                  ARCHIVE
                </span>
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[2]) linkTextRefs.current[2] = {};
                    linkTextRefs.current[2].bottom = el;
                  }}
                  className="block text-layer text-bottom absolute top-0 left-0 text-white"
                >
                  ARCHIVE
                </span>
                <span className='absolute text-black -right-9 top-0  mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular'>03</span>
              </a>
            </div>
            <div className="relative overflow-hidden">
              <a 
                ref={(el) => (menuLinksRef.current[3] = el)}
                href="#about" 
                className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white block relative w-min"
                onClick={handleToggle}
                onMouseEnter={() => handleLinkHover(3, true)}
                onMouseLeave={() => handleLinkHover(3, false)}
              >
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[3]) linkTextRefs.current[3] = {};
                    linkTextRefs.current[3].top = el;
                  }}
                  className="block text-layer text-top"
                >
                  ABOUT
                </span>
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[3]) linkTextRefs.current[3] = {};
                    linkTextRefs.current[3].bottom = el;
                  }}
                  className="block text-layer text-bottom absolute top-0 left-0 text-white"
                >
                  ABOUT
                </span>
                <span className='absolute text-black -right-9 top-0 mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular'>04</span>
              </a>
            </div>
            <div className="relative overflow-hidden link-wrapper">
              <a
                ref={(el) => (menuLinksRef.current[4] = el)}
                href="#contact"
                className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white block relative w-min"
                onClick={handleToggle}
                onMouseEnter={() => handleLinkHover(4, true)}
                onMouseLeave={() => handleLinkHover(4, false)}
              >
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[4]) linkTextRefs.current[4] = {};
                    linkTextRefs.current[4].top = el;
                  }}
                  className="block text-layer text-top"
                >
                  CONTACT
                </span>
                <span 
                  ref={(el) => {
                    if (!linkTextRefs.current[4]) linkTextRefs.current[4] = {};
                    linkTextRefs.current[4].bottom = el;
                  }}
                  className="block text-layer text-bottom absolute top-0 left-0 text-white"
                >
                  CONTACT
                </span>
                <span className="absolute text-black -right-9 top-0 mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular">05</span>
              </a>
            </div>

          </div>
          <ul id="socials" className="text-black flex flex-col items-end mr-[3vw] md:mt-[15vh]">
            <li className='!mb-2'>
              <a 
                ref={(el) => (socialsRef.current[0] = el)}
                href="https://www.instagram.com/jean_luc_studio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hardbop-bold text-[17pt]"
              >
                <LinkedInIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a 
                ref={(el) => (socialsRef.current[1] = el)}
                href="https://www.instagram.com/jean_luc_studio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hardbop-bold text-[17pt]"
              >
                <XIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a 
                ref={(el) => (socialsRef.current[2] = el)}
                href="https://www.instagram.com/jean_luc_studio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hardbop-bold text-[17pt]"
              >
                <InstagramIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a 
                ref={(el) => (socialsRef.current[3] = el)}
                href="https://www.instagram.com/jean_luc_studio/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="hover:text-white hardbop-bold text-[17pt]"
              >
                <BehanceIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <p 
              ref={sideTextRef}
              className='w-full uppercase robotoBold text-[10pt] text-black/55 -rotate-90 origin-bottom-right border-r-2 pr-10 hidden 2xl:block'
            >
              creative studio with a french accent
            </p>
          </ul>
        </div>
        <div className="absolute top-[4vh] right-[3vw] flex">
          <button onClick={handleToggle} className="focus:outline-none !p-0 hover:cursor-pointer">
            <RoundedIcon icon="" size={120} rotationFactor={0} circularContinue={true} menu={true} />
          </button>
        </div>
        <p 
          ref={sideTextRef}
          className='text-center w-full uppercase robotoBold text-[10pt] text-black/55 2xl:hidden'
        >
          creative studio with a french accent
        </p>
      </div>
    </>
  );
};