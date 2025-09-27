"use client";

import { useEffect } from "react";
// Link import removed as it's not used
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered only once
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

import React from "react";
import styles from "./footup.module.css";
import AnimatedButton from "./animated-button";

function Footup() {
  useEffect(() => {
    // 💡 FIX: Declare the array to hold ScrollTrigger references.
    const footupTriggers = [];

    // 1. ANIMATION SETTINGS
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
      anticipatePin: 1,
    };

    // 2. CARD ANIMATION (Scroll-driven)
    gsap.utils.toArray(`.${styles.row}`).forEach((row, index) => {
      const cardLeft = row.querySelector(".card-left");
      const cardRight = row.querySelector(".card-right");

      // Animate cardLeft and push its ScrollTrigger to the array
      const triggerLeft = gsap.to(cardLeft, {
        x: leftXValues[index],
        y: yValues[index],
        rotation: leftRotationValues[index],
        scrollTrigger: cardScrollTriggerCommon,
      }).scrollTrigger;

      // Animate cardRight and push its ScrollTrigger to the array
      const triggerRight = gsap.to(cardRight, {
        x: rightXValues[index],
        y: yValues[index],
        rotation: rightRotationValues[index],
        scrollTrigger: cardScrollTriggerCommon,
      }).scrollTrigger;

      footupTriggers.push(triggerLeft, triggerRight);
    });

    // 3. TEXT/LOGO/BUTTON ANIMATIONS (Simple scroll-in/out)

    // Logo
    footupTriggers.push(
      gsap.to(`.${styles.logo}`, {
        scale: 1,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: textFadeTriggerSettings,
      }).scrollTrigger
    );

    // Text Lines
    footupTriggers.push(
      gsap.to(`.${styles.line} p`, {
        y: 0,
        stagger: 0.1,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: textFadeTriggerSettings,
      }).scrollTrigger
    );

    // Button
    footupTriggers.push(
      gsap.to(`.${styles.btn} button`, {
        y: 0,
        opacity: 1,
        delay: 0.25,
        duration: 0.5,
        ease: "power1.out",
        scrollTrigger: textFadeTriggerSettings,
      }).scrollTrigger
    );

    // 4. CLEANUP
    return () => {
      // This now works because footupTriggers is defined within the closure
      footupTriggers.forEach((t) => t && t.kill());
    };
  }, []);

  const generateRows = () => {
    const rows = [];
    for (let i = 1; i <= 3; i++) {
      rows.push(
        <div className={styles.row} key={i}>
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
      <section className={styles.main}>
        <div className={styles["main-content"]}>
          <div className={styles.logo}>
            <img src="/logo-white.png" alt="" />
          </div>
          <div className={styles.copy}>
            <div className={styles.line}>
              <h1>Ready to reimagine your outdoors?</h1>
            </div>
            <div className={styles.line}>
              <p>Contact us to bring your vision to life.</p>
            </div>
            <div className={styles.line}>
              {/* <p>coding without clutter</p> */}
            </div>
          </div>
          <div className={styles.btn}>
            {/* <button>Get Pro</button> */}
            <AnimatedButton label="Contact Us" symbol="→" />
          </div>
        </div>
        {generateRows()}
      </section>
      {/* <section className="ddiv"></section> */}
    </>
  );
}

export default Footup;
