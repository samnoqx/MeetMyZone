'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTimezoneClock, getCountryCode } from '@/hooks/useTimezoneClock';

const DASHBOARD_CITIES = [
  { city: 'New York', country: 'United States', timezone: 'America/New_York' },
  { city: 'London', country: 'United Kingdom', timezone: 'Europe/London' },
  { city: 'Dubai', country: 'United Arab Emirates', timezone: 'Asia/Dubai' },
  { city: 'Singapore', country: 'Singapore', timezone: 'Asia/Singapore' },
  { city: 'Tokyo', country: 'Japan', timezone: 'Asia/Tokyo' },
  { city: 'Sydney', country: 'Australia', timezone: 'Australia/Sydney' }
];

/**
 * IANA legacy alias normalization map.
 * Maps legacy IANA city identifiers to their canonical modern display names.
 */
const IANA_DISPLAY_OVERRIDES: Record<string, string> = {
  'calcutta': 'Kolkata',
  'saigon': 'Ho Chi Minh',
  'bombay': 'Mumbai',
  'madras': 'Chennai',
  'rangoon': 'Yangon',
  'peking': 'Beijing',
  'constantinople': 'Istanbul',
};

/**
 * Normalizes an IANA-derived city name to its canonical modern user-facing display name.
 * e.g. "Calcutta" -> "Kolkata", "Saigon" -> "Ho Chi Minh"
 */
function getDisplayCityName(city: string): string {
  const override = IANA_DISPLAY_OVERRIDES[city.toLowerCase()];
  return override || city;
}

/**
 * Generates a URL-safe slug from a city display name.
 * e.g. "New York" -> "new-york", "Ho Chi Minh" -> "ho-chi-minh", "Kolkata" -> "kolkata"
 */
function getCitySlug(city: string): string {
  return city
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '');
}

