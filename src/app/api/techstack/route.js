import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Helper function to convert image file to Base64
const imageToBase64 = (filePath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) {
        return reject(err);
      }
      const base64 = data.toString("base64");
      resolve(`data:image/png;base64,${base64}`);
    });
  });
};

// Define image paths
const getImageBase64 = async (imageName) => {
  const imagesDir = path.join(process.cwd(), "public", "images");
  const filePath = path.join(imagesDir, imageName);
  return await imageToBase64(filePath);
};

export async function GET(request) {
  // Extract the tech query parameter
  const { searchParams } = new URL(request.url);
  const tech = searchParams.get("tech");

  // If tech is not provided, return a 400 error
  if (!tech) {
    return NextResponse.json(
      { error: "Tech parameter is required" },
      { status: 400 },
    );
  }

  // Split the tech string into an array of technologies
  const techArray = tech.split(",");

  // Define SVG dimensions and circle properties
  const svgWidth = 1200;
  const svgHeight = 100; // Adjusted for horizontal layout
  const circleRadius = 40;
  const circleStrokeWidth = 8;
  const circleDiameter = circleRadius * 2;
  const gap = 20; // Space between circles
  const padding = 12;

  // Create circles for each tech
  const circles = await Promise.all(
    techArray.map(async (t, index) => {
      const cx = circleDiameter * index + circleRadius + gap * index + padding;
      const cy = svgHeight / 2;
      const techName = t.trim();
      let logo = "";

      // Fetch Base64 data for the logo
      try {
        logo = await getImageBase64(`${techName}.png`);
      } catch (error) {
        console.error(`Error loading image for ${techName}:`, error);
        logo = "";
      }

      return `
      <!-- Background Circle -->
      <circle
        cx="${cx}"
        cy="${cy}"
        r="${circleRadius}"
        stroke="#e6e6e6"
        stroke-width="${circleStrokeWidth}"
        fill="none"
      />
      <!-- Animated Circle -->
      <circle
        cx="${cx}"
        cy="${cy}"
        r="${circleRadius}"
        stroke="#3498db"
        stroke-width="${circleStrokeWidth}"
        fill="none"
        stroke-dasharray="282.74"
        stroke-dashoffset="282.74"
        stroke-linecap="round"
        transform="rotate(-90, ${cx}, ${cy})"
      >
        <animate
          attributeName="stroke-dashoffset"
          from="282.74"
          to="28.274"
          dur="2s"
          fill="freeze"
          begin="0s"
        />
      </circle>
      <!-- Logo Image -->
      <image
        href="${logo}"
        x="${cx - circleRadius + 12}"
        y="${cy - circleRadius + 12}"
        width="${circleDiameter - 24}"
        height="${circleDiameter - 24}"
        clip-path="url(#clip-${index})"
      />
      <!-- Clip Path for logo -->
      <defs>
        <clipPath id="clip-${index}">
          <circle cx="${cx}" cy="${cy}" r="${circleRadius}" />
        </clipPath>
      </defs>
    `;
    }),
  );

  const svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${circles.join("")}
    </svg>
  `;

  // Return the SVG content with the correct Content-Type
  return new NextResponse(svgContent, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
