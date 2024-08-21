// This is a server component by default
import React from "react";

export default async function Home() {
  const response = await fetch(
    "http://localhost:3000/github/stars/ragibalasad?color=55960c&label=Stars&labelColor=488207&style=flat&logo=star",
  );
  const svgData = await response.text();

  return (
    <main>
      <div dangerouslySetInnerHTML={{ __html: svgData }} />
    </main>
  );
}
