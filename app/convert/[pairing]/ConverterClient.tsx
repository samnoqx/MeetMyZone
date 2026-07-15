'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DateTime } from 'luxon';
import { generateTimezoneMatrix, resolveTimeZone } from '@/utils/timezone';
import TimezoneTimeline from '@/components/TimezoneTimeline';
import WorldClock from '@/components/WorldClock';
import { getSlugForCityAndZone } from '@/utils/seoResolver';
import { useRouter } from 'next/navigation';


interface ConverterClientProps {
  initialCities: string[];
  initialCityTimezones: Record<string, string>;
  initialReferenceCity: string;
}

export default function ConverterClient({
  initialCities,
  initialCityTimezones,
  initialReferenceCity
}: ConverterClientProps) {
  // Primary configuration state (locked to the conversion pairing timezones, but customizable to cities within them)
  const [cities, setCities] = useState<string[]>(initialCities);
  const [cityTimezones, setCityTimezones] = useState<Record<string, string>>(initialCityTimezones);
  const [referenceCity, setReferenceCity] = useState<string>(initialReferenceCity);
  const router = useRouter();

  const handleWorldClockSelectionChange = (index: 1 | 2, cityName: string, timezoneName: string) => {
    const currentCities = [...cities];
    const currentZones = [cityTimezones[cities[0]], cityTimezones[cities[1]]];
    
    const cityClean = cityName.split(',')[0].trim();
    if (index === 1) {
      currentCities[0] = cityClean;
      currentZones[0] = timezoneName;
    } else {
      currentCities[1] = cityClean;
      currentZones[1] = timezoneName;
    }
    
    // Update local state instantly for lag-free visual transitions
    setCities(currentCities);
    setCityTimezones({
      [currentCities[0]]: currentZones[0],
      [currentCities[1]]: currentZones[1]
    });

    const slugA = getSlugForCityAndZone(currentCities[0], currentZones[0]);
    const slugB = getSlugForCityAndZone(currentCities[1], currentZones[1]);
    
    router.push(`/convert/${slugA}-to-${slugB}`);
  };
  
  // Date State: starts with today's date
  const [selectedDate, setSelectedDate] = useState<string>(DateTime.now().toISODate()!);
  const [is24Hour, setIs24Hour] = useState<boolean>(true);
  const [currentRefHour, setCurrentRefHour] = useState<number>(0);

  // Synchronize current reference city local hour for red indicator line
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

  // Compute reordered cities list: referenceCity always at the first row
  const orderedCities = useMemo(() => {
    const firstCity = referenceCity;
    const remaining = cities.filter(c => c !== firstCity);
    return [firstCity, ...remaining];
  }, [cities, referenceCity]);

  // Default work hours constants for matrix generation (removed interactive controls)
  const workHourStart = 9;
  const workHourEnd = 17;

  // Generate comparison matrix based on current configuration
  const matrix = useMemo(() => {
    return generateTimezoneMatrix(
      cities,
      referenceCity,
      workHourStart,
      workHourEnd,
      selectedDate,
      cityTimezones
    );
  }, [cities, referenceCity, selectedDate, cityTimezones]);

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Reusable World Clock & Location Search component */}
      <WorldClock
        initialCity1={cities[0]}
        initialZone1={cityTimezones[cities[0]]}
        initialCity2={cities[1]}
        initialZone2={cityTimezones[cities[1]]}
        isConverterPage={true}
        onSelectionChange={handleWorldClockSelectionChange}
      />

      {/* Dynamic Timeline Wrapper */}
      <div className="premium-card premium-card-static p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div className="flex flex-wrap items-center gap-4">
            <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <svg className="w-4 h-4 text-brand-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Interactive Timeline Comparison
            </h2>

            {/* Format selector */}
            <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl p-0.5">
              <button
                onClick={() => setIs24Hour(false)}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${!is24Hour
                  ? 'bg-white dark:bg-slate-900 text-teal-650 dark:text-teal-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-455 hover:text-slate-800'
                  }`}
              >
                12H
              </button>
              <button
                onClick={() => setIs24Hour(true)}
                className={`px-2 py-1 text-[10px] font-black rounded-lg transition-all cursor-pointer ${is24Hour
                  ? 'bg-white dark:bg-slate-900 text-teal-655 dark:text-teal-400 shadow-sm'
                  : 'text-slate-500 dark:text-slate-455 hover:text-slate-800'
                  }`}
              >
                24H
              </button>
            </div>

            {/* Time Reference */}
            <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-800 px-2.5 py-1 rounded-xl">
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Time reference:</span>
              <select
                value={referenceCity}
                onChange={(e) => setReferenceCity(e.target.value)}
                className="bg-transparent text-[11px] text-slate-805 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
              >
                {cities.map((city) => (
                  <option key={`ref-city-${city}`} value={city} className="bg-white dark:bg-slate-950">
                    {city}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3.5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-50/20 dark:bg-white border border-amber-200/60 dark:border-slate-200 rounded-sm" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Day</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-150 dark:bg-slate-900 rounded-sm border border-slate-300 dark:border-slate-800" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Night</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-brand-accent/25 border border-brand-accent rounded-sm" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Current Hour</span>
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

    </div>
  );
}
