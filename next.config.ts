import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages utilizes next-on-pages edge functions for dynamic API routes (like /api/og) and SSR.
  // Static HTML exports ('output: export') are disabled to keep dynamic OG image generation functional.
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
