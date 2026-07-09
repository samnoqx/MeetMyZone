import { MetadataRoute } from 'next';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://meetmyzone.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const pairingSlugs = [
    'est-to-ist',
    'ist-to-est',
    'pst-to-est',
    'est-to-pst',
    'utc-to-ist',
    'ist-to-utc',
    'gmt-to-est',
    'est-to-gmt',
    'cet-to-est',
    'est-to-cet',
    'london-to-new-york',
    'new-york-to-london',
    'singapore-to-est',
    'est-to-singapore',
    'sgt-to-est',
    'est-to-sgt',
    'mst-to-est',
    'est-to-mst',
    'cst-to-est',
    'est-to-cst',
    'ast-to-est',
    'est-to-ast',
    'jst-to-aest',
    'aest-to-jst',
    'kst-to-jst',
    'jst-to-kst',
    'tokyo-to-london',
    'london-to-tokyo',
    'paris-to-new-york',
    'new-york-to-paris',
    'singapore-to-london',
    'london-to-singapore',
    'sydney-to-tokyo',
    'tokyo-to-sydney'
  ];

  const pairingPages: MetadataRoute.Sitemap = pairingSlugs.map(slug => ({
    url: `${baseUrl}/convert/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogSlugs = [
    'remote-work-hours-overlap-engineering-teams',
    'managing-global-payroll-deadlines-timezone-shifts',
    'daylight-saving-time-cron-jobs-server-scheduling',
    'best-timezone-digital-nomads-usa-clients',
    'developers-guide-timezone-abbreviations-offsets'
  ];

  const blogPages: MetadataRoute.Sitemap = blogSlugs.map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  return [...staticPages, ...pairingPages, ...blogPages];
}
