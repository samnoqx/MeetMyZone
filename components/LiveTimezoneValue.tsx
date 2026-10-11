'use client';
import { useEffect, useState } from 'react';
import { DateTime } from 'luxon';

export default function LiveTimezoneValue({ zone, kind, initialValue }: { zone: string; kind: 'offset' | 'dst'; initialValue: string }) {
  const [value, setValue] = useState(initialValue);
  useEffect(() => {
    const update = () => {
      const now = DateTime.now().setZone(zone);
      if (now.isValid) setValue(kind === 'dst' ? now.isInDST ? 'Active' : 'Inactive' : `UTC${now.toFormat('ZZ')}`);
    };
    update(); const timer = setInterval(update, 60000);
    return () => clearInterval(timer);
  }, [zone, kind]);
  return <>{value}</>;
}
