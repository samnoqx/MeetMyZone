import { MEETING_GUIDES } from '@/lib/meetingGuides';
import { TIME_IN_SLUGS } from '@/utils/cityDirectory';
import { MetadataRoute } from 'next';
import { ALL_PAIRINGS } from '../utils/seoResolver';
import { getAllBlogSlugs } from '@/lib/blogData';

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  // Only publish lastModified when an actual content revision date is known.
  const baseUrl = 'https://meetmyzone.com';
  
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    {
      url: `${baseUrl}/meeting-planner`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/timezone-converter`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/city-time-converter`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/current-time`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tools`,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact-us`,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    {
      url: `${baseUrl}/terms-of-service`,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  const pairingPages: MetadataRoute.Sitemap = ALL_PAIRINGS.map(slug => ({
    url: `${baseUrl}/convert/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.7,
  }));

  const blogPages: MetadataRoute.Sitemap = getAllBlogSlugs().map(slug => ({
    url: `${baseUrl}/blog/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const timeInSlugs = TIME_IN_SLUGS;

  const timeInPages: MetadataRoute.Sitemap = timeInSlugs.map(slug => ({
    url: `${baseUrl}/time-in/${slug}`,
    changeFrequency: 'weekly',
    priority: 0.8,
  }));

  const meetingPages: MetadataRoute.Sitemap = MEETING_GUIDES.map(guide => ({ url: `${baseUrl}/meeting-planner/${guide.slug}`, changeFrequency: 'weekly', priority: 0.8 }));
  return [...staticPages, ...pairingPages, ...blogPages, ...timeInPages, ...meetingPages];
}
