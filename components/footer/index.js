import Image from 'next/image';
import React, { useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import AppearText from '../AppearText';

// Animation hover email avec GSAP (même style que AppearText)
const EmailLink = () => {
  const containerRef = useRef(null);
  const wordsRef = useRef([[], []]); // [0] = original, [1] = duplicate
  const tlRef = useRef(null);

  const animateText = async (wordSet, from, to) => {
    if (!containerRef.current) return;
    tlRef.current?.kill();

    let gsapLib;
    try {
      gsapLib = await import('gsap');
      const CustomEase = (await import('gsap/CustomEase')).CustomEase;
      gsapLib.gsap.registerPlugin(CustomEase);
      try { CustomEase.create('main', '0.65, 0.01, 0.05, 0.99'); } catch (e) {}
    } catch (err) {
      return;
    }
    const gsap = gsapLib.gsap;
    const allWords = (wordsRef.current[wordSet] || []).filter(Boolean);
    if (!allWords.length) return;

    gsap.set(allWords, { yPercent: from });
    tlRef.current = gsap.to(allWords, {
      yPercent: to,
      duration: 0.6,
      stagger: 0.02,
      ease: 'main'
    });
  };

  const handleMouseEnter = () => {
    Promise.all([
      animateText(0, 0, -140),
      animateText(1, 140, 0)
    ]);
  };

  const handleMouseLeave = () => {
    Promise.all([
      animateText(1, 0, 140),
      animateText(0, -140, 0)
    ]);
  };

  const renderWords = (setIndex) => (
    <span className='flex items-baseline'>
      <span className='lowercase tenTwentyThin text-[20pt] sm:text-[32px] overflow-hidden inline-block'>
        <span ref={el => wordsRef.current[setIndex][0] = el} className='inline-block'>jean</span>
      </span>
      <span className='overflow-hidden inline-block'>
        <span ref={el => wordsRef.current[setIndex][1] = el} className='inline-block'>@LJSTUDIO.xyz</span>
      </span>
    </span>
  );

  return (
    <a
      ref={containerRef}
      href='mailto:jean@ljstudio.xyz'
      className='robotoBold text-[16pt] sm:text-[20px] !text-white uppercase relative inline-block hover:!text-[#fa6218]'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderWords(0)}
      <span className='absolute top-0 left-0' aria-hidden='true'>
        {renderWords(1)}
      </span>
    </a>
  );
};

// Animation hover back to top avec GSAP (même style que AppearText)
const BackToTopLink = ({ onClick }) => {
  const containerRef = useRef(null);
  const wordsRef = useRef([[], []]); // [0] = original, [1] = duplicate
  const tlRef = useRef(null);

  const animateText = async (wordSet, from, to) => {
    if (!containerRef.current) return;
    tlRef.current?.kill();

    let gsapLib;
    try {
      gsapLib = await import('gsap');
      const CustomEase = (await import('gsap/CustomEase')).CustomEase;
      gsapLib.gsap.registerPlugin(CustomEase);
      try { CustomEase.create('main', '0.65, 0.01, 0.05, 0.99'); } catch (e) {}
    } catch (err) {
      return;
    }
    const gsap = gsapLib.gsap;
    const allWords = (wordsRef.current[wordSet] || []).filter(Boolean);
    if (!allWords.length) return;

    gsap.set(allWords, { yPercent: from });
    tlRef.current = gsap.to(allWords, {
      yPercent: to,
      duration: 0.6,
      stagger: 0.02,
      ease: 'main'
    });
  };

  const handleMouseEnter = () => {
    Promise.all([
      animateText(0, 0, -140),
      animateText(1, 140, 0)
    ]);
  };

  const handleMouseLeave = () => {
    Promise.all([
      animateText(1, 0, 140),
      animateText(0, -140, 0)
    ]);
  };

  const ArrowUp = () => (
  <svg width="6" height="15" viewBox="0 0 6 15" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2.91412 5.44573e-07L0.000212246 4.98422L5.77363 5.01563L2.91412 5.44573e-07ZM2.83252 15L3.33251 15.0027L3.38963 4.50265L2.88964 4.49993L2.38965 4.49721L2.33253 14.9973L2.83252 15Z" fill="black"/>
  </svg>

  );

  const renderWords = (setIndex) => (
    <span className='flex items-center'>
      <span className='overflow-hidden inline-block'>
        <span ref={el => wordsRef.current[setIndex][0] = el} className='inline-block'>Back</span>
      </span>
      <span className='overflow-hidden inline-block ml-1'>
        <span ref={el => wordsRef.current[setIndex][1] = el} className='inline-block'>to</span>
      </span>
      <span className='overflow-hidden inline-block ml-1'>
        <span ref={el => wordsRef.current[setIndex][2] = el} className='inline-block'>the</span>
      </span>
      <span className='overflow-hidden inline-block ml-1'>
        <span ref={el => wordsRef.current[setIndex][3] = el} className='inline-block'>top</span>
      </span>
      <span className='overflow-hidden ml-2 inline-block'>
        <span ref={el => wordsRef.current[setIndex][4] = el} className='inline-block'><ArrowUp /></span>
      </span>
    </span>
  );

  return (
    <a
      ref={containerRef}
      onClick={onClick}
      className='robotoBold text-[7pt] sm:text-[14pt] no-underline relative cursor-pointer bg-transparent border-none inline-block'
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {renderWords(0)}
      <span className='absolute top-0 left-0' aria-hidden='true'>
        {renderWords(1)}
      </span>
      <div className='absolute -bottom-2 w-full h-[1px] bg-black'></div>
    </a>
  );
};

