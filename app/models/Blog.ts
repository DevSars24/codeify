import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBlog extends Document {
    title: string;
    content: string;
    domains: string[];
    source: string;
    pattern: string;
    imageUrl?: string;
    authorEmail: string;
    slug: string;
    createdAt: Date;
    updatedAt: Date;
}

const BlogSchema = new Schema<IBlog>(
    {
        title: { type: String, required: true },
        content: { type: String, required: true },
        domains: { type: [String], default: [] },
        source: { type: String, default: "" },
        pattern: { type: String, default: "" },
        imageUrl: { type: String, default: "" },
        authorEmail: { type: String, required: true }, // For extra security verification
        slug: { type: String, unique: true, required: true },
    },
    { timestamps: true }
);

// Prevent overwrite on HMR
const Blog: Model<IBlog> = mongoose.models.Blog || mongoose.model<IBlog>('Blog', BlogSchema);

export default Blog;
