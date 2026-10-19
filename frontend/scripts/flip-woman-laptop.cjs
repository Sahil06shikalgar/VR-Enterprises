const sharp = require('sharp');
const path = require('path');

async function createFlippedImage() {
  const inputImage = path.join(__dirname, '../dist/images/about/about-us.webp');
  const logoImage = path.join(__dirname, '../dist/images/brand/vr-logo.webp');
  const outputImage = path.join(__dirname, '../dist/images/about/woman-laptop-pointing-left.webp');

  // Get original image metadata
  const originalMeta = await sharp(inputImage).metadata();
  const { width, height } = originalMeta;

  console.log(`Original image: ${width}x${height}`);

  // Flip the image horizontally
  const flippedBuffer = await sharp(inputImage)
    .flop() // horizontal flip
    .toBuffer();

  // Get logo metadata
  const logoMeta = await sharp(logoImage).metadata();
  console.log(`Original logo: ${logoMeta.width}x${logoMeta.height}`);

  // Estimate laptop screen area in the flipped image
  // The laptop screen is likely in the upper portion
  // After horizontal flip, the laptop moves from left to right side
  // Let's estimate: laptop screen ~30% from top, ~60% from left (in flipped coordinates)
  // Size: ~35% of image width, maintaining logo aspect ratio
  
  const logoScale = 0.25; // Logo will be 25% of image width
  const logoWidth = Math.round(width * logoScale);
  const logoHeight = Math.round(logoWidth * (logoMeta.height / logoMeta.width));

  // Position: upper right area (laptop screen after flip)
  // X: 65% from left (so logo ends at ~90% of width)
  // Y: 20% from top
  const left = Math.round(width * 0.65);
  const top = Math.round(height * 0.20);

  console.log(`Logo overlay: ${logoWidth}x${logoHeight} at (${left}, ${top})`);

  // Resize logo and overlay on flipped image
  await sharp(flippedBuffer)
    .composite([
      {
        input: await sharp(logoImage)
          .resize(logoWidth, logoHeight, { fit: 'inside' })
          .toBuffer(),
        left: left,
        top: top,
      },
    ])
    .webp({ quality: 85, effort: 6 })
    .toFile(outputImage);

  console.log(`Saved to: ${outputImage}`);
}

createFlippedImage().catch(console.error);