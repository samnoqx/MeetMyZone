import { resolveTimeZone, ALL_IANA_ZONES } from './timezone';

export interface ResolvedTimezone {
  slug: string;
  displayName: string;
  cityName: string;
  zoneName: string;
}

export const TIMEZONE_ABBR_MAP: Record<string, { displayName: string; cityName: string; zoneName: string }> = {
  'est': { displayName: 'EST', cityName: 'New York', zoneName: 'America/New_York' },
  'ist': { displayName: 'IST', cityName: 'New Delhi', zoneName: 'Asia/Kolkata' },
  'pst': { displayName: 'PST', cityName: 'Los Angeles', zoneName: 'America/Los_Angeles' },
  'utc': { displayName: 'UTC', cityName: 'UTC', zoneName: 'UTC' },
  'gmt': { displayName: 'GMT', cityName: 'London', zoneName: 'Europe/London' },
  'cet': { displayName: 'CET', cityName: 'Paris', zoneName: 'Europe/Paris' },
  'mst': { displayName: 'MST', cityName: 'Denver', zoneName: 'America/Denver' },
  'cst': { displayName: 'CST', cityName: 'Chicago', zoneName: 'America/Chicago' },
  'ast': { displayName: 'AST', cityName: 'Halifax', zoneName: 'America/Halifax' },
  'sgt': { displayName: 'SGT', cityName: 'Singapore', zoneName: 'Asia/Singapore' },
  'jst': { displayName: 'JST', cityName: 'Tokyo', zoneName: 'Asia/Tokyo' },
  'kst': { displayName: 'KST', cityName: 'Seoul', zoneName: 'Asia/Seoul' },
  'aest': { displayName: 'AEST', cityName: 'Sydney', zoneName: 'Australia/Sydney' },
};

/**
 * Resolves a URL slug to a standardized timezone entity.
 * Handles abbreviations, dynamic city name parsing, and full IANA timezones.
 */
export function resolveSlug(slug: string): ResolvedTimezone | null {
  const normalized = slug.trim().toLowerCase().replace(/-+/g, ' ');
  
  // 1. Check mapped abbreviations first
  const abbr = normalized.replace(/\s+/g, '');
  if (TIMEZONE_ABBR_MAP[abbr]) {
    return {
      slug,
      ...TIMEZONE_ABBR_MAP[abbr]
    };
  }
  
  // 2. Clean trailing keywords like "time" or "timezone"
  let cleanCity = normalized;
  if (cleanCity.endsWith(' time')) {
    cleanCity = cleanCity.slice(0, -5).trim();
  }
  if (cleanCity.endsWith(' timezone')) {
    cleanCity = cleanCity.slice(0, -9).trim();
  }
  
  // Try resolving as city
  const ianaZone = resolveTimeZone(cleanCity);
  if (ianaZone && ianaZone.toLowerCase() !== cleanCity) {
    const displayName = cleanCity
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
      
    return {
      slug,
      displayName,
      cityName: displayName,
      zoneName: ianaZone
    };
  }
  
  // 3. Fallback: check if it's already an IANA timezone (formatted as slug)
  const ianaNormalized = normalized.replace(/\s+/g, '/');
  const matchingIana = ALL_IANA_ZONES.find(z => z.toLowerCase() === ianaNormalized);
  if (matchingIana) {
    const parts = matchingIana.split('/');
    const cityName = parts[parts.length - 1].replace(/_/g, ' ');
    return {
      slug,
      displayName: cityName,
      cityName,
      zoneName: matchingIana
    };
  }
  
  return null;
}

export interface ResolvedPairing {
  zoneA: ResolvedTimezone;
  zoneB: ResolvedTimezone;
}

/**
 * Parses a dynamic routing pairing slug (e.g., 'est-to-ist' or 'london-to-new-york-time')
 * into resolved timezone entities.
 */
export function parsePairing(pairingSlug: string): ResolvedPairing | null {
  const parts = pairingSlug.toLowerCase().split('-to-');
  if (parts.length !== 2) return null;
  
  const zoneA = resolveSlug(parts[0]);
  const zoneB = resolveSlug(parts[1]);
  
  if (zoneA && zoneB) {
    return { zoneA, zoneB };
  }
  
  return null;
}

/**
 * Parses a dynamic routing cities slug (e.g., 'london-to-new-york-to-tokyo')
 * into an array of city name and timezone objects.
 */
export function parseCitiesSlug(citiesSlug: string): { cityName: string; timezone: string }[] {
  const parts = citiesSlug.toLowerCase().split(/-(?:to|vs|and)-/);
  return parts.map(part => {
    const resolvedTz = resolveSlug(part);
    if (resolvedTz) {
      return {
        cityName: resolvedTz.cityName,
        timezone: resolvedTz.zoneName
      };
    }
    // Fallback: Convert e.g. "san-francisco" to "San Francisco"
    const displayName = part
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
    return {
      cityName: displayName,
      timezone: resolveTimeZone(displayName)
    };
  });
}

export function getSlugForCityAndZone(cityName: string, zoneName: string): string {
  for (const [abbr, item] of Object.entries(TIMEZONE_ABBR_MAP)) {
    if (item.zoneName === zoneName) {
      return abbr;
    }
  }
  return cityName.trim().toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

