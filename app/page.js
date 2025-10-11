"use client";
import { useState, useRef } from "react";

// Components
import AnimatedButton from "@/Components/animated-button";
import InfiniteCarousel from "@/Components/InfiniteCarousel";
import GSAPTextReveal from "@/components/gsap-text-reveal";
import LandingPage from "@/Components/landing-page";
import HeroCard from "@/Components/HeroCard"; // 💡 NEW: Import the HeroCard component

import styles from "./page.module.css";

// GSAP Imports
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Lenis Import
import { ReactLenis, useLenis } from "lenis/react";
import ImageSlider from "@/Components/image-slider";
import OurClients from "@/Components/our-clients";
import Testimonials from "@/Components/testimonials";
import Footup from "@/Components/footup";
import { useRouter } from "next/navigation";

// ....................................

// 💡 Define the card data array
const cardData = [
  {
    image: "/Images/hero/yanzheng-xia--T-HD4kY5YQ-unsplash.jpg",
  },
  {
    image: "/Images/hero/wolfgang-frick-UGYGm75B0So-unsplash.jpg",
  },
  { image: "/Images/hero/image18.jpg" },
  { image: "/Images/hero/image14.jpg" },
  { image: "/Images/hero/image13.jpg" },
];

export default function Home() {
  const router = useRouter();
  // 💡 MODIFIED: Set to true initially to run the LandingPage animation on load
  const [showAnimation, setShowAnimation] = useState(true);
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const handleContactClick = () => {
    router.push(`/contact-us`);
  };

  const imgs = [
    "/images/image10.jpg",
    "/images/image5.jpg",
    "/images/image19.jpg",
    "/images/image11.jpg",
  ];

  // eslint-disable-next-line no-unused-vars
  const lenis = useLenis(({ scroll }) => {});

  const containerRef = useRef(null);
  const homeBodyRef = useRef(null); // 💡 NEW: Ref for the homeBody section

  useGSAP(
    () => {
      gsap.registerPlugin(ScrollTrigger);

      // --- HERO CONTENT ENTRANCE ANIMATION (NEW) ---
      // Runs when showAnimation becomes false (i.e., when LandingPage completes)
      if (!showAnimation && homeBodyRef.current) {
        const homeBodyTL = gsap.timeline({
          defaults: { duration: 1.2, ease: "power3.out" },
        });

        // Select the elements to animate within the homeBodyRef scope
        const titleH1 = homeBodyRef.current.querySelector("h1");
        const titleContainer = homeBodyRef.current.querySelector(
          `.${styles.titleContainer}`
        );
        const paragraph = homeBodyRef.current.querySelector("p");
        const button = homeBodyRef.current.querySelector("button");
        const carousel = homeBodyRef.current.querySelector(
          `.${styles.homeBody} > div:first-child`
        );

        // Initial state: hide elements before the animation
        // Use autoAlpha (opacity and visibility) for smoother hides
        gsap.set([titleH1, paragraph, button, carousel], { autoAlpha: 0 });

        // This is the container for the main H1 title
        const h1Wrapper = homeBodyRef.current.querySelector(
          `.${styles.homeHeroDiv} > div:first-child`
        );
        // Clip the H1 wrapper to create a reveal effect (Engineering Shades, Elevating Spaces)
        gsap.set(h1Wrapper, { clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)" });

        homeBodyTL
          .fromTo(
            carousel,
            { y: 50 },
            { y: 0, autoAlpha: 1, duration: 1.5 },
            0.2 // Start carousel slightly after initial content appears
          )
          .to(
            h1Wrapper, // H1 container reveal
            {
              clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
              duration: 1.5,
            },
            0.5 // Start after a slight delay
          )
          .fromTo(
            titleH1,
            { y: 50 },
            { y: 0, autoAlpha: 1, duration: 1.2 },
            "<" // Start simultaneously with the clip path animation
          )
          .fromTo(
            paragraph,
            { y: 30 },
            { y: 0, autoAlpha: 1, duration: 1 },
            ">-0.8" // Overlap with H1 for a faster feel
          )
          .fromTo(
            button,
            { y: 30 },
            { y: 0, autoAlpha: 1, duration: 0.8 },
            ">-0.5" // Overlap with paragraph
          );
      }

      // --- SCROLLTRIGGER ANIMATION FOR HERO CARDS ---
      // Only run the animation setup if the landing animation is complete
      if (showAnimation) return;

      const totalCards = cardData.length;

      // Select elements within the scope
      const cards = gsap.utils.toArray(".card", containerRef.current);
      const images = gsap.utils.toArray(".stimg", containerRef.current);
      const stickyCard = containerRef.current.querySelector(".sticky-card");

      if (totalCards === 0 || !stickyCard || cards.length === 0) {
        console.warn("GSAP: Sticky card elements not found.");
        return;
      }

      gsap.set(cards[0], { y: 0, scale: 1, rotation: 0 });
      gsap.set(images[0], { scale: 1 });

      for (let i = 1; i < totalCards; i++) {
        gsap.set(cards[i], { y: "100%", scale: 1, rotation: 0 });
        gsap.set(images[i], { scale: 1 });
      }

      const scrollTimeline = gsap.timeline({
        scrollTrigger: {
          pinSpacing: true,
          trigger: stickyCard,
          start: "top top",
          // The end position is dynamically calculated based on the cardData array
          end: `+=${window.innerHeight * (totalCards - 1)}`,
          pin: true,
          scrub: 0.5,
        },
      });

      for (let i = 0; i < totalCards - 1; i++) {
        const currentCard = cards[i];
        const currentImage = images[i];
        const nextCard = cards[i + 1];
        const position = i;

        scrollTimeline.to(
          currentCard,
          {
            scale: 0.5,
            rotation: 10,
            duration: 1,
            ease: "none",
          },
          position
        );
        scrollTimeline.to(
          currentImage,
          {
            scale: 1.5,
            duration: 1,
            ease: "none",
          },
          position
        );
        scrollTimeline.to(
          nextCard,
          {
            y: "0%",
            duration: 1,
            ease: "none",
          },
          position
        );
      }

      // Cleanup function
      return () => {
        scrollTimeline.kill();
        ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      };
    },
    // Dependencies to ensure animations run when ready
    { scope: containerRef, dependencies: [showAnimation] }
  );

  return (
    <>
      {showAnimation && <LandingPage onComplete={handleAnimationComplete} />}

      {!showAnimation && (
        <ReactLenis root options={{ lerp: 0.1, smooth: true, duration: 2 }}>
          <div ref={containerRef}>
            {/* 💡 MODIFIED: Attached the homeBodyRef here */}
            <main ref={homeBodyRef} className={styles.homeBody}>
              <InfiniteCarousel images={imgs} />

              <div className={styles.homeHeroDiv}>
                <div className={styles.titleContainer}>
                  <h1 className={styles.title}>
                    Engineering <span>Shades, </span> <br /> Elevating
                    <span> Spaces </span>
                  </h1>
                </div>
              </div>

              <div className={styles.homeHeroDiv}>
                <div
                  className={`${styles.titleContainer} ${styles.borderSide}`}
                >
                  <p>
                    Over 22 years of crafting breathtaking tensile architecture
                    for homes and businesses. LaFabrica Exterior has woven
                    together imagination and engineering to transform everyday
                    exteriors into inspired havens.
                  </p>
                </div>
              </div>

              <div className={styles.homeHeroDiv}>
                <div className={styles.titleContainer}>
                  <AnimatedButton
                    label="Get Quote"
                    symbol="→"
                    onClick={() => handleContactClick()}
                  />
                </div>
              </div>
            </main>

            <section className={styles.aboutDiv} aria-hidden="true">
              <div className={styles.aboutTextContainer}>
                <GSAPTextReveal>
                  “Since 2002, LaFabrica Exterior has woven together imagination
                  and engineering to transform everyday exteriors into inspired
                  havens. Our bespoke tensile structures and awnings marry form
                  and function, casting cool, elegant shade across patios,
                  storefronts, and walkways. With materials engineered for
                  strength and beauty, every La Fabrica design invites you to
                  live outdoors in comfort and style.”
                </GSAPTextReveal>
              </div>
            </section>

            <section className="sticky-card">
              <div className="cards-container">
                {cardData.map((card, index) => (
                  <HeroCard key={index} image={card.image} />
                ))}
              </div>
            </section>
            <ImageSlider />
            <OurClients />
            <Testimonials />
            <Footup />
          </div>
        </ReactLenis>
      )}
    </>
  );
}
