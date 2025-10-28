import Head from "next/head";
import Image from "next/image";
import Layout, { siteTitle } from "../components/layout";
import home from "../styles/home.module.scss";
import {
  motion,
  useScroll,
  useTransform,
  useAnimation,
  useSpring,
  delay,
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



export default function Home({ projects, gamePlan, logoClients, sliderImages, headerImages }) {
  const { scrollYProgress } = useScroll();
  console.log(sliderImages)
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const leftx = useTransform(scrollYProgress, [1, 0], [-100, 0]);
  const rightx = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const newx = useTransform(scrollYProgress, [1, 0], [50, 0]);
  const [buttonTopPosition, setButtonTopPosition] = useState('');
  const sectionImageRef = useRef(null);
  const sliderNavRef = useRef(null);
  // Référence pour la section entière
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.32 });
  
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
      opacity: 0.55,
      y: 0,
      transition: { 
        duration: 0.6,
        delay: i * 0.15
      }
    })
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
  return (
    <Layout home>
      <div>
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header headerImages={headerImages}/>
        <section
          className={`${home.black} bg-red sm:text-[269pt]/[208pt]`}
          data-scroll
          ref={sectionRef}
          style={{
            opacity: isInView ? 1 : 0,
            pointerEvents: isInView ? 'auto' : 'none',
            transition: 'opacity 0.6s cubic-bezier(0.4,0,0.2,1)'
          }}
        >
          <div>
            <h2>
              <div className="flex gap-6 md:gap-26 justify-center">
                <motion.p 
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={titleAnimation}
                  custom={0}
                  className={home.catHighlight}
                >
                  French
                </motion.p>
                <motion.p 
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={titleAnimation}
                  custom={1}
                >
                  CRAFTING
                </motion.p>
                <motion.p 
                  initial="hidden"
                  animate={isInView ? "visible" : "hidden"}
                  variants={titleAnimation}
                  custom={2}
                  className={home.catHighlight}
                >
                  Studio
                </motion.p>
              </div>
              <motion.p 
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={titleAnimation}
                custom={3}
              >
                SPORTS STORIES TROUGH
              </motion.p>
              <motion.p 
                initial="hidden"
                animate={isInView ? "visible" : "hidden"}
                variants={titleAnimation}
                custom={4}
                className="relative"
              >
                CREATIVE CANVAS.
                <div className="absolute right-[32%] bottom-[-50px]">
                  <RoundedIcon icon="" size={150} rotationFactor={0.45} />
                </div>
              </motion.p>
            </h2>
            <motion.p 
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={textAnimation}
              custom={5}
              className={`${home.defaultText} text-center w-[50vw] ml-auto mr-auto mt-32`}
            >
              LJ is a French creative studio based in Paris with an exclusive focus on the sports sector. Driven by a profound passion of sports and the emotion they provide, our studio prides itself on capturing and translating that into captivating visual narratives.
              <br />
              <br />
              From digital branding to creative direction, motion, print layouts and graphic creation, we offer a wide spectrum of services.               
            </motion.p>
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
        <section className="w-full h-full bg-black">
          <div className="w-full h-[100vh] relative">
            <div className="absolute -bottom-1 left-0 right-0 h-[60vh] z-3" style={{
              background: 'linear-gradient(to top, #000000ff 12vh, transparent 100%)'
            }}></div>
            <Image src="/images/lj-fcnante.png" fill={true}
              quality={100}
              style={{
                objectFit: 'cover',
                objectPosition:'top'
              }}>
            </Image>
          </div>
          <div className="flex flex-wrap w-full items-center gap-8 sm:gap-[126px] px-[3vw] relative z-3 pb-12 -mt-[40vh]">
            <div className="md:w-1/3">
              <h2 className={`flex flex-col items-center w-min collaborationTitle text-[21vw] sm:text-[80pt] uppercase text-center xl:ml-[4vw]`}>
                <p className="flex items-center gap-2"><span className="prefix">ON</span>Every Pitch...</p>
                <p className="flex">OUR CLIENT</p>
                <div className=''>
                  <p className="flex items-start"><span>COLLABORATIONS</span><span className="suffix flex items-center leading-[60px]"><span className="text-[47px]">(</span>*<span className="text-[47px]">)</span></span></p>                             
                </div>
              </h2>
            </div>
            <div className="flex md:w-2/3 flex-wrap flex-col gap-6 xl:justify-between sm:flex-row pr-[3vw] flex-1">
              <div className="md:w-max">
                <p className="uppercase hardbopBlack text-[12vw] sm:text-[45pt] leading-[0.8]">FAVORITE PLAYING SURFACE</p>
                <p className="defaultText mt-2 tracking-wider opacity-75 !text-[18pt] sm:!text-[20pt]">Creativity</p>
              </div>
              <div className="md:w-max">
                <p className="uppercase hardbopBlack text-[12vw] sm:text-[45pt] leading-[0.8]">WINNING STRATEGY</p>
                <p className="defaultText mt-2 tracking-wider opacity-75 !text-[18pt] sm:!text-[20pt]">Mixing pixels and passion</p>
              </div>
            </div>
          </div>
          <Collab logos={logoClients} />
        </section>
        <section className="relative bg-white py-42 intersectLogo white px-[4vw]">
          <div className="absolute right-[10%] top-[-90px]">
            <RoundedIcon icon="yeux" size={180} rotationFactor={0.45} />
          </div>
          <ImagesTrails/>
          <h2 className="text-center gallery mx-xl text-black">
            <p className="flex items-center gap-3 justify-center">BEYOND <span className="tenTwentyThin text-[125pt]">THE</span> SURFACE...</p>
            <p>STEP INSIDE OUR</p>
            <p className="flex items-center gap-3 justify-center"><span className="tenTwentyThin text-[125pt]">VISUAL</span>GALLERY AND</p>
            <p className="flex items-center gap-3 justify-center">EXPLORE<span className="tenTwentyThin text-[125pt]">ARCHIVES</span></p>
          </h2>
        </section>
        <StudioBanner/>
      </div>
    </Layout>
  );
}

