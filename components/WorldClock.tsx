"use client";
import React, { useState, useEffect, useRef, useMemo } from 'react';
import { DateTime } from 'luxon';
import { ZONE_SEARCH_INDEX, deduplicateSuggestions } from '@/utils/timezone';

interface ClockCity {
  label: string;
  timezone: string;
}

interface WorldClockProps {
  initialCity1?: string;
  initialZone1?: string;
  initialCity2?: string;
  initialZone2?: string;
  onSelectionChange?: (index: 1 | 2, cityName: string, timezone: string) => void;
  isConverterPage?: boolean;
  singleCityMode?: boolean;
  initialCountry1?: string;
}

const ClockIcon = () => (
  <svg className="w-4 h-4 text-brand-accent-hover animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5 text-txt-muted group-hover:text-brand-accent-hover transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function WorldClock({
  initialCity1,
  initialZone1,
  initialCity2,
  initialZone2,
  onSelectionChange,
  isConverterPage = false,
  singleCityMode = false,
  initialCountry1
}: WorldClockProps) {
  // Cities & Timezones
  const [city1, setCity1] = useState(initialCity1 || 'London');
  const [zone1, setZone1] = useState(initialZone1 || 'Europe/London');
  const [city2, setCity2] = useState(initialCity2 || 'New York');
  const [zone2, setZone2] = useState(initialZone2 || 'America/New_York');

  // Real-time values without seconds
  const [time1, setTime1] = useState('');
  const [date1, setDate1] = useState('');
  const [abbr1, setAbbr1] = useState('');
  const [dstStatus1, setDstStatus1] = useState('');
  const [offset1, setOffset1] = useState('');

  const [time2, setTime2] = useState('');
  const [date2, setDate2] = useState('');
  const [abbr2, setAbbr2] = useState('');

  // Helper to format the offset label (e.g. UTC-4, UTC+5:30, UTC+0)
  const getOffsetLabel = (zone: string) => {
    try {
      const dt = DateTime.now().setZone(zone);
      if (!dt.isValid) return 'UTC';
      const offsetMin = dt.offset;
      if (offsetMin === 0) return 'UTC+0';
      const sign = offsetMin > 0 ? '+' : '-';
      const absMin = Math.abs(offsetMin);
      const hours = Math.floor(absMin / 60);
      const mins = absMin % 60;
      return `UTC${sign}${hours}${mins > 0 ? `:${mins}` : ''}`;
    } catch {
      return 'UTC';
    }
  };

  // Dropdown / Popover states
  const [activeCard, setActiveCard] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<ClockCity[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  // Synchronize initial prop values to state
  /* eslint-disable react-hooks/set-state-in-effect */
  useEffect(() => {
    if (initialCity1) setCity1(initialCity1);
    if (initialZone1) setZone1(initialZone1);
  }, [initialCity1, initialZone1]);

  useEffect(() => {
    if (initialCity2) setCity2(initialCity2);
    if (initialZone2) setZone2(initialZone2);
  }, [initialCity2, initialZone2]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Load preferences on mount (homepage only)
  useEffect(() => {
    if (isConverterPage) return;
    if (typeof window !== 'undefined') {
      const savedCity1 = sessionStorage.getItem('wc_c1');
      const savedZone1 = sessionStorage.getItem('wc_z1');
      const savedCity2 = sessionStorage.getItem('wc_c2');
      const savedZone2 = sessionStorage.getItem('wc_z2');

      /* eslint-disable react-hooks/set-state-in-effect */
      if (savedCity1) setCity1(savedCity1);
      if (savedZone1) setZone1(savedZone1);
      if (savedCity2) setCity2(savedCity2);
      if (savedZone2) setZone2(savedZone2);
      /* eslint-enable react-hooks/set-state-in-effect */
    }
  }, [isConverterPage]);

  // Update time ticks (every 10 seconds since seconds are removed)
  useEffect(() => {
    const updateTime = () => {
      const now = DateTime.now();

      const dt1 = now.setZone(zone1);
      setTime1(dt1.toFormat('hh:mm a'));
      if (singleCityMode) {
        setDate1(dt1.toFormat('EEEE, LLLL d, yyyy'));
        setAbbr1(dt1.offsetNameShort || '');
        setOffset1(getOffsetLabel(zone1));
        setDstStatus1(dt1.isInDST ? 'Daylight Saving Time Active' : 'Standard Time (No DST Active)');
      } else {
        setDate1(dt1.toFormat('ccc, LLL dd'));
        setAbbr1(getOffsetLabel(zone1));
      }

      if (!singleCityMode) {
        const dt2 = now.setZone(zone2);
        setTime2(dt2.toFormat('hh:mm a'));
        setDate2(dt2.toFormat('ccc, LLL dd'));
        setAbbr2(getOffsetLabel(zone2));
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);

    return () => clearInterval(interval);
  }, [zone1, zone2, singleCityMode]);

  // Close popup listeners
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (activeCard === 1 && containerRef1.current && !containerRef1.current.contains(target)) {
        setActiveCard(null);
      }
      if (activeCard === 2 && containerRef2.current && !containerRef2.current.contains(target)) {
        setActiveCard(null);
      }
    };

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveCard(null);
    };

    if (activeCard) {
      document.addEventListener('mousedown', handleOutsideClick);
      document.addEventListener('keydown', handleEscape);
    }
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [activeCard]);

  // Suggestions search logic
  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const q = searchQuery.toLowerCase().trim();

    const fetchTimer = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=6&language=en&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.results) {
            const list = data.results.map((item: { name: string; admin1?: string; country?: string; timezone?: string }) => ({
              label: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`,
              timezone: item.timezone || 'UTC'
            }));

            setSuggestions(deduplicateSuggestions(list));
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          const fallbackMatches = ZONE_SEARCH_INDEX
            .filter(item => item.key.includes(q) || item.zone.toLowerCase().includes(q))
            .map(item => ({
              label: `${item.label} (${item.zone})`,
              timezone: item.zone
            }))
            .slice(0, 6);

          setSuggestions(deduplicateSuggestions(fallbackMatches));
          setIsLoading(false);
        });
    }, 250);

    return () => clearTimeout(fetchTimer);
  }, [searchQuery]);

  const toggleSearch = (cardIndex: 1 | 2) => {
    if (activeCard === cardIndex) {
      setActiveCard(null);
    } else {
      setActiveCard(cardIndex);
      setSearchQuery('');
    }
  };

  const handleSelectCity = (sug: ClockCity) => {
    const parts = sug.label.split(',').map(p => p.trim());
    const cityName = parts[0];

    if (activeCard === 1) {
      setCity1(cityName);
      setZone1(sug.timezone);
      if (!isConverterPage) {
        try {
          sessionStorage.setItem('wc_c1', cityName);
          sessionStorage.setItem('wc_z1', sug.timezone);
        } catch {}
      }
      if (onSelectionChange) {
        onSelectionChange(1, cityName, sug.timezone);
      }
    } else if (activeCard === 2) {
      setCity2(cityName);
      setZone2(sug.timezone);
      if (!isConverterPage) {
        try {
          sessionStorage.setItem('wc_c2', cityName);
          sessionStorage.setItem('wc_z2', sug.timezone);
        } catch {}
      }
      if (onSelectionChange) {
        onSelectionChange(2, cityName, sug.timezone);
      }
    }
    setActiveCard(null);
    setSearchQuery('');
  };

  // Compute live absolute hour/minute difference text
  const diffText = useMemo(() => {
    const dt1 = DateTime.now().setZone(zone1);
    const dt2 = DateTime.now().setZone(zone2);
    const diffHours = (dt2.offset - dt1.offset) / 60;
    if (diffHours === 0) return 'at the same time';
    const relation = diffHours > 0 ? 'ahead' : 'behind';
    const formatted = Math.abs(diffHours).toString().replace('.5', ':30');
    return `${formatted} hour${Math.abs(diffHours) === 1 ? '' : 's'} ${relation}`;
  }, [zone1, zone2]);

  if (singleCityMode) {
    return (
      <section className="w-full flex flex-col font-sans select-none mb-1">
        <div className="w-full bg-surf-1 border border-border-custom rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
          <div className="flex flex-col gap-1.5">
            <span className="text-2xl sm:text-3xl font-black text-txt-heading font-sans tracking-tight">
              {city1}
            </span>
            <span className="text-xs sm:text-sm font-semibold text-txt-secondary leading-relaxed">
              {date1 || '---'}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row items-baseline sm:items-center gap-4">
            <span className="text-4xl sm:text-5xl font-black tracking-tighter text-txt-heading font-mono tabular-nums leading-none">
              {time1 || '--:--'}
            </span>
            <div className="flex flex-wrap gap-2">
              <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-surf-2 text-txt-secondary border border-border-custom shadow-xs uppercase tracking-wide">
                {abbr1}
              </span>
              <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-surf-2 text-txt-secondary border border-border-custom shadow-xs uppercase tracking-wide">
                {offset1}
              </span>
              <span className={`text-[10px] font-bold py-1 px-2.5 rounded border shadow-xs uppercase tracking-wide ${
                dstStatus1.includes('Active') 
                  ? 'bg-success-surface text-success border-success'
                  : 'bg-surf-2 text-txt-secondary border-border-custom'
              }`}>
                {dstStatus1.includes('Active') ? 'DST Active' : 'DST Inactive'}
              </span>
              {initialCountry1 && (
                <span className="text-[10px] font-bold py-1 px-2.5 rounded bg-surf-2 text-txt-secondary border border-border-custom shadow-xs uppercase tracking-wide">
                  {initialCountry1}
                </span>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="w-full flex flex-col font-sans mb-1 select-none">
      
      {/* Title (homepage only) */}
      {!isConverterPage && (
        <h2 className="text-xs uppercase tracking-wider font-extrabold text-txt-muted flex items-center gap-1.5 mb-2.5">
          <ClockIcon />
          <span>World Clock</span>
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse ml-0.5" />
        </h2>
      )}

      {/* Grid Container */}
      <div className={`grid grid-cols-1 ${isConverterPage ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 w-full`}>
        
        {/* Card 1 */}
        <div ref={containerRef1} className="relative w-full">
          <div 
            onClick={() => toggleSearch(1)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSearch(1);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Change city for clock 1"
            className="w-full h-20 sm:h-22 bg-surf-1 border border-border-custom shadow-card rounded-2xl px-5 flex items-center justify-between hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-accent/35 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 mr-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-txt-heading truncate font-sans">
                  {city1.split(',')[0]}
                </span>
                <span className="shrink-0">
                  <EditIcon />
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-txt-muted uppercase tracking-wider">
                {date1 || '---'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-txt-heading font-mono tabular-nums leading-none">
                {time1 || '--:--'}
              </span>
              <span className="w-20 inline-block text-center text-[9px] font-bold font-mono py-0.5 rounded bg-surf-2 text-txt-secondary select-none uppercase tracking-wide border border-border-custom shadow-xs">
                {abbr1}
              </span>
            </div>
          </div>

          {activeCard === 1 && (
            <div className="absolute top-[105%] left-0 right-0 bg-surf-1 border border-border-custom rounded-2xl p-4 shadow-xl z-[9999] flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search city..."
                  aria-label="Search city name for clock 1"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-border-custom bg-surf-2 rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 text-txt-primary placeholder:text-txt-subtle"
                  autoFocus
                />
                <span className="absolute left-2.5">
                  <SearchIcon />
                </span>
                {isLoading && (
                  <div className="absolute right-2.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-200 border-t-brand-accent" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {searchQuery && !isLoading && suggestions.length === 0 ? (
                  <p className="text-center text-[11px] text-txt-muted py-3">No matching cities found</p>
                ) : (
                  suggestions.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleSelectCity(sug)}
                      className="w-full text-left px-3 py-2.5 hover:bg-surf-2 transition-colors flex justify-between items-center rounded-lg group cursor-pointer border border-transparent hover:border-border-custom"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[75%]">
                        <span className="font-bold text-xs text-txt-primary truncate group-hover:text-brand-accent-hover transition-colors">{sug.label}</span>
                        <span className="text-[9px] text-txt-muted truncate">{sug.timezone}</span>
                      </div>
                      <span className="text-[9px] font-bold text-txt-secondary border border-border-custom bg-surf-2 px-2 py-0.5 rounded uppercase">
                        Select
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card 2 */}
        <div ref={containerRef2} className="relative w-full">
          <div 
            onClick={() => toggleSearch(2)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                toggleSearch(2);
              }
            }}
            role="button"
            tabIndex={0}
            aria-label="Change city for clock 2"
            className="w-full h-20 sm:h-22 bg-surf-1 border border-border-custom shadow-card rounded-2xl px-5 flex items-center justify-between hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-accent/35 transition-all duration-200 cursor-pointer group"
          >
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 mr-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-sm sm:text-base tracking-tight text-txt-heading truncate font-sans">
                  {city2.split(',')[0]}
                </span>
                <span className="shrink-0">
                  <EditIcon />
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-txt-muted uppercase tracking-wider">
                {date2 || '---'}
              </span>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-txt-heading font-mono tabular-nums leading-none">
                {time2 || '--:--'}
              </span>
              <span className="w-20 inline-block text-center text-[9px] font-bold font-mono py-0.5 rounded bg-surf-2 text-txt-secondary select-none uppercase tracking-wide border border-border-custom shadow-xs">
                {abbr2}
              </span>
            </div>
          </div>

          {activeCard === 2 && (
            <div className="absolute top-[105%] left-0 right-0 bg-surf-1 border border-border-custom rounded-2xl p-4 shadow-xl z-[9999] flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search city..."
                  aria-label="Search city name for clock 2"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-border-custom bg-surf-2 rounded-xl text-xs focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 text-txt-primary placeholder:text-txt-subtle"
                  autoFocus
                />
                <span className="absolute left-2.5">
                  <SearchIcon />
                </span>
                {isLoading && (
                  <div className="absolute right-2.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-200 border-t-brand-accent" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {searchQuery && !isLoading && suggestions.length === 0 ? (
                  <p className="text-center text-[11px] text-txt-muted py-3">No matching cities found</p>
                ) : (
                  suggestions.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleSelectCity(sug)}
                      className="w-full text-left px-3 py-2.5 hover:bg-surf-2 transition-colors flex justify-between items-center rounded-lg group cursor-pointer border border-transparent hover:border-border-custom"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[75%]">
                        <span className="font-bold text-xs text-txt-primary truncate group-hover:text-brand-accent-hover transition-colors">{sug.label}</span>
                        <span className="text-[9px] text-txt-muted truncate">{sug.timezone}</span>
                      </div>
                      <span className="text-[9px] font-bold text-txt-secondary border border-border-custom bg-surf-2 px-2 py-0.5 rounded uppercase">
                        Select
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* Card 3: Time Difference Summary (converter page only) */}
        {isConverterPage && (
          <div className="p-5 rounded-2xl flex flex-col justify-center gap-3 border border-border-custom bg-surf-1 shadow-card hover:border-brand-accent transition-all duration-200 md:col-span-1">
            <span className="text-[10px] font-mono tracking-widest text-brand-accent uppercase font-extrabold block">
              Time Difference
            </span>
            <p className="text-sm sm:text-base font-bold text-txt-primary leading-snug">
              {city2.split(',')[0]} is currently <span className="text-brand-accent font-extrabold">{diffText}</span> compared to {city1.split(',')[0]}.
            </p>
          </div>
        )}

      </div>
    </section>
  );
}
