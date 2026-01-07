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
        await client.users.updateUser(userId, {
            username: username,
        });

        // 2. Sync to Supabase (upsert)
        // We need to fetch the user details from Clerk to get the latest info including email/avatar if needed
        // But for now, we assume the user exists or will be created. 
        // Usually a webhook handles creation, but here we enforce consistency.
        const user = await client.users.getUser(userId);

        const { error: supabaseError } = await supabaseAdmin.from("profiles").upsert({
            id: userId,
            username: username,
            email: user.emailAddresses[0]?.emailAddress,
            full_name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || username,
            avatar_url: user.imageUrl,
            updated_at: new Date().toISOString(),
        });

        if (supabaseError) {
            console.error("Supabase error:", supabaseError);
            throw new Error("Failed to sync profile");
        }

        return { success: true };
    } catch (error: any) {
        console.error("Onboarding error:", error);
        // Check for Clerk checks (e.g. username taken)
        if (error.errors && error.errors[0]?.code === "form_username_invalid") {
            throw new Error("Username is invalid.");
        }
        if (error.errors && error.errors[0]?.code === "form_identifier_exists") {
            throw new Error("Username is already taken.");
        }
        throw new Error(error.message || "Failed to update username");
    }
}
