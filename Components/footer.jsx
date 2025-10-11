"use client";
import { motion } from "framer-motion";
import styles from "./footer.module.css";
import AnimatedButton from "./animated-button";
import { useRouter } from "next/navigation";

const FlipLink = ({ children, href, className = "" }) => {
  const DURATION = 0.25;
  const STAGGER = 0.02;

  // row variant for bottom row (so parent moves into view)
  const rowVariants = {
    initial: { y: "100%" }, // keep bottom row out of view by default
    hovered: { y: "0%" },
  };

  return (
    <a href={href} className={`${styles.flipLink} ${className}`}>
      <motion.div
        className={styles.flipInner}
        initial="initial"
        whileHover="hovered"
      >
        {/* TOP row */}
        <div className={styles.flipRowTop} aria-hidden="false">
          {children.split("").map((ch, i) => (
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

        {/* BOTTOM row: motion element so it moves up as a whole + its chars animate */}
        <motion.div
          className={styles.flipRowBottom}
          variants={rowVariants}
          transition={{ duration: DURATION, ease: "easeInOut" }}
          aria-hidden="true"
        >
          {children.split("").map((ch, i) => (
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
                delay: STAGGER * i + 0.02, // slight offset so parent and chars feel natural
              }}
            >
              {ch === " " ? "\u00A0" : ch}
            </motion.span>
          ))}
        </motion.div>
      </motion.div>
    </a>
  );
};

export default function Footer() {
  const router = useRouter();

  const handleContactClick = () => {
    router.push(`/contact-us`);
  };
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        {/* Logo and Tagline Section */}
        <div className={styles.logoSection}>
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              {/* <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
                <path
                  d="M20 5L35 15V25L20 35L5 25V15L20 5Z"
                  fill="#0ea5e9"
                  stroke="#0ea5e9"
                  strokeWidth="2"
                />
                <path d="M20 15L30 20V25L20 30L10 25V20L20 15Z" fill="white" />
              </svg> */}
              <img src="/logo-black.png" alt="" />
            </div>
            <div className={styles.logoText}>
              <p>Smart Solutions for a sustainable future</p>
            </div>
          </div>
          {/* <button className={styles.contactButton}>Contact Us</button> */}
          <AnimatedButton
            label="Contact Us"
            symbol="→"
            onClick={() => handleContactClick()}
          />
        </div>

        {/* Navigation and Contact Section */}
        <div className={styles.contentSection}>
          {/* Navigation Links */}
          <div className={styles.navSection}>
            <ul className={styles.navList}>
              <li>
                <FlipLink href="/">Home</FlipLink>
              </li>
              <li>
                <FlipLink href="/about">About</FlipLink>
              </li>
              <li>
                <FlipLink href="/portfolio">Portfolio</FlipLink>
              </li>
            </ul>
          </div>

          {/* Contact Information */}
          <div className={styles.contactSection}>
            <div className={styles.contactInfo}>
              <FlipLink href="tel:+919921695909" className={styles.phone}>
                +91 - 9921 69 5909
              </FlipLink>
              <FlipLink
                href="mailto:inquiries@lafabrica.co.in"
                className={styles.email}
              >
                inquiries@lafabrica.co.in
              </FlipLink>
              <address className={styles.address}>
                Shop No. 3 1st Floor Girme
                <br />
                Complex,Opp. Panchmukhī maruti
                <br />
                temple,Vadgaon Maval, Pune –<br />
                412106
              </address>
            </div>
          </div>

          {/* Social Media */}
          <div className={styles.socialSection}>
            <p className={styles.socialLabel}>Connect with us on :</p>
            <div className={styles.socialIcons}>
              <a href="#" className={styles.socialIcon} aria-label="Instagram">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="2"
                    y="2"
                    width="20"
                    height="20"
                    rx="5"
                    ry="5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <line
                    x1="17.5"
                    y1="6.5"
                    x2="17.51"
                    y2="6.5"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="Facebook">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </a>
              <a href="#" className={styles.socialIcon} aria-label="WhatsApp">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className={styles.bottomSection}>
          <div className={styles.bottomLinks}>
            <a href="/terms">Terms & Conditions</a>
            <span className={styles.copyright}>© 2025 LaFabrica</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
