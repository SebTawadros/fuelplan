// AI Coach: reads the real leaderboard and asks Claude to write a short hype/roast recap.
// Needs the ANTHROPIC_API_KEY secret set on the Supabase project. Cached for 1 hour.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

  const { force } = await req.json().catch(() => ({ force: false }));
  const { data: last } = await admin.from("recaps").select("*").order("created_at", { ascending: false }).limit(1).maybeSingle();
  if (last && (!force || Date.now() - new Date(last.created_at).getTime() < 60 * 60 * 1000)) {
    return json({ recap: last });
  }

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "The app owner hasn't added a Claude API key yet." }, 503);

  const weekAgo = new Date(Date.now() - 7 * 864e5).toISOString();
  const [{ data: allTime }, { data: week }] = await Promise.all([
    admin.rpc("leaderboard", { p_since: null, p_gym: null }),
    admin.rpc("leaderboard", { p_since: weekAgo, p_gym: null }),
  ]);
  const slim = (rows: any[] | null) =>
    (rows ?? []).map((r) => ({
      name: r.username, gain_pct: r.gain_pct, prs: r.prs, went_backwards: r.drops,
      workouts: r.workouts, days_trained: r.days, volume_kg: Math.round(r.volume), last_workout: r.last_workout,
    }));

  const client = new Anthropic({ apiKey });
  const msg = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 1500,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system:
      "You are the hype coach for Outlift, a gym app where friends compete on pound-for-pound strength gains " +
      "(percentage improvement on their own previous lifts, not raw weight). Write a short, punchy recap from the data only. " +
      "Cover: who's leading on gains, most PRs, most days trained, who trained the least, anyone who went backwards. " +
      "Shout out the best, lightly roast the worst (playful, never cruel about bodies). Use names. Max 140 words. " +
      "Plain text with a few emojis, no markdown headings. If there's barely any data, hype people to log their first sessions.",
    messages: [{
      role: "user",
      content: `Today: ${new Date().toDateString()}\nThis week:\n${JSON.stringify(slim(week))}\nAll time:\n${JSON.stringify(slim(allTime))}`,
    }],
  } as any);

  if (msg.stop_reason === "refusal") return json({ error: "The coach declined to write this one. Try again later." }, 502);
  const text = msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
  if (!text) return json({ error: "Empty recap" }, 502);

  const { data: recap } = await admin.from("recaps").insert({ content: text }).select().single();
  await admin.rpc("broadcast_recap");
  return json({ recap });
});
