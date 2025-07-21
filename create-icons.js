const fs = require('fs');
const path = require('path');

// Create a simple SVG icon that we can convert to different sizes
const createSVGIcon = (size) => {
  return `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#8b5cf6;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#ec4899;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad)"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" fill="white" text-anchor="middle" dominant-baseline="central">🌍</text>
</svg>`;
};

// Create icons directory if it doesn't exist
const iconsDir = path.join(__dirname, 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Icon sizes needed for PWA
const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];

console.log('Creating PWA icons...');

iconSizes.forEach(size => {
  const svgContent = createSVGIcon(size);
  const filename = `icon-${size}x${size}.svg`;
  const filepath = path.join(iconsDir, filename);
  
  fs.writeFileSync(filepath, svgContent);
  console.log(`✓ Created ${filename}`);
});

// Create a simple favicon.ico placeholder
const faviconPath = path.join(__dirname, 'public', 'favicon.ico');
const faviconSVG = createSVGIcon(32);
fs.writeFileSync(faviconPath.replace('.ico', '.svg'), faviconSVG);
console.log('✓ Created favicon.svg');

console.log('\n🎉 All PWA icons created successfully!');
console.log('\nNote: These are SVG icons. For better compatibility, consider converting them to PNG format.');
console.log('You can use online tools like https://convertio.co/svg-png/ or install sharp for Node.js conversion.');

// Create a simple conversion script suggestion
const conversionScript = `
// To convert SVG to PNG, you can use this script with sharp:
// npm install sharp
// 
// const sharp = require('sharp');
// const fs = require('fs');
// const path = require('path');
// 
// const iconSizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
// 
// iconSizes.forEach(async (size) => {
//   const svgPath = path.join(__dirname, 'public', 'icons', \`icon-\${size}x\${size}.svg\`);
//   const pngPath = path.join(__dirname, 'public', 'icons', \`icon-\${size}x\${size}.png\`);
//   
//   await sharp(svgPath)
//     .png()
//     .resize(size, size)
//     .toFile(pngPath);
//   
//   console.log(\`✓ Converted icon-\${size}x\${size}.png\`);
// });
`;

fs.writeFileSync(path.join(__dirname, 'convert-to-png.js'), conversionScript);
console.log('✓ Created convert-to-png.js script for future use');