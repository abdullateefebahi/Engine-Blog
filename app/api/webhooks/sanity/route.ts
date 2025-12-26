import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

/**
 * Sanity Webhook Handler
 * 
 * This endpoint should be called by a Sanity Webhook when a post is deleted.
 * Suggested Webhook Projection: { "slug": slug.current, "type": _type }
 */
export async function POST(req: Request) {
    try {
        const body = await req.json();
        console.log("DEBUG: Sanity Webhook Payload Received:", JSON.stringify(body, null, 2));

        // Attempt to find the slug in various common Sanity webhook locations
        // 1. Root level 'slug' (if custom projection is used)
        // 2. document.slug.current (common default)
        // 3. before.slug.current (sent on deletions)
        const slug = body.slug || body.document?.slug?.current || body.before?.slug?.current;
        const type = body.type || body.document?._type || body.before?._type;

        if (!slug) {
            console.error("DEBUG: Webhook Action - No slug found in payload.");
            return NextResponse.json(
                {
                    message: "No slug found. Check if your Sanity Webhook projection is properly configured.",
                    suggestion: "Projection should be: { \"slug\": slug.current, \"type\": _type }"
                },
                { status: 400 }
            );
        }

        // We only care about post deletions/modifications that require cleanup
        if (type !== "post") {
            return NextResponse.json({ message: `Ignored: Document type is '${type}', expected 'post'` }, { status: 200 });
        }

        console.log(`DEBUG: Webhook Action - Deleting social data for post slug: ${slug}`);

        // 1. Delete associated comments
        const { error: commentDeleteError } = await supabaseAdmin
            .from("comments")
            .delete()
            .eq("post_slug", slug);

        if (commentDeleteError) {
            console.error(`DEBUG: Failed to delete comments for ${slug}:`, commentDeleteError);
        }

        // 2. Delete associated reactions
        const { error: reactionDeleteError } = await supabaseAdmin
            .from("reactions")
            .delete()
            .eq("post_slug", slug);

        if (reactionDeleteError) {
            console.error(`DEBUG: Failed to delete reactions for ${slug}:`, reactionDeleteError);
        }

        return NextResponse.json({
            message: "Cleanup Successful",
            details: `Processed social data cleanup for post: ${slug}`
        }, { status: 200 });

    } catch (error: any) {
        console.error("DEBUG: Webhook Handler Exception:", error);
        return NextResponse.json({ message: "Internal Server Error", error: error.message }, { status: 500 });
    }
}
