"use client";
import React, { useState, useEffect, useRef } from 'react';
import { DateTime } from 'luxon';
import { ZONE_SEARCH_INDEX } from '@/utils/timezone';

interface ClockCity {
  label: string;
  timezone: string;
}

const ClockIcon = () => (
  <svg className="w-4 h-4 text-teal-505 dark:text-teal-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const EditIcon = () => (
  <svg className="w-3.5 h-3.5 text-slate-400 group-hover:text-teal-500 dark:group-hover:text-teal-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
  </svg>
);

const SearchIcon = () => (
  <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

export default function WorldClock() {
  // Cities & Timezones
  const [city1, setCity1] = useState('London');
  const [zone1, setZone1] = useState('Europe/London');
  const [city2, setCity2] = useState('New York');
  const [zone2, setZone2] = useState('America/New_York');

  // Real-time values without seconds
  const [time1, setTime1] = useState('');
  const [date1, setDate1] = useState('');
  const [abbr1, setAbbr1] = useState('');

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

  // Load preferences on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedCity1 = localStorage.getItem('wc_c1');
      const savedZone1 = localStorage.getItem('wc_z1');
      const savedCity2 = localStorage.getItem('wc_c2');
      const savedZone2 = localStorage.getItem('wc_z2');

      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedCity1) setCity1(savedCity1);
      if (savedZone1) setZone1(savedZone1);
      if (savedCity2) setCity2(savedCity2);
      if (savedZone2) setZone2(savedZone2);
    }
  }, []);

  // Update time ticks (every 10 seconds since seconds are removed)
  useEffect(() => {
    const updateTime = () => {
      const now = DateTime.now();

      const dt1 = now.setZone(zone1);
      setTime1(dt1.toFormat('hh:mm a'));
      setDate1(dt1.toFormat('ccc, LLL dd'));
      setAbbr1(getOffsetLabel(zone1));

      const dt2 = now.setZone(zone2);
      setTime2(dt2.toFormat('hh:mm a'));
      setDate2(dt2.toFormat('ccc, LLL dd'));
      setAbbr2(getOffsetLabel(zone2));
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, [zone1, zone2]);

  // Debounced search suggestion fetch
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

  // Close dropdown on click outside
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (activeCard === 1 && containerRef1.current && !containerRef1.current.contains(target)) {
        setActiveCard(null);
      }
      if (activeCard === 2 && containerRef2.current && !containerRef2.current.contains(target)) {
        setActiveCard(null);
      }
    };
    if (activeCard !== null) {
      document.addEventListener('mousedown', handleOutsideClick);
    }
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [activeCard]);

  const handleSelectCity = (cityObj: ClockCity) => {
    if (activeCard === 1) {
      setCity1(cityObj.label);
      setZone1(cityObj.timezone);
      localStorage.setItem('wc_c1', cityObj.label);
      localStorage.setItem('wc_z1', cityObj.timezone);
    } else if (activeCard === 2) {
      setCity2(cityObj.label);
      setZone2(cityObj.timezone);
      localStorage.setItem('wc_c2', cityObj.label);
      localStorage.setItem('wc_z2', cityObj.timezone);
    }
    setActiveCard(null);
  };

  const toggleSearch = (cardNum: 1 | 2) => {
    if (activeCard === cardNum) {
      setActiveCard(null);
    } else {
      setActiveCard(cardNum);
      setSearchQuery('');
      setSuggestions([]);
    }
  };

  return (
    <section className="w-full flex flex-col font-sans mb-1 select-none">
      
      {/* Title */}
      <h2 className="text-xs uppercase tracking-wider font-extrabold text-slate-455 dark:text-slate-500 flex items-center gap-1.5 mb-2.5">
        <ClockIcon />
        <span>World Clock</span>
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-505 animate-pulse ml-0.5" />
      </h2>

      {/* Two Horizontal Cards Container */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
        
        {/* Card 1 */}
        <div ref={containerRef1} className="relative w-full">
          <div 
            onClick={() => toggleSearch(1)}
            className="w-full h-20 sm:h-22 premium-card rounded-2xl px-5 flex items-center justify-between hover:border-teal-500/40 dark:hover:border-teal-500/35 hover:scale-[1.005] active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            {/* Left Side: City & Info */}
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 mr-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:from-white dark:to-cyan-400 truncate">
                  {city1.split(',')[0]}
                </span>
                <span className="shrink-0">
                  <EditIcon />
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                {date1 || '---'}
              </span>
            </div>

            {/* Right Side: Large Time & Zone Abbr */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-mono tabular-nums leading-none">
                {time1 || '--:--'}
              </span>
              <span className="w-20 inline-block text-center text-[9px] font-bold font-mono py-0.5 rounded bg-slate-100/60 dark:bg-slate-800/40 text-slate-600 dark:text-cyan-400 select-none uppercase tracking-wide border border-slate-200 dark:border-white/10 shadow-sm">
                {abbr1}
              </span>
            </div>
          </div>

          {/* Inline Dropdown Popover 1 */}
          {activeCard === 1 && (
            <div className="absolute top-[105%] left-0 right-0 premium-card rounded-2xl p-4 shadow-2xl z-40 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-855 dark:text-slate-100 placeholder:text-slate-450 dark:placeholder:text-slate-600"
                  autoFocus
                />
                <span className="absolute left-2.5">
                  <SearchIcon />
                </span>
                {isLoading && (
                  <div className="absolute right-2.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-200 border-t-teal-500" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {searchQuery && !isLoading && suggestions.length === 0 ? (
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-505 py-3">No matching cities found</p>
                ) : (
                  suggestions.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleSelectCity(sug)}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/65 transition-colors flex justify-between items-center rounded-lg group cursor-pointer border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[75%]">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{sug.label}</span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-550 truncate">{sug.timezone}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-555 border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded uppercase">
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
            className="w-full h-20 sm:h-22 premium-card rounded-2xl px-5 flex items-center justify-between hover:border-teal-500/40 dark:hover:border-teal-500/35 hover:scale-[1.005] active:scale-[0.99] transition-all duration-200 cursor-pointer group"
          >
            {/* Left Side: City & Info */}
            <div className="flex flex-col justify-center gap-1 min-w-0 flex-1 mr-3">
              <div className="flex items-center gap-2 min-w-0">
                <span className="font-extrabold text-sm sm:text-base tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:from-white dark:to-cyan-400 truncate">
                  {city2.split(',')[0]}
                </span>
                <span className="shrink-0">
                  <EditIcon />
                </span>
              </div>
              <span className="text-[10px] font-extrabold text-slate-450 dark:text-slate-500 uppercase tracking-wider">
                {date2 || '---'}
              </span>
            </div>

            {/* Right Side: Large Time & Zone Abbr */}
            <div className="flex items-center gap-3 shrink-0">
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-slate-900 dark:text-white font-mono tabular-nums leading-none">
                {time2 || '--:--'}
              </span>
              <span className="w-20 inline-block text-center text-[9px] font-bold font-mono py-0.5 rounded bg-slate-100/60 dark:bg-slate-800/40 text-slate-600 dark:text-cyan-400 select-none uppercase tracking-wide border border-slate-200 dark:border-white/10 shadow-sm">
                {abbr2}
              </span>
            </div>
          </div>

          {/* Inline Dropdown Popover 2 */}
          {activeCard === 2 && (
            <div className="absolute top-[105%] left-0 right-0 premium-card rounded-2xl p-4 shadow-2xl z-40 flex flex-col gap-3 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="relative flex items-center">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-8 py-2 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 rounded-xl text-xs focus:outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 text-slate-855 dark:text-slate-100 placeholder:text-slate-450 dark:placeholder:text-slate-600"
                  autoFocus
                />
                <span className="absolute left-2.5">
                  <SearchIcon />
                </span>
                {isLoading && (
                  <div className="absolute right-2.5">
                    <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-slate-200 border-t-teal-500" />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-0.5 max-h-48 overflow-y-auto">
                {searchQuery && !isLoading && suggestions.length === 0 ? (
                  <p className="text-center text-[11px] text-slate-400 dark:text-slate-505 py-3">No matching cities found</p>
                ) : (
                  suggestions.map((sug) => (
                    <button
                      key={sug.label}
                      onClick={() => handleSelectCity(sug)}
                      className="w-full text-left px-3 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/65 transition-colors flex justify-between items-center rounded-lg group cursor-pointer border border-transparent hover:border-slate-200/40 dark:hover:border-slate-800"
                    >
                      <div className="flex flex-col gap-0.5 max-w-[75%]">
                        <span className="font-bold text-xs text-slate-800 dark:text-slate-200 truncate group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors">{sug.label}</span>
                        <span className="text-[9px] text-slate-450 dark:text-slate-550 truncate">{sug.timezone}</span>
                      </div>
                      <span className="text-[9px] font-bold text-slate-400 dark:text-slate-555 border border-slate-200/50 dark:border-white/5 bg-slate-50 dark:bg-slate-900 px-2 py-0.5 rounded uppercase">
                        Select
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
