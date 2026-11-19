// Lets an app owner (listed in public.admins) remove a user account by username.
// Removing an account also removes its workouts, activities, badges, messages and comments.
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
  if (!isAdmin) return json({ error: "Only the app owner can remove users." }, 403);

  const { username } = await req.json().catch(() => ({}));
  if (typeof username !== "string" || !username.trim()) return json({ error: "Enter their exact username." }, 400);

  // exact, case-sensitive match so "jacob" never hits "Jacob.T"
  const { data: target } = await admin.from("profiles").select("id,username").eq("username", username.trim()).maybeSingle();
  if (!target) return json({ error: `No user called exactly “${username.trim()}”. Usernames are case-sensitive here.` }, 404);
  if (target.id === user.id) return json({ error: "You can’t remove your own account here." }, 400);
  const { data: targetAdmin } = await admin.from("admins").select("user_id").eq("user_id", target.id).maybeSingle();
  if (targetAdmin) return json({ error: "That account is an app owner and can’t be removed here." }, 400);

  const { error } = await admin.auth.admin.deleteUser(target.id);
  if (error) return json({ error: error.message }, 400);
  return json({ ok: true, username: target.username });
});
