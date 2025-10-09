import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { verifyToken } from "@/lib/auth"

// GET - Fetch all inquiries (protected)
export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token || !verifyToken(token)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const client = await clientPromise
    const db = client.db("lafabrica")
    const inquiries = await db.collection("inquiries").find({}).sort({ createdAt: -1 }).toArray()

    return NextResponse.json({ inquiries })
  } catch (error) {
    console.error("[v0] Error fetching inquiries:", error)
    return NextResponse.json({ error: "Failed to fetch inquiries" }, { status: 500 })
  }
}

// POST - Create new inquiry (public)
export async function POST(request) {
  try {
    const body = await request.json()
    const { name, email, mobile, category } = body

    // Validation
    if (!name || !email || !mobile || !category) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: "Invalid email address" }, { status: 400 })
    }

    // Phone validation
    const phoneRegex = /^[\d\s\-+$$$$]+$/
    if (!phoneRegex.test(mobile) || mobile.replace(/\D/g, "").length < 10) {
      return NextResponse.json({ error: "Invalid phone number" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("lafabrica")

    const inquiry = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      mobile: mobile.trim(),
      category,
      createdAt: new Date(),
    }

    const result = await db.collection("inquiries").insertOne(inquiry)

    return NextResponse.json({ message: "Inquiry submitted successfully", id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error("[v0] Error creating inquiry:", error)
    return NextResponse.json({ error: "Failed to submit inquiry" }, { status: 500 })
  }
}
