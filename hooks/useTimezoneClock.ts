'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { DateTime } from 'luxon';
import { ZONE_SEARCH_INDEX, deduplicateSuggestions } from '@/utils/timezone';

export interface ClockState {
  city: string;
  country: string;
  timezone: string;
  region?: string;
}

export const COUNTRY_CODES: Record<string, string> = {
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
  'Luxembourg': 'LU', 'Lithuania': 'LT', 'Latvia': 'LV', 'Estonia': 'EE',
  'Slovakia': 'SK', 'Slovenia': 'SI', 'Malta': 'MT', 'Cyprus': 'CY',
  'Bahrain': 'BH', 'Oman': 'OM', 'Jordan': 'JO', 'Lebanon': 'LB',
  'Myanmar': 'MM', 'Cambodia': 'KH', 'Laos': 'LA', 'Mongolia': 'MN',
  'Uzbekistan': 'UZ', 'Kazakhstan': 'KZ', 'Georgia': 'GE', 'Armenia': 'AM',
  'Azerbaijan': 'AZ', 'Belarus': 'BY', 'Moldova': 'MD', 'Albania': 'AL',
  'North Macedonia': 'MK', 'Montenegro': 'ME', 'Bosnia and Herzegovina': 'BA',
  'Costa Rica': 'CR', 'Panama': 'PA', 'Ecuador': 'EC', 'Venezuela': 'VE',
  'Uruguay': 'UY', 'Paraguay': 'PY', 'Bolivia': 'BO', 'Dominican Republic': 'DO',
  'Puerto Rico': 'PR', 'Trinidad and Tobago': 'TT', 'Bermuda': 'BM',
  'Fiji': 'FJ', 'Papua New Guinea': 'PG', 'Samoa': 'WS', 'Tonga': 'TO',
};

/** Get the 2-letter ISO country code for a country name */
export function getCountryCode(country: string): string {
  if (!country) return 'un';
  if (COUNTRY_CODES[country]) return COUNTRY_CODES[country].toLowerCase();
  const parts = country.split(',').map(p => p.trim());
  for (let i = parts.length - 1; i >= 0; i--) {
    if (COUNTRY_CODES[parts[i]]) return COUNTRY_CODES[parts[i]].toLowerCase();
  }
  return 'un';
}

