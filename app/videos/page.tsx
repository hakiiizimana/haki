import type { Metadata } from "next";
import { Library } from "./library";

export const metadata: Metadata = {
  title: "Videos | Hussein Hakizimana",
  description: "Videos I learn from.",
};

// Static shell. The list comes from /api/videos at load, so a new day's videos
// show up without a rebuild.
export default function Videos() {
  return <Library />;
}
