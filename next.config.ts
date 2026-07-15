import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Cloudflare Pages utilizes next-on-pages edge functions for dynamic API routes (like /api/og) and SSR.
  // Static HTML exports ('output: export') are disabled to keep dynamic OG image generation functional.
  images: {
    unoptimized: true,
  },

  // Permanent redirects for replaced blog posts (old URLs → closest new article)
  async redirects() {
    return [
      {
        source: '/blog/remote-work-hours-overlap-engineering-teams',
        destination: '/blog/find-working-hours-overlap-global-teams',
        permanent: true,
      },
      {
        source: '/blog/managing-global-payroll-deadlines-timezone-shifts',
        destination: '/blog/better-way-to-schedule-global-meetings',
        permanent: true,
      },
      {
        source: '/blog/daylight-saving-time-cron-jobs-server-scheduling',
        destination: '/blog/why-international-meeting-time-changed-by-one-hour',
        permanent: true,
      },
      {
        source: '/blog/best-timezone-digital-nomads-usa-clients',
        destination: '/blog/best-meeting-time-across-multiple-time-zones',
        permanent: true,
      },
      {
        source: '/blog/developers-guide-timezone-abbreviations-offsets',
        destination: '/blog/best-meeting-times-india-uk-usa',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

import('@opennextjs/cloudflare').then(m => m.initOpenNextCloudflareForDev());
