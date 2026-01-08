"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { z } from "zod";
import { revalidatePath } from "next/cache";

const usernameSchema = z.object({
    username: z.string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters")
        .regex(/^[a-zA-Z0-9_]+$/, "Username can only contain letters, numbers, and underscores"),
});

export async function submitOnboardingAction(formData: FormData) {
    const { userId } = await auth();

    if (!userId) {
        throw new Error("Unauthorized");
    }

    const username = formData.get("username") as string;
    const result = usernameSchema.safeParse({ username });

    if (!result.success) {
        throw new Error(result.error.issues[0].message);
    }

    try {
        const client = await clerkClient();

        // 1. Update Clerk User
        // This also returns the updated user object, which we can use for Supabase sync
        const updatedUser = await client.users.updateUser(userId, {
            username: username,
        });

        // 2. Sync to Supabase (upsert)
        // We use the updatedUser directly to ensure we have the latest info
        const { error: supabaseError } = await supabaseAdmin
            .from("profiles")
            .upsert({
                id: userId,
                username: username,
                email: updatedUser.emailAddresses[0]?.emailAddress,
                full_name: `${updatedUser.firstName || ""} ${updatedUser.lastName || ""}`.trim() || username,
                avatar_url: updatedUser.imageUrl,
                department: "General", // Default for new users
                year_of_study: "N/A"    // Default for new users
            }, {
                onConflict: 'id'
            });

        if (supabaseError) {
            console.error("Supabase sync error details:", {
                code: supabaseError.code,
                message: supabaseError.message,
                details: supabaseError.details,
                hint: supabaseError.hint
            });
            throw new Error(`Failed to sync profile: ${supabaseError.message}`);
        }

        // Revalidate paths to clear any stale cache
        revalidatePath("/");
        revalidatePath(`/${username}`);

        return { success: true };
    } catch (error: any) {
        console.error("Onboarding error:", error);

        // Handle Clerk-specific errors
        if (error.errors && error.errors[0]?.code === "form_username_invalid") {
            throw new Error("Username is invalid.");
        }
        if (error.errors && error.errors[0]?.code === "form_identifier_exists") {
            throw new Error("Username is already taken.");
        }

        // For other errors, provide the message or a fallback
        throw new Error(error.message || "Failed to update username");
    }
}
