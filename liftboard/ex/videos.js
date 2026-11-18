// Embedded YouTube demo videos per exercise: [videoId, channel]. Played inside Outlift via youtube-nocookie.com.
const EX_VIDEOS = {
"bench press": [
"hWbUlkb5Ms4",
"Jeff Nippard"
],
"incline bench press": [
"VFbjmiAAwJE",
"Jim Stoppani, PhD"
],
"incline barbell bench press": [
"i06buX4DNHQ",
"TylerPath"
],
"incline dumbbell press": [
"IP4oeKh1Sd4",
"Max Euceda"
],
"dumbbell bench press": [
"1V3vpcaxRYQ",
"Davis Diley"
],
"close grip bench press": [
"NKHhj7SJsQA",
"Renaissance Periodization"
],
"decline bench press": [
"Kxt_5D2Rpgg",
"MyTraining App"
],
"machine chest press": [
"sqNwDkUU_Ps",
"PureGym"
],
"chest press": [
"n8TOta_pfr4",
"LIVESTRONG"
],
"cable fly": [
"QcTcWpkn_bw",
"PureGym"
],
"cable crossover": [
"taI4XduLpTk",
"LIVESTRONG"
],
"dumbbell fly": [
"atcyT99YDeI",
"Mind Pump TV"
],
"incline dumbbell fly": [
"ajdFwa-qM98",
"Howcast"
],
"pec deck": [
"g3T7LsEeDWQ",
"Davis Diley"
],
"dips": [
"ci5tcFgIntI",
"Davis Diley"
],
"tricep dips": [
"y4gHJ8OjxTg",
"Well+Good"
],
"bench dips": [
"0326dy_-CzM",
"LIVESTRONG"
],
"push up": [
"c-lBErfxszs",
"Davis Diley"
],
"overhead press": [
"wJlKUo2-P4o",
"Alan Thrall (Untamed Strength)"
],
"military press": [
"43GSKivZnw4",
"PureGym"
],
"shoulder press": [
"OLePvpxQEGk",
"Davis Diley"
],
"dumbbell shoulder press": [
"OLePvpxQEGk",
"Davis Diley"
],
"barbell shoulder press": [
"G2qpTG1Eh40",
"Renaissance Periodization"
],
"arnold press": [
"6Z15_WdXmVw",
"Buff Dudes"
],
"lateral raise": [
"JIhbYYA1Q90",
"Davis Diley"
],
"front raise": [
"gzDawZwDC6Y",
"LIVESTRONG"
],
"rear delt fly": [
"JL8nHvZcAK8",
"Tri Cities Gold's Gym"
],
"face pull": [
"8686PLZB_1Q",
"ATHLEAN-X™"
],
"shrug": [
"cJRVVxmytaM",
"ScottHermanFitness"
],
"dumbbell shrug": [
"g6qbq4Lf1FI",
"LIVESTRONG"
],
"upright row": [
"jaAV-rD45I0",
"Buff Dudes"
],
"squat": [
"MLoZuAkIyZI",
"Davis Diley"
],
"back squat": [
"rrJIyZGlK8c",
"PureGym"
],
"front squat": [
"gDQStEjb-sw",
"DEMIC"
],
"goblet squat": [
"nfX7IFK9UNI",
"National Academy of Sports Medicine (NASM)"
],
"box squat": [
"nBc_2Jyp3tM",
"Misfit Athletics"
],
"leg press": [
"nDh_BlnLCGc",
"Jeff Nippard"
],
"hack squat": [
"0tn5K9NlCfo",
"Bodybuilding.com"
],
"bulgarian split squat": [
"uODWo4YqbT8",
"Davis Diley"
],
"split squat": [
"lG3MsPmEQQk",
"Squat University"
],
"walking lunge": [
"Pbmj6xPo-Hw",
"Buff Dudes Workouts"
],
"lunge": [
"3XDriUn0udo",
"Mind Pump TV"
],
"dumbbell lunge": [
"3XDriUn0udo",
"Mind Pump TV"
],
"step up": [
"elhu-WC1qk4",
"[P]rehab"
],
"leg extension": [
"ztNBgrGy6FQ",
"Jeff Nippard"
],
"leg curl": [
"t9sTSr-JYSs",
"SilverSneakers"
],
"lying leg curl": [
"nMRte-HF0zY",
"Idris"
],
"seated leg curl": [
"t9sTSr-JYSs",
"SilverSneakers"
],
"romanian deadlift": [
"7j-2w4-P14I",
"Nuffield Health"
],
"stiff leg deadlift": [
"ie3SeV1kpCA",
"Bodybuildergreats"
],
"hip thrust": [
"pUdIL5x0fWg",
"Nuffield Health"
],
"glute bridge": [
"SKOMwg1JLrU",
"National Academy of Sports Medicine (NASM)"
],
"hip abduction": [
"G_8LItOiZ0Q",
"PureGym"
],
"hip adduction": [
"CjAVezAggkI",
"PureGym"
],
"calf raise": [
"-M4-G8p8fmc",
"Howcast"
],
"seated calf raise": [
"3ZRe_QpvRPg",
"PureGym"
],
"deadlift": [
"ZaTM37cfiDs",
"Jeff Nippard"
],
"sumo deadlift": [
"e7oLkRlT2CQ",
"Squat University"
],
"good morning": [
"vKPGe8zb2S4",
"Buff Dudes"
],
"barbell row": [
"Nqh7q3zDCoQ",
"Jeremy Ethier Shorts"
],
"bent over row": [
"bm0_q9bR_HA",
"National Academy of Sports Medicine (NASM)"
],
"dumbbell row": [
"gfUg6qWohTk",
"ATHLEAN-X™"
],
"seated cable row": [
"xQNrFHEMhI4",
"Bodybuilding.com"
],
"cable row": [
"vwHG9Jfu4sw",
"Max Euceda"
],
"lat pulldown": [
"z-lxcsIN4T4",
"Davis Diley"
],
"close grip lat pulldown": [
"IjoFCmLX7z0",
"PureGym"
],
"pull up": [
"8Y7HfoamOJg",
"Davis Diley"
],
"chin up": [
"5_EI7a1LsS4",
"Hybrid Calisthenics"
],
"weighted pull up": [
"8Y7HfoamOJg",
"Davis Diley"
],
"t bar row": [
"yPis7nlbqdY",
"Renaissance Periodization"
],
"dumbbell pullover": [
"jQjWlIwG4sI",
"Renaissance Periodization"
],
"straight arm pulldown": [
"wcVDItawocI",
"Bodybuilding.com"
],
"barbell curl": [
"N6paU6TGFWU",
"Davis Diley"
],
"dumbbell curl": [
"cBSD6mQIPQk",
"Nuffield Health"
],
"bicep curl": [
"cBSD6mQIPQk",
"Nuffield Health"
],
"hammer curl": [
"B4RznoFvTl4",
"PureGym"
],
"preacher curl": [
"AR-oARBkYxI",
"Colossus Fitness"
],
"concentration curl": [
"0AUGkch3tzc",
"Howcast"
],
"cable curl": [
"NFzTWp2qpiE",
"Fit Father Project - Fitness For Busy Fathers"
],
"ez bar curl": [
"d2r5TCqnR4Y",
"ATHLEAN-X™"
],
"tricep pushdown": [
"NvZKjiZ8NYc",
"iyaji adoga"
],
"rope pushdown": [
"qHDrQglWgS4",
"Buff Dudes Workouts"
],
"skull crusher": [
"S0fmDR60X-o",
"Max Euceda"
],
"overhead tricep extension": [
"fYqswDVbJDg",
"ScottHermanFitness"
],
"tricep kickback": [
"m9me06UBPKc",
"Buff Dudes"
],
"plank": [
"QpOgJLqeo14",
"Nuffield Health"
],
"hanging leg raise": [
"2n4UqRIJyk4",
"Gerardi Performance"
],
"cable crunch": [
"CDO29I7PCoc",
"Davis Diley"
],
"crunch": [
"Xyd_fa5zoEU",
"LIVESTRONG"
],
"sit up": [
"onaQ0v_J5uU",
"Nuffield Health"
],
"ab wheel": [
"rqiTPdK1c_I",
"Mind Pump TV"
],
"russian twist": [
"wkD8rjkodUI",
"Howcast"
],
"cable kickback": [
"BNDw4ciQoQI",
"Nuffield Health"
],
"glute kickback": [
"BNDw4ciQoQI",
"Nuffield Health"
]
};
