import ConverterPageContent from '@/components/ConverterPageContent';
import { parsePairing, ALL_PAIRINGS, isTimezonePairing } from '@/utils/seoResolver';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    pairing: string;
  }>;
}

export const revalidate = 86400;

export async function generateStaticParams() {
  return ALL_PAIRINGS.map(pairing => ({ pairing }));
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
  
  const zoneA = resolved.zoneA;
  const zoneB = resolved.zoneB;
  const nameA = isTimezonePairing(pairing) ? zoneA.displayName.toUpperCase() : zoneA.cityName;
  const nameB = isTimezonePairing(pairing) ? zoneB.displayName.toUpperCase() : zoneB.cityName;
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  
  const title = `${nameA} to ${nameB} Time Converter | MeetMyZone`;
  const description = `Convert ${nameA} to ${nameB} with an interactive time converter. Compare local clocks, time differences, UTC offsets and daylight saving changes for both locations.`;
  
  const ogSearchParams = new URLSearchParams();
  ogSearchParams.set('cities', `${cityA},${cityB}`);
  ogSearchParams.set('zones', `${zoneA.zoneName},${zoneB.zoneName}`);
  ogSearchParams.set('reference', cityA);
  const relativeOgUrl = `/api/og?${ogSearchParams.toString()}`;
  
  return {
    title,
    description,
    alternates: {
      canonical: `https://meetmyzone.com/convert/${pairing.toLowerCase()}`,
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
  return <ConverterPageContent pairing={pairing} />;
}