export async function getServerSideProps() {
  const API_KEY = process.env.AIRTABLE_API_KEY || "patf38NGwq1uuDExU.2a7d95a5d70fecef0fa606e5d327341ab1627e4c7129dcc3ffbcf844d0e3421c";
  
  // Base principale (limitée)
  const PRIMARY_BASE = "appdnb8sgJdfIdsYT";
  // Base de backup
  const BACKUP_BASE = "appbZ4NcZBsBi6rXy";
  
  const fetchConfig = {
    headers: {
      Authorization: `Bearer ${API_KEY}`
    }
  };

  // Fonction pour essayer la base principale, puis la backup
  async function fetchWithFallback(tableName) {
    try {
      const data = await fetcher(
        `https://api.airtable.com/v0/${PRIMARY_BASE}/${tableName}`,
        fetchConfig
      );
      return data;
    } catch (error) {
      console.log(`Primary base failed for ${tableName}, trying backup...`);
      try {
        const data = await fetcher(
          `https://api.airtable.com/v0/${BACKUP_BASE}/${tableName}`,
          fetchConfig
        );
        return data;
      } catch (backupError) {
        console.log(`Both bases failed for ${tableName}:`, backupError);
        return { records: [] };
      }
    }
  }

  try {
    const [projectsData, gamePlanData, logoClientsData, sliderImagesData, headerImages] = await Promise.all([
      fetchWithFallback('Projects'),
      fetchWithFallback('METIERS'),
      fetchWithFallback('Logo%20clients'),
      fetchWithFallback('SLIDER%20IMAGES'),
      fetchWithFallback('HEADER%20IMGS')
    ]);

    return {
      props: {
        projects: projectsData?.records || [],
        gamePlan: (gamePlanData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0)),
        logoClients: (logoClientsData?.records || []).sort((a, b) => (a.fields?.id || 0) - (b.fields?.id || 0)),
        sliderImages: sliderImagesData?.records || [],
        headerImages: headerImages?.records || []
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
        headerImages: []
      },
    };
  }
}
