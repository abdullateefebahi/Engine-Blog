import { supabase } from "./lib/supabase";

async function test() {
    const { data, error } = await supabase.from('follows').select('id').limit(1);
    if (error) {
        console.error("Follows table check failed:", error.message);
    } else {
        console.log("Follows table exists.");
    }
}

test();
