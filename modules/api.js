import { sb } from "./sb.js";

const SERVER = "https://metube-serverside.onrender.com";

// ── Get auth header from current Supabase session ─────────────────────────────
async function getAuthHeader() {
    const { data: { session } } = await sb.auth.getSession();
    if (!session) throw new Error("You must be logged in to do this.");
    return { "Authorization": `Bearer ${session.access_token}` };
}

// ── Upload a new video ────────────────────────────────────────────────────────
async function publishContent(input) {
    const { file, videoName, desc } = input;

    let titleText = videoName?.trim() || new Date().toLocaleDateString();

    if (!file) {
        alert("Please pick a video file first!");
        return;
    }

    const uploadBundle = new FormData();
    uploadBundle.append("video", file);
    uploadBundle.append("name", titleText);
    uploadBundle.append("description", desc || "");

    try {
        const authHeader = await getAuthHeader();

        const response = await fetch(`${SERVER}/api/upload`, {
            method: "POST",
            headers: authHeader, // ✅ token sent, server verifies with Supabase
            body: uploadBundle,
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (response.ok) {
            return { success: true, video: data.video };
        } else {
            throw new Error(data.error || "Server error");
        }

    } catch (err) {
        console.error("Upload failed:", err);
        throw err;
    }
}

// ── Delete a video ────────────────────────────────────────────────────────────
async function deleteVideo(videoId) {
    try {
        const authHeader = await getAuthHeader();

        const response = await fetch(`${SERVER}/api/video/${videoId}`, {
            method: "DELETE",
            headers: authHeader,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Delete failed");

        return { success: true };

    } catch (err) {
        console.error("Delete failed:", err);
        throw err;
    }
}

// ── Edit a video (title, description, thumbnail) ──────────────────────────────
async function editVideo(videoId, { name, description, thumbnail } = {}) {
    try {
        const authHeader = await getAuthHeader();

        const form = new FormData();
        if (name)        form.append("name", name);
        if (description !== undefined) form.append("description", description);
        if (thumbnail)   form.append("thumbnail", thumbnail); // File object

        const response = await fetch(`${SERVER}/api/video/${videoId}`, {
            method: "PATCH",
            headers: authHeader,
            body: form,
        });

        const data = await response.json();
        if (!response.ok) throw new Error(data.error || "Edit failed");

        return { success: true, video: data.video };

    } catch (err) {
        console.error("Edit failed:", err);
        throw err;
    }
}

// ── Keep server warm ──────────────────────────────────────────────────────────
async function warmUpServer() {
    try {
        await fetch(`${SERVER}/api/status`);
        console.log("Server is warm.");
    } catch (e) {}

    setInterval(() => {
        fetch(`${SERVER}/api/status`).catch(() => {});
    }, 4 * 60 * 1000);
}

export const api = { publishContent, deleteVideo, editVideo, warmUpServer };