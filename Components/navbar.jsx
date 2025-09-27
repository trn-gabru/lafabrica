"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import AnimatedButton from "./animated-button";
import styles from "./navbar.module.css";

export default function Navbar() {
  const [lastScrollY, setLastScrollY] = useState(0);
  const [show, setShow] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > 500) {
        if (currentScrollY > lastScrollY) {
          setShow(false); // scrolling down → hide
        } else {
          setShow(true); // scrolling up → show
        }
      } else {
        setShow(true); // always show above 500px
      }

      // collapsed look after small scroll
      setIsCollapsed(currentScrollY > 80);

      setLastScrollY(currentScrollY);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("keydown", handleKey);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("keydown", handleKey);
    };
  }, [lastScrollY]);

  const currentPath = usePathname() ?? "/";

  const DURATION = 0.25;
  const STAGGER = 0.02;

  const FlipLink = ({ children, href, onClick }) => {
    const label = typeof children === "string" ? children : String(children);

    const rowVariants = {
      initial: { y: "100%" },
      hovered: { y: "0%" },
    };

    return (
      <Link
        href={href}
        className={`${styles.flipLink} ${
          currentPath === href ? styles.active : ""
        }`}
        aria-current={currentPath === href ? "page" : undefined}
        onClick={onClick}
      >
        <motion.div
          className={styles.flipInner}
          initial="initial"
          whileHover="hovered"
        >
          {/* TOP row */}
          <div
            className={`${styles.flipRow} ${styles.top}`}
            aria-hidden="false"
          >
            {label.split("").map((ch, i) => (
              <motion.span
                className={styles.char}
                key={`top-${i}-${ch}`}
                variants={{
                  initial: { y: 0 },
                  hovered: { y: "-100%" },
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </div>

          {/* BOTTOM row */}
          <motion.div
            className={`${styles.flipRow} ${styles.bottom}`}
            variants={rowVariants}
            transition={{ duration: DURATION, ease: "easeInOut" }}
            aria-hidden="true"
          >
            {label.split("").map((ch, i) => (
              <motion.span
                className={styles.char}
                key={`bot-${i}-${ch}`}
                variants={{
                  initial: { y: "100%" },
                  hovered: { y: 0 },
                }}
                transition={{
                  duration: DURATION,
                  ease: "easeInOut",
                  delay: STAGGER * i + 0.02,
                }}
              >
                {ch === " " ? "\u00A0" : ch}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </Link>
    );
  };

  return (
    <motion.nav
      className={`${styles.navbar} ${
        isCollapsed ? styles.navbarCollapsed : ""
      }`}
      animate={{ y: show ? 0 : -80 }}
      transition={{ duration: 0.4, ease: "easeInOut" }}
    >
      <div className={styles.navContainer}>
        <div className={styles.logoDiv}>
          <Link href="/">
            <Image
              src="/logo-black.png"
              alt="logo"
              width={150}
              height={50}
              priority
              className={styles.logoImg}
            />
          </Link>
        </div>

        {/* Desktop/tablet inline links - hidden on small screens */}
        <div className={`${styles.navLinks} ${styles.hideOnMobile}`}>
          <FlipLink href="/">HOME</FlipLink>
          <FlipLink href="/about">ABOUT</FlipLink>
          <FlipLink href="/our-portfolio">OUR PORTFOLIO</FlipLink>
        </div>

        <div className={`${styles.navContacts} ${styles.hideOnMobile}`}>
          <Link href="/contact">
            <AnimatedButton label="Contact Us" symbol="→" />
          </Link>
        </div>

        {/* Menu toggle - visible on tablet/mobile */}
        <button
          className={`${styles.menuToggle} ${isMenuOpen ? styles.open : ""} ${
            isMenuOpen ? styles.hiddenWhileOpen : ""
          }`}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-menu"
          onClick={() => setIsMenuOpen((v) => !v)}
        >
          <span className={styles.burger} aria-hidden="true">
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
            <span className={styles.burgerLine} />
          </span>
        </button>
      </div>

      {/* Backdrop overlay */}
      <div
        className={`${styles.overlay} ${isMenuOpen ? styles.open : ""}`}
        onClick={() => setIsMenuOpen(false)}
        aria-hidden={!isMenuOpen}
      />

      {/* Mobile drawer menu - slides in from left with fade */}
      <div
        id="mobile-menu"
        className={`${styles.mobileMenu} ${isMenuOpen ? styles.open : ""}`}
        role="dialog"
        aria-modal="true"
        aria-label="Navigation Menu"
      >
        <div className={styles.mobileTop}>
          <Link href="/" onClick={() => setIsMenuOpen(false)} aria-label="Home">
            <Image
              src="/logo-black.png"
              alt="logo"
              width={150}
              height={50}
              priority
              className={styles.logoImg}
            />
          </Link>
          <button
            type="button"
            className={styles.closeBtn}
            aria-label="Close menu"
            onClick={() => setIsMenuOpen(false)}
          >
            <span className={styles.closeLine} aria-hidden="true" />
            <span className={styles.closeLine} aria-hidden="true" />
          </button>
        </div>
        <nav
          className={styles.mobileLinks}
          role="navigation"
          aria-label="Mobile Navigation"
        >
          <FlipLink href="/" onClick={() => setIsMenuOpen(false)}>
            HOME
          </FlipLink>
          <FlipLink href="/about" onClick={() => setIsMenuOpen(false)}>
            ABOUT
          </FlipLink>
          <FlipLink href="/our-portfolio" onClick={() => setIsMenuOpen(false)}>
            OUR PORTFOLIO
          </FlipLink>
        </nav>

        <div className={styles.mobileContacts}>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
            <AnimatedButton label="Contact Us" symbol="→" />
          </Link>
        </div>
      </div>
    </motion.nav>
  );
}
