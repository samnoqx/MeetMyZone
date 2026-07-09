import HomeClient from '../../HomeClient';
import { parsePairing } from '../../../utils/seoResolver';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    pairing: string;
  }>;
}

export async function generateStaticParams() {
  return [
    { pairing: 'est-to-ist' },
    { pairing: 'ist-to-est' },
    { pairing: 'pst-to-est' },
    { pairing: 'est-to-pst' },
    { pairing: 'utc-to-ist' },
    { pairing: 'ist-to-utc' },
    { pairing: 'gmt-to-est' },
    { pairing: 'est-to-gmt' },
    { pairing: 'cet-to-est' },
    { pairing: 'est-to-cet' },
    { pairing: 'london-to-new-york' },
    { pairing: 'new-york-to-london' },
    { pairing: 'singapore-to-est' },
    { pairing: 'est-to-singapore' },
    { pairing: 'sgt-to-est' },
    { pairing: 'est-to-sgt' },
    { pairing: 'mst-to-est' },
    { pairing: 'est-to-mst' },
    { pairing: 'cst-to-est' },
    { pairing: 'est-to-cst' },
    { pairing: 'ast-to-est' },
    { pairing: 'est-to-ast' },
    { pairing: 'jst-to-aest' },
    { pairing: 'aest-to-jst' },
    { pairing: 'kst-to-jst' },
    { pairing: 'jst-to-kst' },
    { pairing: 'tokyo-to-london' },
    { pairing: 'london-to-tokyo' },
    { pairing: 'paris-to-new-york' },
    { pairing: 'new-york-to-paris' },
    { pairing: 'singapore-to-london' },
    { pairing: 'london-to-singapore' },
    { pairing: 'sydney-to-tokyo' },
    { pairing: 'tokyo-to-sydney' }
  ];
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
  const nameA = zoneA.displayName.toUpperCase();
  const nameB = zoneB.displayName.toUpperCase();
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  
  const title = `Convert ${nameA} to ${nameB} | Time Zone Converter & Meeting Planner`;
  const description = `Compare working hours and find the best timezone overlap to schedule meetings between ${cityA} and ${cityB}. Translate ${nameA} to ${nameB} instantly.`;
  
  // Construct search parameters for the dynamic Open Graph image
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
  const resolved = parsePairing(pairing);
  
  if (!resolved) {
    notFound();
  }
  
  const zoneA = resolved.zoneA;
  const zoneB = resolved.zoneB;
  
  const initialParams = {
    cities: `${zoneA.cityName},${zoneB.cityName}`,
    zones: `${zoneA.zoneName},${zoneB.zoneName}`,
    reference: zoneA.cityName,
  };

  // Structured Data Engine: combined SoftwareApplication and BreadcrumbList schemas inside a single @graph JSON-LD
  const getBreadcrumbAndAppSchema = () => {
    const softwareSchema = {
      "@type": "SoftwareApplication",
      "@id": "https://meetmyzone.com/#software-application",
      "name": "MeetMyZone Time Zone Converter",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "description": "MeetMyZone is a premium visual timezone meeting planner and timezone converter that aligns team working hours side-by-side on an interactive timeline grid."
    };

    const breadcrumbSchema = {
      "@type": "BreadcrumbList",
      "@id": `https://meetmyzone.com/convert/${pairing}/#breadcrumb`,
      "itemListElement": [
        {
          "@type": "ListItem",
          "position": 1,
          "name": "Home",
          "item": "https://meetmyzone.com"
        },
        {
          "@type": "ListItem",
          "position": 2,
          "name": "Converters",
          "item": `https://meetmyzone.com/convert/${pairing}`
        },
        {
          "@type": "ListItem",
          "position": 3,
          "name": `${zoneA.displayName.toUpperCase()} to ${zoneB.displayName.toUpperCase()}`,
          "item": `https://meetmyzone.com/convert/${pairing}`
        }
      ]
    };

    return {
      "@context": "https://schema.org",
      "@graph": [
        softwareSchema,
        breadcrumbSchema
      ]
    };
  };
  
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getBreadcrumbAndAppSchema()).replace(/</g, '\\u003c') }}
      />
      <HomeClient initialParams={initialParams} />
    </>
  );
}
