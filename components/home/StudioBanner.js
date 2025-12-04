import React from 'react';

const StudioBanner = () => {
    const repeatedContent = (
        <div className="flex items-center gap-12 px-4">
          <span className="robotoBold text-[12vw] sm:text-[92pt] uppercase leading-[90pt]">LJ STUDIO<sup className=""><span className='-pt-12'>™</span></sup></span>
          <span className="robotoMonoMedium uppercase text-[14pt] leading-[12pt] sm:text-[19pt] sm:leading-[23pt]"><p>French</p> <p>Creative</p> <p>Studio</p></span>
          <span className="font-serif text-xl sm:text-2xl">
            <span className="tenTwentyThin text-[12vw] sm:text-[90pt] uppercase">Shoot </span>
            <span className="robotoBold text-[12vw] sm:text-[92pt] uppercase">us a message</span>
          </span>
          <span className="robotoMonoMedium uppercase text-[14pt] leading-[12pt] sm:text-[19pt] sm:leading-[23pt]"><p>French</p> <p>Creative</p> <p>Studio</p></span>
        </div>
      );
    
      return (
        <div className="w-full overflow-hidden bg-white text-black sm:py-6 rounded-b-xl">
          <div className="marquee whitespace-nowrap flex">
            {/* Deux fois pour boucler parfaitement */}
            <div className="flex shrink-0 animate-marquee">
              {Array(6).fill(repeatedContent)}
            </div>
            <div className="flex shrink-0 animate-marquee">
              {Array(6).fill(repeatedContent)}
            </div>
          </div>
    
          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-100%);
              }
            }
            .animate-marquee {
              animation: marquee 120s linear infinite;
            }
          `}</style>
        </div>
      );
    };

export default StudioBanner;
