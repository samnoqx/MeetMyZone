import { DateTime } from 'luxon';
import { ResolvedTimezone } from './seoResolver';

/**
 * Formats a timezone offset difference with exact minute-to-minute accuracy.
 */
function formatOffset(absOffset: number): string {
  const hours = Math.floor(absOffset);
  const minutes = Math.round((absOffset - hours) * 60);
  if (minutes > 0) {
    return `${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} minutes`;
  }
  return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
}

/**
 * Programmatically generates a directional, highly natural paragraph (>150 words)
 * describing remote work coordination realities and asynchronous communication tips
 * for a specific timezone conversion direction.
 */
export function generateSeoText(fromZone: string, toZone: string, offsetHours: number): string {
  const fromUpper = fromZone.toUpperCase();
  const toUpper = toZone.toUpperCase();
  const absOffset = Math.abs(offsetHours);
  const offsetStr = formatOffset(absOffset);
  const isMassive = absOffset >= 8;

  if (isMassive) {
    return `Coordinating workflow transitions directly from ${fromUpper} to ${toUpper} involves managing a substantial timezone offset of ${offsetStr}, presenting a classic high-latency operational scenario. Because one team is logging off just as the other is starting their workday, real-time synchronous meetings can cause extreme calendar friction and personal burnout. To maintain engineering or operational momentum in this ${fromUpper}-to-${toUpper} corridor, teams must transition from synchronous expectations to a robust asynchronous-first development model. This means that documentation, code review handovers, and project updates must be comprehensive and self-contained. For example, before concluding a workday in the ${fromUpper} timezone, professionals should document pending challenges, expected next steps, and specific blockers in Slack or Jira. When their counterparts in ${toUpper} start their morning, they can immediately pick up where the other team left off without waiting for a live handoff meeting. Implementing visual timeline alignments is key to identifying the narrow 1-hour window where standard working hours might briefly touch, allowing for urgent updates while protecting personal boundaries outside of office hours.`;
  } else {
    return `Collaborating across the time difference from ${fromUpper} to ${toUpper} presents a manageable offset of ${offsetStr}, making daily synchronous alignment relatively straightforward. With a generous shared overlap window during standard business hours, teams situated in these regions can easily schedule core collaborative meetings, standups, and live brainstorming sessions. For example, a team operating in ${fromUpper} has several hours of mutual business availability with colleagues in ${toUpper}, allowing for active feedback loops and quick review cycles. However, even with this convenient timezone alignment, maintaining a healthy balance of synchronous calls and asynchronous documentation is key to operational efficiency. Protecting focus time by reserving meetings for the mid-day overlap while leaving early mornings and late afternoons for individual deep work ensures team members do not experience meeting fatigue. Using our interactive conversion timeline lets you identify the optimal meeting blocks within standard working hours so you can easily coordinate projects, copy meeting agendas, and export calendar links instantly without manual calculation errors.`;
  }
}

/**
 * Programmatically generates a unique, contextually rich, SEO-friendly article/description
 * (minimum 150 words) for any city timezone combination to satisfy Google's de-duplication
 * and Helpful Content guidelines.
 */
