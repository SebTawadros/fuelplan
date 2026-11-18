'use strict';
/* Outlift exercise library: what each exercise works, how to do it, what the equipment is,
   and a side-on stick-figure animation of the movement. */

// ---------- movement patterns ----------
// A pose places the hip, tilts the torso (degrees from upright, + leans right/forward),
// and pins the feet and hands; knees and elbows are solved automatically.
// Each pattern animates between pose A and pose B.
const PATTERNS = {
  squat: {
    a: { hip: [110, 126], t: 0, feet: [[110, 210]], hand: [104, 72] },
    b: { hip: [86, 172], t: 38, feet: [[110, 210]], hand: [118, 126] },
    load: 'shoulder', knee: 1, elbow: -1,
    muscles: 'Quads, glutes, hamstrings and core',
    steps: ['Feet shoulder-width apart, toes slightly out, bar resting on your upper back.', 'Brace your stomach, then sit your hips down and back like you’re sitting into a chair.', 'Go until your thighs are about parallel to the floor, then drive up through your whole foot.'],
    tip: 'Keep your chest up and knees tracking over your toes. Don’t let your heels lift.',
  },
  legpress: {
    a: { hip: [70, 170], t: -55, feet: [[158, 118]], hand: [86, 178] },
    b: { hip: [70, 170], t: -55, feet: [[108, 132]], hand: [86, 178] },
    knee: -1, elbow: 1, footMoves: true,
    muscles: 'Quads, glutes and hamstrings',
    steps: ['Sit back in the seat and put your feet shoulder-width on the platform.', 'Release the safety handles and lower the platform until your knees are at about 90°.', 'Push the platform away through your heels until your legs are almost straight.'],
    tip: 'Never lock your knees out at the top, and keep your lower back flat on the pad.',
  },
  hinge: {
    a: { hip: [100, 150], t: 62, feet: [[112, 210]], hand: [128, 192] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [114, 128] },
    load: 'hand', knee: 1, elbow: 1, bar: 'floor',
    muscles: 'Glutes, hamstrings, back and grip',
    steps: ['Stand with the bar over the middle of your feet and grip it just outside your legs.', 'Flatten your back, chest up, then push the floor away as you stand up tall.', 'Lower it back down the same way, hips back first, bar close to your legs.'],
    tip: 'Keep the bar dragging close to your shins and thighs. Never round your lower back.',
  },
  rdl: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [114, 128] },
    b: { hip: [96, 130], t: 72, feet: [[112, 210]], hand: [150, 168] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Hamstrings and glutes',
    steps: ['Stand tall holding the weight in front of your thighs, knees soft.', 'Push your hips straight back and let the weight slide down your legs.', 'When you feel a big stretch in your hamstrings, squeeze your glutes to stand back up.'],
    tip: 'It’s a hip movement, not a squat. Knees stay only slightly bent the whole time.',
  },
  bench: {
    a: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [82, 78] },
    b: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [90, 128] },
    load: 'hand', knee: 1, elbow: 1, prop: 'bench',
    muscles: 'Chest, front shoulders and triceps',
    steps: ['Lie on the bench with your eyes under the bar and feet flat on the floor.', 'Grip a bit wider than shoulders, unrack, and lower the bar to your mid-chest.', 'Press it back up until your arms are straight, bar over your shoulders.'],
    tip: 'Squeeze your shoulder blades together and keep your bum on the bench.',
  },
  incline: {
    a: { hip: [140, 150], t: -58, feet: [[180, 210]], hand: [98, 58] },
    b: { hip: [140, 150], t: -58, feet: [[180, 210]], hand: [104, 104] },
    load: 'hand', knee: 1, elbow: 1, prop: 'incline',
    muscles: 'Upper chest, front shoulders and triceps',
    steps: ['Set the bench to about 30–45° and sit back with feet flat.', 'Lower the weight to your upper chest with elbows slightly tucked.', 'Press back up and slightly toward your face until your arms are straight.'],
    tip: 'A lower incline (30°) keeps it a chest exercise instead of a shoulder one.',
  },
  fly: {
    a: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [82, 74] },
    b: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [58, 120] },
    load: 'hand', knee: 1, elbow: 1, prop: 'bench',
    muscles: 'Chest',
    steps: ['Hold the weights or handles above your chest with a slight bend in your elbows.', 'Open your arms out wide in a big arc until you feel a stretch across your chest.', 'Squeeze your chest to bring them back together, like hugging a tree.'],
    tip: 'Keep the same small elbow bend the whole time. It’s a hug, not a press.',
  },
  ohp: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [118, 66] },
    b: { hip: [110, 126], t: -4, feet: [[112, 210]], hand: [110, 6] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Shoulders, triceps and upper chest',
    steps: ['Stand tall with the weight at shoulder height, elbows slightly in front.', 'Brace your core and glutes, then press straight up over your head.', 'Lower it under control back to your shoulders.'],
    tip: 'Move your head back slightly so the bar travels in a straight line.',
  },
  row: {
    a: { hip: [100, 140], t: 60, feet: [[112, 210]], hand: [150, 176] },
    b: { hip: [100, 140], t: 60, feet: [[112, 210]], hand: [126, 136] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Upper back, lats, rear shoulders and biceps',
    steps: ['Hinge forward with a flat back, letting the weight hang under your shoulders.', 'Pull it up to your stomach, driving your elbows back.', 'Squeeze your shoulder blades together, then lower it slowly.'],
    tip: 'Don’t yank with your lower back. If your body rocks a lot, go lighter.',
  },
  cablerow: {
    a: { hip: [80, 172], t: 8, feet: [[166, 196]], hand: [148, 138] },
    b: { hip: [80, 172], t: -6, feet: [[166, 196]], hand: [104, 138] },
    load: 'cable', anchor: [232, 170], knee: -1, elbow: -1, prop: 'seat',
    muscles: 'Mid back, lats and biceps',
    steps: ['Sit with your feet on the platform and knees soft, holding the handle with arms straight.', 'Sit tall, then pull the handle to your belly button, elbows close to your sides.', 'Pause and squeeze your back, then let your arms straighten slowly.'],
    tip: 'Keep your chest up and don’t swing backwards to move the weight.',
  },
  pulldown: {
    a: { hip: [110, 160], t: 0, feet: [[150, 210]], hand: [112, 14] },
    b: { hip: [110, 160], t: -8, feet: [[150, 210]], hand: [118, 84] },
    load: 'cable', anchor: [112, -10], knee: 1, elbow: -1, prop: 'seat',
    muscles: 'Lats, upper back and biceps',
    steps: ['Sit with your knees under the pad and grab the bar wider than your shoulders.', 'Lean back slightly and pull the bar down to your upper chest.', 'Control it back up until your arms are fully straight.'],
    tip: 'Think “elbows to your back pockets”, not pulling with your hands.',
  },
  pullup: {
    a: { hip: [110, 138], t: 0, feet: [[112, 220]], hand: [110, 16] },
    b: { hip: [110, 96], t: 0, feet: [[112, 178]], hand: [110, 16] },
    knee: 1, elbow: -1, prop: 'pullbar', footMoves: true,
    muscles: 'Lats, upper back, biceps and grip',
    steps: ['Hang from the bar with hands a bit wider than shoulders, arms straight.', 'Pull your chest up toward the bar until your chin clears it.', 'Lower yourself all the way down with control.'],
    tip: 'Can’t do one yet? Use the assisted machine or a band, or just do slow lowerings.',
  },
  curl: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [114, 126] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [126, 72] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Biceps and forearms',
    steps: ['Stand tall holding the weight with arms straight, palms forward.', 'Keep your elbows pinned to your sides and curl the weight up to your shoulders.', 'Squeeze at the top, then lower it slowly all the way down.'],
    tip: 'No swinging. If your back has to help, the weight is too heavy.',
  },
  pushdown: {
    a: { hip: [110, 126], t: 6, feet: [[112, 210]], hand: [136, 74] },
    b: { hip: [110, 126], t: 6, feet: [[112, 210]], hand: [128, 128] },
    load: 'cable', anchor: [150, -10], knee: 1, elbow: 1,
    muscles: 'Triceps',
    steps: ['Face the cable, grab the bar or rope, elbows tucked at your sides.', 'Push down until your arms are fully straight.', 'Let it come back up to chest height without your elbows moving.'],
    tip: 'Your elbows are a hinge. They stay glued to your sides.',
  },
  overext: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [104, 6] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [90, 52] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Triceps (especially the long head)',
    steps: ['Hold the weight overhead with both hands, arms straight.', 'Bend only at the elbows to lower it behind your head.', 'Straighten your arms back up and squeeze your triceps.'],
    tip: 'Keep your elbows pointing forward, not flaring out to the sides.',
  },
  skull: {
    a: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [82, 78] },
    b: { hip: [140, 142], t: -90, feet: [[178, 210]], hand: [58, 104] },
    load: 'hand', knee: 1, elbow: -1, prop: 'bench',
    muscles: 'Triceps',
    steps: ['Lie on a bench holding the bar above your chest, arms straight.', 'Bend your elbows to lower the bar toward your forehead.', 'Straighten your arms to press it back up.'],
    tip: 'Only your forearms move. Keep your upper arms still.',
  },
  raise: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [112, 126] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [168, 70] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Side and front shoulders',
    steps: ['Stand tall with a dumbbell in each hand at your sides.', 'With a slight bend in the elbow, raise your arms out until they’re level with your shoulders.', 'Lower slowly. Don’t let them drop.'],
    tip: 'Lead with your elbows and go light. This one is about control, not weight.',
  },
  facepull: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [168, 62] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [124, 50] },
    load: 'cable', anchor: [232, 60], knee: 1, elbow: -1,
    muscles: 'Rear shoulders and upper back',
    steps: ['Set the cable at face height with a rope and step back with arms straight.', 'Pull the rope toward your face, splitting it apart and driving elbows high.', 'Squeeze your upper back, then return slowly.'],
    tip: 'Great for shoulder health. Light weight, lots of control.',
  },
  dip: {
    a: { hip: [118, 110], t: -4, feet: [[110, 186]], hand: [124, 110] },
    b: { hip: [116, 150], t: 8, feet: [[104, 226]], hand: [124, 110] },
    knee: -1, elbow: -1, prop: 'dipbars', footMoves: true,
    muscles: 'Chest, triceps and shoulders',
    steps: ['Hold the bars with arms straight and your body upright.', 'Bend your elbows to lower yourself until your shoulders are just below your elbows.', 'Press back up to straight arms.'],
    tip: 'Lean forward for more chest, stay upright for more triceps.',
  },
  pushup: {
    a: { hip: [140, 176], t: -70, feet: [[220, 206]], hand: [86, 208] },
    b: { hip: [140, 192], t: -82, feet: [[222, 207]], hand: [86, 208] },
    knee: 1, elbow: 1,
    muscles: 'Chest, shoulders, triceps and core',
    steps: ['Hands just wider than shoulders, body in a straight line from head to heels.', 'Lower your chest to just above the floor, elbows at about 45°.', 'Push the floor away back to the top.'],
    tip: 'Squeeze your glutes so your hips don’t sag. Knees down is fine to start.',
  },
  plank: {
    a: { hip: [140, 186], t: -78, feet: [[222, 207]], hand: [100, 208] },
    b: { hip: [140, 184], t: -78, feet: [[222, 207]], hand: [100, 208] },
    knee: 1, elbow: 1,
    muscles: 'Core and shoulders',
    steps: ['Forearms on the floor under your shoulders, legs straight behind you.', 'Lift your hips so your body is one straight line.', 'Hold it there and breathe. Don’t let your hips sag or pike up.'],
    tip: 'Squeeze your glutes and pull your belly button in.',
  },
  lunge: {
    a: { hip: [108, 126], t: 0, feet: [[150, 210], [66, 208]], hand: [110, 126] },
    b: { hip: [108, 172], t: 4, feet: [[150, 210], [66, 208]], hand: [112, 172] },
    load: 'hand', knee: 1, elbow: 1, kneeBack: -1,
    muscles: 'Quads, glutes and balance',
    steps: ['Stand with one foot well in front of the other.', 'Drop your back knee straight down toward the floor.', 'Push through your front heel to come back up.'],
    tip: 'Keep your front knee over your ankle and your chest tall.',
  },
  legext: {
    a: { hip: [100, 150], t: -6, feet: [[142, 196]], hand: [104, 150] },
    b: { hip: [100, 150], t: -6, feet: [[184, 152]], hand: [104, 150] },
    knee: 1, elbow: 1, prop: 'machine', footMoves: true,
    muscles: 'Quads',
    steps: ['Sit with your back against the pad and the roller on your lower shins.', 'Straighten your legs to lift the pad until your knees are almost locked.', 'Squeeze your thighs at the top, then lower slowly.'],
    tip: 'Line your knee up with the machine’s pivot point.',
  },
  legcurl: {
    a: { hip: [110, 150], t: -90, feet: [[194, 152]], hand: [60, 160] },
    b: { hip: [110, 150], t: -90, feet: [[146, 108]], hand: [60, 160] },
    knee: -1, elbow: 1, prop: 'bench', footMoves: true,
    muscles: 'Hamstrings',
    steps: ['Lie face down with the pad just above your heels.', 'Curl your heels toward your bum as far as you can.', 'Lower it back down slowly.'],
    tip: 'Keep your hips pressed into the bench the whole time.',
  },
  calf: {
    a: { hip: [110, 116], t: 0, feet: [[112, 200]], hand: [112, 116] },
    b: { hip: [110, 104], t: 0, feet: [[112, 188]], hand: [112, 104] },
    load: 'hand', knee: 1, elbow: 1, prop: 'step', footMoves: true,
    muscles: 'Calves',
    steps: ['Stand with the balls of your feet on a step, heels hanging off.', 'Rise up onto your toes as high as you can.', 'Lower slowly until you feel a stretch in your calves.'],
    tip: 'Pause at the top and the bottom. No bouncing.',
  },
  thrust: {
    a: { hip: [112, 184], t: -55, feet: [[170, 210]], hand: [110, 180] },
    b: { hip: [120, 150], t: -90, feet: [[170, 210]], hand: [118, 148] },
    load: 'hand', knee: 1, elbow: 1, prop: 'lowbench',
    muscles: 'Glutes and hamstrings',
    steps: ['Upper back against a bench, weight across your hips, feet flat.', 'Drive through your heels to lift your hips until your body is flat like a table.', 'Squeeze your glutes hard at the top, then lower.'],
    tip: 'Tuck your chin and look forward. Ribs down, don’t arch your back.',
  },
  kickback: {
    a: { hip: [110, 126], t: 10, feet: [[112, 210], [110, 206]], hand: [140, 90] },
    b: { hip: [110, 126], t: 18, feet: [[112, 210], [52, 182]], hand: [140, 90] },
    knee: 1, elbow: 1, kneeBack: 1, footMoves: true,
    muscles: 'Glutes',
    steps: ['Attach the ankle strap, hold the machine and stand on one leg.', 'Kick the working leg straight back, squeezing your glute.', 'Bring it back slowly without letting the weight stack touch down.'],
    tip: 'Don’t arch your lower back to get the leg higher.',
  },
  crunch: {
    a: { hip: [130, 196], t: -90, feet: [[176, 208]], hand: [74, 182] },
    b: { hip: [130, 196], t: -52, feet: [[176, 208]], hand: [90, 156] },
    knee: 1, elbow: -1,
    muscles: 'Abs',
    steps: ['Lie on your back with knees bent and feet flat.', 'Curl your shoulders off the floor by squeezing your abs.', 'Lower back down slowly.'],
    tip: 'Think about bringing your ribs toward your hips, not pulling your neck.',
  },
  legraise: {
    a: { hip: [110, 138], t: 0, feet: [[112, 220]], hand: [110, 16] },
    b: { hip: [110, 138], t: 0, feet: [[194, 140]], hand: [110, 16] },
    knee: 1, elbow: -1, prop: 'pullbar', footMoves: true,
    muscles: 'Lower abs and hip flexors',
    steps: ['Hang from a bar with straight arms.', 'Raise your legs up in front until they’re level with your hips.', 'Lower them slowly without swinging.'],
    tip: 'Bend your knees to make it easier.',
  },
  shrug: {
    a: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [112, 130] },
    b: { hip: [110, 126], t: 0, feet: [[112, 210]], hand: [112, 118] },
    load: 'hand', knee: 1, elbow: 1,
    muscles: 'Traps',
    steps: ['Stand tall holding heavy weights at your sides.', 'Lift your shoulders straight up toward your ears.', 'Hold for a second, then lower.'],
    tip: 'Straight up and down. Don’t roll your shoulders.',
  },
};

