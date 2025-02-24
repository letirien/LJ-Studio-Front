import Head from 'next/head'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
export const siteTitle = 'LJ Studio';
import Navbar from './navbar';
import Image from 'next/image'
import {motion} from 'framer-motion'
import AnimateText from '../lib/animation/animationText';



export default function Layout({ children, home }) {
    return (
        <div>
            <Head>
                <link rel="icon" href="/favicon.ico" />
                <meta
                name="description"
                content="LJ Studio"
                />
                <meta
                property="og:image"
                content={`https://og-image.vercel.app/${encodeURI(
                    siteTitle,
                )}.png?theme=light&md=0&fontSize=75px&images=https%3A%2F%2Fassets.vercel.com%2Fimage%2Fupload%2Ffront%2Fassets%2Fdesign%2Fnextjs-black-logo.svg`}
                />
                <meta name="og:title" content={siteTitle} />
                <meta name="twitter:card" content="summary_large_image" />
            </Head>
            <motion.div>
                <header className={`${styles.header} intersectLogo header` }>
                    {home ? (
                    <>
                        <Navbar/>
                        <h1 className={`${styles.mainTitle} ${styles.container}`}>
                            <p>LJ STUDIO</p>
                            <p>WELCOME ON</p>
                            <p>OUR PITCH</p>
                        </h1>
                        {/* <h1 className={styles.mainTitle}>
                            <AnimateText once={true}>
                                <div className="reveal-container">
                                    <p>Turning <span>Sports</span> </p>
                                </div>
                                <div className="reveal-container">
                                    <p>Passion into </p>
                                </div>
                                <div className="reveal-container">
                                    <p><span>Art</span>istic Expression</p>
                                </div>
                            </AnimateText>
                        </h1> */}
                        
                        {/* <div className={styles.currentInfoContainer}><div><Clock/></div></div> */}
                        <div className={styles.currentInfoContainer}><div>french creative studio   |   17:47:22 UTC+2</div></div>
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
                    </>
                    ) : (
                    <>
                        <h1 className={utilStyles.heading2Xl}>Template Other Page</h1>
                        <Link href="/">
                            Go Back Home
                        </Link>
                    </>
                    )}
                </header>
                <motion.div className={utilStyles.in} initial={{scaleY: 0.5}} animate={{scaleY: 0}} exit={{scaleY: 0}} transition={{duration: 1.8, ease:[0.22, 1, 0.36, 1]}}/>
                <motion.div className={utilStyles.out} initial={{scaleY:  0.5}} animate={{scaleY: 0}} exit={{scaleY: 0}} transition={{duration: 1.8, ease:[0.22, 1, 0.36, 1]}}/>
                <main style={{flex: 1}}>
                    {children}
                </main>
                <footer>
                </footer>
            </motion.div>
        </div>
    )
  }