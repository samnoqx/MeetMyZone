'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { DateTime } from 'luxon';
import Link from 'next/link';
import { ZONE_SEARCH_INDEX } from '@/utils/timezone';

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
  // Direct lookup
  if (COUNTRY_CODES[country]) return COUNTRY_CODES[country].toLowerCase();
  // Try matching parts
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
  'Asia/Calcutta': { city: 'Kolkata', country: 'India' },
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
};

function parseTimezone(tz: string): { city: string; country: string } {
  if (TZ_TO_LOCATION[tz]) return TZ_TO_LOCATION[tz];
  const parts = tz.split('/');
  const rawCity = parts[parts.length - 1] || 'London';
  const city = rawCity.replace(/_/g, ' ');
  const continent = parts[0] || '';
  return { city, country: continent };
}

interface ClockState {
  city: string;
  country: string;
  timezone: string;
}

export default function HomeWorldTime() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);

  const [clock1, setClock1] = useState<ClockState>({
    city: 'Tokyo',
    country: 'Japan',
    timezone: 'Asia/Tokyo'
  });

  const [clock2, setClock2] = useState<ClockState>({
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London'
  });

  const [activeSearchIndex, setActiveSearchIndex] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ label: string; timezone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const containerRef1 = useRef<HTMLDivElement>(null);
  const containerRef2 = useRef<HTMLDivElement>(null);

  // Close active dropdown
  const closeDropdown = useCallback(() => {
    setActiveSearchIndex(null);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
      setCurrentTime(DateTime.now());
      
      // Default clock1 to user's location on page load
      try {
        const userTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        if (userTz) {
          const parsed = parseTimezone(userTz);
          setClock1({
            city: parsed.city,
            country: parsed.country,
            timezone: userTz
          });
        }
      } catch {}
    });
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    if (activeSearchIndex === null) return;

    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      const activeRef = activeSearchIndex === 1 ? containerRef1 : containerRef2;
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

    if (activeSearchIndex === 1) {
      setClock1({ city: cityName, country: countryName, timezone: sug.timezone });
    } else if (activeSearchIndex === 2) {
      setClock2({ city: cityName, country: countryName, timezone: sug.timezone });
    }

    setActiveSearchIndex(null);
    setSearchQuery('');
  };

  const getComparisonHref = () => {
    const c1 = clock1.city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    const c2 = clock2.city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
    return `/convert/${c1}-to-${c2}`;
  };

  const getDifferenceValues = () => {
    if (!currentTime) return { diffStr: '', relationStr: '' };
    const dt1 = currentTime.setZone(clock1.timezone);
    const dt2 = currentTime.setZone(clock2.timezone);
    const offset1 = dt1.offset; 
    const offset2 = dt2.offset; 
    const diffMinutes = offset1 - offset2;
    const diffHours = Math.abs(diffMinutes / 60);

    if (diffMinutes === 0) {
      return { diffStr: 'Same time', relationStr: `${clock1.city} is at the same time as ${clock2.city}` };
    }

    const sign = diffMinutes > 0 ? '+' : '-';
    const hoursPart = Math.floor(diffHours);
    const minutesPart = Math.round((diffHours - hoursPart) * 60);
    const formattedDiff = `${sign}${hoursPart}h${minutesPart > 0 ? ` ${minutesPart}m` : ''}`;

    const order = diffMinutes > 0 ? 'ahead of' : 'behind';
    return {
      diffStr: formattedDiff,
      relationStr: `${clock1.city} is ${diffHours} hour${diffHours === 1 ? '' : 's'} ${order} ${clock2.city}`
    };
  };

  const renderLocationField = (index: 1 | 2, state: ClockState) => {
    const dt = currentTime ? currentTime.setZone(state.timezone) : null;
    const timeStr = dt ? dt.toFormat('hh:mm') : '--:--';
    const ampmStr = dt ? dt.toFormat('a') : 'AM';
    const dateStr = dt ? dt.toFormat('EEEE, MMMM dd') : '----, -------- --';
    const zoneAbbr = dt ? dt.toFormat('ZZZZ') : '---';
    const offsetStr = dt ? dt.toFormat('ZZ') : 'UTC+00:00';
    const isDST = dt ? dt.isInDST : false;

    return (
      <div className="flex-1 flex flex-col gap-3 relative w-full items-center justify-center text-center">
        {/* Input Selector Dropdown Trigger */}
        <div className="relative w-full" ref={index === 1 ? containerRef1 : containerRef2}>
          <button
            onClick={() => {
              setActiveSearchIndex(activeSearchIndex === index ? null : index);
              setSearchQuery('');
            }}
            className="w-full text-center p-3.5 rounded-xl border border-border-custom bg-surf-2 hover:bg-surf-3 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200 font-bold text-txt-primary text-sm flex items-center justify-center gap-2 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent"
          >
            <span className="truncate flex items-center gap-1.5 justify-center">
              <img
                src={`https://flagcdn.com/24x18/${getCountryCode(state.country)}.png`}
                srcSet={`https://flagcdn.com/48x36/${getCountryCode(state.country)}.png 2x`}
                width="24"
                height="18"
                alt={`${state.country} flag`}
                className="inline-block rounded-[2px] shadow-sm shrink-0"
              />
              <span className="truncate">{state.city}, {state.country}</span>
            </span>
            <svg className="w-4 h-4 text-brand-accent-hover shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {activeSearchIndex === index ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 15l-7-7-7 7" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
              )}
            </svg>
          </button>

          {/* Autocomplete suggestions */}
          {activeSearchIndex === index && (
            <div className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-surf-1 border border-border-custom shadow-xl p-4 z-40 animate-in fade-in slide-in-from-top-2 duration-150 text-left">
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
              
              <div className="overflow-y-auto max-h-[160px] flex flex-col gap-0.5 pr-1 scrollbar-none">
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

        {/* Local time metrics */}
        <div className="flex flex-col gap-1 mt-1 items-center text-center">
          <div className="flex items-baseline gap-1 justify-center">
            <span className="text-2xl sm:text-3xl font-black text-txt-heading font-mono leading-none tracking-tight" style={{ fontVariantNumeric: 'tabular-nums' }}>
              {timeStr}
            </span>
            <span className="text-[10px] font-black text-txt-primary uppercase font-mono">{ampmStr}</span>
          </div>
          <span className="text-[10px] text-txt-muted font-bold">{dateStr} ({zoneAbbr} {offsetStr})</span>
          {isDST && (
            <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/15 uppercase w-fit mt-1">
              Daylight Saving
            </span>
          )}
        </div>
      </div>
    );
  };

  if (!mounted) return null;

  const diffs = getDifferenceValues();

  return (
    <section className="flex flex-col gap-8 w-full select-none border-t border-border-custom pt-10">
      
      <div className="max-w-3xl mx-auto text-center flex flex-col gap-2">
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-txt-heading leading-tight">
          See the Time Anywhere
        </h2>
        <p className="text-xs sm:text-sm text-txt-secondary leading-normal font-bold">
          Compare two locations and understand the time difference instantly.
        </p>
      </div>

      <div className="w-full max-w-4xl mx-auto bg-surf-1 border border-border-custom rounded-2xl p-6 shadow-card flex flex-col gap-6 mt-2 relative">
        
        {/* Horizontal flex area layout */}
        <div className="flex flex-col md:flex-row gap-6 items-center justify-between">
          
          {/* Location A */}
          {renderLocationField(1, clock1)}
          
          {/* Time Difference column divider */}
          <div className="flex flex-col items-center justify-center shrink-0 min-w-[160px] text-center border-y md:border-y-0 md:border-x border-border-custom py-4 md:py-0 md:px-6">
            <span className="text-[10px] font-mono font-black text-txt-subtle uppercase tracking-widest mb-1.5 leading-none">
              TIME DIFFERENCE
            </span>
            <span className="text-2xl sm:text-3xl font-black text-brand-accent-hover font-mono leading-none tracking-tight">
              {diffs.diffStr}
            </span>
            <span className="text-[10px] text-txt-secondary font-bold leading-normal mt-2.5 max-w-[140px]">
              {diffs.relationStr}
            </span>
          </div>

          {/* Location B */}
          {renderLocationField(2, clock2)}

        </div>

        {/* CTA link banner */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border-custom pt-5 mt-2">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-brand-accent-hover animate-pulse" />
            <span className="text-xs font-bold text-txt-muted">
              Live updates are calculated using accurate IANA offsets.
            </span>
          </div>

          <Link
            href={getComparisonHref()}
            className="w-full sm:w-auto px-5 py-2.5 text-center rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-slate-950 font-extrabold text-xs shadow-sm hover:shadow-md hover:-translate-y-0.5 active:scale-[0.98] transition-all border border-slate-950/5"
          >
            Open Full Comparison
          </Link>
        </div>

      </div>

    </section>
  );
}
