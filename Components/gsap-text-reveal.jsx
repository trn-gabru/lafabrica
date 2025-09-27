"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Register ScrollTrigger plugin
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

export default function GSAPTextReveal({ children, className = "" }) {
  const textRef = useRef(null);

  useEffect(() => {
    if (!textRef.current) return;

    const text = textRef.current;

    // Split text into spans (same as before)
    let rawText = typeof children === "string" ? children : text.textContent;
    const words = rawText.split(/(\s+)/);
    text.innerHTML = "";
    words.forEach((word) => {
      if (/^\s+$/.test(word)) {
        text.appendChild(document.createTextNode(word));
      } else {
        const span = document.createElement("span");
        span.textContent = word;
        span.style.opacity = "0";
        span.style.display = "inline-block";
        text.appendChild(span);
      }
    });

    const wordSpans = Array.from(text.querySelectorAll("span"));

    // Wait one frame to ensure Lenis has initialized
    requestAnimationFrame(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: text,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
          toggleActions: "play none none reverse",
          scroller: document.documentElement, // must match Lenis scroller
        },
      });

      tl.to(wordSpans, {
        opacity: 1,
        duration: 0.5,
        stagger: 0.1,
        ease: "power2.out",
      });
    });
  }, [children]);

  return (
    <p ref={textRef} className={className}>
      {children}
    </p>
  );
}
