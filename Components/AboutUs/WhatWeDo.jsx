import { useEffect, useRef, useState } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import styles from "./WhatWeDo.module.css"

gsap.registerPlugin(ScrollTrigger)

export default function WhatWeDo() {
  const [activeService, setActiveService] = useState(0)
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const sectionRef = useRef(null)
  const cardsRef = useRef([])
  const imageRef = useRef(null)

  const services = [
    {
      title: "Custom Design & Engineering",
      image: "/Images/about/denis-99puYGmCnmo-unsplash.jpg",
      description: "Precision-engineered designs tailored to your space",
    },
    {
      title: "Canopy Installation",
      image: "/Images/about/yanzheng-xia-TF2AnYe3LXw-unsplash.jpg",
      description: "Beautiful shade solutions for homes and businesses",
    },
    {
      title: "Industrial Solutions",
      image: "/large-industrial-shade-structure.jpg",
      description: "Heavy-duty structures for industrial facilities",
    },
    {
      title: "Fabric Structures",
      image: "/modern-architectural-fabric-structure.jpg",
      description: "Innovative fabric architecture",
    },
    {
      title: "Maintenance & Repair",
      image: "/professional-maintenance-of-tensile-structure.jpg",
      description: "Ongoing support for your structures",
    },
    {
      title: "Consultation",
      image: "/professional-consultation-meeting-blueprints.jpg",
      description: "Expert guidance from concept to completion",
    },
  ]

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Header animation
      gsap.fromTo(`.${styles.header}`, 
        { opacity: 0, y: 50 },
        {
          opacity: 1, 
          y: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: { 
            trigger: sectionRef.current, 
            start: "top 80%", 
            once: true 
          },
        }
      )
      
      // Cards stagger animation
      gsap.fromTo(cardsRef.current,
        { opacity: 0, x: -80 },
        {
          opacity: 1, 
          x: 0, 
          duration: 0.8, 
          stagger: 0.15, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )
      
      // Image container animation
      gsap.fromTo(`.${styles.imageContainer}`,
        { opacity: 0, x: 80 },
        {
          opacity: 1, 
          x: 0, 
          duration: 1, 
          ease: "power3.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 80%",
            once: true,
          },
        }
      )
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (isInitialLoad) {
      setIsInitialLoad(false);
      return;
    }
    if (imageRef.current) {
      gsap.fromTo(
        imageRef.current,
        { opacity: 0, scale: 0.95 },
        { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
      );
    }
  }, [activeService]);

  const handleServiceHover = (index) => {
    if (activeService === index) return;
    if (imageRef.current) {
      gsap.killTweensOf(imageRef.current);
      gsap.to(imageRef.current, {
        opacity: 0,
        scale: 0.95,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          setActiveService(index);
        },
      });
    }
  };

  return (
    <section ref={sectionRef} className={styles.section}>
      <div className={styles.container}>
        <div className={styles.header}>
          <div className={styles.iconContainer}><span className={styles.icon}>⚙</span></div>
          <h2 className={styles.title}>What We Do</h2>
          <p className={styles.subtitle}>Comprehensive tensile structure and shading solutions from design to installation.</p>
        </div>
        <div className={styles.contentGrid}>
          <div className={styles.cardsColumn}>
            {services.map((service, index) => (
              <div
                key={index}
                ref={(el) => (cardsRef.current[index] = el)}
                className={`${styles.serviceCard} ${activeService === index ? styles.activeCard : ""}`}
                onMouseEnter={() => handleServiceHover(index)}
              >
                <div className={styles.cardContent}>
                  <h3 className={styles.cardTitle}>{service.title}</h3>
                  <p className={styles.cardDescription}>{service.description}</p>
                </div>
                <div className={styles.cardNumber}>{String(index + 1).padStart(2, "0")}</div>
              </div>
            ))}
          </div>
          <div className={styles.imageColumn}>
            <div className={styles.imageContainer}>
              <div className={styles.imageWrapper}>
                <img
                  ref={imageRef}
                  src={services[activeService].image}
                  alt={services[activeService].title}
                  className={styles.image}
                />
                <div className={styles.imageOverlay}>
                  <div className={styles.overlayContent}>
                    <h4 className={styles.overlayTitle}>{services[activeService].title}</h4>
                  </div>
                </div>
              </div>
              <div className={styles.decorativeBorder}></div>
              <div className={styles.decorativeGlow}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}