// ---------- equipment descriptions ----------
const EQUIP = {
  barbell: ['🏋️ Barbell', 'A long metal bar (the standard one weighs 20kg) that you load with weight plates on each end. Use clips so the plates don’t slide.'],
  dumbbell: ['💪 Dumbbells', 'Hand weights, usually on a rack in pairs from light to heavy. Pick a pair you can control for every rep.'],
  cable: ['🔗 Cable machine', 'A tall frame with a weight stack and a pulley. Move the pin to choose the weight, slide the pulley to the right height, and clip on a handle, bar or rope.'],
  machine: ['⚙️ Machine', 'A guided machine with a pad or seat. Adjust the seat so the joint you’re moving lines up with the machine’s pivot, then set the pin in the weight stack.'],
  legpress: ['⚙️ Leg press machine', 'A sled you push away with your legs while sitting back on an angled seat. Add plates on the side pegs, and use the safety handles to lock and unlock it.'],
  bodyweight: ['🙌 Bodyweight', 'No equipment needed. Your body is the weight. Add a weight belt or vest once it gets easy.'],
  pullbar: ['🪜 Pull-up bar', 'A fixed overhead bar. Many gyms have an assisted pull-up machine with a knee pad that helps lift you.'],
  dipbars: ['🪜 Dip station', 'Two parallel bars at waist height. Some gyms have an assisted dip machine.'],
  bench: ['🛏️ Bench', 'A flat or adjustable padded bench. Check it’s stable and set to the right angle before you start.'],
};

