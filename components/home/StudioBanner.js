import React from 'react';

const StudioBanner = () => {
    const repeatedContent = (
        <div className="flex items-center gap-12 px-4">
          <span className="font-bold tracking-wide text-xl sm:text-2xl">LJ STUDIO<sup className="text-sm">™</sup></span>
          <span className="uppercase text-xs font-semibold tracking-widest">French Creative Studio</span>
          <span className="font-serif text-xl sm:text-2xl">
            <span className="italic">Let’s shoot </span>
            <span className="not-italic font-bold">us a message</span>
          </span>
        </div>
      );
    
      return (
        <div className="w-full overflow-hidden bg-white text-black py-6 rounded-b-xl">
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
              animation: marquee 60s linear infinite;
            }
          `}</style>
        </div>
      );
    };

export default StudioBanner;
