"use client";

import { motion } from "framer-motion";
import { useState, useRef } from "react";
import styles from "./animated-button.module.css";

const AnimatedButton = ({
  label,
  symbol,
  onClick,
  className = "",
  disabled = false,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const buttonRef = useRef(null);

  const handleMouseEnter = (e) => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const x = Math.max(
        0,
        Math.min(100, ((e.clientX - rect.left) / rect.width) * 100)
      );
      const y = Math.max(
        0,
        Math.min(100, ((e.clientY - rect.top) / rect.height) * 100)
      );
      setMousePosition({ x, y });
      // console.log("[v0] Mouse position:", {
      //   x,
      //   y,
      //   clientX: e.clientX,
      //   clientY: e.clientY,
      //   rect,
      // });
    }
    setIsHovered(true);
  };

  // Animation variants for the text sliding effect
  const textVariants = {
    initial: { y: 0 },
    hover: { y: -20 },
  };

  const textFromBottomVariants = {
    initial: { y: 20, opacity: 0 },
    hover: { y: 0, opacity: 1 },
  };

  // Animation variants for the symbol
  const symbolVariants = {
    initial: { y: 10, opacity: 0 },
    hover: { y: 0, opacity: 1 },
  };

  // Container variants for staggered letter animation
  const containerVariants = {
    initial: {},
    hover: {
      transition: {
        staggerChildren: 0.02,
      },
    },
  };

  const letterVariants = {
    initial: { y: 20, opacity: 0 },
    hover: { y: -0, opacity: 1 },
  };

  return (
    <motion.button
      ref={buttonRef}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={() => setIsHovered(false)}
      whileTap={{ scale: 0.98 }}
      aria-label={label}
      style={{
        "--mouse-x": `${mousePosition.x}%`,
        "--mouse-y": `${mousePosition.y}%`,
      }}
    >
      <motion.div
        className={styles.backgroundOverlay}
        initial={{ scale: 0, opacity: 0 }}
        animate={
          isHovered ? { scale: 8, opacity: 1 } : { scale: 0, opacity: 0 }
        }
        transition={{ duration: 0.5, ease: "easeOut" }}
      />

      <div className={styles.content}>
        {/* Original text that slides up */}
        <motion.span
          className={styles.originalText}
          variants={textVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {label}
        </motion.span>

        {/* Text that appears from bottom with letter-by-letter animation */}
        <motion.span
          className={styles.bottomText}
          variants={containerVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
        >
          {label.split("").map((letter, index) => (
            <motion.span
              key={index}
              variants={letterVariants}
              transition={{ duration: 0.2, ease: "easeOut" }}
              style={{ display: "inline-block" }}
            >
              {letter === " " ? "\u00A0" : letter}
            </motion.span>
          ))}
        </motion.span>

        {/* Symbol that fades in and slides up */}
        <motion.span
          className={styles.symbol}
          variants={symbolVariants}
          initial="initial"
          animate={isHovered ? "hover" : "initial"}
          transition={{ duration: 0.3, ease: "easeOut", delay: 0.1 }}
        >
          {symbol}
        </motion.span>
      </div>
    </motion.button>
  );
};

export default AnimatedButton;
