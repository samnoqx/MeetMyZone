import { DateTime } from 'luxon';
import { resolveTimeZone } from './timezone';
import type { TimeMatrixHour } from './timezone';

export function generateMeetingSummary(cities: string[], matrix: TimeMatrixHour[], selectedDate: string | undefined, referenceCity: string, currentUrl: string): string {
  const referenceZone = matrix[0]?.cities[referenceCity]?.ianaZone || resolveTimeZone(referenceCity);
  const dateObj = selectedDate ? DateTime.fromISO(selectedDate, { zone: referenceZone }).startOf('day') : DateTime.now().setZone(referenceZone).startOf('day');
  const dateStr = dateObj.toFormat('EEEE, LLLL dd, yyyy');

  // Find timeline columns where ALL cities are in local working hours (using precomputed isWorking status)
  const goldenHours = matrix.filter((row) => {
    return cities.every((city) => {
      const cell = row.cities[city];
      return cell && cell.isWorking;
    });
  });

  // Group sequential hours into meeting slots
  const ranges: { start: number; end: number }[] = [];
  let currentRange: { start: number; end: number } | null = null;

  goldenHours.forEach((hour) => {
    if (!currentRange) {
      currentRange = { start: hour.utcHour, end: hour.utcHour };
    } else if (hour.utcHour === currentRange.end + 1) {
      currentRange.end = hour.utcHour;
    } else {
      ranges.push(currentRange);
      currentRange = { start: hour.utcHour, end: hour.utcHour };
    }
  });
  if (currentRange) {
    ranges.push(currentRange);
  }

  const cityListStr = cities.join(', ');
  let summaryText = '';

  if (ranges.length === 0) {
    summaryText = [
      `Hello team,`,
      ``,
      `To align our upcoming meeting across our locations (${cityListStr}), we analyzed the timezone differences for ${dateStr}.`,
      `Currently, there are no overlapping working hours local time across all regions.`,
      ``,
      `Please view the interactive timezone timeline comparison below to coordinate a custom slot:`,
      `${currentUrl}`,
      ``,
      `Thank you!`
    ].join('\n');
  } else {
    const baseTime = dateObj;
    const rangeListText = ranges.map((r, index) => {
      const startReference = baseTime.plus({ hours: r.start });
      const endReference = baseTime.plus({ hours: r.end + 1 });

      const cityLocalStrings = cities.map((city) => {
        const zone = matrix[0]?.cities[city]?.ianaZone || resolveTimeZone(city);
        const localStart = startReference.setZone(zone);
        const localEnd = endReference.setZone(zone);

        return `${localStart.toFormat('LLL d, h:mm a')} ${localStart.offsetNameShort} - ${localEnd.toFormat('LLL d, h:mm a')} ${localEnd.offsetNameShort} (${city})`;
      });

      return `• Option ${index + 1}: ${cityLocalStrings.join(' | ')}`;
    }).join('\n');

    summaryText = [
      `Hello team,`,
      ``,
      `To align our upcoming meeting across our locations (${cityListStr}), we have analyzed the overlapping working hours and identified the following optimal slot options for ${dateStr}:`,
      ``,
      rangeListText,
      ``,
      `You can view the interactive timezone timeline comparison or customize this schedule at:`,
      `${currentUrl}`,
      ``,
      `Please choose the option that works best for you. Thank you!`
    ].join('\n');
  }

  return summaryText;
}
