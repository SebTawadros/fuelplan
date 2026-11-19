// Embedded YouTube demo videos per exercise: [videoId, channel]. Played inside Outlift via youtube-nocookie.com.
const EX_VIDEOS = {
"bench press": [
"CjHIKDQ4RQo",
"PureGym"
],
"incline bench press": [
"2jFFCy8JBU8",
"PureGym"
],
"incline barbell bench press": [
"2jFFCy8JBU8",
"PureGym"
],
"incline dumbbell press": [
"oZVCBM9f8Eo",
"PureGym"
],
"dumbbell bench press": [
"AduT4Eq-iP0",
"PureGym"
],
"close grip bench press": [
"DzA2xZhDGeo",
"PureGym"
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
"sqNwDkUU_Ps",
"PureGym"
],
"cable fly": [
"QcTcWpkn_bw",
"PureGym"
],
"cable crossover": [
"QcTcWpkn_bw",
"PureGym"
],
"dumbbell fly": [
"Nhvz9EzdJ4U",
"PureGym"
],
"incline dumbbell fly": [
"JSDpq14vCZ8",
"PureGym"
],
"pec deck": [
"eGjt4lk6g34",
"PureGym"
],
"dips": [
"2HYAeF6o7Bc",
"PureGym"
],
"tricep dips": [
"qrS6aa0aQ9I",
"PureGym"
],
"bench dips": [
"0326dy_-CzM",
"LIVESTRONG"
],
"push up": [
"Env8gAr_QnE",
"PureGym"
],
"overhead press": [
"-5MmFTKLC-0",
"PureGym"
],
"military press": [
"43GSKivZnw4",
"PureGym"
],
"shoulder press": [
"TnhIyp4kmO8",
"PureGym"
],
"dumbbell shoulder press": [
"aI2hGzsAMXs",
"PureGym"
],
"barbell shoulder press": [
"Y0Bxr57uPbk",
"PureGym"
],
"arnold press": [
"jeJttN2EWCo",
"PureGym"
],
"lateral raise": [
"z-kOn7flIZg",
"PureGym"
],
"front raise": [
"HN8HYJTOl8c",
"PureGym"
],
"rear delt fly": [
"nlkF7_2O_Lw",
"PureGym"
],
"face pull": [
"0Po47vvj9g4",
"PureGym"
],
"shrug": [
"larn3Asl6oM",
"PureGym"
],
"dumbbell shrug": [
"_t3lrPI6Ns4",
"Renaissance Periodization"
],
"upright row": [
"8UvsRWUb0YU",
"PureGym"
],
"squat": [
"kRX2NfqM90g",
"PureGym"
],
"back squat": [
"rrJIyZGlK8c",
"PureGym"
],
"front squat": [
"Q1Ypb8ZNzI4",
"PureGym"
],
"goblet squat": [
"zBV3ceGyAxw",
"PureGym"
],
"box squat": [
"rMEPHwNhQfo",
"The Active Life"
],
"leg press": [
"p5dCqF7wWUw",
"PureGym"
],
"hack squat": [
"scs5XcsZuc8",
"PureGym"
],
"bulgarian split squat": [
"TEXl2b3__S4",
"PureGym"
],
"split squat": [
"rlvpaDkc76g",
"PureGym"
],
"walking lunge": [
"mAgbXQdd4LM",
"PureGym"
],
"lunge": [
"xrPteyQLGAo",
"PureGym"
],
"dumbbell lunge": [
"9gglI77Kzq8",
"OPEX Fitness"
],
"step up": [
"DxUNi119Qzs",
"PureGym"
],
"leg extension": [
"4ZDm5EbiFI8",
"PureGym"
],
"leg curl": [
"QjNFk4F5dAs",
"PureGym"
],
"lying leg curl": [
"SbSNUXPRkc8",
"PureGym"
],
"seated leg curl": [
"hhzTWndsgTc",
"Life Fitness"
],
"romanian deadlift": [
"zU-f6DMCdAI",
"PureGym"
],
"stiff leg deadlift": [
"2fHE6zxftYw",
"Runna"
],
"hip thrust": [
"aweBS7K71l8",
"PureGym"
],
"glute bridge": [
"tqp5XQPpTxY",
"PureGym"
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
"Zep-wKHWkNM",
"PureGym"
],
"seated calf raise": [
"3ZRe_QpvRPg",
"PureGym"
],
"deadlift": [
"GxsLrTzyGUU",
"PureGym"
],
"sumo deadlift": [
"JbY72Him34Q",
"PureGym"
],
"good morning": [
"nWyx81AfTos",
"PureGym"
],
"barbell row": [
"FsK19s8eGFs",
"PureGym"
],
"bent over row": [
"FsK19s8eGFs",
"PureGym"
],
"dumbbell row": [
"ZRSGpBUVcNw",
"PureGym"
],
"seated cable row": [
"lJoozxC0Rns",
"PureGym"
],
"cable row": [
"lJoozxC0Rns",
"PureGym"
],
"lat pulldown": [
"JGeRYIZdojU",
"PureGym"
],
"close grip lat pulldown": [
"IjoFCmLX7z0",
"PureGym"
],
"pull up": [
"PHdHnZcbsB8",
"PureGym"
],
"chin up": [
"PHdHnZcbsB8",
"PureGym"
],
"weighted pull up": [
"PHdHnZcbsB8",
"PureGym"
],
"t bar row": [
"hYo72r8Ivso",
"PureGym"
],
"dumbbell pullover": [
"jQjWlIwG4sI",
"Renaissance Periodization"
],
"straight arm pulldown": [
"ey9Fv3FGrRg",
"PureGym"
],
"barbell curl": [
"N5x5M1x1Gd0",
"PureGym"
],
"dumbbell curl": [
"cBSD6mQIPQk",
"Nuffield Health"
],
"bicep curl": [
"MtXdEcW3Eog",
"PureGym"
],
"hammer curl": [
"B4RznoFvTl4",
"PureGym"
],
"preacher curl": [
"Zbs3ko8ycyg",
"PureGym"
],
"concentration curl": [
"llD6MImgqe8",
"PureGym"
],
"cable curl": [
"GNlopToAZyg",
"PureGym"
],
"ez bar curl": [
"N5x5M1x1Gd0",
"PureGym"
],
"tricep pushdown": [
"LXkCrxn3caQ",
"PureGym"
],
"rope pushdown": [
"-xa-6cQaZKY",
"Renaissance Periodization"
],
"skull crusher": [
"sDxcKjCqXAo",
"PureGym"
],
"overhead tricep extension": [
"9wxRhONFsRA",
"PureGym"
],
"tricep kickback": [
"JPmbMOu4IYw",
"PureGym"
],
"plank": [
"q4rDeHYMcIg",
"PureGym"
],
"hanging leg raise": [
"Yrtvs-nEnk0",
"PureGym"
],
"cable crunch": [
"CDO29I7PCoc",
"Davis Diley"
],
"crunch": [
"NnVhqMQRvmM",
"PureGym"
],
"sit up": [
"N7hf1_vcX5w",
"PureGym"
],
"ab wheel": [
"SBO5aFR09D4",
"PureGym"
],
"russian twist": [
"99T1EfpMwPA",
"PureGym"
],
"cable kickback": [
"Ibwp50t3b1Y",
"OPEX Fitness"
],
"glute kickback": [
"BNDw4ciQoQI",
"Nuffield Health"
]
};
