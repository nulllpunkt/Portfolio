const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const RAW_DIR = path.join(__dirname, '../_raw_images');
const OUT_DIR = path.join(__dirname, '../assets/images');

// Ensure output directory exists
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

// Sizes to generate
const SIZES = [
  { name: 'small', width: 400 },
  { name: 'medium', width: 800 },
  { name: 'large', width: 1200 },
];

async function processImages() {
  try {
    const files = fs.readdirSync(RAW_DIR);
    
    // Filter for image files
    const images = files.filter(file => 
      /\.(jpg|jpeg|png|webp|avif|gif)$/i.test(file)
    );

    if (images.length === 0) {
      console.log('No images found in _raw_images directory.');
      return;
    }

    console.log(`Processing ${images.length} images...`);

    for (const file of images) {
      const parsedPath = path.parse(file);
      const filename = parsedPath.name;
      const inputPath = path.join(RAW_DIR, file);

      console.log(`\nProcessing: ${file}`);

      for (const size of SIZES) {
        const outputPath = path.join(OUT_DIR, `${filename}-${size.name}.webp`);
        
        await sharp(inputPath)
          .resize(size.width)
          .webp({ quality: 80 }) // 80% quality is a good balance for webp
          .toFile(outputPath);
          
        console.log(`  -> Created ${filename}-${size.name}.webp`);
      }
      
      // Optional: Generate one full-resolution but highly compressed webp
      // (Used when a user clicks to view the original picture)
      const fullResPath = path.join(OUT_DIR, `${filename}-original.webp`);
      await sharp(inputPath)
        .webp({ quality: 85 })
        .toFile(fullResPath);
      console.log(`  -> Created ${filename}-original.webp`);
    }

    console.log('\n✅ All images processed successfully!');
    
  } catch (error) {
    console.error('Error processing images:', error);
  }
}

processImages();
