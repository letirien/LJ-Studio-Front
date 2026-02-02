import React from 'react';

const StudioBanner = () => {
      return (
        <section className="w-full overflow-hidden intersectLogo white bg-white text-black sm:py-6 rounded-b-xl">
          <div className="marquee whitespace-nowrap flex">
            {/* Deux fois pour boucler parfaitement */}
            <div className="flex shrink-0 animate-marquee">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`marquee-a-${i}`} className="flex items-center gap-12 px-4">
                  <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[90pt]">LJ STUDIO<sup className=""><span className='-pt-12'>™</span></sup></span>
                  <span className="robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                  <span className="font-serif text-xl xl:text-2xl">
                    <span className="tenTwentyThin text-[12vw] xl:text-[90pt] uppercase">Shoot us </span>
                    <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase">a message</span>
                  </span>
                  <span className="robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                </div>
              ))}
            </div>
            <div className="flex shrink-0 animate-marquee">
              {Array.from({ length: 6 }, (_, i) => (
                <div key={`marquee-b-${i}`} className="flex items-center gap-12 px-4">
                  <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase leading-[90pt]">LJ STUDIO<sup className=""><span className='-pt-12'>™</span></sup></span>
                  <span className="robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
                  <span className="font-serif text-xl xl:text-2xl">
                    <span className="tenTwentyThin text-[12vw] xl:text-[90pt] uppercase">Shoot us </span>
                    <span className="robotoBold text-[12vw] xl:text-[92pt] uppercase">a message</span>
                  </span>
                  <span className="robotoMonoMedium uppercase text-[8pt] sm:text-[3vw] leading-[0.9] opacity-80 xl:text-[19pt] xl:leading-[23pt]"><span>French</span> <span>Creative</span> <span>Studio</span></span>
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
