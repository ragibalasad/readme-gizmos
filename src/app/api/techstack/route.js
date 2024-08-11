import { NextResponse } from "next/server";

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
  const circles = techArray
    .map((t, index) => {
      const cx = circleDiameter * index + circleRadius + gap * index + padding;
      const cy = svgHeight / 2;

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
    `;
    })
    .join("");

  const svgContent = `
    <svg width="${svgWidth}" height="${svgHeight}" viewBox="0 0 ${svgWidth} ${svgHeight}" xmlns="http://www.w3.org/2000/svg">
      ${circles}
    </svg>
  `;

  // Return the SVG content with the correct Content-Type
  return new NextResponse(svgContent, {
    headers: { "Content-Type": "image/svg+xml" },
  });
}