// ---------- name → pattern + equipment ----------
function exerciseInfo(name) {
  const n = String(name || '').toLowerCase();
  const has = (...w) => w.some(x => n.includes(x));
  let p = 'curl';
  if (has('leg press', 'hack squat')) p = 'legpress';
  else if (has('leg extension')) p = 'legext';
  else if (has('leg curl', 'hamstring curl', 'nordic')) p = 'legcurl';
  else if (has('calf')) p = 'calf';
  else if (has('hip thrust', 'glute bridge', 'bridge')) p = 'thrust';
  else if (has('kickback') && !has('tricep')) p = 'kickback';
  else if (has('abduction', 'adduction')) p = 'kickback';
  else if (has('romanian', 'rdl', 'stiff leg', 'good morning')) p = 'rdl';
  else if (has('deadlift', 'rack pull')) p = 'hinge';
  else if (has('lunge', 'split squat', 'step up')) p = 'lunge';
  else if (has('squat', 'goblet')) p = 'squat';
  else if (has('incline')) p = has('fly') ? 'fly' : 'incline';
  else if (has('fly', 'flye', 'pec deck', 'crossover')) p = 'fly';
  else if (has('skull', 'lying tricep', 'french press')) p = 'skull';
  else if (has('overhead tricep', 'tricep extension', 'overhead extension')) p = 'overext';
  else if (has('pushdown', 'push down', 'tricep')) p = 'pushdown';
  else if (has('bench', 'chest press', 'floor press')) p = 'bench';
  else if (has('push up', 'push-up', 'pushup')) p = 'pushup';
  else if (has('dip')) p = 'dip';
  else if (has('overhead press', 'shoulder press', 'military', 'arnold', 'ohp', 'push press')) p = 'ohp';
  else if (has('lateral raise', 'front raise', 'side raise', 'rear delt', 'y raise')) p = has('rear delt') ? 'facepull' : 'raise';
  else if (has('face pull')) p = 'facepull';
  else if (has('pulldown', 'pull down', 'lat pull')) p = 'pulldown';
  else if (has('pull up', 'pull-up', 'pullup', 'chin up', 'chin-up', 'chinup')) p = 'pullup';
  else if (has('cable row', 'seated row', 'seated cable')) p = 'cablerow';
  else if (has('row')) p = 'row';
  else if (has('pullover')) p = 'skull';
  else if (has('shrug')) p = 'shrug';
  else if (has('plank', 'hollow hold')) p = 'plank';
  else if (has('leg raise', 'knee raise', 'hanging')) p = 'legraise';
  else if (has('crunch', 'sit up', 'sit-up', 'ab wheel', 'rollout')) p = 'crunch';
  else if (has('curl')) p = 'curl';

  let e = 'barbell';
  if (has('dumbbell', 'db ', 'goblet', 'arnold', 'concentration', 'hammer', 'lateral raise', 'front raise')) e = 'dumbbell';
  if (has('cable', 'pushdown', 'push down', 'pulldown', 'lat pull', 'face pull', 'crossover', 'kickback', 'seated row')) e = 'cable';
  if (has('machine', 'leg extension', 'leg curl', 'pec deck', 'abduction', 'adduction', 'chest press', 'smith')) e = 'machine';
  if (p === 'legpress') e = 'legpress';
  if (['pullup', 'legraise'].includes(p)) e = 'pullbar';
  if (p === 'dip') e = 'dipbars';
  if (['pushup', 'plank', 'crunch'].includes(p) || has('bodyweight')) e = 'bodyweight';
  if (p === 'cablerow' || p === 'pulldown' || p === 'pushdown' || p === 'facepull') e = has('machine') ? 'machine' : 'cable';
  if (p === 'legext' || p === 'legcurl') e = 'machine';
  return { pattern: p, equip: e, ...PATTERNS[p] };
}

