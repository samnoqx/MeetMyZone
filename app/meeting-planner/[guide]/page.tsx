import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import HomeClient from '@/app/HomeClient';
import { MEETING_GUIDES } from '@/lib/meetingGuides';
import { CITY_BY_SLUG } from '@/utils/cityDirectory';
import { normalizeParams } from '@/utils/planner';

interface Props {
  params: Promise<{ guide: string }>;
  searchParams: Promise<{ date?: string; reference?: string; workStart?: string; workEnd?: string }>;
}
export function generateStaticParams() { return MEETING_GUIDES.map(guide => ({ guide: guide.slug })); }
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { guide: slug } = await params;
  const guide = MEETING_GUIDES.find(item => item.slug === slug);
  if (!guide) return {};
  const url = `https://meetmyzone.com/meeting-planner/${guide.slug}`;
  return { title: `${guide.title} | MeetMyZone`, description: guide.description, alternates: { canonical: url }, openGraph: { title: guide.title, description: guide.description, url } };
}
export default async function Page({ params, searchParams }: Props) {
  const { guide: slug } = await params;
  const guide = MEETING_GUIDES.find(item => item.slug === slug);
  if (!guide) notFound();
  const cities = guide.cities.map(slug => CITY_BY_SLUG[slug]);
  const query = normalizeParams(await searchParams);
  const initialParams = { ...query, cities: JSON.stringify(cities.map(city => city.name)), zones: JSON.stringify(cities.map(city => city.zone)) };
  const url = `https://meetmyzone.com/meeting-planner/${guide.slug}`;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      '@context': 'https://schema.org', '@graph': [
        { '@type': 'WebApplication', '@id': `${url}#application`, name: guide.title, url, description: guide.description, applicationCategory: 'BusinessApplication', operatingSystem: 'Web browser', offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' } },
        { '@type': 'BreadcrumbList', itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://meetmyzone.com' },
          { '@type': 'ListItem', position: 2, name: 'Meeting Planner', item: 'https://meetmyzone.com/meeting-planner' },
          { '@type': 'ListItem', position: 3, name: guide.title, item: url },
        ] },
      ],
    }).replace(/</g, '\\u003c') }} />
    <HomeClient initialDate={new Date().toISOString().slice(0, 10)} initialParams={initialParams} meetingOnly heading={guide.title} intro={guide.description}
      headerPrefix={<nav aria-label="Breadcrumb" className="text-sm text-txt-muted"><Link href="/meeting-planner" className="text-brand-accent underline">Meeting Planner</Link> / {guide.title}</nav>} />
    <section className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-12 text-sm leading-relaxed text-txt-secondary">
      <h2 className="text-xl font-bold text-txt-heading mb-3">Scheduling across {cities.map(city => city.name).join(', ')}</h2>
      <div className="grid gap-6 md:grid-cols-2"><p>{guide.advice}</p><p>{guide.checklist}</p></div>
      <h3 className="font-semibold text-txt-heading mt-6 mb-2">Check each participant&apos;s local clock</h3>
      <ul className="flex flex-wrap gap-4">{cities.map(city => <li key={city.slug}><Link href={`/time-in/${city.slug}`} className="text-brand-accent underline">Current time in {city.name}</Link></li>)}</ul>
      <p className="mt-6">The highlighted hours are a planning aid, not a guarantee of availability. Confirm participants&apos; work schedules, public holidays and meeting duration. Time-zone rules follow the <a href="https://www.iana.org/time-zones" className="underline" target="_blank" rel="noopener noreferrer">IANA Time Zone Database</a> supplied by your platform.</p>
    </section>
  </>;
}
