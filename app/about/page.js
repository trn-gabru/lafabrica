"use client";

import AboutUs from "@/Components/AboutUs/AboutUs.jsx";
import { ReactLenis, useLenis } from "lenis/react";

function page() {
  
  const lenis = useLenis(({ scroll }) => {});
  return (
    <ReactLenis root options={{ lerp: 0.1, smooth: true, duration: 2 }}>
      <AboutUs />
    </ReactLenis>
  );
}

export default page;
