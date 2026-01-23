import { NextResponse } from "next/server";
// @ts-ignore
import { v2 as cloudinary } from "cloudinary";
import { currentUser } from "@clerk/nextjs/server";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const ADMIN_EMAIL = "saurabhsingh100605@gmail.com";

export async function POST(req: Request) {
    try {
        const user = await currentUser();
        const email = user?.emailAddresses[0]?.emailAddress;

        if (email !== ADMIN_EMAIL) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
        }

        // Check for missing environment variables
        if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
            console.error("Missing Cloudinary configuration in production");
            return NextResponse.json({
                error: "Server misconfiguration: Missing Cloudinary environment variables. Please check your production settings."
            }, { status: 500 });
        }

        const formData = await req.formData();
        const file = formData.get("file") as File;

        if (!file) {
            return NextResponse.json({ error: "No file provided" }, { status: 400 });
        }

        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);

        const uploadResult = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream(
                { folder: "codeify-blogs" },
                (error, result) => {
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    }
                    else resolve(result);
                }
            ).end(buffer);
        });

        return NextResponse.json(uploadResult);
    } catch (error: any) {
        console.error("Detailed Upload Error:", error);
        return NextResponse.json({
            error: error.message || "Upload failed due to an unexpected server error"
        }, { status: 500 });
    }
}
