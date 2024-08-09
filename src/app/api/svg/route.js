// src/app/api/svg/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  const svgContent = `
    <svg width="1200" height="200" xmlns="http://www.w3.org/2000/svg">
      <g class="slider">
        <image href="/images/html.png" x="0" y="50" width="100" height="100" />
        <image href="/images/css.png" x="200" y="50" width="100" height="100" />
        <image href="/images/js.png" x="400" y="50" width="100" height="100" />
      </g>
    </svg>
  `;

  const headers = new Headers({
    'Content-Type': 'image/svg+xml',
    'Cache-Control': 'no-cache'
  });

  return new NextResponse(svgContent, { headers });
}
