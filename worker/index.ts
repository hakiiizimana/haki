import { Stophy } from "stophy";
import { channels, type Video } from "./channels";

// The Worker in front of the static site. Assets are served without it; it only
// answers /api/* (see run_worker_first in wrangler.jsonc).
//
// - scheduled: once a day, lists each channel's latest videos through Stophy and
//   stores the ones at least 3 minutes long in KV. A channel that fails keeps
//   yesterday's videos.
// - GET /api/videos: returns that list. Visitors never call Stophy or YouTube's API.

const key = "videos";
const minSeconds = 180;

async function listChannel(
  stophy: Stophy,
  { channelId, category }: (typeof channels)[number],
): Promise<Video[]> {
  const { data } = await stophy.youtube.channel({ channelId, tab: "videos" });
  return data.results.flatMap((r) =>
    r.type === "video" &&
    !r.isShort &&
    !r.isLive &&
    r.videoId &&
    r.title &&
    r.publishedAt &&
    (r.durationSeconds ?? 0) >= minSeconds
      ? [
          {
            id: r.videoId,
            title: r.title,
            channelId,
            channel: r.channelName ?? data.channelName ?? channelId,
            category,
            publishedAt: r.publishedAt,
            durationSeconds: r.durationSeconds,
            views: r.views,
            avatarUrl: data.avatarUrl,
          },
        ]
      : [],
  );
}

async function refresh(env: Env) {
  const stophy = new Stophy({ apiKey: env.STOPHY_API_KEY });
  const previous = await env.VIDEOS.get<Video[]>(key, "json");
  const settled = await Promise.allSettled(channels.map((c) => listChannel(stophy, c)));

  const videos = settled.flatMap((result, i) => {
    if (result.status === "fulfilled") return result.value;
    console.error({ channel: channels[i].channelId, error: String(result.reason) });
    return previous?.filter((v) => v.channelId === channels[i].channelId) ?? [];
  });

  videos.sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
  await env.VIDEOS.put(key, JSON.stringify(videos));
}

export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname !== "/api/videos") {
      return new Response("Not found", { status: 404 });
    }
    return new Response((await env.VIDEOS.get(key)) ?? "[]", {
      headers: { "content-type": "application/json", "cache-control": "public, max-age=300" },
    });
  },

  async scheduled(_controller, env, ctx) {
    ctx.waitUntil(refresh(env));
  },
} satisfies ExportedHandler<Env>;
