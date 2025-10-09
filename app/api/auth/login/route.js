import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { generateToken, comparePassword } from "@/lib/auth"

export async function POST(request) {
  try {
    const { username, password } = await request.json()

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("lafabrica")

    const admin = await db.collection("admins").findOne({ username })

    if (!admin || !comparePassword(password, admin.password)) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 })
    }

    const token = generateToken({
      id: admin._id,
      username: admin.username,
    })

    return NextResponse.json({
      token,
      message: "Login successful",
    })
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
