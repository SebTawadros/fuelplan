-- The brain: runs when a user taps "Finish workout".
-- Detects PRs and losses, checks goals, awards badges, moves the leaderboard and broadcasts notifications.
create or replace function public.finish_workout(p_workout uuid) returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  uid uuid := auth.uid();
  w workouts%rowtype;
  me profiles%rowtype;
  vol numeric;
  r record;
  prs jsonb := '[]'::jsonb;
  losses jsonb := '[]'::jsonb;
  new_badges text[] := '{}';
  goals_hit jsonb := '[]'::jsonb;
  total_workouts int; total_prs int; week_days int; max_w numeric;
  my_rank int; ranked int; my_gain numeric; leader uuid; old_leader text; last_user uuid;
  pr_text text; loss_text text; prev_workout uuid;
begin
  select * into w from workouts where id = p_workout;
  if w.id is null or w.user_id <> uid then raise exception 'Not your workout'; end if;
  if w.finished then raise exception 'Workout already finished'; end if;
  select * into me from profiles where id = uid;

  select coalesce(sum(weight * reps) filter (where completed), 0) into vol from lifts where workout_id = p_workout;
  update workouts set finished = true, total_volume = vol where id = p_workout;

  -- compare each exercise in this session against everything before it
  for r in
    with today as (
      select lower(trim(exercise)) ex, min(exercise) label, max(e1rm) best, max(weight) topw,
             (array_agg(reps order by e1rm desc))[1] top_reps
      from lifts where workout_id = p_workout and completed and reps > 0 and weight > 0 group by 1
    ), before as (
      select lower(trim(li.exercise)) ex, max(li.e1rm) best, max(li.weight) topw
      from lifts li join workouts ww on ww.id = li.workout_id
      where li.user_id = uid and ww.finished and ww.id <> p_workout and ww.created_at < w.created_at
        and li.completed and li.reps > 0 and li.weight > 0
      group by 1
    )
    select t.label, t.best, t.topw, t.top_reps, b.best prev_best, b.topw prev_topw
    from today t left join before b using (ex)
  loop
    if r.prev_best is not null and r.best > r.prev_best then
      prs := prs || jsonb_build_object('exercise', r.label, 'weight', r.topw, 'reps', r.top_reps,
              'prev_weight', r.prev_topw, 'pct', round((r.best - r.prev_best) / r.prev_best * 100, 1));
    elsif r.prev_best is not null and r.best < r.prev_best * 0.95 then
      losses := losses || jsonb_build_object('exercise', r.label, 'weight', r.topw, 'reps', r.top_reps,
              'prev_weight', r.prev_topw, 'pct', round((r.best - r.prev_best) / r.prev_best * 100, 1));
    end if;
  end loop;

  -- goals
  for r in
    update goals g set achieved_at = now()
    where g.user_id = uid and g.achieved_at is null and exists (
      select 1 from lifts li where li.workout_id = p_workout and li.completed and li.reps > 0
        and lower(trim(li.exercise)) = lower(trim(g.exercise)) and li.weight >= g.target_weight)
    returning g.exercise, g.target_weight
  loop
    goals_hit := goals_hit || jsonb_build_object('exercise', r.exercise, 'target', r.target_weight);
    perform notify_all(uid, 'goal', '🎯 ' || me.username || ' smashed a goal!',
      r.exercise || ' ' || r.target_weight || 'kg — locked in.', '#/user/' || uid);
    perform notify_user(uid, uid, 'goal', '🎯 GOAL SMASHED: ' || r.exercise || ' ' || r.target_weight || 'kg', 'You set it. You hit it. Set the next one.', '#/profile');
    if award_badge(uid, 'goal_crusher') then new_badges := array_append(new_badges, 'goal_crusher'); end if;
  end loop;

  -- PR broadcast
  if jsonb_array_length(prs) > 0 then
    select string_agg((p->>'exercise') || ' ' || (p->>'weight') || 'kg×' || (p->>'reps') || ' (+' || (p->>'pct') || '%)', ', ')
      into pr_text from jsonb_array_elements(prs) p;
    perform notify_all(uid, 'pr', '🔥 ' || me.username || ' hit ' || jsonb_array_length(prs) || ' PR' ||
      case when jsonb_array_length(prs) > 1 then 's' else '' end || '!', pr_text, '#/workout/' || p_workout);
  end if;

  -- Loss exposure
  if jsonb_array_length(losses) > 0 then
    select string_agg((p->>'exercise') || ' ' || (p->>'prev_weight') || '→' || (p->>'weight') || 'kg (' || (p->>'pct') || '%)', ', ')
      into loss_text from jsonb_array_elements(losses) p;
    perform notify_all(uid, 'loss', '📉 ' || me.username || ' went BACKWARDS', loss_text || '. Someone check on them.', '#/workout/' || p_workout);
    perform notify_user(uid, uid, 'loss', '📉 You went backwards today', loss_text || '. Everyone has been told. Bounce back.', '#/workout/' || p_workout);
  end if;

  -- Badges
  select count(*) into total_workouts from workouts where user_id = uid and finished;
  select count(distinct performed_on) into week_days from workouts where user_id = uid and finished and performed_on > current_date - 7;
  select coalesce(max(weight), 0) into max_w from lifts where workout_id = p_workout and completed and reps > 0;
  select coalesce(lb.prs, 0) into total_prs from leaderboard(null, null) lb where lb.user_id = uid;

  if total_workouts >= 1 and award_badge(uid, 'first_workout') then new_badges := array_append(new_badges, 'first_workout'); end if;
  if total_workouts >= 5 and award_badge(uid, 'workouts_5') then new_badges := array_append(new_badges, 'workouts_5'); end if;
  if total_workouts >= 10 and award_badge(uid, 'workouts_10') then new_badges := array_append(new_badges, 'workouts_10'); end if;
  if total_workouts >= 25 and award_badge(uid, 'workouts_25') then new_badges := array_append(new_badges, 'workouts_25'); end if;
  if total_workouts >= 50 and award_badge(uid, 'workouts_50') then new_badges := array_append(new_badges, 'workouts_50'); end if;
  if total_workouts >= 100 and award_badge(uid, 'workouts_100') then new_badges := array_append(new_badges, 'workouts_100'); end if;
  if total_prs >= 1 and award_badge(uid, 'first_pr') then new_badges := array_append(new_badges, 'first_pr'); end if;
  if total_prs >= 10 and award_badge(uid, 'prs_10') then new_badges := array_append(new_badges, 'prs_10'); end if;
  if total_prs >= 25 and award_badge(uid, 'prs_25') then new_badges := array_append(new_badges, 'prs_25'); end if;
  if max_w >= 100 and award_badge(uid, 'club_100') then new_badges := array_append(new_badges, 'club_100'); end if;
  if max_w >= 140 and award_badge(uid, 'club_140') then new_badges := array_append(new_badges, 'club_140'); end if;
  if max_w >= 180 and award_badge(uid, 'club_180') then new_badges := array_append(new_badges, 'club_180'); end if;
  if vol >= 5000 and award_badge(uid, 'volume_5k') then new_badges := array_append(new_badges, 'volume_5k'); end if;
  if vol >= 10000 and award_badge(uid, 'volume_10k') then new_badges := array_append(new_badges, 'volume_10k'); end if;
  if week_days >= 3 and award_badge(uid, 'week_3') then new_badges := array_append(new_badges, 'week_3'); end if;
  if week_days >= 5 and award_badge(uid, 'week_5') then new_badges := array_append(new_badges, 'week_5'); end if;

  -- Comeback: a PR right after a session where you went backwards
  select id into prev_workout from workouts
    where user_id = uid and finished and id <> p_workout and created_at < w.created_at
    order by created_at desc limit 1;
  if jsonb_array_length(prs) > 0 and prev_workout is not null
     and exists (select 1 from notifications n where n.user_id = uid and n.kind = 'loss' and n.link = '#/workout/' || prev_workout)
     and award_badge(uid, 'comeback') then new_badges := array_append(new_badges, 'comeback'); end if;

  -- Leaderboard movement
  with lb as (select x.*, row_number() over (order by x.gain_pct desc, x.prs desc, x.volume desc) rk from leaderboard(null, null) x where x.gain_pct is not null)
  select (select rk from lb where lb.user_id = uid), (select count(*) from lb), (select lb.gain_pct from lb where lb.user_id = uid),
         (select lb.user_id from lb where rk = 1), (select lb.user_id from lb order by rk desc limit 1)
    into my_rank, ranked, my_gain, leader, last_user;

  select value into old_leader from app_state where key = 'leader';
  if leader is not null and leader::text is distinct from old_leader then
    insert into app_state(key, value) values ('leader', leader::text)
      on conflict (key) do update set value = excluded.value;
    if leader = uid then
      perform notify_all(uid, 'leader', '👑 ' || me.username || ' just took #1 on the leaderboard!',
        'Up ' || my_gain || '% pound-for-pound. Come take it back.', '#/leaderboard');
      perform notify_user(uid, uid, 'leader', '👑 YOU ARE #1', 'You are leading the whole app at +' || my_gain || '%. Defend it.', '#/leaderboard');
      if award_badge(uid, 'king') then new_badges := array_append(new_badges, 'king'); end if;
    end if;
  end if;
  if ranked >= 3 and last_user = uid then
    perform notify_all(uid, 'last', '🐢 ' || me.username || ' is DEAD LAST on the leaderboard', 'Only +' || coalesce(my_gain, 0) || '%. Send help (or a roast).', '#/leaderboard');
    perform notify_user(uid, uid, 'last', '🐢 You are dead last', 'Everyone can see it. Time to move.', '#/leaderboard');
  end if;

  -- tell everyone a session was logged (only if nothing louder already went out)
  if jsonb_array_length(prs) = 0 and jsonb_array_length(losses) = 0 then
    perform notify_all(uid, 'workout', '🏋️ ' || me.username || ' just finished ' || coalesce(w.day_name, 'a workout'),
      round(vol) || 'kg moved. Give them a 🔥', '#/workout/' || p_workout);
  end if;

  return jsonb_build_object('prs', prs, 'losses', losses, 'badges', to_jsonb(new_badges), 'goals', goals_hit,
    'rank', my_rank, 'ranked', ranked, 'gain', my_gain, 'volume', vol, 'workouts', total_workouts);
end $$;
grant execute on function public.finish_workout(uuid) to authenticated;
