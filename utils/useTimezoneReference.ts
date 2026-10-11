'use client';

import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

export function referenceSignature(instant: DateTime, zones: string[]) {
  return `${instant.toUTC().toISODate()}|${zones.map(zone => instant.setZone(zone).offset).join(',')}`;
}

// Hydrate the build snapshot first. Refresh reference facts only when the day
// or a relevant UTC offset changes; live clocks keep their own second timers.
export function useTimezoneReference(initialInstant: string | undefined, zones: string[]) {
  const [instant, setInstant] = useState(() => {
    const parsed = initialInstant ? DateTime.fromISO(initialInstant, { setZone: true }) : DateTime.now();
    return parsed.isValid ? parsed : DateTime.now();
  });
  const zoneKey = zones.join(',');
  useEffect(() => {
    const trackedZones = zoneKey.split(',');
    const update = () => {
      const next = DateTime.now();
      setInstant(previous => referenceSignature(previous, trackedZones) === referenceSignature(next, trackedZones) ? previous : next);
    };
    update(); const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [zoneKey]);
  return instant;
}
