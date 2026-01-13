import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
    const { userId } = await auth();
    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { username, fullName, department, yearOfStudy } = await req.json();

    try {
        const client = await clerkClient();

        // 1. Update Clerk
        const updatedUser = await client.users.updateUser(userId, {
            username: username || undefined,
            firstName: fullName?.split(' ')[0] || undefined,
            lastName: fullName?.split(' ').slice(1).join(' ') || undefined,
            publicMetadata: {
                department,
                yearOfStudy,
            },
        });

        // 2. Sync with Supabase
        const email = updatedUser.emailAddresses[0]?.emailAddress;
        const avatarUrl = updatedUser.imageUrl;

        const { error: supabaseError } = await supabase
            .from("profiles")
            .upsert({
                id: userId,
                email,
                username: username || updatedUser.username,
                full_name: fullName || `${updatedUser.firstName} ${updatedUser.lastName}`.trim(),
                department,
                year_of_study: yearOfStudy,
                avatar_url: avatarUrl,
            }, {
                onConflict: 'id'
            });

        if (supabaseError) {
            console.error("Supabase sync error:", supabaseError);
            // We might not want to fail the whole request if Supabase fails? 
            // Actually, the user specifically asked for this, so let's report it.
            return NextResponse.json({ error: "Clerk updated, but Supabase sync failed: " + supabaseError.message }, { status: 500 });
        }

        const finalUsername = username || updatedUser.username;
        if (finalUsername) {
            revalidatePath("/discover");
            revalidatePath(`/${finalUsername}`);
        }
        revalidatePath("/");

        return NextResponse.json({ success: true });
    } catch (error: any) {
        console.error("Update error:", error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
