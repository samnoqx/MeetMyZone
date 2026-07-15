'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { ZONE_SEARCH_INDEX } from '@/utils/timezone';

interface ClockState {
  city: string;
  country: string;
  timezone: string;
}

const COUNTRY_CODES: Record<string, string> = {
  'United Kingdom': 'GB', 'United States': 'US', 'Japan': 'JP', 'Australia': 'AU',
  'India': 'IN', 'France': 'FR', 'Germany': 'DE', 'Canada': 'CA', 'China': 'CN',
  'Brazil': 'BR', 'South Korea': 'KR', 'Italy': 'IT', 'Spain': 'ES', 'Mexico': 'MX',
  'Russia': 'RU', 'Netherlands': 'NL', 'Turkey': 'TR', 'Switzerland': 'CH',
  'Sweden': 'SE', 'Norway': 'NO', 'Denmark': 'DK', 'Finland': 'FI', 'Poland': 'PL',
  'Belgium': 'BE', 'Austria': 'AT', 'Portugal': 'PT', 'Ireland': 'IE', 'Greece': 'GR',
  'New Zealand': 'NZ', 'Singapore': 'SG', 'Malaysia': 'MY', 'Thailand': 'TH',
  'Indonesia': 'ID', 'Philippines': 'PH', 'Vietnam': 'VN', 'Pakistan': 'PK',
  'Bangladesh': 'BD', 'Egypt': 'EG', 'South Africa': 'ZA', 'Nigeria': 'NG',
  'Kenya': 'KE', 'Argentina': 'AR', 'Chile': 'CL', 'Colombia': 'CO', 'Peru': 'PE',
  'Saudi Arabia': 'SA', 'United Arab Emirates': 'AE', 'Israel': 'IL', 'Qatar': 'QA',
  'Kuwait': 'KW', 'Czech Republic': 'CZ', 'Czechia': 'CZ', 'Romania': 'RO',
  'Hungary': 'HU', 'Ukraine': 'UA', 'Taiwan': 'TW', 'Hong Kong': 'HK',
  'Iceland': 'IS', 'Croatia': 'HR', 'Serbia': 'RS', 'Bulgaria': 'BG',
  'Sri Lanka': 'LK', 'Nepal': 'NP', 'Morocco': 'MA', 'Ghana': 'GH',
  'Ethiopia': 'ET', 'Tanzania': 'TZ', 'Jamaica': 'JM', 'Cuba': 'CU',
};

function getCountryCode(country: string): string {
  if (!country) return 'un';
  if (COUNTRY_CODES[country]) return COUNTRY_CODES[country].toLowerCase();
  const parts = country.split(',').map(p => p.trim());
  for (let i = parts.length - 1; i >= 0; i--) {
    if (COUNTRY_CODES[parts[i]]) return COUNTRY_CODES[parts[i]].toLowerCase();
  }
  return 'un';
}

