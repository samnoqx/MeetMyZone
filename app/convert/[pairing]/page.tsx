import HomeClient from '../../HomeClient';
import SEOSection from '../../../components/SEOSection';
import { parsePairing } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    pairing: string;
  }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { pairing } = await params;
  const resolved = parsePairing(pairing);
  
  if (!resolved) {
    return {
      title: "Time Zone Converter | MeetMyZone",
      description: "Compare timezone schedules and identify optimal overlap working hours to plan international meetings."
    };
  }
  
  const nameA = resolved.zoneA.displayName;
  const nameB = resolved.zoneB.displayName;
  const cityA = resolved.zoneA.cityName;
  const cityB = resolved.zoneB.cityName;
  
  const title = `Convert ${nameA} to ${nameB} | Time Zone Converter & Meeting Planner`;
  const description = `Compare working hours and find the best timezone overlap to schedule meetings between ${cityA} and ${cityB}. Easy-to-use visual timezone converter.`;
  
  // Construct search parameters for the dynamic Open Graph image
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('cities', `${cityA},${cityB}`);
  ogSearchParams.set('zones', `${resolved.zoneA.zoneName},${resolved.zoneB.zoneName}`);
  ogSearchParams.set('reference', cityA);
  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://meetmyzone.com/convert/${pairing}`,
    },
    openGraph: {
      title,
      description,
      type: 'website',
      images: [
        {
          url: relativeOgUrl,
          width: 1200,
          height: 630,
          alt: `Timezone overlap comparison for ${nameA} and ${nameB}`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [relativeOgUrl],
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { pairing } = await params;
  const resolved = parsePairing(pairing);
  
  if (!resolved) {
    notFound();
  }
  
  const initialParams = {
    cities: `${resolved.zoneA.cityName},${resolved.zoneB.cityName}`,
    zones: `${resolved.zoneA.zoneName},${resolved.zoneB.zoneName}`,
    reference: resolved.zoneA.cityName,
  };
  
  return (
    <>
      <HomeClient initialParams={initialParams} />
      <SEOSection zoneA={resolved.zoneA} zoneB={resolved.zoneB} />
    </>
  );
}
