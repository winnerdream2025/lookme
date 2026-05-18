import sharp from 'sharp';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicDir = join(__dirname, '..', 'public');

async function optimizeHeroImages() {
  const inputImage = join(publicDir, 'Gemini_Generated_Image_i9bp49i9bp49i9bp.png');
  
  console.log('🎨 Optimizing hero images...\n');

  // Desktop version - high-res landscape (1920x1080)
  console.log('Creating desktop hero (1920x1080)...');
  await sharp(inputImage)
    .resize(1920, 1080, {
      fit: 'cover',
      position: 'right'
    })
    .webp({ quality: 90 })
    .toFile(join(publicDir, 'images', 'hero-desktop.webp'));
  console.log('✓ Desktop hero created\n');

  // Mobile version - vertical crop (768x1024) focusing on faces
  console.log('Creating mobile hero (768x1024)...');
  await sharp(inputImage)
    .resize(768, 1024, {
      fit: 'cover',
      position: 'centre'
    })
    .webp({ quality: 85 })
    .toFile(join(publicDir, 'images', 'hero-mobile.webp'));
  console.log('✓ Mobile hero created\n');

  // Also create a fallback JPG for older browsers
  console.log('Creating fallback JPG...');
  await sharp(inputImage)
    .resize(1920, 1080, {
      fit: 'cover',
      position: 'right'
    })
    .jpeg({ quality: 85 })
    .toFile(join(publicDir, 'images', 'hero-desktop.jpg'));
  console.log('✓ Fallback JPG created\n');

  console.log('✅ All hero images optimized successfully!');
}

optimizeHeroImages().catch(console.error);
