// The only channels /videos shows. The daily cron lists each one's latest
// videos through Stophy. Add or remove a channel here; nothing else changes.
export const categories = ["tech", "motivational"] as const;

export type Category = (typeof categories)[number];

// One row of the list the cron stores in KV and /api/videos returns.
export type Video = {
  id: string;
  title: string;
  channelId: string;
  channel: string;
  category: Category;
  publishedAt: string;
  durationSeconds?: number;
  views?: number;
  avatarUrl?: string;
};

// channelId is a handle (@name) or a YouTube channel id (UC...), as Stophy takes it.
export const channels: { channelId: `@${string}` | `UC${string}`; category: Category }[] = [
  { channelId: "@mattpocockuk", category: "tech" },
  { channelId: "@t3dotgg", category: "tech" },
  { channelId: "@jherr", category: "tech" },
  { channelId: "@WebDevSimplified", category: "tech" },
  { channelId: "@ByteGrad", category: "tech" },
  { channelId: "@andrew-burgess", category: "tech" },
  { channelId: "@MichiganTypeScript", category: "tech" },
  { channelId: "@hnasr", category: "tech" },
  { channelId: "@ByteByteGo", category: "tech" },
  { channelId: "@AndrejKarpathy", category: "tech" },
  { channelId: "@3blue1brown", category: "tech" },
  { channelId: "@Computerphile", category: "tech" },

  { channelId: "@whoisalastair", category: "motivational" },
  { channelId: "@BetterIdeas", category: "motivational" },
  { channelId: "@ImprovementPill", category: "motivational" },
  { channelId: "@Sisyphus55", category: "motivational" },
  { channelId: "@mattdavella", category: "motivational" },
  { channelId: "@aliabdaal", category: "motivational" },
  { channelId: "@PursuitofWonder", category: "motivational" },
  { channelId: "@JeffNippard", category: "motivational" },
  { channelId: "@versecreates", category: "motivational" },
  { channelId: "@vysgarden88", category: "motivational" },
  { channelId: "@AngeloSomers", category: "motivational" },
  { channelId: "@WeBuildMinds", category: "motivational" },
  { channelId: "@TheGrowthParadoxYT", category: "motivational" },
  { channelId: "@BeyondEchoo", category: "motivational" },
  { channelId: "@clarkkegley", category: "motivational" },
];