export function getCountryFromTimezone(tz: string): string {
  if (tz.startsWith('America/')) {
    if (tz.includes('New_York') || tz.includes('Los_Angeles') || tz.includes('Chicago') || tz.includes('Denver') || tz.includes('Phoenix') || tz.includes('Anchorage') || tz.includes('Honolulu') || tz.includes('Detroit') || tz.includes('Indiana') || tz.includes('Kentucky')) {
      return 'United States';
    }
    if (tz.includes('Toronto') || tz.includes('Vancouver') || tz.includes('Montreal') || tz.includes('Halifax') || tz.includes('Winnipeg') || tz.includes('Edmonton')) {
      return 'Canada';
    }
    if (tz.includes('Mexico_City') || tz.includes('Cancun') || tz.includes('Monterrey')) {
      return 'Mexico';
    }
    if (tz.includes('Sao_Paulo') || tz.includes('Rio') || tz.includes('Manaus') || tz.includes('Bahia')) {
      return 'Brazil';
    }
    if (tz.includes('Buenos_Aires')) return 'Argentina';
    if (tz.includes('Bogota')) return 'Colombia';
    if (tz.includes('Santiago')) return 'Chile';
    if (tz.includes('Lima')) return 'Peru';
    if (tz.includes('Caracas')) return 'Venezuela';
  }
  if (tz.startsWith('Europe/')) {
    if (tz.includes('London')) return 'United Kingdom';
    if (tz.includes('Paris')) return 'France';
    if (tz.includes('Berlin') || tz.includes('Munich') || tz.includes('Frankfurt')) return 'Germany';
    if (tz.includes('Rome')) return 'Italy';
    if (tz.includes('Madrid')) return 'Spain';
    if (tz.includes('Amsterdam')) return 'Netherlands';
    if (tz.includes('Brussels')) return 'Belgium';
    if (tz.includes('Vienna')) return 'Austria';
    if (tz.includes('Zurich')) return 'Switzerland';
    if (tz.includes('Stockholm')) return 'Sweden';
    if (tz.includes('Oslo')) return 'Norway';
    if (tz.includes('Copenhagen')) return 'Denmark';
    if (tz.includes('Helsinki')) return 'Finland';
    if (tz.includes('Warsaw')) return 'Poland';
    if (tz.includes('Lisbon')) return 'Portugal';
    if (tz.includes('Dublin')) return 'Ireland';
    if (tz.includes('Athens')) return 'Greece';
    if (tz.includes('Moscow')) return 'Russia';
    if (tz.includes('Istanbul')) return 'Turkey';
    if (tz.includes('Kiev') || tz.includes('Kyiv')) return 'Ukraine';
    if (tz.includes('Prague')) return 'Czechia';
    if (tz.includes('Bucharest')) return 'Romania';
    if (tz.includes('Budapest')) return 'Hungary';
  }
  if (tz.startsWith('Asia/')) {
    if (tz.includes('Kolkata') || tz.includes('Calcutta') || tz.includes('Delhi') || tz.includes('Mumbai')) return 'India';
    if (tz.includes('Tokyo')) return 'Japan';
    if (tz.includes('Singapore')) return 'Singapore';
    if (tz.includes('Shanghai') || tz.includes('Beijing') || tz.includes('Chongqing') || tz.includes('Harbin')) return 'China';
    if (tz.includes('Hong_Kong')) return 'Hong Kong';
    if (tz.includes('Taipei')) return 'Taiwan';
    if (tz.includes('Seoul')) return 'South Korea';
    if (tz.includes('Dubai')) return 'United Arab Emirates';
    if (tz.includes('Riyadh')) return 'Saudi Arabia';
    if (tz.includes('Jerusalem')) return 'Israel';
    if (tz.includes('Bangkok')) return 'Thailand';
    if (tz.includes('Jakarta')) return 'Indonesia';
    if (tz.includes('Manila')) return 'Philippines';
    if (tz.includes('Ho_Chi_Minh') || tz.includes('Saigon')) return 'Vietnam';
    if (tz.includes('Karachi')) return 'Pakistan';
    if (tz.includes('Dhaka')) return 'Bangladesh';
    if (tz.includes('Qatar') || tz.includes('Doha')) return 'Qatar';
    if (tz.includes('Kuwait')) return 'Kuwait';
    if (tz.includes('Colombo')) return 'Sri Lanka';
    if (tz.includes('Kathmandu')) return 'Nepal';
  }
  if (tz.startsWith('Australia/')) {
    return 'Australia';
  }
  if (tz.startsWith('Africa/')) {
    if (tz.includes('Cairo')) return 'Egypt';
    if (tz.includes('Johannesburg')) return 'South Africa';
    if (tz.includes('Lagos')) return 'Nigeria';
    if (tz.includes('Nairobi')) return 'Kenya';
    if (tz.includes('Casablanca')) return 'Morocco';
  }
  if (tz.startsWith('Pacific/')) {
    if (tz.includes('Auckland')) return 'New Zealand';
  }
  return '';
}


export interface UseTimezoneClockParams {
  initialClock1?: ClockState;
  initialClock2?: ClockState;
  storageKeyPrefix?: string;
  showTimezoneMode?: boolean;
  persistSelection?: boolean;
}

