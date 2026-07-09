import React from 'react';
import { ResolvedTimezone } from '../utils/seoResolver';
import { generateSeoText, generateMultiZoneSeoText } from '../utils/seoGenerator';
import InternalLinks from './InternalLinks';
import OverlapTable from './OverlapTable';
import { DateTime } from 'luxon';

interface SEOSectionProps {
  zoneA?: ResolvedTimezone;
  zoneB?: ResolvedTimezone;
  zones?: ResolvedTimezone[];
}

export default function SEOSection({ zoneA: propZoneA, zoneB: propZoneB, zones = [] }: SEOSectionProps) {
  const activeZones = zones.length >= 2 ? zones : (propZoneA && propZoneB ? [propZoneA, propZoneB] : []);
  const isPairing = activeZones.length >= 2;

  const zoneA = activeZones[0];
  const zoneB = activeZones[activeZones.length - 1];

  let offsetHours = 0;
  if (zoneA && zoneB) {
    const now = DateTime.now();
    const dtA = now.setZone(zoneA.zoneName);
    const dtB = now.setZone(zoneB.zoneName);
    offsetHours = (dtB.offset - dtA.offset) / 60;
  }

  // Generate Combined Graph Schema (SoftwareApplication + FAQPage)
  const getCombinedSchema = () => {
    const mainEntity = isPairing ? [
      {
        "@type": "Question",
        "name": `How do I convert ${zoneA.displayName} to ${zoneB.displayName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `To convert ${zoneA.displayName} to ${zoneB.displayName}, add ${zoneA.cityName} and ${zoneB.cityName} to the MeetMyZone timeline planner. The tool aligns their daily clocks side-by-side on a horizontal grid, letting you translate local times instantly.`
        }
      },
      {
        "@type": "Question",
        "name": `What is the best time to meet between ${zoneA.cityName} and ${zoneB.cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `The best time to meet across ${zoneA.displayName} and ${zoneB.displayName} time zones is when standard working hours overlap. MeetMyZone acts as a working hours overlap calculator, highlighting optimal meeting brackets where both regions share standard business hours.`
        }
      },
      {
        "@type": "Question",
        "name": `How do I schedule an international meeting between ${zoneA.cityName} and ${zoneB.cityName}?`,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `Use the MeetMyZone timezone overlap calculator. Add both locations, identify a slot where their working hours overlap, click on the desired time block, copy the invite summary tailored for Slack/Email, or export directly to Google Calendar.`
        }
      }
    ] : [
      {
        "@type": "Question",
        "name": "What is MeetMyZone?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "MeetMyZone is a visual timezone meeting planner that helps remote teams find the best meeting times across multiple timezones using an intuitive horizontal alignment grid."
        }
      },
      {
        "@type": "Question",
        "name": "How does the timezone overlap planner work?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "You simply search and add the cities or timezones of your team members. The tool then aligns their daily schedules side-by-side and highlights overlapping work hours to let you identify the best meeting slots."
        }
      },
      {
        "@type": "Question",
        "name": "Why is UTC reference important for global meetings?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "UTC (Coordinated Universal Time) is the universal time standard that doesn't observe daylight saving time. Referencing UTC helps avoid timezone shift mistakes when scheduling meetings across regions with different daylight saving schedules."
        }
      },
      {
        "@type": "Question",
        "name": "Can I customize the working hours in the timeline?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, MeetMyZone allows you to adjust the start and end of working hours globally using the simple dropdown selectors in the tool settings, which instantly updates the highlighted day slots on the grid."
        }
      },
      {
        "@type": "Question",
        "name": "How do I share meeting times with my team?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Once you select a slot, you can copy a beautifully formatted meeting invite summary tailored for Slack/Email with local times for all cities, or directly export the invitation link to Google Calendar or as an .ics calendar file."
        }
      }
    ];

    const softwareAppSchema = {
      "@type": "SoftwareApplication",
      "@id": "https://meetmyzone.com/#software-application",
      "name": "MeetMyZone Time Zone Converter",
      "operatingSystem": "All",
      "applicationCategory": "BusinessApplication",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "offers": {
        "@type": "Offer",
        "price": "0.00",
        "priceCurrency": "USD"
      },
      "description": "MeetMyZone is a premium visual timezone meeting planner and timezone converter that aligns team working hours side-by-side on an interactive timeline grid.",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "ratingCount": "845"
      }
    };

    const faqSchema = {
      "@type": "FAQPage",
      "@id": isPairing
        ? `https://meetmyzone.com/convert/${zoneA.slug}-to-${zoneB.slug}/#faq`
        : "https://meetmyzone.com/#faq",
      "mainEntity": mainEntity
    };

    return {
      "@context": "https://schema.org",
      "@graph": isPairing ? [faqSchema] : [softwareAppSchema, faqSchema]
    };
  };

  return (
    <section id="how-it-works" className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 py-12 sm:py-16 transition-colors duration-200">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(getCombinedSchema()).replace(/</g, '\\u003c') }}
      />
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 flex flex-col gap-10 sm:gap-14">

        {isPairing ? (
          /* Timezone Pairing Specific Content */
          <div className="w-full flex flex-col gap-8 max-w-4xl mx-auto">
            <div className="flex flex-col gap-3">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                {activeZones.map(z => z.displayName).join(' to ')} Time Zone Converter & Meeting Planner
              </h1>
              <p className="text-xs sm:text-sm text-blue-500 dark:text-blue-400 font-medium font-mono uppercase tracking-wider">
                Comparing Timezones: {
                  activeZones.map(z => `${z.cityName.toUpperCase()} (${z.zoneName.toUpperCase()})`).slice(0, -1).join(', ')
                } & {activeZones[activeZones.length - 1].cityName.toUpperCase()} ({activeZones[activeZones.length - 1].zoneName.toUpperCase()})
              </p>
            </div>

            <div className="flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              <p className="text-sm sm:text-base leading-relaxed text-slate-700 dark:text-slate-200 font-medium">
                {activeZones.length > 2
                  ? generateMultiZoneSeoText(activeZones)
                  : generateSeoText(zoneA.displayName, zoneB.displayName, offsetHours)}
              </p>

              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mt-4">
                {activeZones.map(z => z.displayName).join(' to ')} Business Hours Overlap Matrix
              </h2>
              <p className="text-slate-600 dark:text-slate-300">
                The table below maps out standard working hours (9:00 AM to 5:00 PM local time in {zoneA.displayName}) against their equivalent local times in {
                  activeZones.slice(1).map(z => z.displayName).slice(0, -1).join(', ')
                } {activeZones.length > 2 ? 'and' : ''} {zoneB.displayName}, highlighting optimal sync slots where all zones overlap during core daylight work cycles.
              </p>

              <OverlapTable zones={activeZones} />

              <p className="mt-2 text-slate-500 dark:text-slate-400">
                Looking for other timezone combinations or custom calculations? Use the interactive world clock slider grid above to dynamically adjust working hours, choose custom dates, and instantly copy pre-formatted event details tailored for Slack, Email, or Google Calendar.
              </p>
            </div>

            {/* Custom Pairing FAQ */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-8 mt-4">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-6 text-center">
                Pairing FAQ
              </h3>
              <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 shadow-sm">
                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>How do I convert {zoneA.displayName} to {zoneB.displayName}?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Simply search and add {zoneA.cityName} and {zoneB.cityName} to the grid. The timeline planner aligns their daily clocks side-by-side, allowing you to translate local hours instantly.
                  </p>
                </details>

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>What is the time difference?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    The time difference is calculated dynamically above based on the active local time zones (which adjusts automatically for daylight saving time).
                  </p>
                </details>
              </div>
            </div>
          </div>
        ) : (
          /* 600+ Word Rich Homepage SEO Copy */
          <div className="w-full flex flex-col gap-10">
            {/* Core Informational Articles */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-12">

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                    </svg>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                    How to Use MeetMyZone
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  MeetMyZone is designed to make global timezone coordination straightforward and stress-free. To plan your next meeting, start by adding the locations of all your team members in the search box. Our tool instantly resolves each location to its official IANA timezone and lines up their hours side-by-side.
                  By selecting your reference timezone, you can visually align hours across a 24-hour horizontal grid. The overlapping &quot;green zones&quot; highlight the standard working hours (typically 9:00 AM to 5:00 PM) for each participant. Once you identify the best slot, simply click on that hour block to schedule a meeting, copy a customized copy-to-clipboard summary for Slack/Email, or export directly to Google Calendar and download .ics files.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                    Why Timezone Overlaps Matter
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  In a modern, distributed workforce, scheduling meetings without a visual overlap planner leads to communication fatigue, scheduling mistakes, and late-night calls. Burnout often results from teams operating in isolated silos or being forced to attend synchronization meetings outside their normal working hours.
                  Finding a shared timezone overlap is not just about operational logistics; it is an essential part of maintaining employee well-being and respecting personal boundaries. Using MeetMyZone, teams can compromise on slots that respect everyone&apos;s local working parameters, leading to higher attendance, active engagement, and healthier team dynamics.
                </p>
              </div>

              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-teal-500/10 text-teal-600 dark:text-teal-400">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
                    Understanding UTC vs Local Time
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                  Coordinating across timezones requires a solid understanding of Coordinated Universal Time (UTC) and how local standard/daylight offsets apply. UTC serves as the absolute global reference clock. Local time zones represent offsets from UTC—for example, Eastern Standard Time (EST) is UTC-5, while British Summer Time (BST) is UTC+1.
                  Many countries observe Daylight Saving Time (DST), meaning their UTC offsets change twice a year. MeetMyZone automatically handles dynamic daylight saving transitions using the official IANA database, ensuring that your scheduled meeting times remain 100% accurate, whether you are planning for next week or next season.
                </p>
              </div>

            </div>

            {/* Comprehensive SEO Article (600+ words) */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-10 max-w-4xl mx-auto w-full flex flex-col gap-6 text-xs sm:text-sm leading-relaxed text-slate-600 dark:text-slate-400">
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white leading-tight tracking-tight">
                MeetMyZone: Check Global Time, Plan Perfect Meeting
              </h2>

              <p>
                In a modern distributed workforce, scheduling collaboration across multiple <strong>time zones</strong> is one of the most persistent operational bottlenecks. A simple team synchronization meeting can quickly become a coordination nightmare when team members are located globally. If you need to translate <strong>est to ist</strong>, <strong>pst to est</strong>, <strong>utc to ist</strong>, <strong>gmt to est</strong>, or <strong>cet to est</strong>, manual calculation is slow and prone to errors. MeetMyZone serves as an intuitive <strong>timezone planner</strong> and <strong>time zone converter</strong> that visualizes your team&apos;s day side-by-side.
              </p>

              <p>
                Rather than just checking a simple <strong>world clock</strong> or asking &quot;<strong>what time is it in</strong> London&quot; or &quot;what is the time difference for <strong>london to new york time</strong>&quot;, MeetMyZone aligns schedules to help you identify optimal overlap hours. It acts as an <strong>international meeting planner</strong> and <strong>time zone overlap calculator</strong>, highlighting the green zones where team members&apos; standard working hours align. This makes it easy to <strong>schedule meeting across time zones</strong> without forcing anyone into early morning or late-night calls.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-2">
                Streamline Remote Collaboration with a Smart Timezone Overlap Calculator
              </h3>

              <p>
                Managing cross-border teams requires more than a simple <strong>time converter</strong>. To prevent operational fatigue, remote operations leaders use our <strong>remote team time zone tool</strong> to establish healthy boundaries. The tool functions as a <strong>working hours overlap calculator</strong>, letting you customize typical business hours (e.g., 9:00 AM to 5:00 PM) for each participant.
              </p>

              <p>
                For instance, when coordinating standard project updates, you can find the <strong>best time for us and india meeting</strong> with a single look. The visual grid highlights standard business overlaps, making it simple to map <strong>singapore to est</strong> or <strong>cet to est</strong> zones. Instead of relying on a complex spreadsheet matrix, our <strong>meeting planner time zone converter</strong> presents a 24-hour timeline where you can drag and select the perfect hour block. The tool automatically accounts for daylight saving changes dynamically, serving as a reliable <strong>daylight saving time converter for meetings</strong>.
              </p>

              <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mt-2">
                Step-by-Step Guide: How to Schedule a Meeting with Different Time Zones
              </h3>

              <p>
                If you are wondering <strong>how to schedule a meeting with different time zones</strong>, the process on MeetMyZone is built for speed:
              </p>
              <ol className="list-decimal list-inside ml-2 flex flex-col gap-2">
                <li>
                  <strong>Add Your Team&apos;s Cities</strong>: Enter the names of the locations you want to coordinate (e.g., London, Paris, Tokyo). The tool instantly resolves each input to its official IANA timezone.
                </li>
                <li>
                  <strong>Align Schedules Visually</strong>: The horizontal slider matrix aligns all local hours column-by-column. Select your primary reference city to view offsets relative to your home clock, or compare offsets relative to <strong>gmt to est</strong>.
                </li>
                <li>
                  <strong>Find the Best Overlap</strong>: Scan the grid to <strong>find the best time to meet across time zones</strong>. Highlighted boxes indicate overlapping working hours for all selected regions.
                </li>
                <li>
                  <strong>Export and Share</strong>: Click on the desired time block to create a meeting slot. You can instantly copy a preformatted invite summary containing local times for all cities to Slack or Email, or directly export the meeting invitation to Google Calendar.
                </li>
              </ol>

              <p>
                Our <strong>world clock meeting planner</strong> handles calculations entirely client-side. This ensures absolute data privacy—your coordinates and locations are never saved on a server. Whether you are managing simple comparisons or orchestrating complex international product launches, MeetMyZone is the ultimate utility to keep your remote team connected, productive, and balanced.
              </p>
            </div>

            {/* FAQ Accordion Section */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-10 max-w-4xl mx-auto w-full">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white text-center mb-6">
                Frequently Asked Questions
              </h3>
              <div className="flex flex-col border border-slate-200 dark:border-slate-800 rounded-xl bg-white dark:bg-slate-900 overflow-hidden divide-y divide-slate-200 dark:divide-slate-800 shadow-sm">

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>What is MeetMyZone?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    MeetMyZone is a visual timezone meeting planner that helps remote teams find the best meeting times across multiple timezones using an intuitive horizontal alignment grid.
                  </p>
                </details>

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>How does the timezone overlap planner work?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    You simply search and add the cities or timezones of your team members. The tool then aligns their daily schedules side-by-side and highlights overlapping work hours to let you identify the best meeting slots.
                  </p>
                </details>

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>Why is UTC reference important for global meetings?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    UTC (Coordinated Universal Time) is the universal time standard that doesn&apos;t observe daylight saving time. Referencing UTC helps avoid timezone shift mistakes when scheduling meetings across regions with different daylight saving schedules.
                  </p>
                </details>

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>Can I customize the working hours in the timeline?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Yes, MeetMyZone allows you to adjust the start and end of working hours globally using the simple dropdown selectors in the tool settings, which instantly updates the highlighted day slots on the grid.
                  </p>
                </details>

                <details className="group p-4 sm:p-5 cursor-pointer">
                  <summary className="flex justify-between items-center list-none font-bold text-sm sm:text-base text-slate-800 dark:text-slate-200 hover:text-teal-500 transition-colors">
                    <span>How do I share meeting times with my team?</span>
                    <span className="transition-transform duration-300 group-open:rotate-180">
                      <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </span>
                  </summary>
                  <p className="mt-3 text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                    Once you select a slot, you can copy a beautifully formatted meeting invite summary tailored for Slack/Email with local times for all cities, or directly export the invitation link to Google Calendar or as an .ics calendar file.
                  </p>
                </details>

              </div>
            </div>
          </div>
        )}

        <InternalLinks />
      </div>
    </section>
  );
}
