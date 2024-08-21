import { NextResponse } from "next/server";
import { randomBytes } from "crypto";

function generateRandomString(length) {
  return randomBytes(length).toString("hex");
}

export async function GET(request, { params }) {
  const { badgeName, username } = params;

  // Extract search parameters
  const searchParams = new URL(request.url).searchParams;
  const color = searchParams.get("color");
  const label = searchParams.get("label");
  const labelColor = searchParams.get("labelColor");
  const style = searchParams.get("style");
  const logo = searchParams.get("logo");

  // Generate random strings
  const random_string1 = generateRandomString(8); // 64 bits = 8 bytes
  const random_string2 = generateRandomString(8); // 64 bits = 8 bytes

  // Validate required parameters
  if (!badgeName || !username) {
    return NextResponse.json(
      { error: "Missing required parameters: badgeName and username" },
      { status: 400 },
    );
  }

  try {
    // Construct the base URL
    let providerUrl = `https://custom-icon-badges.demolab.com/github/${badgeName}/${username}`;

    // Append optional parameters if they exist
    const queryParams = new URLSearchParams();
    if (color) queryParams.append("color", color);
    if (label) queryParams.append("label", label);
    if (labelColor) queryParams.append("labelColor", labelColor);
    if (style) queryParams.append("style", style);
    if (logo) queryParams.append("logo", logo);
    // You can include the random strings as query parameters if needed
    queryParams.append("random_string1", random_string1);
    queryParams.append("random_string2", random_string2);

    // Add the query parameters to the URL
    if (queryParams.toString()) {
      providerUrl += `?${queryParams.toString()}`;
    }

    // Fetch the badge from the provider
    const response = await fetch(providerUrl);

    // Check if the fetch was successful
    if (!response.ok) {
      throw new Error(
        `Failed to fetch badge from provider: ${response.statusText}`,
      );
    }

    const svgData = await response.text();

    // Return the SVG data as the response
    return new NextResponse(svgData, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "no-cache, no-store, must-revalidate",
      },
    });
  } catch (error) {
    // Handle fetch or other errors
    return NextResponse.json(
      { error: error.message || "An unknown error occurred" },
      { status: 500 },
    );
  }
}