const TZ_TO_LOCATION: Record<string, { city: string; country: string }> = {
  'Europe/London': { city: 'London', country: 'United Kingdom' },
  'America/New_York': { city: 'New York', country: 'United States' },
  'Asia/Tokyo': { city: 'Tokyo', country: 'Japan' },
  'Australia/Sydney': { city: 'Sydney', country: 'Australia' },
  'Asia/Kolkata': { city: 'Mumbai', country: 'India' },
  'Europe/Paris': { city: 'Paris', country: 'France' },
  'Asia/Singapore': { city: 'Singapore', country: 'Singapore' },
  'Europe/Berlin': { city: 'Berlin', country: 'Germany' },
  'Asia/Seoul': { city: 'Seoul', country: 'South Korea' },
  'America/Los_Angeles': { city: 'San Francisco', country: 'United States' },
  'America/Chicago': { city: 'Chicago', country: 'United States' },
  'America/Denver': { city: 'Denver', country: 'United States' },
  'America/Phoenix': { city: 'Phoenix', country: 'United States' },
  'Europe/Rome': { city: 'Rome', country: 'Italy' },
  'Europe/Madrid': { city: 'Madrid', country: 'Spain' },
  'Asia/Dubai': { city: 'Dubai', country: 'United Arab Emirates' },
  'Asia/Hong_Kong': { city: 'Hong Kong', country: 'Hong Kong' },
  'America/Toronto': { city: 'Toronto', country: 'Canada' },
  'America/Vancouver': { city: 'Vancouver', country: 'Canada' },
  'Europe/Brussels': { city: 'Brussels', country: 'Belgium' },
  'Europe/Amsterdam': { city: 'Amsterdam', country: 'Netherlands' },
  'Europe/Zurich': { city: 'Zurich', country: 'Switzerland' },
  'Europe/Stockholm': { city: 'Stockholm', country: 'Sweden' },
  'Europe/Oslo': { city: 'Oslo', country: 'Norway' },
  'Europe/Copenhagen': { city: 'Copenhagen', country: 'Denmark' },
  'Europe/Dublin': { city: 'Dublin', country: 'Ireland' },
  'Europe/Vienna': { city: 'Vienna', country: 'Austria' },
  'Europe/Lisbon': { city: 'Lisbon', country: 'Portugal' },
  'Europe/Athens': { city: 'Athens', country: 'Greece' },
  'Asia/Shanghai': { city: 'Shanghai', country: 'China' },
  'Asia/Taipei': { city: 'Taipei', country: 'Taiwan' },
  'Asia/Bangkok': { city: 'Bangkok', country: 'Thailand' },
  'Asia/Jakarta': { city: 'Jakarta', country: 'Indonesia' },
  'Asia/Manila': { city: 'Manila', country: 'Philippines' },
  'Asia/Kuala_Lumpur': { city: 'Kuala Lumpur', country: 'Malaysia' },
  'America/Mexico_City': { city: 'Mexico City', country: 'Mexico' },
  'America/Sao_Paulo': { city: 'Sao Paulo', country: 'Brazil' },
  'America/Argentina/Buenos_Aires': { city: 'Buenos Aires', country: 'Argentina' },
  'Africa/Johannesburg': { city: 'Johannesburg', country: 'South Africa' },
  'Africa/Cairo': { city: 'Cairo', country: 'Egypt' },
  'Europe/Istanbul': { city: 'Istanbul', country: 'Turkey' },
  'Asia/Jerusalem': { city: 'Tel Aviv', country: 'Israel' },
  'Pacific/Auckland': { city: 'Auckland', country: 'New Zealand' },
  'Asia/Calcutta': { city: 'Kolkata', country: 'India' },
};

function parseTimezone(tz: string): { city: string; country: string } {
  if (TZ_TO_LOCATION[tz]) return TZ_TO_LOCATION[tz];
  const parts = tz.split('/');
  const rawCity = parts[parts.length - 1] || 'London';
  const city = rawCity.replace(/_/g, ' ');
  const continent = parts[0] || '';
  return { city, country: continent };
}

function findLongestCircularRun(flags: boolean[]) {
  let maxLen = 0;
  let maxStart = -1;
  let maxEnd = -1;

  const doubleFlags = [...flags, ...flags];
  
  let currentStart = -1;
  let currentLen = 0;

  for (let i = 0; i < doubleFlags.length; i++) {
    if (doubleFlags[i]) {
      if (currentStart === -1) currentStart = i;
      currentLen++;
      if (currentLen > maxLen) {
        maxLen = currentLen;
        maxStart = currentStart % 24;
        maxEnd = (currentStart + currentLen) % 24;
      }
    } else {
      currentStart = -1;
      currentLen = 0;
    }
  }

  if (maxLen > 24) {
    maxLen = 24;
    maxEnd = maxStart;
  }

  return { start: maxStart, end: maxEnd, len: maxLen };
}

