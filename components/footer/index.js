import Image from 'next/image';
import React, { useRef, useEffect } from 'react';
import AppearText from '../AppearText';
import IconRain from '../IconRain';
import PixelPlayIcon from '../PixelPlayIcon';
import Link from 'next/link';

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
  const iconRainContainerRef = useRef(null);

  const { triggerRain } = IconRain({ containerRef: footerRef });

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    const element = document.getElementById(sectionId);
    if (!element) return;

    if (window.lenis) {
      window.lenis.scrollTo(element, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, {
        duration: 2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

useEffect(() => {
  const footer = footerRef.current;
  if (!footer) return;

  const sections = footer.querySelectorAll('.footer-section');

  // Parallax : les sections partent remontées et descendent progressivement
  const updateParallax = (scroll, maxScroll) => {
    const footerTop = footer.offsetTop;
    const footerHeight = footer.offsetHeight;
    const windowHeight = window.innerHeight;
    
    const revealStart = footerTop - windowHeight;
    const localScroll = Math.max(0, scroll - revealStart);
    const globalProgress = Math.min(1, localScroll / windowHeight);
    const parallaxProgress = Math.min(1, localScroll / footerHeight);
    sections.forEach((section, i) => {

      let totalHeightAbove = 0;
      for (let j = 0; j < i; j++) {
        totalHeightAbove += sections[j].offsetHeight;
      }
      if (i === 0) {
        // La première section commence avec un offset supplémentaire (l'apparition)
        const initialOffset = 180; // ou la valeur que vous voulez
        const appearOffset = initialOffset * (1 - globalProgress);
        const parallaxOffset = totalHeightAbove * (1 - parallaxProgress);
        
        section.style.transform = `translateY(-${appearOffset + parallaxOffset}px)`;
        return;
     }
      const progress = Math.min(1, localScroll / footerHeight);
      const offset = totalHeightAbove * (1 - progress);
      
      section.style.transform = `translateY(-${offset}px)`;
    });
  };

  // Écouter Lenis (prioritaire) ou scroll natif
  const onLenisScroll = ({ scroll, limit }) => {
    updateParallax(scroll, limit);
  };

  const onNativeScroll = () => {
    const scroll = window.scrollY || window.pageYOffset;
    const limit = document.documentElement.scrollHeight - window.innerHeight;
    updateParallax(scroll, limit);
  };

  if (window.lenis) {
    window.lenis.on('scroll', onLenisScroll);
  } else {
    window.addEventListener('scroll', onNativeScroll, { passive: true });
  }

  // Appel initial
  onNativeScroll();

  return () => {
    if (window.lenis) {
      window.lenis.off('scroll', onLenisScroll);
    } else {
      window.removeEventListener('scroll', onNativeScroll);
    }
  };
}, []);

  return (
      <footer ref={footerRef} className="w-full bg-black text-white text-sm font-mono overflow-hidden relative">

        {/* Section 1: Grid contact */}
        <div className="footer-section bg-black relative z-9">
          <Image
            src="/images/ICONE_LJ-STUDIO_BLACK_OUTLINE.svg"
            alt="LJ Studio Logo"
            width={800}
            height={300}
            loading="eager"
            className="absolute left-[-150px] sm:left-[-300px] top-[50px] object-cover invert opacity-35"
          />
          <div className="grid grid-cols-1 md:grid-cols-3 relative">
            {/* Left block with video or badge */}
            <div ref={iconRainContainerRef} className="w-full justify-between items-center h-full flex py-20 relative overflow-hidden">
              <div className='pl-[6vw] h-fit sm:hidden'>
                <EmailLink />
              </div>
              <div className="hidden sm:block flex flex-col items-center justify-center gap-4 m-auto">
                <PixelPlayIcon size={80} onClick={triggerRain} />
              </div>
              <div className="sm:hidden mr-[12vw]">
                <PixelPlayIcon size={50} onClick={triggerRain} />
              </div>
              <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[1px] bg-white"></div>
              <div className="md:block absolute bottom-0 left-[6vw] sm:left-0 bottom-0 h-[1px] w-[calc(100%-12vw)] sm:w-full lg:w-[97%] bg-white"></div>
            </div>

            {/* Contact */}
            <div className="col-span-2 flex flex-col gap-8 sm:gap-16 py-6 sm:py-20 pr-[6vw] pl-[6vw] relative">
              <div className="hidden sm:block flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                <div className='hidden sm:block'>
                  <EmailLink />
                </div>
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
                      <a href="/" className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Home
                        </AppearText>
                      </a>
                      <a href="#work" onClick={(e) => scrollToSection(e, 'work')} className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Work
                        </AppearText>
                      </a>
                      <a href="#services" onClick={(e) => scrollToSection(e, 'services')} className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Service
                        </AppearText>
                      </a>
                      <a href="#contact" onClick={(e) => scrollToSection(e, 'contact')} className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Contact
                        </AppearText>
                      </a>
                    </div>

                    {/* Socials */}
                    <div className="hidden sm:block flex flex-col justify-between gap-4">
                      <div className="flex flex-row sm:flex-col items-end gap-1 robotoRegular text-[18px]">
                        <a href="https://www.instagram.com/lj_stration/?hl=en" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                          <AppearText type="words" hover={true}>
                            Instagram
                          </AppearText>
                        </a>
                        <a href="https://x.com/LjStration" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                          <AppearText type="words" hover={true}>
                            Twitter / X
                          </AppearText>
                        </a>
                        <a href="https://www.linkedin.com/company/lj-stration/" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                          <AppearText type="words" hover={true}>
                            LinkedIn
                          </AppearText>
                        </a>
                        <a href="https://www.behance.net/LJ-Studio" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                          <AppearText type="words" hover={true}>
                            Behance
                          </AppearText>
                        </a>
                      </div>
                    </div>
                  </div>
                  <div className="sm:hidden gap-4 w-full">
                    <div className="flex flex-row sm:flex-col items-end robotoRegular text-[clamp(9pt,2vw,12pt)] justify-between">
                      <a href="https://www.instagram.com/lj_stration/?hl=en" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Instagram
                        </AppearText>
                      </a>
                      <a href="https://x.com/LjStration" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Twitter / X
                        </AppearText>
                      </a>
                      <a href="https://www.linkedin.com/company/lj-stration/" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          LinkedIn
                        </AppearText>
                      </a>
                      <a href="https://www.behance.net/LJ-Studio" target="_blank" className="hover:text-[#fa6218] overflow-hidden">
                        <AppearText type="words" hover={true}>
                          Behance
                        </AppearText>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hidden md:block absolute bottom-0 right-0 bottom-0 h-[1px] w-[100%] lg:w-[98.5%] bg-white"></div>
            </div>
          </div>
        </div>

        {/* Section 2: Wordmark */}
        <div className="footer-section bg-black z-20">
          <div className="w-full overflow-hidden">
            <img
              src="/images/LJSTD_WORDMARK.svg"
              alt="LJ Studio Wordmark"
              className="w-full object-cover invert sm:pt-8 pb-2 md:py-12"
            />
          </div>
        </div>

        {/* Section 3: Barre orange */}
        <div className="footer-section bg-[#fa6218] text-black z-10">
          <div className="w-full flex justify-between items-center px-[4vw] py-8 text-xs">
            <Link href="/legal" className='roboto text-[7pt] sm:text-[12pt] uppercase'>legal & privacy</Link>
            <span className='roboto text-[7pt] sm:text-[12pt]'>© {new Date().getFullYear()} | LJ Studio · All rights reserved</span>
            <BackToTopLink onClick={scrollToTop} />
          </div>
        </div>

      </footer>
  );
};

export default Footer;