export function generateUniqueSeoText(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): string {
  const nameA = zoneA.displayName;
  const nameB = zoneB.displayName;
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  const tzA = zoneA.zoneName;
  const tzB = zoneB.zoneName;

  // Calculate timezone offset difference using current date
  const now = DateTime.now();
  const dtA = now.setZone(tzA);
  const dtB = now.setZone(tzB);
  
  const offsetDiffHours = (dtB.offset - dtA.offset) / 60;
  const absDiff = Math.abs(offsetDiffHours);
  const relation = offsetDiffHours > 0 ? "ahead of" : offsetDiffHours < 0 ? "behind" : "aligned with";
  const offsetStr = formatOffset(absDiff);

  // Calculate business overlap hours (assuming standard work hours 9 AM to 5 PM local times)
  const overlappingHoursInA: number[] = [];
  for (let h = 0; h < 24; h++) {
    const localHourInA = h;
    const localHourInB = (h + offsetDiffHours + 24) % 24;
    
    // Check standard 9 AM (9) to 5 PM (17) overlap
    if (localHourInA >= 9 && localHourInA <= 17 && localHourInB >= 9 && localHourInB <= 17) {
      overlappingHoursInA.push(localHourInA);
    }
  }

  // Format overlap summary text
  let overlapText = "";
  if (overlappingHoursInA.length > 0) {
    const minHour = Math.min(...overlappingHoursInA);
    const maxHour = Math.max(...overlappingHoursInA);
    
    const formatHour = (hr: number) => {
      const wholeHours = Math.floor(hr);
      const minutes = Math.round((hr - wholeHours) * 60);
      const period = wholeHours >= 12 ? 'PM' : 'AM';
      const displayHour = wholeHours % 12 === 0 ? 12 : wholeHours % 12;
      const displayMinutes = String(minutes).padStart(2, '0');
      return `${displayHour}:${displayMinutes} ${period}`;
    };

    const startA = formatHour(minHour);
    const endA = formatHour(maxHour);
    const startB = formatHour((minHour + offsetDiffHours + 24) % 24);
    const endB = formatHour((maxHour + offsetDiffHours + 24) % 24);

    overlapText = `For teams collaborating across these regions, the primary window for real-time collaboration falls between ${startA} and ${endA} in ${cityA}, which corresponds to ${startB} to ${endB} in ${cityB}. This creates an active ${overlappingHoursInA.length}-hour overlap of standard business hours, providing an ideal slot for scheduling sync calls, standup meetings, or cross-regional handovers.`;
  } else {
    overlapText = `Due to the significant time zone shift, there is no direct overlap of standard 9-to-5 working hours between ${cityA} and ${cityB}. Scheduling real-time syncs requires finding flexible slots early in the morning for one region or late in the evening for the other. Teams typically use asynchronous communication or schedule calls on the margins of the workday to bridge this gap.`;
  }

  // Paragraph Templates for Variety & Context Richness
  const p1Templates = [
    `Comparing and converting time zones between **${nameA}** and **${nameB}** is essential for remote workers, distributed team leads, and global travelers. Currently, ${cityB} is ${offsetStr} ${relation} ${cityA} (relative to their local standard offsets of ${tzB} and ${tzA} respectively). When coordinating activities between ${cityA} and ${cityB}, relying on manual calculations can lead to scheduling mistakes, especially during daylight saving time (DST) transitions in the spring or autumn. Our visual timezone converter eliminates these errors by aligning schedules side-by-side on an interactive timeline.`,
    `Managing calendar bookings across the time difference separating **${nameA}** and **${nameB}** poses significant challenges for digital nomads, project managers, and agencies. A time offset of ${offsetStr} means that while one region is starting its morning routine, the other may be wrapping up its workday or already asleep. Specifically, ${cityB} is situated ${offsetStr} ${relation} ${cityA}. To prevent miscommunication and calendar conflicts, MeetMyZone acts as a live interactive timezone utility that overlays the diurnal grids of both ${cityA} and ${cityB} in real time.`,
    `Whether you are a developer handoff coordinator or a client relation specialist, syncing workflows between **${nameA}** and **${nameB}** requires clear visibility of local times. The geographical gap translates to a timezone offset where ${cityB} is ${offsetStr} ${relation} ${cityA}. Instead of searching the web for current offsets or guessing if daylight saving changes are active in ${cityA} or ${cityB}, you can rely on this dedicated converter. The dynamic interface aligns clocks automatically and updates according to the latest official IANA database parameters.`
  ];

  const p2Templates = [
    `${overlapText} By scheduling within these optimal parameters, remote teams can reduce fatigue, avoid disruptive after-hours calls, and establish sustainable boundaries. The visual grid highlighted above shows standard business slots in bright green and after-hours periods in grey, enabling managers to select coordinates that respect the local time of all stakeholders.`,
    `${overlapText} This calculated overlap serves as the foundation for setting up sprint syncs, customer check-ins, or engineering reviews. Coordinating meetings inside these shared slots helps prevent employee burnout and ensures higher attendance rates. Use the timeline tool above to tap on any slot, instantly showing what local hour it translates to in both ${cityA} and ${cityB}.`,
    `${overlapText} Having a structured understanding of this time differential allows organizations to design efficient asynchronous developer pipelines. For instance, tasks completed at the end of the day in ${cityA} can be handed over to team members in ${cityB} without delays, keeping projects moving forward 24 hours a day.`
  ];

  const p3Templates = [
    `To schedule a meeting, simply slide the vertical alignment marker to your preferred time slot on the interactive grid above. Once selected, you can copy a pre-formatted invitation summary directly to your clipboard, perfect for sharing on Slack, Microsoft Teams, or email. You can also export the meeting details directly to Google Calendar or download a standard .ics file for Apple Calendar or Outlook. Because MeetMyZone performs all timezone calculations entirely client-side, your locations and schedules remain strictly confidential inside your browser.`,
    `Our world clock meeting planner is engineered to be lightweight, responsive, and completely privacy-focused. You do not need to register an account or pay for a premium subscription to access the tool. Simply add ${cityA} and ${cityB} to your active location tags, identify the best overlapping hour block, and generate a calendar invite instantly. This helps remote teams coordinate globally while maintaining absolute control over their schedule privacy.`,
    `Mitigating timezone friction is a key factor in successful international business logistics. By checking offsets on MeetMyZone, you ensure that meetings are scheduled at times that work for everyone. Tap on your desired slot on the timezone timeline, choose to copy the summary text with local hours adjusted for each participant, or export an calendar file directly to Outlook, Google Calendar, or iCal.`
  ];

  // Deterministically select templates based on city names to guarantee page consistency
  const seed = (cityA.charCodeAt(0) + (cityB.charCodeAt(0) || 0)) % 3;
  const p1 = p1Templates[seed];
  const p2 = p2Templates[(seed + 1) % 3];
  const p3 = p3Templates[(seed + 2) % 3];

  return `${p1}\n\n${p2}\n\n${p3}`;
}

