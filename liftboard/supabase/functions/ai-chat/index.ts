// AI chat coach: answers training questions using the signed-in user's own Outlift data.
// Needs the ANTHROPIC_API_KEY secret. Limited to 30 messages per user per day.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const DAILY_LIMIT = 30;

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json({ error: "Please log in again." }, 401);

  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "The app owner hasn't added a Claude API key yet." }, 503);

  const { messages } = await req.json().catch(() => ({ messages: [] }));
  const history = (Array.isArray(messages) ? messages : [])
    .filter((m: any) => (m?.role === "user" || m?.role === "assistant") && typeof m.content === "string" && m.content.trim())
    .slice(-12)
    .map((m: any) => ({ role: m.role, content: String(m.content).slice(0, 2000) }));
  if (!history.length || history[history.length - 1].role !== "user") return json({ error: "Ask me something first." }, 400);
  while (history.length && history[0].role !== "user") history.shift();

  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin.from("ai_chat_usage").select("count").eq("user_id", user.id).eq("day", today).maybeSingle();
  if ((usage?.count ?? 0) >= DAILY_LIMIT) return json({ error: `You've hit today's limit of ${DAILY_LIMIT} coach messages. Back tomorrow!` }, 429);
  await admin.from("ai_chat_usage").upsert({ user_id: user.id, day: today, count: (usage?.count ?? 0) + 1 });

  // The user's own data, so answers are personal.
  const [{ data: profile }, { data: workouts }, { data: goals }, { data: activities }] = await Promise.all([
    admin.from("profiles").select("username,bodyweight,active_split_id").eq("id", user.id).single(),
    admin.from("workouts").select("day_name,performed_on,total_volume,lifts(exercise,weight,reps,target_reps,completed)")
      .eq("user_id", user.id).eq("finished", true).order("created_at", { ascending: false }).limit(10),
    admin.from("goals").select("exercise,target_weight,achieved_at").eq("user_id", user.id),
    admin.from("activities").select("kind,duration_min,distance_km,intensity,performed_on")
      .eq("user_id", user.id).order("created_at", { ascending: false }).limit(15),
  ]);
  const { data: split } = profile?.active_split_id
    ? await admin.from("splits").select("name,days").eq("id", profile.active_split_id).maybeSingle()
    : { data: null };
  const recent = (workouts ?? []).map((w: any) => ({
    date: w.performed_on, day: w.day_name, volume_kg: Math.round(w.total_volume),
    sets: (w.lifts ?? []).map((l: any) => `${l.exercise} ${l.weight}kg x${l.reps}${l.target_reps ? `/${l.target_reps}` : ""}${l.completed ? "" : " (not completed)"}`),
  }));
  const context = {
    name: profile?.username, bodyweight_kg: profile?.bodyweight ?? null,
    split: split ? { name: split.name, days: split.days.map((d: any) => ({ day: d.name, exercises: d.exercises.map((e: any) => `${e.name} ${e.sets}x${e.reps}`) })) } : null,
    goals: goals ?? [], recent_workouts_newest_first: recent,
    recent_cardio_and_recovery_newest_first: activities ?? [],
    points_rules: "15 per active day, PRs, cardio minutes x effort, sauna/ice bath a little; 4 rest days a week free, -20 per extra day with nothing logged",
  };

  const client = new Anthropic({ apiKey });
  const msg = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 1500,
    output_config: { effort: "low" },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system:
      "You are the Outlift coach, a friendly, motivating personal trainer inside a gym tracking app. " +
      "Answer like a real coach texting: short paragraphs, plain words, a few emojis at most, no markdown headings. " +
      "Keep answers under 150 words unless asked for a full plan. Use the user's own data below when it helps " +
      "(their split, recent sets, weights, goals) and give concrete numbers (sets, reps, kg). " +
      "If they mention pain or an injury, give general guidance only and tell them to see a physio or doctor. " +
      "Don't give medical, diet-drug or extreme cutting advice.\n\nUSER DATA:\n" + JSON.stringify(context),
    messages: history,
  } as any);

  if (msg.stop_reason === "refusal") return json({ error: "The coach can't help with that one. Try asking another way." }, 502);
  const text = msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("").trim();
  if (!text) return json({ error: "The coach went quiet. Try again." }, 502);
  return json({ reply: text, left: DAILY_LIMIT - (usage?.count ?? 0) - 1 });
});
