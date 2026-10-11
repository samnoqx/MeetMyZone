import { ZONE_SEARCH_INDEX, CITY_TO_ZONE } from './timezone';
import { DateTime } from 'luxon';

export interface CitySuggestion { label: string; name: string; timezone: string }
interface Catalog { countries: string[]; admins: string[]; zones: string[]; shards: string[] }
type CityRow = [string, number, number, number, string[]];
const BASE = '/city-search/v20261011';
let catalogPromise: Promise<Catalog> | undefined;
const shardCache = new Map<string, Promise<CityRow[]>>();

export function normalizeCityQuery(value: string): string {
  return value.toLowerCase().normalize('NFKD').replace(/\p{M}/gu, '')
    .replace(/[^\p{L}\p{N}]+/gu, ' ').trim().replace(/\s+/g, ' ');
}
export function citySearchBucket(query: string): string {
  let hash = 0;
  for (const char of Array.from(query).slice(0, 2)) hash = (hash * 31 + char.codePointAt(0)!) >>> 0;
  return (hash % 1024).toString(16).padStart(3, '0');
}
async function load<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(path, { signal: controller.signal });
    if (!response.ok) throw new Error('City search is temporarily unavailable');
    return await response.json() as T;
  } finally { clearTimeout(timer); }
}
function metadata(): Promise<Catalog> {
  return catalogPromise ??= load<Catalog>(`${BASE}/metadata.json`).catch(error => {
    catalogPromise = undefined;
    throw error;
  });
}
function shard(id: string): Promise<CityRow[]> {
  const cached = shardCache.get(id);
  if (cached) return cached;
  // Bound memory on long browsing sessions. In-flight requests can still finish.
  if (shardCache.size >= 16) shardCache.delete(shardCache.keys().next().value!);
  const request = load<CityRow[]>(`${BASE}/${id}.json`).catch(error => {
    if (shardCache.get(id) === request) shardCache.delete(id);
    throw error;
  });
  shardCache.set(id, request);
  return request;
}
function localSuggestions(query: string): CitySuggestion[] {
  const index = [{ key: 'utc', label: 'UTC', zone: 'UTC' }, { key: 'gmt', label: 'GMT', zone: 'UTC' }, ...ZONE_SEARCH_INDEX, ...Object.entries(CITY_TO_ZONE).map(([label, zone]) => ({ key: label.toLowerCase(), label, zone }))];
  return index.filter(item => normalizeCityQuery(item.label).startsWith(query)
    || normalizeCityQuery(item.zone) === query)
    .map(item => ({ label: `${item.label} (${item.zone})`, name: item.label, timezone: item.zone }));
}
/** Search only first-party static data; typing never contacts a geocoding provider. */
export async function searchCities(input: string, count = 6, signal?: AbortSignal): Promise<CitySuggestion[]> {
  const parts = input.split(',').map(normalizeCityQuery).filter(Boolean);
  const query = parts[0] || '';
  if (!query || input.length > 120 || signal?.aborted) return [];
  // Explicit valid timezone inputs retain their exact offset, including UTC+05:30.
  if (!input.includes(',') && (input.includes('/') || /^(?:UTC|GMT)(?:[+-]|$)/i.test(input) || /^[A-Z]{2,5}$/.test(input))
    && DateTime.local().setZone(input.trim()).isValid) {
    return [{ label: input.trim(), name: input.trim(), timezone: input.trim() }];
  }
  const limit = Math.max(1, Math.min(count, 10));
  const local = localSuggestions(query).filter(item => parts.slice(1).every(part => normalizeCityQuery(item.label).includes(part)));
  if (Array.from(query).length < 2) return local.slice(0, limit);
  try {
    const catalog = await metadata();
    const id = citySearchBucket(query);
    const rows = catalog.shards.includes(id) ? await shard(id) : [];
    if (signal?.aborted) return [];
    const exact: CitySuggestion[] = [], prefix: CitySuggestion[] = [];
    for (const [name, admin, country, zone, names] of rows) {
      const match = names.some(key => key === query);
      if (!match && !names.some(key => key.startsWith(query))) continue;
      const timezone = catalog.zones[zone];
      if (!timezone) continue;
      const label = [...new Set([name, catalog.admins[admin], catalog.countries[country]].filter(Boolean))].join(', ');
      if (!parts.slice(1).every(part => normalizeCityQuery(label).includes(part))) continue;
      (match ? exact : prefix).push({ label, name, timezone });
    }
    const results = [...exact, ...prefix, ...local];
    const seen = new Set<string>();
    return results.filter(item => {
      const key = `${item.label.toLowerCase()}|${item.timezone}`;
      if (seen.has(key)) return false;
      seen.add(key); return true;
    }).slice(0, limit);
  } catch {
    return signal?.aborted ? [] : local.slice(0, limit);
  }
}
