'use client';

import { useEffect, useMemo, useSyncExternalStore } from 'react';
import ConverterPageContent from './ConverterPageContent';
import TimeInPageContent from './TimeInPageContent';
import TimezonePageContent from './TimezonePageContent';
import { parsePairing, parseCitiesSlug, resolveSlug } from '@/utils/seoResolver';

function subscribe(listener: () => void) {
  window.addEventListener('popstate', listener);
  return () => window.removeEventListener('popstate', listener);
}
const snapshot = () => window.location.href;
const serverSnapshot = () => '';

export default function RuntimeTimePage({ kind }: { kind: 'converter' | 'clock' | 'planner' }) {
  const location = useSyncExternalStore(subscribe, snapshot, serverSnapshot);
  const route = useMemo(() => {
    if (!location) return null;
    const url = new URL(location);
    const slug = decodeURIComponent(url.pathname).split('/').pop() || '';
    const valid = kind === 'converter' ? parsePairing(slug) : kind === 'clock' ? resolveSlug(slug) : parseCitiesSlug(slug).length;
    return valid ? { slug, query: Object.fromEntries(url.searchParams) } : null;
  }, [location, kind]);
  useEffect(() => {
    if (!route) return;
    const pairing = kind === 'converter' ? parsePairing(route.slug) : null;
    const clock = kind === 'clock' ? resolveSlug(route.slug) : null;
    document.title = pairing ? `${pairing.zoneA.cityName} to ${pairing.zoneB.cityName} Time Converter | MeetMyZone` : clock ? `Current Time in ${clock.cityName} | MeetMyZone` : `Timezone Planner: ${parseCitiesSlug(route.slug).map(city => city.cityName).join(', ')} | MeetMyZone`;
  }, [route, kind]);
  if (!route) return <div role="status" className="p-8 text-center text-slate-600 dark:text-slate-300">Loading local times…</div>;
  if (kind === 'converter') return <ConverterPageContent pairing={route.slug} />;
  if (kind === 'clock') return <TimeInPageContent slug={route.slug} />;
  return <TimezonePageContent cities={route.slug} query={route.query} />;
}
