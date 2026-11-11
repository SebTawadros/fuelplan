// Lets an app owner (listed in public.admins) set a new password for any user by username.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json({ error: "Please log in again." }, 401);
  const { data: isAdmin } = await admin.from("admins").select("user_id").eq("user_id", user.id).maybeSingle();
  if (!isAdmin) return json({ error: "Only the app owner can reset passwords." }, 403);

  const { username, password } = await req.json().catch(() => ({}));
  if (typeof username !== "string" || !username.trim()) return json({ error: "Enter their username." }, 400);
  if (typeof password !== "string" || password.length < 6) return json({ error: "New password must be at least 6 characters." }, 400);

  const { data: target } = await admin.from("profiles").select("id,username")
    .ilike("username", username.trim().replace(/[_%\\]/g, "\\$&")).maybeSingle();
  if (!target) return json({ error: `No user called “${username.trim()}”.` }, 404);

  const { error } = await admin.auth.admin.updateUserById(target.id, { password });
  if (error) return json({ error: error.message }, 400);

  await admin.from("notifications").insert({
    user_id: target.id, actor_id: user.id, kind: "test",
    title: "🔑 Your password was reset", body: "The app owner set you a new password. You can change it in Settings.", link: "#/settings",
  });
  return json({ ok: true, username: target.username });
});
