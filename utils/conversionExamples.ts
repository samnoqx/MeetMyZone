import { DateTime } from 'luxon';
import type { ResolvedTimezone } from './seoResolver';

/** Fixed sample dates make seasonal differences and calendar rollovers explicit. */
export function getConversionExamples(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone, year: number) {
  return [1, 7].flatMap(month => [0, 9, 15, 23].map(hour => {
    const source = DateTime.fromObject({ year, month, day: 15, hour }, { zone: zoneA.zoneName });
    const target = source.setZone(zoneB.zoneName);
    return {
      sourceDate: source.toFormat('MMM d, yyyy'),
      sourceTime: source.toFormat('h:mm a'),
      sourceOffset: `UTC${source.toFormat('ZZ')}`,
      targetDate: target.toFormat('MMM d, yyyy'),
      targetTime: target.toFormat('h:mm a'),
      targetOffset: `UTC${target.toFormat('ZZ')}`,
      dayDifference: Math.round(target.startOf('day').setZone('UTC', { keepLocalTime: true }).diff(source.startOf('day').setZone('UTC', { keepLocalTime: true }), 'days').days),
    };
  }));
}
