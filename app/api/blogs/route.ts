import { auth, currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export async function GET() {
    try {
        await connectDB();
        const blogs = await Blog.find().sort({ createdAt: -1 });
        return NextResponse.json(blogs);
    } catch (error) {
        console.error("[BLOGS_GET_ERROR]", error);
        return NextResponse.json({ error: "Failed to fetch blogs" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        const { title, content, domains, source, pattern, imageUrl } = body;

        await connectDB();

        // Create Slug
        const slug = title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/(^-|-$)+/g, "");

        const newBlog = await Blog.create({
            title,
            content,
            domains,
            source,
            pattern,
            imageUrl,
            slug: `${slug}-${Date.now()}`,
            authorEmail: email
        });

        return NextResponse.json(newBlog);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to create blog" }, { status: 500 });
    }
}
