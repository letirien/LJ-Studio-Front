import React from 'react';
import { useEffect } from 'react';

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
    <footer className="bg-black text-white text-sm font-mono">
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-6 py-12 border-b border-white/20">
        {/* Left block with video or badge */}
        <div className="flex flex-col items-start justify-between gap-4 m-auto">
          <div className="bg-orange-500 px-3 py-1 text-black font-bold uppercase rounded-sm relative text-center rotate-[-12deg] cursor-pointer">
            <div className='absolute bg-white left-[50%] px-1 rounded-md h-[27px] translate-x-[-50%] top-[30%] text-[20px] shadow-[1px_1px_0px_2px_rgba(0,_0,_0,_0.8)] rotate-[12deg]'>▶</div>
            <p className='hardbopBlack text-[48pt]'>Game</p>
            <p className='hardbopBlack text-[48pt]'>Time</p>
          </div>
        </div>

        {/* Contact */}
        <div className="col-span-2 flex flex-col gap-24">
            <div className="flex flex-col sm:flex-row justify-between opacity-55 gap-6 sm:gap-0">
                <p className='robotoBold text-[26pt]'><span className='tenTwentyThin text-[35pt]'>jean</span>@LJSTUDIO.xyz</p>
                <div className="text-end text-white text-[25pt] robotoBold">
                    <span className="text-orange-500">thanks </span><span className="text-white/60"><span className='tenTwentyThin'>for</span><br></br> your visit</span>
                </div>
            </div>
            <div>
                <div className="flex flex-col sm:flex-row justify-between gap-6">
                    <div className="flex flex-col flex-1">
                        <h4 className="robotoBold text-[#474b4e] text-[19pt] mb-1">OUR FIELD</h4>
                        <p className="robotoRegular text-[17pt] leading-[21pt] opacity-55">
                            128 rue de la Boetie<br />
                            75008 | Paris<br />
                            FRANCE
                        </p>
                    </div>

                    {/* Menu */}
                    <div className='flex justify-between sm:flex-1'>  
                      <div className="flex flex-col gap-1 robotoRegular text-[17pt]">
                          <a href="#" className="hover:text-orange-500">Home</a>
                          <a href="#" className="hover:text-orange-500">Work</a>
                          <a href="#" className="hover:text-orange-500">Services</a>
                          <a href="#" className="hover:text-orange-500">Contact</a>
                      </div>
                                      {/* Socials + Thanks */}
                      <div className="flex flex-col justify-between gap-4">
                      <div className="flex flex-col items-end gap-1 robotoRegular text-[17pt]">
                          <a href="#" className="hover:text-orange-500">Instagram</a>
                          <a href="#" className="hover:text-orange-500">Twitter</a>
                          <a href="#" className="hover:text-orange-500">LinkedIn</a>
                          <a href="#" className="hover:text-orange-500">Behance</a>
                      </div>
                    </div>
                </div>
                </div>
            </div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-black">
        <img
          src="/images/TYPO_LJ-STUDIO_BLACK.svg"
          alt="LJ Studio Logo"
          className="w-full object-cover invert"
        />
      </div>
      {/* Bottom section */}
      <div className="bg-[#fa6218] text-black flex justify-between items-center px-[4vw] py-8 text-xs">
        <a className='roboto text-[7pt] sm:text-[15pt] uppercase'>privacy policy</a>
        <span className='roboto text-[7pt] sm:text-[15pt]'>© 2025 | LJ Studio · All rights reserved</span>
        <a 
          onClick={scrollToTop} 
          className="robotoBold text-[7pt] sm:text-[20pt] no-underline relative cursor-pointer bg-transparent border-none"
        >
          Back to the top ↑
          <div className='absolute -bottom-2 w-full h-[1px] bg-black'></div>
        </a>
        
      </div>
    </footer>
  );
};

export default Footer;
