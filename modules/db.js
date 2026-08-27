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

        // Collect unique user_ids from all videos
        const userIds = [...new Set(rows.map(r => r.user_id).filter(Boolean))];

        // Batch fetch all uploaders in one query
        const { data: users } = await sb
            .from("users")
            .select("id, username, display_name")
            .in("id", userIds);

        // Build a quick lookup map uuid → user
        const userMap = {};
        (users ?? []).forEach(u => userMap[u.id] = u);

        const vids = rows.map(row => ({
            id:          row.id,
            name:        row.name,
            desc:        row.description,
            thumbnail:   row.thumbnail_url || "",
            src:         row.video_url,
            views:       row.views,
            type:        "video",
            userId:      row.user_id,
            username:    userMap[row.user_id]?.username ?? "unknown",
            displayName: userMap[row.user_id]?.display_name ?? "Unknown",
            uploadedAt:  row.uploaded_at,
        }));

        console.log(`✓ Loaded ${vids.length} videos from Supabase.`);
        return vids;

    } catch (err) {
        console.error("Failed to load from Supabase:", err);
        return [];
    }
}

async function lookupUser(uuid) {
    if (!uuid) return null;

    try {
        const { data, error } = await sb
            .from("users")
            .select("username")
            .eq("id", uuid)
            .maybeSingle();

        if (error) {
            console.warn("User lookup failed:", error.message);
            return null;
        }

        return data?.username ?? null; // returns just the username string or null
    } catch (err) {
        console.error("User lookup error:", err);
        return null;
    }
}

// 📍 INSIDE: js/modules/interaction-mgr.js

async function incrementVideoViewCountClientSide(videoIdString) {
    // Hard check: If the variable ever loses its data matrix, drop the execution instantly!
    if (!videoIdString || videoIdString === "undefined") {
        console.warn("Analytics Core: Blocked a ghost request from striking the API ports.");
        return;
    }

    console.log(`Analytics Core: Unique token validated: "${videoIdString}". Punching database row cell...`);

    // 🚀 EXECUTE THE SINGLE-TICK ATOMIC INCREMENT RPC
    // Passes your string variable over a single network loop with zero data leakage!
    const { error } = await sb.rpc('increment_video_views', { target_id: videoIdString });

    if (error) {
        console.error("Analytics Core: Cloud insertion refused:", error.message);
    } else {
        console.log("✓ Analytics Core: View count bumped smoothly in a single connection tick.");
    }
}

export const db = { fetchMediaCatalog, lookupUser, incrementVideoViewCountClientSide};