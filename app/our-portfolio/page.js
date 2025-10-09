"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./portfolio.module.css";

export default function PortfolioPage() {
  const sectionsRef = useRef([]);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const heroImages = [
    "/placeholder.svg?height=800&width=1600",
    "/placeholder.svg?height=800&width=1600",
    "/placeholder.svg?height=800&width=1600",
    "/placeholder.svg?height=800&width=1600",
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

  useEffect(() => {
    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      sectionsRef.current.forEach((section, index) => {
        if (section) {
          gsap.fromTo(
            section,
            { opacity: 0, y: 100 },
            {
              opacity: 1,
              y: 0,
              duration: 1.2,
              ease: "power3.out",
              scrollTrigger: {
                trigger: section,
                start: "top 85%",
                end: "bottom 20%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    };

    loadGSAP();
  }, [portfolioItems]);

  return (
    <div className={styles.container}>
      {/* <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          La Fabrica Exteriors
        </Link>
        <nav className={styles.nav}>
          <Link href="/our-portfolio">Portfolio</Link>
          <Link href="/contact-us">Contact</Link>
          <Link href="/admin">Admin</Link>
        </nav>
      </header> */}

      <section className={styles.hero}>
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
        <div className={styles.heroOverlay}>
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
          <h2>Why Choose La Fabrica Exteriors?</h2>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🏆</div>
              <h3>Premium Quality</h3>
              <p>
                We use only the finest materials and cutting-edge engineering to
                ensure lasting beauty and durability.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>✨</div>
              <h3>Custom Design</h3>
              <p>
                Every project is tailored to your unique vision, space, and
                requirements.
              </p>
            </div>
            <div className={styles.infoCard}>
              <div className={styles.infoIcon}>🛠️</div>
              <h3>Expert Installation</h3>
              <p>
                Our experienced team ensures flawless installation and long-term
                performance.
              </p>
            </div>
            <div className={styles.infoCard}>
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
        <h2 className={styles.mainTitle}>Our Portfolio Categories</h2>

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
            <Link href="/admin" className={styles.adminLink}>
              Go to Admin Panel to add items
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

      <section className={styles.cta}>
        <h2>Ready to Transform Your Space?</h2>
        <p>Get started with a free consultation today</p>
        <Link href="/contact-us" className={styles.ctaButton}>
          Contact Us
        </Link>
      </section>

      {/* <footer className={styles.footer}>
        <p>&copy; 2025 La Fabrica Exteriors. All rights reserved.</p>
      </footer> */}
    </div>
  );
}
