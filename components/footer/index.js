import Image from 'next/image';
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
    <footer className="bg-black text-white text-sm font-mono relative">
      <Image
        src="/images/ICONE_LJ-STUDIO_BLACK.svg"
        alt="LJ Studio Logo"
        width={800}
        height={300}
        className="absolute left-[-350px] top-[50px] object-cover invert opacity-5">
      </Image>
      {/* Top section */}
      <div className="grid grid-cols-1 md:grid-cols-3 relative">
        {/* Left block with video or badge */}
        <div className="w-full h-full flex py-20 relative">
          <div className="flex flex-col items-start justify-between gap-4 m-auto">
            <div className="bg-orange-500 px-3 py-1 text-black font-bold uppercase rounded-sm relative text-center rotate-[-12deg] cursor-pointer">
              <div className='absolute bg-white left-[50%] px-1 rounded-md h-[27px] translate-x-[-50%] top-[30%] text-[20px] shadow-[1px_1px_0px_2px_rgba(0,_0,_0,_0.8)] rotate-[12deg]'>▶</div>
              <p className='hardbopBlack text-[48pt]'>Game</p>
              <p className='hardbopBlack text-[48pt]'>Time</p>
            </div>
          </div>
          <div className="hidden md:block absolute right-0 top-0 bottom-0 w-[3px] bg-gray-700"></div>
          <div className="md:block absolute bottom-0 left-0 bottom-0 h-[3px] w-full lg:w-[97%] bg-gray-700"></div>
        </div>


        {/* Contact */}
        <div className="col-span-2 flex flex-col gap-16 py-20 pr-[12vw] pl-[6vw] relative">
            <div className="flex flex-col sm:flex-row justify-between gap-6 sm:gap-0">
                <p className='robotoBold text-[26pt] !text-white'><span className='tenTwentyThin text-[35pt] opacity-55'>jean</span>@LJSTUDIO.xyz</p>
                <div className="text-end text-white text-[25pt] leading-[23pt] robotoBold">
                    <span className="text-orange-500">thanks </span><span className="text-[#474b4e]"><span className='tenTwentyThin'>for</span><br></br> your visit</span>
                </div>
            </div>

            <div>
                <div className="flex flex-col sm:flex-row justify-between gap-8">
                    <div className="flex flex-col flex-1">
                        <h4 className="robotoBold text-[#474b4e] text-[19pt] mb-1">OUR FIELD</h4>
                        <p className="robotoRegular text-[17pt] leading-[21pt]">
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

                      {/* Socials */}
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
            <div className=" md:block absolute bottom-0 right-0 bottom-0 h-[3px] w-[100%] lg:w-[98.5%] bg-gray-700"></div>
        </div>
      </div>
      <div className="w-full overflow-hidden bg-black py-8">
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