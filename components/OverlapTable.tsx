import React from 'react';
import { ResolvedTimezone } from '../utils/seoResolver';
import { DateTime } from 'luxon';

interface OverlapTableProps {
  zones: ResolvedTimezone[];
  selectedDate?: string;
}

export default function OverlapTable({ zones, selectedDate }: OverlapTableProps) {
  if (zones.length === 0) return null;

  const refZone = zones[0];
  const targetZones = zones.slice(1);

  const refDate = selectedDate
    ? DateTime.fromISO(selectedDate, { zone: refZone.zoneName }).startOf('day')
    : DateTime.now().setZone(refZone.zoneName).startOf('day');

  // Generate rows for local hours 9 AM to 5 PM in refZone
  const rows = Array.from({ length: 9 }).map((_, index) => {
    const refHour24 = 9 + index; // 9 to 17
    
    // Format refZone hour label
    const refPeriod = refHour24 >= 12 ? 'PM' : 'AM';
    const refHour12 = refHour24 % 12 === 0 ? 12 : refHour24 % 12;
    const refLabel = `${refHour12}:00 ${refPeriod}`;

    // Calculate times for each target zone
    let isAllWorking = true;
    const targetLabels = targetZones.map((zone) => {
      const localTime = refDate.set({ hour: refHour24 }).setZone(zone.zoneName);
      const toHour24 = localTime.hour;
      const toMinutes = localTime.minute;

      const toPeriod = toHour24 >= 12 ? 'PM' : 'AM';
      const toHour12 = toHour24 % 12 === 0 ? 12 : toHour24 % 12;
      const label = `${toHour12}:${String(toMinutes).padStart(2, '0')} ${toPeriod}`;

      const isWorking = toHour24 >= 9 && toHour24 <= 17;
      if (!isWorking) {
        isAllWorking = false;
      }

      return {
        label,
        isWorking
      };
    });

    return {
      refLabel,
      targetLabels,
      isOptimalOverlap: isAllWorking && targetZones.length > 0
    };
  });

  return (
    <div className="w-full overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl shadow-sm bg-white dark:bg-slate-900 my-6">
      <table className="w-full text-left border-collapse text-xs sm:text-sm min-w-[600px]">
        <thead>
          <tr className="bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
            <th className="p-3 sm:p-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] sm:text-xs">
              {refZone.displayName.toUpperCase()} Working Hours
            </th>
            {targetZones.map((z, idx) => (
              <th key={`th-${idx}`} className="p-3 sm:p-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] sm:text-xs">
                Equivalent {z.displayName.toUpperCase()} Time
              </th>
            ))}
            <th className="p-3 sm:p-4 font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px] sm:text-xs text-right">
              Overlap Status
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-mono">
          {rows.map((row, idx) => (
            <tr
              key={`row-${idx}`}
              className={`transition-colors duration-150 ${
                row.isOptimalOverlap
                  ? 'bg-emerald-500/5 dark:bg-emerald-950/20 hover:bg-emerald-500/10 dark:hover:bg-emerald-950/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'
              }`}
            >
              <td 
                className={`p-3 sm:p-4 font-semibold ${
                  row.isOptimalOverlap 
                    ? 'text-emerald-600 dark:text-emerald-400' 
                    : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {row.refLabel}
              </td>
              {row.targetLabels.map((target, tIdx) => (
                <td 
                  key={`td-${tIdx}`} 
                  className={`p-3 sm:p-4 ${
                    target.isWorking 
                      ? 'text-emerald-600 dark:text-emerald-400 font-semibold' 
                      : 'text-slate-600 dark:text-slate-300'
                  }`}
                >
                  {target.label}
                </td>
              ))}
              <td className="p-3 sm:p-4 text-right">
                {row.isOptimalOverlap ? (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/60 uppercase">
                    <span className="h-1 w-1 rounded-full bg-emerald-500" />
                    Core Business Hour
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium bg-slate-100 dark:bg-slate-800/80 text-slate-500 dark:text-slate-300 border border-slate-200 dark:border-slate-700 uppercase">
                    After-Hours
                  </span>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
