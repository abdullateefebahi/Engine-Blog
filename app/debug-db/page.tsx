
import { supabaseAdmin } from "@/lib/supabase-admin";
import { auth } from "@clerk/nextjs/server";

export default async function DebugDBPage() {
    const { userId } = await auth();

    // 1. Check Connection & List Bookmarks
    const { data: bookmarks, error: fetchError } = await supabaseAdmin
        .from("bookmarks")
        .select("*")
        .limit(10);

    // 3. Check Environment Variables (Masked)
    const hasUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasKey = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

    return (
        <div className="p-8 max-w-4xl mx-auto space-y-6">
            <h1 className="text-2xl font-bold">Database Debugger</h1>

            <div className="p-4 border rounded">
                <h2 className="font-bold mb-2">Environment</h2>
                <p>NEXT_PUBLIC_SUPABASE_URL: {hasUrl ? "✅ Defined" : "❌ Missing"}</p>
                <p>SUPABASE_SERVICE_ROLE_KEY: {hasKey ? "✅ Defined" : "❌ Missing"}</p>
                <p>Clerk User ID: {userId || "Not Signed In"}</p>
            </div>

            <div className="p-4 border rounded">
                <h2 className="font-bold mb-2">Bookmarks Table (Top 10)</h2>
                {fetchError ? (
                    <div className="text-red-500">
                        <p>Error fetching bookmarks:</p>
                        <pre>{JSON.stringify(fetchError, null, 2)}</pre>
                    </div>
                ) : (
                    <div>
                        <p>Count: {bookmarks?.length}</p>
                        <pre className="bg-gray-100 dark:bg-gray-800 p-2 rounded text-xs overflow-auto">
                            {JSON.stringify(bookmarks, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    );
}
