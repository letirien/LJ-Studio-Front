import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
// Lettres en pixel art (5x5 chacune)
const letters = {
  P: [
    [1,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,0],
    [1,0,0,0,0],
    [1,0,0,0,0]
  ],
  L: [
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,0,0,0,0],
    [1,1,1,1,1]
  ],
  A: [
    [0,1,1,1,0],
    [1,0,0,0,1],
    [1,1,1,1,1],
    [1,0,0,0,1],
    [1,0,0,0,1]
  ],
  Y: [
    [1,0,0,0,1],
    [1,0,0,0,1],
    [0,1,1,1,0],
    [0,0,1,0,0],
    [0,0,1,0,0]
  ]
};

// Génère la grille 10x10 avec le texte PLAY décalé
function createPlayTextGrid(offset) {
  const grid = Array(10).fill(0).map(() => Array(10).fill(0));
  const word = ['P', 'L', 'A', 'Y'];
  const letterWidth = 6;
  const startCol = 10 - offset;

  word.forEach((letter, letterIndex) => {
    const letterPattern = letters[letter];
    const letterStartCol = startCol + (letterIndex * letterWidth);

    for (let row = 0; row < 5; row++) {
      for (let col = 0; col < 5; col++) {
        const gridRow = row + 3;
        const gridCol = letterStartCol + col;

        if (gridRow >= 0 && gridRow < 10 && gridCol >= 0 && gridCol < 10) {
          if (letterPattern[row][col] === 1) grid[gridRow][gridCol] = 1;
        }
      }
    }
  });

  return grid;
}


