// src/app/api/svg/route.js
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Utility function to convert image to Base64
const imageToBase64 = (filePath) => {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString('base64')}`;
};

// Path to your images
const imagesPath = path.join(process.cwd(), 'public/images');

// Convert images to Base64
const htmlBase64 = imageToBase64(path.join(imagesPath, 'html.png'));
const cssBase64 = imageToBase64(path.join(imagesPath, 'css.png'));
const jsBase64 = imageToBase64(path.join(imagesPath, 'js.png'));

export async function GET() {
  const svgContent = `
    <svg width="1200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" />
      <g class="slider">
        <image href="${htmlBase64}" x="0" y="50" width="100" height="100" />
        <image href="${cssBase64}" x="200" y="50" width="100" height="100" />
        <image href="${jsBase64}" x="400" y="50" width="100" height="100" />
      </g>
    </svg>
  `;

  const headers = new Headers({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache'
  });

  return new NextResponse(svgContent, { headers });
}
