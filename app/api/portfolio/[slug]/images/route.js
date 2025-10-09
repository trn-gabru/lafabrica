import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import { verifyToken } from "@/lib/auth";

// POST add image to portfolio item (admin only)
export async function POST(request, { params }) {
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

    if (!body.url) {
      return NextResponse.json(
        { success: false, error: "Image URL is required" },
        { status: 400 }
      );
    }

    const portfolioItem = await db
      .collection("portfolioitems")
      .findOne({ slug: params.slug });

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Ensure images array exists
    const images = portfolioItem.images || [];

    const newImage = {
      _id: new ObjectId(),
      url: body.url,
      alt: body.alt || "",
      title: body.title || "",
      order: body.order ?? images.length,
    };

    // Push new image to array
    const result = await db.collection("portfolioitems").findOneAndUpdate(
      { slug: params.slug },
      {
        $push: { images: newImage },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, item: result.value });
  } catch (error) {
    console.error("[v0] Error adding image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to add image" },
      { status: 500 }
    );
  }
}

// DELETE remove image from portfolio item (admin only)
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

    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const imageId = searchParams.get("imageId");

    if (!imageId) {
      return NextResponse.json(
        { success: false, error: "Image ID is required" },
        { status: 400 }
      );
    }

    const portfolioItem = await db
      .collection("portfolioitems")
      .findOne({ slug: params.slug });

    if (!portfolioItem) {
      return NextResponse.json(
        { success: false, error: "Portfolio item not found" },
        { status: 404 }
      );
    }

    // Remove the image with matching _id
    const result = await db.collection("portfolioitems").findOneAndUpdate(
      { slug: params.slug },
      {
        $pull: { images: { _id: new ObjectId(imageId) } },
        $set: { updatedAt: new Date() },
      },
      { returnDocument: "after" }
    );

    return NextResponse.json({ success: true, item: result.value });
  } catch (error) {
    console.error("[v0] Error deleting image:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete image" },
      { status: 500 }
    );
  }
}
