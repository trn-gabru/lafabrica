"use client";
import { useState, useRef } from "react";

// Components
import AnimatedButton from "@/Components/animated-button";
import InfiniteCarousel from "@/Components/InfiniteCarousel";
import GSAPTextReveal from "@/components/gsap-text-reveal";
import LandingPage from "@/Components/landing-page";
// 💡 NEW: Import the HeroCard component
import HeroCard from "@/Components/HeroCard";

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

// ....................................

// 💡 NEW: Define the card data array
const cardData = [
  { title: "Hello World 1", image: "/Images/image2.jpg" },
  { title: "Hello World 2", image: "/Images/image3.jpg" },
  { title: "Hello World 3", image: "/Images/image4.jpg" },
  { title: "Hello World 4", image: "/Images/image5.jpg" },
  { title: "Hello World 5", image: "/Images/image6.jpg" },
];

export default function Home() {
  const [showAnimation, setShowAnimation] = useState(false);
  const handleAnimationComplete = () => {
    setShowAnimation(false);
  };

  const imgs = [
    "/images/image10.jpg",
    "/images/image5.jpg",
    "/images/image19.jpg",
    "/images/image11.jpg",
  ];

  const lenis = useLenis(({ scroll }) => {});

  const containerRef = useRef(null);

  useGSAP(
    () => {
      // Only run the animation setup if the content is visible
      if (showAnimation) return;

      gsap.registerPlugin(ScrollTrigger);

      // We now use cardData.length to get the total number of cards
      const totalCards = cardData.length;

      // Select elements within the scope
      const cards = gsap.utils.toArray(".card", containerRef.current);
      const images = gsap.utils.toArray(".stimg", containerRef.current);
      const stickyCard = containerRef.current.querySelector(".sticky-card");

      if (totalCards === 0 || !stickyCard) {
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
      // return () => {
      //   scrollTimeline.kill();
      //   ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
      // };
      return () => {
        scrollTimeline.kill();
      };
    },
    { scope: containerRef, dependencies: [showAnimation] }
  );

  return (
    <>
      {showAnimation && <LandingPage onComplete={handleAnimationComplete} />}

      {!showAnimation && (
        <ReactLenis root options={{ lerp: 0.1, smooth: true, duration: 2 }}>
          <div ref={containerRef}>
            <main className={styles.homeBody}>
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
                  <AnimatedButton label="Get Quote" symbol="→" />
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
                {/* 💡 THE REFACTORED PART: Using the HeroCard component */}
                {cardData.map((card, index) => (
                  <HeroCard
                    key={index} // Use a better unique ID if available, but index is okay here
                    title={card.title}
                    image={card.image}
                  />
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
