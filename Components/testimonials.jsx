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

    const mm = gsap.matchMedia();

    // Desktop: keep pin + scroll-driven grid animation
    mm.add("(min-width: 1024px)", () => {
      const gridHeight = testimonialGrid.scrollHeight;
      const containerHeight = flexContainer.clientHeight;
      const maxScrollDistancePx = Math.max(gridHeight - containerHeight, 0);
      const targetYPercent =
        -((maxScrollDistancePx / Math.max(gridHeight, 1)) * 100) * 0.95;
      const pinDuration = `+=${maxScrollDistancePx + containerHeight}`;

      const pinTrigger = ScrollTrigger.create({
        trigger: flexContainer,
        start: "top top",
        end: pinDuration,
        pin: flexContainer,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: flexContainer,
          start: "top top",
          end: pinDuration,
          scrub: 1,
        },
      });

      gsap.set(cards, { y: 150, opacity: 0 });
      gsap.set(testimonialGrid, { yPercent: 0 });

      tl.to(
        testimonialGrid,
        { yPercent: targetYPercent, duration: 5, ease: "none" },
        0
      ).to(
        cards,
        {
          y: 0,
          opacity: 1,
          duration: 3,
          stagger: { each: 0.15, from: "start", start: 0, end: 0.8 },
          ease: "power2.out",
        },
        0
      );

      return () => {
        tl.kill();
        pinTrigger.kill();
      };
    });

    // Tablet: lighter pinning with shorter distance
    mm.add("(min-width: 768px) and (max-width: 1023px)", () => {
      // Use a gentler effect: no full-grid yPercent scroll, just reveal cards while section is pinned briefly
      const pinTrigger = ScrollTrigger.create({
        trigger: flexContainer,
        start: "top top",
        end: "+=80%",
        pin: true,
        pinSpacing: true,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: flexContainer,
          start: "top top",
          end: "+=80%",
          scrub: 1,
        },
      });

      gsap.set(cards, { y: 80, opacity: 0 });

      tl.to(cards, {
        y: 0,
        opacity: 1,
        duration: 1.5,
        stagger: 0.12,
        ease: "power2.out",
      });

      return () => {
        tl.kill();
        pinTrigger.kill();
      };
    });

    // Mobile: no pinning; per-card reveal as they scroll into view
    mm.add("(max-width: 767px)", () => {
      const triggers = cards.map((card) =>
        gsap.fromTo(
          card,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.6,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 60%",
              scrub: false,
              once: true,
            },
          }
        )
      );

      return () => {
        triggers.forEach((t) => t.kill && t.kill());
      };
    });

    return () => {
      mm.revert();
    };
  }, []);

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div ref={flexContainerRef} className={styles.flexContainer}>
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