// ---------- real photos (start + finish position) ----------
// EX_PHOTOS comes from ex/map.js. Exact name first, then the longest known name inside it ("Incline Barbell Bench Press" → bench press).
function lookupExercise(map, name) {
  if (!map) return null;
  const n = String(name || '').toLowerCase().replace(/[-_]/g, ' ').replace(/\s+/g, ' ').trim();
  const single = n.replace(/(?<!s)s$/, ''); // "calf raises" → "calf raise", but "press" stays "press"
  for (const v of [n, single]) if (map[v]) return map[v];
  const keys = Object.keys(map).filter(k => n.includes(k) || single.includes(k)).sort((a, b) => b.length - a.length);
  return keys.length ? map[keys[0]] : null;
}
const photoFor = name => lookupExercise(typeof EX_PHOTOS === 'undefined' ? null : EX_PHOTOS, name);
const videoFor = name => lookupExercise(typeof EX_VIDEOS === 'undefined' ? null : EX_VIDEOS, name);
function videoHtml([id, channel], name) {
  const src = `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&mute=1&playsinline=1&loop=1&playlist=${id}&rel=0&modestbranding=1`;
  return `<div class="video-wrap"><iframe src="${src}" title="${name} demo video" allow="autoplay; encrypted-media; picture-in-picture; fullscreen" allowfullscreen loading="lazy"></iframe></div>
    <div class="tiny muted mt">Video by ${channel} on YouTube · plays muted, tap 🔊 for sound</div>`;
}
function photoAnimHtml(slug, name) {
  return `<div class="photo-anim" data-act="togglePhoto" title="Tap to pause">
    <img src="ex/${slug}-0.jpg" alt="${name} start position" loading="eager">
    <img src="ex/${slug}-1.jpg" alt="${name} finish position" class="b" loading="eager">
    <span class="ph ph-a">Start</span><span class="ph ph-b">Finish</span></div>`;
}

