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
  cities: string[];
  matrix: TimeMatrixHour[];
  currentUtcHour: number;
  is24Hour: boolean;
}

const TimelineRow = React.memo(function TimelineRow({
  city,
  cities,
  matrix,
  currentUtcHour,
  is24Hour,
}: TimelineRowProps) {
  const firstRowCell = matrix[0]?.cities[city];
  const cityOffset = firstRowCell?.offset || '';
  const cityOffsetName = firstRowCell?.offsetName || '';

  return (
    <div className="flex items-stretch hover:bg-surf-2/50 transition-colors">
      {/* Sticky City Name Column */}
      <div className="w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] p-3 sm:p-4 sticky left-0 z-20 bg-surf-1 border-r border-border-custom flex flex-col justify-center">
        <div className="text-xs sm:text-sm font-semibold text-txt-primary truncate">
          {city}
        </div>
        <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-1.5 mt-0.5 sm:mt-1 text-[8px] sm:text-[10px] text-txt-muted">
          <span suppressHydrationWarning className="bg-surf-2 px-1 py-0.2 sm:py-0.5 rounded border border-border-custom font-mono w-max text-txt-secondary">
            {cityOffsetName}
          </span>
          <span className="text-[7px] sm:text-[9px] text-txt-muted truncate">{cityOffset}</span>
        </div>
      </div>

      {/* 24 Hour Blocks for this city */}
      <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
        {matrix.map((row) => {
          const cell = row.cities[city];
          if (!cell) return null;

          // Determine if this cell falls within the city's active work hours
          const isDay = cell.isWorking;
          const isOverlap = cities.filter(c => row.cities[c]?.isWorking).length >= 2;
          const isHighlighted = isOverlap && isDay;

          return (
            <div
              key={`cell-${city}-${row.utcHour}`}
              className={`h-14 sm:h-16 flex flex-col items-center justify-center border-r border-border-custom relative transition-all duration-200 ${
                isDay
                  ? 'bg-surf-1 text-txt-primary border-y border-brand-accent/20 hover:scale-[1.02] hover:z-10 hover:shadow-xs'
                  : 'bg-surf-2 text-txt-muted hover:bg-surf-3/40'
              } ${
                isHighlighted
                  ? 'bg-brand-accent/10 shadow-[0_0_8px_rgba(251,191,36,0.15)] z-10'
                  : ''
              }`}
            >
              <span
                className={`text-xs font-mono font-bold ${
                  isHighlighted
                    ? 'text-brand-accent font-bold'
                    : isDay
                    ? 'text-txt-primary'
                    : 'text-txt-muted'
                }`}
              >
                {is24Hour 
                  ? cell.localTime24 
                  : cell.localTime.split(' ')[0]}
              </span>
              {!is24Hour && (
                <span
                  className={`text-[8px] tracking-wider uppercase mt-0.5 ${
                    isHighlighted
                      ? 'text-brand-accent/90'
                      : isDay
                      ? 'text-txt-secondary font-medium'
                      : 'text-txt-muted'
                  }`}
                >
                  {cell.localTime.split(' ')[1]}
                </span>
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
    <div className="w-full bg-surf-1 border border-border-custom rounded-xl overflow-hidden shadow-card transition-colors duration-150">
      {/* Scrollable Container */}
      <div
        ref={scrollContainerRef}
        className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-350 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-100 dark:scrollbar-track-slate-900"
      >
        <div className="min-w-[750px] sm:min-w-[1200px] select-none">
          {/* Header Row */}
          <div className="flex border-b border-border-custom bg-surf-2">
            {/* Sticky Empty Left Cell for Alignment */}
            <div className="w-28 min-w-[7rem] sm:w-56 sm:min-w-[14rem] p-3 sm:p-4 sticky left-0 z-30 bg-surf-2 border-r border-border-custom flex items-center justify-between">
              <span className="text-[10px] sm:text-xs font-semibold tracking-wider text-txt-muted uppercase">
                Locations
              </span>
              <span className="hidden sm:inline text-[9px] text-txt-secondary bg-surf-1 border border-border-custom px-1.5 py-0.5 rounded-full font-bold">
                Aligned
              </span>
            </div>

            {/* Timeline Hours Header */}
            <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
              {matrix.map((row) => {
                const isOverlap = cities.filter(c => row.cities[c]?.isWorking).length >= 2;
                return (
                  <div
                    key={`header-utc-${row.utcHour}`}
                    className={`py-2 sm:py-3 flex flex-col items-center justify-center border-r border-border-custom/50 relative ${
                      isOverlap
                        ? 'bg-brand-accent/10 shadow-[0_0_8px_rgba(251,191,36,0.15)] z-10'
                        : ''
                    }`}
                  >
                    <span
                      className={`text-[9px] sm:text-[10px] tracking-wide font-mono ${
                        isOverlap
                          ? 'text-brand-accent font-bold'
                          : 'text-txt-muted'
                      }`}
                    >
                      {is24Hour 
                        ? `${String(row.utcHour).padStart(2, '0')}:00` 
                        : getHeaderHourLabel(row.utcHour)}
                    </span>
                    <span
                      className={`text-[8px] sm:text-[9px] mt-0.5 ${
                        isOverlap ? 'text-brand-accent/80' : 'text-txt-muted'
                      }`}
                    >
                      {is24Hour ? `HR ${row.utcHour}` : `${String(row.utcHour).padStart(2, '0')}:00`}
                    </span>

                    {/* Yellow marker line at the top of the header if it's an overlap hour */}
                    {isOverlap && (
                      <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-accent animate-pulse" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* City Rows */}
          <div className="divide-y divide-border-custom">
            {cities.map((city) => (
              <TimelineRow
                key={`row-${city}`}
                city={city}
                cities={cities}
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
