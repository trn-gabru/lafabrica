"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./our-clients.module.css";

gsap.registerPlugin(ScrollTrigger);

const clientLogos = [
  { name: "client logo 1", src: "/logos/logo1.png" },
  { name: "client logo 2", src: "/logos/logo2.png" },
  { name: "client logo 3", src: "/logos/logo3.png" },
  { name: "client logo 4", src: "/logos/logo4.png" },
  { name: "client logo 5", src: "/logos/logo5.png" },
  { name: "client logo 6", src: "/logos/logo6.png" },
  { name: "client logo 7", src: "/logos/logo7.png" },
  { name: "client logo 8", src: "/logos/logo8.png" },
  { name: "client logo 9", src: "/logos/logo9.png" },
  { name: "client logo 10", src: "/logos/logo10.png" },
  { name: "client logo 11", src: "/logos/logo11.png" },
  { name: "client logo 12", src: "/logos/logo12.png" },
  { name: "client logo 13", src: "/logos/logo13.png" },
  { name: "client logo 14", src: "/logos/logo14.png" },
  { name: "client logo 15", src: "/logos/logo15.png" },
  { name: "client logo 16", src: "/logos/logo16.png" },
  { name: "client logo 17", src: "/logos/logo17.png" },
  { name: "client logo 18", src: "/logos/logo18.png" },
  { name: "client logo 19", src: "/logos/logo19.png" },
  { name: "client logo 20", src: "/logos/logo20.png" },
  { name: "client logo 21", src: "/logos/logo21.png" },
  { name: "client logo 22", src: "/logos/logo22.png" },
  { name: "client logo 23", src: "/logos/logo23.png" },
  { name: "client logo 24", src: "/logos/logo24.png" },
  { name: "client logo 25", src: "/logos/logo25.png" },
  { name: "client logo 26", src: "/logos/logo26.png" },
  { name: "client logo 27", src: "/logos/logo27.png" },
  { name: "client logo 28", src: "/logos/logo28.png" },
  { name: "client logo 29", src: "/logos/logo29.png" },
  { name: "client logo 30", src: "/logos/logo30.png" },
];

export default function OurClients() {
  const sectionRef = useRef(null);
  const leftContainerRef = useRef(null);
  const rightContainerRef = useRef(null);
  const logosRef = useRef([]);

  useEffect(() => {
    const section = sectionRef.current;
    const leftContainer = leftContainerRef.current;
    const rightContainer = rightContainerRef.current;
    const logos = logosRef.current;

    if (!section || !leftContainer || !rightContainer) return;

    const mm = gsap.matchMedia();

    // Tablet and up: keep pinned sequence
    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "center center",
          end: "+=100%",
          scrub: 1,
          pin: true,
          pinSpacing: true,
          anticipatePin: 1,
        },
      });

      // gsap.set(leftContainer, { opacity: 0, y: 50 });
      gsap.set(rightContainer, { y: 100, opacity: 0 });
      gsap.set(logos, { y: 30, opacity: 0, scale: 0.8 });

      // to(leftContainer, {
      //   opacity: 1,
      //   y: 0,
      //   duration: 0.3,
      //   ease: "power2.out",
      // });
      tl.to(
        rightContainer,
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          ease: "power2.out",
        },
        0.2
      ).to(
        logos,
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.5,
          stagger: 0.05,
          ease: "back.out(1.7)",
        },
        0.4
      );

      return () => {
        tl.kill();
      };
    });

    // Mobile: no pin; fade logos in as they scroll
    mm.add("(max-width: 767px)", () => {
      gsap.set([leftContainer, rightContainer], { opacity: 0, y: 30 });

      const intro = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top 85%",
          end: "top 40%",
          scrub: false,
          once: true,
        },
      });

      intro
        .to(leftContainer, {
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power2.out",
        })
        .to(
          rightContainer,
          { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
          0.15
        );

      const logoTriggers = logos.map((el) =>
        gsap.fromTo(
          el,
          { y: 20, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.35,
            ease: "power2.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              once: true,
            },
          }
        )
      );

      return () => {
        intro.kill();
        logoTriggers.forEach((t) => t.kill && t.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.flexContainer}>
          <div ref={leftContainerRef} className={styles.leftContainer}>
            <div className={styles.textContent}>
              <p className={styles.badge}>Our Clients</p>
              <h2 className={styles.heading}>
                We’re going to become partners for the long run.
              </h2>
              <p className={styles.description}>
                While creating inspiring places for people, product team which
                creates amazing experiences, by crafting top-notch user
                experience.
              </p>
            </div>
          </div>

          <div ref={rightContainerRef} className={styles.rightContainer}>
            <div className={styles.logoGrid}>
              {clientLogos.map((logo, index) => (
                <div
                  key={logo.name}
                  ref={(el) => (logosRef.current[index] = el)}
                  className={styles.logoCard}
                >
                  <img
                    src={logo.src || "/placeholder.svg"}
                    alt={logo.name}
                    className={styles.logoImage}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
