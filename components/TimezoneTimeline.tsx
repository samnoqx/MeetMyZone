'use client';

import React from 'react';
import { TimeMatrixHour } from '@/utils/timezone';

interface TimezoneTimelineProps {
  cities: string[];
  matrix: TimeMatrixHour[];
  currentUtcHour: number;
  is24Hour?: boolean;
}

interface TimelineRowProps {
  city: string;
  matrix: TimeMatrixHour[];
  currentUtcHour: number;
  is24Hour: boolean;
}

const TimelineRow = React.memo(function TimelineRow({
  city,
  matrix,
  currentUtcHour,
  is24Hour,
}: TimelineRowProps) {
  const firstRowCell = matrix[0]?.cities[city];
  const cityOffset = firstRowCell?.offset || '';
  const cityOffsetName = firstRowCell?.offsetName || '';

  return (
    <div className="flex items-stretch hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
      {/* Sticky City Name Column */}
      <div className="w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] p-3 sm:p-4 sticky left-0 z-20 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col justify-center">
        <div className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
          {city}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] text-slate-500 dark:text-slate-400">
          <span suppressHydrationWarning className="bg-slate-100 dark:bg-slate-800 px-1 py-0.2 sm:py-0.5 rounded border border-slate-200 dark:border-slate-700 font-mono w-max">
            {cityOffsetName}
          </span>
          <span className="text-[7px] sm:text-[9px] text-slate-400 dark:text-slate-500 truncate">{cityOffset}</span>
        </div>
      </div>

      {/* 24 Hour Blocks for this city */}
      <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
        {matrix.map((row) => {
          const cell = row.cities[city];
          const isCurrent = row.utcHour === currentUtcHour;
          
          if (!cell) return null;

          // Determine if this cell falls within the city's active work hours
          const isDay = cell.isWorking;

          return (
            <div
              key={`cell-${city}-${row.utcHour}`}
              className={`h-14 sm:h-16 flex flex-col items-center justify-center border-r border-slate-200/50 dark:border-slate-800/20 relative transition-all duration-200 ${
                isDay
                  ? 'bg-amber-50/20 dark:bg-white text-slate-950 border-y border-amber-100 dark:border-slate-200 hover:scale-[1.02] hover:z-10 hover:shadow-lg dark:hover:text-black'
                  : 'bg-slate-100/50 dark:bg-slate-950 text-slate-400 dark:text-slate-400 hover:bg-slate-200/40 dark:hover:bg-slate-800/60'
              } ${
                isCurrent
                  ? 'ring-1 ring-red-500 bg-red-500/10 dark:bg-red-500/15 border-x border-red-500/20 z-10'
                  : ''
              }`}
            >
              <span
                className={`text-xs font-mono font-bold ${
                  isDay ? 'text-slate-900 dark:text-slate-900' : 'text-slate-700 dark:text-slate-200'
                }`}
              >
                {is24Hour 
                  ? cell.localTime24 
                  : cell.localTime.split(' ')[0]}
              </span>
              {!is24Hour && (
                <span
                  className={`text-[8px] tracking-wider uppercase mt-0.5 ${
                    isDay ? 'text-slate-500 font-medium' : 'text-slate-400 dark:text-slate-500'
                  }`}
                >
                  {cell.localTime.split(' ')[1]}
                </span>
              )}

              {/* Current Hour highlight overlay line */}
              {isCurrent && (
                <div className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-0.5 bg-red-500/40 pointer-events-none" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
});

export default function TimezoneTimeline({
  cities,
  matrix,
  currentUtcHour,
  is24Hour = true,
}: TimezoneTimelineProps) {
  const scrollContainerRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    // Restore scroll position
    const savedScrollX = sessionStorage.getItem('mmz_timeline_scroll_x');
    if (savedScrollX) {
      container.scrollLeft = parseInt(savedScrollX, 10);
    }

    // Save scroll position on scroll (debounced to avoid performance hit)
    let debounceTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        if (container) {
          sessionStorage.setItem('mmz_timeline_scroll_x', String(container.scrollLeft));
        }
      }, 200);
    };

    container.addEventListener('scroll', handleScroll);
    return () => {
      container.removeEventListener('scroll', handleScroll);
      clearTimeout(debounceTimeout);
    };
  }, []);

  // Helper to format the display of the reference city hour in the timeline header
  const getHeaderHourLabel = (utcHour: number) => {
    const period = utcHour >= 12 ? 'PM' : 'AM';
    const displayHour = utcHour % 12 === 0 ? 12 : utcHour % 12;
    return `${displayHour} ${period}`;
  };

  return (
    <div className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden shadow-xl dark:shadow-2xl backdrop-blur-md transition-colors duration-200">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-300 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-100 dark:scrollbar-track-slate-900"
      >
        <div className="min-w-[750px] sm:min-w-[1200px] select-none">
          {/* Header Row */}
          <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/80">
            {/* Sticky Empty Left Cell for Alignment */}
            <div className="w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] p-3 sm:p-4 sticky left-0 z-30 bg-slate-50 dark:bg-slate-950 border-r border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-slate-500 dark:text-slate-400 uppercase">
                Locations
              </span>
              <span className="hidden sm:inline text-[9px] text-slate-500 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-900 border border-slate-300 dark:border-slate-800 px-1.5 py-0.5 rounded-full">
                Aligned
              </span>
            </div>

            {/* Timeline Hours Header */}
            <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
              {matrix.map((row) => {
                const isCurrent = row.utcHour === currentUtcHour;
                return (
                  <div
                    key={`header-utc-${row.utcHour}`}
                    className={`py-2 sm:py-3 flex flex-col items-center justify-center border-r border-slate-200/60 dark:border-slate-800/40 relative ${
                      isCurrent
                        ? 'bg-red-500/5 border-x border-red-500/30'
                        : ''
                    }`}
                  >
                    <span
                      className={`text-[9px] sm:text-[10px] tracking-wide font-mono ${
                        isCurrent
                          ? 'text-red-500 dark:text-red-400 font-semibold'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                    >
                      {is24Hour 
                        ? `${String(row.utcHour).padStart(2, '0')}:00` 
                        : getHeaderHourLabel(row.utcHour)}
                    </span>
                    <span className="text-[8px] sm:text-[9px] text-slate-400 dark:text-slate-600 mt-0.5">
                      {is24Hour ? `HR ${row.utcHour}` : `${String(row.utcHour).padStart(2, '0')}:00`}
                    </span>

                    {/* Red marker line at the top of the header if it's the current hour */}
                    {isCurrent && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-red-500 animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* City Rows */}
          <div className="divide-y divide-slate-200 dark:divide-slate-800/60">
            {cities.map((city) => (
              <TimelineRow
                key={`row-${city}`}
                city={city}
                matrix={matrix}
                currentUtcHour={currentUtcHour}
                is24Hour={is24Hour}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