// ---------- animation ----------
const L = { torso: 58, head: 13, upper: 32, fore: 30, thigh: 43, shin: 43 };
const rad = d => d * Math.PI / 180;
const lerp = (a, b, k) => a + (b - a) * k;
const lerpPt = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
// two-bone IK: joint between root and end, bent to one side
function ik(root, end, l1, l2, bend) {
  let dx = end[0] - root[0], dy = end[1] - root[1];
  let d = Math.hypot(dx, dy) || 1e-6;
  const max = l1 + l2 - 0.01;
  if (d > max) { dx *= max / d; dy *= max / d; d = max; end = [root[0] + dx, root[1] + dy]; }
  const a = Math.acos(Math.min(1, Math.max(-1, (l1 * l1 + d * d - l2 * l2) / (2 * l1 * d))));
  const base = Math.atan2(dy, dx) + bend * a;
  return [[root[0] + l1 * Math.cos(base), root[1] + l1 * Math.sin(base)], end];
}
function pose(info, k) {
  const A = info.a, B = info.b;
  const hip = lerpPt(A.hip, B.hip, k), t = lerp(A.t, B.t, k);
  const sh = [hip[0] + L.torso * Math.sin(rad(t)), hip[1] - L.torso * Math.cos(rad(t))];
  const head = [sh[0] + (L.head + 4) * Math.sin(rad(t)), sh[1] - (L.head + 4) * Math.cos(rad(t))];
  const legs = A.feet.map((f, i) => {
    const target = lerpPt(f, B.feet[i] || f, k);
    const bend = i === 1 && info.kneeBack ? info.kneeBack : info.knee;
    return [hip, ...ik(hip, target, L.thigh, L.shin, -bend)];
  });
  const hand = lerpPt(A.hand, B.hand, k);
  const arm = [sh, ...ik(sh, hand, L.upper, L.fore, info.elbow)];
  return { hip, sh, head, legs, arm, t };
}
const ease = x => 0.5 - 0.5 * Math.cos(Math.PI * x);

