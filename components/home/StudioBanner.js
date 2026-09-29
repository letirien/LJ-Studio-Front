import React from 'react';

const StudioBanner = () => {
      return (
        <section id="studio-banner" className="w-full overflow-hidden browser-color-white intersectLogo white bg-white text-black pb-6 sm:py-6 rounded-b-xl relative mt-[-4vh] sm:mt-0">
          <div className="marquee whitespace-nowrap flex">
            {/* Deux fois pour boucler parfaitement */}
            <div className="flex shrink-0 animate-marquee">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`marquee-a-${i}`} className="flex items-center gap-12 px-4">
                  <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[0.8]">LJ STUDIO<sup className=""><span className='-pt-12'>™</span></sup></span>
                  <span className="flex flex-col robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                  <span className="font-serif">
                    <span className="tenTwentyThin text-[12vw] xl:text-[90pt] uppercase leading-[1.2]">Shoot us </span>
                    <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[1.2]">a message</span>
                  </span>
                  <span className="flex flex-col robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 animate-marquee">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`marquee-a-${i}`} className="flex items-center gap-12 px-4">
                  <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[0.8]">LJ STUDIO<sup className=""><span className='-pt-12'>™</span></sup></span>
                  <span className="flex flex-col robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                  <span className="font-serif">
                    <span className="tenTwentyThin text-[12vw] xl:text-[90pt] uppercase leading-[1.2]">Shoot us </span>
                    <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[1.2]">a message</span>
                  </span>
                  <span className="flex flex-col robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                </div>
              ))}
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
        </section>
      );
    };

export default StudioBanner;
