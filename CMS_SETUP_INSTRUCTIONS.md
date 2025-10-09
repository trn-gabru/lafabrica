# Portfolio CMS Setup Instructions

This document provides complete instructions for setting up and using the Portfolio Content Management System (CMS).

## Overview

The Portfolio CMS allows administrators to:
- Create, read, update, and delete portfolio items
- Manage features dynamically (add, edit, reorder, delete)
- Manage image galleries (upload, view, reorder, delete)
- All content is stored in MongoDB Atlas and displayed dynamically on the frontend

## Database Schema

Each portfolio item contains:
- **slug**: URL-friendly identifier (e.g., "tensile-canopy-structures")
- **title**: Main title of the portfolio item
- **hero_heading**: Hero section main heading
- **hero_subheading**: Hero section subheading
- **introduction**: Main descriptive paragraph
- **why_choose**: Section detailing reasons to choose this service
- **cta**: Call-to-action text
- **features**: Array of feature objects (title + description)
- **images**: Array of image objects (url, alt, title, order)

## Setup Instructions

### 1. MongoDB Atlas Configuration

Follow the instructions in `MONGODB_SETUP.md` to:
- Create a MongoDB Atlas account
- Set up a cluster
- Create a database user
- Get your connection string
- Add the `MONGODB_URI` environment variable

### 2. Seed Initial Portfolio Data

After setting up MongoDB, seed the database with initial portfolio items:

\`\`\`bash
node scripts/seed-portfolio.js
\`\`\`

This will populate your database with 3 sample portfolio items. You can then edit or add more through the admin panel.

### 3. Access the Admin Panel

1. Navigate to `/admin` in your browser
2. Log in with your admin credentials (set up via `scripts/setup-admin.js`)
3. Click on the "Portfolio CMS" tab

## Using the Portfolio CMS

### Creating a New Portfolio Item

1. Click the "+ Create New Portfolio Item" button
2. Fill in all required fields:
   - **Slug**: Must be unique and URL-friendly (e.g., "custom-tensile-designs")
   - **Title**: Display name (e.g., "Custom Tensile Designs")
   - **Hero Heading**: Main hero text
   - **Hero Subheading**: Supporting hero text
   - **Introduction**: Main description paragraph
   - **Why Choose**: Reasons to choose this solution
   - **CTA**: Call-to-action text

3. Add Features:
   - Enter feature title and description
   - Click "Add Feature"
   - Repeat for all features (typically 3-4)
   - Remove features by clicking "Remove"

4. Add Images:
   - Enter image URL (can use placeholder or real URLs)
   - Add alt text for accessibility
   - Add optional title
   - Click "Add Image"
   - First image becomes the hero image
   - Remove images by clicking "Remove"

5. Click "Create" to save

### Editing an Existing Portfolio Item

1. Find the portfolio item card in the list
2. Click "Edit"
3. Modify any fields as needed
4. Add or remove features and images
5. Click "Update" to save changes

### Deleting a Portfolio Item

1. Find the portfolio item card
2. Click "Delete"
3. Confirm the deletion

**Warning**: Deletion is permanent and cannot be undone.

## Frontend Integration

The frontend automatically fetches portfolio data from the database:

- **Portfolio Index** (`/our-portfolio`): Lists all portfolio categories
- **Portfolio Detail** (`/our-portfolio/[slug]`): Displays individual portfolio item with all content from database

No hardcoded content exists on these pages - everything is dynamically loaded from MongoDB.

## Image Management

### Using Placeholder Images

For development, you can use placeholder URLs:
\`\`\`
/placeholder.svg?height=800&width=1200&query=tensile canopy structure
\`\`\`

### Using Real Images

For production, you should:
1. Upload images to a CDN or image hosting service
2. Use the full URL in the CMS (e.g., `https://your-cdn.com/images/canopy-1.jpg`)
3. Ensure images are optimized for web (compressed, appropriate dimensions)

### Recommended Image Sizes

- **Hero Image**: 1600x800px (2:1 ratio)
- **Gallery Images**: 800x600px (4:3 ratio)
- **Format**: JPG for photos, PNG for graphics with transparency

## API Endpoints

The CMS uses the following API routes:

- `GET /api/portfolio` - Get all portfolio items
- `POST /api/portfolio` - Create new portfolio item (admin only)
- `GET /api/portfolio/[slug]` - Get single portfolio item
- `PUT /api/portfolio/[slug]` - Update portfolio item (admin only)
- `DELETE /api/portfolio/[slug]` - Delete portfolio item (admin only)
- `POST /api/portfolio/[slug]/images` - Add image to portfolio item (admin only)
- `DELETE /api/portfolio/[slug]/images` - Remove image from portfolio item (admin only)

All admin endpoints require JWT authentication via the `Authorization: Bearer <token>` header.

## Validation & Error Handling

### Client-Side Validation

- All required fields must be filled
- Slug must be URL-friendly (lowercase, hyphens only)
- Features must have both title and description
- Images must have a URL

### Server-Side Validation

- Duplicate slugs are rejected
- Missing required fields return 400 error
- Unauthorized requests return 401 error
- Not found items return 404 error

### Error Messages

Errors are displayed at the top of the admin panel in a red banner. Common errors:

- "Portfolio item with this slug already exists" - Choose a different slug
- "Missing required field: [field]" - Fill in all required fields
- "Unauthorized" - Log in again
- "Portfolio item not found" - Item may have been deleted

## Best Practices

1. **Slugs**: Use descriptive, SEO-friendly slugs (e.g., "glass-pergola-polycarbonate")
2. **Content**: Write clear, compelling copy that highlights benefits
3. **Features**: Limit to 3-4 key features per item
4. **Images**: Use high-quality images that showcase your work
5. **Alt Text**: Always provide descriptive alt text for accessibility
6. **Backups**: Regularly export your data or use MongoDB Atlas backups

## Troubleshooting

### Portfolio items not showing on frontend

- Check MongoDB connection in environment variables
- Verify items exist in database (check admin panel)
- Check browser console for API errors

### Cannot create/edit portfolio items

- Ensure you're logged in as admin
- Check that JWT token is valid (try logging out and back in)
- Verify MongoDB connection is working

### Images not displaying

- Verify image URLs are correct and accessible
- Check for CORS issues if using external image hosts
- Ensure images are publicly accessible

## Support

For additional help:
- Check MongoDB Atlas documentation
- Review API error messages in browser console
- Contact your development team