export default function PixelPlayIcon({ size = 80, onClick }) {
  const [phase, setPhase] = useState('idle');
  const [scrollOffset, setScrollOffset] = useState(0);
  const [rainProgress, setRainProgress] = useState(0); // 0 to 1
  const [rainDirection, setRainDirection] = useState('toBlack'); // 'toBlack' or 'toWhite'
  const isHoveredRef = useRef(false);
  const circularSrc = "/images/roundedSVG/CIRCULAR_TXT.svg";

  const circularStyle = {
    position: "absolute",
    width: "250%",
    height: "250%",
    inset: "-75%",
    // transform: `rotate(${90}deg)`,
    transformOrigin: "50% 50%",
    willChange: "transform",
    animation: "spin 20s linear infinite",
    filter: "invert(1)"
  };

  const [colors, setColors] = useState({
    background: '#ec591f',
    square: '#ffffff',
    border: '#000000',
    play: '#000000',
  });

  const animationRef = useRef(null);
  const isUnmountedRef = useRef(false);

  const defaultColors = {
    background: '#ec591f',
    square: '#ffffff',
    border: '#000000',
    play: '#000000',
  };

  const invertedColors = {
    background: '#ec591f',
    square: '#000000',
    border: '#000000',
    play: '#ffffff',
  };

  const sleepInterruptible = async (ms) => {
    const step = 50;
    let elapsed = 0;

    while (elapsed < ms) {
      if (isUnmountedRef.current) return 'abort';

      // pause douce
      while (isHoveredRef.current) {
        await new Promise(resolve => setTimeout(resolve, 100));
        if (isUnmountedRef.current) return 'abort';
      }

      await new Promise(resolve => {
        animationRef.current = setTimeout(resolve, step);
      });

      elapsed += step;
    }

    return 'ok';
  };

  // Configuration de la grille de pixels pour l'effet pluie
  const pixelUnit = 1.57;
  const gridStartX = 8;
  const gridEndX = 68;
  const gridStartY = 5.8;
  const gridEndY = 70;
  const numCols = Math.ceil((gridEndX - gridStartX) / pixelUnit);
  const numRows = Math.ceil((gridEndY - gridStartY) / pixelUnit);

  const runAnimation = async () => {
    while (!isUnmountedRef.current) {

      if (isHoveredRef.current) {
        await new Promise(resolve => {
          animationRef.current = setTimeout(resolve, 100);
        });
        continue;
      }
      // Phase 1: Idle (2s)
      setPhase('idle');
      setColors(defaultColors);
      setRainProgress(0);
      if (!(await sleepInterruptible(2000))) continue;
      if (isUnmountedRef.current) break;

      // Phase 2: Clignotement rapide (inversion couleurs)
      setPhase('blink');
      for (let i = 0; i < 8; i++) {
        if (isUnmountedRef.current) break;
        setColors(prev =>
          prev.square === '#ffffff' ? invertedColors : defaultColors
        );
      if (!(await sleepInterruptible(150))) continue;
      }
      setColors(defaultColors);
      if (isUnmountedRef.current) break;

      // Phase 3: Transition pluie vers noir
      setPhase('rain');
      setRainDirection('toBlack');
      for (let i = 0; i <= numRows; i++) {
        if (isUnmountedRef.current) break;
        setRainProgress(i);
        if (!(await sleepInterruptible(20))) continue;

      }
      if (isUnmountedRef.current) break;

      if (!(await sleepInterruptible(150))) continue;


      // Phase 4: Scroll du texte PLAY
      setPhase('scroll');
      const totalWidth = 4 * 6;
      for (let offset = 0; offset <= 10 + totalWidth; offset++) {
        if (isUnmountedRef.current) break;
        setScrollOffset(offset);
        if (!(await sleepInterruptible(70))) continue;

      }
      if (isUnmountedRef.current) break;

      if (!(await sleepInterruptible(200))) continue;


      // Phase 5: Clignotement
      setPhase('blink');
      for (let i = 0; i < 4; i++) {
        if (isUnmountedRef.current) break;
        setColors(prev =>
          prev.square === '#000000'
            ? { ...defaultColors, square: '#ffffff', play: '#ffffff' }
            : { ...defaultColors, square: '#000000', play: '#000000' }
        );
      if (!(await sleepInterruptible(120))) continue;

      }
      if (isUnmountedRef.current) break;

      // Phase 6: Transition pluie retour vers blanc
      setPhase('rain');
      setRainDirection('toWhite');
      for (let i = 0; i <= numRows; i++) {
        if (isUnmountedRef.current) break;
        setRainProgress(i);
      if (!(await sleepInterruptible(20))) continue;
      }
      setColors(defaultColors);
      if (isUnmountedRef.current) break;

      // Phase 7: Pulse scale
      setPhase('pulse');
      if (!(await sleepInterruptible(500))) continue;
      if (isUnmountedRef.current) break;

      // Retour idle
      setPhase('idle');
      setRainProgress(0);
       if (!(await sleepInterruptible(800))) continue;

    }
  };

  useEffect(() => {
    isUnmountedRef.current = false;
    runAnimation();

    return () => {
      isUnmountedRef.current = true;
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, []);

  const scale = phase === 'pulse' ? 1.12 : 1;
  const showScrollText = phase === 'scroll';
  const showRain = phase === 'rain';
  const textGrid = showScrollText ? createPlayTextGrid(scrollOffset) : null;

  // Dimensions pour la grille de pixels du texte PLAY
  const textPixelSize = 48 / 10;
  const textGridOffset = 14;

  // Générer les pixels pour l'effet pluie avec un ordre aléatoire
  const generateRainPixels = () => {
    const pixels = [];
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        const x = gridStartX + col * pixelUnit;
        const y = gridStartY + row * pixelUnit;
        // Ajouter un décalage aléatoire pour chaque pixel (entre -3 et +5 rows)
        const randomOffset = Math.random() * 8 - 3;
        const appearAt = row + randomOffset;
        pixels.push({ x, y, row, col, appearAt });
      }
    }
    return pixels;
  };
  // Mémoriser les pixels pour éviter de régénérer à chaque render
  const rainPixelsRef = useRef(null);
  if (!rainPixelsRef.current) {
    rainPixelsRef.current = generateRainPixels();
  }
  const rainPixels = rainPixelsRef.current;

  return (
    <button
      type="button"
      onClick={onClick}
      className="relative cursor-pointer bg-transparent border-none p-0 group"
      style={{ outline: 'none', pointerEvents: 'auto' }}
      onMouseEnter={() => { isHoveredRef.current = true; }}
      onMouseLeave={() => { isHoveredRef.current = false; }}
    >
      <svg
        width={size}
        height={size}
        viewBox="0 0 75.65179 75.65179"
        xmlns="http://www.w3.org/2000/svg"
        pointerEvents="none"
        shapeRendering="crispEdges"
        style={{
          transition: phase === 'blink' ? 'transform 0.08s' : 'transform 0.3s ease-out',
          transform: `scale(${scale})`,
        }}
        className="group-hover:scale-110 transition-transform duration-300"
      >
        <defs>
          {/* Clip path basé sur la forme originale du carré pixel art */}
          <clipPath id="squareClip">
            <polygon points="67.5159 13.60592 67.5159 65.16592 65.9559 65.16592 65.9559 66.73587 64.38589 66.73587 64.38589 68.29586 61.2659 68.29586 61.2659 69.85592 19.07589 69.85592 19.07589 68.29586 15.9559 68.29586 15.9559 66.73587 14.38589 66.73587 14.38589 65.16592 12.82589 65.16592 12.82589 63.60592 11.2659 63.60592 11.2659 62.04586 9.7059 62.04586 9.7059 60.48587 8.13589 60.48587 8.13589 12.04586 9.7059 12.04586 9.7059 10.48587 11.2659 10.48587 11.2659 8.91592 12.82589 8.91592 12.82589 7.35592 15.9559 7.35592 15.9559 5.79586 58.13589 5.79586 58.13589 7.35592 61.2659 7.35592 61.2659 8.91592 62.82589 8.91592 62.82589 10.48587 64.38589 10.48587 64.38589 12.04586 65.9559 12.04586 65.9559 13.60592 67.5159 13.60592" />
          </clipPath>
          {/* Clip path dynamique pour la progression de la pluie (zone déjà colorisée) */}
          <clipPath id="rainProgressClip">
            <rect x="0" y="0" width="100" height={gridStartY + (rainProgress * pixelUnit)} />
          </clipPath>
        </defs>

        {/* Fond orange rotaté */}
        <rect
          x="4.38062"
          y="4.38062"
          width="66.89055"
          height="66.89055"
          rx="12.13433"
          ry="12.13433"
          transform="translate(-7.77046 9.85146) rotate(-13.46991)"
          fill={colors.background}
          style={{ transition: phase === 'blink' ? 'fill 0.08s' : 'fill 0.15s ease-out' }}
        />

        {/* === AFFICHAGE NORMAL (idle, blink, pulse) === */}
        {!showScrollText && !showRain && (
          <g>
            {/* Carré blanc arrondi (fond) */}
            <polygon
              points="67.5159 13.60592 67.5159 65.16592 65.9559 65.16592 65.9559 66.73587 64.38589 66.73587 64.38589 68.29586 61.2659 68.29586 61.2659 69.85592 19.07589 69.85592 19.07589 68.29586 15.9559 68.29586 15.9559 66.73587 14.38589 66.73587 14.38589 65.16592 12.82589 65.16592 12.82589 63.60592 11.2659 63.60592 11.2659 62.04586 9.7059 62.04586 9.7059 60.48587 8.13589 60.48587 8.13589 12.04586 9.7059 12.04586 9.7059 10.48587 11.2659 10.48587 11.2659 8.91592 12.82589 8.91592 12.82589 7.35592 15.9559 7.35592 15.9559 5.79586 58.13589 5.79586 58.13589 7.35592 61.2659 7.35592 61.2659 8.91592 62.82589 8.91592 62.82589 10.48587 64.38589 10.48587 64.38589 12.04586 65.9559 12.04586 65.9559 13.60592 67.5159 13.60592"
              fill={colors.square}
              style={{ transition: phase === 'blink' ? 'fill 0.08s' : 'fill 0.15s ease-out' }}
            />

            {/* Contour noir pixel art */}
            <path
              d="M6.57589,15.16592v42.19h1.56V15.16592h-1.56ZM8.13589,12.04586v3.12006h1.57001v-3.12006h-1.57001ZM8.13589,57.35592v3.12994h1.57001v-3.12994h-1.57001ZM9.7059,10.48587v1.56h1.56v-1.56h-1.56ZM9.7059,60.48587v1.56h1.56v-1.56h-1.56ZM11.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM11.2659,62.04586v1.56006h1.56v-1.56006h-1.56ZM12.82589,7.35592v1.56h3.13v-1.56h-3.13ZM15.9559,5.79586v1.56006h42.17999v-1.56006H15.9559ZM58.13589,7.35592v1.56h3.13v-1.56h-3.13ZM61.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM62.82589,10.48587v1.56h1.56v-1.56h-1.56ZM69.07589,18.29586v-3.12994h-1.56v-1.56h-1.56v-1.56006h-1.57001v3.12006h1.57001v42.19h-1.57001v3.12994h-1.56v1.56h-1.56v1.56006h-3.13v1.56H15.9559v-1.56h-3.13v1.56h1.56v1.56995h1.57001v1.56h3.12v1.56006h42.19v-1.56006h3.12v-1.56h1.57001v-1.56995h1.56v-1.56h1.56v-3.12006h1.56V18.29586h-1.56Z"
              fill={colors.border}
              fillRule="evenodd"
              style={{ transition: phase === 'blink' ? 'fill 0.08s' : 'fill 0.15s ease-out' }}
            />

            {/* Triangle Play */}
            <polygon
              points="25.32589 51.10592 28.4559 51.10592 28.4559 49.54586 31.57589 49.54586 31.57589 47.98587 34.7059 47.98587 34.7059 46.41592 37.82589 46.41592 37.82589 44.85592 40.9559 44.85592 40.9559 43.29586 44.07589 43.29586 44.07589 41.73587 47.2059 41.73587 47.2059 40.16592 50.32589 40.16592 50.32589 38.60592 53.4559 38.60592 53.4559 37.04586 55.0159 37.04586 55.0159 35.48587 53.4559 35.48587 53.4559 33.91592 50.32589 33.91592 50.32589 32.35592 47.2059 32.35592 47.2059 30.79586 44.07589 30.79586 44.07589 29.23587 40.9559 29.23587 40.9559 27.66592 37.82589 27.66592 37.82589 26.10592 34.7059 26.10592 34.7059 24.54586 31.57589 24.54586 31.57589 22.98587 28.4559 22.98587 28.4559 21.41592 25.32589 21.41592 25.32589 19.85592 20.63589 19.85592 20.63589 52.66592 25.32589 52.66592 25.32589 51.10592"
              fill={colors.play}
              fillRule="evenodd"
              style={{ transition: phase === 'blink' ? 'fill 0.08s' : 'fill 0.15s ease-out' }}
            />
          </g>
        )}

        {/* === EFFET PLUIE PIXEL PAR PIXEL === */}
        {showRain && (
          <g>
            {rainDirection === 'toBlack' ? (
              <>
                {/* Fond blanc de base */}
                <polygon
                  points="67.5159 13.60592 67.5159 65.16592 65.9559 65.16592 65.9559 66.73587 64.38589 66.73587 64.38589 68.29586 61.2659 68.29586 61.2659 69.85592 19.07589 69.85592 19.07589 68.29586 15.9559 68.29586 15.9559 66.73587 14.38589 66.73587 14.38589 65.16592 12.82589 65.16592 12.82589 63.60592 11.2659 63.60592 11.2659 62.04586 9.7059 62.04586 9.7059 60.48587 8.13589 60.48587 8.13589 12.04586 9.7059 12.04586 9.7059 10.48587 11.2659 10.48587 11.2659 8.91592 12.82589 8.91592 12.82589 7.35592 15.9559 7.35592 15.9559 5.79586 58.13589 5.79586 58.13589 7.35592 61.2659 7.35592 61.2659 8.91592 62.82589 8.91592 62.82589 10.48587 64.38589 10.48587 64.38589 12.04586 65.9559 12.04586 65.9559 13.60592 67.5159 13.60592"
                  fill="#ffffff"
                />
                {/* Play icon noir sur fond blanc */}
                <polygon
                  points="25.32589 51.10592 28.4559 51.10592 28.4559 49.54586 31.57589 49.54586 31.57589 47.98587 34.7059 47.98587 34.7059 46.41592 37.82589 46.41592 37.82589 44.85592 40.9559 44.85592 40.9559 43.29586 44.07589 43.29586 44.07589 41.73587 47.2059 41.73587 47.2059 40.16592 50.32589 40.16592 50.32589 38.60592 53.4559 38.60592 53.4559 37.04586 55.0159 37.04586 55.0159 35.48587 53.4559 35.48587 53.4559 33.91592 50.32589 33.91592 50.32589 32.35592 47.2059 32.35592 47.2059 30.79586 44.07589 30.79586 44.07589 29.23587 40.9559 29.23587 40.9559 27.66592 37.82589 27.66592 37.82589 26.10592 34.7059 26.10592 34.7059 24.54586 31.57589 24.54586 31.57589 22.98587 28.4559 22.98587 28.4559 21.41592 25.32589 21.41592 25.32589 19.85592 20.63589 19.85592 20.63589 52.66592 25.32589 52.66592 25.32589 51.10592"
                  fill="#000000"
                  fillRule="evenodd"
                />
                {/* Pixels noirs qui apparaissent du haut vers le bas (aléatoire) */}
                <g clipPath="url(#squareClip)">
                  {rainPixels.map((pixel, idx) => {
                    const showPixel = pixel.appearAt < rainProgress;
                    if (!showPixel) return null;
                    return (
                      <rect
                        key={`rain-${idx}`}
                        x={pixel.x}
                        y={pixel.y}
                        width={pixelUnit}
                        height={pixelUnit}
                        fill="#000000"
                      />
                    );
                  })}
                </g>
                {/* Play icon blanc sur la zone noire (clippé) */}
                <g clipPath="url(#rainProgressClip)">
                  <polygon
                    points="25.32589 51.10592 28.4559 51.10592 28.4559 49.54586 31.57589 49.54586 31.57589 47.98587 34.7059 47.98587 34.7059 46.41592 37.82589 46.41592 37.82589 44.85592 40.9559 44.85592 40.9559 43.29586 44.07589 43.29586 44.07589 41.73587 47.2059 41.73587 47.2059 40.16592 50.32589 40.16592 50.32589 38.60592 53.4559 38.60592 53.4559 37.04586 55.0159 37.04586 55.0159 35.48587 53.4559 35.48587 53.4559 33.91592 50.32589 33.91592 50.32589 32.35592 47.2059 32.35592 47.2059 30.79586 44.07589 30.79586 44.07589 29.23587 40.9559 29.23587 40.9559 27.66592 37.82589 27.66592 37.82589 26.10592 34.7059 26.10592 34.7059 24.54586 31.57589 24.54586 31.57589 22.98587 28.4559 22.98587 28.4559 21.41592 25.32589 21.41592 25.32589 19.85592 20.63589 19.85592 20.63589 52.66592 25.32589 52.66592 25.32589 51.10592"
                    fill="#ffffff"
                    fillRule="evenodd"
                  />
                </g>
                {/* Contour noir */}
                <path
                  d="M6.57589,15.16592v42.19h1.56V15.16592h-1.56ZM8.13589,12.04586v3.12006h1.57001v-3.12006h-1.57001ZM8.13589,57.35592v3.12994h1.57001v-3.12994h-1.57001ZM9.7059,10.48587v1.56h1.56v-1.56h-1.56ZM9.7059,60.48587v1.56h1.56v-1.56h-1.56ZM11.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM11.2659,62.04586v1.56006h1.56v-1.56006h-1.56ZM12.82589,7.35592v1.56h3.13v-1.56h-3.13ZM15.9559,5.79586v1.56006h42.17999v-1.56006H15.9559ZM58.13589,7.35592v1.56h3.13v-1.56h-3.13ZM61.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM62.82589,10.48587v1.56h1.56v-1.56h-1.56ZM69.07589,18.29586v-3.12994h-1.56v-1.56h-1.56v-1.56006h-1.57001v3.12006h1.57001v42.19h-1.57001v3.12994h-1.56v1.56h-1.56v1.56006h-3.13v1.56H15.9559v-1.56h-3.13v1.56h1.56v1.56995h1.57001v1.56h3.12v1.56006h42.19v-1.56006h3.12v-1.56h1.57001v-1.56995h1.56v-1.56h1.56v-3.12006h1.56V18.29586h-1.56Z"
                  fill="#000000"
                  fillRule="evenodd"
                />
              </>
            ) : (
              <>
                {/* Fond noir de base */}
                <polygon
                  points="67.5159 13.60592 67.5159 65.16592 65.9559 65.16592 65.9559 66.73587 64.38589 66.73587 64.38589 68.29586 61.2659 68.29586 61.2659 69.85592 19.07589 69.85592 19.07589 68.29586 15.9559 68.29586 15.9559 66.73587 14.38589 66.73587 14.38589 65.16592 12.82589 65.16592 12.82589 63.60592 11.2659 63.60592 11.2659 62.04586 9.7059 62.04586 9.7059 60.48587 8.13589 60.48587 8.13589 12.04586 9.7059 12.04586 9.7059 10.48587 11.2659 10.48587 11.2659 8.91592 12.82589 8.91592 12.82589 7.35592 15.9559 7.35592 15.9559 5.79586 58.13589 5.79586 58.13589 7.35592 61.2659 7.35592 61.2659 8.91592 62.82589 8.91592 62.82589 10.48587 64.38589 10.48587 64.38589 12.04586 65.9559 12.04586 65.9559 13.60592 67.5159 13.60592"
                  fill="#000000"
                />
                {/* Play icon blanc sur fond noir */}
                <polygon
                  points="25.32589 51.10592 28.4559 51.10592 28.4559 49.54586 31.57589 49.54586 31.57589 47.98587 34.7059 47.98587 34.7059 46.41592 37.82589 46.41592 37.82589 44.85592 40.9559 44.85592 40.9559 43.29586 44.07589 43.29586 44.07589 41.73587 47.2059 41.73587 47.2059 40.16592 50.32589 40.16592 50.32589 38.60592 53.4559 38.60592 53.4559 37.04586 55.0159 37.04586 55.0159 35.48587 53.4559 35.48587 53.4559 33.91592 50.32589 33.91592 50.32589 32.35592 47.2059 32.35592 47.2059 30.79586 44.07589 30.79586 44.07589 29.23587 40.9559 29.23587 40.9559 27.66592 37.82589 27.66592 37.82589 26.10592 34.7059 26.10592 34.7059 24.54586 31.57589 24.54586 31.57589 22.98587 28.4559 22.98587 28.4559 21.41592 25.32589 21.41592 25.32589 19.85592 20.63589 19.85592 20.63589 52.66592 25.32589 52.66592 25.32589 51.10592"
                  fill="#ffffff"
                  fillRule="evenodd"
                />
                {/* Pixels blancs qui apparaissent du haut vers le bas (aléatoire) */}
                <g clipPath="url(#squareClip)">
                  {rainPixels.map((pixel, idx) => {
                    const showPixel = pixel.appearAt < rainProgress;
                    if (!showPixel) return null;
                    return (
                      <rect
                        key={`rain-${idx}`}
                        x={pixel.x}
                        y={pixel.y}
                        width={pixelUnit}
                        height={pixelUnit}
                        fill="#ffffff"
                      />
                    );
                  })}
                </g>
                {/* Play icon noir sur la zone blanche (clippé) */}
                <g clipPath="url(#rainProgressClip)">
                  <polygon
                    points="25.32589 51.10592 28.4559 51.10592 28.4559 49.54586 31.57589 49.54586 31.57589 47.98587 34.7059 47.98587 34.7059 46.41592 37.82589 46.41592 37.82589 44.85592 40.9559 44.85592 40.9559 43.29586 44.07589 43.29586 44.07589 41.73587 47.2059 41.73587 47.2059 40.16592 50.32589 40.16592 50.32589 38.60592 53.4559 38.60592 53.4559 37.04586 55.0159 37.04586 55.0159 35.48587 53.4559 35.48587 53.4559 33.91592 50.32589 33.91592 50.32589 32.35592 47.2059 32.35592 47.2059 30.79586 44.07589 30.79586 44.07589 29.23587 40.9559 29.23587 40.9559 27.66592 37.82589 27.66592 37.82589 26.10592 34.7059 26.10592 34.7059 24.54586 31.57589 24.54586 31.57589 22.98587 28.4559 22.98587 28.4559 21.41592 25.32589 21.41592 25.32589 19.85592 20.63589 19.85592 20.63589 52.66592 25.32589 52.66592 25.32589 51.10592"
                    fill="#000000"
                    fillRule="evenodd"
                  />
                </g>
                {/* Contour noir */}
                <path
                  d="M6.57589,15.16592v42.19h1.56V15.16592h-1.56ZM8.13589,12.04586v3.12006h1.57001v-3.12006h-1.57001ZM8.13589,57.35592v3.12994h1.57001v-3.12994h-1.57001ZM9.7059,10.48587v1.56h1.56v-1.56h-1.56ZM9.7059,60.48587v1.56h1.56v-1.56h-1.56ZM11.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM11.2659,62.04586v1.56006h1.56v-1.56006h-1.56ZM12.82589,7.35592v1.56h3.13v-1.56h-3.13ZM15.9559,5.79586v1.56006h42.17999v-1.56006H15.9559ZM58.13589,7.35592v1.56h3.13v-1.56h-3.13ZM61.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM62.82589,10.48587v1.56h1.56v-1.56h-1.56ZM69.07589,18.29586v-3.12994h-1.56v-1.56h-1.56v-1.56006h-1.57001v3.12006h1.57001v42.19h-1.57001v3.12994h-1.56v1.56h-1.56v1.56006h-3.13v1.56H15.9559v-1.56h-3.13v1.56h1.56v1.56995h1.57001v1.56h3.12v1.56006h42.19v-1.56006h3.12v-1.56h1.57001v-1.56995h1.56v-1.56h1.56v-3.12006h1.56V18.29586h-1.56Z"
                  fill="#000000"
                  fillRule="evenodd"
                />
              </>
            )}
          </g>
        )}

        {/* === TEXTE PLAY QUI DÉFILE === */}
        {showScrollText && textGrid && (
          <g>
            {/* Fond noir */}
            <polygon
              points="67.5159 13.60592 67.5159 65.16592 65.9559 65.16592 65.9559 66.73587 64.38589 66.73587 64.38589 68.29586 61.2659 68.29586 61.2659 69.85592 19.07589 69.85592 19.07589 68.29586 15.9559 68.29586 15.9559 66.73587 14.38589 66.73587 14.38589 65.16592 12.82589 65.16592 12.82589 63.60592 11.2659 63.60592 11.2659 62.04586 9.7059 62.04586 9.7059 60.48587 8.13589 60.48587 8.13589 12.04586 9.7059 12.04586 9.7059 10.48587 11.2659 10.48587 11.2659 8.91592 12.82589 8.91592 12.82589 7.35592 15.9559 7.35592 15.9559 5.79586 58.13589 5.79586 58.13589 7.35592 61.2659 7.35592 61.2659 8.91592 62.82589 8.91592 62.82589 10.48587 64.38589 10.48587 64.38589 12.04586 65.9559 12.04586 65.9559 13.60592 67.5159 13.60592"
              fill="#000000"
            />
            {/* Contour noir pixel art */}
            <path
              d="M6.57589,15.16592v42.19h1.56V15.16592h-1.56ZM8.13589,12.04586v3.12006h1.57001v-3.12006h-1.57001ZM8.13589,57.35592v3.12994h1.57001v-3.12994h-1.57001ZM9.7059,10.48587v1.56h1.56v-1.56h-1.56ZM9.7059,60.48587v1.56h1.56v-1.56h-1.56ZM11.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM11.2659,62.04586v1.56006h1.56v-1.56006h-1.56ZM12.82589,7.35592v1.56h3.13v-1.56h-3.13ZM15.9559,5.79586v1.56006h42.17999v-1.56006H15.9559ZM58.13589,7.35592v1.56h3.13v-1.56h-3.13ZM61.2659,8.91592v1.56995h1.56v-1.56995h-1.56ZM62.82589,10.48587v1.56h1.56v-1.56h-1.56ZM69.07589,18.29586v-3.12994h-1.56v-1.56h-1.56v-1.56006h-1.57001v3.12006h1.57001v42.19h-1.57001v3.12994h-1.56v1.56h-1.56v1.56006h-3.13v1.56H15.9559v-1.56h-3.13v1.56h1.56v1.56995h1.57001v1.56h3.12v1.56006h42.19v-1.56006h3.12v-1.56h1.57001v-1.56995h1.56v-1.56h1.56v-3.12006h1.56V18.29586h-1.56Z"
              fill="#000000"
              fillRule="evenodd"
            />
            {/* Grille de pixels pour le texte */}
            {textGrid.map((row, rowIndex) =>
              row.map((pixel, colIndex) =>
                pixel === 1 ? (
                  <rect
                    key={`scroll-${rowIndex}-${colIndex}`}
                    x={textGridOffset + colIndex * textPixelSize}
                    y={textGridOffset + rowIndex * textPixelSize}
                    width={textPixelSize}
                    height={textPixelSize}
                    fill="#ffffff"
                  />
                ) : null
              )
            )}
          </g>
        )}
      </svg>
      <div style={circularStyle}>
        <Image
          src={circularSrc}
          alt="circular"
          fill
          style={{ objectFit: "contain" }}
          />
        </div>
    </button>
  );
}
