import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

// Resolve __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PUBLIC_DIR = path.join(__dirname, 'public');

// 1. The custom sprout logo SVG matching the KrishiMitra agricultural green colors
const SVG_CONTENT = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="100%" height="100%">
  <!-- Rounded background container with solid green matching the logo -->
  <rect width="512" height="512" rx="144" fill="#16A34A" />
  <!-- Centered Sprout Path -->
  <g transform="translate(-8, -41) scale(22)" stroke="#FFFFFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <path d="M9 20h10" />
    <path d="M12 20c5.5-2.5 8-9 8-13-8 0-10.5 2.5-13 8" />
    <path d="M12 20c-5.5-2.5-8-9-8-13 8 0 10.5 2.5 13 8" />
  </g>
</svg>`;

// 2. Pure JS helper to generate a compliant multi-resolution ICO file from PNG buffers
function generateIco(pngBuffers) {
  const headerSize = 6;
  const directorySize = 16 * pngBuffers.length;
  
  const header = Buffer.alloc(headerSize);
  header.writeUInt16LE(0, 0); // Reserved
  header.writeUInt16LE(1, 2); // Type: Icon
  header.writeUInt16LE(pngBuffers.length, 4); // Count of images
  
  const directories = [];
  const dataBuffers = [];
  let currentOffset = headerSize + directorySize;
  
  for (let i = 0; i < pngBuffers.length; i++) {
    const { buffer, width, height } = pngBuffers[i];
    const dataSize = buffer.length;
    
    const dir = Buffer.alloc(16);
    dir.writeUInt8(width === 256 ? 0 : width, 0); // Width
    dir.writeUInt8(height === 256 ? 0 : height, 1); // Height
    dir.writeUInt8(0, 2); // Color palette size (0 for no palette)
    dir.writeUInt8(0, 3); // Reserved
    dir.writeUInt16LE(1, 4); // Color planes
    dir.writeUInt16LE(32, 6); // Bits per pixel
    dir.writeUInt32LE(dataSize, 8); // Size of image data
    dir.writeUInt32LE(currentOffset, 12); // Offset from beginning of file
    
    directories.push(dir);
    dataBuffers.push(buffer);
    currentOffset += dataSize;
  }
  
  return Buffer.concat([header, ...directories, ...dataBuffers]);
}

async function main() {
  console.log('Generating favicon assets...');
  
  // Ensure public folder exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
  }

  // Write new SVG favicon
  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.svg'), SVG_CONTENT);
  console.log('✔ Wrote public/favicon.svg');

  // Input SVG buffer for sharp
  const svgBuffer = Buffer.from(SVG_CONTENT);

  // Define target sizes for PNGs
  const sizes = {
    'favicon-16x16.png': 16,
    'favicon-32x32.png': 32,
    'apple-touch-icon.png': 180,
    'android-chrome-192x192.png': 192,
    'android-chrome-512x512.png': 512
  };

  const pngBuffers = {};

  for (const [filename, size] of Object.entries(sizes)) {
    const buffer = await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toBuffer();
    
    fs.writeFileSync(path.join(PUBLIC_DIR, filename), buffer);
    pngBuffers[size] = buffer;
    console.log(`✔ Generated public/${filename} (${size}x${size})`);
  }

  // Package favicon.ico containing 16x16 and 32x32 versions
  const icoBuffer = generateIco([
    { buffer: pngBuffers[16], width: 16, height: 16 },
    { buffer: pngBuffers[32], width: 32, height: 32 }
  ]);

  fs.writeFileSync(path.join(PUBLIC_DIR, 'favicon.ico'), icoBuffer);
  console.log('✔ Generated public/favicon.ico');
  
  console.log('Favicon generation completed successfully!');
}

main().catch(err => {
  console.error('Error generating favicons:', err);
  process.exit(1);
});
