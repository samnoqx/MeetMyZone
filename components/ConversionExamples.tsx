import Link from 'next/link';
import { DateTime } from 'luxon';
import type { ResolvedTimezone } from '@/utils/seoResolver';
import { getConversionExamples } from '@/utils/conversionExamples';

const STANDARD_OFFSETS: Record<string, number> = { est: -5, pst: -8, mst: -7, cst: -6, ast: -4, gmt: 0, cet: 1, aest: 10 };

export default function ConversionExamples({ zoneA, zoneB }: { zoneA: ResolvedTimezone; zoneB: ResolvedTimezone }) {
  const year = DateTime.utc().year;
  const rows = getConversionExamples(zoneA, zoneB, year);
  const fixedOffset = STANDARD_OFFSETS[zoneA.slug.toLowerCase()];
  const fixedSlug = fixedOffset === 0 ? 'utc' : `utc-${fixedOffset < 0 ? 'minus' : 'plus'}-${Math.abs(fixedOffset)}`;
  return (
    <section aria-labelledby="conversion-examples-heading" className="flex flex-col gap-4">
      <h2 id="conversion-examples-heading" className="text-lg sm:text-xl font-bold text-txt-heading">
        Common {zoneA.displayName} to {zoneB.displayName} conversions
      </h2>
      <p className="text-sm leading-relaxed text-txt-secondary">
        These examples use January 15 and July 15, {year}, to show how local times compare in different seasons.
        They use {zoneA.zoneName} and {zoneB.zoneName}. Check the destination date as well as the time;
        late-night conversions can land on the next day. Choose your actual date in the interactive timeline above.
      </p>
      {fixedOffset !== undefined && (
        <p className="text-sm leading-relaxed text-txt-secondary">
          {zoneA.displayName} is a standard-time abbreviation, but this converter follows {zoneA.cityName}&apos;s
          regional clock, including daylight saving time where applicable. If your schedule specifies a fixed
          UTC offset, use the <Link className="text-brand-accent underline" href={`/convert/${fixedSlug}-to-${zoneB.slug}`}>
            fixed-offset converter
          </Link> instead. Abbreviations such as CST and IST can also refer to different regions; confirm the location.
        </p>
      )}
      <div className="overflow-x-auto rounded-xl border border-border-custom">
        <table className="w-full text-left text-xs sm:text-sm">
          <caption className="sr-only">January and July {year} conversion examples from {zoneA.cityName} to {zoneB.cityName}</caption>
          <thead className="bg-surf-2 text-txt-heading">
            <tr><th scope="col" className="p-3">Source date</th><th scope="col" className="p-3">{zoneA.cityName}</th><th scope="col" className="p-3">{zoneB.cityName}</th><th scope="col" className="p-3">Destination date</th></tr>
          </thead>
          <tbody className="divide-y divide-border-custom text-txt-secondary">
            {rows.map((row, index) => <tr key={index}>
              <th scope="row" className="p-3 font-medium whitespace-nowrap">{row.sourceDate}</th>
              <td className="p-3 whitespace-nowrap">{row.sourceTime}<span className="block text-xs text-txt-muted">{row.sourceOffset}</span></td>
              <td className="p-3 whitespace-nowrap">{row.targetTime}<span className="block text-xs text-txt-muted">{row.targetOffset}</span></td>
              <td className="p-3 whitespace-nowrap">{row.targetDate}<span className="block text-xs text-txt-muted">{row.dayDifference === 0 ? 'Same day' : row.dayDifference > 0 ? 'Next day' : 'Previous day'}</span></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 text-sm leading-relaxed text-txt-secondary">
        {rows.filter(row => row.sourceTime === '3:00 PM').map(row => <div key={row.sourceDate}>
          <h3 className="font-semibold text-txt-heading">What time is 3 PM in {zoneA.cityName} in {zoneB.cityName}?</h3>
          <p>On {row.sourceDate}, 3:00 PM in {zoneA.cityName} ({row.sourceOffset}) is {row.targetTime} in {zoneB.cityName} ({row.targetOffset}), on {row.targetDate}.</p>
        </div>)}
      </div>
      <p className="text-xs leading-relaxed text-txt-muted">
        Time-zone rules: <a href="https://www.iana.org/time-zones" className="underline" target="_blank" rel="noopener noreferrer">IANA Time Zone Database</a>.
        Calculations use the platform&apos;s time-zone data through Luxon. Future rules may change when governments update their clocks.
      </p>
    </section>
  );
}
