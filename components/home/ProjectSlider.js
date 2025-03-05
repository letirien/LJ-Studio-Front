'use client'

import React, { useRef, useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import home from "../../styles/home.module.scss"
import Section from './Section.js'
import {
    fadeInRight,
    fadeInUp,
    fadeInLeft
  } from "../../lib/animation/variant";


const variants = {
  hide: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
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

const Projects = ({ projects }) => {
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
      imgRef.current.style.transition = "transform 1s cubic-bezier(0.23, 1, 0.32, 1)";
      imgRef.current.style.transform = `scale(1.05)`;
      setIsHovered(true);
    };
  
    const handleMouseLeave = () => {
      setIsHovered(false);
      setAnimImg(null);
      imgRef.current.style.transition = "transform 1s cubic-bezier(0.23, 1, 0.32, 1)";
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
        <div>
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
        </div>
      </div>
    );
  }

export default Projects;