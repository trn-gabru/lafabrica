"use client";

import { useState, useEffect } from "react";
import styles from "./image-slider.module.css";
import AnimatedButton from "./animated-button";

export default function ImageSlider() {
  const [currentSection, setCurrentSection] = useState(0);

  const sections = [
    {
      backgroundImage: "/images/image10.jpg",
      card: {
        title: "Tensile Canopy Structure",
        description:
          "We are offering a comprehensive range of Tensile Canopy Structure, which provides shade from the sun.",
      },
    },
    {
      backgroundImage: "/images/image11.jpg",
      card: {
        title: "TENSILE STRUCTURE",
        description:
          "We offer service in tensile structures in all over India with best plan and quality.",
      },
    },
    {
      backgroundImage: "/images/image12.jpg",
      card: {
        title: "Evening Dining Solutions",
        description:
          "Create magical dining experiences with our illuminated tensile structures that provide comfort and ambiance.",
      },
    },
    {
      backgroundImage: "/images/image13.jpg",
      card: {
        title: "Premium Tent Structures",
        description:
          "Elegant pointed tent designs that combine traditional aesthetics with modern engineering excellence.",
      },
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSection((prev) => (prev + 1) % sections.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.heroSection}>
      {sections.map((section, index) => (
        <div
          key={index}
          className={`${styles.section} ${
            index === currentSection ? styles.active : ""
          }`}
          style={{ backgroundImage: `url(${section.backgroundImage})` }}
        >
          <div className={styles.container}>
            <div className={styles.contentContainer}>
              <h1 className={styles.title}>
                First impressions matter more than ever
              </h1>
              <p className={styles.subtitle}>
                {"Let's create something out of this world together."}
              </p>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>{section.card.title}</h2>
                  <div className={styles.arrowCircle}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M7 17L17 7M17 7H7M17 7V17"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </div>
                <p className={styles.cardDescription}>
                  {section.card.description}
                </p>
                <AnimatedButton label="Get Quote" symbol="→" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
