// Estimates calories and macros for a meal described in plain words ("3 eggs and 2 slices of toast").
// Shares the 30-a-day AI limit with the chat coach. Needs the ANTHROPIC_API_KEY secret.
import { createClient } from "npm:@supabase/supabase-js@2.45.4";
import Anthropic from "npm:@anthropic-ai/sdk";

const cors = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};
const admin = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);
const DAILY_LIMIT = 30;
const SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["name", "calories", "protein_g", "carbs_g", "fat_g"],
  properties: {
    name: { type: "string", description: "Short tidy name for the meal" },
    calories: { type: "integer" },
    protein_g: { type: "number" },
    carbs_g: { type: "number" },
    fat_g: { type: "number" },
  },
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: cors });
  const json = (body: unknown, status = 200) => Response.json(body, { status, headers: cors });

  const token = (req.headers.get("Authorization") || "").replace(/^Bearer\s+/i, "");
  const { data: { user } } = await admin.auth.getUser(token);
  if (!user) return json({ error: "Please log in again." }, 401);
  const apiKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!apiKey) return json({ error: "The app owner hasn't added a Claude API key yet." }, 503);

  const { text } = await req.json().catch(() => ({}));
  if (typeof text !== "string" || text.trim().length < 2) return json({ error: "Describe what you ate." }, 400);

  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await admin.from("ai_chat_usage").select("count").eq("user_id", user.id).eq("day", today).maybeSingle();
  if ((usage?.count ?? 0) >= DAILY_LIMIT) return json({ error: `You've hit today's limit of ${DAILY_LIMIT} AI requests. Enter it manually instead.` }, 429);
  await admin.from("ai_chat_usage").upsert({ user_id: user.id, day: today, count: (usage?.count ?? 0) + 1 });

  const client = new Anthropic({ apiKey });
  const msg = await client.beta.messages.create({
    model: "claude-opus-5-5",
    max_tokens: 1000,
    output_config: { effort: "low", format: { type: "json_schema", schema: SCHEMA } },
    betas: ["server-side-fallback-2026-07-01"],
    fallbacks: "default",
    system: "Estimate the nutrition of the meal the user describes, using typical Australian portion sizes when amounts aren't given. " +
      "Give realistic whole-meal totals. Round calories to the nearest 10 and macros to whole grams.",
    messages: [{ role: "user", content: text.slice(0, 500) }],
  } as any);

  if (msg.stop_reason === "refusal") return json({ error: "Couldn't estimate that one. Enter it manually." }, 502);
  const raw = msg.content.filter((b: any) => b.type === "text").map((b: any) => b.text).join("");
  try {
    const est = JSON.parse(raw);
    return json({ estimate: est });
  } catch {
    return json({ error: "Couldn't read the estimate. Try describing it differently." }, 502);
  }
});