const Footer = () => {
  const footerRef = useRef(null);
  const bottomBarY = useMotionValue(-100);
  const bottomBarYSpring = useSpring(bottomBarY, { stiffness: 180, damping: 40 });

  useEffect(() => {
    const updateBottomBarPosition = () => {
      if (!footerRef.current) return;

      const footerHeight = footerRef.current.offsetHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const viewportHeight = window.innerHeight;
      const scrollY = window.scrollY || window.pageYOffset;

      // Le point où le footer commence à être révélé
      // = quand le bas du viewport atteint le début de la zone "réservée" au footer
      const footerRevealStart = documentHeight - viewportHeight - footerHeight;
      const footerRevealEnd = documentHeight - viewportHeight;

      // Calculer la progression (0 = début du reveal, 1 = footer entièrement visible)
      const progress = Math.min(1, Math.max(0, (scrollY - footerRevealStart) / (footerRevealEnd - footerRevealStart)));

      // La barre orange commence à -100px et descend à 0
      const yValue = -100 + (progress * 100);
      bottomBarY.set(yValue);
    };

    // Écouter le scroll via Lenis si disponible, sinon scroll natif
    if (window.lenis) {
      window.lenis.on('scroll', updateBottomBarPosition);
    } else {
      window.addEventListener('scroll', updateBottomBarPosition, { passive: true });
    }

    // Initial update
    updateBottomBarPosition();

    return () => {
      if (window.lenis) {
        window.lenis.off('scroll', updateBottomBarPosition);
      } else {
        window.removeEventListener('scroll', updateBottomBarPosition);
      }
    };
  }, [bottomBarY]);

  const scrollToTop = () => {
    // Utiliser Lenis pour le smooth scroll
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) // Même easing que dans _app.js
      });
    } else {
      // Fallback si Lenis n'est pas disponible
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer ref={footerRef} id="footer" className="bg-black text-white text-sm font-mono relative sm:fixed sm:bottom-0 sm:w-full sm:z-[-5000]">
      <Image
        src="/images/ICONE_LJ-STUDIO_BLACK_OUTLINE.svg"
        alt="LJ Studio Logo"
        width={800}
        height={300}
        className="absolute left-[-300px] top-[50px] object-cover invert opacity-30">
      </Image>
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 relative">
        {/* Left block with video or badge */}
        <div className="w-full h-full flex py-20 relative">
          <div className="flex flex-col items-start justify-between gap-4 m-auto">
            <Image src="/images/ICONE_PLAY.svg" alt="Play Icon" width={80} height={80} className=""/>
          </div>
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-white"></div>
          <div className="md:block absolute bottom-0 left-0 bottom-0 h-[1px] w-full lg:w-[97%] bg-white"></div>
        </div>


        {/* Contact */}
        <div className="col-span-2 flex flex-col gap-8 sm:gap-16 py-6 sm:py-20 pr-[12vw] pl-[6vw] relative">
            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                <EmailLink />
                <div className="hidden md:block text-end text-white text-[19pt] text-[18pt] sm:text-[22px] leading-[0.9] robotoBold">
                    <span className="text-[#fa6218]">thanks </span><span className="text-[#4a4e52]"><span className='tenTwentyThin'>for</span><br></br> your visit</span>
                </div>
            </div>

            <div>
                <div className="flex sm:flex-col md:flex-row justify-between gap-8 flex-wrap">
                    <div className="flex flex-col w-max sm:flex-1">
                        <h4 className="robotoBold text-[#4a4e52] text-[14pt] sm:text-[20px] mb-1">OUR FIELD</h4>
                        <p className="robotoRegular text-[12pt] sm:text-[18px] leading-[1.1]">
                            128 rue de la Boetie<br />
                            75008 | Paris<br />
                            FRANCE
                        </p>
                    </div>

                    {/* Menu */}
                    <div className='flex justify-between sm:flex-1 flex-wrap sm:flex-nowrap'>  
                        <div className="flex flex-col gap-1 robotoRegular text-[12pt] sm:text-[18px]">
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Home
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Work
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Service
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Contact
                                </AppearText>
                            </a>
                        </div>

                      {/* Socials */}
                      <div className="hidden sm:block flex flex-col justify-between gap-4">
                        <div className="flex flex-row sm:flex-col items-end gap-1 robotoRegular text-[18px]">
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Instagram
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Twitter / X
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  LinkedIn
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Behance
                                </AppearText>
                            </a>
                        </div>
                      </div>
                    </div>
                      <div className="sm:hidden gap-4 w-full">
                        <div className="flex flex-row sm:flex-col items-end robotoRegular text-[clamp(9pt,2vw,12pt)] justify-between">
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Instagram
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Twitter / X
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  LinkedIn
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-[#fa6218] overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Behance
                                </AppearText>
                            </a>
                        </div>
                      </div>
                </div>
            </div>
            <div className=" md:block absolute bottom-0 right-0 bottom-0 h-[1px] w-[100%] lg:w-[98.5%] bg-white"></div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-black relative z-10">
        <img
          src="/images/LJSTD_WORDMARK.svg"
          alt="LJ Studio Logo"
          className="w-full object-cover invert pt-8 pb-2 md:py-12"
        />
      </div>

      {/* Bottom section */}
      <motion.div
        className="relative z-0 bg-[#fa6218] text-black flex justify-between items-center px-[4vw] py-8 text-xs duration-100"

      >
        <a className='roboto text-[7pt] sm:text-[12pt] uppercase'>privacy policy</a>
        <span className='roboto text-[7pt] sm:text-[12pt]'>© {new Date().getFullYear()} | LJ Studio · All rights reserved</span>
        <BackToTopLink onClick={scrollToTop} />

      </motion.div>
    </footer>
  );
};

export default Footer;