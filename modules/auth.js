import { sb } from "./sb.js";

async function signUp(username, displayName, password) {
    // 1. Check username isn't taken first
    const { data: existing } = await sb
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle(); // ✅ won't 406 when no row found

    if (existing) return { error: { message: "Username already taken" } };

    // 2. Create auth account
    const fakeEmail = `${username}@metube.internal`;
    const { data, error } = await sb.auth.signUp({ email: fakeEmail, password });
    console.log("Signup error:", JSON.stringify(error));
    if (error) return { error };

    // 3. Create public profile row
    const { error: profileErr } = await sb.from("users").insert({
        id:           data.user.id,
        username,
        display_name: displayName,
    });
    if (profileErr) return { error: profileErr };

    return { data };
}

async function signIn(username, password) {
    const fakeEmail = `${username}@metube.internal`;
    const { data, error } = await sb.auth.signInWithPassword({
        email: fakeEmail,
        password
    });
    return { data, error };
}

async function signOut() {
    await sb.auth.signOut();
}

async function getCurrentUser() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;

    const { data: profile } = await sb
        .from("users")
        .select("username, display_name")
        .eq("id", user.id)
        .single();

    return {
        uuid:        user.id,
        username:    profile?.username,
        displayName: profile?.display_name,
    };
}

export const auth = {signUp, signIn, signOut, getCurrentUser};