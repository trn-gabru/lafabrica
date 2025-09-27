"use client";

import { useEffect } from "react";
import Link from "next/link";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

import React from "react";
import styles from "./page.module.css";

function Page() {
  useEffect(() => {
    // 1. ANIMATION SETTINGS

    // ScrollTrigger settings for the logo, text, and button fade-in animation
    const textFadeTriggerSettings = {
      trigger: `.${styles.main}`,
      start: "top 25%",
      toggleActions: "play reverse play reverse",
    };

    const leftXValues = [-800, -900, -400];
    const rightXValues = [800, 900, 400];
    const leftRotationValues = [-30, -20, -35];
    const rightRotationValues = [30, 20, 35];
    const yValues = [100, -150, -400];

    const cardScrollTriggerCommon = {
      trigger: `.${styles.main}`,
      start: "top center",
      end: "150% bottom",
      scrub: true,
      // Ensure smooth performance
      anticipatePin: 1,
    };

    // 2. CARD ANIMATION (Scroll-driven)
    gsap.utils.toArray(`.${styles.row}`).forEach((row, index) => {
      // Selectors must match the plain class names used in the JSX
      const cardLeft = row.querySelector(".card-left");
      const cardRight = row.querySelector(".card-right");

      // Animate cardLeft with all properties (x, y, rotation)
      gsap.to(cardLeft, {
        x: leftXValues[index],
        y: yValues[index],
        rotation: leftRotationValues[index],
        scrollTrigger: cardScrollTriggerCommon,
      });

      // Animate cardRight with all properties (x, y, rotation)
      gsap.to(cardRight, {
        x: rightXValues[index],
        y: yValues[index],
        rotation: rightRotationValues[index],
        scrollTrigger: cardScrollTriggerCommon,
      });
    });

    // 3. TEXT/LOGO/BUTTON ANIMATIONS (Simple scroll-in/out)

    gsap.to(`.${styles.logo}`, {
      scale: 1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: textFadeTriggerSettings,
    });

    gsap.to(`.${styles.line} p`, {
      y: 0,
      stagger: 0.1,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: textFadeTriggerSettings,
    });

    gsap.to(`.${styles.btn} button`, {
      y: 0,
      opacity: 1,
      delay: 0.25,
      duration: 0.5,
      ease: "power1.out",
      scrollTrigger: textFadeTriggerSettings,
    });

    // 4. CLEANUP
    return () => {
      // PROPER CLEANUP: Kill all ScrollTriggers created in this effect
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        // Ensure .row is used as a selector in JS
        <div className={styles.row} key={i}>
          {/* CRITICAL FIX: Add 'card-left' and 'card-right' as PLAIN classes 
              so that row.querySelector(".card-left") can find them.
              The styles.card is for styling.
          */}
          <div className={`${styles.card} card-left`}>
            <img
              className={styles.footupImg}
              src={`/Images/footup/img-${2 * i - 1}.jpg`}
              alt=""
            />
          </div>
          <div className={`${styles.card} card-right`}>
            <img
              className={styles.footupImg}
              src={`/Images/footup/img-${2 * i}.jpg`}
              alt=""
            />
          </div>
        </div>
      );
    }
    return rows;
  };

  return (
    <>
      <section className="ddiv"></section>
      <section className={styles.main}>
        <div className={styles["main-content"]}>
          <div className={styles.logo}>
            <img src="/logo.png" alt="" />
          </div>
          <div className={styles.copy}>
            <div className={styles.line}>
              <p>coding without clutter</p>
            </div>
            <div className={styles.line}>
              <p>coding without clutter</p>
            </div>
            <div className={styles.line}>
              <p>coding without clutter</p>
            </div>
          </div>
          <div className={styles.btn}>
            <button>Get Pro</button>
          </div>
        </div>
        {generateRows()}
      </section>
      <section className="ddiv"></section>
    </>
  );
}

export default Page;
