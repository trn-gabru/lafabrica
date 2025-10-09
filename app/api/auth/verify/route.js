import { NextResponse } from "next/server"
import { verifyToken } from "@/lib/auth"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    const token = authHeader?.replace("Bearer ", "")

    if (!token) {
      return NextResponse.json({ error: "No token provided" }, { status: 401 })
    }

    const decoded = verifyToken(token)

    if (!decoded) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 })
    }

    return NextResponse.json({ valid: true, user: decoded })
  } catch (error) {
    console.error("[v0] Token verification error:", error)
    return NextResponse.json({ error: "Verification failed" }, { status: 500 })
  }
}
