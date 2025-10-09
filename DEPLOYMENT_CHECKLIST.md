# Deployment Checklist

Before deploying your portfolio application to production, complete these steps:

## 1. Environment Variables

Ensure all required environment variables are set:

\`\`\`bash
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database

# JWT Secret (generate a strong random string)
JWT_SECRET=your-super-secret-jwt-key-here

# Optional: Node Environment
NODE_ENV=production
\`\`\`

### Generate JWT Secret
\`\`\`bash
# Use this command to generate a secure random string:
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
\`\`\`

## 2. Database Setup

### Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster (free tier available)
3. Create a database user with read/write permissions
4. Whitelist your application's IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string

### Initialize Database
Run the setup scripts:

\`\`\`bash
# Create admin user
node scripts/setup-admin.js

# Seed portfolio data (optional)
node scripts/seed-portfolio.js
\`\`\`

## 3. File Upload Directory

Ensure the uploads directory exists and has proper permissions:

\`\`\`bash
# Create directory
mkdir -p public/uploads/portfolio

# Set permissions (Linux/Mac)
chmod 755 public/uploads/portfolio
\`\`\`

### For Production Deployment

**Vercel/Netlify:**
- File uploads to the filesystem won't persist
- Consider using cloud storage (AWS S3, Cloudinary, Vercel Blob)
- Update the upload API to use cloud storage

**VPS/Dedicated Server:**
- Ensure proper directory permissions
- Set up regular backups of the uploads folder
- Consider using a CDN for image delivery

## 4. Security Checklist

- [ ] Change default admin credentials
- [ ] Use strong JWT secret (32+ characters)
- [ ] Enable HTTPS in production
- [ ] Set secure cookie flags
- [ ] Implement rate limiting on API routes
- [ ] Add CORS configuration
- [ ] Validate all user inputs
- [ ] Sanitize file uploads
- [ ] Set up error logging
- [ ] Configure CSP headers

## 5. Performance Optimization

- [ ] Enable image optimization
- [ ] Set up CDN for static assets
- [ ] Enable gzip compression
- [ ] Implement caching strategies
- [ ] Optimize database queries
- [ ] Add database indexes
- [ ] Minify CSS/JS in production
- [ ] Lazy load images

## 6. Testing

Before deploying:

- [ ] Test all portfolio CRUD operations
- [ ] Test file upload functionality
- [ ] Test contact form submission
- [ ] Test admin authentication
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Test with slow network connection
- [ ] Verify all images load correctly
- [ ] Check console for errors

## 7. Monitoring

Set up monitoring for:

- [ ] Application uptime
- [ ] API response times
- [ ] Error rates
- [ ] Database performance
- [ ] Disk space usage (for uploads)
- [ ] SSL certificate expiration

## 8. Backup Strategy

- [ ] Set up automated database backups
- [ ] Back up uploaded images regularly
- [ ] Store backups in separate location
- [ ] Test backup restoration process
- [ ] Document backup procedures

## 9. Documentation

- [ ] Update README with deployment instructions
- [ ] Document environment variables
- [ ] Create admin user guide
- [ ] Document API endpoints
- [ ] Add troubleshooting guide

## 10. Post-Deployment

After deploying:

- [ ] Verify all pages load correctly
- [ ] Test admin login
- [ ] Upload a test portfolio item
- [ ] Submit a test contact form
- [ ] Check email notifications (if configured)
- [ ] Monitor error logs for 24 hours
- [ ] Update DNS records if needed
- [ ] Set up SSL certificate
- [ ] Configure domain redirects

## Common Deployment Platforms

### Vercel

\`\`\`bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables
vercel env add MONGODB_URI
vercel env add JWT_SECRET
\`\`\`

### Netlify

\`\`\`bash
# Install Netlify CLI
npm i -g netlify-cli

# Deploy
netlify deploy --prod

# Set environment variables in Netlify dashboard
\`\`\`

### Docker

\`\`\`dockerfile
# Dockerfile example
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
CMD ["npm", "start"]
\`\`\`

## Troubleshooting

### Database Connection Issues
- Verify MONGODB_URI is correct
- Check IP whitelist in MongoDB Atlas
- Ensure database user has proper permissions

### File Upload Issues
- Check directory permissions
- Verify disk space availability
- Consider cloud storage for production

### Authentication Issues
- Verify JWT_SECRET is set
- Check token expiration settings
- Clear browser cookies and try again

## Support

For issues or questions:
- Check the documentation files
- Review error logs
- Contact your development team
