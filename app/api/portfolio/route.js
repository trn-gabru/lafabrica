import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb.js";
import PortfolioItem from "@/lib/models/PortfolioItem";
import { verifyToken } from "@/lib/auth";

// GET all portfolio items
export async function GET(request) {
  try {
    const client = await clientPromise;
    const db = client.db(); // or client.db("your-database-name")
    const portfolioItems = await db
      .collection("portfolioitems")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json({ success: true, items: portfolioItems });
  } catch (error) {
    console.error("[v0] Error fetching portfolio items:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio items" },
      { status: 500 }
    );
  }
}

// POST create new portfolio item (admin only)
export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");
    const decoded = verifyToken(token);
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: "Invalid token" },
        { status: 401 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();

    // Validate required fields
    const requiredFields = [
      "slug",
      "title",
      "hero_heading",
      "hero_subheading",
      "introduction",
      "why_choose",
      "cta",
    ];
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        );
      }
    }

    // Check if slug already exists
    const existingItem = await db
      .collection("portfolioitems")
      .findOne({ slug: body.slug });
    if (existingItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Portfolio item with this slug already exists",
        },
        { status: 400 }
      );
    }

    body.createdAt = new Date();
    const result = await db.collection("portfolioitems").insertOne(body);
    const portfolioItem = { ...body, _id: result.insertedId };

    return NextResponse.json(
      { success: true, item: portfolioItem },
      { status: 201 }
    );
  } catch (error) {
    console.error("[v0] Error creating portfolio item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to create portfolio item",
      },
      { status: 500 }
    );
  }
}
