"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import styles from "./contact.module.css";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    category: "",
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // Fetch categories from database
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setCategoriesLoading(true);
        const response = await fetch("/api/portfolio");
        const data = await response.json();

        if (data.success && data.items) {
          // Extract titles from portfolio items
          const titles = data.items.map((item) => item.title);
          setCategories(titles);
        }
      } catch (error) {
        console.error("[v0] Error fetching categories:", error);
        // Fallback to empty array if fetch fails
        setCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validatePhone = (phone) => {
    const re = /^[\d\s\-+()]+$/;
    return re.test(phone) && phone.replace(/\D/g, "").length >= 10;
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.mobile.trim()) {
      newErrors.mobile = "Mobile number is required";
    } else if (!validatePhone(formData.mobile)) {
      newErrors.mobile =
        "Please enter a valid phone number (at least 10 digits)";
    }

    if (!formData.category) {
      newErrors.category = "Please select a category";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: "",
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to submit inquiry");
      }

      setSubmitted(true);
      setFormData({ name: "", email: "", mobile: "", category: "" });

      setTimeout(() => setSubmitted(false), 5000);
    } catch (error) {
      console.error("[v0] Error submitting form:", error);
      setServerError(
        error.message || "Failed to submit inquiry. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

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

      <main className={styles.main}>
        <div className={styles.content}>
          <div className={styles.info}>
            <h1>Get in Touch</h1>
            <p>
              Ready to transform your outdoor space? Fill out the form and our
              team will get back to you within 24 hours.
            </p>

            <div className={styles.contactDetails}>
              <div className={styles.detailItem}>
                <h3>Email</h3>
                <p>info@lafabricaexteriors.com</p>
              </div>
              <div className={styles.detailItem}>
                <h3>Phone</h3>
                <p>1234 1234 00</p>
              </div>
              <div className={styles.detailItem}>
                <h3>Address</h3>
                <p>
                  123 Design Street
                  <br />
                  Architecture City, AC 12345
                </p>
              </div>
            </div>
          </div>

          <div className={styles.formWrapper}>
            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <h2>Request a Consultation</h2>

              {serverError && (
                <div className={styles.errorMessage}>{serverError}</div>
              )}

              <div className={styles.formGroup}>
                <label htmlFor="name">Name *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={errors.name ? styles.inputError : ""}
                  placeholder="Your full name"
                />
                {errors.name && (
                  <span className={styles.fieldError}>{errors.name}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? styles.inputError : ""}
                  placeholder="your.email@example.com"
                />
                {errors.email && (
                  <span className={styles.fieldError}>{errors.email}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="mobile">Mobile Number *</label>
                <input
                  type="tel"
                  id="mobile"
                  name="mobile"
                  value={formData.mobile}
                  onChange={handleChange}
                  className={errors.mobile ? styles.inputError : ""}
                  placeholder="+91-1234 1234 00"
                />
                {errors.mobile && (
                  <span className={styles.fieldError}>{errors.mobile}</span>
                )}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="category">Category of Interest *</label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className={errors.category ? styles.inputError : ""}
                  disabled={categoriesLoading}
                >
                  <option value="">
                    {categoriesLoading
                      ? "Loading categories..."
                      : "Select a category"}
                  </option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <span className={styles.fieldError}>{errors.category}</span>
                )}
              </div>

              <button
                type="submit"
                className={styles.submitButton}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Inquiry"}
              </button>

              {submitted && (
                <div className={styles.successMessage}>
                  Thank you! Your inquiry has been submitted successfully.
                </div>
              )}
            </form>
          </div>
        </div>
      </main>

      {/* <footer className={styles.footer}>
        <p>&copy; 2025 La Fabrica Exteriors. All rights reserved.</p>
      </footer> */}
    </div>
  );
}
