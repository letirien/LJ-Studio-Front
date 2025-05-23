import Head from 'next/head'
import styles from './layout.module.scss'
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
export const siteTitle = 'LJ Studio';
import Navbar from './navbar';
import Image from 'next/image'
import {motion} from 'framer-motion'
import AnimateText from '../lib/animation/animationText';
import dynamic from 'next/dynamic'
import Footer from './footer';

// Importer dynamiquement le Clock sans rendu côté serveur
const Clock = dynamic(() => import('../components/clock').then(mod => mod.Clock), {
  ssr: false
});

export default function Layout({ children, home }) {
    const words = ["OUR PITCH", "OUR GAME", "OUR CRAFT", "BOARD"];

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
                <motion.div className={utilStyles.in} initial={{scaleY: 0.5}} animate={{scaleY: 0}} exit={{scaleY: 0}} transition={{duration: 1.8, ease:[0.22, 1, 0.36, 1]}}/>
                <motion.div className={utilStyles.out} initial={{scaleY:  0.5}} animate={{scaleY: 0}} exit={{scaleY: 0}} transition={{duration: 1.8, ease:[0.22, 1, 0.36, 1]}}/>
                <main className="rounded-md" style={{flex: 1}}>
                    {children}
                </main>
                <Footer/>
            </motion.div>
        </div>
    )
  }