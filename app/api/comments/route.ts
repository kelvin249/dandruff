import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import crypto from "crypto";
import { sendWebhookNotification } from "@/lib/notifications";

// Directory to store comments
const COMMENTS_DIR = path.join(process.cwd(), "data/comments");

// Ensure comments directory exists
if (!fs.existsSync(COMMENTS_DIR)) {
  fs.mkdirSync(COMMENTS_DIR, { recursive: true });
}

interface Comment {
  id: string;
  slug: string;
  author: string;
  email: string;
  content: string;
  date: string;
  approved: boolean;
}

/**
 * GET handler - retrieves comments for a specific post
 * Query params: slug (required)
 */
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");

  if (!slug) {
    return NextResponse.json(
      { error: "Missing slug parameter" },
      { status: 400 }
    );
  }

  const commentFile = path.join(COMMENTS_DIR, `${slug}.json`);

  try {
    if (!fs.existsSync(commentFile)) {
      return NextResponse.json([]);
    }

    const data = fs.readFileSync(commentFile, "utf-8");
    const comments = JSON.parse(data);
    return NextResponse.json(comments);
  } catch (error) {
    console.error("Failed to read comments:", error);
    return NextResponse.json(
      { error: "Failed to fetch comments" },
      { status: 500 }
    );
  }
}

/**
 * POST handler - submits a new comment
 * Body: { slug, author, email, content }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { slug, author, email, content } = body;

    // Validation
    if (!slug || !author || !email || !content) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedAuthor = author.trim().substring(0, 100);
    const sanitizedEmail = email.trim().toLowerCase();
    const sanitizedContent = content.trim().substring(0, 5000);

    // Create new comment
    const newComment: Comment = {
      id: crypto.randomUUID(),
      slug,
      author: sanitizedAuthor,
      email: sanitizedEmail,
      content: sanitizedContent,
      date: new Date().toISOString(),
      approved: false, // Comments require moderation by default
    };

    // Load existing comments or create new array
    const commentFile = path.join(COMMENTS_DIR, `${slug}.json`);
    let comments: Comment[] = [];

    if (fs.existsSync(commentFile)) {
      const data = fs.readFileSync(commentFile, "utf-8");
      comments = JSON.parse(data);
    }

    // Add new comment
    comments.push(newComment);

    // Save comments
    fs.writeFileSync(commentFile, JSON.stringify(comments, null, 2));

    // Send webhook notification to admin
    await sendWebhookNotification({
      slug,
      author: sanitizedAuthor,
      content: sanitizedContent,
    }).catch(() => {});

    return NextResponse.json(
      { success: true, message: "Comment submitted successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Failed to save comment:", error);
    return NextResponse.json(
      { error: "Failed to submit comment" },
      { status: 500 }
    );
  }
}
