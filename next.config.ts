import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Build separately from the live preview when targeting Cloudflare.
  distDir: process.env.NODE_ENV === 'development' ? '.next-preview' : '.next',
  poweredByHeader: false,
  // Proot does not provide the syscall used by Next's native directory lock.
  experimental: { lockDistDir: process.env.MMZ_DISABLE_DIRECTORY_LOCK !== '1' },
  async headers() {
    return [{
      source: '/:path*',
      headers: [
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      ],
    }, {
      source: '/:path*',
      has: [{ type: 'host', value: '(?:.*\\.(?:workers\\.dev|pages\\.dev|cloudflareworkers\\.com)|.*(?:staging|preview).*|localhost|127\\.0\\.0\\.1)(?::[0-9]+)?' }],
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow' }],
    }];
  },
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
