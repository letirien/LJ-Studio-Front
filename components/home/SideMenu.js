import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LinkedInIcon from '../../public/images/logosRs/LINKEDIN.svg';
import XIcon from '../../public/images/logosRs/X.svg';
import InstagramIcon from '../../public/images/logosRs/INSTA.svg';
import BehanceIcon from '../../public/images/logosRs/BEHANCE.svg';

export const SideMenu = ({ isOpen: initialIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);

  // Synchroniser l'état local avec la prop initialIsOpen si elle change
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Fonction pour basculer l'état et notifier le parent
  const handleToggle = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(!isOpen); // Notifie le parent de la mise à jour
  };

  return (
    <>
      <div
        className={`fixed top-0 right-0 h-[100vh] w-[100vw] sm:w-[50vw] bg-[#fa6218] flex flex-col items-start py-[60px] px-[4vw] transition-transform duration-300 ease-in-out z-[500] ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex flex-col space-y-6 font-bold uppercase text-black my-auto">
          <a href="#services" className="text-[21vw] sm:text-[8vw] hover:text-white relative w-content hardbopBlack"><span className=''>SERVICES</span><span className='absolute text-200 mt-1 ml-2 text-[18pt]'>01</span></a>
          <a href="#work" className="hardbopBlack text-[72pt] sm:text-[8vw] hover:text-white">WORK<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>02</span></a>
          <a href="#archive" className="hardbopBlack text-[19vw] leading-[0.8] sm:text-[8vw] hover:text-white">ARCHIVE<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>03</span></a>
          <a href="#about" className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white">ABOUT<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>04</span></a>
          <a href="#contact" className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white">CONTACT<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>05</span></a>
        </div>
        <div className="absolute top-[60px] right-[3vw] flex space-x-4">
          <button onClick={handleToggle} className="focus:outline-none !p-0 hover:cursor-pointer">
            <svg width="74" height="74" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="10.6105" height="0.983525" rx="0.491763" transform="matrix(0.707097 0.707116 -0.707097 0.707116 11.9971 11.3013)" fill="white"/>
              <rect width="7.74783" height="0.983525" rx="0.491763" transform="matrix(0.707097 0.707116 -0.707097 0.707116 5.25684 4.56006)" fill="white"/>
              <rect width="10.6066" height="0.983525" rx="0.491763" transform="matrix(0.707097 -0.707116 0.707097 0.707116 11.3008 12)" fill="white"/>
              <rect width="7.15696" height="0.983525" rx="0.491763" transform="matrix(0.707097 -0.707116 0.707097 0.707116 4.5 18.563)" fill="white"/>
            </svg>
          </button>
        </div>
        <div className="absolute right-[4vw] top-1/3 translate-y-[-50%]">
          <ul id="socials" className="text-black flex flex-col items-end">
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <LinkedInIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <XIcon width={24} height={24}  className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <InstagramIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <BehanceIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
          </ul>
          <p className='uppercase robotoReg text-[12pt] xl:text-[16pt] text-black/55 -rotate-90 origin-bottom-right border-r-2 pr-10'>creative studio with a french accent</p>
        </div>
      </div>
    </>
  );
}