import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export: `next build` writes ./out, which the Worker serves as assets.
  output: "export",
};

export default nextConfig;
