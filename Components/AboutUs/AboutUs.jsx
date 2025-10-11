"use client";

import { useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import styles from "./AboutUs.module.css";
import WhatWeDo from "./WhatWeDo";
import AnimatedButton from "../animated-button";
import Link from "next/link";

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

  const [openAccordion, setOpenAccordion] = useState(null);

  useEffect(() => {
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
        const text = element.getAttribute("data-text") || "";
        if (!text) return;
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

      const sections = [
        storyRef,
        philosophyRef,
        servicesRef,
        whyUsRef,
        teamRef,
        ctaRef,
      ];

      sections.forEach((sectionRef) => {
        if (sectionRef.current) {
          gsap.to(sectionRef.current.querySelectorAll(".fade-up"), {
            opacity: 1,
            y: 0,
            duration: 1.5,
            ease: "power2.out",
            stagger: 0.3,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: "top 80%",
              once: true,
            },
          });
          gsap.set(sectionRef.current.querySelectorAll(".fade-up"), {
            opacity: 0,
            y: 80,
          });

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

      // New Services Section Hover Animation
      if (servicesRef.current) {
        gsap.utils
          .toArray(
            servicesRef.current.querySelectorAll(".horizontalServiceCard")
          )
          .forEach((card) => {
            const image = card.querySelector(".serviceCardImage");
            const overlay = card.querySelector(".serviceCardOverlay");
            const title = card.querySelector(".serviceCardTitle");
            const desc = card.querySelector(".serviceCardDescription");

            const tl = gsap.timeline({
              paused: true,
              defaults: { duration: 0.4, ease: "power2.out" },
            });

            tl.to(image, { opacity: 1, scale: 1 })
              .to(overlay, { opacity: 1 }, 0)
              .to(
                card,
                {
                  boxShadow: "0 20px 40px rgba(180, 144, 78, 0.3)",
                  y: -10,
                },
                0
              )
              .to([title, desc], { color: "white" }, 0);

            card.addEventListener("mouseenter", () => tl.play());
            card.addEventListener("mouseleave", () => tl.reverse());
          });

        // Add the scroll trigger animation for the cards themselves
        gsap.from(
          servicesRef.current.querySelectorAll(".horizontalServiceCard"),
          {
            opacity: 0,
            y: 80,
            stagger: 0.1,
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: servicesRef.current.querySelector(".servicesGrid"),
              start: "top 80%",
              once: true,
            },
          }
        );
      }

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

      ScrollTrigger.refresh();
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, []);

  const toggleAccordion = (index) => {
    setOpenAccordion(openAccordion === index ? null : index);
  };

  // const services = [
  //   {
  //     title: "Custom Design & Engineering",
  //     image: "/modern-tensile-structure-design-blueprints.jpg",
  //     description: "Precision-engineered designs tailored to your space",
  //     icon: "📐",
  //   },
  //   {
  //     title: "Canopy Installation",
  //     image: "/elegant-outdoor-canopy-installation.jpg",
  //     description: "Beautiful shade solutions for homes and businesses",
  //     icon: "🏗️",
  //   },
  //   {
  //     title: "Industrial Solutions",
  //     image: "/large-industrial-shade-structure.jpg",
  //     description: "Heavy-duty structures for industrial facilities",
  //     icon: "🏭",
  //   },
  //   {
  //     title: "Fabric Structures",
  //     image: "/modern-architectural-fabric-structure.jpg",
  //     description: "Innovative fabric architecture",
  //     icon: "🎨",
  //   },
  //   {
  //     title: "Maintenance & Repair",
  //     image: "/professional-maintenance-of-tensile-structure.jpg",
  //     description: "Ongoing support for your structures",
  //     icon: "🔧",
  //   },
  //   {
  //     title: "Consultation",
  //     image: "/professional-consultation-meeting-blueprints.jpg",
  //     description: "Expert guidance from concept to completion",
  //     icon: "💼",
  //   },
  // ]

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
            className={`${styles.storyImage} parallax-bg`}
          />
        </div>
        <div className={`${styles.storyOverlay} ${styles.heroOverlay}`}></div>

        <div className={`${styles.storyContent} ${styles.heroContent}`}>
          <div className={`hero-content ${styles.heroText}`}>
            <div className={styles.estBadgeContainer}>
              <div className={styles.estBadge}>
                <span className={styles.estBadgeText}>EST. 2002</span>
                <div className={styles.estBadgeGradient}></div>
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

            <Link href="/contact-us">
              <button
                className={`${styles.primaryButton} ${styles.heroButton}`}
              >
                Get in Touch
              </button>
            </Link>
          </div>
        </div>

        <div className={styles.scrollIndicator}>
          <div className={styles.scrollIndicatorContent}>
            <span className={styles.scrollIndicatorText}>SCROLL</span>
            <div className={styles.scrollIndicatorLine}></div>
          </div>
        </div>
      </section>

      <section
        ref={storyRef}
        className={`${styles.storySection} ${styles.offGoldSection}`}
      >
        <div className={styles.chapterSection}>
          <div className={`fade-up ${styles.storyImageFrame}`}>
            <img
              src="/Images/about/art-exhibition-with-colorful-shapes.jpg"
              alt="Pune skyline and small workshop"
              className={styles.storyImageInner}
            />
            <div className={styles.storyImageShadow}></div>
          </div>

          <div className={`fade-up ${styles.chapterContent}`}>
            <div className={styles.storyText}>
              <div className={styles.chapterIconContainer}>
                <span className={styles.chapterIcon}>❦</span>
              </div>

              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Story"
              ></h2>

              <div className={styles.chapterParagraphs}>
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
            <div className={`fade-up ${styles.philosophyHeader}`}>
              <div className={styles.philosophyIconContainer}>
                <span className={styles.philosophyIcon}>⚜</span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Philosophy"
              ></h2>
              <p
                className={`${styles.chapterDescription} ${styles.philosophyHeaderText}`}
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
              >
                <div className={`card-shadow ${styles.cardShadowEffect}`}></div>
                <div className={styles.cardContent}>
                  <div className={styles.principleIcon}>{principle.icon}</div>
                  <h3 className={styles.principleTitle}>{principle.title}</h3>
                  <p className={styles.principleDescription}>
                    {principle.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* <section ref={servicesRef} className={`${styles.storySection} ${styles.offGoldSection}`}>
        <div className={styles.storyContent}>
          <div className={styles.servicesContainer}>
            <div className={`fade-up ${styles.servicesHeader}`}>
              <div className={styles.philosophyIconContainer}>
                <span className={styles.servicesIcon}>⚙</span>
              </div>
              <h2 className={`${styles.chapterTitle} typewriter-text`} data-text="What We Do"></h2>
              <p className={`${styles.chapterDescription} ${styles.philosophyHeaderText}`}>
                Comprehensive tensile structure and shading solutions from design to installation.
              </p>
            </div>

            <div className={`${styles.servicesGrid} servicesGrid`}>
              {services.map((service, index) => (
                  <div key={index} className={`${styles.horizontalServiceCard} horizontalServiceCard`}>
                      <img src={service.image} alt={service.title} className={`${styles.serviceCardImage} serviceCardImage`} />
                      <div className={`${styles.serviceCardOverlay} serviceCardOverlay`}></div>
                      <div className={`${styles.serviceCardContent} serviceCardContent`}>
                          <div className={`${styles.serviceCardIcon} serviceCardIcon`}>{service.icon}</div>
                          <h3 className={`${styles.serviceCardTitle} serviceCardTitle`}>{service.title}</h3>
                          <p className={`${styles.serviceCardDescription} serviceCardDescription`}>{service.description}</p>
                      </div>
                  </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}

      <WhatWeDo />

      <section
        ref={whyUsRef}
        className={`${styles.storySection} ${styles.blueSection}`}
      >
        <div className={styles.storyContent}>
          <div className={styles.whyUsContainer}>
            <div className={`fade-up ${styles.whyUsHeader}`}>
              <div className={styles.whyUsIconContainer}>
                <span className={styles.whyUsIcon}>★</span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Why Clients Choose Us"
              ></h2>
            </div>

            <div className={`fade-up ${styles.accordionContainer}`}>
              {[
                {
                  title: "Craftsmanship & Engineering",
                  description:
                    "Perfect blend of traditional craftsmanship with modern engineering precision. Our team combines decades of hands-on experience with cutting-edge design software and structural analysis tools. Every project undergoes rigorous quality checks to ensure it meets our exacting standards and exceeds industry requirements.",
                },
                {
                  title: "Local Experience",
                  description:
                    "Deep understanding of Maharashtra's climate and architectural requirements. We've worked extensively across the region and know exactly how to design structures that withstand monsoon rains, intense summer heat, and varying wind conditions. Our local expertise means faster project completion and solutions perfectly suited to your environment.",
                },
                {
                  title: "Turnkey Delivery",
                  description:
                    "Complete project management from design to installation and beyond. We handle every aspect including site surveys, permits, fabrication, installation, and post-installation support. You get a single point of contact throughout the entire process, eliminating coordination headaches and ensuring seamless execution.",
                },
                {
                  title: "Quick, Accurate Installations",
                  description:
                    "Efficient installation process with minimal disruption to your operations. Our experienced installation teams work systematically to complete projects on schedule while maintaining the highest safety standards. We pre-fabricate components in our workshop to reduce on-site time and ensure precision assembly.",
                },
                {
                  title: "Transparent Pricing & Support",
                  description:
                    "Clear, upfront pricing with ongoing support and maintenance services. No hidden costs or surprise charges—you'll know exactly what to expect from day one. Our comprehensive warranty and maintenance programs ensure your investment is protected for years to come, with responsive service whenever you need it.",
                },
              ].map((point, index) => (
                <div key={index} className={styles.accordionItem}>
                  <button
                    onClick={() => toggleAccordion(index)}
                    className={styles.accordionButton}
                  >
                    <div className={styles.accordionButtonContent}>
                      <div className={styles.accordionNumberCircle}>
                        <span className={styles.accordionNumber}>
                          {index + 1}
                        </span>
                      </div>
                      <h3 className={styles.accordionTitle}>{point.title}</h3>
                    </div>
                    <ChevronDown
                      className={`${styles.accordionChevron} ${
                        openAccordion === index
                          ? styles.accordionChevronOpen
                          : ""
                      }`}
                    />
                  </button>

                  <div
                    className={`${styles.accordionContentWrapper} ${
                      openAccordion === index
                        ? styles.accordionContentWrapperOpen
                        : ""
                    }`}
                  >
                    <div className={styles.accordionContent}>
                      {point.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section
        ref={teamRef}
        className={`${styles.storySection} ${styles.offGoldSection}`}
      >
        <div className={styles.chapterSection}>
          <div className={`fade-up ${styles.chapterContent}`}>
            <div className={styles.storyText}>
              <div className={styles.teamIconContainer}>
                <span className={styles.teamIcon}>👥</span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our Team"
              ></h2>
              <div className={styles.teamParagraphs}>
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
              <div className={styles.teamImageFrame}>
                <img
                  src="/Images/about/invadingkingdom-pdRpNwIJMGQ-unsplash.jpg"
                  alt="La Fabrica Exteriors team"
                  className={styles.teamImage}
                />
                <div className={styles.teamImageShadow}></div>
              </div>
            </div>
          </div>

          <div className={`fade-up ${styles.chapterContent}`}>
            <div className={styles.storyText}>
              <div className={styles.teamIconContainer}>
                <span className={styles.journeyIcon}>⏳</span>
              </div>
              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Our journey"
              ></h2>

              <div className={`timeline-container ${styles.timeline}`}>
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
                    className={`timeline-item ${styles.timelineItem}`}
                  >
                    <div className={styles.timelineYearContainer}>
                      <div className={styles.timelineYearCircle}>
                        <span className={styles.timelineYear}>
                          {milestone.year}
                        </span>
                      </div>
                    </div>
                    <div className={styles.timelineContent}>
                      <h3 className={styles.timelineTitle}>
                        {milestone.title}
                      </h3>
                      <p className={styles.timelineDescription}>
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
            className={`${styles.storyImage} parallax-bg`}
          />
        </div>
        <div className={`${styles.storyOverlay} ${styles.futureOverlay}`}></div>

        <div className={styles.storyContent}>
          <div className={`fade-up ${styles.futureContent}`}>
            <div className={styles.futureText}>
              <div className={styles.ctaIconContainer}>
                <span className={styles.ctaIcon}>✦</span>
              </div>

              <h2
                className={`${styles.chapterTitle} typewriter-text`}
                data-text="Ready to Start?"
              ></h2>

              <p className={styles.futureDescription}>
                Let's talk about your site, shade goals and budget.
              </p>

              <Link href="/contact-us">
                <button
                  className={`${styles.primaryButton} ${styles.ctaButton}`}
                >
                  Get In Touch
                </button>
              </Link>
              <div className={styles.ctaInfoBox}>
                <p className={styles.ctaInfoText}>
                  Call us at{" "}
                  <span className={styles.ctaInfoHighlight}>
                    +91 - 9921 69 5909
                  </span>{" "}
                  or email{" "}
                  <span className={styles.ctaInfoHighlight}>
                    inquiries@lafabrica.co.in
                  </span>{" "}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
