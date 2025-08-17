

import styles from "../layout.module.scss";
import Navbar from "../navbar";
import Image from "next/image";
import utilStyles from "../../styles/utils.module.css";
import Link from "next/link";
import {Clock} from "../clock";

export function Header() {
    return (
        <header className={`${styles.header} intersectLogo header` }>
            (
                <>
                    <Navbar/>
                    <h1 className={`${styles.mainTitle} text-[30vw] sm:text-[158px] top-[45%] md:top-[inherit] mainContainer`}>
                        <p>LJ STUDIO</p>
                        <p>WELCOME ON</p>
                        <div className='flex h-full'>
                                <span className=''>
                                    <p>OUR PITCH</p>
                                    <p>OUR GAME</p>
                                    <p>OUR CRAFT</p>
                                    <p>BOARD</p>
                                    <p>OUR PITCH</p>
                                </span>
                        </div>
                    </h1>
                    <div className={styles.currentInfoContainer}><div><Clock/></div></div>
                    {/* <div className={`${styles.currentInfoContainer} font-light`}><div>GAME TIME : 17:47:22 UTC+2</div></div> */}
                    <div className={styles.headimg}>
                        <Image
                            src="/images/HEADER.webp"
                            alt="Footbal Cover Design"
                            fill={true}
                            quality={100}
                            style={{
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                    <div className={styles.tiltedContainer}>
                        <div className={styles.tiltedDiv1}></div>
                        <div className={styles.tiltedDiv2}></div>
                        <div className={styles.tiltedDiv3}></div>
                    </div>
                    <div className={styles.imgBottom}></div>
                </>
            )
        </header>
    )
}