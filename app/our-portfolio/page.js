"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./portfolio.module.css";
import { ReactLenis, useLenis } from "lenis/react";

export default function PortfolioPage() {
  const lenis = useLenis(({ scroll }) => {});

  const sectionsRef = useRef([]);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const infoCardsRef = useRef([]);
  const mainTitleRef = useRef(null);
  const ctaRef = useRef(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroImages = [
    "/Images/portfolio/teguh-arief-y46qndGz86M-unsplash.jpg?height=800&width=1600",
    "/Images/portfolio/jonathan-borba-y6Y2Eqo_RiM-unsplash.jpg?height=800&width=1600",
    "/Images/portfolio/bady-abbas-ZglHN7Y1dIk-unsplash.jpg?height=800&width=1600",
    "/Images/portfolio/jonathan-borba-rg1m51G0Oko-unsplashjf.jpg?height=800&width=1600",
  ];

  useEffect(() => {
    const fetchPortfolioItems = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/portfolio");
        const data = await response.json();

        if (data.success) {
          setPortfolioItems(data.items);
        } else {
          setError(data.error || "Failed to load portfolio items");
        }
      } catch (err) {
        console.error("[v0] Error fetching portfolio items:", err);
        setError("Failed to load portfolio items");
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioItems();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroImages.length]);

  // Main GSAP animations
  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      // Create a timeline for initial page load
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Hero section animations
      if (heroRef.current) {
        // Animate hero background with scale effect
        tl.fromTo(
          heroRef.current,
          { scale: 1.2, opacity: 0 },
          { scale: 1, opacity: 1, duration: 1.5 }
        );
      }

      if (heroTextRef.current) {
        const heroElements = heroTextRef.current.querySelectorAll("h1, p");
        tl.fromTo(
          heroElements,
          { y: 80, opacity: 0 },
          { y: 0, opacity: 1, duration: 1, stagger: 0.2 },
          "-=1"
        );
      }

      // Info section animations with scroll trigger
      if (infoCardsRef.current.length > 0) {
        gsap.fromTo(
          ".infoSectionTitle",
          { y: 50, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1,
            scrollTrigger: {
              trigger: ".infoSectionTitle",
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        infoCardsRef.current.forEach((card, index) => {
          if (card) {
            gsap.fromTo(
              card,
              {
                y: 100,
                opacity: 0,
                scale: 0.8,
                rotateX: -15,
              },
              {
                y: 0,
                opacity: 1,
                scale: 1,
                rotateX: 0,
                duration: 0.8,
                delay: index * 0.15,
                scrollTrigger: {
                  trigger: card,
                  start: "top 85%",
                  toggleActions: "play none none reverse",
                },
              }
            );

            // Hover animation for info cards
            card.addEventListener("mouseenter", () => {
              gsap.to(card, {
                y: -10,
                scale: 1.05,
                duration: 0.3,
                ease: "power2.out",
              });
            });

            card.addEventListener("mouseleave", () => {
              gsap.to(card, {
                y: 0,
                scale: 1,
                duration: 0.3,
                ease: "power2.out",
              });
            });
          }
        });
      }

      // Main title animation
      if (mainTitleRef.current) {
        gsap.fromTo(
          mainTitleRef.current,
          {
            y: 80,
            opacity: 0,
            clipPath: "polygon(0 0, 100% 0, 100% 0, 0 0)",
          },
          {
            y: 0,
            opacity: 1,
            clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
            duration: 1.2,
            scrollTrigger: {
              trigger: mainTitleRef.current,
              start: "top 85%",
              toggleActions: "play none none reverse",
            },
          }
        );
      }

      // Portfolio cards animations - optimized for performance
      sectionsRef.current.forEach((section, index) => {
        if (section) {
          // Simple, fast card entrance animation
          gsap.fromTo(
            section,
            {
              opacity: 0,
              y: 40,
            },
            {
              opacity: 1,
              y: 0,
              duration: 0.5,
              ease: "power1.out",
              scrollTrigger: {
                trigger: section,
                start: "top 90%",
                toggleActions: "play none none none",
              },
            }
          );

          // Faster hover animations with no lag
          const image = section.querySelector(`.${styles.cardImage}`);

          section.addEventListener("mouseenter", () => {
            gsap.to(section, {
              y: -8,
              duration: 0.2,
              ease: "power1.out",
            });

            if (image) {
              gsap.to(image, {
                scale: 1.05,
                duration: 0.3,
                ease: "power1.out",
              });
            }
          });

          section.addEventListener("mouseleave", () => {
            gsap.to(section, {
              y: 0,
              duration: 0.2,
              ease: "power1.out",
            });

            if (image) {
              gsap.to(image, {
                scale: 1,
                duration: 0.3,
                ease: "power1.out",
              });
            }
          });
        }
      });

      // CTA section animation
      if (ctaRef.current) {
        const ctaElements = ctaRef.current.querySelectorAll("h2, p, a");
        gsap.fromTo(
          ctaElements,
          { y: 60, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.2,
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse",
            },
          }
        );

        // CTA button pulse animation
        const ctaButton = ctaRef.current.querySelector("a");
        if (ctaButton) {
          gsap.to(ctaButton, {
            scale: 1.05,
            duration: 0.8,
            repeat: -1,
            yoyo: true,
            ease: "power1.inOut",
          });
        }
      }
    };

    if (!loading) {
      loadGSAP();
    }
  }, [portfolioItems, loading]);

  return (
    <ReactLenis root options={{ lerp: 0.1, smooth: true, duration: 2 }}>
      <div className={styles.container}>
        <section ref={heroRef} className={styles.hero}>
          <div className={styles.sliderContainer}>
            {heroImages.map((image, index) => (
              <div
                key={index}
                className={`${styles.slide} ${
                  index === currentSlide ? styles.slideActive : ""
                }`}
                style={{ backgroundImage: `url(${image})` }}
              />
            ))}
          </div>
          <div ref={heroTextRef} className={styles.heroOverlay}>
            <h1>Transform Your Outdoor Spaces</h1>
            <p>
              Discover our premium collection of tensile structures and shading
              solutions
            </p>
            <div className={styles.sliderDots}>
              {heroImages.map((_, index) => (
                <button
                  key={index}
                  className={`${styles.dot} ${
                    index === currentSlide ? styles.dotActive : ""
                  }`}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </section>

        <section className={styles.infoSection}>
          <div className={styles.infoContent}>
            <h2 className="infoSectionTitle">
              Why Choose La Fabrica Exteriors?
            </h2>
            <div className={styles.infoGrid}>
              <div
                ref={(el) => (infoCardsRef.current[0] = el)}
                className={styles.infoCard}
              >
                <div className={styles.infoIcon}>🏆</div>
                <h3>Premium Quality</h3>
                <p>
                  We use only the finest materials and cutting-edge engineering
                  to ensure lasting beauty and durability.
                </p>
              </div>
              <div
                ref={(el) => (infoCardsRef.current[1] = el)}
                className={styles.infoCard}
              >
                <div className={styles.infoIcon}>✨</div>
                <h3>Custom Design</h3>
                <p>
                  Every project is tailored to your unique vision, space, and
                  requirements.
                </p>
              </div>
              <div
                ref={(el) => (infoCardsRef.current[2] = el)}
                className={styles.infoCard}
              >
                <div className={styles.infoIcon}>🛠️</div>
                <h3>Expert Installation</h3>
                <p>
                  Our experienced team ensures flawless installation and
                  long-term performance.
                </p>
              </div>
              <div
                ref={(el) => (infoCardsRef.current[3] = el)}
                className={styles.infoCard}
              >
                <div className={styles.infoIcon}>💯</div>
                <h3>Satisfaction Guaranteed</h3>
                <p>
                  We stand behind our work with comprehensive warranties and
                  ongoing support.
                </p>
              </div>
            </div>
          </div>
        </section>

        <main className={styles.main}>
          <h2 ref={mainTitleRef} className={styles.mainTitle}>
            Our Portfolio Categories
          </h2>

          {loading ? (
            <div className={styles.loadingContainer}>
              <div className={styles.spinner}></div>
              <p>Loading portfolio items...</p>
            </div>
          ) : error ? (
            <div className={styles.errorContainer}>
              <p className={styles.errorMessage}>{error}</p>
              <button
                onClick={() => window.location.reload()}
                className={styles.retryButton}
              >
                Retry
              </button>
            </div>
          ) : portfolioItems.length === 0 ? (
            <div className={styles.emptyContainer}>
              <p>No portfolio items available yet.</p>
              <Link href="/" className={styles.adminLink}>
                Go to Home Page
              </Link>
            </div>
          ) : (
            <div className={styles.portfolioGrid}>
              {portfolioItems.map((item, index) => (
                <article
                  key={item._id}
                  ref={(el) => (sectionsRef.current[index] = el)}
                  className={styles.portfolioCard}
                >
                  <div className={styles.cardImageContainer}>
                    <img
                      src={
                        item.images && item.images.length > 0
                          ? item.images[0].url
                          : `/placeholder.svg?height=400&width=600&query=${item.title}`
                      }
                      alt={item.title}
                      className={styles.cardImage}
                    />
                    <div className={styles.cardOverlay}>
                      <span className={styles.cardNumber}>
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{item.title}</h3>
                    <p className={styles.cardDescription}>
                      {item.hero_subheading}
                    </p>
                    <div className={styles.cardFooter}>
                      <Link
                        href={`/our-portfolio/${item.slug}`}
                        className={styles.cardLink}
                      >
                        Explore Details
                        <span className={styles.arrow}>→</span>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>

        <section ref={ctaRef} className={styles.cta}>
          <h2>Ready to Transform Your Space?</h2>
          <p>Get started with a free consultation today</p>
          <Link href="/contact-us" className={styles.ctaButton}>
            Contact Us
          </Link>
        </section>
      </div>
    </ReactLenis>
  );
}
