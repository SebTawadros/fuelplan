# Outlift

Gym split tracker with accounts, a pound-for-pound leaderboard, comments, chat, badges, goals and push notifications.

- `index.html`, `sw.js`, `manifest.webmanifest`, icons: the whole front end. Drag this folder into Netlify to host it.
- Backend: Supabase project `liftboard` (ref `zmchhnjwgyvyjixuwpuq`). Database tables, RLS, the leaderboard and
  `finish_workout` functions, and the daily/weekly notification cron jobs live there.
- `supabase/functions/`: edge functions — `signup` (username + password accounts), `push` (web push sender,
  triggered by the database), `ai-recap` (Claude-written leaderboard recap; needs the `ANTHROPIC_API_KEY` secret).

## Leaderboard maths
Each set becomes an estimated 1-rep max: `weight × (1 + reps / 30)`. A user's score is their average % improvement
across exercises — best ever vs first session (all time) or best this week vs best before (this week).
50→70 kg (+40%) beats 80→90 kg (+12.5%).
