'use client';

import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { ZONE_SEARCH_INDEX } from '@/utils/timezone';

interface ClockState {
  city: string;
  country: string;
  timezone: string;
}

const EditIcon = () => (
  <svg className="w-4 h-4 text-slate-500 dark:text-slate-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

export default function HomepageWorldClockExplorer() {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);

  // Card 1 state
  const [clock1, setClock1] = useState<ClockState>({
    city: 'London',
    country: 'United Kingdom',
    timezone: 'Europe/London'
  });

  // Card 2 state
  const [clock2, setClock2] = useState<ClockState>({
    city: 'New York',
    country: 'United States',
    timezone: 'America/New_York'
  });

  // Search states
  const [activeSearchIndex, setActiveSearchIndex] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ label: string; timezone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load from localStorage and initialize clock ticking
  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
    });

    // Check localStorage
    try {
      const c1 = localStorage.getItem('wc_home_c1');
      const ct1 = localStorage.getItem('wc_home_ct1');
      const z1 = localStorage.getItem('wc_home_z1');
      if (c1 && z1) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setClock1({ city: c1, country: ct1 || '', timezone: z1 });
      }

      const c2 = localStorage.getItem('wc_home_c2');
      const ct2 = localStorage.getItem('wc_home_ct2');
      const z2 = localStorage.getItem('wc_home_z2');
      if (c2 && z2) {
        setClock2({ city: c2, country: ct2 || '', timezone: z2 });
      }
    } catch {
      // Ignore localStorage errors
    }

    setCurrentTime(DateTime.now());
    const interval = setInterval(() => {
      setCurrentTime(DateTime.now());
    }, 1000);

    return () => {
      cancelAnimationFrame(animFrame);
      clearInterval(interval);
    };
  }, []);

  // Fetch search suggestions
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
          // Fallback search in static indices
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
      try {
        localStorage.setItem('wc_home_c1', cityName);
        localStorage.setItem('wc_home_ct1', countryName);
        localStorage.setItem('wc_home_z1', sug.timezone);
      } catch {}
    } else if (activeSearchIndex === 2) {
      setClock2({ city: cityName, country: countryName, timezone: sug.timezone });
      try {
        localStorage.setItem('wc_home_c2', cityName);
        localStorage.setItem('wc_home_ct2', countryName);
        localStorage.setItem('wc_home_z2', sug.timezone);
      } catch {}
    }

    setActiveSearchIndex(null);
    setSearchQuery('');
  };

  const handlePresetClick = (city: string) => {
    let zone = 'UTC';
    let country = '';
    if (city === 'London') { zone = 'Europe/London'; country = 'United Kingdom'; }
    else if (city === 'New York') { zone = 'America/New_York'; country = 'United States'; }
    else if (city === 'Tokyo') { zone = 'Asia/Tokyo'; country = 'Japan'; }
    else if (city === 'Sydney') { zone = 'Australia/Sydney'; country = 'Australia'; }
    else if (city === 'Mumbai') { zone = 'Asia/Kolkata'; country = 'India'; }
    else if (city === 'Paris') { zone = 'Europe/Paris'; country = 'France'; }

    handleSelectLocation({ label: `${city}, ${country}`, timezone: zone });
  };

  const renderClockCard = (index: 1 | 2, state: ClockState) => {
    const dt = currentTime ? currentTime.setZone(state.timezone) : null;
    const timeStr = dt ? dt.toFormat('hh:mm:ss a') : '--:--:-- --';
    const dateStr = dt ? dt.toFormat('EEEE, MMMM dd, yyyy') : '----, -------- --, ----';
    const zoneAbbr = dt ? dt.toFormat('ZZZZ') : '---';
    const offsetStr = dt ? dt.toFormat('ZZ') : 'UTC+00:00';

    return (
      <div className="premium-interactive-card relative overflow-hidden flex-1 flex flex-col justify-between min-h-[220px] p-6 rounded-2xl border border-teal-500/20 dark:border-teal-500/10 shadow-md">
        
        {/* Search Overlay inside card container */}
        {activeSearchIndex === index && (
          <div className="absolute inset-0 bg-slate-50/98 dark:bg-[#020617]/98 z-30 flex flex-col p-5 rounded-2xl border border-teal-500/30">
            <div className="flex items-center justify-between mb-3 border-b border-slate-200/50 dark:border-slate-800/80 pb-2">
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Search Location</span>
              <button 
                onClick={() => {
                  setActiveSearchIndex(null);
                  setSearchQuery('');
                }}
                className="text-xs font-bold text-slate-500 hover:text-teal-650 dark:text-slate-400 dark:hover:text-teal-450 uppercase transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
            
            <div className="relative">
              <input
                type="text"
                placeholder="Type Pune, India, London..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 rounded-xl text-sm focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-900 dark:text-white placeholder:text-slate-400 dark:placeholder:text-slate-500"
                autoFocus
              />
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </span>
            </div>
            
            <div className="mt-3 overflow-y-auto flex-1 flex flex-col gap-1 pr-1 scrollbar-none">
              {isLoading ? (
                <span className="text-xs text-slate-500 dark:text-slate-400 p-2 font-semibold animate-pulse">Searching...</span>
              ) : suggestions.length === 0 && searchQuery.trim() ? (
                <span className="text-xs text-slate-500 dark:text-slate-500 p-2">No locations found.</span>
              ) : suggestions.length === 0 ? (
                <div className="flex flex-col gap-1">
                  <span className="text-[9px] font-mono font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest px-2 py-1">Popular presets</span>
                  <div className="grid grid-cols-2 gap-1.5 mt-0.5">
                    {['London', 'New York', 'Tokyo', 'Sydney', 'Mumbai', 'Paris'].map(city => (
                      <button
                        key={city}
                        onClick={() => handlePresetClick(city)}
                        className="text-left text-xs font-bold text-slate-700 hover:text-teal-650 dark:text-slate-350 dark:hover:text-teal-450 hover:bg-slate-100 dark:hover:bg-slate-900 px-2 py-1.5 rounded-lg transition-colors cursor-pointer"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                suggestions.map((sug, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectLocation(sug)}
                    className="text-left text-xs font-bold text-slate-700 hover:text-teal-650 dark:text-slate-350 dark:hover:text-teal-450 hover:bg-slate-100 dark:hover:bg-slate-900 p-2 rounded-lg transition-all cursor-pointer truncate"
                  >
                    {sug.label}
                  </button>
                ))
              )}
            </div>
          </div>
        )}

        {/* Resting state card content */}
        <div className="flex justify-between items-start gap-4">
          <div className="flex flex-col gap-1">
            <span className="text-lg sm:text-xl font-black text-slate-950 dark:text-white leading-tight">
              {state.city}
            </span>
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-none truncate">
              {state.country}
            </span>
          </div>

          <button
            onClick={() => setActiveSearchIndex(index)}
            aria-label={`Change clock location for ${state.city}`}
            className="group/btn p-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-teal-500/40 dark:hover:border-teal-500/30 transition-all hover:shadow-sm cursor-pointer"
          >
            <EditIcon />
          </button>
        </div>

        <div className="flex flex-col items-start gap-1 my-3 select-none">
          <span className="text-4xl font-black text-slate-950 dark:text-white font-mono leading-none tracking-tight">
            {timeStr}
          </span>
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
            {dateStr}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-1 border-t border-slate-200/50 dark:border-slate-800/80 pt-3">
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-teal-500/10 dark:bg-teal-500/10 text-teal-700 dark:text-teal-400 border border-teal-500/20 dark:border-teal-500/10 uppercase">
            {zoneAbbr}
          </span>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 uppercase">
            UTC {offsetStr}
          </span>
        </div>

      </div>
    );
  };

  if (!mounted) {
    return (
      <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none animate-pulse">
        <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white text-center">
          Live World Clock Explorer
        </h2>
        <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
          <div className="premium-interactive-card min-h-[220px] rounded-2xl border border-teal-500/20 dark:border-teal-500/10 flex-1 bg-slate-200/20 dark:bg-slate-950/20" />
          <div className="premium-interactive-card min-h-[220px] rounded-2xl border border-teal-500/20 dark:border-teal-500/10 flex-1 bg-slate-200/20 dark:bg-slate-950/20" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl mx-auto flex flex-col gap-6 select-none">
      
      {/* Live world clock heading with active pulsing dot */}
      <h2 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2 justify-center">
        <span className="flex h-2.5 w-2.5 relative">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-600 dark:bg-teal-500"></span>
        </span>
        Live World Clock Explorer
      </h2>

      <div className="flex flex-col md:flex-row gap-6 w-full justify-center">
        {renderClockCard(1, clock1)}
        {renderClockCard(2, clock2)}
      </div>

    </div>
  );
}