/**
 * Programmatically generates an SEO-friendly description (minimum 150 words)
 * mapping time offsets and remote work handovers across 3 or more global cities.
 */
export function generateMultiZoneSeoText(zones: ResolvedTimezone[]): string {
  const cityNames = zones.map(z => z.cityName);
  const formattedCities = cityNames.slice(0, -1).join(', ') + ', and ' + cityNames[cityNames.length - 1];
  
  // Calculate relative offsets compared to the first city (reference city)
  const now = DateTime.now();
  const refZone = zones[0];
  const refTime = now.setZone(refZone.zoneName);
  
  const offsetDescriptions = zones.slice(1).map(z => {
    const targetTime = now.setZone(z.zoneName);
    const diffHours = (targetTime.offset - refTime.offset) / 60;
    const absDiff = Math.abs(diffHours);
    const relation = diffHours > 0 ? "ahead of" : diffHours < 0 ? "behind" : "aligned with";
    const hours = Math.floor(absDiff);
    const minutes = Math.round((absDiff - hours) * 60);
    const offsetStr = minutes > 0 
      ? `${hours} ${hours === 1 ? 'hour' : 'hours'} and ${minutes} minutes`
      : `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
    return `**${z.cityName}** which is ${offsetStr} ${relation} ${refZone.cityName}`;
  });

  const offsetsSentence = offsetDescriptions.slice(0, -1).join(', ') + ', and ' + offsetDescriptions[offsetDescriptions.length - 1];

  return `Coordinating collaboration schedules across **${formattedCities}** requires active visibility of multiple global work hours. Specifically, compared to the reference time in ${refZone.cityName}, the current time offsets are: ${offsetsSentence}. Synchronizing sync calls across this multi-city corridor can quickly introduce calendar friction, especially with locations separated by large offset differences. To protect team health and productivity, project coordinators should enforce asynchronous-first communication, relying on comprehensive status handovers in Slack, Jira, or documentation files. Use the interactive 24-Hour Timeline Comparison board above to drag and align local clocks side-by-side, identifying overlap slots where standard business hours align across all locations.`;
}
