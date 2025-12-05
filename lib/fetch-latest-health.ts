import { createClient } from "@/utils/supabase/client";

export async function fetchLatestHealth() {
    const supabase = createClient();

    const { data, error } = await supabase
        .from("health")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

    if (error) return null;
    return data;
}
