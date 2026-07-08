'use client';

import React, { useState, useEffect } from 'react';
import { DateTime } from 'luxon';
import { TimeMatrixHour, resolveTimeZone } from '@/utils/timezone';

interface ShareMenuProps {
  cities: string[];
  matrix: TimeMatrixHour[];
  selectedDate?: string;
  isCompact?: boolean;
  isMobileGrid?: boolean;
}

export default function ShareMenu({ cities, matrix, selectedDate, isCompact = false, isMobileGrid = false }: ShareMenuProps) {
  const [toast, setToast] = useState<{ show: boolean; message: string }>({
    show: false,
    message: '',
  });

  // Automatically hide the toast after 2.5 seconds
  useEffect(() => {
    if (toast.show) {
      const timer = setTimeout(() => {
        setToast({ show: false, message: '' });
      }, 2500);
      return () => clearTimeout(timer);
    }
  }, [toast.show]);

  // Copy standard browser URL to clipboard
  const handleCopyLink = async () => {
    try {
      const currentUrl = window.location.href;
      await navigator.clipboard.writeText(currentUrl);
      setToast({ show: true, message: 'Meeting link copied to clipboard!' });
    } catch {
      setToast({ show: true, message: 'Failed to copy link. Please copy it from the address bar.' });
    }
  };

  // Generate plain-text Slack/Email summary of Golden Hours
  const handleCopySlackSummary = async () => {
    const currentUrl = window.location.href;
    const dateObj = selectedDate ? DateTime.fromISO(selectedDate) : DateTime.now();
    const dateStr = dateObj.toFormat('EEEE, LLLL dd, yyyy');

    // Find UTC hours where ALL cities are in local working hours (using precomputed isWorking status)
    const goldenHours = matrix.filter((row) => {
      return cities.every((city) => {
        const cell = row.cities[city];
        return cell && cell.isWorking;
      });
    });

    // Group sequential hours into meeting slots
    const ranges: { start: number; end: number }[] = [];
    let currentRange: { start: number; end: number } | null = null;

    goldenHours.forEach((hour) => {
      if (!currentRange) {
        currentRange = { start: hour.utcHour, end: hour.utcHour };
      } else if (hour.utcHour === currentRange.end + 1) {
        currentRange.end = hour.utcHour;
      } else {
        ranges.push(currentRange);
        currentRange = { start: hour.utcHour, end: hour.utcHour };
      }
    });
    if (currentRange) {
      ranges.push(currentRange);
    }

    const cityListStr = cities.join(', ');
    let summaryText = '';

    if (ranges.length === 0) {
      summaryText = [
        `Hello team,`,
        ``,
        `To align our upcoming meeting across our locations (${cityListStr}), we analyzed the timezone differences for ${dateStr}.`,
        `Currently, there are no overlapping working hours local time across all regions.`,
        ``,
        `Please view the interactive timezone timeline comparison below to coordinate a custom slot:`,
        `${currentUrl}`,
        ``,
        `Thank you!`
      ].join('\n');
    } else {
      const baseUtc = DateTime.utc().startOf('day');
      const rangeListText = ranges.map((r, index) => {
        const startUtc = baseUtc.plus({ hours: r.start });
        const endUtc = baseUtc.plus({ hours: r.end + 1 });
        
        const cityLocalStrings = cities.map((city) => {
          const zone = resolveTimeZone(city);
          const localStart = startUtc.setZone(zone);
          const localEnd = endUtc.setZone(zone);
          
          return `${localStart.toFormat('h:mm a')} - ${localEnd.toFormat('h:mm a')} ${localStart.offsetNameShort} (${city})`;
        });

        return `• Option ${index + 1}: ${cityLocalStrings.join(' | ')}`;
      }).join('\n');

      summaryText = [
        `Hello team,`,
        ``,
        `To align our upcoming meeting across our locations (${cityListStr}), we have analyzed the overlapping working hours and identified the following optimal slot options for ${dateStr}:`,
        ``,
        rangeListText,
        ``,
        `You can view the interactive timezone timeline comparison or customize this schedule at:`,
        `${currentUrl}`,
        ``,
        `Please choose the option that works best for you. Thank you!`
      ].join('\n');
    }

    try {
      await navigator.clipboard.writeText(summaryText);
      setToast({ show: true, message: 'Slack/Email summary copied!' });
    } catch {
      setToast({ show: true, message: 'Failed to generate summary.' });
    }
  };  if (isMobileGrid) {
    return (
      <div className="grid grid-cols-2 gap-3 w-full md:hidden mt-5 mb-4">
        {/* Button 1: World Clock (Teal) */}
        <a
          href="#world-clock"
          className="h-12 flex items-center justify-center gap-1.5 bg-teal-500/10 dark:bg-teal-500/10 backdrop-blur-md border border-teal-200/50 dark:border-teal-500/20 shadow-md dark:shadow-lg dark:shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-xl text-center text-sm active:scale-[0.98] active:bg-teal-500/20 transition-all duration-200 cursor-pointer w-full px-2 text-teal-600 dark:text-teal-400 font-bold"
        >
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <span>World Clock</span>
        </a>

        {/* Button 2: Start Meeting Planner (Teal) */}
        <a
          href="#meeting-planner"
          className="h-12 flex items-center justify-center gap-1.5 bg-teal-500/10 dark:bg-teal-500/10 backdrop-blur-md border border-teal-200/50 dark:border-teal-500/20 shadow-md dark:shadow-lg dark:shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-xl text-center text-sm active:scale-[0.98] active:bg-teal-500/20 transition-all duration-200 cursor-pointer w-full px-2 text-teal-600 dark:text-teal-400 font-bold"
        >
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Planner</span>
        </a>

        {/* Button 3: Copy Link (Teal) */}
        <button
          onClick={handleCopyLink}
          className="h-12 flex items-center justify-center gap-1.5 bg-teal-500/10 dark:bg-teal-500/10 backdrop-blur-md border border-teal-200/50 dark:border-teal-500/20 shadow-md dark:shadow-lg dark:shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-xl text-center text-sm active:scale-[0.98] active:bg-teal-500/20 transition-all duration-200 cursor-pointer w-full px-2 text-teal-600 dark:text-teal-400 font-bold"
        >
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
          </svg>
          <span>Copy Link</span>
        </button>

        {/* Button 4: Copy Text (Teal) */}
        <button
          onClick={handleCopySlackSummary}
          className="h-12 flex items-center justify-center gap-1.5 bg-teal-500/10 dark:bg-teal-500/10 backdrop-blur-md border border-teal-200/50 dark:border-teal-500/20 shadow-md dark:shadow-lg dark:shadow-black/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4)] dark:shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1)] rounded-xl text-center text-sm active:scale-[0.98] active:bg-teal-500/20 transition-all duration-200 cursor-pointer w-full px-2 text-teal-600 dark:text-teal-400 font-bold"
        >
          <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span>Copy Text</span>
        </button>

        {/* Floating Toast Notification */}
        {toast.show && (
          <div className="fixed bottom-6 right-6 bg-teal-500 text-slate-955 px-4 py-3 rounded-xl shadow-2xl border border-teal-400 z-50 flex items-center gap-2.5 animate-bounce font-extrabold text-xs">
            <svg className="w-4 h-4 text-slate-955" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
            {toast.message}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`flex ${isCompact ? 'flex-row gap-2' : 'flex-row md:flex-row gap-1.5 md:gap-3'} items-center md:items-center w-full md:w-auto`}>
      {/* Copy Link Button */}
      <button
        onClick={handleCopyLink}
        className={`flex items-center justify-center md:justify-start gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 hover:border-slate-350 dark:hover:border-slate-700 text-slate-750 dark:text-slate-200 hover:text-slate-950 dark:hover:text-white rounded-lg text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer font-bold ${
          isCompact ? 'px-3 py-1.5 w-auto md:text-sm text-xs' : 'flex-1 md:flex-none px-3 md:px-4 py-2 w-full md:w-auto'
        }`}
      >
        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
        </svg>
        <span className="hidden md:inline">Copy Meeting Link</span>
        <span className="inline md:hidden">Copy Link</span>
      </button>

      {/* Copy Slack Summary Button */}
      <button
        onClick={handleCopySlackSummary}
        className={`flex items-center justify-center md:justify-start gap-2 bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-white/10 hover:border-slate-350 dark:hover:border-slate-700 text-slate-750 dark:text-slate-200 hover:text-slate-955 dark:hover:text-white rounded-lg text-xs md:text-sm transition-all shadow-md active:scale-95 cursor-pointer font-bold ${
          isCompact ? 'px-3 py-1.5 w-auto md:text-sm text-xs' : 'flex-1 md:flex-none px-3 md:px-4 py-2 w-full md:w-auto'
        }`}
      >
        <svg className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
        <span className="hidden md:inline">Copy for Slack/Email</span>
        <span className="inline md:hidden">Copy Text</span>
      </button>

      {/* Floating Toast Notification */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 bg-teal-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl border border-teal-400 z-50 flex items-center gap-2.5 animate-bounce font-extrabold text-xs">
          <svg className="w-4 h-4 text-slate-955" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
          {toast.message}
        </div>
      )}
    </div>
  );
}
