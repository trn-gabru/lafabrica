"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutUs.module.css";

gsap.registerPlugin(ScrollTrigger);

export default function AboutUs() {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const storyRef = useRef(null);
  const philosophyRef = useRef(null);
  const servicesRef = useRef(null);
  const whyUsRef = useRef(null);
  const teamRef = useRef(null);
  const ctaRef = useRef(null);

  useEffect(() => {
    // make sure we pass the actual DOM node (containerRef.current)
    const ctx = gsap.context(() => {
      // hero entrance
      gsap.from(heroRef.current?.querySelectorAll(".hero-content > *") || [], {
        opacity: 0,
        y: 100,
        duration: 1.8,
        ease: "power3.out",
        stagger: 0.4,
        delay: 1,
      });

      // typewriter — guarded and with a minimum duration
      gsap.utils.toArray(".typewriter-text").forEach((element) => {
        // Read from the new data-text attribute
        const text = element.getAttribute("data-text") || "";

        if (!text) return; // nothing to type

        const duration = Math.max(0.5, text.length * 0.06);

        gsap.to(element, {
          duration,
          ease: "none",
          onUpdate: function () {
            const progress = Math.round(this.progress() * text.length);
            element.textContent = text.substring(0, progress);
          },
          scrollTrigger: {
            trigger: element,
            start: "top 85%",
            once: true,
          },
        });
      });

      // parallax backgrounds
      gsap.utils.toArray(".parallax-bg").forEach((bg) => {
        gsap.to(bg, {
          yPercent: -20,
          ease: "none",
          scrollTrigger: {
            trigger: bg.parentElement,
            start: "top bottom",
            end: "bottom top",
            scrub: 2,
          },
        });
      });

      // the rest of your section animations...
      const sections = [
        storyRef,
        philosophyRef,
        servicesRef,
        whyUsRef,
        teamRef,
        ctaRef,
      ];

      // --- FIX: Logic for fade-up animations and vintage-card hover ---
      sections.forEach((sectionRef) => {
        if (sectionRef.current) {
          // *** FADE-UP ANIMATION DEFINITION ***
          // 👇 CONVERTED TO gsap.to() to animate to the final state
          gsap.to(sectionRef.current.querySelectorAll(".fade-up"), {
            opacity: 1, // Animate to full opacity
            y: 0, // Animate to y=0 (final position)
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
          // Set initial state outside of the animation for all .fade-up elements
          // (This should be redundant if you add the inline style in the JSX)
          gsap.set(sectionRef.current.querySelectorAll(".fade-up"), {
            opacity: 0,
            y: 80,
          });

          // vintage-card hover animation (no ScrollTrigger issue here)
          gsap.utils
            .toArray(sectionRef.current.querySelectorAll(".vintage-card"))
            .forEach((card) => {
              const tl = gsap.timeline({ paused: true });
              tl.to(card, { scale: 1.08, duration: 0.4, ease: "power2.out" });
              tl.to(
                card.querySelector(".card-shadow"),
                { opacity: 0.4, duration: 0.4 },
                0
              );

              card.addEventListener("mouseenter", () => tl.play());
              card.addEventListener("mouseleave", () => tl.reverse());
            });
        }
      });
      // --- END FIX ---

      // timeline items animation
      gsap.from(".timeline-item", {
        opacity: 0,
        x: -80,
        duration: 1.2,
        stagger: 0.4,
        ease: "power2.out",
        scrollTrigger: {
          trigger: ".timeline-container",
          start: "top 75%",
          once: true,
        },
      });

      // *** FIX: Call ScrollTrigger.refresh() only once after all animations are set up ***
      ScrollTrigger.refresh();
    }, containerRef.current); // <-- important

    return () => {
      // *** FIX: Rely on ctx.revert() for cleanup and remove the redundant ScrollTrigger.getAll()... ***
      ctx.revert();
    };
  }, []);

  return (
    <div ref={containerRef} className={styles.container}>
      <section
        ref={heroRef}
        className={`${styles.storySection} ${styles.heroSection}`}
      >
        <div className={styles.storyImage}>
          <img
            src="/Images/about/denis-99puYGmCnmo-unsplash.jpg"
            alt="Modern tensile structure workshop with steel beams and fabric installation"
            className={`${styles.storyImage} ${styles.parallaxBg}`}
          />
        </div>
        <div className={`${styles.storyOverlay} ${styles.heroOverlay}`}></div>

        <div className={`${styles.storyContent} ${styles.heroContent}`}>
          <div className={`hero-content ${styles.heroText}`}>
            <div style={{ marginBottom: "2rem", display: "inline-block" }}>
              <div
                style={{
                  position: "relative",
                  backgroundColor: "rgba(255, 215, 0, 0.1)",
                  backdropFilter: "blur(4px)",
                  border: "2px solid var(--Off-Gold)",
                  padding: "0.75rem 2rem",
                  borderRadius: "9999px",
                }}
              >
                <span
                  style={{
                    color: "var(--Off-Gold)",
                    fontFamily: "monospace",
                    fontSize: "0.875rem",
                    letterSpacing: "0.3em",
                    fontWeight: "bold",
                  }}
                >
                  EST. 2002
                </span>
                <div
                  style={{
                    position: "absolute",
                    inset: "-4px",
                    background:
                      "linear-gradient(to right, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05), rgba(255, 215, 0, 0.2))",
                    borderRadius: "9999px",
                    filter: "blur(4px)",
                  }}
                ></div>
              </div>
            </div>

            <h1 className={`${styles.heroTitle} typewriter-text`}>
              Engineering Beauty Since 2002
            </h1>

            <h2 className={styles.heroSubtitle}>
              {/* Engineering Beauty Since 2002 */}
            </h2>

            <p className={styles.heroDescription}>
              Designing and installing premium tensile and shading solutions —
              where geometry meets craftsmanship.
            </p>

            <button
              className={styles.primaryButton}
              style={{ marginTop: "3rem" }}
            >
              Get in Touch
            </button>
          </div>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: "2rem",
            left: "50%",
            transform: "translateX(-50%)",
            color: "rgba(255, 255, 255, 0.6)",
            animation: "bounce 2s infinite",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "0.5rem",
            }}
          >
            <span
              style={{
                fontSize: "0.875rem",
                fontFamily: "monospace",
                letterSpacing: "0.2em",
              }}
            >
              SCROLL
            </span>
            <div
              style={{
                width: "1px",
                height: "2rem",
                background:
                  "linear-gradient(to bottom, rgba(255, 255, 255, 0.6), transparent)",
              }}
            ></div>
          </div>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`${styles.storySection} ${styles.offGoldSection}`}
      >
        <div className={styles.chapterSection}>
          <div
            className="fade-up"
            style={{
              position: "relative",
              padding: "0.5rem",
              background:
                "linear-gradient(to bottom right, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))",
              borderRadius: "0.5rem",
              height: "100vh",
            }}
          >
            <img
              src="/Images/about/art-exhibition-with-colorful-shapes.jpg"
              alt="Pune skyline and small workshop"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                borderRadius: "0.375rem",
                boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: "-1rem",
                right: "-1rem",
                width: "100%",
                height: "100%",
                backgroundColor: "rgba(255, 215, 0, 0.1)",
                borderRadius: "0.5rem",
                zIndex: -1,
              }}
            ></div>
          </div>

          <div className={`${styles.chapterContent} fade-up`}>
            <div className={styles.storyText}>
              <div style={{ marginBottom: "1.5rem", textAlign: "center" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 215, 0, 0.4)",
                  }}
                >
                  ❦
                </span>
              </div>

              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Story" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                }}
              >
                <p className={styles.chapterDescription}>
                  La Fabrica Exteriors was founded in 2002 in Pune with a simple
                  mission: to create beautiful, functional outdoor spaces
                  through expertly designed and installed tensile structures and
                  shading solutions.
                </p>

                <p className={styles.chapterSubtext}>
                  What started as a small operation has grown into one of
                  Maharashtra's most trusted names in architectural fabric
                  structures. Our journey has been defined by an unwavering
                  commitment to quality craftsmanship, innovative design, and
                  exceptional customer service.
                </p>

                <p className={styles.chapterSubtext}>
                  Over two decades, we've completed hundreds of projects across
                  residential, commercial, and industrial sectors. From elegant
                  residential canopies to large-scale commercial installations,
                  each project reflects our dedication to combining engineering
                  precision with aesthetic beauty.
                </p>

                <p className={styles.chapterSubtext}>
                  Today, La Fabrica Exteriors continues to push the boundaries
                  of what's possible with tensile architecture, always staying
                  true to our founding principles of quality, reliability, and
                  customer satisfaction.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={philosophyRef}
        className={`${styles.storySection} ${styles.blackSection}`}
      >
        <div className={styles.storyContent}>
          <div className={styles.gridContainer}>
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                marginBottom: "3rem",
              }}
              className="fade-up"
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 215, 0, 0.6)",
                  }}
                >
                  ⚜
                </span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Philosophy" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>
              <p
                className={styles.chapterDescription}
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                At La Fabrica Exteriors, we believe that every structure should
                be a perfect marriage of form and function. Our approach is
                built on four fundamental principles that guide every project we
                undertake.
              </p>
            </div>

            {[
              {
                icon: "⚡",
                title: "Quality Over Quantity",
                description:
                  "We focus on delivering exceptional results rather than rushing through projects. Every detail matters.",
              },
              {
                icon: "🤝",
                title: "Client Partnership",
                description:
                  "We work closely with our clients throughout the entire process, ensuring their vision becomes reality.",
              },
              {
                icon: "💡",
                title: "Innovation",
                description:
                  "We continuously explore new materials, techniques, and designs to stay at the forefront of our industry.",
              },
              {
                icon: "🛡️",
                title: "Reliability",
                description:
                  "Our clients trust us to deliver on time, within budget, and to the highest standards of quality.",
              },
            ].map((principle, index) => (
              <div
                key={index}
                className={`vintage-card fade-up ${styles.gridCard}`}
                style={{ opacity: 0, transform: "translateY(80px)" }}
              >
                <div
                  className="card-shadow"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    borderRadius: "0.5rem",
                  }}
                ></div>
                <div style={{ position: "relative", zIndex: 10 }}>
                  <div
                    style={{
                      fontSize: "2.5rem",
                      marginBottom: "1rem",
                      color: "var(--primary)",
                    }}
                  >
                    {principle.icon}
                  </div>
                  <h3
                    style={{
                      fontSize: "1.25rem",
                      fontFamily: "var(--font-serif)",
                      fontWeight: "bold",
                      color: "var(--primary-black)",
                      marginBottom: "1rem",
                    }}
                  >
                    {principle.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      lineHeight: "1.6",
                    }}
                  >
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={servicesRef}
        className={`${styles.storySection} ${styles.offGoldSection}`}
      >
        <div className={styles.storyContent}>
          <div className={styles.gridContainer}>
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                marginBottom: "3rem",
              }}
              className="fade-up"
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 215, 0, 0.6)",
                  }}
                >
                  ⚙
                </span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="What We Do" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>
              <p
                className={styles.chapterDescription}
                style={{ maxWidth: "600px", margin: "0 auto" }}
              >
                We provide comprehensive tensile structure and shading
                solutions, handling every aspect from initial design
                consultation to final installation and maintenance.
              </p>
            </div>

            {[
              "Custom Tensile Structure Design & Engineering",
              "Residential & Commercial Canopy Installation",
              "Industrial Shade Solutions",
              "Architectural Fabric Structures",
              "Maintenance & Repair Services",
              "Consultation & Project Management",
            ].map((service, index) => (
              <div
                key={index}
                className={`vintage-card fade-up ${styles.gridCard}`}
              >
                <div
                  className="card-shadow"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 215, 0, 0.05)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    borderRadius: "0.5rem",
                  }}
                ></div>
                <div
                  style={{
                    position: "relative",
                    zIndex: 10,
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "rgba(255, 215, 0, 0.1)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      margin: "0 auto 1rem",
                    }}
                  >
                    <span
                      style={{ fontSize: "1.25rem", color: "var(--primary)" }}
                    >
                      ⚡
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1rem",
                      fontFamily: "var(--font-serif)",
                      fontWeight: "bold",
                      color: "var(--primary-black)",
                      lineHeight: "1.4",
                    }}
                  >
                    {service}
                  </h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={whyUsRef}
        className={`${styles.storySection} ${styles.blueSection}`}
      >
        <div className={styles.storyContent}>
          <div className={styles.gridContainer}>
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                marginBottom: "3rem",
              }}
              className="fade-up"
            >
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 255, 255, 0.6)",
                  }}
                >
                  ★
                </span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Why Clients Choose Us" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>
            </div>

            {[
              {
                title: "Craftsmanship & Engineering",
                description:
                  "Perfect blend of traditional craftsmanship with modern engineering precision.",
              },
              {
                title: "Local Experience",
                description:
                  "Deep understanding of Maharashtra's climate and architectural requirements.",
              },
              {
                title: "Turnkey Delivery",
                description:
                  "Complete project management from design to installation and beyond.",
              },
              {
                title: "Quick, Accurate Installations",
                description:
                  "Efficient installation process with minimal disruption to your operations.",
              },
              {
                title: "Transparent Pricing & Support",
                description:
                  "Clear, upfront pricing with ongoing support and maintenance services.",
              },
            ].map((point, index) => (
              <div
                key={index}
                className={`vintage-card fade-up ${styles.gridCard}`}
              >
                <div
                  className="card-shadow"
                  style={{
                    position: "absolute",
                    inset: 0,
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    opacity: 0,
                    transition: "opacity 0.3s",
                    borderRadius: "0.5rem",
                  }}
                ></div>
                <div style={{ position: "relative", zIndex: 10 }}>
                  <div
                    style={{
                      width: "2.5rem",
                      height: "2.5rem",
                      backgroundColor: "var(--primary)",
                      borderRadius: "50%",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      marginBottom: "1rem",
                    }}
                  >
                    <span
                      style={{
                        color: "white",
                        fontWeight: "bold",
                        fontSize: "1rem",
                      }}
                    >
                      {index + 1}
                    </span>
                  </div>
                  <h3
                    style={{
                      fontSize: "1.125rem",
                      fontFamily: "var(--font-serif)",
                      fontWeight: "bold",
                      color: "var(--primary-black)",
                      marginBottom: "0.75rem",
                    }}
                  >
                    {point.title}
                  </h3>
                  <p
                    style={{
                      color: "var(--muted-foreground)",
                      lineHeight: "1.6",
                      fontSize: "0.9rem",
                    }}
                  >
                    {point.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section
        ref={teamRef}
        className={`${styles.storySection} ${styles.offGoldSection}`}
      >
        <div className={styles.chapterSection}>
          <div className={`${styles.chapterContent} fade-up`}>
            <div className={styles.storyText}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 215, 0, 0.6)",
                  }}
                >
                  👥
                </span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Team" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                }}
              >
                <p className={styles.chapterDescription}>
                  Our team combines decades of experience in structural
                  engineering, fabric architecture, and project management. Led
                  by seasoned professionals who understand both the technical
                  and aesthetic aspects of tensile structures, we bring together
                  expertise in design, engineering, fabrication, and
                  installation.
                </p>
                <p className={styles.chapterSubtext}>
                  Every team member shares our commitment to excellence and
                  takes pride in delivering solutions that exceed client
                  expectations.
                </p>
              </div>
              <div
                style={{
                  position: "relative",
                  padding: "0.5rem",
                  background:
                    "linear-gradient(to bottom right, rgba(255, 215, 0, 0.2), rgba(255, 215, 0, 0.05))",
                  borderRadius: "0.5rem",
                }}
              >
                <img
                  src="/professional-team-of-engineers-and-installers-at-l.jpg"
                  alt="La Fabrica Exteriors team"
                  style={{
                    width: "100%",
                    height: "16rem",
                    objectFit: "cover",
                    borderRadius: "0.375rem",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "-0.5rem",
                    right: "-0.5rem",
                    width: "100%",
                    height: "100%",
                    backgroundColor: "rgba(255, 215, 0, 0.1)",
                    borderRadius: "0.5rem",
                    zIndex: -1,
                  }}
                ></div>
              </div>
            </div>
          </div>

          <div className={`${styles.chapterContent} fade-up`}>
            <div className={styles.storyText}>
              <div style={{ marginBottom: "1.5rem" }}>
                <span
                  style={{
                    fontSize: "3.75rem",
                    color: "rgba(255, 215, 0, 0.6)",
                  }}
                >
                  ⏳
                </span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our journey" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>

              <div
                className="timeline-container"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "2rem",
                }}
              >
                {[
                  {
                    year: "2002",
                    title: "The Beginning",
                    description:
                      "Founded in Pune with a vision to create beautiful, functional outdoor spaces.",
                  },
                  {
                    year: "2010s",
                    title: "Growth & Expansion",
                    description:
                      "Expanded operations across Maharashtra, completing hundreds of successful projects.",
                  },
                  {
                    year: "Today",
                    title: "Industry Leadership",
                    description:
                      "Recognized as one of Maharashtra's most trusted names in tensile architecture.",
                  },
                ].map((milestone, index) => (
                  <div
                    key={index}
                    className="timeline-item"
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: "1.5rem",
                    }}
                  >
                    <div style={{ flexShrink: 0 }}>
                      <div
                        style={{
                          width: "3rem",
                          height: "3rem",
                          backgroundColor: "var(--primary)",
                          borderRadius: "50%",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      >
                        <span
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: "0.75rem",
                          }}
                        >
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    <div style={{ flexGrow: 1 }}>
                      <h3
                        style={{
                          fontSize: "1.125rem",
                          fontFamily: "var(--font-serif)",
                          fontWeight: "bold",
                          color: "var(--primary-black)",
                          marginBottom: "0.5rem",
                        }}
                      >
                        {milestone.title}
                      </h3>
                      <p
                        style={{
                          color: "var(--muted-foreground)",
                          lineHeight: "1.6",
                          fontSize: "0.9rem",
                        }}
                      >
                        {milestone.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        ref={ctaRef}
        className={`${styles.storySection} ${styles.futureSection}`}
      >
        <div className={styles.storyImage}>
          <img
            src="/Images/about/yanzheng-xia-TF2AnYe3LXw-unsplash.jpg"
            alt="Beautiful tensile structure"
            className={`${styles.storyImage} ${styles.parallaxBg}`}
          />
        </div>
        <div className={`${styles.storyOverlay} ${styles.futureOverlay}`}></div>

        <div className={styles.storyContent}>
          <div className={`${styles.futureContent} fade-up`}>
            <div className={styles.futureText}>
              <div style={{ marginBottom: "2rem" }}>
                <span
                  style={{ fontSize: "4rem", color: "rgba(255, 215, 0, 0.6)" }}
                >
                  ✦
                </span>
              </div>

              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Ready to Start?" // Add the final text here
              >
                {/* Leave the content area empty */}
              </h2>

              <p className={styles.futureDescription}>
                Let's talk about your site, shade goals and budget.
              </p>

              <button
                className={styles.primaryButton}
                style={{ marginBottom: "3rem" }}
              >
                Request a Consultation
              </button>

              <div
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                  backdropFilter: "blur(4px)",
                  padding: "2rem",
                  maxWidth: "500px",
                  margin: "0 auto",
                  borderRadius: "0.5rem",
                  border: "1px solid rgba(255, 255, 255, 0.2)",
                }}
              >
                <p
                  style={{
                    color: "rgba(255, 255, 255, 0.8)",
                    lineHeight: "1.6",
                    fontSize: "0.9rem",
                  }}
                >
                  Call us at{" "}
                  <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                    [phone]
                  </span>{" "}
                  or email{" "}
                  <span style={{ color: "var(--primary)", fontWeight: "bold" }}>
                    [email]
                  </span>{" "}
                  — or use the form to upload photos and basic dimensions and
                  we'll respond with a tailored estimate.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