export default function CurrentTimeClocksHeroCard() {
  const [isManuallySelected, setIsManuallySelected] = useState(false);

  const {
    mounted,
    currentTime,
    clock1,
    activeSearchIndex,
    setActiveSearchIndex,
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading,
    searchPanelRef,
    handleSelectLocation,
    handlePresetClick
  } = useTimezoneClock({
    storageKeyPrefix: 'wc_current',
    initialClock1: { city: 'Local Time', country: 'Local Time Zone', timezone: 'local' },
    showTimezoneMode: false,
    persistSelection: false
  });

  // Clear any old selected-clock keys from localStorage during mount initialization
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.removeItem('wc_current_c1');
        localStorage.removeItem('wc_current_ct1');
        localStorage.removeItem('wc_current_z1');
        localStorage.removeItem('wc_current_r1');
      } catch {}
    }
  }, []);

  // Listen for Escape key to close the dropdown popover
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveSearchIndex(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveSearchIndex]);

  if (!mounted) {
    return (
      <div className="w-full max-w-md bg-surf-1 rounded-2xl border border-border-custom shadow-card animate-pulse h-[396px]" />
    );
  }

  // Intercept suggestion and preset selection to track manual overrides in the current session
  const myHandleSelectLocation = (sug: { label: string; timezone: string }) => {
    setIsManuallySelected(true);
    handleSelectLocation(sug);
  };

  const myHandlePresetClick = (city: string) => {
    setIsManuallySelected(true);
    handlePresetClick(city);
  };

  const localCity = getDisplayCityName(clock1.city);
  const localCitySlug = getCitySlug(localCity);

  // Filter out the first row's timezone/city from the global list to prevent duplicates
  const comparisonCities = DASHBOARD_CITIES.filter(
    (c) =>
      c.timezone.toLowerCase() !== clock1.timezone.toLowerCase() &&
      c.city.toLowerCase() !== clock1.city.toLowerCase() &&
      c.city.toLowerCase() !== localCity.toLowerCase()
  ).slice(0, 5);

  return (
    <div className="w-full max-w-md bg-surf-1 rounded-2xl border border-border-custom shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 relative overflow-hidden flex flex-col h-[396px]">
      
      <div className="p-5 pb-4 border-b border-border-soft flex flex-col gap-1.5 select-none">
        <div className="flex items-center gap-1.5">
          <svg className="w-4 h-4 text-brand-accent-hover animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span className="text-[10px] font-mono font-black text-brand-accent-hover tracking-widest uppercase">
            CURRENT TIME CLOCKS
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-extrabold text-txt-heading">
          Monitor global business time
        </h3>
        <p className="text-[10px] sm:text-xs text-txt-muted">
          Live clocks across major financial and business hubs
        </p>
      </div>

      <div className="flex-1 overflow-y-auto max-h-[250px] divide-y divide-border-soft/60 scrollbar-none relative">
        {/* Row 1: The dynamic Local / Selected Clock row */}
        {(() => {
          const dt = currentTime ? currentTime.setZone(clock1.timezone) : null;
          const timeStr = dt ? dt.toFormat('hh:mm a') : '--:--';
          const countryCode = getCountryCode(clock1.country);

          return (
            <div className="flex items-center justify-between px-5 py-3 hover:bg-surf-2 transition-all duration-150 border-b border-border-soft/40 group/row">
              <div className="flex items-center gap-3">
                <Link
                  href={`/time-in/${localCitySlug}`}
                  className="shrink-0"
                  aria-label={`View full local time details for ${localCity}`}
                >
                  <img
                    src={`https://flagcdn.com/24x18/${countryCode}.png`}
                    srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x`}
                    width="20"
                    height="15"
                    alt={`${clock1.country} flag`}
                    className="rounded-[2px] shadow-xs shrink-0"
                  />
                </Link>
                <div className="flex flex-col gap-0.5">
                  <div className="flex items-center gap-1.5">
                    <Link
                      href={`/time-in/${localCitySlug}`}
                      className="text-xs font-extrabold text-txt-primary hover:text-brand-accent-hover transition-colors font-sans"
                    >
                      {localCity}
                    </Link>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveSearchIndex(1);
                        setSearchQuery('');
                      }}
                      className="group/btn flex items-center cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent rounded p-0.5"
                      aria-label="Change local city or timezone"
                    >
                      <svg className="w-3.5 h-3.5 text-brand-accent shrink-0 group-hover/btn:translate-y-0.5 group-hover/btn:text-brand-accent-hover group-hover/btn:drop-shadow-[0_0_2px_currentColor] transition-all duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  </div>
                  <span className="text-[9px] text-txt-subtle font-mono font-bold tracking-wide uppercase">
                    {isManuallySelected ? 'SELECTED CLOCK' : 'YOUR LOCAL TIME'}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {dt && dt.isInDST && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-brand-accent-surface text-brand-accent-deep dark:text-brand-accent font-black tracking-wide uppercase border border-brand-accent/20 select-none">
                    DST
                  </span>
                )}
                <span className="text-xs sm:text-sm font-black text-txt-heading font-mono select-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {timeStr}
                </span>
              </div>
            </div>
          );
        })()}

        {/* Comparison Clocks (Rows 2 to 6) */}
        {comparisonCities.map((city) => {
          const dt = currentTime ? currentTime.setZone(city.timezone) : null;
          const timeStr = dt ? dt.toFormat('hh:mm a') : '--:--';
          const offsetStr = dt ? dt.toFormat('ZZ') : 'UTC+0';
          const countryCode = getCountryCode(city.country);
          const displayCity = getDisplayCityName(city.city);
          const citySlug = getCitySlug(displayCity);

          return (
            <div key={city.city} className="flex items-center justify-between px-5 py-3 hover:bg-surf-2 transition-all duration-150 border-b border-border-soft/40 last:border-b-0 group/row">
              <Link
                href={`/time-in/${citySlug}`}
                className="flex items-center gap-3 cursor-pointer"
                aria-label={`View full local time details for ${displayCity}`}
              >
                <img
                  src={`https://flagcdn.com/24x18/${countryCode}.png`}
                  srcSet={`https://flagcdn.com/48x36/${countryCode}.png 2x`}
                  width="20"
                  height="15"
                  alt={`${city.country} flag`}
                  className="rounded-[2px] shadow-xs shrink-0"
                />
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs font-extrabold text-txt-primary group-hover/row:text-brand-accent-hover transition-colors font-sans">
                    {displayCity}
                  </span>
                  <span className="text-[9px] text-txt-subtle font-mono font-bold tracking-wide">
                    Offset: {offsetStr}
                  </span>
                </div>
              </Link>

              <div className="flex items-center gap-2">
                {dt && dt.isInDST && (
                  <span className="text-[8px] font-mono px-1.5 py-0.5 rounded bg-brand-accent-surface text-brand-accent-deep dark:text-brand-accent font-black tracking-wide uppercase border border-brand-accent/20 select-none">
                    DST
                  </span>
                )}
                <span className="text-xs sm:text-sm font-black text-txt-heading font-mono select-none" style={{ fontVariantNumeric: 'tabular-nums' }}>
                  {timeStr}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="w-full bg-brand-accent-surface border-t border-border-custom py-3 px-4 flex items-center justify-center gap-2 select-none shrink-0 text-xs mt-auto">
        <span className="flex items-center gap-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-black text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">Live</span>
        </span>
        <span className="text-txt-muted font-bold">|</span>
        <span className="font-black text-txt-primary uppercase tracking-wide">
          Global Clock Network Active
        </span>
      </div>

      {/* Popover Selector Panel */}
      {activeSearchIndex === 1 && (
        <div 
          ref={searchPanelRef} 
          className="absolute z-30 flex flex-col p-3 rounded-xl border border-border-custom bg-surf-1 shadow-lg w-[260px] top-[102px] left-[44px]"
        >
          <div className="flex items-center justify-between mb-2 pb-1 border-b border-border-soft select-none">
            <span className="text-[9px] font-bold text-txt-muted uppercase tracking-wider">Select Location</span>
            <button 
              onClick={() => setActiveSearchIndex(null)}
              className="text-[9px] font-bold text-brand-accent-hover uppercase cursor-pointer"
            >
              Close
            </button>
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-6 pr-2 py-1 border border-border-custom bg-surf-2 text-txt-primary rounded-md text-[11px] focus:outline-none focus:border-brand-accent"
              autoFocus
            />
            <span className="absolute left-2 top-1/2 -translate-y-1/2 text-txt-muted">
              <svg className="w-2.5 h-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
          </div>
          
          <div className="mt-2 max-h-[140px] overflow-y-auto flex flex-col gap-1 pr-1 scrollbar-none">
            {isLoading ? (
              <span className="text-[10px] text-txt-muted p-1 animate-pulse">Searching...</span>
            ) : suggestions.length === 0 && searchQuery.trim() ? (
              <span className="text-[10px] text-txt-muted p-1">No matches</span>
            ) : suggestions.length === 0 ? (
              <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                {['London', 'New York', 'Tokyo', 'Sydney', 'Mumbai', 'Paris'].map(city => (
                  <button
                    key={city}
                    onClick={() => myHandlePresetClick(city)}
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
                  onClick={() => myHandleSelectLocation(sug)}
                  className="text-left text-[10px] font-bold text-txt-primary hover:text-brand-accent-hover hover:bg-surf-2 p-1 rounded transition-all cursor-pointer truncate"
                >
                  {sug.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}

    </div>
  );
}
