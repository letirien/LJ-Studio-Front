import Head from 'next/head';
import styles from './layout.module.scss';
import utilStyles from '../styles/utils.module.css';
import Link from 'next/link';
import Navbar from './navbar';
import Image from 'next/image';
import { motion, useScroll } from 'framer-motion';
import AnimateText from '../lib/animation/animationText';
import dynamic from 'next/dynamic';
import Footer from './footer';
import AnimationPage from './home/HelloAnimation';
import { useState } from 'react';

// Importer dynamiquement le Clock sans rendu côté serveur
const Clock = dynamic(() => import('../components/clock').then(mod => mod.Clock), {
  ssr: false,
});

export default function Layout({ children, home }) {
  const words = ["OUR PITCH", "OUR GAME", "OUR CRAFT", "BOARD"];
  const [animationComplete, setAnimationComplete] = useState(false);

  return (
    <div className="relative min-h-screen">
      <Head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="description" content="LJ Studio" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>

      <div className="relative">
        {/* Contenu principal, toujours visible */}
        <main className="relative z-0">
          {children}
          <Footer />
        </main>

        {/* Animation d'introduction par-dessus */}
        {!animationComplete && (
          <AnimationPage onAnimationComplete={() => setAnimationComplete(true)} />
        )}
      </div>
    </div>
  );
}