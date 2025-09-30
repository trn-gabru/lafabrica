"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./landing-page.module.css";

export default function LandingAnimation({ onComplete }) {
  const [isVisible, setIsVisible] = useState(true);
  const rootRef = useRef(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const counts = root.querySelectorAll(`.${styles.count}`);
    const firstDigit = root.querySelector(`.${styles.digit}`);
    const totalDigits = 6;

    // Measure the digit width to drive responsive animation distances
    const measuredDigitWidth = firstDigit?.getBoundingClientRect().width || 180;

    // Initialize positions based on the measured width (start fully offscreen to the left by 6 digits)
    gsap.set(counts, { x: -measuredDigitWidth * totalDigits });

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut", duration: 0.85 },
    });

    // Reveal sequence: move from -6w to -5w, ... to 0. Ensures last number is fully visible.
    for (let i = 1; i <= totalDigits; i++) {
      const xPosition = -measuredDigitWidth * (totalDigits - i); // ends at 0
      tl.to(counts, { x: xPosition });
    }

    // Prepare revealer svgs
    gsap.set(`.${styles.revealer} svg`, {
      scale: 0,
      xPercent: -100,
      yPercent: -90,
    });

    const delays = [6, 6.5, 7];
    root.querySelectorAll(`.${styles.revealer} svg`).forEach((el, i) => {
      gsap.to(el, {
        scale: 42,
        xPercent: -320,
        yPercent: -320,
        duration: 1.5,
        ease: "power4.inOut",
        delay: delays[i],
        onComplete: () => {
          if (i === delays.length - 1) {
            setIsVisible(false);
            onComplete?.();
          }
        },
      });
    });

    // Header and button animations (safe even if elements are missing)
    const headerH1 = root.querySelector(`.${styles.header} h1`);
    if (headerH1) {
      gsap.to(headerH1, {
        rotateY: 0,
        opacity: 1,
        duration: 2,
        ease: "power3.out",
        delay: 8,
      });
    }

    const toggleBtn = root.querySelector(`.${styles.toggleBtn}`);
    if (toggleBtn) {
      gsap.to(toggleBtn, { scale: 1, duration: 1, ease: "power4.inOut" });
    }

    root.querySelectorAll(`.${styles.line} p`).forEach((el) => {
      gsap.to(el, { y: 0, duration: 1, ease: "power3.out", stagger: 0.1 });
    });
  }, [onComplete]);

  if (!isVisible) return null;

  return (
    <div className={styles.landingContainer} ref={rootRef} aria-live="polite">
      <div className={styles.container}>
        <div className={styles.loader} role="img" aria-label="Intro animation">
          <div className={styles.countWrapper}>
            <div className={styles.count}>
              <div className={styles.digit}>
                <h1>9</h1>
              </div>
              <div className={styles.digit}>
                <h1>8</h1>
              </div>
              <div className={styles.digit}>
                <h1>7</h1>
              </div>
              <div className={styles.digit}>
                <h1>4</h1>
              </div>
              <div className={styles.digit}>
                <h1>2</h1>
              </div>
              <div className={styles.digit}>
                <h1>0</h1>
              </div>
            </div>
          </div>

          <div className={styles.countWrapper}>
            <div className={styles.count}>
              <div className={styles.digit}>
                <h1>9</h1>
              </div>
              <div className={styles.digit}>
                <h1>5</h1>
              </div>
              <div className={styles.digit}>
                <h1>9</h1>
              </div>
              <div className={styles.digit}>
                <h1>7</h1>
              </div>
              <div className={styles.digit}>
                <h1>4</h1>
              </div>
              <div className={styles.digit}>
                <h1>0</h1>
              </div>
            </div>
          </div>

          <div
            className={`${styles.revealer} ${styles.revealer1}`}
            aria-hidden="true"
          >
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 824.48 405.78"
            >
              <g>
                <path
                  fill="white"
                  d="M549.48,118.81l37.89,16.56c47.28,98.82,127.86,177.9,237.11,240-93.81-42.86-172.75-35.66-246.67-11.56-26.42-80.03-35.2-161.76-28.33-245Z"
                />
                <path
                  fill="white"
                  d="M493.22,115.81l50.22,3c-9.9,81.64-1.09,164.05,26.44,247.22l-15.78,8c-116.04-60.3-295.86-78.26-554.11-36.48,197.44-41.59,377.87-99.82,493.22-221.74Z"
                />
                <path
                  fill="white"
                  d="M546.93,376.74c-14.11,7.59-28.12,17-42,29.04-109.31-78.23-287.47-88.36-501.48-63.04,213.98-35.68,400.38-31.86,543.48,34Z"
                />
                <path
                  fill="white"
                  d="M588.26,131.41l-38.78-17.78,4.7-50.52-8.74,49.93-48.44-1.48c11.8-12.11,20.28-26.04,25.48-41.78,30.99,7.34,29.33-27.85,42.81-69.78-6.37,56.93-9.19,79.11,12.3,82-.37,19.6,3.24,36.02,10.67,49.41Z"
                />
              </g>
            </svg>
          </div>

          <div
            className={`${styles.revealer} ${styles.revealer2}`}
            aria-hidden="true"
          >
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 824.48 405.78"
            >
              <g>
                <path
                  fill="#00a0e3"
                  d="M549.48,118.81l37.89,16.56c47.28,98.82,127.86,177.9,237.11,240-93.81-42.86-172.75-35.66-246.67-11.56-26.42-80.03-35.2-161.76-28.33-245Z"
                />
                <path
                  fill="#00a0e3"
                  d="M493.22,115.81l50.22,3c-9.9,81.64-1.09,164.05,26.44,247.22l-15.78,8c-116.04-60.3-295.86-78.26-554.11-36.48,197.44-41.59,377.87-99.82,493.22-221.74Z"
                />
                <path
                  fill="#00a0e3"
                  d="M546.93,376.74c-14.11,7.59-28.12,17-42,29.04-109.31-78.23-287.47-88.36-501.48-63.04,213.98-35.68,400.38-31.86,543.48,34Z"
                />
                <path
                  fill="#00a0e3"
                  d="M588.26,131.41l-38.78-17.78,4.7-50.52-8.74,49.93-48.44-1.48c11.8-12.11,20.28-26.04,25.48-41.78,30.99,7.34,29.33-27.85,42.81-69.78-6.37,56.93-9.19,79.11,12.3,82-.37,19.6,3.24,36.02,10.67,49.41Z"
                />
              </g>
            </svg>
          </div>

          <div
            className={`${styles.revealer} ${styles.revealer3}`}
            aria-hidden="true"
          >
            <svg
              className={styles.svg}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 824.48 405.78"
            >
              <g>
                <path
                  fill="black"
                  d="M549.48,118.81l37.89,16.56c47.28,98.82,127.86,177.9,237.11,240-93.81-42.86-172.75-35.66-246.67-11.56-26.42-80.03-35.2-161.76-28.33-245Z"
                />
                <path
                  fill="black"
                  d="M493.22,115.81l50.22,3c-9.9,81.64-1.09,164.05,26.44,247.22l-15.78,8c-116.04-60.3-295.86-78.26-554.11-36.48,197.44-41.59,377.87-99.82,493.22-221.74Z"
                />
                <path
                  fill="black"
                  d="M546.93,376.74c-14.11,7.59-28.12,17-42,29.04-109.31-78.23-287.47-88.36-501.48-63.04,213.98-35.68,400.38-31.86,543.48,34Z"
                />
                <path
                  fill="black"
                  d="M588.26,131.41l-38.78-17.78,4.7-50.52-8.74,49.93-48.44-1.48c11.8-12.11,20.28-26.04,25.48-41.78,30.99,7.34,29.33-27.85,42.81-69.78-6.37,56.93-9.19,79.11,12.3,82-.37,19.6,3.24,36.02,10.67,49.41Z"
                />
              </g>
            </svg>
          </div>
        </div>

        {/* Optional UI elements retained for reference */}
        {/* <div className={styles.siteInfo}>
          <div className={styles.line}><p>Digital & Brand Design</p></div>
          <div className={styles.line}><p>Digital & Brand Photography</p></div>
        </div>
        <div className={styles.toggleBtn}>
          <img className={styles.logoImg} src="/abstract-logo.jpg" alt="logo" />
        </div>
        <div className={styles.header}><h1>LaFabrica</h1></div> */}
      </div>
    </div>
  );
}
