import { currentUser } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import Blog from "@/models/Blog";

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export async function GET(req: Request, { params }: { params: { id: string } }) {
    try {
        await connectDB();
        const blog = await Blog.findById(params.id);
        if (!blog) return NextResponse.json({ error: "Not found" }, { status: 404 });
        return NextResponse.json(blog);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        await connectDB();
        await Blog.findByIdAndDelete(params.id);

        return NextResponse.json({ success: true });
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        const body = await req.json();
        await connectDB();

        const updatedBlog = await Blog.findByIdAndUpdate(params.id, body, { new: true });

        return NextResponse.json(updatedBlog);
    } catch (error) {
        return NextResponse.json({ error: "Internal Error" }, { status: 500 });
    }
}
