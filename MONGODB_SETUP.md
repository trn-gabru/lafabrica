# MongoDB Atlas Setup Instructions

This guide will help you set up MongoDB Atlas for the La Fabrica Exteriors portfolio application.

## Step 1: Create a MongoDB Atlas Account

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click "Try Free" or "Sign In" if you already have an account
3. Create a new account or log in with your existing credentials

## Step 2: Create a New Cluster

1. After logging in, click "Build a Database"
2. Choose the **FREE** tier (M0 Sandbox)
3. Select your preferred cloud provider and region (choose one closest to your users)
4. Name your cluster (e.g., "lafabrica-cluster")
5. Click "Create Cluster" (this may take 3-5 minutes)

## Step 3: Create a Database User

1. In the left sidebar, click "Database Access" under Security
2. Click "Add New Database User"
3. Choose "Password" as the authentication method
4. Create a username (e.g., "lafabrica-admin")
5. Generate a secure password (save this - you'll need it!)
6. Under "Database User Privileges", select "Read and write to any database"
7. Click "Add User"

## Step 4: Configure Network Access

1. In the left sidebar, click "Network Access" under Security
2. Click "Add IP Address"
3. For development, click "Allow Access from Anywhere" (0.0.0.0/0)
   - **Note**: For production, restrict this to your server's IP address
4. Click "Confirm"

## Step 5: Get Your Connection String

1. Go back to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Select "Node.js" as the driver and version 4.1 or later
5. Copy the connection string (it looks like this):
   \`\`\`
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   \`\`\`
6. Replace `<username>` with your database username
7. Replace `<password>` with your database password
8. Add the database name after `.net/`: 
   \`\`\`
   mongodb+srv://lafabrica-admin:yourpassword@cluster0.xxxxx.mongodb.net/lafabrica?retryWrites=true&w=majority
   \`\`\`

## Step 6: Configure Environment Variables

1. Create a `.env.local` file in the root of your project
2. Add the following environment variables:

\`\`\`env
# MongoDB Connection
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/lafabrica?retryWrites=true&w=majority

# JWT Secret (generate a random string for production)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
\`\`\`

**Important**: 
- Never commit `.env.local` to version control
- Generate a strong, random JWT_SECRET for production
- Keep your MongoDB password secure

## Step 7: Set Up Admin User

After configuring your environment variables, run the setup script to create an admin user:

\`\`\`bash
npm run setup-admin
\`\`\`

This will create an admin user with:
- **Username**: admin
- **Password**: admin123

**Important**: Change this password after your first login!

## Step 8: Test the Connection

1. Start your development server:
   \`\`\`bash
   npm run dev
   \`\`\`

2. Navigate to `http://localhost:3000/contact-us`
3. Fill out and submit the contact form
4. Go to `http://localhost:3000/admin`
5. Log in with username: `admin` and password: `admin123`
6. You should see your submitted inquiry in the dashboard

## Step 9: Verify Data in MongoDB Atlas

1. Go back to MongoDB Atlas
2. Click "Browse Collections" on your cluster
3. You should see:
   - Database: `lafabrica`
   - Collections: `inquiries` and `admins`
4. Click on each collection to view the data

## Production Deployment

When deploying to production (e.g., Vercel):

1. Add environment variables in your hosting platform:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A strong, random secret key

2. Update Network Access in MongoDB Atlas:
   - Remove "Allow Access from Anywhere"
   - Add your production server's IP address

3. Create a new admin user with a strong password:
   - Update the `scripts/setup-admin.js` file with new credentials
   - Run the script once in production

## Troubleshooting

### Connection Issues

**Error**: "MongoServerError: bad auth"
- **Solution**: Double-check your username and password in the connection string
- Make sure there are no special characters that need URL encoding

**Error**: "MongooseServerSelectionError: connect ETIMEDOUT"
- **Solution**: Check your Network Access settings in MongoDB Atlas
- Ensure your IP address is whitelisted

### Authentication Issues

**Error**: "Unauthorized" when accessing admin dashboard
- **Solution**: Clear your browser's localStorage and log in again
- Check that JWT_SECRET is set in your environment variables

**Error**: "Invalid credentials" when logging in
- **Solution**: Verify the admin user was created by running `npm run setup-admin`
- Check MongoDB Atlas to confirm the admin user exists

## Database Schema

### Inquiries Collection

\`\`\`javascript
{
  _id: ObjectId,
  name: String,
  email: String,
  mobile: String,
  category: String,
  createdAt: Date
}
\`\`\`

### Admins Collection

\`\`\`javascript
{
  _id: ObjectId,
  username: String,
  password: String (hashed),
  createdAt: Date
}
\`\`\`

## Security Best Practices

1. **Never expose your MongoDB URI**: Keep it in environment variables only
2. **Use strong passwords**: For both database users and admin accounts
3. **Restrict network access**: In production, whitelist only necessary IP addresses
4. **Rotate JWT secrets**: Change your JWT_SECRET periodically
5. **Enable MongoDB Atlas alerts**: Set up alerts for unusual activity
6. **Regular backups**: Enable automated backups in MongoDB Atlas
7. **Use HTTPS**: Always use HTTPS in production to encrypt data in transit

## Additional Resources

- [MongoDB Atlas Documentation](https://docs.atlas.mongodb.com/)
- [MongoDB Node.js Driver Documentation](https://mongodb.github.io/node-mongodb-native/)
- [Next.js Environment Variables](https://nextjs.org/docs/basic-features/environment-variables)
- [JWT Best Practices](https://tools.ietf.org/html/rfc8725)

## Support

If you encounter any issues:
1. Check the MongoDB Atlas logs in the "Metrics" tab
2. Review the browser console for client-side errors
3. Check the server logs for API errors
4. Verify all environment variables are set correctly
