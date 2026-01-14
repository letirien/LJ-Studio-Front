const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const INPUT_SVG = path.join(__dirname, '../public/images/LJSTD_WORDMARK.svg');
const OUTPUT_FILE = path.join(__dirname, '../components/home/pixelatedLogoData.txt');

const PIXEL_SIZE = 4;
const STRIDE = 4;
const GAP = 0;
const RADIUS = 0.3;

const RASTER_SCALE = 6; // ↑ augmente si besoin de précision

function extractViewBox(svg) {
  const match = svg.match(/viewBox="([^"]+)"/);
  if (!match) throw new Error('viewBox introuvable');
  return match[1].split(/\s+/).map(Number);
}

async function pixelate() {
  const svgText = fs.readFileSync(INPUT_SVG, 'utf8');
  const svgBuffer = Buffer.from(svgText);

  const [vbX, vbY, vbWidth, vbHeight] = extractViewBox(svgText);

  // Raster size EXACTEMENT basée sur le viewBox
  const rasterWidth = Math.round(vbWidth * RASTER_SCALE);
  const rasterHeight = Math.round(vbHeight * RASTER_SCALE);

  const { data } = await sharp(svgBuffer, { density: 300 })
    .resize(rasterWidth, rasterHeight, {
      fit: 'fill'
    })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const cols = Math.floor(vbWidth / STRIDE);
  const rows = Math.floor(vbHeight / STRIDE);

  const pixels = [];

  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // centre du pixel en SVG units
      const svgX = col * STRIDE + PIXEL_SIZE / 2;
      const svgY = row * STRIDE + PIXEL_SIZE / 2;

      // mapping SVG → bitmap
      const px = Math.floor((svgX / vbWidth) * rasterWidth);
      const py = Math.floor((svgY / vbHeight) * rasterHeight);

      const idx = (py * rasterWidth + px) * 4;
      const alpha = data[idx + 3];

      if (alpha > 8) {
        pixels.push({
          x: col * STRIDE,
          y: row * STRIDE
        });
      }
    }
  }

  const rects = pixels
    .map(
      p =>
        `<rect x="${p.x.toFixed(3)}" y="${p.y.toFixed(
          3
        )}" width="${PIXEL_SIZE}" height="${PIXEL_SIZE}" rx="${RADIUS}" ry="${RADIUS}" />`
    )
    .join('\n');

  const output = `
viewBox="0 0 ${vbWidth.toFixed(2)} ${vbHeight.toFixed(2)}"

Pixels: ${pixels.length}

${rects}
`;

  fs.writeFileSync(OUTPUT_FILE, output);
  console.log('✔ Pixelisation complète (logo entier)');
}

pixelate().catch(console.error);
