'use client';

import React from 'react';
import { useTimezoneClock, getCountryCode, ClockState } from '@/hooks/useTimezoneClock';

export interface TimezoneConverterHeroCardProps {
  initialClock1?: ClockState;
  initialClock2?: ClockState;
  storageKeyPrefix?: string;
}

export default function TimezoneConverterHeroCard({
  initialClock1,
  initialClock2,
  storageKeyPrefix = 'wc_converter'
}: TimezoneConverterHeroCardProps) {
  const {
    mounted,
    currentTime,
    clock1,
    clock2,
    activeSearchIndex,
    setActiveSearchIndex,
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading,
    searchPanelRef,
    handleSelectLocation,
    handlePresetClick,
    handleSwap
  } = useTimezoneClock({
    initialClock1,
    initialClock2,
    storageKeyPrefix,
    showTimezoneMode: true
  });

  const getDifferenceString = () => {
    if (!currentTime) return '';
    const dt1 = currentTime.setZone(clock1.timezone);
    const dt2 = currentTime.setZone(clock2.timezone);
    const offset1 = dt1.offset; 
    const offset2 = dt2.offset; 
    const diffMinutes = offset1 - offset2;
    const diffHours = Math.abs(diffMinutes / 60);
    const isRightDst = dt2.isInDST;

    return `${clock1.city} → ${clock2.city} | Difference: ${diffHours} ${diffHours === 1 ? 'Hour' : 'Hours'}${isRightDst ? ' | DST Active' : ''}`;
  };

  const renderClockColumn = (index: 1 | 2, state: ClockState) => {
    const dt = currentTime ? currentTime.setZone(state.timezone) : null;
    const timeStr = dt ? dt.toFormat('hh:mm') : '--:--';
    const ampmStr = dt ? dt.toFormat('a') : 'AM';
    const dateStr = dt ? dt.toFormat('EEE, MMM dd, yyyy') : '---, --- --, ----';
    const offsetStr = dt ? dt.toFormat('ZZ') : 'UTC+0';

    const isReference = index === 1;

    return (
      <div className="flex-1 flex flex-col p-6 items-center justify-center min-h-[160px] relative">
        
        {/* Search Overlay inside column container */}
        {activeSearchIndex === index && (
          <div ref={searchPanelRef} className="absolute inset-0 bg-surf-1 z-30 flex flex-col p-4 rounded-xl">
            <div className="flex items-center justify-between mb-2 pb-1 border-b border-border-custom">
              <span className="text-[10px] font-bold text-txt-muted uppercase tracking-wider">Select Location</span>
              <button 
                onClick={() => setActiveSearchIndex(null)}
                className="text-[10px] font-bold text-brand-accent-hover uppercase cursor-pointer"
              >
                Cancel
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Search city or timezone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-7 pr-3 py-1 border border-border-custom bg-surf-2 text-txt-primary rounded-lg text-xs focus:outline-none focus:border-brand-accent"
                autoFocus
              />
              <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-txt-muted">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            
            <div className="mt-2 overflow-y-auto flex-1 flex flex-col gap-1 pr-1 scrollbar-none">
              {isLoading ? (
                <span className="text-[10px] text-txt-muted p-1 animate-pulse">Searching...</span>
              ) : suggestions.length === 0 && searchQuery.trim() ? (
                <span className="text-[10px] text-txt-muted p-1">No matches</span>
              ) : suggestions.length === 0 ? (
                <div className="grid grid-cols-2 gap-1 mt-1">
                  {['London', 'New York', 'Tokyo', 'Sydney', 'Mumbai', 'Paris'].map(city => (
                    <button
                      key={city}
                      onClick={() => handlePresetClick(city)}
                      className="text-left text-[10px] font-bold text-txt-primary hover:text-brand-accent-hover hover:bg-surf-2 p-1 rounded transition-colors cursor-pointer"
                    >
                      {city}
                    </button>
                  ))}
                </div>
              ) : (
                suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(sug)}
                    className="text-left text-[10px] font-bold text-txt-primary hover:text-brand-accent-hover hover:bg-surf-2 p-1 rounded transition-all cursor-pointer truncate"
                  >
                    {sug.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Timezone focused layout */}
        <div className="flex flex-col justify-between items-center w-full h-full flex-1">
          <div className="flex flex-col gap-0.5 w-full items-center text-center">
            <button
              onClick={() => {
                setActiveSearchIndex(index);
                setSearchQuery('');
              }}
              className="group flex flex-col items-center gap-0.5 text-center cursor-pointer w-full"
            >
              <span className="text-xl sm:text-2xl font-black text-txt-heading hover:text-brand-accent-hover transition-colors font-sans flex items-center gap-1.5 justify-center">
                <img
                  src={`https://flagcdn.com/24x18/${getCountryCode(state.country)}.png`}
                  srcSet={`https://flagcdn.com/48x36/${getCountryCode(state.country)}.png 2x`}
                  width="24"
                  height="18"
                  alt={`${state.country} flag`}
                  className="inline-block rounded-[2px] shadow-sm h-auto object-contain shrink-0"
                />
                <span>{state.city}</span>
                <svg className="w-3.5 h-3.5 text-brand-accent shrink-0 group-hover:translate-y-0.5 group-hover:text-brand-accent-hover group-hover:drop-shadow-[0_0_2px_currentColor] transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                </svg>
              </span>
              <span className="text-[10px] sm:text-xs font-bold text-txt-primary tracking-tight truncate max-w-full">
                {state.country}
              </span>
              {state.region && (
                <span className="text-[9px] font-bold text-txt-muted uppercase tracking-wider truncate max-w-full mt-0.5">
                  {state.region}
                </span>
              )}
            </button>
          </div>

          <div className="flex flex-col gap-0.5 select-none items-center text-center my-3 w-full">
            <div className="flex items-baseline gap-1 justify-center">
              <span className="text-2xl sm:text-3xl font-black text-txt-heading font-mono leading-none tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
                {timeStr}
              </span>
              <span className="text-[10px] font-black text-txt-primary uppercase font-mono">
                {ampmStr}
              </span>
            </div>
            <span className="text-[9px] font-bold text-txt-muted mt-0.5">
              {dateStr}
            </span>
            <span className="text-[9px] font-mono font-bold text-txt-subtle mt-1 uppercase">
              Offset: {offsetStr}
            </span>
          </div>

          <div className="h-5 flex items-center justify-center">
            {isReference ? (
              <span className="text-[8.5px] font-mono font-black text-brand-accent-hover tracking-widest uppercase">
                Reference Time
              </span>
            ) : (
              dt && dt.isInDST && (
                <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-brand-accent-surface text-brand-accent-deep dark:text-brand-accent font-black tracking-wide uppercase border border-brand-accent/20 select-none">
                  DST Active
                </span>
              )
            )}
          </div>
        </div>

      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-md bg-surf-1 rounded-2xl border border-border-custom shadow-card animate-pulse h-[260px]" />
    );
  }

  return (
    <div className="w-full max-w-md bg-surf-1 rounded-2xl border border-border-custom shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col">
      
      <div className="p-5 pb-0 border-b border-border-soft flex flex-col gap-1.5 select-none">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 002 2h2a2.5 2.5 0 002.5-2.5V10a2 2 0 00-2-2h-1a2 2 0 01-2-2V5a2 2 0 00-2-2h-1.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-mono font-black text-brand-accent-hover tracking-widest uppercase">
            TIME ZONE CONVERTER
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-txt-heading">
          Compare global time zones
        </h3>
        <p className="text-[10px] sm:text-xs text-txt-muted">
          Live UTC offsets, DST status and timezone differences
        </p>
      </div>

      {/* Clock Columns */}
      <div className="flex relative">
        {renderClockColumn(1, clock1)}
        
        {/* Yellow Circular Transfer Badge */}
        <button
          onClick={handleSwap}
          className="absolute left-1/2 top-[45%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-brand-accent flex items-center justify-center shadow-sm z-25 border border-slate-950/5 cursor-pointer hover:bg-brand-accent-hover transition-colors focus:outline-none focus:ring-2 focus:ring-brand-accent"
          aria-label="Swap locations"
          title="Swap locations"
        >
          <svg className="w-4 h-4 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
        </button>

        {/* Vertical divider line */}
        <div className="absolute left-1/2 top-4 bottom-4 -translate-x-1/2 border-l border-border-custom" />

        {renderClockColumn(2, clock2)}
      </div>

      {/* Cream Footer Bar */}
      <div className="w-full bg-brand-accent-surface border-t border-border-custom py-3 px-4 flex items-center justify-center gap-2 select-none shrink-0">
        <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <span className="text-xs font-black text-txt-primary">
          {getDifferenceString()}
        </span>
      </div>

    </div>
  );
}