function propSvg(info) {
  switch (info.prop) {
    case 'bench': return '<rect x="50" y="150" width="130" height="10" rx="4" class="eq"/><rect x="70" y="160" width="8" height="50" class="eq"/><rect x="150" y="160" width="8" height="50" class="eq"/>';
    case 'incline': return '<path d="M88 170 L150 160 L150 170 L92 178Z" class="eq"/><path d="M88 170 L118 96 L128 100 L98 172Z" class="eq"/><rect x="120" y="170" width="8" height="40" class="eq"/>';
    case 'lowbench': return '<rect x="20" y="150" width="56" height="10" rx="4" class="eq"/><rect x="34" y="160" width="8" height="50" class="eq"/>';
    case 'seat': return '<rect x="58" y="176" width="54" height="10" rx="4" class="eq"/><rect x="80" y="186" width="8" height="24" class="eq"/>';
    case 'pullbar': return '<rect x="40" y="12" width="150" height="7" rx="3" class="eq"/><rect x="40" y="12" width="7" height="198" class="eq"/><rect x="183" y="12" width="7" height="198" class="eq"/>';
    case 'dipbars': return '<rect x="100" y="110" width="60" height="6" rx="3" class="eq"/><rect x="150" y="110" width="7" height="100" class="eq"/>';
    case 'step': return '<rect x="92" y="202" width="40" height="10" rx="2" class="eq"/>';
    case 'machine': return '<rect x="60" y="154" width="54" height="10" rx="4" class="eq"/><rect x="62" y="96" width="10" height="64" rx="4" class="eq"/><rect x="80" y="164" width="8" height="46" class="eq"/><rect x="196" y="40" width="22" height="170" rx="4" class="eq2"/>';
    default: return '';
  }
}
function exerciseSvg(info) {
  const legPress = info.pattern === 'legpress'
    ? '<path d="M40 190 L100 180 L60 120Z" class="eq2"/><rect x="150" y="80" width="12" height="80" rx="3" class="eq" transform="rotate(-22 156 120)"/>' : '';
  return `<svg viewBox="0 -20 240 240" class="exanim" role="img" aria-label="Animation of the movement">
    <line x1="0" y1="211" x2="240" y2="211" class="ground"/>
    ${legPress}${propSvg(info)}
    <g class="fig"><line class="cable" style="display:none"/><g class="legs"></g>
      <line class="torso"/><circle class="head" r="${L.head}"/><polyline class="arm"/>
      <g class="load"></g></g></svg>`;
}
function startAnimation(svg, info) {
  const fig = svg.querySelector('.fig');
  const legsG = fig.querySelector('.legs'), torso = fig.querySelector('.torso'), head = fig.querySelector('.head');
  const arm = fig.querySelector('.arm'), loadG = fig.querySelector('.load'), cable = fig.querySelector('.cable');
  const period = 2600;
  let raf, t0 = performance.now(), stopped = false;
  const loadAt = (p) => {
    const at = info.load === 'shoulder' ? p.sh : p.arm[2];
    if (!info.load || info.load === 'cable') return '';
    if (info.equip === 'barbell') {
      const plate = info.bar === 'floor' ? 17 : 15;
      return `<line x1="${at[0] - 4}" y1="${at[1]}" x2="${at[0] + 4}" y2="${at[1]}" class="bar"/><circle cx="${at[0]}" cy="${at[1]}" r="${plate}" class="plate"/><circle cx="${at[0]}" cy="${at[1]}" r="4" class="hub"/>`;
    }
    if (info.equip === 'dumbbell' || info.equip === 'barbell') return `<rect x="${at[0] - 11}" y="${at[1] - 5}" width="22" height="10" rx="4" class="db"/>`;
    return `<circle cx="${at[0]}" cy="${at[1]}" r="6" class="db"/>`;
  };
  const draw = (now) => {
    if (stopped) return;
    const ph = ((now - t0) % period) / period;
    // hold briefly at each end so the movement reads clearly
    const k = ph < 0.1 ? 0 : ph < 0.5 ? ease((ph - 0.1) / 0.4) : ph < 0.6 ? 1 : ease(1 - (ph - 0.6) / 0.4);
    const p = pose(info, k);
    legsG.innerHTML = p.legs.map(([h, kn, ft]) => `<polyline points="${h} ${kn} ${ft}" class="leg"/><line x1="${ft[0]}" y1="${ft[1]}" x2="${ft[0] + 12}" y2="${ft[1]}" class="foot"/>`).join('');
    torso.setAttribute('x1', p.hip[0]); torso.setAttribute('y1', p.hip[1]); torso.setAttribute('x2', p.sh[0]); torso.setAttribute('y2', p.sh[1]);
    head.setAttribute('cx', p.head[0]); head.setAttribute('cy', p.head[1]);
    arm.setAttribute('points', p.arm.map(q => q.join(',')).join(' '));
    if (info.load === 'cable' && info.anchor) {
      cable.style.display = '';
      cable.setAttribute('x1', info.anchor[0]); cable.setAttribute('y1', info.anchor[1]);
      cable.setAttribute('x2', p.arm[2][0]); cable.setAttribute('y2', p.arm[2][1]);
    }
    loadG.innerHTML = loadAt(p);
    raf = requestAnimationFrame(draw);
  };
  raf = requestAnimationFrame(draw);
  return () => { stopped = true; cancelAnimationFrame(raf); };
}
