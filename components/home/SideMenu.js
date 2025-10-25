"use client";

import React, { useState, useEffect, useRef } from "react";
import LinkedInIcon from "../../public/images/logosRs/LINKEDIN.svg";
import XIcon from "../../public/images/logosRs/X.svg";
import InstagramIcon from "../../public/images/logosRs/INSTA.svg";
import BehanceIcon from "../../public/images/logosRs/BEHANCE.svg";
import RoundedIcon from "../RoundedIcon";

export const SideMenu = ({ isOpen: initialIsOpen, onToggle }) => {
  const [isOpen, setIsOpen] = useState(initialIsOpen);
  const [gsapInstance, setGsapInstance] = useState(null);

  const menuContainerRef = useRef(null);
  const menuBgBlockRef1 = useRef(null);
  const menuBgBlockRef2 = useRef(null);
  const bellowContainerRef = useRef(null);
  const menuLinksRef = useRef([]);
  const socialsRef = useRef([]);
  const sideTextRef = useRef(null);
  const linkTextRefs = useRef([]);
  const tlRef = useRef(null);

  // Charger GSAP dynamiquement
  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { CustomEase } = await import("gsap/CustomEase");
      gsap.registerPlugin(CustomEase);
      CustomEase.create("main", "0.65, 0.01, 0.05, 0.99");
      setGsapInstance(gsap);
    })();
  }, []);

  // Initialiser la timeline GSAP une seule fois
  useEffect(() => {
    if (!gsapInstance) return;

    const tl = gsapInstance.timeline({
      defaults: { ease: "main", duration: 0.7 },
      paused: true, // important !
    });

    // on prépare tout "fermé"
    tl.set(
      [menuBgBlockRef2.current, menuBgBlockRef1.current, menuContainerRef.current, bellowContainerRef.current],
      { x: "100%" }
    )

      // animation d'ouverture (sera jouée en reverse à la fermeture)
      .to(bellowContainerRef.current, { x: "0%", duration: 0.1 }, 0)
      .to(menuBgBlockRef2.current, { x: "0%", duration: 0.5 }, 0)
      .to(menuBgBlockRef1.current, { x: "0%", duration: 0.6 }, 0.05)
      .to(menuContainerRef.current, { x: "0%", duration: 0.7 }, 0.06)
      .fromTo(
        menuLinksRef.current,
        { yPercent: 140, rotate: 10, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1, stagger: 0.05, duration: 0.6 },
        "-=0.35"
      )
      .fromTo(
        socialsRef.current,
        { autoAlpha: 0, yPercent: 50 },
        { autoAlpha: 1, yPercent: 0, stagger: 0.04, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        sideTextRef.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        "-=0.3"
      );

    tlRef.current = tl;

    return () => tl.kill();
  }, [gsapInstance]);

  // Synchroniser avec la prop isOpen
  useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  // Jouer ou inverser la timeline selon l’état
  useEffect(() => {
    if (!tlRef.current) return;
    if (isOpen) {
      tlRef.current.timeScale(0.7);
      tlRef.current.play();
    } else {
      tlRef.current.timeScale(1.2);
      tlRef.current.reverse();
    }
  }, [isOpen]);

  // Gestion du toggle
  const handleToggle = () => {
    setIsOpen((prev) => !prev);
    if (onToggle) onToggle(!isOpen);
  };

  // Animation hover liens
  const handleLinkHover = (index, isHovering) => {
    if (!gsapInstance) return;
    const linkRefs = linkTextRefs.current[index];
    if (!linkRefs?.top || !linkRefs?.bottom) return;

    gsapInstance.killTweensOf([linkRefs.top, linkRefs.bottom]);

    const tl = gsapInstance.timeline({ defaults: { ease: "main", duration: 0.45 } });

    if (isHovering) {
      tl.to(linkRefs.top, { yPercent: -100, rotate: -10, opacity: 0 }).fromTo(
        linkRefs.bottom,
        { yPercent: 100, rotate: 10, opacity: 0 },
        { yPercent: 0, rotate: 0, opacity: 1 },
        "-=0.35"
      );
    } else {
      tl.to(linkRefs.bottom, { yPercent: 100, rotate: 10, opacity: 0 }).to(
        linkRefs.top,
        { yPercent: 0, rotate: 0, opacity: 1 },
        "-=0.35"
      );
    }
  };

  // Fermeture avec ESC
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && isOpen) {
        handleToggle();
      }
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen]);

  return (
    <>
      <div
        ref={bellowContainerRef}
        className="fixed top-0 right-0 h-[100vh] w-[100vw] sm:w-[50vw] z-[400]"
        style={{ transform: "translateX(100%)" }}
      >
        <div
          ref={menuBgBlockRef2}
          className="absolute top-0 right-0 h-full w-full bg-white z-[401]"
          style={{ transform: "translateX(100%)" }}
        ></div>
        <div
          ref={menuBgBlockRef1}
          className="absolute top-0 right-0 h-full w-full bg-black z-[402]"
          style={{ transform: "translateX(100%)" }}
        ></div>
      </div>

      <div
        ref={menuContainerRef}
        className="fixed top-0 right-0 h-[100vh] w-[100vw] sm:w-[50vw] bg-[#fa6218] flex flex-col items-start py-[4vh] px-[3vw] z-[500]"
        style={{ transform: "translateX(100%)" }}
      >
        {/* MENU LINKS */}
        <div className="flex w-full items-top my-auto">
          <div className="flex flex-1 flex-col space-y-6 font-bold uppercase text-black my-auto pl-[3vw]">
            {["SERVICES", "WORK", "ARCHIVE", "ABOUT", "CONTACT"].map((label, i) => (
              <div className="relative overflow-hidden" key={i}>
                <a
                  ref={(el) => (menuLinksRef.current[i] = el)}
                  href={`#${label.toLowerCase()}`}
                  className="hardbopBlack block relative w-min text-[21vw] sm:text-[8vw] hover:text-white"
                  onClick={handleToggle}
                  onMouseEnter={() => handleLinkHover(i, true)}
                  onMouseLeave={() => handleLinkHover(i, false)}
                >
                  <span
                    ref={(el) => {
                      if (!linkTextRefs.current[i]) linkTextRefs.current[i] = {};
                      linkTextRefs.current[i].top = el;
                    }}
                    className="relative z-[2] block text-layer text-top"
                  >
                    {label}
                  </span>
                  <span
                    ref={(el) => {
                      if (!linkTextRefs.current[i]) linkTextRefs.current[i] = {};
                      linkTextRefs.current[i].bottom = el;
                    }}
                    className="z-[1] block text-layer text-bottom absolute top-0 left-0 opacity-0 text-white"
                  >
                    {label}
                  </span>
                  <span className="absolute text-black -right-9 top-0 mt-1 ml-2 text-[16pt] tracking-tighter robotoRegular">
                    {i + 1 < 10 ? `0${i + 1}` : i + 1}
                  </span>
                </a>
              </div>
            ))}
          </div>

          {/* SOCIAL ICONS */}
          <ul id="socials" className="text-black flex flex-col items-end mr-[3vw] md:mt-[15vh]">
            {[LinkedInIcon, XIcon, InstagramIcon, BehanceIcon].map((Icon, i) => (
              <li key={i} className="!mb-2">
                <a
                  ref={(el) => (socialsRef.current[i] = el)}
                  href="https://www.instagram.com/jean_luc_studio/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white hardbop-bold text-[17pt]"
                >
                  <Icon width={24} height={24} className="inline-block mb-1" />
                </a>
              </li>
            ))}
            <p
              ref={sideTextRef}
              className="w-full uppercase robotoBold text-[10pt] text-black/55 -rotate-90 origin-bottom-right border-r-2 pr-10 hidden 2xl:block"
            >
              creative studio with a french accent
            </p>
          </ul>
        </div>

        {/* CLOSE BUTTON */}
        <div className="absolute top-[4vh] right-[3vw] flex">
          <button onClick={handleToggle} className="focus:outline-none !p-0 hover:cursor-pointer">
            <RoundedIcon icon="" size={120} rotationFactor={0} circularContinue={true} menu={true} />
          </button>
        </div>

        <p className="text-center w-full uppercase robotoBold text-[10pt] text-black/55 2xl:hidden">
          creative studio with a french accent
        </p>
      </div>
    </>
  );
};
