import { sb } from "./sb.js";

async function fetchMediaCatalog() {
    console.log("Contacting Supabase database...");

    try {
        const { data: rows, error } = await sb
            .from("videos")
            .select("*")
            .order("uploaded_at", { ascending: false });

        if (error) {
            console.warn("Supabase returned error:", error.message);
            return [];
        }

        const vids = rows.map(row => ({
            name:      row.name,
            desc:      row.description,
            thumbnail: row.thumbnail_url || "",
            src:       row.video_url,
            type:      "video"
        }));

        console.log(`✓ Loaded ${vids.length} videos from Supabase.`);
        return vids;

    } catch (err) {
        console.error("Failed to load from Supabase:", err);
        return [];
    }
}

export const db = { fetchMediaCatalog };