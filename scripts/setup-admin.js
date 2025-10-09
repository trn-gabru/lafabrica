// Run this script once to create an admin user in MongoDB
// Usage: node scripts/setup-admin.js

import { MongoClient } from "mongodb"
import crypto from "crypto"

const MONGODB_URI = process.env.MONGODB_URI || "your-mongodb-uri-here"

function hashPassword(password) {
  return crypto.createHash("sha256").update(password).digest("hex")
}

async function setupAdmin() {
  const client = new MongoClient(MONGODB_URI)

  try {
    await client.connect()
    console.log("Connected to MongoDB")

    const db = client.db("lafabrica")
    const adminsCollection = db.collection("admins")

    // Check if admin already exists
    const existingAdmin = await adminsCollection.findOne({ username: "admin" })

    if (existingAdmin) {
      console.log("Admin user already exists")
      return
    }

    // Create admin user
    const admin = {
      username: "admin",
      password: hashPassword("admin123"),
      createdAt: new Date(),
    }

    await adminsCollection.insertOne(admin)
    console.log("Admin user created successfully")
    console.log("Username: admin")
    console.log("Password: admin123")
    console.log("Please change the password after first login!")
  } catch (error) {
    console.error("Error setting up admin:", error)
  } finally {
    await client.close()
  }
}

setupAdmin()
