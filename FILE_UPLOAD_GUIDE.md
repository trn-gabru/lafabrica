# File Upload System Guide

## Overview

The portfolio application now includes a complete drag-and-drop file upload system for managing portfolio images. This guide explains how the system works and how to use it.

## Features

### 1. Drag and Drop Interface
- **Drag files** directly onto the upload zone
- **Click to browse** and select files from your computer
- **Multiple file upload** - upload several images at once
- **Visual feedback** - the dropzone highlights when dragging files over it

### 2. Image Management
- **Preview thumbnails** - see uploaded images immediately
- **Reorder images** - use up/down arrows to change image order
- **Add metadata** - set title and alt text for each image
- **Remove images** - delete unwanted images with one click

### 3. Supported Formats
- JPG/JPEG
- PNG
- GIF
- WebP

## How It Works

### File Upload Flow

1. **User selects/drops files** → Files are validated (must be images)
2. **Files are uploaded** → Sent to `/api/upload` endpoint
3. **Server processes** → Files saved to `public/uploads/portfolio/` directory
4. **Response returned** → Public URL path returned (e.g., `/uploads/portfolio/123456-image.jpg`)
5. **State updated** → Image added to form with metadata fields

### Storage Location

Uploaded files are stored in:
\`\`\`
public/
  └── uploads/
      └── portfolio/
          ├── 1234567890-image1.jpg
          ├── 1234567891-image2.png
          └── ...
\`\`\`

Files are accessible via URL: `https://yourdomain.com/uploads/portfolio/filename.jpg`

## Using the Image Uploader

### In the Admin Panel

1. **Navigate to Admin Dashboard** → Login at `/admin`
2. **Go to Portfolio CMS tab**
3. **Create or Edit a portfolio item**
4. **Scroll to "Image Gallery" section**

### Uploading Images

**Method 1: Drag and Drop**
- Drag image files from your computer
- Drop them onto the upload zone
- Wait for upload to complete

**Method 2: Click to Browse**
- Click anywhere on the upload zone
- Select one or more image files
- Click "Open" to upload

### Managing Uploaded Images

**Add Metadata:**
- Click on the "Title" field to add an image title
- Click on the "Alt Text" field to add accessibility text

**Reorder Images:**
- Use the ↑ button to move an image up in the gallery
- Use the ↓ button to move an image down in the gallery

**Remove Images:**
- Click the ✕ button to remove an image from the gallery

### Saving Changes

After uploading and organizing images:
1. Review all images and metadata
2. Click "Create" or "Update" button at the bottom
3. Images are saved to the database with the portfolio item

## Technical Details

### API Endpoint: `/api/upload`

**Method:** POST  
**Content-Type:** multipart/form-data  
**Body:** FormData with 'file' field

**Response:**
\`\`\`json
{
  "success": true,
  "url": "/uploads/portfolio/1234567890-image.jpg",
  "filename": "1234567890-image.jpg"
}
\`\`\`

**Error Response:**
\`\`\`json
{
  "error": "No file provided"
}
\`\`\`

### File Naming Convention

Files are renamed on upload to prevent conflicts:
\`\`\`
{timestamp}-{sanitized-original-name}.{extension}
\`\`\`

Example: `1703001234567-my-portfolio-image.jpg`

### Component: `ImageUploader`

Located at: `components/ImageUploader.js`

**Props:**
- `onUpload(images)` - Callback function called when images change
- `existingImages` - Array of existing images to display

**Image Object Structure:**
\`\`\`javascript
{
  url: "/uploads/portfolio/image.jpg",
  title: "Image Title",
  alt: "Alt text for accessibility",
  order: 0
}
\`\`\`

## Database Storage

Images are stored in MongoDB as part of the portfolio item:

\`\`\`javascript
{
  slug: "tensile-canopy-structures",
  title: "Tensile Canopy Structures",
  // ... other fields
  images: [
    {
      url: "/uploads/portfolio/1234567890-image1.jpg",
      title: "Canopy Installation",
      alt: "Modern tensile canopy structure",
      order: 0
    },
    {
      url: "/uploads/portfolio/1234567891-image2.jpg",
      title: "Detail View",
      alt: "Close-up of canopy fabric",
      order: 1
    }
  ]
}
\`\`\`

## Best Practices

### Image Optimization
- **Resize images** before uploading (recommended max: 2000px width)
- **Compress images** to reduce file size
- **Use appropriate formats**: JPG for photos, PNG for graphics with transparency

### Accessibility
- **Always add alt text** describing the image content
- **Use descriptive titles** that help identify the image
- **Order images logically** to tell a visual story

### File Management
- **Regular cleanup** - periodically remove unused images from the uploads folder
- **Backup images** - include the uploads folder in your backup strategy
- **Monitor storage** - check disk space usage regularly

## Troubleshooting

### Upload Fails
- **Check file size** - very large files may timeout
- **Verify file type** - only image files are accepted
- **Check permissions** - ensure the server can write to `public/uploads/portfolio/`

### Images Not Displaying
- **Verify file path** - check that the URL is correct
- **Check file exists** - ensure the file is in the uploads folder
- **Clear cache** - browser cache may show old images

### Reordering Not Working
- **Save changes** - reordering only persists after clicking Save/Update
- **Refresh page** - reload the admin panel if state seems stuck

## Security Considerations

### File Validation
- Only image MIME types are accepted
- File extensions are validated
- Filenames are sanitized to prevent path traversal

### Access Control
- Upload endpoint should be protected (add authentication if needed)
- Consider adding file size limits
- Implement rate limiting for uploads

### Storage Security
- Files are stored in public directory (accessible to all)
- Do not upload sensitive images
- Consider adding virus scanning for production

## Future Enhancements

Potential improvements to consider:
- Image compression on upload
- Thumbnail generation
- Cloud storage integration (AWS S3, Cloudinary)
- Bulk upload with progress bars
- Image cropping/editing tools
- CDN integration for better performance
