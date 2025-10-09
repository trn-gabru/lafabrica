import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

// GET single portfolio item by slug
export async function GET(request, { params }) {
  try {
    // Await params before accessing properties
    const { slug } = await params;

    const client = await clientPromise;
    const db = client.db();
    const portfolioItem = await db
      .collection("portfolioitems")
      .findOne({ slug });

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, item: portfolioItem });
  } catch (error) {
    console.error("[v0] Error fetching portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch portfolio item" },
      { status: 500 }
    );
  }
}

// PUT update portfolio item (admin only)
export async function PUT(request, { params }) {
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

    // Await params before accessing properties
    const { slug } = await params;

    const client = await clientPromise;
    const db = client.db();
    const body = await request.json();

    // Check if the portfolio item exists first
    const existingItem = await db
      .collection("portfolioitems")
      .findOne({ slug });

    if (!existingItem) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Remove _id from body to prevent immutable field error
    const { _id, ...updateData } = body;

    // Don't allow slug changes in updates (or handle it differently if needed)
    delete updateData.slug;

    // Add updatedAt timestamp
    updateData.updatedAt = new Date();

    const result = await db
      .collection("portfolioitems")
      .updateOne({ slug }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Fetch the updated document
    const updatedItem = await db.collection("portfolioitems").findOne({ slug });

    return NextResponse.json({ success: true, item: updatedItem });
  } catch (error) {
    console.error("[v0] Error updating portfolio item:", error);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update portfolio item",
      },
      { status: 500 }
    );
  }
}

// DELETE portfolio item (admin only)
export async function DELETE(request, { params }) {
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

    // Await params before accessing properties
    const { slug } = await params;

    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection("portfolioitems").deleteOne({ slug });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Portfolio item deleted successfully",
    });
  } catch (error) {
    console.error("[v0] Error deleting portfolio item:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete portfolio item" },
      { status: 500 }
    );
  }
}
