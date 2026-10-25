// Creates a ready-to-use account from a username + password (no email confirmation step).
// The account's login email is synthetic: <username>@users.liftboard.app
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const AVATARS = ["💪", "🦍", "🐺", "🦁", "🐻", "🔥", "⚡", "🏋️", "🥇", "🦾", "🐉", "🚀"];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

  const { username, password, avatar } = await req.json().catch(() => ({}));
  if (typeof username !== "string" || !/^[A-Za-z0-9_.]{3,20}$/.test(username)) {
    return json({ error: "Username must be 3–20 letters, numbers, _ or ." }, 400);
  }
  if (typeof password !== "string" || password.length < 6) {
    return json({ error: "Password must be at least 6 characters." }, 400);
  }
  const { data: taken } = await admin.from("profiles").select("id").ilike("username", username.replace(/[_%\\]/g, "\\$&")).maybeSingle();
  if (taken) return json({ error: "That username is taken. Try another." }, 409);

  const { error } = await admin.auth.admin.createUser({
    email: `${username.toLowerCase()}@users.liftboard.app`,
    password,
    email_confirm: true,
    user_metadata: { username, avatar: AVATARS.includes(avatar) ? avatar : "💪" },
  });
  if (error) {
    const dup = /already|registered|exists/i.test(error.message);
    return json({ error: dup ? "That username is taken. Try another." : error.message }, dup ? 409 : 400);
  }
  return json({ ok: true });
});
