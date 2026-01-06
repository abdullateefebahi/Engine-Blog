import { createClient } from "@supabase/supabase-js";

// Note: This client should ONLY be used in server contexts (Server Actions, API routes)
// as it has full admin privileges.
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);
