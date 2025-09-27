"use client";

import React from "react";
import styles from "./InfiniteCarousel.module.css";

/**
 * InfiniteCarousel
 * props:
 *  - images: array of image URLs (strings). Example: ['/images/1.jpg', '/images/2.jpg']
 */
export default function InfiniteCarousel({ images = [] }) {
  // fallback sample images (put your own into /public/images/)
  if (!images || images.length === 0) {
    images = [
      "/images/sample1.jpg",
      "/images/sample2.jpg",
      "/images/sample3.jpg",
      "/images/sample4.jpg",
    ];
  }

  // duplicate the list for the seamless loop
  const doubled = [...images, ...images];

  return (
    <div className={styles.wrapper} aria-hidden={false}>
      <div className={styles.scroller} role="region" aria-label="image carousel">
        <div className={styles.scrollerInner}>
          {doubled.map((src, i) => (
            <div className={styles.card} key={i}>
              <img src={src} alt={`carousel-${i}`} className={styles.img} />
            </div>
          ))}
        </div>
      </div>

      {/* bottom fade to recreate the soft fade in your screenshot */}
      <div className={styles.bottomFade} />
    </div>
  );
}
