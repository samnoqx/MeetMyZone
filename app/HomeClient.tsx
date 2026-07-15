'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import {
  generateTimezoneMatrix,
  resolveTimeZone,
  ZONE_SEARCH_INDEX
} from '@/utils/timezone';
import TimezoneTimeline from '@/components/TimezoneTimeline';
import ShareMenu from '@/components/ShareMenu';
import WorldClock from '@/components/WorldClock';
import SEOSection from '@/components/SEOSection';
import { ResolvedTimezone } from '@/utils/seoResolver';
import Header from '@/components/Header';

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
  headerPrefix?: React.ReactNode;
}
function buildLocationLabel(name?: string, admin1?: string, country?: string): string {
  const parts: string[] = [];
  const seen = new Set<string>();

  [name, admin1, country].forEach((val) => {
    if (!val) return;
    const trimmed = val.trim();
    if (!trimmed) return;
    const lower = trimmed.toLowerCase();
    if (!seen.has(lower)) {
      seen.add(lower);
      parts.push(trimmed);
    }
  });

  return parts.join(', ');
}

export default function Home({ initialParams = {}, headerPrefix }: HomeClientProps) {
  // Parse initial parameters on client initialization
  const parsedCities = initialParams.cities
    ? initialParams.cities.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean)
    : [];

  const parsedZones = initialParams.zones
    ? initialParams.zones.split(',').map((z) => decodeURIComponent(z.trim())).filter(Boolean)
    : [];

  const initialCities = parsedCities.length > 0 ? parsedCities : ['London', 'New York'];

  const initialCityTimezones: Record<string, string> = {};
  if (parsedCities.length > 0) {
    parsedCities.forEach((city, idx) => {
      initialCityTimezones[city] = parsedZones[idx] || resolveTimeZone(city);
    });
  } else {
    initialCityTimezones['London'] = 'Europe/London';
    initialCityTimezones['New York'] = 'America/New_York';
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
  const [mounted, setMounted] = useState(false);
  const [is24Hour, setIs24Hour] = useState(true);
  const [restored, setRestored] = useState(false);

  // Event Scheduler Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [activeSchedulingSlot, setActiveSchedulingSlot] = useState<{ formattedUtc: string; utcHour: number } | null>(null);
  const [eventTitle, setEventTitle] = useState('Aligned Sync Meeting');
  const [eventDescription, setEventDescription] = useState('');
  const [eventDuration, setEventDuration] = useState(60);
  const [isShareCopied, setIsShareCopied] = useState(false);
  const [showRestoredToast, setShowRestoredToast] = useState(false);

  // Hide the restored toast notification automatically after 3 seconds
  useEffect(() => {
    if (showRestoredToast) {
      const timer = setTimeout(() => {
        setShowRestoredToast(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [showRestoredToast]);

  // Load saved planner and event scheduler state from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      let restoredCities = initialCities;
      let restoredCityTimezones = initialCityTimezones;
      let restoredRef = initialReferenceCity;
      let restoredWorkStart = initialWorkHourStart;
      let restoredWorkEnd = initialWorkHourEnd;
      let restoredDate = initialSelectedDate;
      let restoredViewDate = initialViewDate;
      let restoredIs24Hour = true;
      let restoredNewCity = '';
      let restoredEventTitle = 'Aligned Sync Meeting';
      let restoredEventDescription = '';
      let restoredEventDuration = 60;
      let restoredIsScheduleModalOpen = false;
      let restoredActiveSchedulingSlot = null;
      let wasRestored = false;

      const savedStateStr = sessionStorage.getItem('mmz_planner_state');
      if (savedStateStr) {
        try {
          const saved = JSON.parse(savedStateStr);
          
          // Check if session has expired (older than 24 hours)
          const isExpired = typeof saved.timestamp === 'number' && (Date.now() - saved.timestamp > 24 * 60 * 60 * 1000);
          
          if (!isExpired) {
            if (Array.isArray(saved.cities) && saved.cities.length > 0) {
              restoredCities = saved.cities;
            }
            if (saved.cityTimezones) {
              restoredCityTimezones = saved.cityTimezones;
            }
            if (saved.referenceCity) restoredRef = saved.referenceCity;
            if (typeof saved.workHourStart === 'number') restoredWorkStart = saved.workHourStart;
            if (typeof saved.workHourEnd === 'number') restoredWorkEnd = saved.workHourEnd;
            if (saved.selectedDate) restoredDate = saved.selectedDate;
            
            if (saved.viewDate) {
              const dt = DateTime.fromISO(saved.viewDate);
              if (dt.isValid) restoredViewDate = dt;
            }
            
            if (typeof saved.is24Hour === 'boolean') restoredIs24Hour = saved.is24Hour;
            if (typeof saved.newCity === 'string') restoredNewCity = saved.newCity;
            if (typeof saved.eventTitle === 'string') restoredEventTitle = saved.eventTitle;
            if (typeof saved.eventDescription === 'string') restoredEventDescription = saved.eventDescription;
            if (typeof saved.eventDuration === 'number') restoredEventDuration = saved.eventDuration;
            if (typeof saved.isScheduleModalOpen === 'boolean') restoredIsScheduleModalOpen = saved.isScheduleModalOpen;
            if (saved.activeSchedulingSlot) restoredActiveSchedulingSlot = saved.activeSchedulingSlot;
            
            wasRestored = true;
          } else {
            // Discard expired state
            sessionStorage.removeItem('mmz_planner_state');
          }
        } catch (e) {
          console.error('Failed to parse saved planner state from sessionStorage:', e);
        }
      }

      // URL Parameter Overrides (URL parameters always take precedence over sessionStorage)
      if (initialParams.cities) {
        restoredCities = initialParams.cities.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean);
        restoredCityTimezones = {};
        const parsedZones = initialParams.zones
          ? initialParams.zones.split(',').map((z) => decodeURIComponent(z.trim())).filter(Boolean)
          : [];
        restoredCities.forEach((city, idx) => {
          restoredCityTimezones[city] = parsedZones[idx] || resolveTimeZone(city);
        });
      }

      if (initialParams.reference) {
        restoredRef = decodeURIComponent(initialParams.reference.trim());
      } else if (initialParams.cities && restoredCities.length > 0) {
        restoredRef = restoredCities[0];
      }

      if (initialParams.workStart) {
        const parsed = parseInt(initialParams.workStart, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
          restoredWorkStart = parsed;
        }
      }

      if (initialParams.workEnd) {
        const parsed = parseInt(initialParams.workEnd, 10);
        if (!isNaN(parsed) && parsed >= 0 && parsed <= 23) {
          restoredWorkEnd = parsed;
        }
      }

      if (initialParams.date) {
        const dt = DateTime.fromISO(initialParams.date);
        if (dt.isValid) {
          restoredDate = initialParams.date;
          restoredViewDate = dt.startOf('month');
        }
      }

      /* eslint-disable react-hooks/set-state-in-effect */
      // Update states in a single batch
      setCities(restoredCities);
      setCityTimezones(restoredCityTimezones);
      setReferenceCity(restoredRef);
      setWorkHourStart(restoredWorkStart);
      setWorkHourEnd(restoredWorkEnd);
      setSelectedDate(restoredDate);
      setViewDate(restoredViewDate);
      setIs24Hour(restoredIs24Hour);
      setNewCity(restoredNewCity);
      setEventTitle(restoredEventTitle);
      setEventDescription(restoredEventDescription);
      setEventDuration(restoredEventDuration);
      setIsScheduleModalOpen(restoredIsScheduleModalOpen);
      setActiveSchedulingSlot(restoredActiveSchedulingSlot);
      /* eslint-enable react-hooks/set-state-in-effect */
      
      setRestored(true);
      setMounted(true);
      if (wasRestored) {
        setShowRestoredToast(true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Save planner state to sessionStorage with debounce (runs only after initial restoration)
  useEffect(() => {
    if (!restored) return;

    const delayDebounceFn = setTimeout(() => {
      const stateToSave = {
        timestamp: Date.now(),
        cities,
        cityTimezones,
        referenceCity,
        workHourStart,
        workHourEnd,
        selectedDate,
        viewDate: viewDate.toISO(),
        is24Hour,
        newCity,
        eventTitle,
        eventDescription,
        eventDuration,
        isScheduleModalOpen,
        activeSchedulingSlot
      };
      sessionStorage.setItem('mmz_planner_state', JSON.stringify(stateToSave));
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [
    restored,
    cities,
    cityTimezones,
    referenceCity,
    workHourStart,
    workHourEnd,
    selectedDate,
    viewDate,
    is24Hour,
    newCity,
    eventTitle,
    eventDescription,
    eventDuration,
    isScheduleModalOpen,
    activeSchedulingSlot
  ]);

  // Window scroll restoration using History API
  useEffect(() => {
    if (mounted) {
      const historyState = window.history.state;
      if (historyState && typeof historyState.scrollY === 'number') {
        const timer = setTimeout(() => {
          window.scrollTo({
            top: historyState.scrollY,
            behavior: 'instant' as ScrollBehavior
          });
        }, 50);
        return () => clearTimeout(timer);
      }
    }
  }, [mounted]);

  // Save window scroll position to History API state on scroll
  useEffect(() => {
    if (!mounted) return;

    let debounceTimeout: NodeJS.Timeout;
    const handleScroll = () => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const state = window.history.state || {};
        window.history.replaceState({ ...state, scrollY: window.scrollY }, '');
      }, 150);
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      clearTimeout(debounceTimeout);
    };
  }, [mounted]);





  // Update URL search parameters and path when state parameters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);

      // Auto-fallback if current referenceCity is removed
      if (!cities.includes(referenceCity) && cities.length > 0) {
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

      const isHomepage = window.location.pathname === '/';
      const isPlanner = window.location.pathname === '/meeting-planner';
      const isConvertRoute = window.location.pathname.startsWith('/convert/');
      const isTimezoneRoute = window.location.pathname.startsWith('/timezone/');

      let expectedPathname = window.location.pathname;
      if (isHomepage) {
        expectedPathname = '/';
        if (cities.length > 0) {
          const isDefault = cities.length === 2 && cities[0] === 'London' && cities[1] === 'New York';
          if (!isDefault) {
            params.set('cities', cities.join(','));
            const resolvedZonesList = cities.map(city => cityTimezones[city] || resolveTimeZone(city));
            params.set('zones', resolvedZonesList.join(','));
          } else {
            params.delete('cities');
            params.delete('zones');
          }
        }
      } else if (isPlanner) {
        expectedPathname = '/meeting-planner';
        if (cities.length > 0) {
          const isDefault = cities.length === 2 && cities[0] === 'London' && cities[1] === 'New York';
          if (!isDefault) {
            params.set('cities', cities.join(','));
            const resolvedZonesList = cities.map(city => cityTimezones[city] || resolveTimeZone(city));
            params.set('zones', resolvedZonesList.join(','));
          } else {
            params.delete('cities');
            params.delete('zones');
          }
        }
      } else if (isTimezoneRoute) {
        expectedPathname = `/timezone/${citiesSlug}`;
        params.delete('cities');
        params.delete('zones');
      } else if (!isConvertRoute) {
        expectedPathname = `/timezone/${citiesSlug}`;
        params.delete('cities');
        params.delete('zones');
      }

      params.delete('reference');
      params.delete('workStart');
      params.delete('workEnd');

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
        window.history.replaceState(window.history.state, '', newUrl);
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
              const fullLabel = buildLocationLabel(item.name, item.admin1, item.country);
              const timezone = item.timezone || 'UTC';
              return {
                label: fullLabel,
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
  const matrix = useMemo(() => {
    return generateTimezoneMatrix(cities, referenceCity, workHourStart, workHourEnd, selectedDate, cityTimezones);
  }, [cities, referenceCity, workHourStart, workHourEnd, selectedDate, cityTimezones]);

  const orderedCities = useMemo(() => {
    return [
      referenceCity,
      ...cities.filter((c) => c !== referenceCity)
    ].filter((c) => cities.includes(c));
  }, [cities, referenceCity]);

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
        const fullLabel = buildLocationLabel(item.name, item.admin1, item.country);
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
  const recommendedSlots = useMemo(() => {
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
  }, [cities, matrix]);

  // Open the event scheduler configuration modal
  const handleOpenSchedulerModal = (slot: { formattedUtc: string; utcHour: number }) => {
    setActiveSchedulingSlot(slot);
    setIsScheduleModalOpen(true);
  };

  // Save event template to state/sessionStorage
  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      const stateToSave = {
        timestamp: Date.now(),
        cities,
        cityTimezones,
        referenceCity,
        workHourStart,
        workHourEnd,
        selectedDate,
        viewDate: viewDate.toISO(),
        is24Hour,
        newCity,
        eventTitle,
        eventDescription,
        eventDuration,
        isScheduleModalOpen: false,
        activeSchedulingSlot
      };
      sessionStorage.setItem('mmz_planner_state', JSON.stringify(stateToSave));
    }
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

  // recommendedSlots is defined via useMemo above

  // Helper to format the display hours for settings labels
  const formatHourLabel = (h: number) => {
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${displayHour} ${period}`;
  };

  // Generate days in month grid (Sunday-start)
  const monthGridDays = useMemo(() => {
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
  }, [viewDate]);

  // Dynamic SEO zones based on current cities state
  const resolvedZones: ResolvedTimezone[] = useMemo(() => {
    return cities.map(city => ({
      slug: city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      displayName: city.split(',')[0],
      cityName: city.split(',')[0],
      zoneName: cityTimezones[city] || resolveTimeZone(city)
    }));
  }, [cities, cityTimezones]);

  // Memoize SEO section to avoid re-renders during drag/time sliders shifts
  const memoizedSEOSection = useMemo(() => {
    return <SEOSection zones={resolvedZones} />;
  }, [resolvedZones]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-accent border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-txt-secondary">Loading timezone planner...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <div className="flex-1 text-txt-primary flex flex-col justify-start pb-20 font-sans transition-colors duration-150">

        {/* Consolidated Header Navigation */}
        <Header
          actions={
            <div className="hidden md:block">
              <ShareMenu cities={cities} matrix={matrix} selectedDate={selectedDate} isCompact={true} />
            </div>
          }
        />

        {/* Hero Section */}
        <header className="relative w-full max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-4 md:pt-12 md:pb-2 flex flex-col items-start gap-3 md:gap-4">
          {headerPrefix}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-txt-heading leading-tight">
            <span className="from-grad-from via-grad-via to-grad-to bg-linear-to-r text-transparent bg-clip-text">
              Global Time Zone Converter. Plan Perfect Meetings.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-txt-secondary max-w-3xl leading-relaxed">
            Instantly check live times across 190+ countries with our precision World Clock, or visualize working hour overlaps to find the perfect meeting slot. Save your favorite locations, share schedules with one click, and coordinate global teams — all free, no login required.
          </p>

          <div className="hidden md:flex md:flex-row gap-4 w-full max-w-2xl mt-6 mb-2 mx-auto">
            <a
              href="#world-clock"
              className="group h-14 flex items-center justify-center gap-2 bg-surf-2 hover:bg-surf-3 border border-border-custom hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover text-txt-primary focus:text-txt-primary active:text-txt-primary shadow-xs active:scale-[0.98] transition-all duration-200 outline-none rounded-xl w-full text-base font-semibold cursor-pointer text-center"
              title="Jump down to interactive World Clock converter"
            >
              <svg className="w-5 h-5 text-txt-muted group-focus:text-txt-primary group-active:text-txt-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Open World Clock ↓</span>
            </a>
            <a
              href="#meeting-planner"
              className="group h-14 flex items-center justify-center gap-2 bg-surf-2 hover:bg-surf-3 border border-border-custom hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover text-txt-primary focus:text-txt-primary active:text-txt-primary shadow-xs active:scale-[0.98] transition-all duration-200 outline-none rounded-xl w-full text-base font-semibold cursor-pointer text-center"
            >
              <svg className="w-5 h-5 text-txt-muted group-focus:text-txt-primary group-active:text-txt-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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

          <div id="world-clock" className="w-full">
            <WorldClock />
          </div>

          {/* Top Widgets Grid */}
          <div id="meeting-planner" className="w-full grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 items-start">

            {/* Sidebar Column */}
            <div className="lg:col-span-1 flex flex-col gap-6 sm:gap-8">

              {/* Year/Month Calendar Widget */}
              <div className="premium-card p-6 rounded-2xl flex flex-col gap-4 transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover">
                <div className="flex items-center justify-between border-b border-border-custom pb-2">
                  <span className="text-sm font-extrabold text-txt-primary flex items-center gap-1.5">
                    <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    {viewDate.toFormat('MMMM yyyy')}
                  </span>

                  {/* Calendar Navigation Arrows */}
                  <div className="flex gap-1">
                    <button
                      onClick={() => setViewDate(viewDate.minus({ months: 1 }))}
                      className="p-1.5 rounded-md bg-surf-2 border border-border-custom hover:bg-surf-3 hover:text-brand-accent-hover text-txt-secondary text-xs font-bold leading-none cursor-pointer transition-colors"
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
                      className="px-2.5 py-1.5 rounded-md bg-surf-2 border border-border-custom hover:bg-surf-3 hover:text-brand-accent-hover text-txt-secondary text-[10px] font-bold cursor-pointer transition-colors"
                    >
                      Today
                    </button>
                    <button
                      onClick={() => setViewDate(viewDate.plus({ months: 1 }))}
                      className="p-1.5 rounded-md bg-surf-2 border border-border-custom hover:bg-surf-3 hover:text-brand-accent-hover text-txt-secondary text-xs font-bold leading-none cursor-pointer transition-colors"
                      title="Next Month"
                    >
                      &rarr;
                    </button>
                  </div>
                </div>

                {/* Day Labels & Grid */}
                <div className="grid grid-cols-7 gap-1 text-center font-semibold">
                  {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((wd, i) => (
                    <span key={`wd-lbl-${i}`} className="text-[10px] font-bold text-txt-muted uppercase py-1">
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
                        className={`h-7 w-7 rounded-lg text-xs font-bold transition-all flex items-center justify-center cursor-pointer ${isSelected
                          ? 'bg-brand-accent text-slate-955 shadow-xs scale-105 font-black'
                          : isToday
                            ? 'border border-brand-accent text-brand-accent-hover font-black'
                            : 'hover:bg-surf-2 text-txt-primary font-medium'
                          }`}
                      >
                        {day.day}
                      </button>
                    );
                  })}
                </div>

                {/* Active Selection Details */}
                <div className="mt-1 border-t border-border-custom pt-2.5 flex items-center justify-between text-[11px] text-txt-secondary font-bold">
                  <span>Selected Date:</span>
                  <span className="text-brand-accent-hover font-black">
                    {selectedDate ? DateTime.fromISO(selectedDate).toFormat('cccc, LLL dd') : ''}
                  </span>
                </div>
              </div>

              {/* Controls & Add City Widget */}
              <div className="premium-card p-6 rounded-2xl flex flex-col gap-4 transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover">
                <h2 className="text-sm sm:text-base font-bold text-txt-heading flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
                      aria-label="Search city or timezone to add to the planner"
                      value={newCity}
                      onChange={(e) => {
                        setNewCity(e.target.value);
                        setErrorMsg('');
                      }}
                      onKeyDown={(e) => e.key === 'Enter' && handleAddCity(newCity)}
                      className="flex-1 min-w-0 bg-surf-2 border border-border-custom rounded-lg px-3 py-2 text-xs sm:text-sm text-txt-primary placeholder:text-txt-subtle focus:outline-none focus:border-brand-accent focus:ring-1 focus:ring-brand-accent/30 transition-all"
                    />
                    <button
                      onClick={() => handleAddCity(newCity)}
                      className="bg-brand-accent hover:bg-brand-accent-hover text-slate-955 font-extrabold px-4 py-2 rounded-lg text-xs sm:text-sm transition-all shadow-xs cursor-pointer active:scale-[0.98] border border-slate-950/5"
                    >
                      Add
                    </button>
                  </div>

                  {/* Dynamic Suggestions dropdown from Geocoding API */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-surf-1 border border-border-custom rounded-lg shadow-xl z-50 overflow-hidden divide-y divide-border-soft max-h-56 overflow-y-auto">
                      {suggestions.map((sug) => (
                        <button
                          key={sug.label}
                          onClick={() => handleSelectSuggestion(sug)}
                          className="w-full text-left px-3 py-2.5 hover:bg-surf-2 transition-colors flex flex-col gap-0.5"
                        >
                          <span className="font-bold text-xs text-txt-primary">{sug.label}</span>
                          <span className="text-[9px] text-txt-muted font-bold tracking-wide">{sug.timezone}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Error Message */}
                {errorMsg && (
                  <span className="text-xs text-danger border border-danger/20 bg-danger-surface px-3 py-2 rounded-lg">
                    {errorMsg}
                  </span>
                )}

                {/* Active Tags */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {cities.map((city) => (
                    <div
                      key={city}
                      className="flex items-center gap-1.5 bg-surf-2 border border-border-custom pl-2.5 pr-1.5 py-1 rounded-full text-xs text-txt-primary transition-colors"
                    >
                      <span className="max-w-[12rem] truncate">{city}</span>
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="h-4 w-4 rounded-full flex items-center justify-center text-txt-muted hover:text-red-500 transition-all font-bold cursor-pointer"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Overlap Planner / Recommendation Widget */}
            <div className="lg:col-span-2 premium-card premium-card-static p-6 rounded-2xl flex flex-col gap-4">

              {/* Header + Selectors */}
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3 border-b border-border-custom pb-3">
                <h2 className="text-sm sm:text-base font-bold text-txt-heading flex items-center gap-2">
                  <svg className="w-4 h-4 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Best Meeting Slots (Working Hours Overlap)
                </h2>

                {/* Working Hours Settings Panel */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  {/* Reference City */}
                  <div className="flex items-center gap-1.5 bg-surf-2 border border-border-custom px-2 py-0.5 rounded-lg focus-within:ring-2 focus-within:ring-brand-accent/25 focus-within:border-brand-accent transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="text-[10px] sm:text-xs text-txt-secondary font-semibold">Local Time For:</span>
                    <select
                      value={referenceCity}
                      onChange={(e) => setReferenceCity(e.target.value)}
                      className="bg-transparent text-xs text-txt-primary focus:outline-none cursor-pointer font-semibold border-none"
                    >
                      {cities.map((city) => (
                        <option key={`ref-city-${city}`} value={city} className="bg-surf-1 text-txt-primary">
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Customizable Workday range */}
                  <div className="flex items-center gap-1.5 bg-surf-2 border border-border-custom px-2 py-0.5 rounded-lg focus-within:ring-2 focus-within:ring-brand-accent/25 focus-within:border-brand-accent transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover">
                    <span className="text-[10px] sm:text-xs text-txt-secondary font-semibold">Work Hours:</span>
                    <select
                      value={workHourStart}
                      onChange={(e) => setWorkHourStart(parseInt(e.target.value))}
                      className="bg-transparent text-[10px] sm:text-xs text-txt-primary focus:outline-none cursor-pointer font-bold border-none"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={`start-h-${i}`} value={i} className="bg-surf-1 text-txt-primary">
                          {formatHourLabel(i)}
                        </option>
                      ))}
                    </select>
                    <span className="text-[10px] sm:text-xs text-txt-muted font-bold">to</span>
                    <select
                      value={workHourEnd}
                      onChange={(e) => setWorkHourEnd(parseInt(e.target.value))}
                      className="bg-transparent text-[10px] sm:text-xs text-txt-primary focus:outline-none cursor-pointer font-bold border-none"
                    >
                      {Array.from({ length: 24 }).map((_, i) => (
                        <option key={`end-h-${i}`} value={i} className="bg-surf-1 text-txt-primary">
                          {formatHourLabel(i)}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {recommendedSlots.length === 0 ? (
                <div className="text-xs text-txt-muted py-6 text-center">
                  No overlapping working hour slots found.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {recommendedSlots.map((slot, index) => {
                    const isPerfect = slot.score === cities.length;
                    return (
                      <div
                        key={`slot-${slot.utcHour}`}
                        className="premium-card p-5 border border-border-custom rounded-2xl flex flex-col justify-between gap-3 bg-surf-1 shadow-card transition-all duration-200 hover:border-brand-accent hover:-translate-y-1 hover:shadow-card-hover"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold text-txt-primary tracking-wide">
                            {slot.formattedUtc}
                          </span>
                          <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border transition-colors ${isPerfect
                            ? 'bg-brand-accent-surface text-brand-accent-deep dark:text-brand-accent border-brand-accent-surface-strong font-black'
                            : 'bg-surf-2 text-txt-secondary border-border-custom font-medium'
                            }`}>
                            {slot.score}/{cities.length} Cities
                          </span>
                        </div>

                        {/* Display city times for this slot */}
                        <div className="flex flex-col gap-1.5 border-t border-border-soft pt-2">
                          {orderedCities.map((city) => {
                            const cell = matrix[slot.utcHour]?.cities[city];
                            if (!cell) return null;
                            return (
                              <div key={`slot-city-${city}`} className="flex items-center justify-between text-xs">
                                <span className="text-txt-secondary max-w-[8rem] truncate" title={city}>{city}</span>
                                <span className={`font-mono ${cell.isWorking
                                  ? 'text-success font-semibold'
                                  : 'text-txt-muted'
                                  }`}>
                                  {cell.localTime}
                                </span>
                              </div>
                            );
                          })}
                        </div>

                        {/* Streamlined Schedule Meeting trigger launches the Modal */}
                        <div className="border-t border-border-soft pt-2 mt-1">
                          <button
                            onClick={() => handleOpenSchedulerModal(slot)}
                            className="w-full text-center py-1.5 px-3 bg-surf-2 hover:bg-brand-accent-surface border border-border-custom hover:border-brand-accent/35 text-[10px] text-txt-primary hover:text-brand-accent-hover font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            Schedule Meeting
                          </button>
                        </div>

                        {index === 0 && (
                          <div className="mt-1 flex items-center gap-1.5 text-[10px] text-brand-accent-deep dark:text-brand-accent font-extrabold">
                            <span className="h-1.5 w-1.5 rounded-full bg-brand-accent-deep dark:bg-brand-accent animate-pulse" />
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
          <div className="w-full flex flex-col gap-3">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1">
              <div className="flex flex-col sm:flex-row sm:items-center gap-3.5">
                <h2 className="text-sm sm:text-base font-bold text-txt-heading flex items-center gap-2">
                  <svg className="w-4 h-4 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  24-Hour Timeline Comparison
                </h2>

                {/* 12/24H Toggle */}
                <div className="flex bg-surf-2 rounded-lg p-0.5 border border-border-custom shadow-xs w-fit text-[9px] sm:text-[10px] font-bold">
                  <button
                    onClick={() => setIs24Hour(true)}
                    className={`px-2.5 py-0.5 sm:py-1 rounded-md transition-all cursor-pointer ${is24Hour
                      ? 'bg-brand-accent text-slate-955 shadow-xs'
                      : 'text-txt-muted hover:text-txt-primary'
                      }`}
                  >
                    24H
                  </button>
                  <button
                    onClick={() => setIs24Hour(false)}
                    className={`px-2.5 py-0.5 sm:py-1 rounded-md transition-all cursor-pointer ${!is24Hour
                      ? 'bg-brand-accent text-slate-955 shadow-xs'
                      : 'text-txt-muted hover:text-txt-primary'
                      }`}
                  >
                    12H
                  </button>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-[10px] sm:text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 bg-brand-accent border border-brand-accent rounded-sm" />
                  <span className="text-txt-secondary font-bold">
                    Work Hours ({formatHourLabel(workHourStart)} - {formatHourLabel(workHourEnd)})
                  </span>
                </div>
              </div>
            </div>

            <TimezoneTimeline
              cities={orderedCities}
              matrix={matrix}
              currentUtcHour={currentRefHour}
              is24Hour={is24Hour}
            />
          </div>

        </main>

        {/* Event Scheduler Dialog Modal */}
        {isScheduleModalOpen && activeSchedulingSlot && (
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
            <div className="bg-surf-1 border border-border-custom rounded-2xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4 animate-in fade-in zoom-in-95 duration-150 text-txt-primary">

              {/* Modal Header */}
              <div className="flex items-center justify-between border-b border-border-custom pb-3">
                <h3 className="text-base font-extrabold text-txt-heading flex items-center gap-2">
                  <svg className="w-5 h-5 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Configure Calendar Event
                </h3>
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="text-txt-muted hover:text-txt-primary p-1 hover:bg-surf-2 rounded-lg cursor-pointer transition-colors text-xl font-bold leading-none"
                >
                  &times;
                </button>
              </div>

              {/* Aligned times preview */}
              <div className="bg-success-surface border border-success rounded-xl p-3.5 flex flex-col gap-1.5">
                <span className="text-[9px] font-mono tracking-widest text-success uppercase font-extrabold flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
                  Proposed Meeting Time
                </span>
                <div className="text-xs font-bold text-txt-primary leading-relaxed">
                  {activeSchedulingSlot.formattedUtc}
                </div>
                <div className="flex flex-wrap gap-x-3.5 gap-y-1 mt-1 text-[10px] text-txt-muted">
                  {cities.map((city) => {
                    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
                    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: activeSchedulingSlot.utcHour });
                    const cityZone = cityTimezones[city] || resolveTimeZone(city);
                    const cityLocal = startLocal.setZone(cityZone);
                    return (
                      <span key={`modal-city-${city}`} className="font-mono">
                        {city.split(',')[0]}: <span className="font-bold text-txt-primary">{cityLocal.toFormat('h:mm a')}</span>
                      </span>
                    );
                  })}
                </div>
              </div>

              {/* Form Inputs */}
              <div className="flex flex-col gap-3.5">
                <div className="flex flex-col gap-1">
                  <label htmlFor="event-title-input" className="text-[10px] font-mono tracking-wider font-extrabold text-txt-muted uppercase">
                    Event Title
                  </label>
                  <input
                    id="event-title-input"
                    type="text"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    placeholder="e.g. Project Sync Aligned"
                    className="bg-surf-2 border border-border-custom rounded-lg px-3 py-2 text-xs sm:text-sm text-txt-primary focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="meeting-duration-select" className="text-[10px] font-mono tracking-wider font-extrabold text-txt-muted uppercase">
                    Meeting Duration
                  </label>
                  <select
                    id="meeting-duration-select"
                    value={eventDuration}
                    onChange={(e) => setEventDuration(parseInt(e.target.value))}
                    className="bg-surf-2 border border-border-custom rounded-lg px-3 py-2 text-xs sm:text-sm text-txt-primary focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 cursor-pointer font-semibold"
                  >
                    <option value={30}>30 Minutes</option>
                    <option value={60}>1 Hour</option>
                    <option value={90}>1.5 Hours</option>
                    <option value={120}>2 Hours</option>
                    <option value={180}>3 Hours</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="meeting-description-textarea" className="text-[10px] font-mono tracking-wider font-extrabold text-txt-muted uppercase">
                    Description / Notes
                  </label>
                  <textarea
                    id="meeting-description-textarea"
                    rows={3}
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                    placeholder="Add meeting links, agendas, or dial-in details..."
                    className="bg-surf-2 border border-border-custom rounded-lg px-3 py-2 text-xs sm:text-sm text-txt-primary focus:outline-none focus:border-brand-accent focus:ring-2 focus:ring-brand-accent/25 placeholder:text-txt-subtle resize-none font-sans"
                  />
                </div>
              </div>

              {/* Actions Footer */}
              <div className="flex flex-wrap items-center justify-end gap-2 border-t border-border-custom pt-4 mt-2">
                <button
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="px-4 py-2 bg-surf-2 hover:bg-surf-3 border border-border-custom rounded-lg text-xs font-bold transition-colors cursor-pointer text-txt-primary"
                >
                  Cancel
                </button>

                <button
                  onClick={handleShareEvent}
                  className="px-4 py-2 bg-surf-1 hover:bg-surf-2 border border-border-custom rounded-lg text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer text-txt-primary shadow-xs"
                >
                  {isShareCopied ? (
                    <>
                      <svg className="w-3.5 h-3.5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied!
                    </>
                  ) : (
                    <>
                      <svg className="w-3.5 h-3.5 text-txt-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 10.742L12 9.085l3.316 1.657m-6.632 0l-3.316-1.657m0 0a2 2 0 100-3.316 2 2 0 000 3.316zm10.79 0l3.316-1.657m0 0a2 2 0 100-3.316 2 2 0 000 3.316zm-7.474 6.632a2 2 0 100-3.316 2 2 0 000 3.316z" />
                      </svg>
                      Share
                    </>
                  )}
                </button>
                <button
                  onClick={handleDownloadInvite}
                  className="px-4 py-2 bg-surf-2 hover:bg-brand-accent-surface border border-border-custom hover:border-brand-accent/35 rounded-lg text-xs font-bold transition-all cursor-pointer text-txt-primary"
                >
                  Download
                </button>

                <a
                  href={getGoogleCalendarUrl(activeSchedulingSlot)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-surf-2 hover:bg-brand-accent-surface border border-border-custom hover:border-brand-accent/35 rounded-lg text-xs font-bold transition-all cursor-pointer text-txt-primary flex items-center gap-1.5"
                >
                  <svg className="w-3.5 h-3.5 text-brand-accent-hover" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <span>Google Calendar</span>
                </a>

                <button
                  onClick={handleSaveSettings}
                  disabled={eventTitle.trim() === ''}
                  className={`px-5 py-2 rounded-lg text-xs font-bold transition-all ${eventTitle.trim() !== ''
                    ? 'bg-brand-accent hover:bg-brand-accent-hover text-slate-955 cursor-pointer shadow-xs border border-slate-950/5'
                    : 'bg-surf-2 text-txt-muted border border-border-custom cursor-not-allowed opacity-50'
                    }`}
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Dynamic SEO Section */}
        {memoizedSEOSection}

        {/* Restored Session Toast Notification */}
        {showRestoredToast && (
          <div className="fixed bottom-6 right-6 z-[9999] bg-emerald-600 dark:bg-emerald-700 text-white font-semibold text-xs sm:text-sm px-4 py-3 rounded-xl shadow-xl flex items-center gap-2 border border-emerald-500/20 pointer-events-none select-none transition-all duration-300">
            <svg className="w-4.5 h-4.5 text-white shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            <span>Planner restored from your previous session.</span>
          </div>
        )}

      </div>
    </div>
  );
}
