import '../styles/global.css';
import {AnimatePresence} from 'framer-motion'

export default function App({ Component, pageProps }) {
  return (
    <>
    <AnimatePresence mode="wait" initial="false">
      
      <Component {...pageProps} />
    </AnimatePresence>
      
    </>
  );
}