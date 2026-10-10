import { DateTime } from 'luxon';
import { resolveTimeZone } from './timezone';

export function scalar(value: unknown): string | undefined {
  return typeof value === 'string' && value.length <= 4096 ? value : undefined;
}
export function parsePlannerList(value: unknown): string[] {
  const text = scalar(value);
  if (!text) return [];
  try {
    const list: unknown = text.startsWith('[') ? JSON.parse(text) : text.split(',');
    if (!Array.isArray(list) || list.length > 16 || list.some(item => typeof item !== 'string' || !item.trim() || item.length > 120)) return [];
    return list.map(item => item.trim());
  } catch { return []; }
}
export function validZone(value: unknown): value is string {
  return typeof value === 'string' && value.length <= 120 && DateTime.now().setZone(value).isValid;
}
export function safeZone(city: string, value?: unknown): string {
  const zone = validZone(value) ? value : resolveTimeZone(city);
  return validZone(zone) ? zone : 'UTC';
}
export function normalizeParams(input: Record<string, unknown>) {
  return Object.fromEntries(Object.entries(input).map(([key, value]) => [key, scalar(value)])) as Record<string, string | undefined>;
}
export function validDate(value: unknown): value is string {
  return typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value) && DateTime.fromISO(value).isValid;
}
export function validSnapshot(saved: unknown): boolean {
  if (!saved || typeof saved !== 'object') return false;
  const s = saved as Record<string, unknown>;
  if (typeof s.timestamp !== 'number' || s.timestamp > Date.now() + 60000 || Date.now() - s.timestamp > 86400000) return false;
  if (!Array.isArray(s.cities) || !s.cities.length || parsePlannerList(JSON.stringify(s.cities)).length !== s.cities.length) return false;
  if (!s.cityTimezones || typeof s.cityTimezones !== 'object' || !s.cities.includes(s.referenceCity)) return false;
  if (!s.cities.every(city => Object.hasOwn(s.cityTimezones as object, city) && validZone((s.cityTimezones as Record<string, unknown>)[city]))) return false;
  if (![s.workHourStart, s.workHourEnd].every(hour => typeof hour === 'number' && Number.isInteger(hour) && hour >= 0 && hour <= 23)) return false;
  if (!validDate(s.selectedDate)) return false;
  if (typeof s.eventDuration !== 'number' || ![30, 60, 90, 120, 180].includes(s.eventDuration)) return false;
  return true;
}
