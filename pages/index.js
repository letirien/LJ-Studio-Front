import Head from "next/head";
import Image from "next/image";
import Layout from "../components/layout";
import home from "../styles/home.module.scss";
import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef, useEffect, useState } from "react";
import { useInView } from "framer-motion";
import Link from "next/link";

import { fetcher } from "../lib/api.js";
import Projects from "../components/home/ProjectSlider";
import {Header} from "../components/home/Header";
import BrandingSection from "../components/home/GamePlan.js";
import Collab from "../components/home/Collab.js";
import StudioBanner from "../components/home/StudioBanner.js";
import AnimatedField from "../components/home/AnimatedField.js";
import CreativeCanvas from "../components/home/CreativeCanvas.js";
import { ImagesTrails } from "../components/home/ImagesTrail.js";
import RoundedIcon from "../components/RoundedIcon.js";
import ProjectSection from "../components/home/ProjectSection.js";
import HighlightText from "../components/home/HighlightText.js";
import AppearText from '../components/AppearText.js';
import { useLoading } from '../lib/LoadingManager';



export default function Home({ projects, gamePlan, logoClients, sliderImages, headerImages, headerClients }) {
  const { setDataLoaded, setEffectsReady, setPageImagesProgress } = useLoading();
  const [isMobileOrSafari, setIsMobileOrSafari] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Ref pour la section FC Nantes
  const fcNantesRef = useRef(null);

  // Parallax basé sur la position de FC Nantes dans le viewport
  // offset: ["start end", "start start"] =
  //   - progress 0 quand le haut de FC Nantes atteint le bas du viewport
  //   - progress 1 quand le haut de FC Nantes atteint le haut du viewport
  const { scrollYProgress: fcNantesProgress } = useScroll({
    target: fcNantesRef,
    offset: ["start end", "start start"]
  });

  // FC Nantes commence à -300px (cachée sous GamePlan) et descend à 0 (position normale)
  // L'effet s'arrête à 0, elle ne descend pas plus
  const fcNantesY = useTransform(fcNantesProgress, [0, 1], [-300, 0]);

  // Parallax : le gradient du bas grandit quand la section scroll hors de l'écran
  const { scrollYProgress: fcNantesGrowthProgress } = useScroll({
    target: fcNantesRef,
    offset: ["start start", "end start"]
  });
  const fcNantesGradientScale = useTransform(fcNantesGrowthProgress, [0, 1], [1, 1.5]);

  const sectionImageRef = useRef(null);
  const galerySection = useRef(null);
  const aboutUsRef = useRef(null);
  // const galerySection2 = useRef(null);

 const { scrollYProgress: scrollYGalleryProgress } = useScroll({
    target: galerySection,
    offset: ["start end", "end start"], // du moment où la section entre jusqu’à ce qu’elle sorte
  });

  const { scrollYProgress: scrollYTextGalleryProgress } = useScroll({
    target: aboutUsRef,
    offset: ["start center", "end center"], // du moment où la section entre jusqu’à ce qu’elle sorte
  });

  // On fait varier le line-height progressivement
  const lineHeight = useTransform(scrollYGalleryProgress, [0, 1], ["1.1", "0.7"]);

  // Animation lineHeight : utilise useTransform sauf sur mobile/Safari
  // Détection mobile/Safari côté client uniquement pour éviter les erreurs d'hydratation
  useEffect(() => {
    const isMobile = window.matchMedia && window.matchMedia("(max-width: 640px)").matches;
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

    setIsMobile(isMobile)
    setIsMobileOrSafari(isMobile || isSafari);
  }, []);

  const pLineHeightMotion = useTransform(scrollYTextGalleryProgress, [0, 1], ["1.6", "1.2"]);

  // Animations simples
  const titleAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        delay: i * 0.1
      }
    })
  };
    const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.6,
        delay: i * 0.15
      }
    })
  };

    // Line reveal variants (top slides up, bottom slides in)
    const lineContainer = {
      hidden: {},
      visible: { transition: { staggerChildren: 0.12 } }
    };
    const lineTop = {
      hidden: { y: '0%', opacity: 1 },
      visible: { y: '-100%', opacity: 0, transition: { duration: 0.6 } }
    };
    const lineBottom = {
      hidden: { y: '100%', opacity: 0 },
      visible: { y: '0%', opacity: 1, transition: { duration: 0.6 } }
    };

  const calculateButtonPosition = () => {
    const imageRef = document.getElementById('sliderContainer')

    if (imageRef && sectionImageRef.current) {
      const sectionRect = sectionImageRef.current.getBoundingClientRect();
      const imageRect = imageRef.getBoundingClientRect();
      
      // Position du haut de l'image par rapport à la section
      const imageTop = imageRect.top - sectionRect.top;
      
      // Placer les boutons à la moitié de la distance entre le haut de la section et l'image
      const middlePosition = imageTop / 2;
      
      // Convertir en pourcentage de la hauteur de la section
      const sectionHeight = sectionRect.height;
      const topPercentage = (middlePosition / sectionHeight) * 100;
      
      setButtonTopPosition(`${topPercentage.toFixed(1)}%`);
    }
  };

  useEffect(() => {
    // Calculer après le premier rendu
    const timer = setTimeout(calculateButtonPosition, 100);

    // Recalculer lors du redimensionnement
    const handleResize = () => {
      calculateButtonPosition();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Marquer les données comme chargées dès le montage du composant
  // (puisque getServerSideProps les charge côté serveur)
  useEffect(() => {
    setDataLoaded();
    // Marquer les images de la page comme chargées immédiatement
    // (on ne les preload pas pour éviter les conflits et le lag)
    setPageImagesProgress(100, 100);
  }, [setDataLoaded, setPageImagesProgress]);

  // Marquer les effets comme prêts après l'initialisation de GSAP et des animations
  useEffect(() => {
    // Donner un peu de temps pour que GSAP et ScrollTrigger s'initialisent
    const timer = setTimeout(() => {
      setEffectsReady();
    }, 500);

    return () => clearTimeout(timer);
  }, [setEffectsReady]);

  // Paragraph animations are handled by AppearText (GSAP inside component)
  return (
    <Layout home>
      <div>
        <Head>
          {/* SEO Meta Tags */}
          <title>LJ STUDIO™ - SPORT DESIGN</title>
          <meta name="description" content="Designing the language of sport through visual identities, art direction and content for teams, brands, events and federations." />
          <meta name="keywords" content="creative studio, sports design studio, art direction, branding, visual identity, logotype, brand territory, visual guidelines, key visuals, campaign, matchday visuals, social media templates, posters, motion, typographic animation, brand motion systems, video editing, 3D, stadium content, giant screen, LED animations, line-up reveals, goal animation, victory animation, matchday, fan engagement, storytelling, design system" />

          {/* Open Graph / Facebook */}
          <meta property="og:type" content="website" />
          <meta property="og:url" content="https://ljstudio.xyz/" />
          <meta property="og:title" content="LJ STUDIO™ - SPORT DESIGN" />
          <meta property="og:description" content="Designing the language of sport through visual identities, art direction and content for teams, brands, events and federations." />
          {/* <meta property="og:image" content="https://ljstudio.xyz/og-image.jpg" /> */}
          <meta property="og:site_name" content="LJ STUDIO" />
          <meta property="og:locale" content="en_US" />

          {/* Twitter */}
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:url" content="https://ljstudio.xyz/" />
          <meta name="twitter:title" content="LJ STUDIO™ - SPORT DESIGN" />
          <meta name="twitter:description" content="Designing the language of sport through visual identities, art direction and content for teams, brands, events and federations." />
          {/* <meta name="twitter:image" content="https://ljstudio.xyz/og-image.jpg" /> */}

          {/* Additional SEO */}
          <link rel="canonical" href="https://ljstudio.xyz/" />
        </Head>
        <Header headerImages={headerImages}/>
        <section
          className={`${home.black} bg-black pt-12 sm:pt-32`}
          data-scroll
          id="about"
          // style={{
          //   opacity: isInView ? 1 : 0,
          //   pointerEvents: isInView ? 'auto' : 'none',
          //   transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)'
          // }}
        >
          <div className="flex gap-4 mx-auto justify-center items-center mb-6">
            <AppearText type="words" duration={1.4} once={true}
                  className={`${home.catHighlight} !robotoRegular block md:hidden !opacity-55 text-[12px] `}
            >
              French
            </AppearText>
            <p className="instrumentSerifRegular text-[8vw]/[0.8] tracking-tight sm:opacity-90 sm:text-[4vw]/[0.8]">Creative Studio</p>
            <AppearText type="words" once={true} duration={1.4}
                  className={`${home.catHighlight} !robotoRegular block md:hidden  !opacity-55  text-[12px]`}
            >
              Accent
            </AppearText>
          </div>
          <div>
            <h1 className="text-center text-[14vw]/[0.85] sm:text-[8vw]/[0.85]">
              <div className="flex gap-9 justify-center items-center">
      
                 <AppearText type="lines" once={true} duration={1.4}
                  className={`${home.catHighlight} !robotoRegular hidden  md:block !opacity-55 text-[1.5vw]`}
                >
                  French
                </AppearText>
                
                {/* REMPLACEZ motion.p par HighlightText */}
                <HighlightText 
                  initial="hidden"
                  variants={titleAnimation}
                  custom={1}
                >
                  CRAFTING
                </HighlightText>
                
                {/* GARDEZ motion.p pour catHighlight */}
                <AppearText type="lines" once={true} duration={1.4}
                  className={`${home.catHighlight} !robotoRegular hidden md:block !opacity-55 text-[1.5vw]`}
                >
                  Accent
                </AppearText>
              </div>
              
              {/* REMPLACEZ motion.p par HighlightText */}
              <HighlightText 
                initial="hidden"
                variants={titleAnimation}
                custom={3}
                fadedValue={0.2}           // Opacité de départ (0-1)
                staggerValue={.04}         // Délai entre chaque caractère     
              >
                SPORTS STORIES
              </HighlightText>
              
              <HighlightText 
                initial="hidden"
                variants={titleAnimation}
                custom={4}
                className="relative"
                staggerValue={.05}         // Délai entre chaque caractère     
              >
                 TROUGH CREATIVE
                <div className="absolute right-[22.5%] bottom-[-50%] hidden sm:block xl:hidden">
                  <RoundedIcon icon="" size={80} rotationFactor={0.45} />
                </div>
                <div className="absolute right-[22.5%] bottom-[-30%] hidden xl:block">
                  <RoundedIcon icon="" size={120} rotationFactor={0.45} />

                </div>
              </HighlightText>
              <HighlightText 
                initial="hidden"
                variants={titleAnimation}
                custom={3}
                fadedValue={0.2}         
                staggerValue={0.085}
                className="relative"         
              >
                CANVAS.
                <div className="absolute right-[40%] bottom-[-60%] sm:hidden">
                  <RoundedIcon icon="" size={70} rotationFactor={0.45} />
                </div>
              </HighlightText>
            </h1>
            <div
              ref={aboutUsRef}
              className={`${home.defaultText} text-center w-[90vw] sm:w-[70vw] xl:w-[50vw] ml-auto mr-auto mt-16 md:mt-32 overflow-visible sm:h-[400px] shadow-[inset_0px_-50px_19px_-10px_#000000] sm:shadow-none` }
            >
              {/* lineHeight animé uniquement sur desktop non-Safari, sinon fixe */}
              <motion.p style={{lineHeight: isMobileOrSafari ? "1.2" : pLineHeightMotion}} className="uppercase mb-12 robotoRegular text-[12px] sm:text-[20px] tracking-[0.7px] text-white !font-[400]">LJ Studio was born from a passion for sport and image, two languages that speak through emotion.</motion.p>
              <motion.p style={{lineHeight: isMobileOrSafari ? "1.4" : pLineHeightMotion}} className="!opacity-55 robotoRegular text-[12px] sm:text-[20px] mb-6">Since 2018, we've been crafting visual identities and creative systems that translate the emotion and energy of sport into meaningful stories.</motion.p>
              <motion.p style={{lineHeight: isMobileOrSafari ? "1.4" : pLineHeightMotion}} className="!opacity-55 robotoRegular text-[12px] sm:text-[20px] mb-6">Over time, the studio has grown alongside its clients  - shaping art direction, brand universes and content for teams, events and federations who share the same passion for the game.</motion.p>
              <motion.p style={{lineHeight: isMobileOrSafari ? "1.4" : pLineHeightMotion}} className="!opacity-55 robotoRegular text-[12px] sm:text-[20px]">We believe every sport has its own language: we design the way it's told.</motion.p>
              {/* {[
                {
                  className: 'uppercase mb-12 robotoRegular tracking-[0.7px] text-white',
                  text: 'LJ Studio was born from a passion for sport and image, two languages that speak through emotion.'
                },
                { className: '!opacity-55 robotoReg text-[20px]', text: 'Since 2018, we’ve been crafting visual identities and creative systems that translate the emotion and energy of sport into meaningful stories.' },
                { className: '!opacity-55 robotoReg text-[20px]', text: 'Over time, the studio has grown alongside its clients  - shaping art direction, brand universes and content for teams, events and federations who share the same passion for the game.' },
                { className: '!opacity-55 robotoReg text-[20px]', text: 'We believe every sport has its own language - we design the way it’s told.' }
              ].map((p, idx) => (
                <div key={idx} className="relative overflow-hidden mb-6">
                  <AppearText type="lines" once={true} className={`${p.className}`}>
                    {p.text}
                  </AppearText>
                </div>
              ))} */}
            </div>
          </div>
          <CreativeCanvas images={sliderImages}/>
        </section>
        {/* <section className={`${home.introSection}`} data-scroll>
          <div className={`${home.white} intersectLogo white`}>
            <div className="">
              <motion.p style={{ x: x }}>
                <span>Crafting</span>
              </motion.p>
              <motion.p style={{ x: leftx }}>sports</motion.p>
              <motion.p style={{ x: x }}>
                <span>stories</span>
              </motion.p>
              <motion.p style={{ x: rightx }}>through</motion.p>
              <motion.p style={{ x: leftx }}>
                <span>creative</span>
              </motion.p>
              <motion.p style={{ x: newx }}>canvas.</motion.p>
            </div>
          </div>
          <div className={home.black}>
            <div className={home.introtxtContainer}>
              <Section>
                <div className={home.introPresetations}>
                  <motion.p variants={fadeInUp}>
                    LJ is a <span>French creative studio</span> based in Paris
                    with an exclusive focus on the sports sector.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    Driven by a profound passion of sports and the emotion they
                    provide, our studio prides itself on capturing and
                    translating that into captivating visual narratives.
                  </motion.p>
                  <motion.p variants={fadeInUp}>
                    From digital branding to creative direction, motion, print
                    layouts and graphic creation, we offer a wide spectrum of
                    services.
                  </motion.p>
                </div>
                <motion.div className={home.introInfo} variants={fadeInRight}>
                  <p>In summary: </p>
                  <p>Sports - Passion - Emotion</p>
                  <p>Creative</p>
                </motion.div>
              </Section>
            </div>
          </div>
        </section> */}
        <ProjectSection projects={projects} home={home} />
        {/* <section className="bg-half-col py-42 relative" ref={sectionImageRef}>
          <div className="mx-auto px-[3vw]">
            <h2 className="bigH2 relative">
              <p className="flex justify-center gap-2 md:gap-12">
                <span className={`${home.catHighlight} !text-black`}>
                  Pitch
                </span>
                highlights of
                <span className={`${home.catHighlight} !text-black`}>
                  Vison
                </span>
                </p>
              <p>our recent games</p>
            </h2>
            <Projects projects={projects} navRef={sliderNavRef} />
          </div>
        </section> */}
        {/*
          <section className="overflow-hidden bg-black">
            <div className="marquee-container relative w-full -mb-4 md:-mb-12">
              <div className="marquee-content flex whitespace-nowrap">
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
              </div>
              <div className="marquee-content flex whitespace-nowrap">
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">OUR GAME PLAN</span>
                <span className="mx-4 harbop text-[18vw] scroll-text">SKILLS</span>
              </div>
            </div>
          </section>
        */}
        <AnimatedField/>
        <BrandingSection gamePlan={gamePlan} />
        <motion.section ref={fcNantesRef} className="w-full h-full bg-black" style={{ y: fcNantesY }}>
          <div className="w-full h-[100vh] relative overflow-hidden">
            <div className="absolute -bottom-1 left-0 right-0 h-[60vh] z-3" style={{
              background: 'linear-gradient(to top, #000000ff 12vh, transparent 100%)'
            }}></div>
            {/* Image de fond (n0) */}
            {headerClients[0]?.fields?.Image?.[0]?.url && (
              <Image
                src={headerClients[0].fields.Image[0].url}
                fill={true}
                quality={100}
                style={{
                  objectFit: 'cover',
                  objectPosition: isMobile ? '10% top' :'top left'
                }}
                alt="Client highlight background"
              />
            )}
            {/* Image déco superposée (n1) - parallax scaleY au scroll */}
            {headerClients[1]?.fields?.Image?.[0]?.url && (
              <motion.div className="absolute inset-0 z-2" style={{
                scaleY: fcNantesGradientScale,
                transformOrigin: 'bottom'
              }}>
                <Image
                  src={headerClients[1].fields.Image[0].url}
                  fill={true}
                  quality={100}
                  style={{
                    objectFit: 'cover',
                    objectPosition: 'top left'
                  }}
                  alt="Client highlight people decoration"
                />
              </motion.div>
            )}

          </div>
          <div className="flex flex-wrap w-full items-center gap-18 sm:gap-[126px] px-[3vw] relative z-3 pb-12 -mt-[20vh]">
            <div className="mx-auto">
              <h2 className={`flex flex-col items-center w-min collaborationTitle text-[16vw] sm:text-[80pt] uppercase text-center xl:ml-[4vw]`}>
                <p className="flex items-center gap-2"><span className="prefix text-[38px] sm:[54pt] capitalize">On</span>Every Pitch...</p>
                <p className="flex">OUR CLIENT</p>
                <div className=''>
                  <p className="flex items-start"><span>COLLABORATIONS</span><span className="flex items-center leading-[1.2] text-[24px] !sm:text-[96pt] roboto"><span className="">(</span>*<span className="">)</span></span></p>                             
                </div>
              </h2>
            </div>
            <div className="flex md:w-2/3 flex-wrap flex-col gap-6 justify-around md:flex-row xl:pr-[3vw] flex-1">
              <div className="md:w-max">
                <h3 className="text-center">
                  <p className="uppercase helveticaNowDisplayMedium text-[7vw] sm:text-[25pt] leading-[0.9]">Small roster,</p>
                  <p className="uppercase helveticaNowDisplayMedium text-[7vw] sm:text-[25pt] leading-[0.9]">French accent.</p>
                </h3>
                <p className="instrumentSerifRegular mt-2 opacity-75 !text-[16pt] sm:!text-[20pt] w-[50%] mx-auto text-center tracking-tighter	leading-[1]">Sport-focused design studio, born in Paris.</p>
              </div>
              <div className="hidden sm:block  md:w-max">
                <h3 className="text-center">
                  <p className="uppercase helveticaNowDisplayMedium text-[8vw] sm:text-[25pt] leading-[0.9]">Shaped by</p>
                  <p className="uppercase helveticaNowDisplayMedium text-[8vw] sm:text-[25pt] leading-[0.9]">emotion.</p>
                </h3>
                <p className="instrumentSerifRegular mt-2 opacity-75 !text-[18pt] sm:!text-[20pt] w-[60%] mx-auto text-center tracking-tighter	leading-[1]">Designing for the feelings sport leaves behind.</p>
              </div>
            </div>
          </div>
          <Collab logos={logoClients} />
        </motion.section>
        <a href="https://www.behance.net/LJ-Studio" target="_blank">
          <motion.section id="archive" className="flex relative bg-white h-screen intersectLogo white px-[4vw] bg-black">
            <div className="absolute right-[10%] top-[-60px] sm:top-[-90px] z-[3]">
              <RoundedIcon icon="yeux" size={160} rotationFactor={0.45} />
            </div>
            <div ref={galerySection} className="self-center items-center mx-auto">
              <motion.h2 style={{lineHeight}} className="hidden sm:block text-center gallery text-[9vw]/[0.8] sm:text-[8vw]/[0.8] mx-xl text-black">
                <p className="flex items-center gap-3 justify-center">BEYOND <span className="instrumentSerifRegular text-[4vw] capitalize">The</span> SURFACE...</p>
                <p>STEP INSIDE OUR</p>
                <p className="flex items-center gap-3 justify-center"><span className="instrumentSerifRegular text-[4vw] capitalize">Visual</span>GALLERY AND</p>
                <p className="flex items-center gap-3 justify-center">EXPLORE<span className="instrumentSerifRegular text-[4vw] capitalize">Archives</span></p>
              </motion.h2>
              <motion.h2 style={{lineHeight}} className="sm:hidden text-center gallery text-[14vw]/[0.8] sm:text-[8vw]/[0.8] mx-xl text-black">
                <p>BEYOND</p>
                <p className="flex items-center gap-3 justify-center"><span className="instrumentSerifRegular text-[8vw] capitalize">The</span> SURFACE...</p>
                <p>STEP INSIDE</p>
                <p className="flex items-center gap-3 justify-center">OUR<span className="instrumentSerifRegular text-[8vw] capitalize">Visual</span></p>
                <p>GALLERY</p>
                <p>AND EXPLORE</p>
                <p className=""><span className="instrumentSerifRegular text-[8vw] capitalize">Archives</span></p>
              </motion.h2>
            </div>
            <ImagesTrails images={sliderImages}/>
          </motion.section>
        </a>
        <StudioBanner/>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const API_KEY = process.env.AIRTABLE_API_KEY || "patf38NGwq1uuDExU.2a7d95a5d70fecef0fa606e5d327341ab1627e4c7129dcc3ffbcf844d0e3421c";
  const BASE_ID = "appdnb8sgJdfIdsYT";

  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  };

  async function fetchTable(tableName) {
    try {
      return await fetcher(
        `https://api.airtable.com/v0/${BASE_ID}/${tableName}`,
        fetchConfig
      );
    } catch (error) {
      console.log(`Failed to fetch ${tableName}:`, error);
      return { records: [] };
    }
  }

  try {
    const [projectsData, gamePlanData, logoClientsData, sliderImagesData, headerImages, headerClientsData] = await Promise.all([
      fetchTable('Projects'),
      fetchTable('METIERS'),
      fetchTable('Logo%20clients'),
      fetchTable('SLIDER%20IMAGES'),
      fetchTable('HEADER%20IMGS'),
      fetchTable('HEADER%20clients')
    ]);

    return {
      props: {
        projects: (projectsData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0)),
        gamePlan: (gamePlanData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0)),
        logoClients: (logoClientsData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0)),
        sliderImages: (sliderImagesData?.records || []).sort((a, b) => (a.fields?.id) - (b.fields?.id)),
        headerImages: (headerImages?.records || []).sort((a, b) => (a.fields?.id) - (b.fields?.id)),
        headerClients: (headerClientsData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0))
      },
    };
  } catch (error) {
    console.log('Error fetching Airtable data:', error);

    return {
      props: {
        projects: [],
        gamePlan: [],
        logoClients: [],
        sliderImages: [],
        headerImages: [],
        headerClients: []
      },
    };
  }
}
