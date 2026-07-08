'use client';

import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { 
  generateTimezoneMatrix, 
  resolveTimeZone, 
  ZONE_SEARCH_INDEX 
} from '@/utils/timezone';
import TimezoneTimeline from '@/components/TimezoneTimeline';
import ShareMenu from '@/components/ShareMenu';
import Link from 'next/link';
import WorldClock from '@/components/WorldClock';

interface GeocodeSuggestion {
  label: string;
  timezone: string;
  name: string;
}

interface HomeClientProps {
  initialParams?: {
    cities?: string;
    zones?: string;
    reference?: string;
    workStart?: string;
    workEnd?: string;
    date?: string;
  };
}

export default function Home({ initialParams = {} }: HomeClientProps) {
  // Parse initial parameters on client initialization
  const parsedCities = initialParams.cities
    ? initialParams.cities.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean)
    : [];

  const parsedZones = initialParams.zones
    ? initialParams.zones.split(',').map((z) => decodeURIComponent(z.trim())).filter(Boolean)
    : [];

  const initialCities = parsedCities.length > 0 ? parsedCities : ['London', 'New York', 'Tokyo'];

  const initialCityTimezones: Record<string, string> = {};
  if (parsedCities.length > 0) {
    parsedCities.forEach((city, idx) => {
      initialCityTimezones[city] = parsedZones[idx] || resolveTimeZone(city);
    });
  } else {
    initialCityTimezones['London'] = 'Europe/London';
    initialCityTimezones['New York'] = 'America/New_York';
    initialCityTimezones['Tokyo'] = 'Asia/Tokyo';
  }

  const initialReferenceCity = initialParams.reference 
    ? decodeURIComponent(initialParams.reference.trim()) 
    : (parsedCities.length > 0 ? parsedCities[0] : 'London');

  const initialWorkHourStart = (() => {
    if (initialParams.workStart) {
      const parsed = parseInt(initialParams.workStart);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
        return parsed;
      }
    }
    return 9;
  })();

  const initialWorkHourEnd = (() => {
    if (initialParams.workEnd) {
      const parsed = parseInt(initialParams.workEnd);
      if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
        return parsed;
      }
    }
    return 17;
  })();

  const initialSelectedDate = (() => {
    if (initialParams.date) {
      const dt = DateTime.fromISO(initialParams.date);
      if (dt.isValid) {
        return initialParams.date;
      }
    }
    return DateTime.now().toISODate() || '';
  })();

  const initialViewDate = (() => {
    if (initialParams.date) {
      const dt = DateTime.fromISO(initialParams.date);
      if (dt.isValid) {
        return dt.startOf('month');
      }
    }
    return DateTime.now().startOf('month');
  })();

  const [cities, setCities] = useState<string[]>(initialCities);
  const [cityTimezones, setCityTimezones] = useState<Record<string, string>>(initialCityTimezones);
  const [referenceCity, setReferenceCity] = useState<string>(initialReferenceCity);
  const [workHourStart, setWorkHourStart] = useState<number>(initialWorkHourStart);
  const [workHourEnd, setWorkHourEnd] = useState<number>(initialWorkHourEnd);
  const [selectedDate, setSelectedDate] = useState<string>(initialSelectedDate);
  const [viewDate, setViewDate] = useState<DateTime>(initialViewDate);
  const [newCity, setNewCity] = useState('');
  const [currentRefHour, setCurrentRefHour] = useState(0);
  const [errorMsg, setErrorMsg] = useState('');
  const [suggestions, setSuggestions] = useState<GeocodeSuggestion[]>([]);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [mounted, setMounted] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);

  // Set mounted flag on client
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Event Scheduler Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeSchedulingSlot, setActiveSchedulingSlot] = useState<{ formattedUtc: string; utcHour: number } | null>(null);
  const [eventTitle, setEventTitle] = useState('Aligned Sync Meeting');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDuration, setEventDuration] = useState(60);
  const [isShareCopied, setIsShareCopied] = useState(false);

  // Handle client-side theme initialization and bfcache sync
  useEffect(() => {
    const syncThemeState = () => {
      const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        // Default to dark mode for everyone
        setTheme('dark');
      }
    };
    
    syncThemeState();
    
    window.addEventListener('pageshow', syncThemeState);
    return () => {
      window.removeEventListener('pageshow', syncThemeState);
    };
  }, []);

  // Load saved meeting configurations on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTitle = localStorage.getItem('eventTitle');
      const savedDesc = localStorage.getItem('eventDescription');
      const savedDuration = localStorage.getItem('eventDuration');
      // eslint-disable-next-line react-hooks/set-state-in-effect
      if (savedTitle !== null) setEventTitle(savedTitle);
      if (savedDesc !== null) setEventDescription(savedDesc);
      if (savedDuration !== null) setEventDuration(parseInt(savedDuration));
    }
  }, []);



  // Update URL search parameters and path when state parameters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      // Auto-fallback if current referenceCity is removed
      let activeRef = referenceCity;
      if (!cities.includes(referenceCity) && cities.length > 0) {
        activeRef = cities[0];
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setReferenceCity(cities[0]);
      }

      // Generate the clean slug path for cities
      const slugifyCity = (cityName: string) => {
        const namePart = cityName.split(',')[0].trim();
        return namePart
          .toLowerCase()
          .replace(/[^a-z0-9\s-]/g, '')
          .replace(/\s+/g, '-');
      };
      const citiesSlug = cities.map(slugifyCity).join('-to-');

      const isConvertRoute = window.location.pathname.startsWith('/convert/');
      let expectedPathname = window.location.pathname;
      if (!isConvertRoute) {
        expectedPathname = `/timezone/${citiesSlug}`;
      }

      // Clean up old query params
      params.delete('cities');
      params.delete('zones');

      // Only set reference if it's not the default (which is the first city in the list)
      if (activeRef === cities[0]) {
        params.delete('reference');
      } else {
        params.set('reference', activeRef);
      }

      // Only set workStart if it's not the default (9 AM)
      if (workHourStart === 9) {
        params.delete('workStart');
      } else {
        params.set('workStart', String(workHourStart));
      }

      // Only set workEnd if it's not the default (5 PM)
      if (workHourEnd === 17) {
        params.delete('workEnd');
      } else {
        params.set('workEnd', String(workHourEnd));
      }

      // Only set date if it's not the default (today)
      const todayISO = DateTime.now().toISODate();
      if (selectedDate === todayISO) {
        params.delete('date');
      } else if (selectedDate) {
        params.set('date', selectedDate);
      }

      const queryString = params.toString();
      const newUrl = `${expectedPathname}${queryString ? `?${queryString}` : ''}`;
      const currentUrlPath = window.location.pathname + window.location.search;

      if (currentUrlPath !== newUrl) {
        window.history.replaceState(null, '', newUrl);
      }
    }
  }, [cities, referenceCity, workHourStart, workHourEnd, selectedDate]);

  // Update current reference city local hour periodically
  useEffect(() => {
    if (!selectedDate) return;
    const updateHour = () => {
      const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
      const isTodaySelected = selectedDate === DateTime.now().toISODate();
      if (isTodaySelected) {
        setCurrentRefHour(DateTime.now().setZone(refZone).hour);
      } else {
        setCurrentRefHour(-1); // No red marker if looking at another day
      }
    };
    updateHour();
    const timer = setInterval(updateHour, 60000);
    return () => clearInterval(timer);
  }, [referenceCity, selectedDate, cityTimezones]);

  // Handle autocomplete/suggestions as user types using Open-Meteo Geocoding API
  useEffect(() => {
    if (!newCity.trim()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }
    const query = newCity.toLowerCase().trim();
    
    const delayDebounceFn = setTimeout(() => {
      fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(query)}&count=10&language=en&format=json`)
        .then((res) => res.json())
        .then((data) => {
          if (data && data.results) {
            const list = data.results.map((item: { name: string; admin1?: string; country?: string; timezone?: string }) => {
              const region = item.admin1 ? `, ${item.admin1}` : '';
              const country = item.country ? `, ${item.country}` : '';
              const timezone = item.timezone || 'UTC';
              return {
                label: `${item.name}${region}${country}`,
                timezone: timezone,
                name: item.name
              };
            });
            setSuggestions(list);
          } else {
            setSuggestions([]);
          }
        })
        .catch((err) => {
          console.error("Geocoding fetch error:", err);
          const matches = ZONE_SEARCH_INDEX
            .filter(item => 
              (item.key.includes(query) || item.zone.toLowerCase().includes(query)) &&
              !cities.map(c => c.toLowerCase()).includes(item.label.toLowerCase())
            )
            .map(item => ({
              label: `${item.label} (${item.zone})`,
              timezone: item.zone,
              name: item.label
            }))
            .slice(0, 8);
          setSuggestions(matches);
        });
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [newCity, cities]);

  // Generate matrix based on active cities and custom parameters
  const matrix = generateTimezoneMatrix(cities, referenceCity, workHourStart, workHourEnd, selectedDate, cityTimezones);

  // Add a city suggestion to the planner
  const handleSelectSuggestion = (sug: GeocodeSuggestion) => {
    if (cities.map(c => c.toLowerCase()).includes(sug.label.toLowerCase())) {
      setErrorMsg(`"${sug.label}" is already added.`);
      return;
    }

    setCityTimezones(prev => ({
      ...prev,
      [sug.label]: sug.timezone
    }));
    
    setCities([...cities, sug.label]);
    setNewCity('');
    setErrorMsg('');
    setSuggestions([]);
  };

  // Add a city when typed manually and enter/add clicked (fallback lookups)
  const handleAddCity = async (cityName: string) => {
    const trimmed = cityName.trim();
    if (!trimmed) return;

    if (cities.map(c => c.toLowerCase()).includes(trimmed.toLowerCase())) {
      setErrorMsg(`"${trimmed}" is already added.`);
      return;
    }

    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=1&language=en&format=json`);
      const data = await res.json();
      
      if (data && data.results && data.results.length > 0) {
        const item = data.results[0];
        const region = item.admin1 ? `, ${item.admin1}` : '';
        const country = item.country ? `, ${item.country}` : '';
        const fullLabel = `${item.name}${region}${country}`;
        const timezone = item.timezone || 'UTC';

        if (cities.map(c => c.toLowerCase()).includes(fullLabel.toLowerCase())) {
          setErrorMsg(`"${fullLabel}" is already added.`);
          return;
        }

        setCityTimezones(prev => ({
          ...prev,
          [fullLabel]: timezone
        }));
        setCities([...cities, fullLabel]);
        setNewCity('');
        setErrorMsg('');
        setSuggestions([]);
      } else {
        const resolvedZone = resolveTimeZone(trimmed);
        const dt = DateTime.local().setZone(resolvedZone);
        if (!dt.isValid) {
          setErrorMsg(`Could not resolve timezone for "${trimmed}". Try a major city or country name.`);
          return;
        }
        
        setCityTimezones(prev => ({
          ...prev,
          [trimmed]: resolvedZone
        }));
        setCities([...cities, trimmed]);
        setNewCity('');
        setErrorMsg('');
        setSuggestions([]);
      }
    } catch (err) {
      console.error(err);
      const resolvedZone = resolveTimeZone(trimmed);
      const dt = DateTime.local().setZone(resolvedZone);
      if (!dt.isValid) {
        setErrorMsg(`Could not resolve timezone for "${trimmed}".`);
        return;
      }
      setCityTimezones(prev => ({
        ...prev,
        [trimmed]: resolvedZone
      }));
      setCities([...cities, trimmed]);
      setNewCity('');
      setErrorMsg('');
      setSuggestions([]);
    }
  };

  // Remove a city from the planner
  const handleRemoveCity = (cityToRemove: string) => {
    if (cities.length <= 1) {
      setErrorMsg("You must keep at least one city in the timeline.");
      return;
    }
    setCities(cities.filter(c => c !== cityToRemove));
    setErrorMsg('');
  };

  // Find overlapping working slots
  const getRecommendedSlots = (): { utcHour: number; formattedUtc: string; workingCities: string[]; score: number }[] => {
    if (cities.length === 0) return [];
    
    const slots = matrix.map((row) => {
      const workingCities: string[] = [];
      cities.forEach((city) => {
        const cell = row.cities[city];
        if (cell && cell.isWorking) {
          workingCities.push(city);
        }
      });
      return {
        utcHour: row.utcHour,
        formattedUtc: row.formattedUtcTime,
        workingCities,
        score: workingCities.length,
      };
    });

    return slots
      .filter(slot => slot.score > 0)
      .sort((a, b) => b.score - a.score || a.utcHour - b.utcHour)
      .slice(0, 4);
  };

  // Open the event scheduler configuration modal
  const handleOpenSchedulerModal = (slot: { formattedUtc: string; utcHour: number }) => {
    setActiveSchedulingSlot(slot);
    setIsScheduleModalOpen(true);
  };

  // Save event template to state/localStorage
  const handleSaveSettings = () => {
    localStorage.setItem('eventTitle', eventTitle);
    localStorage.setItem('eventDescription', eventDescription);
    localStorage.setItem('eventDuration', String(eventDuration));
    setIsScheduleModalOpen(false);
  };

  // Download event file directly
  const handleDownloadInvite = () => {
    downloadIcsFile(activeSchedulingSlot!);
    setIsScheduleModalOpen(false);
  };

  // Share customized meeting summary copy to clipboard
  const handleShareEvent = async () => {
    if (!activeSchedulingSlot) return;
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: activeSchedulingSlot.utcHour });
    const endLocal = startLocal.plus({ minutes: eventDuration });
    
    const dateStr = startLocal.toFormat('EEEE, LLLL dd, yyyy');
    const currentUrl = window.location.href;

    const cityLocalStrings = cities.map((city) => {
      const zone = cityTimezones[city] || resolveTimeZone(city);
      const localStart = startLocal.setZone(zone);
      const localEnd = endLocal.setZone(zone);
      
      return `${localStart.toFormat('h:mm a')} - ${localEnd.toFormat('h:mm a')} ${localStart.offsetNameShort} (${city})`;
    });

    const summaryText = [
      `Hello team,`,
      ``,
      `You have been invited to: ${eventTitle || "Aligned Sync Meeting"}`,
      `Date: ${dateStr}`,
      `Time: ${cityLocalStrings.join(' | ')}`,
      ``,
      eventDescription ? `Description:\n${eventDescription}\n` : '',
      `You can view the timezone timeline comparison or customize this schedule at:`,
      `${currentUrl}`,
      ``,
      `Thank you!`
    ].filter(Boolean).join('\n');

    try {
      await navigator.clipboard.writeText(summaryText);
      setIsShareCopied(true);
      setTimeout(() => setIsShareCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed", err);
    }
  };

  // Generate Google Calendar Link for a slot using customized values
  const getGoogleCalendarUrl = (slot: { formattedUtc: string; utcHour: number }) => {
    if (typeof window === 'undefined' || !selectedDate) return '';
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
    
    // Parse selectedDate directly in target reference timezone to prevent date shifts
    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: slot.utcHour });
    const endLocal = startLocal.plus({ minutes: eventDuration });
    
    const startUtcStr = startLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endUtcStr = endLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    
    const title = encodeURIComponent(eventTitle || "Aligned Sync Meeting");
    const details = encodeURIComponent(eventDescription || `MeetMyZone: ${window.location.href}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtcStr}/${endUtcStr}&details=${details}`;
  };

  // Download ICS File for a slot using customized values (RFC 5545 compliant)
  const downloadIcsFile = (slot: { formattedUtc: string; utcHour: number }) => {
    if (typeof window === 'undefined' || !selectedDate) return;
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
    
    // Parse selectedDate directly in target reference timezone to prevent date shifts
    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: slot.utcHour });
    const endLocal = startLocal.plus({ minutes: eventDuration });
    
    const startUtcStr = startLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endUtcStr = endLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Antigravity//MeetMyZone//EN',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${Date.now()}@meetmyzone.com`,
      `DTSTAMP:${DateTime.utc().toFormat("yyyyMMdd'T'HHmmss'Z'")}`,
      `DTSTART:${startUtcStr}`,
      `DTEND:${endUtcStr}`,
      `SUMMARY:${eventTitle || "Aligned Sync Meeting"}`,
      `DESCRIPTION:${eventDescription || ("MeetMyZone: " + window.location.href)}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');
    
    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${(eventTitle || "meeting").toLowerCase().replace(/[^a-z0-9]/g, '-')}-${selectedDate}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const recommendedSlots = getRecommendedSlots();

  // Helper to format the display hours for settings labels
  const formatHourLabel = (h: number) => {
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${displayHour} ${period}`;
  };

  // Generate days in month grid (Sunday-start)
  const getDaysInMonthGrid = () => {
    const days = [];
    const startOfMonth = viewDate.startOf('month');
    const daysInMonth = viewDate.daysInMonth || 30;
    
    const firstWeekday = startOfMonth.weekday;
    const paddingCount = firstWeekday === 7 ? 0 : firstWeekday;
    
    for (let p = 0; p < paddingCount; p++) {
      days.push(null);
    }
    
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(startOfMonth.set({ day: d }));
    }
    
    return days;
  };

  const monthGridDays = getDaysInMonthGrid();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-[#020617] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500 dark:text-slate-200">Loading timezone planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="flex-1 bg-slate-50 dark:bg-[#020617] text-slate-900 dark:text-slate-100 flex flex-col justify-start pb-20 font-sans selection:bg-teal-500/30 selection:text-teal-600 dark:selection:text-teal-300 transition-colors duration-250 min-h-screen">
        
        {/* Navigation Bar */}
        <nav className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 py-3 md:py-5 flex items-center justify-between border-b border-slate-200/60 dark:border-slate-900">
          <Link href="/" className="flex items-center gap-3 group select-none">
            <img
              src="/logo.png"
              alt="MeetMyZone Logo"
              className="h-20 md:h-24 w-auto object-contain group-hover:scale-105 transition-transform my-auto -mr-6 md:-mr-8"
            />
            <span className="font-black text-2xl md:text-3xl tracking-tight leading-none bg-clip-text text-transparent bg-gradient-to-r from-blue-900 to-blue-600 dark:bg-clip-text dark:text-transparent dark:bg-gradient-to-r dark:from-white dark:to-cyan-400 group-hover:opacity-90 transition-opacity">
              MeetMyZone
            </span>
          </Link>

          {/* Action Controls (Share + Theme Toggle) */}
          <div className="flex items-center gap-2 md:gap-4">
            <div className="hidden md:block">
              <ShareMenu cities={cities} matrix={matrix} selectedDate={selectedDate} isCompact={true} />
            </div>
            
            <button
              onClick={() => {
                const nextTheme = theme === 'dark' ? 'light' : 'dark';
                setTheme(nextTheme);
                if (nextTheme === 'dark') {
                  document.documentElement.classList.add('dark');
                  localStorage.setItem('theme', 'dark');
                } else {
                  document.documentElement.classList.remove('dark');
                  localStorage.setItem('theme', 'light');
                }
              }}
              className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-600 dark:text-slate-300 transition-all shadow-sm active:scale-95 cursor-pointer"
              title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {theme === 'dark' ? (
                <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M14 12a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-indigo-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </div>
        </nav>

        {/* Hero Section */}
        <header className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-4 md:pt-12 md:pb-2 flex flex-col items-start gap-3 md:gap-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-500 dark:from-emerald-400 dark:to-teal-300">
              Global Time Zone Converter. Plan Perfect Meetings.
            </span>
          </h1>
          
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-3xl leading-relaxed">
            Instantly check live times across 190+ countries with our precision World Clock, or visualize working hour overlaps to find the perfect meeting slot. Save your favorite locations, share schedules with one click, and coordinate global teams — all free, no login required.
          </p>

          <div className="hidden md:flex md:flex-row gap-4 w-full max-w-2xl mt-6 mb-2 mx-auto">
            <a
              href="#world-clock"
              className="group h-14 flex items-center justify-center gap-2 bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 focus:text-cyan-600 dark:focus:text-cyan-400 active:text-cyan-600 dark:active:text-cyan-400 shadow-md shadow-cyan-500/15 hover:shadow-lg hover:shadow-cyan-500/25 active:scale-[0.98] active:bg-cyan-500/30 transition-all duration-300 ease-in-out outline-none rounded-xl w-full backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] shadow-black/20 text-base font-semibold cursor-pointer text-center"
            >
              <svg className="w-5 h-5 text-cyan-600 dark:text-cyan-400 group-focus:text-cyan-600 dark:group-focus:text-cyan-400 group-active:text-cyan-600 dark:group-active:text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Open World Clock ↓</span>
            </a>
            <a
              href="#meeting-planner"
              className="group h-14 flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600/20 border border-blue-500/30 text-blue-600 dark:text-blue-400 focus:text-blue-600 dark:focus:text-blue-400 active:text-blue-600 dark:active:text-blue-400 shadow-md shadow-blue-500/15 hover:shadow-lg hover:shadow-blue-500/25 active:scale-[0.98] active:bg-blue-600/30 transition-all duration-300 ease-in-out outline-none rounded-xl w-full backdrop-blur-md shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] shadow-black/20 text-base font-semibold cursor-pointer text-center"
            >
              <svg className="w-5 h-5 text-blue-600 dark:text-blue-400 group-focus:text-blue-600 dark:group-focus:text-blue-400 group-active:text-blue-600 dark:group-active:text-blue-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span>Start Meeting Planner ↓</span>
            </a>
          </div>

          {/* 4-Tile Grid for Mobile Only (World Clock, Planner, Copy Link, Copy Text) */}
          <ShareMenu cities={cities} matrix={matrix} selectedDate={selectedDate} isMobileGrid={true} />

        </header>

        {/* Main Area */}
        <main className="w-full max-w-7xl mx-auto px-4 sm:px-6 mt-2 md:mt-2 flex flex-col gap-6 sm:gap-8">
          
          <div id="world-clock">
            <WorldClock />
          </div>

          {/* Top Widgets Grid */}
          <div id="meeting-planner" className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">
            
            {/* Sidebar Column */}
            <div className="lg:col-span-1 flex flex-col gap-6 sm:gap-8">
              
              {/* Year/Month Calendar Widget */}
              <div className="premium-card p-6 rounded-2xl transition-colors duration-250 flex flex-col gap-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <span className="text-sm font-extrabold text-slate-805 dark:text-slate-200 flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {viewDate.toFormat('MMMM yyyy')}
                  </span>
                  
                  {/* Calendar Navigation Arrows */}
                  <div className="flex gap-1">
                     <button
                       onClick={() => setViewDate(viewDate.minus({ months: 1 }))}
                       className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-teal-500 dark:hover:text-white text-slate-600 dark:text-slate-200 text-xs font-bold leading-none cursor-pointer transition-colors"
                       title="Previous Month"
                     >
                       &larr;
                     </button>
                     <button
                       onClick={() => {
                         const today = DateTime.now();
                         setViewDate(today.startOf('month'));
                         setSelectedDate(today.toISODate() || '');
                       }}
                       className="px-2.5 py-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-teal-500 dark:hover:text-white text-slate-600 dark:text-slate-200 text-[10px] font-bold cursor-pointer transition-colors"
                     >
                       Today
                     </button>
                     <button
                       onClick={() => setViewDate(viewDate.plus({ months: 1 }))}
                       className="p-1.5 rounded-md bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800/90 hover:text-teal-500 dark:hover:text-white text-slate-600 dark:text-slate-200 text-xs font-bold leading-none cursor-pointer transition-colors"
                       title="Next Month"
                     >
                       &rarr;
                     </button>
                  </div>
                </div>

                {/* Day Labels & Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-semibold">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                    <span key={`wd-lbl-${i}`} className="text-[10px] font-bold text-slate-400 dark:text-slate-550 uppercase py-1">
                      {wd}
                    </span>
                  ))}
                  
                  {monthGridDays.map((day, idx) => {
                    if (!day) {
                      return <div key={`pad-${idx}`} className="h-7 w-7" />;
                    }
                    const isSelected = selectedDate === day.toISODate();
                    const isToday = DateTime.now().toISODate() === day.toISODate();
                    return (
                      <button
                        key={`grid-day-${day.toISODate()}`}
                        onClick={() => setSelectedDate(day.toISODate() || '')}
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${
                          isSelected
                            ? 'bg-teal-600 dark:bg-teal-650 text-white shadow-md scale-105'
                            : isToday
                              ? 'border border-teal-505 text-teal-600 dark:text-teal-400'
                              : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-305'
                        }`}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>
                
                {/* Active Selection Details */}
                <div className="mt-1 border-t border-slate-100 dark:border-slate-800/60 pt-2.5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 font-bold">
                  <span>Selected Date:</span>
                  <span className="text-teal-600 dark:text-teal-400">
                    {selectedDate ? DateTime.fromISO(selectedDate).toFormat('cccc, LLL dd') : ''}
                  </span>
                </div>
              </div>

              {/* Controls & Add City Widget */}
              <div className="premium-card p-6 rounded-2xl flex flex-col gap-4 transition-colors duration-250">
                <h2 className="text-sm sm:text-base font-bold text-slate-808 dark:text-slate-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  Manage Locations
                </h2>

                {/* Input Form */}
                <div className="relative">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Search globally (e.g. Pune, Frankfurt)"
                      value={newCity}
                      onChange={(e) => {
                        setNewCity(e.target.value);
                        setErrorMsg('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCity(newCity)}
                      className="flex-1 bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:outline-none focus:border-teal-500/50 focus:ring-1 focus:ring-teal-500/30 transition-all"
                    />
                    <button
                      onClick={() => handleAddCity(newCity)}
                      className="bg-teal-600 hover:bg-teal-505 text-white dark:text-slate-900 font-bold px-4 py-2 rounded-lg text-xs sm:text-sm transition-colors shadow-md cursor-pointer"
                    >
                      Add
                    </button>
                  </div>

                  {/* Dynamic Suggestions dropdown from Geocoding API */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg shadow-2xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-900 max-h-56 overflow-y-auto">
                      {suggestions.map((sug) => (
                        <button
                          key={sug.label}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full text-left px-3 py-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors flex flex-col gap-0.5"
                        >
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{sug.label}</span>
                          <span className="text-[9px] text-slate-400 dark:text-slate-505 font-bold tracking-wide">{sug.timezone}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <span className="text-xs text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-955/30 border border-red-200 dark:border-red-900/30 px-3 py-2 rounded-lg">
                    {errorMsg}
                  </span>
                )}

                {/* Active Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {cities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-950 hover:bg-slate-200/60 dark:hover:bg-slate-900 border border-slate-200 dark:border-slate-800/80 pl-2.5 pr-1.5 py-1 rounded-full text-xs text-slate-700 dark:text-slate-300 transition-colors"
                    >
                      <span className="max-w-[12rem] truncate">{city}</span>
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/20 transition-all font-bold"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Overlap Planner / Recommendation Widget */}
            <div className="lg:col-span-2 premium-card p-6 rounded-2xl flex flex-col gap-4 transition-colors duration-250">
              
              {/* Header + Selectors */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800/60 pb-3">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-emerald-500 dark:text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Best Meeting Slots (Working Hours Overlap)
                </h2>
                
                {/* Working Hours Settings Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Reference City */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-slate-550 dark:text-slate-200 font-semibold">Local Time For:</span>
                    <select
                      value={referenceCity}
                      onChange={(e) => setReferenceCity(e.target.value)}
                      className="bg-transparent text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-semibold border-none"
                    >
                      {cities.map((city) => (
                        <option key={`ref-city-${city}`} value={city} className="bg-white dark:bg-slate-950">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>
 
                  {/* Customizable Workday range */}
                  <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 px-2 py-0.5 rounded-lg">
                    <span className="text-[10px] sm:text-xs text-slate-550 dark:text-slate-200 font-semibold">Work Hours:</span>
                    <select
                      value={workHourStart}
                      onChange={(e) => setWorkHourStart(parseInt(e.target.value))}
                      className="bg-transparent text-[10px] sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={`start-h-${i}`} value={i} className="bg-white dark:bg-slate-950">
                          {formatHourLabel(i)}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] sm:text-xs text-slate-400 font-bold">to</span>
                    <select
                      value={workHourEnd}
                      onChange={(e) => setWorkHourEnd(parseInt(e.target.value))}
                      className="bg-transparent text-[10px] sm:text-xs text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={`end-h-${i}`} value={i} className="bg-white dark:bg-slate-950">
                          {formatHourLabel(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {recommendedSlots.length === 0 ? (
                <div className="text-xs text-slate-500 py-6 text-center">
                  No overlapping working hour slots found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {recommendedSlots.map((slot, index) => {
                    const isPerfect = slot.score === cities.length;
                    return (
                      <div 
                        key={`slot-${slot.utcHour}`}
                        className="p-4 border rounded-xl flex flex-col justify-between gap-2.5 transition-all bg-gradient-to-br from-emerald-500/5 to-slate-50/50 dark:from-emerald-500/10 dark:to-slate-900 border-emerald-500/20 dark:border-emerald-500/30 ring-1 ring-emerald-500/5 dark:ring-emerald-500/20 shadow-sm hover:scale-[1.01]"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                            {slot.formattedUtc}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                            isPerfect 
                              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60 font-semibold' 
                              : 'bg-slate-100 dark:bg-slate-900 text-slate-550 dark:text-slate-200 border-slate-200 dark:border-slate-800'
                          }`}>
                            {slot.score}/{cities.length} Cities
                          </span>
                        </div>

                        {/* Display city times for this slot */}
                        <div className="flex flex-col gap-1.5 border-t border-slate-100 dark:border-slate-800/30 pt-2">
                          {cities.map((city) => {
                            const cell = matrix[slot.utcHour]?.cities[city];
                            if (!cell) return null;
                            return (
                              <div key={`slot-city-${city}`} className="flex items-center justify-between text-xs">
                                <span className="text-slate-500 dark:text-slate-200 max-w-[8rem] truncate" title={city}>{city}</span>
                                <span className={`font-mono ${
                                  cell.isWorking 
                                    ? 'text-emerald-600 dark:text-emerald-450 font-semibold' 
                                    : 'text-slate-400 dark:text-slate-400'
                                }`}>
                                  {cell.localTime}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Streamlined Schedule Meeting trigger launches the Modal */}
                        <div className="border-t border-slate-100 dark:border-slate-800/20 pt-2 mt-1">
                          <button
                            onClick={() => handleOpenSchedulerModal(slot)}
                            className="w-full text-center py-1.5 px-3 bg-slate-100 hover:bg-teal-50/50 dark:bg-slate-900 dark:hover:bg-teal-900/20 border border-slate-200 hover:border-teal-500/50 dark:border-slate-800 dark:hover:border-teal-500/30 text-[10px] text-slate-700 hover:text-teal-600 dark:text-slate-300 dark:hover:text-teal-400 font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule Meeting
                          </button>
                        </div>

                        {index === 0 && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-500 font-semibold">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            Top Recommended Option
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>

          {/* Dynamic Timeline Wrapper */}
          <div className="flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                <h2 className="text-sm sm:text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24-Hour Timeline Comparison
                </h2>
                
                {/* 12/24H Toggle */}
                <div className="flex bg-slate-200/80 dark:bg-slate-800 rounded-lg p-0.5 border border-slate-300 dark:border-slate-700/60 shadow-sm w-fit text-[9px] sm:text-[10px] font-bold">
                  <button
                    onClick={() => setIs24Hour(true)}
                    className={`px-2.5 py-0.5 sm:py-1 rounded-md transition-all cursor-pointer ${
                      is24Hour
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => setIs24Hour(false)}
                    className={`px-2.5 py-0.5 sm:py-1 rounded-md transition-all cursor-pointer ${
                      !is24Hour
                        ? 'bg-blue-600 text-white shadow-sm'
                        : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'
                    }`}
                  >
                    12H
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-amber-50/20 dark:bg-white border border-amber-200/60 dark:border-slate-200 rounded-sm" />
                  <span className="text-slate-505 dark:text-slate-200">
                    Work Hours ({formatHourLabel(workHourStart)} - {formatHourLabel(workHourEnd)})
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-slate-100 dark:bg-slate-900 rounded-sm border border-slate-250 dark:border-slate-800" />
                  <span className="text-slate-505 dark:text-slate-200">Night</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-red-500/25 border border-red-500 rounded-sm" />
                  <span className="text-slate-550 dark:text-slate-200">Current Hour</span>
                </div>
              </div>
            </div>

            <TimezoneTimeline 
              cities={cities} 
              matrix={matrix} 
              currentUtcHour={currentRefHour} 
              is24Hour={is24Hour}
            />
          </div>

        </main>

        {/* Event Scheduler Dialog Modal */}
        {isScheduleModalOpen && activeSchedulingSlot && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-200 text-slate-900 dark:text-slate-100">
              
              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-slate-150 dark:border-slate-800 pb-3">
                <h3 className="text-base font-extrabold flex items-center gap-2">
                  <svg className="w-5 h-5 text-teal-500 dark:text-teal-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Configure Calendar Event
                </h3>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-slate-400 hover:text-slate-650 dark:hover:text-slate-250 p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition-colors text-xl font-bold leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Aligned times preview */}
              <div className="bg-teal-500/5 dark:bg-teal-950/20 border border-teal-500/10 rounded-xl p-3.5 flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-teal-600 dark:text-teal-400 uppercase font-extrabold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-teal-500 animate-pulse" />
                  Proposed Meeting Time
                </span>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                  {activeSchedulingSlot.formattedUtc}
                </div>
                <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-1 text-[10px] text-slate-500 dark:text-slate-400">
                  {cities.map((city) => {
                    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
                    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: activeSchedulingSlot.utcHour });
                    const cityZone = cityTimezones[city] || resolveTimeZone(city);
                    const cityLocal = startLocal.setZone(cityZone);
                    return (
                      <span key={`modal-city-${city}`} className="font-mono">
                        {city.split(',')[0]}: <span className="font-bold text-slate-700 dark:text-slate-350">{cityLocal.toFormat('h:mm a')}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono tracking-wider font-extrabold text-slate-450 dark:text-slate-500 uppercase">
                    Event Title
                  </label>
                  <input
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Project Sync Aligned"
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono tracking-wider font-extrabold text-slate-450 dark:text-slate-500 uppercase">
                    Meeting Duration
                  </label>
                  <select
                    value={eventDuration}
                    onChange={(e) => setEventDuration(parseInt(e.target.value))}
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50 cursor-pointer font-semibold"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                    <option value={180}>3 Hours</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-mono tracking-wider font-extrabold text-slate-450 dark:text-slate-500 uppercase">
                    Description / Notes
                  </label>
                  <textarea
                    rows={3}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Add meeting links, agendas, or dial-in details..."
                    className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-xs sm:text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50 resize-none font-sans"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-slate-150 dark:border-slate-800 pt-4 mt-2">
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 dark:bg-slate-950 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold transition-colors cursor-pointer text-slate-700 dark:text-slate-300"
                >
                  Cancel
                </button>
                
                <button
                  onClick={handleShareEvent}
                  className="px-4 py-2 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-850 rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-slate-750 dark:text-slate-200 shadow-sm"
                >
                  {isShareCopied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742L12 9.085l3.316 1.657m-6.632 0l-3.316-1.657m0 0a2 2 0 100-3.316 2 2 0 000 3.316zm10.79 0l3.316-1.657m0 0a2 2 0 100-3.316 2 2 0 000 3.316zm-7.474 6.632a2 2 0 100-3.316 2 2 0 000 3.316z" />
                      </svg>
                      Share
                    </>
                  )}
                </button>
                           <button
                  onClick={handleDownloadInvite}
                  className="px-4 py-2 bg-slate-100 hover:bg-teal-50/50 dark:bg-slate-955 dark:hover:bg-teal-900/20 border border-slate-200 hover:border-teal-500/50 dark:border-slate-800 dark:hover:border-teal-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-305"
                >
                  Download
                </button>

                <a
                  href={getGoogleCalendarUrl(activeSchedulingSlot)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-slate-100 hover:bg-blue-50/50 dark:bg-slate-955 dark:hover:bg-blue-950/20 border border-slate-200 hover:border-blue-500/50 dark:border-slate-800 dark:hover:border-blue-500/30 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-305 flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Google Calendar</span>
                </a>

                <button
                  onClick={handleSaveSettings}
                  disabled={eventTitle.trim() === ''}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${
                    eventTitle.trim() !== ''
                      ? 'bg-teal-650 hover:bg-teal-550 text-white dark:text-slate-900 cursor-pointer shadow-md shadow-teal-900/10'
                      : 'bg-slate-100 dark:bg-slate-900 text-slate-400 dark:text-slate-600 border border-slate-200 dark:border-slate-800 cursor-not-allowed opacity-50'
                  }`}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
}
