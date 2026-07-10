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
  const [workHourStart, setWorkHourStart] = useState<number>(9);
  const [workHourEnd, setWorkHourEnd] = useState<number>(17);

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

  // Event scheduling modal states
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState<boolean>(false);
  const [activeSchedulingSlot, setActiveSchedulingSlot] = useState<{ formattedUtc: string; utcHour: number } | null>(null);
  const [eventTitle, setEventTitle] = useState<string>('Aligned Sync Meeting');
  const [eventDescription, setEventDescription] = useState<string>('');
  const [eventDuration, setEventDuration] = useState<number>(60);
  const [isShareCopied, setIsShareCopied] = useState<boolean>(false);

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
  }, [cities, referenceCity, workHourStart, workHourEnd, selectedDate, cityTimezones]);

  // Compute recommended slot options based on working hours overlap
  const recommendedSlots = useMemo(() => {
    const slots = matrix.map((row) => {
      const workingCities = cities.filter((city) => {
        const cell = row.cities[city];
        return cell ? cell.isWorking : false;
      });

      return {
        utcHour: row.utcHour,
        formattedUtc: row.formattedUtcTime,
        workingCities,
        score: workingCities.length,
      };
    });

    return slots
      .filter((slot) => slot.score > 0)
      .sort((a, b) => b.score - a.score || a.utcHour - b.utcHour)
      .slice(0, 4);
  }, [cities, matrix]);

  // Hours formatter for select dropdown labels
  const formatHourLabel = (h: number) => {
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${displayHour} ${period}`;
  };

  // Open scheduling modal for a slot
  const handleOpenSchedulerModal = (slot: { formattedUtc: string; utcHour: number }) => {
    setActiveSchedulingSlot(slot);
    setIsScheduleModalOpen(true);
  };

  // Download ICS File for a slot using customized values (RFC 5545 compliant)
  const downloadIcsFile = (slot: { formattedUtc: string; utcHour: number }) => {
    if (typeof window === 'undefined' || !selectedDate) return;
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
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

  // Download trigger
  const handleDownloadInvite = () => {
    if (activeSchedulingSlot) {
      downloadIcsFile(activeSchedulingSlot);
      setIsScheduleModalOpen(false);
    }
  };

  // Generate Google Calendar Link for a slot using customized values
  const getGoogleCalendarUrl = (slot: { formattedUtc: string; utcHour: number }) => {
    if (typeof window === 'undefined' || !selectedDate) return '';
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: slot.utcHour });
    const endLocal = startLocal.plus({ minutes: eventDuration });

    const startUtcStr = startLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");
    const endUtcStr = endLocal.toUTC().toFormat("yyyyMMdd'T'HHmmss'Z'");

    const title = encodeURIComponent(eventTitle || "Aligned Sync Meeting");
    const details = encodeURIComponent(eventDescription || `MeetMyZone: ${window.location.href}`);
    return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startUtcStr}/${endUtcStr}&details=${details}`;
  };

  // Copy customized meeting summary copy to clipboard
  const handleShareEvent = async () => {
    if (!activeSchedulingSlot) return;
    const refZone = cityTimezones[referenceCity] || resolveTimeZone(referenceCity);
    const startLocal = DateTime.fromISO(selectedDate, { zone: refZone }).startOf('day').plus({ hours: activeSchedulingSlot.utcHour });
    const endLocal = startLocal.plus({ minutes: eventDuration });

    const dateStr = startLocal.toFormat('EEEE, LLLL dd, yyyy');
    const currentUrl = window.location.href;

    const cityLocalStrings = orderedCities.map((city) => {
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

  return (
    <div className="w-full flex flex-col gap-8">
      {/* Settings Control Panel Bar */}
      <div className="premium-card p-5 rounded-2xl border border-slate-300 dark:border-slate-805 bg-white dark:bg-slate-900 flex flex-wrap gap-4 md:gap-6 items-center justify-between md:justify-start relative z-30">
        

        {/* Date Selector */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-1.5 rounded-xl">
          <svg className="w-4 h-4 text-teal-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <input
            type="date"
            aria-label="Planning Date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="bg-transparent text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 outline-none border-none cursor-pointer"
          />
        </div>

        {/* Format selector */}
        <div className="flex bg-slate-100 dark:bg-slate-950 border border-slate-200 dark:border-slate-850 rounded-xl p-0.5">
          <button
            onClick={() => setIs24Hour(false)}
            className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${!is24Hour
              ? 'bg-white dark:bg-slate-900 text-teal-650 dark:text-teal-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-455 hover:text-slate-800'
              }`}
          >
            12H
          </button>
          <button
            onClick={() => setIs24Hour(true)}
            className={`px-3 py-1 text-[11px] font-black rounded-lg transition-all cursor-pointer ${is24Hour
              ? 'bg-white dark:bg-slate-900 text-teal-655 dark:text-teal-400 shadow-sm'
              : 'text-slate-500 dark:text-slate-455 hover:text-slate-800'
              }`}
          >
            24H
          </button>
        </div>

      </div>

      {/* Reusable World Clock & Location Search component */}
      <WorldClock
        initialCity1={cities[0]}
        initialZone1={cityTimezones[cities[0]]}
        initialCity2={cities[1]}
        initialZone2={cityTimezones[cities[1]]}
        isConverterPage={true}
        onSelectionChange={handleWorldClockSelectionChange}
      />

      {/* Time Reference + Working Hours Controls */}
      <div className="premium-card p-5 rounded-2xl border border-slate-300 dark:border-slate-805 bg-white dark:bg-slate-900 flex flex-wrap gap-4 md:gap-6 items-center justify-start relative z-20">
        {/* Reference Timezone select */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Time reference:</span>
          <select
            value={referenceCity}
            onChange={(e) => setReferenceCity(e.target.value)}
            className="bg-transparent text-xs sm:text-sm text-slate-800 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
          >
            {cities.map((city) => (
              <option key={`ref-city-${city}`} value={city} className="bg-white dark:bg-slate-950">
                {city}
              </option>
            ))}
          </select>
        </div>

        {/* Work Hours Settings */}
        <div className="flex items-center gap-1.5 bg-slate-50 dark:bg-slate-950 border border-slate-200/60 dark:border-slate-850 px-3 py-1.5 rounded-xl">
          <span className="text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">Work Hours:</span>
          <select
            value={workHourStart}
            onChange={(e) => setWorkHourStart(parseInt(e.target.value))}
            className="bg-transparent text-xs sm:text-sm text-slate-805 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <option key={`start-h-${i}`} value={i} className="bg-white dark:bg-slate-950">
                {formatHourLabel(i)}
              </option>
            ))}
          </select>
          <span className="text-slate-400 dark:text-slate-650 font-bold">to</span>
          <select
            value={workHourEnd}
            onChange={(e) => setWorkHourEnd(parseInt(e.target.value))}
            className="bg-transparent text-xs sm:text-sm text-slate-805 dark:text-slate-200 focus:outline-none cursor-pointer font-bold border-none"
          >
            {Array.from({ length: 24 }).map((_, i) => (
              <option key={`end-h-${i}`} value={i} className="bg-white dark:bg-slate-950">
                {formatHourLabel(i)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Dynamic Timeline Wrapper */}
      <div className="premium-card p-5 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <h2 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <svg className="w-4 h-4 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Interactive Timeline Comparison
          </h2>
          <div className="flex flex-wrap items-center gap-3.5 text-[10px] sm:text-xs">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-amber-50/20 dark:bg-white border border-amber-200/60 dark:border-slate-200 rounded-sm" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Work Hours</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-slate-150 dark:bg-slate-900 rounded-sm border border-slate-300 dark:border-slate-800" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Night</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 bg-red-500/25 border border-red-500 rounded-sm" />
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

      {/* Recommended Meeting Slots section */}
      <div className="premium-card p-6 rounded-2xl border border-slate-300 dark:border-slate-800 bg-white dark:bg-[#0f172a] flex flex-col gap-4">
        <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-205 dark:border-slate-800 pb-3">
          <svg className="w-4 h-4 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          Best Matching Meeting Slots
        </h3>

        {recommendedSlots.length === 0 ? (
          <div className="text-xs text-slate-600 dark:text-slate-400 py-6 text-center">
            No overlapping business-hour slots found for this date.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {recommendedSlots.map((slot, index) => {
              const isPerfect = slot.score === cities.length;
              return (
                <div
                  key={`slot-${slot.utcHour}`}
                  className="p-4 border rounded-xl flex flex-col justify-between gap-3 transition-all bg-emerald-50/20 dark:bg-emerald-950/20 border-emerald-500/30 dark:border-emerald-500/40 ring-1 ring-emerald-500/10 dark:ring-emerald-500/30 shadow-sm hover:scale-[1.01]"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                      {slot.formattedUtc}
                    </span>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${isPerfect
                      ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border-emerald-250 dark:border-emerald-800/60 font-bold'
                      : 'bg-slate-205 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-700'
                      }`}>
                      {slot.score}/{cities.length} Slots
                    </span>
                  </div>

                  <div className="flex flex-col gap-1.5 border-t border-slate-200 dark:border-slate-800 pt-2">
                    {orderedCities.map((city) => {
                      const cell = matrix[slot.utcHour]?.cities[city];
                      if (!cell) return null;
                      return (
                        <div key={`slot-city-${city}`} className="flex items-center justify-between text-xs">
                          <span className="text-slate-700 dark:text-slate-200 max-w-[8rem] truncate font-semibold" title={city}>{city}</span>
                          <span className={`font-mono ${cell.isWorking
                            ? 'text-emerald-700 dark:text-emerald-400 font-bold'
                            : 'text-slate-500 dark:text-slate-400'
                            }`}>
                            {cell.localTime}
                          </span>
                        </div>
                      );
                    })}
                  </div>

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
                    <div className="mt-1 flex items-center gap-1.5 text-[10px] text-emerald-600 dark:text-emerald-500 font-bold">
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

      {/* Event scheduler modal Dialog overlay */}
      {isScheduleModalOpen && activeSchedulingSlot && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm z-[99999] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#0f172a] border border-slate-300 dark:border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl flex flex-col gap-5 animate-in fade-in zoom-in-95 duration-200">
            
            <div className="flex justify-between items-start border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                  Schedule Event
                </h3>
                <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-400 font-bold tracking-wide mt-0.5">
                  Slot selected: {activeSchedulingSlot.formattedUtc} (UTC)
                </p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-white text-lg font-bold leading-none p-1 transition-colors cursor-pointer"
              >
                &times;
              </button>
            </div>

            <div className="flex flex-col gap-4 text-xs sm:text-sm">
              <div className="flex flex-col gap-1.5">
                <label htmlFor="event-title" className="font-bold text-slate-700 dark:text-slate-300">Event Title:</label>
                <input
                  type="text"
                  id="event-title"
                  value={eventTitle}
                  onChange={(e) => setEventTitle(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50 transition-all font-semibold"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="event-duration" className="font-bold text-slate-700 dark:text-slate-300">Duration (minutes):</label>
                <select
                  id="event-duration"
                  value={eventDuration}
                  onChange={(e) => setEventDuration(parseInt(e.target.value))}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50 transition-all font-semibold cursor-pointer"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>1 Hour</option>
                  <option value={90}>1.5 Hours</option>
                  <option value={120}>2 Hours</option>
                </select>
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="event-desc" className="font-bold text-slate-700 dark:text-slate-300">Description (optional):</label>
                <textarea
                  id="event-desc"
                  rows={3}
                  value={eventDescription}
                  onChange={(e) => setEventDescription(e.target.value)}
                  className="bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:border-teal-500/50 transition-all font-medium resize-none"
                  placeholder="Notes, agenda, or video links..."
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-end border-t border-slate-200 dark:border-slate-800 pt-4">
              <button
                onClick={handleShareEvent}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-900 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800 rounded-lg text-xs font-bold transition-all cursor-pointer text-slate-700 dark:text-slate-300"
              >
                {isShareCopied ? "Copied!" : "Copy Details"}
              </button>

              <a
                href={getGoogleCalendarUrl(activeSchedulingSlot)}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/30 dark:hover:bg-blue-950/50 border border-blue-200 dark:border-blue-900/40 rounded-lg text-xs font-bold transition-all text-blue-700 dark:text-blue-400 flex items-center gap-1.5"
              >
                Google Calendar
              </a>

              <button
                onClick={handleDownloadInvite}
                className="px-4 py-2 bg-teal-600 hover:bg-teal-500 text-white dark:text-slate-900 border border-teal-500 dark:border-teal-400 rounded-lg text-xs font-bold transition-all cursor-pointer"
              >
                Download Invite (.ics)
              </button>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
