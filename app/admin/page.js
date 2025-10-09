"use client";

import { useState, useEffect } from "react";
import styles from "./admin.module.css";
import ImageUploader from "@/components/ImageUploader";

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [activeTab, setActiveTab] = useState("inquiries");
  const [inquiries, setInquiries] = useState([]);
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("date-desc");
  const [filterCategory, setFilterCategory] = useState("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("adminToken");
      if (token) {
        try {
          const response = await fetch("/api/auth/verify", {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          if (response.ok) {
            setIsAuthenticated(true);
            loadInquiries();
            loadPortfolioItems();
          } else {
            localStorage.removeItem("adminToken");
          }
        } catch (error) {
          console.error("[v0] Auth verification error:", error);
          localStorage.removeItem("adminToken");
        }
      }
    };

    checkAuth();
  }, []);

  const loadInquiries = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch("/api/inquiries", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load inquiries");
      }

      const data = await response.json();
      setInquiries(data.inquiries || []);
    } catch (error) {
      console.error("[v0] Error loading inquiries:", error);
      setError("Failed to load inquiries. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadPortfolioItems = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/portfolio");

      if (!response.ok) {
        throw new Error("Failed to load portfolio items");
      }

      const data = await response.json();
      setPortfolioItems(data.items || []);

      // Extract categories (titles) from portfolio items
      const titles = data.items.map((item) => item.title);
      setCategories(titles);
    } catch (error) {
      console.error("[v0] Error loading portfolio items:", error);
      setError("Failed to load portfolio items. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Invalid credentials");
      }

      localStorage.setItem("adminToken", data.token);
      setIsAuthenticated(true);
      loadInquiries();
      loadPortfolioItems();
    } catch (error) {
      console.error("[v0] Login error:", error);
      setLoginError(error.message || "Invalid credentials. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("adminToken");
    setUsername("");
    setPassword("");
  };

  const getSortedAndFilteredInquiries = () => {
    let filtered = [...inquiries];

    if (filterCategory !== "all") {
      filtered = filtered.filter((inq) => inq.category === filterCategory);
    }

    filtered.sort((a, b) => {
      switch (sortBy) {
        case "date-desc":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "date-asc":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "category-asc":
          return a.category.localeCompare(b.category);
        case "category-desc":
          return b.category.localeCompare(a.category);
        default:
          return 0;
      }
    });

    return filtered;
  };

  const exportToCSV = () => {
    const data = getSortedAndFilteredInquiries();

    if (data.length === 0) {
      alert("No inquiries to export");
      return;
    }

    const headers = ["Name", "Email", "Mobile", "Category", "Date"];
    const csvContent = [
      headers.join(","),
      ...data.map((inq) =>
        [
          `"${inq.name}"`,
          `"${inq.email}"`,
          `"${inq.mobile}"`,
          `"${inq.category}"`,
          `"${new Date(inq.createdAt).toLocaleString()}"`,
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `inquiries-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  };

  if (!isAuthenticated) {
    return (
      <div className={styles.loginContainer}>
        <div className={styles.loginBox}>
          <h1>Admin Login</h1>
          {loginError && (
            <div className={styles.errorMessage}>{loginError}</div>
          )}
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.formGroup}>
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter username"
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter password"
              />
            </div>
            <button
              type="submit"
              className={styles.loginButton}
              disabled={loading}
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  const displayInquiries = getSortedAndFilteredInquiries();

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1>Admin Dashboard</h1>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </header>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${
            activeTab === "inquiries" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("inquiries")}
        >
          Inquiries
        </button>
        <button
          className={`${styles.tab} ${
            activeTab === "portfolio" ? styles.activeTab : ""
          }`}
          onClick={() => setActiveTab("portfolio")}
        >
          Portfolio CMS
        </button>
      </div>

      <main className={styles.main}>
        {error && <div className={styles.errorBanner}>{error}</div>}

        {activeTab === "inquiries" && (
          <>
            <div className={styles.controls}>
              <div className={styles.filterGroup}>
                <label htmlFor="sortBy">Sort By:</label>
                <select
                  id="sortBy"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date-desc">Date (Newest First)</option>
                  <option value="date-asc">Date (Oldest First)</option>
                  <option value="category-asc">Category (A-Z)</option>
                  <option value="category-desc">Category (Z-A)</option>
                </select>
              </div>

              <div className={styles.filterGroup}>
                <label htmlFor="filterCategory">Filter by Category:</label>
                <select
                  id="filterCategory"
                  value={filterCategory}
                  onChange={(e) => setFilterCategory(e.target.value)}
                >
                  <option value="all">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <button onClick={exportToCSV} className={styles.exportButton}>
                Export to CSV
              </button>
            </div>

            <div className={styles.stats}>
              <div className={styles.statCard}>
                <h3>Total Inquiries</h3>
                <p className={styles.statNumber}>{inquiries.length}</p>
              </div>
              <div className={styles.statCard}>
                <h3>Filtered Results</h3>
                <p className={styles.statNumber}>{displayInquiries.length}</p>
              </div>
            </div>

            <div className={styles.tableWrapper}>
              {loading ? (
                <div className={styles.loading}>Loading inquiries...</div>
              ) : displayInquiries.length === 0 ? (
                <div className={styles.noData}>
                  <p>No inquiries found</p>
                </div>
              ) : (
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Mobile</th>
                      <th>Category</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {displayInquiries.map((inquiry) => (
                      <tr key={inquiry._id}>
                        <td>{inquiry.name}</td>
                        <td>{inquiry.email}</td>
                        <td>{inquiry.mobile}</td>
                        <td>{inquiry.category}</td>
                        <td>{new Date(inquiry.createdAt).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </>
        )}

        {activeTab === "portfolio" && (
          <PortfolioCMS
            portfolioItems={portfolioItems}
            onRefresh={loadPortfolioItems}
            setError={setError}
          />
        )}
      </main>
    </div>
  );
}

function PortfolioCMS({ portfolioItems, onRefresh, setError }) {
  const [editingItem, setEditingItem] = useState(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  const handleDelete = async (slug) => {
    if (!confirm(`Are you sure you want to delete "${slug}"?`)) {
      return;
    }

    try {
      const token = localStorage.getItem("adminToken");
      const response = await fetch(`/api/portfolio/${slug}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to delete portfolio item");
      }

      alert("Portfolio item deleted successfully");
      onRefresh();
    } catch (error) {
      console.error("[v0] Error deleting portfolio item:", error);
      setError("Failed to delete portfolio item");
    }
  };

  return (
    <div className={styles.portfolioCMS}>
      <div className={styles.cmsHeader}>
        <h2>Portfolio Items</h2>
        <button
          className={styles.createButton}
          onClick={() => {
            setShowCreateForm(true);
            setEditingItem(null);
          }}
        >
          + Create New Portfolio Item
        </button>
      </div>

      {(showCreateForm || editingItem) && (
        <PortfolioForm
          item={editingItem}
          onClose={() => {
            setShowCreateForm(false);
            setEditingItem(null);
          }}
          onSuccess={() => {
            setShowCreateForm(false);
            setEditingItem(null);
            onRefresh();
          }}
          setError={setError}
        />
      )}

      <div className={styles.portfolioList}>
        {portfolioItems.map((item) => (
          <div key={item._id} className={styles.portfolioCard}>
            <div className={styles.portfolioCardHeader}>
              <h3>{item.title}</h3>
              <span className={styles.slug}>{item.slug}</span>
            </div>
            <p className={styles.portfolioIntro}>
              {item.introduction.substring(0, 150)}...
            </p>
            <div className={styles.portfolioMeta}>
              <span>{item.features?.length || 0} features</span>
              <span>{item.images?.length || 0} images</span>
            </div>
            <div className={styles.portfolioActions}>
              <button
                className={styles.editButton}
                onClick={() => {
                  setEditingItem(item);
                  setShowCreateForm(false);
                }}
              >
                Edit
              </button>
              <button
                className={styles.deleteButton}
                onClick={() => handleDelete(item.slug)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioForm({ item, onClose, onSuccess, setError }) {
  const [formData, setFormData] = useState(
    item || {
      slug: "",
      title: "",
      hero_heading: "",
      hero_subheading: "",
      introduction: "",
      why_choose: "",
      cta: "",
      features: [],
      images: [],
    }
  );
  const [loading, setLoading] = useState(false);
  const [newFeature, setNewFeature] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const token = localStorage.getItem("adminToken");
      const url = item ? `/api/portfolio/${item.slug}` : "/api/portfolio";
      const method = item ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to save portfolio item");
      }

      alert(`Portfolio item ${item ? "updated" : "created"} successfully`);
      onSuccess();
    } catch (error) {
      console.error("[v0] Error saving portfolio item:", error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const addFeature = () => {
    if (!newFeature.title || !newFeature.description) {
      alert("Please fill in both feature title and description");
      return;
    }
    setFormData({
      ...formData,
      features: [...formData.features, newFeature],
    });
    setNewFeature({ title: "", description: "" });
  };

  const removeFeature = (index) => {
    setFormData({
      ...formData,
      features: formData.features.filter((_, i) => i !== index),
    });
  };

  const handleImagesUpdate = (images) => {
    setFormData({
      ...formData,
      images: images.map((img, index) => ({ ...img, order: index })),
    });
  };

  return (
    <div className={styles.formOverlay}>
      <div className={styles.formModal}>
        <div className={styles.formHeader}>
          <h2>{item ? "Edit Portfolio Item" : "Create New Portfolio Item"}</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.portfolioForm}>
          <div className={styles.formSection}>
            <h3>Basic Information</h3>
            <div className={styles.formRow}>
              <div className={styles.formGroup}>
                <label>Slug (URL-friendly)*</label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({ ...formData, slug: e.target.value })
                  }
                  required
                  placeholder="tensile-canopy-structures"
                  disabled={!!item}
                />
              </div>
              <div className={styles.formGroup}>
                <label>Title*</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  placeholder="Tensile Canopy Structures"
                />
              </div>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Hero Section</h3>
            <div className={styles.formGroup}>
              <label>Hero Heading*</label>
              <input
                type="text"
                value={formData.hero_heading}
                onChange={(e) =>
                  setFormData({ ...formData, hero_heading: e.target.value })
                }
                required
                placeholder="Durable Tensile Canopies for Every Space"
              />
            </div>
            <div className={styles.formGroup}>
              <label>Hero Subheading*</label>
              <input
                type="text"
                value={formData.hero_subheading}
                onChange={(e) =>
                  setFormData({ ...formData, hero_subheading: e.target.value })
                }
                required
                placeholder="Modern shade solutions that combine beauty with functionality"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Content</h3>
            <div className={styles.formGroup}>
              <label>Introduction*</label>
              <textarea
                value={formData.introduction}
                onChange={(e) =>
                  setFormData({ ...formData, introduction: e.target.value })
                }
                required
                rows={4}
                placeholder="Main descriptive paragraph..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Why Choose*</label>
              <textarea
                value={formData.why_choose}
                onChange={(e) =>
                  setFormData({ ...formData, why_choose: e.target.value })
                }
                required
                rows={3}
                placeholder="Reasons to choose this solution..."
              />
            </div>
            <div className={styles.formGroup}>
              <label>Call to Action*</label>
              <input
                type="text"
                value={formData.cta}
                onChange={(e) =>
                  setFormData({ ...formData, cta: e.target.value })
                }
                required
                placeholder="Get started – request a free consultation today"
              />
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Features</h3>
            <div className={styles.featuresList}>
              {formData.features.map((feature, index) => (
                <div key={index} className={styles.featureItem}>
                  <div>
                    <strong>{feature.title}</strong>
                    <p>{feature.description}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeFeature(index)}
                    className={styles.removeButton}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className={styles.addFeatureForm}>
              <input
                type="text"
                placeholder="Feature title"
                value={newFeature.title}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, title: e.target.value })
                }
              />
              <textarea
                placeholder="Feature description"
                value={newFeature.description}
                onChange={(e) =>
                  setNewFeature({ ...newFeature, description: e.target.value })
                }
                rows={2}
              />
              <button
                type="button"
                onClick={addFeature}
                className={styles.addButton}
              >
                Add Feature
              </button>
            </div>
          </div>

          <div className={styles.formSection}>
            <h3>Image Gallery</h3>
            <p className={styles.sectionDescription}>
              Upload images by dragging and dropping or clicking to browse. You
              can reorder images and add metadata.
            </p>
            <ImageUploader
              existingImages={formData.images}
              onUpload={handleImagesUpdate}
            />
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.cancelButton}
            >
              Cancel
            </button>
            <button
              type="submit"
              className={styles.saveButton}
              disabled={loading}
            >
              {loading ? "Saving..." : item ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