export default function HomeMeetingOverlap() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);
  const [is24Hour, setIs24Hour] = useState(false);
  
  const [clock1, setClock1] = useState<ClockState>({
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London'
  });

  const [clock2, setClock2] = useState<ClockState>({
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York'
  });

  const [clock3, setClock3] = useState<ClockState>({
    city: 'Toronto',
    country: 'Canada',
    timezone: 'America/Toronto'
  });

  const [activeSearchIndex, setActiveSearchIndex] = useState<1 | 2 | 3 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ label: string; timezone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);
  const containerRef3 = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const closeDropdown = useCallback(() => {
    setActiveSearchIndex(null);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
      setCurrentTime(DateTime.now());
      
    });

    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 15000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeSearchIndex === null) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const activeRef =
        activeSearchIndex === 1
          ? containerRef1
          : activeSearchIndex === 2
          ? containerRef2
          : containerRef3;
      if (activeRef.current && !activeRef.current.contains(e.target as Node)) {
        closeDropdown();
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeDropdown();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeSearchIndex, closeDropdown]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    setIsLoading(true);
    const q = searchQuery.toLowerCase().trim();

    const fetchTimer = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=5&language=en&format=json`)
        .then(res => res.json())
        .then(data => {
          if (data && data.results) {
            const list = data.results.map((item: { name: string; admin1?: string; country?: string; timezone?: string }) => ({
              label: `${item.name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`,
              timezone: item.timezone || 'UTC'
            }));
            setSuggestions(list);
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          const matches = ZONE_SEARCH_INDEX
            .filter(item => item.key.includes(q) || item.zone.toLowerCase().includes(q))
            .map(item => ({
              label: `${item.label} (${item.zone})`,
              timezone: item.zone
            }))
            .slice(0, 5);
          setSuggestions(matches);
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(fetchTimer);
  }, [searchQuery]);

  const handleSelectLocation = (sug: { label: string; timezone: string }) => {
    const parts = sug.label.split(',').map(p => p.trim());
    const cityName = parts[0];
    const countryName = parts.slice(1).join(', ') || sug.timezone;

    const updatedState = { city: cityName, country: countryName, timezone: sug.timezone };
    if (activeSearchIndex === 1) {
      setClock1(updatedState);
    } else if (activeSearchIndex === 2) {
      setClock2(updatedState);
    } else if (activeSearchIndex === 3) {
      setClock3(updatedState);
    }

    setActiveSearchIndex(null);
    setSearchQuery('');
  };


  // Retrieve user selected working hours or default to 9 AM - 5 PM
  let workStart = 9;
  let workEnd = 17;
  try {
    const savedStateStr = sessionStorage.getItem('mmz_planner_state');
    if (savedStateStr) {
      const saved = JSON.parse(savedStateStr);
      if (typeof saved.workHourStart === 'number' && typeof saved.workHourEnd === 'number') {
        workStart = saved.workHourStart;
        workEnd = saved.workHourEnd;
      }
    }
  } catch {}

  const isWorkingLocalHour = (hour: number) => {
    return hour >= workStart && hour < workEnd;
  };

  const getOffsetString = (timezone: string) => {
    try {
      const dt = (currentTime || DateTime.now()).setZone(timezone);
      return dt.toFormat('ZZZZ') + ' ' + dt.toFormat('ZZ');
    } catch {
      return 'UTC+0';
    }
  };

  const formatTime = (utcHour: number, timezone: string) => {
    const dt = (currentTime || DateTime.now()).setZone('UTC').set({ hour: utcHour, minute: 0, second: 0 }).setZone(timezone);
    return dt.toFormat(is24Hour ? 'HH:00' : 'h:mm a');
  };

  // Find overall recommended window across the full 24-hour day
  const findRecommendedWindow = () => {
    const todayUtc = (currentTime || DateTime.now()).setZone('UTC').startOf('day');
    
    // 1. Try 3-way overlap first
    const flags3 = Array.from({ length: 24 }).map((_, h) => {
      const dt = todayUtc.set({ hour: h });
      const c1H = dt.setZone(clock1.timezone).hour;
      const c2H = dt.setZone(clock2.timezone).hour;
      const c3H = dt.setZone(clock3.timezone).hour;
      return isWorkingLocalHour(c1H) && isWorkingLocalHour(c2H) && isWorkingLocalHour(c3H);
    });

    const run3 = findLongestCircularRun(flags3);
    if (run3.len > 0) {
      return {
        type: '3-way' as const,
        startUtc: run3.start,
        endUtc: run3.end,
        len: run3.len,
        clocks: [clock1, clock2, clock3]
      };
    }
    
    // 2. Try best 2-way overlap if no 3-way overlap is available
    const pairs = [
      { clockA: clock1, clockB: clock2 },
      { clockA: clock1, clockB: clock3 },
      { clockA: clock2, clockB: clock3 }
    ];
    
    let bestRun = { start: -1, end: -1, len: 0 };
    let bestPairIdx = -1;
    
    for (let p = 0; p < pairs.length; p++) {
      const flags2 = Array.from({ length: 24 }).map((_, h) => {
        const dt = todayUtc.set({ hour: h });
        const h1 = dt.setZone(pairs[p].clockA.timezone).hour;
        const h2 = dt.setZone(pairs[p].clockB.timezone).hour;
        return isWorkingLocalHour(h1) && isWorkingLocalHour(h2);
      });
      
      const run2 = findLongestCircularRun(flags2);
      if (run2.len > bestRun.len) {
        bestRun = run2;
        bestPairIdx = p;
      }
    }
    
    if (bestRun.len > 0 && bestPairIdx !== -1) {
      const activePair = pairs[bestPairIdx];
      return {
        type: '2-way' as const,
        startUtc: bestRun.start,
        endUtc: bestRun.end,
        len: bestRun.len,
        clocks: [activePair.clockA, activePair.clockB]
      };
    }
    
    // 3. Fallback: Show clock1's standard working window if there is absolutely no overlap
    const startOfToday = (currentTime || DateTime.now()).setZone(clock1.timezone).startOf('day');
    const startUtc = startOfToday.set({ hour: workStart }).setZone('UTC').hour;
    const endUtc = startOfToday.set({ hour: workEnd }).setZone('UTC').hour;
    return {
      type: 'none' as const,
      startUtc,
      endUtc,
      len: workEnd - workStart,
      clocks: [clock1]
    };
  };

  const recommendation = findRecommendedWindow();
  const isUtcHourInOverlap = (h: number) => {
    if (recommendation.len === 0) return false;
    const start = recommendation.startUtc;
    const len = recommendation.len;
    for (let offset = 0; offset < len; offset++) {
      if ((start + offset) % 24 === h) {
        return true;
      }
    }
    return false;
  };
  const currentUtcHour = currentTime ? currentTime.setZone('UTC').hour : 12;

  useEffect(() => {
    if (!mounted || !scrollContainerRef.current) return;
    
    const timer = setTimeout(() => {
      const container = scrollContainerRef.current;
      if (!container) return;
      
      const scrollWidth = container.scrollWidth;
      const clientWidth = container.clientWidth;
      if (scrollWidth <= clientWidth) return;
      
      const stickyCell = container.querySelector('.sticky');
      const stickyWidth = stickyCell ? stickyCell.getBoundingClientRect().width : 160;
      
      const gridWidth = scrollWidth - stickyWidth;
      const colWidth = gridWidth / 24;
      
      const start = recommendation.startUtc;
      const len = recommendation.len;
      let centerHour = start + len / 2;
      if (centerHour >= 24) centerHour -= 24;
      
      const targetCenter = stickyWidth + centerHour * colWidth;
      const targetScrollLeft = targetCenter - clientWidth / 2;
      
      container.scrollTo({
        left: Math.max(0, Math.min(targetScrollLeft, scrollWidth - clientWidth)),
        behavior: 'smooth'
      });
    }, 100);
    
    return () => clearTimeout(timer);
  }, [mounted, recommendation.startUtc, recommendation.len]);

  const getHeaderHourLabel = (utcHour: number) => {
    if (is24Hour) {
      return `${String(utcHour).padStart(2, '0')}:00`;
    }
    const period = utcHour >= 12 ? 'PM' : 'AM';
    const displayHour = utcHour % 12 === 0 ? 12 : utcHour % 12;
    return `${displayHour} ${period}`;
  };

  const getRecommendationText = () => {
    const allClocks = [clock1, clock2, clock3];
    if (recommendation.len === 0) {
      return 'No overlapping working hours found';
    }
    return allClocks.map(clk => {
      const startStr = formatTime(recommendation.startUtc, clk.timezone);
      const endStr = formatTime(recommendation.endUtc, clk.timezone);
      return `${clk.city}: ${startStr} – ${endStr}`;
    }).join(' / ');
  };

  const renderLocationRow = (index: 1 | 2 | 3, clock: ClockState) => {
    const containerRef = index === 1 ? containerRef1 : index === 2 ? containerRef2 : containerRef3;
    const offsetStr = getOffsetString(clock.timezone);
    
    return (
      <div className="flex items-stretch hover:bg-surf-2/50 transition-colors">
        
        {/* Sticky Left Selector Header */}
        <div className={`w-40 min-w-[10rem] sm:w-52 sm:min-w-[13rem] p-3 sm:p-4 sticky left-0 bg-surf-1 border-r border-border-custom flex flex-col justify-center gap-1.5 ${
          activeSearchIndex === index ? 'z-40' : 'z-20'
        }`} ref={containerRef}>
          <button
            onClick={() => {
              setActiveSearchIndex(activeSearchIndex === index ? null : index);
              setSearchQuery('');
            }}
            className="w-full text-left py-1.5 px-2.5 rounded-xl border border-border-custom bg-surf-2 hover:bg-surf-3 hover:border-brand-accent transition-all font-bold text-txt-primary text-xs flex items-center justify-between cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <span className="truncate flex items-center gap-1">
              <img
                src={`https://flagcdn.com/16x12/${getCountryCode(clock.country)}.png`}
                srcSet={`https://flagcdn.com/32x24/${getCountryCode(clock.country)}.png 2x`}
                width="16"
                height="12"
                alt={`${clock.country} flag`}
                className="inline-block rounded-[1px] shadow-sm shrink-0"
              />
              <span className="truncate">{clock.city}</span>
            </span>
            <svg className="w-3.5 h-3.5 text-brand-accent-hover shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {activeSearchIndex === index ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 15l-7-7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>
          
          <div className="text-[8px] sm:text-[9px] font-mono font-bold text-txt-subtle px-1 truncate leading-none">
            {clock.country} ({offsetStr})
          </div>

          {/* Autocomplete suggestions dropdown */}
          {activeSearchIndex === index && (
            <div className={`absolute left-0 rounded-xl bg-surf-1 border border-border-custom shadow-xl p-3 z-50 animate-in fade-in duration-150 text-left w-64 ${
              index === 1 ? 'top-1 mt-0' : index === 2 ? 'top-1/2 -translate-y-1/2' : 'bottom-1 top-auto'
            }`}>
              <div className="relative mb-2">
                <input
                  type="text"
                  placeholder="Search city name..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 border border-border-custom bg-surf-2 text-txt-primary rounded-lg text-xs focus:outline-none focus:border-brand-accent"
                  autoFocus
                />
                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-txt-muted">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>
              
              <div className="overflow-y-auto max-h-[100px] flex flex-col gap-0.5 pr-1 scrollbar-none">
                {isLoading ? (
                  <span className="text-xs text-txt-muted p-2 animate-pulse">Searching...</span>
                ) : suggestions.length === 0 && searchQuery.trim() ? (
                  <span className="text-xs text-txt-muted p-2">No matches</span>
                ) : suggestions.length === 0 ? (
                  <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                    {['London', 'New York', 'Tokyo', 'Sydney', 'Mumbai', 'Paris'].map(city => {
                      let country = '';
                      if (city === 'London') country = 'United Kingdom';
                      else if (city === 'New York') country = 'United States';
                      else if (city === 'Tokyo') country = 'Japan';
                      else if (city === 'Sydney') country = 'Australia';
                      else if (city === 'Mumbai') country = 'India';
                      else if (city === 'Paris') country = 'France';
                      return (
                        <button
                          key={city}
                          onClick={() => {
                            let zone = 'UTC';
                            if (city === 'London') zone = 'Europe/London';
                            else if (city === 'New York') zone = 'America/New_York';
                            else if (city === 'Tokyo') zone = 'Asia/Tokyo';
                            else if (city === 'Sydney') zone = 'Australia/Sydney';
                            else if (city === 'Mumbai') zone = 'Asia/Kolkata';
                            else if (city === 'Paris') zone = 'Europe/Paris';
                            handleSelectLocation({ label: `${city}, ${country}`, timezone: zone });
                          }}
                          className="text-left text-xs font-bold text-txt-primary hover:text-brand-accent-hover hover:bg-surf-2 px-2 py-1.5 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5"
                        >
                          <img
                            src={`https://flagcdn.com/16x12/${getCountryCode(country)}.png`}
                            srcSet={`https://flagcdn.com/32x24/${getCountryCode(country)}.png 2x`}
                            width="16"
                            height="12"
                            alt={`${country} flag`}
                            className="inline-block rounded-[1px] shadow-sm shrink-0"
                          />
                          <span>{city}</span>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  suggestions.map((sug, idx) => {
                    const parts = sug.label.split(',').map(p => p.trim());
                    const country = parts[parts.length - 1] || '';
                    return (
                      <button
                        key={idx}
                        onClick={() => handleSelectLocation(sug)}
                        className="text-left text-xs font-bold text-txt-primary hover:text-brand-accent-hover hover:bg-surf-2 p-2 rounded-lg transition-all cursor-pointer truncate flex items-center gap-1.5 w-full"
                      >
                        <img
                          src={`https://flagcdn.com/16x12/${getCountryCode(country)}.png`}
                          srcSet={`https://flagcdn.com/32x24/${getCountryCode(country)}.png 2x`}
                          width="16"
                          height="12"
                          alt={`${country} flag`}
                          className="inline-block rounded-[1px] shadow-sm shrink-0"
                        />
                        <span className="truncate">{sug.label}</span>
                      </button>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* 24-Hour timeline grid row */}
        <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
          {Array.from({ length: 24 }).map((_, h) => {
            const isHighlighted = isUtcHourInOverlap(h);
            const baseDate = (currentTime || DateTime.now()).setZone('UTC').set({ hour: h, minute: 0, second: 0, millisecond: 0 });
            const dtLocal = baseDate.setZone(clock.timezone);
            const localHour = dtLocal.hour;
            
            const isDay = isWorkingLocalHour(localHour);

            return (
              <div
                key={`cell-${clock.city}-${h}`}
                className={`h-14 sm:h-16 flex flex-col items-center justify-center border-r border-border-custom relative transition-all duration-200 ${
                  isDay
                    ? 'bg-surf-1 text-txt-primary hover:scale-[1.02] hover:z-10 hover:shadow-xs'
                    : 'bg-surf-3 text-txt-secondary hover:bg-surf-3/80 font-semibold'
                }`}
                style={isHighlighted ? {
                  backgroundColor: 'color-mix(in srgb, var(--brand-accent) 12%, transparent)',
                } : undefined}
              >
                <span className={`text-[10px] font-mono font-bold leading-none ${isHighlighted ? 'text-brand-accent-hover font-black' : isDay ? 'text-txt-primary' : 'text-txt-secondary'}`}>
                  {is24Hour ? dtLocal.toFormat('HH:00') : dtLocal.toFormat('h')}
                </span>
                {!is24Hour && (
                  <span className={`text-[7px] font-bold uppercase tracking-wider mt-0.5 leading-none ${isHighlighted ? 'text-brand-accent-hover font-black' : isDay ? 'text-txt-secondary' : 'text-txt-muted'}`}>
                    {dtLocal.toFormat('a')}
                  </span>
                )}
              </div>
            );
          })}
        </div>

      </div>
    );
  };

  if (!mounted) return null;

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          Find Working Hours That Actually Overlap
        </h2>
        <p className="text-xs sm:text-sm text-txt-secondary leading-normal font-bold">
          See when teams, clients, and colleagues are available at the same time.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-surf-1 border border-border-custom rounded-2xl p-6 shadow-card flex flex-col gap-6 mt-2 relative overflow-hidden">
        
        {/* 24-Hour Timeline Grid Container */}
        <div className="w-full bg-surf-1 border border-border-custom rounded-xl overflow-hidden shadow-card">
          <div
            ref={scrollContainerRef}
            className="overflow-x-auto scrollbar-thin scrollbar-thumb-slate-350 dark:scrollbar-thumb-slate-700 scrollbar-track-slate-100 dark:scrollbar-track-slate-900"
          >
            <div className="min-w-[750px] sm:min-w-[1200px] select-none">
              
              {/* Header Row */}
              <div className="flex border-b border-border-custom bg-surf-2">
                {/* Sticky Left Header Cell */}
                <div className="w-40 min-w-[10rem] sm:w-52 sm:min-w-[13rem] p-3 sm:p-4 sticky left-0 z-30 bg-surf-2 border-r border-border-custom flex items-center justify-between">
                  <span className="text-[10px] sm:text-xs font-black tracking-wider text-txt-muted uppercase">
                    Locations
                  </span>
                  
                  {/* Segmented Format Toggler Button */}
                  <button
                    onClick={() => setIs24Hour(!is24Hour)}
                    className="text-[8px] sm:text-[9px] text-txt-primary hover:text-brand-accent-hover bg-surf-1 hover:bg-surf-3 border border-border-custom px-2 py-0.5 rounded-full font-bold transition-all cursor-pointer select-none flex items-center gap-1 focus:outline-none"
                  >
                    <span className={!is24Hour ? 'text-brand-accent-hover font-black' : 'text-txt-muted font-bold'}>12H</span>
                    <span className="text-txt-muted">/</span>
                    <span className={is24Hour ? 'text-brand-accent-hover font-black' : 'text-txt-muted font-bold'}>24H</span>
                  </button>
                </div>

                {/* Timeline Hours Header */}
                <div className="flex-1 grid grid-cols-[repeat(24,minmax(42px,1fr))]">
                  {Array.from({ length: 24 }).map((_, h) => {
                    const isHighlighted = isUtcHourInOverlap(h);
                    return (
                      <div
                        key={`header-utc-${h}`}
                        className={`py-2 sm:py-3 flex flex-col items-center justify-center border-r border-border-custom/50 relative`}
                        style={isHighlighted ? {
                          backgroundColor: 'color-mix(in srgb, var(--brand-accent) 12%, transparent)',
                        } : undefined}
                      >
                        <span className={`text-[9px] sm:text-[10px] tracking-wide font-mono ${isHighlighted ? 'text-brand-accent-hover font-black' : 'text-txt-muted'}`}>
                          {getHeaderHourLabel(h)}
                        </span>
                        <span className={`text-[7px] sm:text-[8px] mt-0.5 ${isHighlighted ? 'text-brand-accent-hover font-extrabold' : 'text-txt-muted'}`}>
                          UTC
                        </span>
                        {isHighlighted && <div className="absolute top-0 left-0 right-0 h-[2.5px] bg-brand-accent rounded-b" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* City Rows */}
              <div>
                {renderLocationRow(1, clock1)}
                {renderLocationRow(2, clock2)}
                {renderLocationRow(3, clock3)}
              </div>

            </div>
          </div>
        </div>

        {/* Suggestion & Link banner */}
        <div className="flex flex-col sm:flex-row items-start justify-between gap-4 border-t border-border-custom pt-5 mt-1">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-10 h-10 rounded-full bg-brand-accent flex items-center justify-center border border-slate-950/5 shrink-0">
              <svg className="w-5 h-5 text-slate-950" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <span className="text-[10px] font-mono font-black text-txt-heading uppercase tracking-widest leading-none">RECOMMENDED OVERLAP WINDOW</span>
              <span className="text-xs sm:text-sm font-black text-txt-primary">
                {getRecommendationText()}
              </span>
            </div>
          </div>

          <Link
            href="/meeting-planner"
            className="w-full sm:w-auto px-5 py-2.5 text-center rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all border border-slate-950/5 shrink-0"
          >
            Open Meeting Planner
          </Link>
        </div>

      </div>

    </section>
  );
}
