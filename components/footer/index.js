import Image from 'next/image';
import React from 'react';
import { useEffect } from 'react';
import AppearText from '../AppearText';

const Footer = () => {
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
    <footer id="footer" className="bg-black text-white text-sm font-mono relative sm:fixed sm:bottom-0 sm:w-full sm:z-[-5000]">
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
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[2px] bg-white"></div>
          <div className="md:block absolute bottom-0 left-0 bottom-0 h-[2px] w-full lg:w-[97%] bg-white"></div>
        </div>


        {/* Contact */}
        <div className="col-span-2 flex flex-col gap-8 sm:gap-16 py-6 sm:py-20 pr-[12vw] pl-[6vw] relative">
            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                <p className='robotoBold text-[16pt] sm:text-[20px] !text-white uppercase'><span className='lowercase tenTwentyThin text-[20pt] sm:text-[32px]'>jean</span>@LJSTUDIO.xyz</p>
                <div className="hidden md:block text-end text-white text-[19pt] text-[18pt] sm:text-[22px] leading-[0.9] robotoBold">
                    <span className="text-orange-500">thanks </span><span className="text-[#4a4e52]"><span className='tenTwentyThin'>for</span><br></br> your visit</span>
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
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Home
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Work
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Service
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Contact
                                </AppearText>
                            </a>
                        </div>

                      {/* Socials */}
                      <div className="hidden sm:block flex flex-col justify-between gap-4">
                        <div className="flex flex-row sm:flex-col items-end gap-1 robotoRegular text-[18px]">
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Instagram
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Twitter / X
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  LinkedIn
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Behance
                                </AppearText>
                            </a>
                        </div>
                      </div>
                    </div>
                      <div className="sm:hidden gap-4 w-full">
                        <div className="flex flex-row sm:flex-col items-end robotoRegular text-[clamp(9pt,2vw,12pt)] justify-between">
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Instagram
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                    Twitter / X
                                </AppearText>
                            </a>
                            
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  LinkedIn
                                </AppearText>
                            </a>
                            <a href="#" className="hover:text-orange-500 overflow-hidden">
                              <AppearText type="words" hover={true}>
                                  Behance
                                </AppearText>
                            </a>
                        </div>
                      </div>
                </div>
            </div>
            <div className=" md:block absolute bottom-0 right-0 bottom-0 h-[2px] w-[100%] lg:w-[98.5%] bg-white"></div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-black">
        <img
          src="/images/LJSTD_WORDMARK.svg"
          alt="LJ Studio Logo"
          className="w-full object-cover invert pt-8 pb-2 md:py-12"
        />
      </div>

      {/* Bottom section */}
      <div className="bg-[#fa6218] text-black flex justify-between items-center px-[4vw] py-8 text-xs">
        <a className='roboto text-[7pt] sm:text-[15pt] uppercase'>privacy policy</a>
        <span className='roboto text-[7pt] sm:text-[15pt]'>© {new Date().getFullYear()} | LJ Studio · All rights reserved</span>
        <a 
          onClick={scrollToTop} 
          className="robotoBold text-[7pt] sm:text-[20pt] no-underline relative cursor-pointer bg-transparent border-none"
        >
        <AppearText type="words" hover={true}>
          Back to the top ↑
        </AppearText>
          <div className='absolute -bottom-2 w-full h-[1px] bg-black'></div>
        </a>
      </div>
    </footer>
  );
};

export default Footer;