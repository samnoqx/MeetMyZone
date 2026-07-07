import { MetadataRoute } from 'next';
import { headers } from 'next/headers';

export default async function robots(): Promise<MetadataRoute.Robots> {
  const headersList = await headers();
  const host = headersList.get('host') || '';
  
  // Check if it's the workers.dev domain or wildcard subdomains
  const isWorkersDev = 
    host === 'meetmyzone.shamsher2812003.workers.dev' || 
    host.endsWith('-meetmyzone.shamsher2812003.workers.dev') ||
    host.endsWith('.meetmyzone.shamsher2812003.workers.dev');

  if (isWorkersDev) {
    return {
      rules: {
        userAgent: '*',
        disallow: '/',
      },
    };
  }

  return {
    rules: {
      userAgent: '*',
      allow: '/',
    },
    sitemap: 'https://meetmyzone.com/sitemap.xml',
  };
}
