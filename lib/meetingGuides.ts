export const MEETING_GUIDES = [
  {
    slug: 'india-uk-us', title: 'India, UK & US Meeting Planner', cities: ['mumbai', 'london', 'new-york'],
    description: 'Plan meetings between India, the UK and the US East Coast. Compare Mumbai, London and New York on your meeting date, check daylight saving changes and find shared working hours.',
    advice: 'India stays on UTC+05:30, while London and New York change their clocks seasonally. A late afternoon in Mumbai may be an early morning in New York. Check all three locations before choosing a recurring slot.',
    checklist: 'If the highlighted working hours have no common slot, ask participants about an earlier start or later finish. Rotate the inconvenient time between teams, or use an asynchronous handover instead of assuming everyone is available.',
  },
  {
    slug: 'singapore-london-new-york', title: 'Singapore, London & New York Meeting Planner', cities: ['singapore', 'london', 'new-york'],
    description: 'Find meeting times across Singapore, London and New York. Compare three local calendars, check seasonal offsets and review whether normal working hours overlap on your chosen date.',
    advice: 'Singapore uses UTC+08:00 throughout the year. London and New York use seasonal offsets, and their clock changes do not always happen on the same weekend. A time that worked last month may need to move.',
    checklist: 'Start by checking the Singapore evening against the New York morning. If your participants cannot attend outside normal hours, split the discussion into regional calls and share a written decision log.',
  },
  {
    slug: 'sydney-london', title: 'Sydney & London Meeting Planner', cities: ['sydney', 'london'],
    description: 'Plan a meeting between Sydney and London with date-aware local times. Check opposite-season daylight saving changes, working-hour overlap and the calendar date at each location.',
    advice: 'Sydney and London are in opposite hemispheres. Their daylight saving seasons differ, so the gap between their clocks changes during the year. Use the selected meeting date instead of carrying forward a fixed difference.',
    checklist: 'Check London mornings against Sydney evenings and confirm whether an out-of-hours call is acceptable. For a recurring meeting, check dates around both regions’ clock changes and rotate early or late attendance.',
  },
  {
    slug: 'los-angeles-tokyo', title: 'Los Angeles & Tokyo Meeting Planner', cities: ['los-angeles', 'tokyo'],
    description: 'Schedule meetings between Los Angeles and Tokyo. Compare local dates, Pacific daylight saving changes and working-hour availability before sharing a calendar invitation.',
    advice: 'Tokyo remains on UTC+09:00, while Los Angeles switches between Pacific standard and daylight time. The cities can be on different calendar dates at the same instant, especially around a Pacific afternoon or evening.',
    checklist: 'Always include both local dates in the proposed invitation. Check whether a Friday call in Los Angeles lands on Saturday in Tokyo, and confirm weekend availability before sending it.',
  },
  {
    slug: 'europe-us', title: 'Europe & US Meeting Planner', cities: ['berlin', 'london', 'new-york'],
    description: 'Compare meeting times in Berlin, London and New York. Find Europe–US working-hour overlaps and check the weeks when European and American daylight saving dates differ.',
    advice: 'Berlin and London normally change their clocks together; New York follows a different changeover calendar. During the intervening weeks, an otherwise regular Europe–US call can shift by an hour for one side.',
    checklist: 'Begin with European afternoons and US East Coast mornings, then check the exact meeting date. A US participant in another region needs their own city added; New York does not represent every US time zone.',
  },
  {
    slug: 'australia-new-zealand', title: 'Australia & New Zealand Meeting Planner', cities: ['sydney', 'perth', 'auckland'],
    description: 'Coordinate meetings across Sydney, Perth and Auckland. Compare different Australian time zones, New Zealand dates and seasonal clock changes to find shared working hours.',
    advice: 'Australia has several time zones. Perth stays on UTC+08:00, while Sydney and Auckland have seasonal clock changes. Naming only the country is insufficient for an accurate meeting invitation.',
    checklist: 'Add the actual participant city rather than selecting a single Australian time. Check the overlap before setting a deadline that spans Perth, the Australian east coast and New Zealand.',
  },
];
