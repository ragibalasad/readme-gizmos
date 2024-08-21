// This is a server component by default
import React from "react";

export default async function Home() {
  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: svgData }} />
    </main>
  );
}
