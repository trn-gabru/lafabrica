// Components/LenisWrapper.jsx
"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export default function LenisWrapper({ children }) {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.05, // Lower value for slower, smoother interpolation
      duration: 2.8, // Increase duration for slower scroll
      smoothWheel: true,
      smoothTouch: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);
    return () => {
      lenis.destroy();
    };
  }, []);

  return children;
}
