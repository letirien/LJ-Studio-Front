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



export default function Home({ projects }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const leftx = useTransform(scrollYProgress, [1, 0], [-100, 0]);
  const rightx = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const newx = useTransform(scrollYProgress, [1, 0], [50, 0]);
  const sliderNavRef = useRef(null);

  // Référence pour la section entière
  const sectionRef = useRef(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  
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
  
  return (
    <Layout home>
      <div>
        <Head>
          <title>{siteTitle}</title>
          <link rel="icon" href="/favicon.ico" />
        </Head>
        <Header/>
        <section className={`${home.black} bg-red`} data-scroll ref={sectionRef}>
          <div>
            <h2>
              <div className="flex gap-12 justify-center">
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
              >
                CREATIVE CANVAS.
              </motion.p>
            </h2>
            <motion.p 
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              variants={titleAnimation}
              custom={5}
              className={`${home.defaultText} text-center w-[40vw] ml-auto mr-auto mt-12`}
            >
              LJ is a French creative studio based in Paris with an exclusive focus on the sports sector. Driven by a profound passion of sports and the emotion they provide, our studio prides itself on capturing and translating that into captivating visual narratives.
              <br></br>
              <br></br>
              From digital branding to creative direction, motion, print layouts and graphic creation, we offer a wide spectrum of services.               
            </motion.p>
          </div>
          <div className="w-full mt-32 overflow-hidden grayscale">
            <div className="relative w-[120vw] left-1/2 -translate-x-1/2">
              <div className="grid grid-cols-16 gap-4 max-h-[500px]">
                {/* Première colonne */}
                <motion.div 
                  className="col-span-4 relative flex flex-col gap-4 h-[800px] rounded-xl"
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
                >
                  <div className="flex-1 rounded-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 via-10% via-transparent/0 to-transparent z-10 rounded-xl"></div>
                    <Image src="/images/projects/slide1.png" alt="Grid Image 1-1" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                  <div className="flex-1 rounded-xl relative">
                    <Image src="/images/projects/slide2.png" alt="Grid Image 1-2" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                </motion.div>

                {/* Deuxième colonne */}
                <motion.div 
                  className="col-span-4 relative flex flex-col gap-4 h-[800px] rounded-xl"
                  style={{ y: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
                >
                  <div className="flex-1 rounded-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 via-10% via-transparent/0 to-transparent z-10 rounded-xl"></div>
                    <Image src="/images/projects/slide3.png" alt="Grid Image 2-1" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                  <div className="flex-1 rounded-xl relative">
                    <Image src="/images/projects/slide4.png" alt="Grid Image 2-2" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                </motion.div>

                {/* Troisième colonne */}
                <motion.div 
                  className="col-span-4 relative flex flex-col gap-4 h-[800px] rounded-xl"
                  style={{ y: useTransform(scrollYProgress, [0, 1], [0, 100]) }}
                >
                  <div className="flex-1 rounded-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 via-10% via-transparent/0 to-transparent z-10 rounded-xl"></div>
                    <Image src="/images/projects/slide1.png" alt="Grid Image 3-1" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                  <div className="flex-1 rounded-xl relative">
                    <Image src="/images/projects/slide3.png" alt="Grid Image 3-2" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                </motion.div>

                {/* Quatrième colonne */}
                <motion.div 
                  className="col-span-4 relative flex flex-col gap-4 h-[800px] rounded-xl"
                  style={{ y: useTransform(scrollYProgress, [0, 1], [100, -100]) }}
                >
                  <div className="flex-1 rounded-xl relative">
                    <div className="absolute inset-0 bg-gradient-to-b from-black via-black/80 via-10% via-transparent/0 to-transparent z-10 rounded-xl"></div>
                    <Image src="/images/projects/slide2.png" alt="Grid Image 4-1" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                  <div className="flex-1 rounded-xl relative">
                    <Image src="/images/projects/slide4.png" alt="Grid Image 4-2" layout="fill" objectFit="cover" className="rounded-xl transition-transform duration-700 !relative"/>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>
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
        <section className="bg-half-col py-42 relative">
          <div className="mx-auto px-[4%]">
            <h2 className="HardbopH2 relative"><p>highlights of</p><p>our recent games</p></h2>
            <Projects projects={projects} navRef={sliderNavRef} />
      
          {/* Boutons de navigation positionnés relativement au parent bg-half-col */}
          <div className="absolute top-1/2 -translate-y-1/2 right-8 z-50 flex flex-col gap-3">
            <button 
              className={`w-14 h-14 flex items-center justify-center border-2 border-black text-white rounded-xl hover:bg-white/20 transition-colors`}
              onClick={() => sliderNavRef.current?.handleNext()}
            >
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M19.3279 6.54796C20.1177 5.34438 21.8822 5.34437 22.6721 6.54796L39.9674 32.9027C40.8402 34.2327 39.8861 36 38.2953 36H3.70468C2.11385 36 1.15976 34.2327 2.03258 32.9027L19.3279 6.54796Z" fill="black"/>
              </svg>
            </button>
            <button 
              className={`w-14 h-14 flex items-center justify-center border-2 border-[#fa6218] text-white rounded-xl hover:bg-white/20 transition-colors`}
              onClick={() => sliderNavRef.current?.handlePrev()}
            >
              <svg width="42" height="42" viewBox="0 0 42 42" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.6721 35.452C21.8822 36.6556 20.1178 36.6556 19.3279 35.452L2.03262 9.09731C1.1598 7.7673 2.11388 6 3.70471 6L38.2953 6C39.8861 6 40.8402 7.7673 39.9674 9.09731L22.6721 35.452Z" fill="#FA6218"/>
              </svg>
            </button>
            
          </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
export async function getServerSideProps() {
  const API_KEY = "patf38NGwq1uuDExU.2a7d95a5d70fecef0fa606e5d327341ab1627e4c7129dcc3ffbcf844d0e3421c";
    const ProjectsData = await fetcher(
    `https://api.airtable.com/v0/appdnb8sgJdfIdsYT/Table%201`,{
      headers: {
        Authorization: `Bearer ${API_KEY}`
      }
    }    
  );
  return {
    props: {
      projects: ProjectsData.records,
    },
  };
}
