import { useEffect, useState } from "react";
import Link from "next/link";
import Layout from "../../components/layout";
import Head from "next/head";
import RoundedIcon from "../../components/RoundedIcon";
import AppearText from "../../components/AppearText";

export default function Custom404() {
  const [wordmarkVisible, setWordmarkVisible] = useState(false);
  const [contentVisible, setContentVisible] = useState(false);
  const [iconVisible, setIconVisible] = useState(false);
  const [linkVisible, setLinkVisible] = useState(false);

  useEffect(() => {
    // Stage 1: Wordmark letters
    const t1 = setTimeout(() => setWordmarkVisible(true), 150);
    // Stage 2: 404 + phrase
    const t2 = setTimeout(() => setContentVisible(true), 600);
    // Stage 3: RoundedIcon
    const t3 = setTimeout(() => setIconVisible(true), 1000);
    // Stage 4: Link
    const t4 = setTimeout(() => setLinkVisible(true), 1200);

    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); clearTimeout(t4); };
  }, []);

  return (
    <Layout skipIntro>
      <Head>
        <title>404 — LJ Studio</title>
      </Head>

      <div className="bg-black text-white h-screen flex items-center justify-center relative overflow-hidden">
        <div className="flex flex-col items-center">
          <div className="flex gap-8 items-center mb-12">
            <svg
              viewBox="0 0 689.83765 89.09131"
              className="w-[60vw] sm:w-[400px] h-auto"
            >
              {/* L */}
              <g className="overflow-hidden">
                <polygon
                  className={`transform transition-all duration-300 ease-[cubic-bezier(0.12,0,0.88,1)] ${wordmarkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[2deg]'}`}
                  style={{ transitionDelay: '0ms' }}
                  fill="white"
                  points="19.66699 0 0 0 0 69.18579 19.84973 89.05493 101.63208 89.05493 101.63208 68.47412 19.66699 68.47412 19.66699 0"
                />
              </g>
              {/* J */}
              <g className="overflow-hidden">
                <polygon
                  className={`transform transition-all duration-300 ease-[cubic-bezier(0.12,0,0.88,1)] ${wordmarkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[2deg]'}`}
                  style={{ transitionDelay: '80ms' }}
                  fill="white"
                  points="209.05078 .00757 127.05737 .00757 127.05737 19.66504 209.05078 19.66504 209.05078 69.43115 127.05737 69.43115 127.05737 53.62988 107.39038 53.62988 107.39038 69.67139 127.39429 88.96338 208.83984 89.08838 228.71777 69.19067 228.71777 .00488 209.05078 .00488 209.05078 .00757"
                />
              </g>
              {/* S */}
              <g className="overflow-hidden">
                <polygon
                  className={`transform transition-all duration-300 ease-[cubic-bezier(0.12,0,0.88,1)] ${wordmarkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[2deg]'}`}
                  style={{ transitionDelay: '160ms' }}
                  fill="white"
                  points="375.49048 .00757 279.49731 .00757 255.33569 19.91821 255.34448 32.85107 278.88379 53.2583 366.87598 53.2583 366.87598 69.68018 256.49829 69.68018 256.49829 89.08838 366.56909 89.08838 390.20654 69.68286 390.20654 53.2583 365.95557 32.85107 279.19067 32.85107 279.19067 19.91064 375.49048 19.91064 375.49048 19.91553 427.55469 19.91553 427.55469 89.08838 452.07568 89.08838 452.07568 19.91553 506.27734 19.91553 506.27734 .00757 382.20483 .00757 375.49048 .00757"
                />
              </g>
              {/* T */}
              <g className="overflow-hidden">
                <path
                  className={`transform transition-all duration-300 ease-[cubic-bezier(0.12,0,0.88,1)] ${wordmarkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[2deg]'}`}
                  style={{ transitionDelay: '240ms' }}
                  fill="white"
                  d="M639.06226.0105h-123.96802v89.08081h123.96802l24.88232-19.40845-.15991-49.76465L639.06226.0105ZM639.37183,69.68286h-99.12573V19.91821h99.12573v49.76465Z"
                />
              </g>
              {/* D */}
              <g className="overflow-hidden">
                <rect
                  className={`transform transition-all duration-300 ease-[cubic-bezier(0.12,0,0.88,1)] ${wordmarkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[2deg]'}`}
                  style={{ transitionDelay: '320ms' }}
                  fill="white"
                  x="670.4292" y="69.67993" width="19.40845" height="19.40845"
                />
              </g>
            </svg>

            {/* 404 */}
            <div className="overflow-hidden">
              <p
                className={`text-[68px] hardbopBlack leading-[0.9] transform transition-all duration-500 ease-[cubic-bezier(0.12,0,0.88,1)] ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[1deg]'}`}
              >
                404
              </p>
            </div>
          </div>

          {/* Phrase */}
          <div className="overflow-hidden mb-8">
            <p
              className={`instrumentSerifRegular text-[5vw] sm:text-[24px] capitalize transform transition-all duration-700 ease-[cubic-bezier(0.12,0,0.88,1)] ${contentVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 rotate-[1deg]'}`}
              style={{ transitionDelay: contentVisible ? '120ms' : '0ms' }}
            >
              This page left the pitch
            </p>
          </div>

          {/* RoundedIcon */}
          <div
            className={`mb-10 transform transition-all duration-400 ease-[cubic-bezier(0.12,0,0.88,1)] ${iconVisible ? 'scale-100 opacity-100' : 'scale-0 opacity-0'}`}
          >
            <RoundedIcon icon="intro" size={90} circularContinue color="white" />
          </div>

          {/* Go back home link */}
          <div className="overflow-hidden">
            <a
              href="/"
              className={`inline-block robotoRegular text-[12px] sm:text-[14px] uppercase tracking-widest border-b border-white pb-1 transform transition-all duration-700 ease-[cubic-bezier(0.12,0,0.88,1)] hover:opacity-60 ${linkVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'}`}
            >
              <AppearText type="words" hover={true}>
                Back to home
              </AppearText>
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
}
