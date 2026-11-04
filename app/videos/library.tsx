"use client";

import { Search, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import type { Video } from "@/worker/channels";

const pad = (n: number) => String(n).padStart(2, "0");

function duration(total: number) {
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  return h ? `${h}:${pad(m)}:${pad(total % 60)}` : `${m}:${pad(total % 60)}`;
}

const compact = new Intl.NumberFormat("en", { notation: "compact" });
const relative = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
const units = [
  ["year", 31536000],
  ["month", 2592000],
  ["week", 604800],
  ["day", 86400],
  ["hour", 3600],
] as const;

// publishedAt is rounded by YouTube ("3 days ago"), so show it the same way.
function ago(iso: string) {
  const seconds = (Date.parse(iso) - Date.now()) / 1000;
  const [unit, size] = units.find(([, s]) => Math.abs(seconds) >= s) ?? units[units.length - 1];
  return relative.format(Math.round(seconds / size), unit);
}

function Avatar({ video, size }: { video: Video; size: number }) {
  return video.avatarUrl ? (
    <Image
      src={video.avatarUrl}
      referrerPolicy="no-referrer"
      alt=""
      width={size}
      height={size}
      unoptimized
      style={{ width: size, height: size }}
      className="shrink-0 rounded-full object-cover"
    />
  ) : (
    <span style={{ width: size, height: size }} className="shrink-0 rounded-full bg-neutral-800" />
  );
}

// YouTube-style cards for the curated channels, in the site's own column: one
// search box (titles and channel names), a 3-wide grid, and a pop-up player
// (youtube-nocookie embed; rel=0 keeps suggestions to the same channel).
export function Library() {
  const [videos, setVideos] = useState<Video[] | null>(null);
  const [query, setQuery] = useState("");
  const [playing, setPlaying] = useState<Video | null>(null);
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    fetch("/api/videos")
      .then((r) => r.json())
      .then(setVideos)
      .catch(() => setVideos([]));
  }, []);

  useEffect(() => {
    if (playing) dialog.current?.showModal();
  }, [playing]);

  const q = query.trim().toLowerCase();
  const shown = videos?.filter(
    (v) => !q || v.title.toLowerCase().includes(q) || v.channel.toLowerCase().includes(q),
  );

  return (
    <div className="min-h-screen bg-black text-sm text-neutral-100">
      <div className="mx-auto max-w-2xl px-6 pt-20 pb-16">
        <h1 className="mb-0.5 text-xl font-medium">Videos</h1>
        <p className="mb-9 text-neutral-400">Videos I learn from.</p>
        <label className="sticky top-0 z-10 flex h-10 items-center gap-2 rounded-full border border-neutral-800 bg-neutral-950 px-4 focus-within:border-neutral-600">
          <Search className="size-4 text-neutral-500" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-transparent outline-none placeholder:text-neutral-500"
          />
        </label>

        {!shown && <p className="py-6 text-neutral-500">Loading…</p>}
        {shown?.length === 0 && <p className="py-6 text-neutral-500">No videos.</p>}

        <div className="grid gap-x-4 gap-y-8 pt-6 sm:grid-cols-3">
          {shown?.map((v) => (
            <article key={v.id}>
              <button onClick={() => setPlaying(v)} className="relative block w-full overflow-hidden rounded-xl">
                <Image
                  src={`https://i.ytimg.com/vi/${v.id}/mqdefault.jpg`}
                  alt=""
                  width={320}
                  height={180}
                  unoptimized
                  className="aspect-video w-full object-cover"
                />
                {v.durationSeconds !== undefined && (
                  <span className="absolute right-1.5 bottom-1.5 rounded bg-black/80 px-1 text-xs font-medium">
                    {duration(v.durationSeconds)}
                  </span>
                )}
              </button>
              <div className="mt-3 flex gap-3">
                <Avatar video={v} size={28} />
                <div className="min-w-0">
                  <button onClick={() => setPlaying(v)} className="line-clamp-2 text-left font-medium leading-snug">
                    {v.title}
                  </button>
                  <p className="mt-1 truncate text-neutral-400">{v.channel}</p>
                  <p className="text-neutral-400">
                    {v.views !== undefined && `${compact.format(v.views)} views · `}
                    {ago(v.publishedAt)}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={dialog}
        onClose={() => setPlaying(null)}
        onClick={(e) => e.target === e.currentTarget && dialog.current?.close()}
        className="m-auto w-full max-w-5xl bg-transparent p-4 text-neutral-100 backdrop:bg-black/90"
      >
        {playing && (
          <>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${playing.id}?autoplay=1&rel=0`}
              title={playing.title}
              allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
              allowFullScreen
              className="aspect-video w-full rounded-xl"
            />
            <div className="mt-3 flex items-start gap-3">
              <Avatar video={playing} size={40} />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-semibold leading-snug">{playing.title}</p>
                <p className="text-neutral-400">{playing.channel}</p>
              </div>
              <button onClick={() => dialog.current?.close()} aria-label="Close" className="rounded-full p-2 hover:bg-neutral-800">
                <X className="size-5" />
              </button>
            </div>
          </>
        )}
      </dialog>
    </div>
  );
}
