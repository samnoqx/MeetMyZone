import { DateTime } from 'luxon';
import { CITY_BY_SLUG, CITY_DIRECTORY } from './cityDirectory';
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
export function resolveFixedOffsetSlug(slug: string): ResolvedTimezone | null {
  const match = /^utc-(plus|minus)-(\d{1,2})(?:-(30|45))?$/.exec(slug.toLowerCase());
  if (!match) return null;
  const hours = Number(match[2]);
  const minutes = Number(match[3] || 0);
  if (hours > 14 || (hours === 14 && minutes !== 0)) return null;
  const sign = match[1] === 'plus' ? '+' : '-';
  const name = `UTC${sign}${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  return { slug: slug.toLowerCase(), displayName: name, cityName: name, zoneName: `UTC${sign}${hours}:${String(minutes).padStart(2, '0')}` };
}

export function resolveSlug(slug: string): ResolvedTimezone | null {
  if (!slug.trim() || slug.length > 120) return null;
  const fixedOffset = resolveFixedOffsetSlug(slug);
  if (fixedOffset) return fixedOffset;
  if (/^utc-(?:plus|minus)-/i.test(slug)) return null;
  const cityKey = slug.trim().toLowerCase();
  if (Object.hasOwn(CITY_BY_SLUG, cityKey)) {
    const city = CITY_BY_SLUG[cityKey];
    return { slug: city.slug, displayName: city.name, cityName: city.name, zoneName: city.zone };
  }
  const normalized = slug.trim().toLowerCase().replace(/-+/g, ' ');
  
  // 1. Check mapped abbreviations first
  const abbr = normalized.replace(/\s+/g, '');
  if (Object.hasOwn(TIMEZONE_ABBR_MAP, abbr)) {
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
  if (citiesSlug.length > 2000) return [];
  const parts = citiesSlug.toLowerCase().split(/-(?:to|vs|and)-/);
  if (parts.length > 16 || parts.some(part => !part || part.length > 120)) return [];
  const result = parts.map(part => {
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
  return result.every(item => DateTime.now().setZone(item.timezone).isValid) ? result : [];
}

export function getSlugForCityAndZone(cityName: string, zoneName: string): string {
  const fixed = /^UTC([+-])(\d{1,2})(?::(\d{2}))?$/.exec(zoneName);
  if (fixed) return `utc-${fixed[1] === '+' ? 'plus' : 'minus'}-${Number(fixed[2])}${fixed[3] && fixed[3] !== '00' ? `-${fixed[3]}` : ''}`;
  for (const [abbr, item] of Object.entries(TIMEZONE_ABBR_MAP)) {
    if (item.zoneName === zoneName) {
      return abbr;
    }
  }
  const city = CITY_DIRECTORY.find(item => item.name.toLowerCase() === cityName.trim().toLowerCase());
  if (city) return city.slug;
  return cityName.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

export const ALL_PAIRINGS = [
  'est-to-ist', 'ist-to-est', 'pst-to-est', 'est-to-pst', 'utc-to-ist', 'ist-to-utc',
  'gmt-to-est', 'est-to-gmt', 'cet-to-est', 'est-to-cet', 'london-to-new-york',
  'new-york-to-london', 'singapore-to-est', 'est-to-singapore', 'sgt-to-est',
  'est-to-sgt', 'mst-to-est', 'est-to-mst', 'cst-to-est', 'est-to-cst',
  'ast-to-est', 'est-to-ast', 'jst-to-aest', 'aest-to-jst', 'kst-to-jst',
  'jst-to-kst', 'tokyo-to-london', 'london-to-tokyo', 'paris-to-new-york',
  'new-york-to-paris', 'singapore-to-london', 'london-to-singapore',
  'sydney-to-tokyo', 'tokyo-to-sydney',
  "new-york-to-los-angeles",
  "los-angeles-to-new-york",
  "new-york-to-chicago",
  "chicago-to-new-york",
  "london-to-dubai",
  "dubai-to-london",
  "london-to-mumbai",
  "mumbai-to-london",
  "london-to-sydney",
  "sydney-to-london",
  "new-york-to-mumbai",
  "mumbai-to-new-york",
  "new-york-to-dubai",
  "dubai-to-new-york",
  "new-york-to-tokyo",
  "tokyo-to-new-york",
  "new-york-to-singapore",
  "singapore-to-new-york",
  "los-angeles-to-tokyo",
  "tokyo-to-los-angeles",
  "los-angeles-to-sydney",
  "sydney-to-los-angeles",
  "toronto-to-london",
  "london-to-toronto",
  "vancouver-to-london",
  "london-to-vancouver",
  "toronto-to-mumbai",
  "mumbai-to-toronto",
  "berlin-to-new-york",
  "new-york-to-berlin",
  "paris-to-tokyo",
  "tokyo-to-paris",
  "singapore-to-sydney",
  "sydney-to-singapore",
  "dubai-to-singapore",
  "singapore-to-dubai",
  "hong-kong-to-london",
  "london-to-hong-kong",
  "hong-kong-to-new-york",
  "new-york-to-hong-kong",
  "chicago-to-london",
  "london-to-chicago",
  "san-francisco-to-london",
  "london-to-san-francisco",
  "melbourne-to-london",
  "london-to-melbourne",
  "brisbane-to-sydney",
  "sydney-to-brisbane",
  "adelaide-to-sydney",
  "sydney-to-adelaide",
  "perth-to-sydney",
  "sydney-to-perth",
  "auckland-to-sydney",
  "sydney-to-auckland",
  "kathmandu-to-mumbai",
  "mumbai-to-kathmandu",
  "bangkok-to-singapore",
  "singapore-to-bangkok",
  "manila-to-new-york",
  "new-york-to-manila",
  "johannesburg-to-london",
  "london-to-johannesburg",
  "sao-paulo-to-london",
  "london-to-sao-paulo",
  "mexico-city-to-new-york",
  "new-york-to-mexico-city",
  "est-to-utc",
  "utc-to-est",
  "pst-to-ist",
  "ist-to-pst",
  "cet-to-ist",
  "ist-to-cet",
  "sgt-to-ist",
  "ist-to-sgt",
  "jst-to-ist",
  "ist-to-jst",
  "utc-plus-5-to-utc-plus-8",
  "utc-plus-8-to-utc-plus-5",
  "utc-plus-5-30-to-utc",
  "utc-to-utc-plus-5-30",
  "utc-plus-5-45-to-utc",
  "utc-to-utc-plus-5-45",
  "utc-minus-5-to-utc",
  "utc-to-utc-minus-5",
  "utc-minus-8-to-utc-plus-8",
  "utc-plus-8-to-utc-minus-8",
  "utc-plus-10-to-utc",
  "utc-to-utc-plus-10",
  "utc-plus-9-to-utc",
  "utc-to-utc-plus-9"
];

export function isTimezonePairing(pairingSlug: string): boolean {
  const parts = pairingSlug.toLowerCase().split('-to-');
  if (parts.length !== 2) return false;
  return parts.every(part => Object.hasOwn(TIMEZONE_ABBR_MAP, part) || resolveFixedOffsetSlug(part) !== null);
}