export function useTimezoneClock({
  initialClock1,
  initialClock2,
  storageKeyPrefix = 'wc_home',
  showTimezoneMode = false,
  persistSelection = true
}: UseTimezoneClockParams = {}) {
  const [mounted, setMounted] = useState(false);
  const [currentTime, setCurrentTime] = useState<DateTime | null>(null);

  const c1Key = `${storageKeyPrefix}_c1`;
  const ct1Key = `${storageKeyPrefix}_ct1`;
  const z1Key = `${storageKeyPrefix}_z1`;
  const c2Key = `${storageKeyPrefix}_c2`;
  const ct2Key = `${storageKeyPrefix}_ct2`;
  const z2Key = `${storageKeyPrefix}_z2`;

  const [clock1, setClock1] = useState<ClockState>(() => {
    if (initialClock1) {
      if (initialClock1.timezone === 'local') {
        return {
          city: 'London',
          country: 'United Kingdom',
          timezone: 'Europe/London'
        };
      }
      return initialClock1;
    }
    return {
      city: 'London',
      country: 'United Kingdom',
      timezone: 'Europe/London'
    };
  });

  const [clock2, setClock2] = useState<ClockState>(() => {
    if (initialClock2) {
      if (initialClock2.timezone === 'local') {
        return {
          city: 'New York',
          country: 'United States',
          timezone: 'America/New_York'
        };
      }
      return initialClock2;
    }
    return {
      city: 'New York',
      country: 'United States',
      timezone: 'America/New_York'
    };
  });

  const [activeSearchIndex, setActiveSearchIndex] = useState<1 | 2 | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<{ label: string; timezone: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const searchPanelRef = useRef<HTMLDivElement>(null);

  const closeSearch = useCallback(() => {
    setActiveSearchIndex(null);
    setSearchQuery('');
  }, []);

  useEffect(() => {
    if (activeSearchIndex === null) return;

    const handlePointerDown = (e: PointerEvent) => {
      if (searchPanelRef.current && !searchPanelRef.current.contains(e.target as Node)) {
        closeSearch();
      }
    };

    document.addEventListener('pointerdown', handlePointerDown);
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown);
    };
  }, [activeSearchIndex, closeSearch]);

  useEffect(() => {
    const animFrame = requestAnimationFrame(() => {
      setMounted(true);
      setCurrentTime(DateTime.now());

      // Read initial session storage safely
      try {
        if (persistSelection) {
          const c1 = sessionStorage.getItem(c1Key);
          const ct1 = sessionStorage.getItem(ct1Key);
          const z1 = sessionStorage.getItem(z1Key);
          const r1 = sessionStorage.getItem(`${storageKeyPrefix}_r1`);
          if (c1 && z1) {
            setClock1({ city: c1, country: ct1 || '', timezone: z1, region: r1 || undefined });
          } else if (initialClock1) {
            if (initialClock1.timezone === 'local') {
              try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
                if (showTimezoneMode) {
                  const dt = DateTime.now().setZone(tz);
                  const abbr = dt.toFormat('ZZZZ') || 'Local';
                  const fullName = dt.offsetNameLong || tz;
                  setClock1({ city: abbr, country: fullName, timezone: tz, region: 'Local Time Zone' });
                } else {
                  const match = ZONE_SEARCH_INDEX.find(item => item.zone.toLowerCase() === tz.toLowerCase());
                  let city = match ? match.label : (tz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time');
                  if (city.toLowerCase() === 'calcutta') {
                    city = 'Kolkata';
                  }
                  const country = getCountryFromTimezone(tz) || 'Local Time Zone';
                  setClock1({ city, country, timezone: tz });
                }
              } catch {
                setClock1({ city: 'London', country: 'United Kingdom', timezone: 'Europe/London' });
              }
            } else {
              setClock1(initialClock1);
            }
          }
        } else if (initialClock1) {
          if (initialClock1.timezone === 'local') {
            try {
              const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
              if (showTimezoneMode) {
                const dt = DateTime.now().setZone(tz);
                const abbr = dt.toFormat('ZZZZ') || 'Local';
                const fullName = dt.offsetNameLong || tz;
                setClock1({ city: abbr, country: fullName, timezone: tz, region: 'Local Time Zone' });
              } else {
                const match = ZONE_SEARCH_INDEX.find(item => item.zone.toLowerCase() === tz.toLowerCase());
                let city = match ? match.label : (tz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time');
                if (city.toLowerCase() === 'calcutta') {
                  city = 'Kolkata';
                }
                const country = getCountryFromTimezone(tz) || 'Local Time Zone';
                setClock1({ city, country, timezone: tz });
              }
            } catch {
              setClock1({ city: 'London', country: 'United Kingdom', timezone: 'Europe/London' });
            }
          } else {
            setClock1(initialClock1);
          }
        }

        if (persistSelection) {
          const c2 = sessionStorage.getItem(c2Key);
          const ct2 = sessionStorage.getItem(ct2Key);
          const z2 = sessionStorage.getItem(z2Key);
          const r2 = sessionStorage.getItem(`${storageKeyPrefix}_r2`);
          if (c2 && z2) {
            setClock2({ city: c2, country: ct2 || '', timezone: z2, region: r2 || undefined });
          } else if (initialClock2) {
            if (initialClock2.timezone === 'local') {
              try {
                const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
                if (showTimezoneMode) {
                  const dt = DateTime.now().setZone(tz);
                  const abbr = dt.toFormat('ZZZZ') || 'Local';
                  const fullName = dt.offsetNameLong || tz;
                  setClock2({ city: abbr, country: fullName, timezone: tz, region: 'Local Time Zone' });
                } else {
                  const city = tz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time';
                  setClock2({ city, country: 'Local Time Zone', timezone: tz });
                }
              } catch {
                setClock2({ city: 'New York', country: 'United States', timezone: 'America/New_York' });
              }
            } else {
              setClock2(initialClock2);
            }
          }
        } else if (initialClock2) {
          if (initialClock2.timezone === 'local') {
            try {
              const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/New_York';
              if (showTimezoneMode) {
                const dt = DateTime.now().setZone(tz);
                const abbr = dt.toFormat('ZZZZ') || 'Local';
                const fullName = dt.offsetNameLong || tz;
                setClock2({ city: abbr, country: fullName, timezone: tz, region: 'Local Time Zone' });
              } else {
                const city = tz.split('/').pop()?.replace(/_/g, ' ') || 'Local Time';
                setClock2({ city, country: 'Local Time Zone', timezone: tz });
              }
            } catch {
              setClock2({ city: 'New York', country: 'United States', timezone: 'America/New_York' });
            }
          } else {
            setClock2(initialClock2);
          }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
            const list = data.results.map((item: { name: string; admin1?: string; country?: string; timezone?: string }) => {
              const tz = item.timezone || 'UTC';
              let name = item.name;
              if (name.toLowerCase() === 'calcutta') {
                name = 'Kolkata';
              }
              return {
                label: `${name}${item.admin1 ? `, ${item.admin1}` : ''}${item.country ? `, ${item.country}` : ''}`,
                timezone: tz
              };
            });
            setSuggestions(deduplicateSuggestions(list));
          } else {
            setSuggestions([]);
          }
          setIsLoading(false);
        })
        .catch(() => {
          const matches = ZONE_SEARCH_INDEX
            .filter(item => item.key.includes(q) || item.zone.toLowerCase().includes(q))
            .map(item => {
              let label = item.label;
              if (label.toLowerCase() === 'calcutta') {
                label = 'Kolkata';
              }
              return {
                label: `${label} (${item.zone})`,
                timezone: item.zone
              };
            });
          setSuggestions(deduplicateSuggestions(matches).slice(0, 5));
          setIsLoading(false);
        });
    }, 300);

    return () => clearTimeout(fetchTimer);
  }, [searchQuery]);

  const handleSelectLocation = useCallback((sug: { label: string; timezone: string }) => {
    const parts = sug.label.split(',').map(p => p.trim());
    let cityName = parts[0];
    if (cityName.toLowerCase() === 'calcutta') {
      cityName = 'Kolkata';
    }
    const countryName = parts.slice(1).join(', ') || sug.timezone;

    let targetState: ClockState;

    if (showTimezoneMode) {
      try {
        const dt = DateTime.now().setZone(sug.timezone);
        const abbr = dt.toFormat('ZZZZ') || cityName;
        const fullName = dt.offsetNameLong || sug.timezone;
        targetState = {
          city: abbr,
          country: fullName,
          timezone: sug.timezone,
          region: countryName
        };
      } catch {
        targetState = {
          city: cityName,
          country: countryName,
          timezone: sug.timezone,
          region: countryName
        };
      }
    } else {
      targetState = {
        city: cityName,
        country: countryName,
        timezone: sug.timezone
      };
    }

    if (activeSearchIndex === 1) {
      setClock1(targetState);
      if (persistSelection) {
        try {
          sessionStorage.setItem(c1Key, targetState.city);
          sessionStorage.setItem(ct1Key, targetState.country);
          sessionStorage.setItem(z1Key, targetState.timezone);
          if (targetState.region) {
            sessionStorage.setItem(`${storageKeyPrefix}_r1`, targetState.region);
          }
        } catch {}
      }
    } else if (activeSearchIndex === 2) {
      setClock2(targetState);
      if (persistSelection) {
        try {
          sessionStorage.setItem(c2Key, targetState.city);
          sessionStorage.setItem(ct2Key, targetState.country);
          sessionStorage.setItem(z2Key, targetState.timezone);
          if (targetState.region) {
            sessionStorage.setItem(`${storageKeyPrefix}_r2`, targetState.region);
          }
        } catch {}
      }
    }

    setActiveSearchIndex(null);
    setSearchQuery('');
  }, [activeSearchIndex, c1Key, ct1Key, z1Key, c2Key, ct2Key, z2Key, storageKeyPrefix, showTimezoneMode, persistSelection]);

  const handlePresetClick = useCallback((city: string) => {
    let zone = 'UTC';
    let country = '';
    if (city === 'London') { zone = 'Europe/London'; country = 'United Kingdom'; }
    else if (city === 'New York') { zone = 'America/New_York'; country = 'United States'; }
    else if (city === 'Tokyo') { zone = 'Asia/Tokyo'; country = 'Japan'; }
    else if (city === 'Sydney') { zone = 'Australia/Sydney'; country = 'Australia'; }
    else if (city === 'Mumbai') { zone = 'Asia/Kolkata'; country = 'India'; }
    else if (city === 'Paris') { zone = 'Europe/Paris'; country = 'France'; }

    handleSelectLocation({ label: `${city}, ${country}`, timezone: zone });
  }, [handleSelectLocation]);

  const handleSwap = useCallback(() => {
    const temp1 = clock1;
    const temp2 = clock2;
    setClock1(temp2);
    setClock2(temp1);
    if (persistSelection) {
      try {
        sessionStorage.setItem(c1Key, temp2.city);
        sessionStorage.setItem(ct1Key, temp2.country);
        sessionStorage.setItem(z1Key, temp2.timezone);
        if (temp2.region) {
          sessionStorage.setItem(`${storageKeyPrefix}_r1`, temp2.region);
        } else {
          sessionStorage.removeItem(`${storageKeyPrefix}_r1`);
        }

        sessionStorage.setItem(c2Key, temp1.city);
        sessionStorage.setItem(ct2Key, temp1.country);
        sessionStorage.setItem(z2Key, temp1.timezone);
        if (temp1.region) {
          sessionStorage.setItem(`${storageKeyPrefix}_r2`, temp1.region);
        } else {
          sessionStorage.removeItem(`${storageKeyPrefix}_r2`);
        }
      } catch {}
    }
  }, [clock1, clock2, c1Key, ct1Key, z1Key, c2Key, ct2Key, z2Key, storageKeyPrefix, persistSelection]);

  return {
    mounted,
    currentTime,
    clock1,
    clock2,
    setClock1,
    setClock2,
    activeSearchIndex,
    setActiveSearchIndex,
    searchQuery,
    setSearchQuery,
    suggestions,
    isLoading,
    searchPanelRef,
    closeSearch,
    handleSelectLocation,
    handlePresetClick,
    handleSwap
  };
}
