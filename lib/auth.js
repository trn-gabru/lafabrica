import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export function generateToken(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" })
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return null
  }
}

export function hashPassword(password) {
  // In production, use bcrypt or similar
  // For demo purposes, using simple hash
  const crypto = require("crypto")
  return crypto.createHash("sha256").update(password).digest("hex")
}

export function comparePassword(password, hash) {
  return hashPassword(password) === hash
}
