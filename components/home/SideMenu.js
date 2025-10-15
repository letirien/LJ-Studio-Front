import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import LinkedInIcon from '../../public/images/logosRs/LINKEDIN.svg';
import XIcon from '../../public/images/logosRs/X.svg';
import InstagramIcon from '../../public/images/logosRs/INSTA.svg';
import BehanceIcon from '../../public/images/logosRs/BEHANCE.svg';
import RoundedIcon from '../RoundedIcon';

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
        className={`fixed top-0 right-0 h-[100vh] w-[100vw] sm:w-[50vw] bg-[#fa6218] flex flex-col items-start py-[4vh] px-[3vw] transition-transform duration-300 ease-in-out z-[500] ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        <div className="flex w-full items-top my-auto">
          <div className='flex flex-1 flex-col space-y-6 font-bold uppercase text-black my-auto pl-[3vw]'>
            <a href="#services" className="text-[21vw] sm:text-[8vw] hover:text-white relative w-content hardbopBlack"><span className=''>SERVICES</span><span className='absolute text-200 mt-1 ml-2 text-[18pt]'>01</span></a>
            <a href="#work" className="hardbopBlack text-[72pt] sm:text-[8vw] hover:text-white">WORK<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>02</span></a>
            <a href="#archive" className="hardbopBlack text-[19vw] leading-[0.8] sm:text-[8vw] hover:text-white">ARCHIVE<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>03</span></a>
            <a href="#about" className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white">ABOUT<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>04</span></a>
            <a href="#contact" className="hardbopBlack text-[21vw] sm:text-[8vw] hover:text-white">CONTACT<span className='absolute text-200 mt-1 ml-2 text-[21pt]'>05</span></a>
          </div>
          <ul id="socials" className="text-black flex flex-col items-end mr-[3.3vw] mt-[15vh]">
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <LinkedInIcon width={24} height={24} className="inline-block mb-1" />
              </a>
            </li>
            <li className='!mb-2'>
              <a href="https://www.instagram.com/jean_luc_studio/" target="_blank" rel="noopener noreferrer" className="hover:text-white hardbop-bold text-[17pt]">
                <XIcon width={24} height={24} className="inline-block mb-1" />
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
            <p className='uppercase robotoBold text-[10pt] text-black/55 -rotate-90 origin-bottom-right border-r-2 pr-10'>creative studio with a french accent</p>

          </ul>

        </div>
        <div className="absolute top-[4vh] right-[3vw] flex">
          <button onClick={handleToggle} className="focus:outline-none !p-0 hover:cursor-pointer">
            <RoundedIcon icon="" size={120} rotationFactor={0} circularContinue={true} menu={true} />
            {/* <svg width="60" height="60" viewBox="0 0 60 60" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_291_26)">
            <rect x="47.2852" y="44.7764" width="3.22448" height="23.1386" transform="rotate(135.678 47.2852 44.7764)" fill="white"/>
            <rect x="28.4609" y="25.4785" width="3.27465" height="18.84" transform="rotate(135.678 28.4609 25.4785)" fill="white"/>
            <rect x="45.5371" y="12.0664" width="3.55901" height="24.8424" transform="rotate(45 45.5371 12.0664)" fill="white"/>
            <rect x="26.041" y="31.4868" width="3.50308" height="19.8566" transform="rotate(45 26.041 31.4868)" fill="white"/>
            </g>
            <defs>
            <clipPath id="clip0_291_26">
            <rect width="60" height="60" fill="white"/>
            </clipPath>
            </defs>
          </svg> */}
          </button>
        </div>
        {/* <div className="absolute right-[3vw] pr-[3vw] h-content top-1/3 translate-y-[-50%]">
          <p className='uppercase robotoReg text-[12pt] xl:text-[16pt] text-black/55 -rotate-90 origin-bottom-right border-r-2 pr-10'>creative studio with a french accent</p>
        </div> */}
      </div>
    </>
  );
}