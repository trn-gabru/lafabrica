"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./testimonials.module.css";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

const testimonialsData = [
  {
    title: "Impeccable craftsmanship and reliable delivery",
    description:
      "La Fabrica handled our rooftop pergola and retractable awning with great attention to detail. The team was professional, communicated clearly, and completed the work on schedule — the final result looks premium and functions perfectly.",
    author: "Dhananjay Kate",
    position: "Client, Vadgaon Maval",
  },
  {
    title: "Best brand for shades & canopy systems",
    description:
      "Their canopy and shading solutions transformed our outdoor area. The workmanship is beautiful and durable — exactly what we hoped for. Highly satisfied with the result.",
    author: "Somnath Dhongade",
    position: "Customer, Pune",
  },
  {
    title: "Fabulous work and a great team",
    description:
      "The La Fabrica team was responsive and skilled. From design to installation everything went smoothly — a high-quality finish and friendly service throughout.",
    author: "Vaibhav Patil",
    position: "Homeowner, Pune",
  },
  {
    title: "Smart shading solution that saved our summer",
    description:
      "They designed and installed a sunshade for our pool area in Goa that made it usable again during peak heat. The solution was practical, elegant and clearly built to last.",
    author: "Iqbal Warsi",
    position: "Homeowner, Goa",
  },
  {
    title: "Modern gazebo technology — looks great and durable",
    description:
      "We installed a new gazebo structure and are impressed with the build quality and longevity. The product feels robust and the installation team was professional.",
    author: "Mohammed Sharif",
    position: "Client, Pune",
  },
  {
    title: "Transformed our restaurant terrace",
    description:
      "La Fabrica designed a bespoke tensile canopy for our terrace that elevated the look and made the area usable in all weathers. The fabric choices and structural detailing delivered exactly the ambience we wanted.",
    author: "Vikram Sharma",
    position: "Owner, Pune",
  },
  {
    title: "A blend of aesthetics and engineering",
    description:
      "Their designers balanced form and function beautifully — the tensile structure adds elegance to our façade while providing excellent sun protection. Professional process and excellent finish.",
    author: "Priya Deshpande",
    position: "Architect, Pune",
  },
  {
    title: "Dependable partner for commercial shading projects",
    description:
      "For our campus shading requirements they provided thorough planning, timely execution and lasting workmanship. Communication was proactive and the team delivered on every promise.",
    author: "Rahul Deshmukh",
    position: "Facilities Manager, Pune",
  },
];

export default function Testimonials() {
  const sectionRef = useRef(null);
  const flexContainerRef = useRef(null);
  const testimonialCardsRef = useRef([]);
  const testimonialGridRef = useRef(null);

  useEffect(() => {
    const flexContainer = flexContainerRef.current;
    const cards = testimonialCardsRef.current;
    const testimonialGrid = testimonialGridRef.current;

    if (!flexContainer || cards.length === 0 || !testimonialGrid) return;

    // 1. --- Calculate the target scroll position for the last card ---

    // Total height of the grid content
    const gridHeight = testimonialGrid.scrollHeight;

    // The height of the flexContainer (the pinned element) which is equal to the viewport height
    const containerHeight = flexContainer.clientHeight;

    // The maximum possible scroll up (in pixels) is the content height minus the container height.
    const maxScrollDistancePx = gridHeight - containerHeight;

    // The ideal Y percent that makes the bottom of the grid content aligned
    // with the bottom of the container (i.e., the last card is fully visible).
    // We use 95% of the max scroll to ensure a slight margin at the end.
    const targetYPercent = -((maxScrollDistancePx / gridHeight) * 100) * 0.95;

    // Calculate the dynamic pin duration to match the full animation length.
    // Adding a buffer (e.g., one viewport height) ensures the user has to scroll
    // past the animation to unpin the section.
    const pinDuration = `+=${maxScrollDistancePx + containerHeight}`;

    // --- 2. Create the Pin Trigger ---
    const pinTrigger = ScrollTrigger.create({
      trigger: flexContainer,
      start: "top top",
      // Pin ends when the scroll distance defined by pinDuration is reached
      end: pinDuration,
      pin: flexContainer,
      pinSpacing: true,
    });

    // --- 3. Create the Scroll-Driven Timeline ---
    const cardAnimationTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: flexContainer,
        start: "top top",
        end: pinDuration, // Match the end of the pin trigger
        scrub: 1,
      },
    });

    // --- 4. Set Initial State ---
    gsap.set(cards, { y: 150, opacity: 0 });
    gsap.set(testimonialGrid, { yPercent: 0 });

    // --- 5. Define the Animation ---

    // Part A: Animate the entire grid container up
    cardAnimationTimeline.to(
      testimonialGrid,
      {
        yPercent: targetYPercent, // Use the dynamically calculated percentage
        duration: 5,
        ease: "none",
      },
      0
    );

    // Part B: Animate the individual cards (reveal)
    cardAnimationTimeline.to(
      cards,
      {
        y: 0,
        opacity: 1,
        duration: 3,
        stagger: {
          each: 0.15,
          from: "start",
          // Ensure all cards are revealed within the first 80% of the timeline
          // so they are fully visible before the section unpins.
          start: 0,
          end: 0.8,
        },
        ease: "power2.out",
      },
      0
    );

    // --- Cleanup function ---
    return () => {
      // Kill the card animation timeline, which automatically kills its associated ScrollTrigger
      cardAnimationTimeline.kill();
      // Manually kill the main pin trigger as well for a clean unmount
      pinTrigger.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        {/* The flexContainer is the element that will be pinned */}
        <div ref={flexContainerRef} className={styles.flexContainer}>
          {/* Left Container - Text Content (Stays pinned in the center) */}
          <div className={styles.leftContainer}>
            <div className={styles.textContent}>
              <p className={styles.badge}>Testimonials</p>
              <h2 className={styles.heading}>Our happy clients</h2>
              <p className={styles.description}>
                Hear from clients who’ve experienced remarkable transformations
                with LaFabrica.
              </p>
            </div>
          </div>

          {/* Right Container - Testimonial Cards (Content scrolls and animates) */}
          <div className={styles.rightContainer}>
            <div ref={testimonialGridRef} className={styles.testimonialGrid}>
              {testimonialsData.map((testimonial, index) => (
                <div
                  key={testimonial.author}
                  ref={(el) => (testimonialCardsRef.current[index] = el)}
                  className={styles.testimonialCard}
                >
                  <h3 className={styles.cardTitle}>{testimonial.title}</h3>
                  <p className={styles.cardDescription}>
                    {testimonial.description}
                  </p>
                  <div className={styles.authorInfo}>
                    <p className={styles.authorName}>{testimonial.author}</p>
                    <p className={styles.authorPosition}>
                      {testimonial.position}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
