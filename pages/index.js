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
import AnimateText from "../lib/animation/animationText";
import {
  fadeInUp,
  fadeInRight,
  fadeInLeft,
  animationContainer,
} from "../lib/animation/variant";
import Link from "next/link";

import { fetcher } from "../lib/api.js";

// Hook personnalisé pour l'animation sans modifier la structure DOM
function useAnimationControls(once = false) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: once });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);

  return { ref, controls };
}

export const variants = {
  show: {
    opacity: 1,
    transition: {
      ease: "easeOut",
      duration: 0.2,
      delay: 0.1,
    },
  },
  hide: {
    opacity: 0,
  },
};

export function Section({ children }) {
  const controls = useAnimation();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: false });

  useEffect(() => {
    if (isInView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, isInView]);
  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={animationContainer}
    >
      {children}
    </motion.div>
  );
}
export function SliderDot({ Nb, idProject, home, onButtonClick }) {
  const handleDotClick = (index) => {
    onButtonClick(index);
  };
  const circles = Array.from({ length: Nb }, (_, index) => (
    <motion.div
      key={index} // Ajoutez une clé unique pour chaque cercle
      variants={fadeInRight}
      className={`${home.cercle} ${
        index === idProject - 1 ? home.current : ""
      }`}
      onClick={() => handleDotClick(index + 1)}
    />
  ));

  return <div className={home.cercleContainer}>{circles}</div>;
}
export function Projects({ projects }) {
  const containerImg = useRef("");
  const [animImg, setAnimImg] = useState(false);
  const [idProject, setIdProject] = useState(1);
  const [dotClick, setDotClick] = useState(null);
  const [ProjectsData, setProjectsData] = useState(projects);
  const imgRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const lastMousePosition = useRef({ x: 0, y: 0 });

  const handleChildButtonClick = (data) => {
    if (data) {
      setDotClick(data);
    }
  };
  const ImgURL = "http://localhost:1337";

  // Fonction pour gérer l'animation des textes
  const anim = () => {
    const containerTxt = document.querySelectorAll(".container-txt");
    setAnimImg(true);
    containerTxt.forEach((el) => {
      Array.from(el.children).forEach((child) =>
        child.classList.add("slideUpInfoImg")
      );
    });
    if (!dotClick) {
      setTimeout(() => {
        incrementProjectId();
      }, 600);
    } else {
      setTimeout(() => {
        incrementProjectIdByClick(dotClick);
      }, 600);
    }

    setTimeout(() => {
      setAnimImg(false);
      containerTxt.forEach((el) => {
        Array.from(el.children).forEach((child) =>
          child.classList.remove("slideUpInfoImg")
        );
      });
      setDotClick(null);
    }, 1600);
  };

  // Fonction pour gérer l'incrémentation de l'ID du projet
  const incrementProjectId = () => {
    setIdProject((prevId) => {
      const nextId = (prevId % ProjectsData.length) + 1; // Mise à jour pour s'adapter au nombre de projets
      return nextId;
    });
  };

  // Fonction pour gérer l'incrémentation de l'ID du projet
  const incrementProjectIdByClick = (id) => {
    setIdProject(id);
  };

  // const handleMouseMove = (e) => {
  //   setAnimImg(false);
  //   if (!containerImg.current || !imgRef.current) return;
  //   const containerRect = containerImg.current.getBoundingClientRect();
  //   const imageRect = imgRef.current.getBoundingClientRect();

  //   const containerCenterX = containerRect.width / 2;
  //   const containerCenterY = containerRect.height / 2;

  //   const mouseX = e.clientX - containerRect.left;
  //   const mouseY = e.clientY - containerRect.top;

  //   const moveX = (containerCenterX - mouseX) / 6;
  //   const moveY = (containerCenterY - mouseY) / 6;

  //   imgRef.current.style.transform = `translate(${moveX}px, ${moveY}px) scale(1.1)`;

  //   lastMousePosition.current = { x: mouseX, y: mouseY };
  // };

  const handleMouseEnter = () => {
    setAnimImg(false);
    imgRef.current.style.transition = "all 0.05s ease-in-out";
    imgRef.current.style.transform = `scale(1.05)`;

    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setAnimImg(null);
    imgRef.current.style.transform = "translate(0, 0) scale(1)";
  };

  useEffect(() => {
    let intervalAnim;
    if (dotClick) {
      anim(dotClick);
    } else {
      intervalAnim = setInterval(() => {
        anim();
      }, 5000);
    }

    return () => {
      clearInterval(intervalAnim);
    };
  }, [dotClick]);

  return (
    <div className={`${home.container} ${home.containerProjects}`}>
      <section>
        <div className={`${home.projects} intersectLogo`}>
          <Link
            href={`/project/${ProjectsData[idProject - 1].fields.Sujet}`} // Mise à jour de slug vers Sujet
            className={
              animImg === true
                ? `${home.containerImg} anim`
                : `${home.containerImg}`
            }
            ref={containerImg}
            // onMouseMove={handleMouseMove}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Image
              src={`${ProjectsData[idProject - 1].fields.Image[0].url}`} // Mise à jour pour accéder à l'URL de l'image
              alt="Project Cover"
              fill={true}
              style={{
                objectFit: "cover",
              }}
              ref={imgRef}
            />
          </Link>
          <div className={home.slideBlock}>
            <Section>
              <div className={home.containerSlideInfo}>
                <Link href="#" className={home.verticalText}>
                  <motion.p variants={fadeInLeft}>
                    More <span>works (+)</span>{" "}
                  </motion.p>
                </Link>
                <SliderDot
                  Nb={ProjectsData.length}
                  idProject={idProject}
                  home={home}
                  onButtonClick={handleChildButtonClick}
                />
              </div>
            </Section>
          </div>
          <Section>
            <motion.div variants={fadeInUp} className={home.projectFooter}>
              <div className={home.footerInfo}>
                <div className="container-txt">
                  <p>Client</p>
                </div>
                <div className="container-txt">
                  <p className={home.subInfo}>
                    {ProjectsData[idProject - 1].fields.Client}
                  </p>
                </div>
              </div>
              <div className={home.footerInfo}>
                <div className="container-txt">
                  <p>Date</p>
                </div>
                <div className="container-txt">
                  <p className={home.subInfo}>
                    {ProjectsData[idProject - 1].fields.Date}
                  </p>
                </div>
              </div>
              <div className={home.footerInfo}>
                <div className="container-txt">
                  <p>Subject</p>
                </div>
                <div className="container-txt">
                  <p className={home.subInfo}>
                    {ProjectsData[idProject - 1].fields.Sujet}
                  </p>
                </div>
              </div>
              <div className={home.footerInfo}>
                <div className="container-txt">
                  <p>Working on the</p>
                </div>
                <div className="container-txt">
                  <p className={home.subInfo}>
                    {ProjectsData[idProject - 1].fields["Working On"]}
                  </p>
                </div>
              </div>
              <div className={home.footerInfo}>
                <p className={home.slideCount}>
                  0
                  <motion.span
                    key={idProject}
                    variants={variants}
                    animate={"show"}
                    initial="hide"
                  >
                    {idProject}
                  </motion.span>
                  .
                </p>
              </div>
            </motion.div>
          </Section>
        </div>
      </section>
    </div>
  );
}


export default function Home({ projects }) {
  const { scrollYProgress } = useScroll();
  const x = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const leftx = useTransform(scrollYProgress, [1, 0], [-100, 0]);
  const rightx = useTransform(scrollYProgress, [0, 1], [-100, 0]);
  const newx = useTransform(scrollYProgress, [1, 0], [50, 0]);
  
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
              className={`${home.defaultText} text-center w-1/3 ml-auto mr-auto mt-12`}
            >
              LJ is a French creative studio based in Paris with an exclusive focus on the sports sector. Driven by a profound passion of sports and the emotion they provide, our studio prides itself on capturing and translating that into captivating visual narratives.
              <br></br>
              <br></br>
              From digital branding to creative direction, motion, print layouts and graphic creation, we offer a wide spectrum of services.               
            </motion.p>
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
        {/* <Projects projects={projects} /> */}
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
