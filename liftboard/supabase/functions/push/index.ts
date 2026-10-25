// Sends Web Push notifications for newly inserted rows in public.notifications.
// Called by the on_notifications_push database trigger (pg_net) with { ids: [...] }.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import webpush from "npm:web-push@3.6.7";

const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  const secret = req.headers.get("x-push-secret");
  const { ids } = await req.json().catch(() => ({ ids: [] }));
  if (!secret || !Array.isArray(ids) || ids.length === 0) return new Response("bad request", { status: 400 });

  const { data, error } = await supabase.rpc("get_push_jobs", { p_ids: ids, p_secret: secret });
  if (error) return new Response(error.message, { status: 403 });

  webpush.setVapidDetails("mailto:liftboard@example.com", data.vapid_public, data.vapid_private);

  const results = await Promise.allSettled(
    data.jobs.map(async (j: any) => {
      try {
        await webpush.sendNotification(
          { endpoint: j.endpoint, keys: { p256dh: j.p256dh, auth: j.auth } },
          JSON.stringify({ title: j.title, body: j.body, link: j.link, kind: j.kind, tag: `n${j.id}` }),
          { TTL: 60 * 60 * 24 },
        );
      } catch (e: any) {
        // subscription expired or revoked -> forget it
        if (e?.statusCode === 404 || e?.statusCode === 410) {
          await supabase.from("push_subscriptions").delete().eq("endpoint", j.endpoint);
        }
        throw e;
      }
    }),
  );
  const sent = results.filter((r) => r.status === "fulfilled").length;
  return Response.json({ sent, failed: results.length - sent });
});
