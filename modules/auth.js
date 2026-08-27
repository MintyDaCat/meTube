import { sb } from "./sb.js";

async function signUp(email, username, password) {

    console.log("attempting signup");

    const { data: existing } = await sb
        .from("users")
        .select("username")
        .eq("username", username)
        .maybeSingle();

    if (existing) return { error: { message: "Username already taken" } };

    const { data, error } = await sb.auth.signUp({ email, password });
    console.log("Full signup error:", JSON.stringify(error));
    if (error) return { error };


    const { error: profileErr } = await sb.from("users").insert({
        id:           data.user.id,
        username,
        display_name: username, // defaults display name to username, user can change later
    });
    if (profileErr) return { error: profileErr };

    return { data };
}

async function signIn(email, password) {
    const { data, error } = await sb.auth.signInWithPassword({ email, password });
    if (error) return { error };
    return { data };
}

async function signOut() {
    await sb.auth.signOut();
}

async function getCurrentUser() {
    const { data: { user } } = await sb.auth.getUser();
    if (!user) return null;

    const { data: profile } = await sb
        .from("users")
        .select("username, display_name, is_admin")
        .eq("id", user.id)
        .maybeSingle();

    return {
        uuid:        user.id,
        email:       user.email,
        username:    profile?.username,
        displayName: profile?.display_name,
        isAdmin:     profile?.is_admin ?? false,
    };
}

async function isLoggedIn() {
    const { data: { session } } = await sb.auth.getSession();
    return session !== null;
}

export const auth = { signUp, signIn, signOut, getCurrentUser, isLoggedIn };