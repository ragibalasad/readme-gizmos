import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Utility function to convert image to Base64
const imageToBase64 = (filePath) => {
  const image = fs.readFileSync(filePath);
  return `data:image/png;base64,${image.toString("base64")}`;
};

// Path to logo images
const imagesPath = path.join(process.cwd(), "public/images");

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const langParam = searchParams.get("lang");

  if (!langParam) {
    return new NextResponse("No languages specified", { status: 400 });
  }

  const languages = langParam.split(",");

  const base64Images = languages
    .map((lang) => {
      const filePath = path.join(imagesPath, `${lang.trim()}.png`);
      if (fs.existsSync(filePath)) {
        return imageToBase64(filePath);
      } else {
        return null; // Handle missing images, or return a default image
      }
    })
    .filter(Boolean); // Remove null entries

  // Create the SVG content dynamically
  let svgContent = `
    <svg width="1200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f0f0f0" />
      <g class="slider">
  `;

  base64Images.forEach((base64, index) => {
    svgContent += `<image href="${base64}" x="${index * 68}" y="50" width="64" height="64" />`;
  });

  svgContent += `
      </g>
    </svg>
  `;

  const headers = new Headers({
    "Content-Type": "image/svg+xml",
    "Cache-Control": "no-cache",
  });

  return new NextResponse(svgContent, { headers });
}
