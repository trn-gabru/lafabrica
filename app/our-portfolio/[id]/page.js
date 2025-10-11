"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import styles from "./detail.module.css";
import { ReactLenis, useLenis } from "lenis/react";

export default function PortfolioDetailPage() {
  const lenis = useLenis(({ scroll }) => {});

  const params = useParams();
  const galleryRef = useRef([]);
  const featuresRef = useRef([]);
  const heroRef = useRef(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/portfolio/${params.id}`);

        if (!response.ok) {
          throw new Error("Portfolio item not found");
        }

        const result = await response.json();
        if (result.success) {
          setData(result.item);
        } else {
          throw new Error(result.error || "Failed to load portfolio item");
        }
      } catch (err) {
        console.error("[v0] Error fetching portfolio:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [params.id]);

  useEffect(() => {
    if (!data) return;

    const loadGSAP = async () => {
      const { gsap } = await import("gsap");
      const { ScrollTrigger } = await import("gsap/ScrollTrigger");

      gsap.registerPlugin(ScrollTrigger);

      if (heroRef.current) {
        gsap.fromTo(
          heroRef.current,
          { scale: 1.2, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 1.5,
            ease: "power3.out",
          }
        );
      }

      featuresRef.current.forEach((feature, index) => {
        if (feature) {
          gsap.fromTo(
            feature,
            { opacity: 0, y: 50, scale: 0.9 },
            {
              opacity: 1,
              y: 0,
              scale: 1,
              duration: 0.8,
              delay: index * 0.15,
              ease: "power2.out",
              scrollTrigger: {
                trigger: feature,
                start: "top 85%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });

      galleryRef.current.forEach((item, index) => {
        if (item) {
          gsap.fromTo(
            item,
            { opacity: 0, scale: 0.8, rotation: -5 },
            {
              opacity: 1,
              scale: 1,
              rotation: 0,
              duration: 0.8,
              delay: index * 0.1,
              ease: "back.out(1.2)",
              scrollTrigger: {
                trigger: item,
                start: "top 90%",
                toggleActions: "play none none reverse",
              },
            }
          );
        }
      });
    };

    loadGSAP();
  }, [data]);

  if (loading) {
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            La Fabrica Exteriors
          </Link>
          <nav className={styles.nav}>
            <Link href="/our-portfolio">Portfolio</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </header>
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>Loading...</h1>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={styles.container}>
        {/* <header className={styles.header}>
          <Link href="/" className={styles.logo}>
            La Fabrica Exteriors
          </Link>
          <nav className={styles.nav}>
            <Link href="/our-portfolio">Portfolio</Link>
            <Link href="/contact-us">Contact</Link>
          </nav>
        </header> */}
        <div style={{ padding: "4rem 2rem", textAlign: "center" }}>
          <h1>{error || "Portfolio category not found"}</h1>
          <Link
            href="/our-portfolio"
            style={{
              color: "var(--Primary-Gold)",
              marginTop: "1rem",
              display: "inline-block",
            }}
          >
            ← Back to Portfolio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ReactLenis root options={{ lerp: 0.1, smooth: true, duration: 2 }}>
      <div className={styles.container}>
        {/* <header className={styles.header}>
        <Link href="/" className={styles.logo}>
          La Fabrica Exteriors
        </Link>
        <nav className={styles.nav}>
          <Link href="/our-portfolio">Portfolio</Link>
          <Link href="/contact-us">Contact</Link>
        </nav>
      </header> */}

        <section className={styles.hero} ref={heroRef}>
          <img
            src={
              data.images && data.images.length > 0
                ? data.images[0].url
                : `/placeholder.svg?height=800&width=1600&query=${data.title}`
            }
            alt={data.title}
            className={styles.heroImage}
          />
          <div className={styles.heroOverlay}>
            <h1>{data.hero_heading}</h1>
            <p>{data.hero_subheading}</p>
          </div>
        </section>

        <main className={styles.main}>
          <section className={styles.introduction}>
            <p>{data.introduction}</p>
          </section>

          {data.features && data.features.length > 0 && (
            <section className={styles.features}>
              <h2>Key Features</h2>
              <div className={styles.featuresGrid}>
                {data.features.map((feature, index) => (
                  <div
                    key={index}
                    ref={(el) => (featuresRef.current[index] = el)}
                    className={styles.featureCard}
                  >
                    <h3>{feature.title}</h3>
                    <p>{feature.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {data.why_choose && (
            <section className={styles.whyChoose}>
              <h2>Why Choose This Solution?</h2>
              <p>{data.why_choose}</p>
            </section>
          )}

          {data.images && data.images.length > 0 && (
            <section className={styles.gallery}>
              <h2>Gallery</h2>
              <div className={styles.galleryGrid}>
                {data.images.slice(1).map((image, index) => (
                  <div
                    key={image._id || index}
                    ref={(el) => (galleryRef.current[index] = el)}
                    className={styles.galleryItem}
                  >
                    <img
                      src={image.url || "/placeholder.svg"}
                      alt={image.alt || `${data.title} ${index + 1}`}
                      title={image.title}
                    />
                  </div>
                ))}
              </div>
            </section>
          )}

          <section className={styles.cta}>
            <h2>Interested in {data.title}?</h2>
            <p>{data.cta}</p>
            <Link href="/contact-us" className={styles.ctaButton}>
              Request a Consultation
            </Link>
          </section>
        </main>

        {/* <footer className={styles.footer}>
        <p>&copy; 2025 La Fabrica Exteriors. All rights reserved.</p>
      </footer> */}
      </div>
    </ReactLenis>
  );
}
