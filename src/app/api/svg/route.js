// src/app/api/svg/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  // Define your logos list with URLs relative to the public directory
  const logos = [
    { url: '/images/html.png', title: 'HTML Logo', x: 0 },
    { url: '/images/css.png', title: 'CSS Logo', x: 200 },
    { url: '/images/js.png', title: 'JavaScript Logo', x: 400 }
  ];

  const logoImages = logos.map((logo, index) => `
    <image
      id="logo-${index + 1}"
      class="logo logo-${(index % 3) + 1}"
      href="${logo.url}"
      x="${logo.x}"
      y="50"
      width="100"
      height="100"
      title="${logo.title}"
    />
    <image
      id="logo-${index + logos.length + 1}"
      class="logo logo-${(index % 3) + 1}"
      href="${logo.url}"
      x="${logo.x + 600}"
      y="50"
      width="100"
      height="100"
      title="${logo.title}"
    />
  `).join('');

  const svgContent = `
    <svg id="logo-svg" width="1200" height="200" xmlns="http://www.w3.org/2000/svg">
      <g class="slider">
        ${logoImages}
      </g>
    </svg>
  `;

  const headers = new Headers({
    'Content-Type': 'image/svg+xml',
  });

  return new NextResponse(svgContent, { headers });
}
