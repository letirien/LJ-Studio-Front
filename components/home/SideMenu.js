"use client";

import React, { useState, useEffect, useRef } from "react";
import LinkedInIcon from "../../public/images/logosRs/LINKEDIN.svg";
import XIcon from "../../public/images/logosRs/X.svg";
import InstagramIcon from "../../public/images/logosRs/INSTA.svg";
import BehanceIcon from "../../public/images/logosRs/BEHANCE.svg";
import RoundedIcon from "../RoundedIcon";
import Image from "next/image";

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
  const sideTextRefMob = useRef(null);
  const linkTextRefs = useRef([]);
  const tlRef = useRef(null);
  const wordmarkRef = useRef(null);
  const wordmarkRefMob = useRef(null);

  // Charger GSAP dynamiquement
  useEffect(() => {
    (async () => {
      const { gsap } = await import("gsap");
      const { CustomEase } = await import("gsap/CustomEase");
      gsap.registerPlugin(CustomEase);
      CustomEase.create("menu", "0.65, 0.01, 0.05, 0.99");
      setGsapInstance(gsap);
    })();
  }, []);

  const sideTextContainerRef = useRef(null);

  useEffect(() => {
    const container = sideTextContainerRef.current;
    const text = sideTextRef.current;

    if (!container || !text) return;

    const updateSize = () => {
      const { width, height } = text.getBoundingClientRect();

      container.style.width = `${width}px`;
      container.style.height = `${height}px`;
    };

    const observer = new ResizeObserver(updateSize);
    observer.observe(text);

    updateSize();

    return () => observer.disconnect();
  }, []);

  // Initialiser la timeline GSAP une seule fois
  useEffect(() => {
    if (!gsapInstance) return;

    const tl = gsapInstance.timeline({
      defaults: { ease: "menu", duration: 0.7 },
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
      )
      .fromTo(
        wordmarkRef.current,
        { opacity: 0 },
        { opacity: 1, duration: 0.5 },
        "-=0.5"
      )
      .fromTo(
        sideTextRefMob.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        "-=0.3"
      )
      .fromTo(
        wordmarkRefMob.current,
        { autoAlpha: 0 },
        { autoAlpha: 1, duration: 0.5 },
        "-=0.4"
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

    const tl = gsapInstance.timeline({ defaults: { ease: "menu", duration: 0.45 } });

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

  const scrollToSection = (e, sectionId) => {
    e.preventDefault();
    handleToggle()
    const element = document.getElementById(sectionId);
    if (!element) return;

    if (window.lenis) {
      window.lenis.scrollTo(element, {
        duration: 1.5,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
      });
    } else {
      element.scrollIntoView({ behavior: 'smooth' });
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
        className="fixed top-0 right-0 h-[100svh] w-[100vw] sm:w-[50vw] z-[400]"
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
        className="fixed top-0 right-0 h-[100svh] w-[100vw] sm:w-[50vw] bg-[#fa6218] flex flex-col items-start py-[4vh] px-[3vw] z-[500]"
        style={{ transform: "translateX(100%)" }}
      >
        {/* MENU LINKS */}
        <div className="flex w-full items-top my-auto">
          <nav className="flex flex-1 flex-col space-y-6 font-bold uppercase text-black my-auto pl-[3vw]">
            {["SERVICES", "WORK", "ARCHIVE", "ABOUT", "CONTACT"].map((label, i) => (
              <div className="relative overflow-hidden" key={i}>
                <a
                  ref={(el) => (menuLinksRef.current[i] = el)}
                  href={`#${label.toLowerCase()}`}
                  onClick={(e) => scrollToSection(e, label.toLowerCase())}
                  className="hardbopBlack block relative w-min text-[21vw] sm:text-[8vw] 2xl:text-[6vw] hover:text-white"
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
          </nav>

          {/* SOCIAL ICONS */}
        </div>

        {/* RIGHT SIDE */}
        <div
          className="
    absolute
    right-[3vw]
    top-1/2
    -translate-y-1/2
    w-[90px] md:w-[120px]
    flex flex-col items-center
  "
        >
          {/* SOCIALS */}
          <ul
            id="socials"
            className="flex flex-col items-center justify-center mb-4 sm:mb-8"
          >
            {[
              [LinkedInIcon, "https://www.linkedin.com/company/lj-stration/"],
              [XIcon, "https://x.com/LjStration"],
              [InstagramIcon, "https://www.instagram.com/lj_stration/?hl=en"],
              [BehanceIcon, "https://www.behance.net/LJ-Studio"],
            ].map(([IconComponent, url], i) => (
              <li key={i} className="!mb-4">
                <a
                  ref={(el) => (socialsRef.current[i] = el)}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white"
                >
                  <IconComponent width={24} height={24} />
                </a>
              </li>
            ))}
          </ul>

          {/* SLOGAN */}
          <div
            ref={sideTextContainerRef}
            className="relative flex items-center justify-center sm:!mb-4 order-2 sm:order-1"
          >
            <p
              ref={sideTextRef}
              className="
        absolute
        whitespace-nowrap
        uppercase
        roboto
        text-[10pt]
        text-black/55
        border-r-2
        pr-4
        sm:pr-8
        rotate-[-90deg]
        origin-center
      "
            >
              creative studio - french accent
            </p>
          </div>

          {/* WORDMARK */}
          <div className="relative flex h-[120px] w-[100px] items-center justify-center order-1 sm:order-2 mb-2 sm:mb-0">
            <Image
              ref={wordmarkRef}
              src="/images/LJSTD_WORDMARK.svg"
              alt="LJ Studio wordmark"
              width={100}
              height={24}
              className="rotate-[-90deg]"
            />
          </div>
        </div>

        {/* CLOSE BUTTON */}
        <div className="absolute top-[4vh] right-[3vw] flex">
          <button onClick={handleToggle} className="focus:outline-none !p-0 hover:cursor-pointer">
            <RoundedIcon icon="" size={120} rotationFactor={0} circularContinue={true} menu={true} />
          </button>
        </div>

        {/* <div ref={sideTextRefMob} className="w-full flex justify-center gap-6 xl:hidden">
          <p className="uppercase roboto text-[8pt] text-black/55">
            creative studio - french accent
          </p>
          <div ref={wordmarkRefMob} className="xl:hidden">
            <Image src={"/images/LJSTD_WORDMARK.svg"} alt="LJ Studio wordmark" width={100} height={24}/>
          </div>
        </div> */}
      </div>
    </>
  );
};
