import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { revalidatePath } from "next/cache";

export async function POST() {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const client = await clerkClient();
        const clerkUser = await client.users.getUser(userId);

        if (!clerkUser.username) {
            return NextResponse.json({ error: "Username not set in Clerk yet" }, { status: 400 });
        }

        const email = clerkUser.emailAddresses[0]?.emailAddress;
        const avatarUrl = clerkUser.imageUrl;
        const fullName = `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() || clerkUser.username;

        const { error: supabaseError } = await supabaseAdmin
            .from("profiles")
            .upsert({
                id: userId,
                email,
                username: clerkUser.username,
                full_name: fullName,
                avatar_url: avatarUrl,
                department: (clerkUser.publicMetadata?.department as string) || "General",
                year_of_study: (clerkUser.publicMetadata?.yearOfStudy as string) || "N/A"
            }, {
                onConflict: 'id'
            });

        if (supabaseError) {
            console.error("Supabase sync error in API:", supabaseError);
            return NextResponse.json({ error: "Supabase sync failed" }, { status: 500 });
        }

        revalidatePath("/discover");
        revalidatePath(`/${clerkUser.username}`);
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Sync error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
