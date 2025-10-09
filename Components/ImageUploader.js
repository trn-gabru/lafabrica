"use client"

import { useState, useRef } from "react"
import styles from "./ImageUploader.module.css"

export default function ImageUploader({ onUpload, existingImages = [] }) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [images, setImages] = useState(existingImages)
  const [error, setError] = useState("")
  const fileInputRef = useRef(null)

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = async (e) => {
    e.preventDefault()
    setIsDragging(false)

    const files = Array.from(e.dataTransfer.files)
    const imageFiles = files.filter((file) => file.type.startsWith("image/"))

    if (imageFiles.length === 0) {
      setError("Please drop only image files")
      return
    }

    await uploadFiles(imageFiles)
  }

  const handleFileSelect = async (e) => {
    const files = Array.from(e.target.files)
    await uploadFiles(files)
  }

  const uploadFiles = async (files) => {
    setUploading(true)
    setError("")

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData()
        formData.append("file", file)

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        })

        if (!response.ok) {
          throw new Error("Upload failed")
        }

        const data = await response.json()
        return {
          url: data.url,
          title: file.name,
          alt: file.name.replace(/\.[^/.]+$/, ""),
        }
      })

      const uploadedImages = await Promise.all(uploadPromises)
      const newImages = [...images, ...uploadedImages]
      setImages(newImages)
      onUpload(newImages)
    } catch (err) {
      setError("Failed to upload images. Please try again.")
      console.error("Upload error:", err)
    } finally {
      setUploading(false)
    }
  }

  const handleRemoveImage = (index) => {
    const newImages = images.filter((_, i) => i !== index)
    setImages(newImages)
    onUpload(newImages)
  }

  const handleReorder = (index, direction) => {
    const newImages = [...images]
    const newIndex = direction === "up" ? index - 1 : index + 1

    if (newIndex < 0 || newIndex >= newImages.length) return
    ;[newImages[index], newImages[newIndex]] = [newImages[newIndex], newImages[index]]
    setImages(newImages)
    onUpload(newImages)
  }

  const handleUpdateMetadata = (index, field, value) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    setImages(newImages)
    onUpload(newImages)
  }

  return (
    <div className={styles.uploader}>
      <div
        className={`${styles.dropzone} ${isDragging ? styles.dragging : ""}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className={styles.fileInput}
        />

        {uploading ? (
          <div className={styles.uploading}>
            <div className={styles.spinner}></div>
            <p>Uploading images...</p>
          </div>
        ) : (
          <>
            <svg className={styles.uploadIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className={styles.dropzoneText}>
              <strong>Drag and drop images here</strong> or click to browse
            </p>
            <p className={styles.dropzoneHint}>Supports: JPG, PNG, GIF, WebP</p>
          </>
        )}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      {images.length > 0 && (
        <div className={styles.imageList}>
          <h4>Uploaded Images ({images.length})</h4>
          {images.map((image, index) => (
            <div key={index} className={styles.imageItem}>
              <div className={styles.imagePreview}>
                <img src={image.url || "/placeholder.svg"} alt={image.alt || "Preview"} />
              </div>

              <div className={styles.imageDetails}>
                <div className={styles.formGroup}>
                  <label>Title</label>
                  <input
                    type="text"
                    value={image.title || ""}
                    onChange={(e) => handleUpdateMetadata(index, "title", e.target.value)}
                    placeholder="Image title"
                  />
                </div>

                <div className={styles.formGroup}>
                  <label>Alt Text</label>
                  <input
                    type="text"
                    value={image.alt || ""}
                    onChange={(e) => handleUpdateMetadata(index, "alt", e.target.value)}
                    placeholder="Alt text for accessibility"
                  />
                </div>
              </div>

              <div className={styles.imageActions}>
                <button
                  type="button"
                  onClick={() => handleReorder(index, "up")}
                  disabled={index === 0}
                  className={styles.btnReorder}
                  title="Move up"
                >
                  ↑
                </button>
                <button
                  type="button"
                  onClick={() => handleReorder(index, "down")}
                  disabled={index === images.length - 1}
                  className={styles.btnReorder}
                  title="Move down"
                >
                  ↓
                </button>
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className={styles.btnRemove}
                  title="Remove image"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
