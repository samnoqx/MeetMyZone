import { DateTime } from 'luxon';
import { ResolvedTimezone } from './seoResolver';

export interface TimezoneFact {
  fullName: string;
  standardOffset: string;
  regions: string;
  businessUsage: string;
  travelRelevance: string;
  remoteWork: string;
}

export const TIMEZONE_FACTS_MAP: Record<string, TimezoneFact> = {
  'est': {
    fullName: 'Eastern Standard Time (EST)',
    standardOffset: 'UTC-5 (UTC-4 during Daylight Saving Time)',
    regions: 'Eastern United States (New York, Washington D.C., Boston, Miami), Eastern Canada (Toronto, Montreal), parts of the Caribbean and Central America.',
    businessUsage: "Home to the world's largest financial markets including the New York Stock Exchange (NYSE) and NASDAQ, setting the tempo for global trading, corporate operations, and investment strategies.",
    travelRelevance: 'Main aviation gateways include JFK International, Newark Liberty, and Atlanta Hartsfield-Jackson, serving as critical transfer hubs for transatlantic and domestic flights.',
    remoteWork: 'Acts as the central coordination point for North American corporate offices and nearshore Latin American software engineering teams.'
  },
  'ist': {
    fullName: 'India Standard Time (IST)',
    standardOffset: 'UTC+5:30 (Daylight Saving Time is not observed)',
    regions: 'India, Sri Lanka.',
    businessUsage: 'A massive global powerhouse for software engineering, IT services, business process outsourcing, multinational corporate backup centers, and industrial manufacturing.',
    travelRelevance: 'Major transit hubs in Delhi (Indira Gandhi International), Mumbai (Chhatrapati Shivaji), and tech centers in Bengaluru, linking South Asia with Western Europe and East Asian markets.',
    remoteWork: 'High-density development zone operating under structured project handoffs with European day shifts and US East/West Coast night-shift engineering sprints.'
  },
  'pst': {
    fullName: 'Pacific Standard Time (PST)',
    standardOffset: 'UTC-8 (UTC-7 during Daylight Saving Time)',
    regions: 'Western United States (Los Angeles, San Francisco, Seattle, Las Vegas), Western Canada (Vancouver), and Baja California in Mexico.',
    businessUsage: 'The global epicentre of high-tech innovation, software product development, venture capital, and entertainment (Silicon Valley, Seattle tech hubs, Hollywood).',
    travelRelevance: 'Key international gateways include LAX, San Francisco International (SFO), and Seattle-Tacoma (SEA), bridging North America with transpacific Asian routes.',
    remoteWork: 'Key decision-making timezone for global technology decisions, orchestrating distributed product teams and developer advocates across Europe and the Asia-Pacific.'
  },
  'utc': {
    fullName: 'Coordinated Universal Time (UTC)',
    standardOffset: 'UTC+0 (Does not observe Daylight Saving Time)',
    regions: 'Used globally as the reference standard time; observed locally in Iceland, Ireland, the UK, and several West African countries during winter.',
    businessUsage: 'The universal benchmark for database logging, server scheduling, transaction auditing, aviation routing logs, and military operations to avoid regional timezone confusion.',
    travelRelevance: 'Zero-offset baseline used universally by international pilots, air traffic control centers, and global maritime navigation protocols.',
    remoteWork: 'Serves as the neutral, standard baseline timezone for distributed remote teams coordinating schedules across different hemispheres.'
  },
  'gmt': {
    fullName: 'Greenwich Mean Time (GMT)',
    standardOffset: 'UTC+0 (UTC+1 during British Summer Time)',
    regions: 'United Kingdom, Ireland, Iceland, and West Africa.',
    businessUsage: 'Centred around London, a dominant global hub for international banking, foreign exchange trading, insurance syndicates, and European corporate offices.',
    travelRelevance: 'Major global travel hubs including London Heathrow (LHR) and London Gatwick, handling immense volumes of transatlantic and intra-European passenger traffic.',
    remoteWork: 'Highly strategic zone bridging the gap between Asian close-of-business hours and North American start-of-day slots.'
  },
  'cet': {
    fullName: 'Central European Time (CET)',
    standardOffset: 'UTC+1 (UTC+2 during Daylight Saving Time)',
    regions: 'Over 30 European countries including France (Paris), Germany (Berlin, Frankfurt), Italy (Rome), Spain (Madrid), Poland, and Sweden.',
    businessUsage: 'Home to major European manufacturing conglomerates, automotive giants, chemical industries, and central banking institutions (Frankfurt).',
    travelRelevance: 'Key intra-European hubs such as Frankfurt Airport (FRA), Paris Charles de Gaulle (CDG), and Amsterdam Schiphol (AMS), facilitating high-frequency regional trade.',
    remoteWork: 'Unified timezone for continental European operations, collaborating extensively with UK and Middle Eastern counterpart teams.'
  },
  'mst': {
    fullName: 'Mountain Standard Time (MST)',
    standardOffset: 'UTC-7 (UTC-6 during Daylight Saving Time; Arizona remains on UTC-7 year-round)',
    regions: 'Western-central North America including Denver, Phoenix, Salt Lake City, and Calgary (Canada).',
    businessUsage: 'Growing hubs for aerospace engineering, telecommunications, outdoor recreation industries, and satellite tech offices.',
    travelRelevance: 'Denver International Airport (DEN) serves as a massive transfer point for US east-west travel and regional Rocky Mountain connections.',
    remoteWork: 'Fits comfortably between Pacific and Central time zones, serving as a buffer for national team meetings.'
  },
  'cst': {
    fullName: 'Central Standard Time (CST)',
    standardOffset: 'UTC-6 (UTC-5 during Daylight Saving Time)',
    regions: 'Central United States (Chicago, Dallas, Houston), Central Canada (Winnipeg), and Mexico.',
    businessUsage: 'Anchored by Chicago (derivatives trading, logistics) and Texas (energy sector, space exploration, major corporate headquarters).',
    travelRelevance: 'Key international airports include Chicago O\'Hare (ORD) and Dallas/Fort Worth (DFW), two of the busiest hubs in the world.',
    remoteWork: 'Central standard for North American syncs, aligning easily with both East Coast and West Coast schedules.'
  },
  'ast': {
    fullName: 'Atlantic Standard Time (AST)',
    standardOffset: 'UTC-4 (UTC-3 during Daylight Saving Time)',
    regions: 'Atlantic Canada (Nova Scotia, New Brunswick), parts of the Caribbean, and South America.',
    businessUsage: 'Centers around fisheries, shipping logisitics, tourism, offshore finance, and customer service centers.',
    travelRelevance: 'Regional travel airports in Halifax and Caribbean hubs connecting travelers to North and South America.',
    remoteWork: 'Excellent alignment with Eastern Time Zone, serving as an early start zone for North American software sprints.'
  },
  'sgt': {
    fullName: 'Singapore Standard Time (SGT)',
    standardOffset: 'UTC+8 (No Daylight Saving Time observed)',
    regions: 'Singapore.',
    businessUsage: 'The premier financial and shipping hub of Southeast Asia, hosting regional headquarters for global banks, tech giants, and trading firms.',
    travelRelevance: 'Singapore Changi Airport (SIN), consistently rated the world\'s best airport, a massive gateway for Asia-Europe-Australia transit.',
    remoteWork: 'Ideal position for managing operations across Australia, Southeast Asia, China, and linking into European evening shifts.'
  },
  'jst': {
    fullName: 'Japan Standard Time (JST)',
    standardOffset: 'UTC+9 (No Daylight Saving Time observed)',
    regions: 'Japan.',
    businessUsage: 'Core technological innovation hub, electronics manufacturing, gaming industry, automotive leaders, and major Asian financial markets (Tokyo).',
    travelRelevance: 'Tokyo Haneda (HND) and Narita (NRT) airports, serving as central hubs for transpacific flights and East Asian travel.',
    remoteWork: 'Collaborative center for East Asian tech teams, interfacing with European morning shifts and US West Coast afternoon schedules.'
  },
  'kst': {
    fullName: 'Korea Standard Time (KST)',
    standardOffset: 'UTC+9 (No Daylight Saving Time observed)',
    regions: 'South Korea.',
    businessUsage: 'Centers around high-tech consumer electronics (semiconductors, displays), shipbuilding, automotive manufacturing, and cultural export industries.',
    travelRelevance: 'Incheon International Airport (ICN), a premier world-class hub for East Asian cargo and passenger connections.',
    remoteWork: 'Closely aligned with Japan and Australian eastern schedules, managing high-velocity software engineering tasks.'
  },
  'aest': {
    fullName: 'Australian Eastern Standard Time (AEST)',
    standardOffset: 'UTC+10 (UTC+11 during Daylight Saving Time)',
    regions: 'Eastern Australia including Sydney, Melbourne, Brisbane, and Canberra.',
    businessUsage: 'Major banking, corporate head offices, mining exploration logistics, and digital services hubs in the Southern Hemisphere.',
    travelRelevance: 'Sydney Kingsford Smith (SYD) and Melbourne (MEL) airports, handling major transpacific and Southeast Asian long-haul routes.',
    remoteWork: 'First zone to start the global business day, executing handover logs to US West Coast close-of-business schedules.'
  }
};

const SLUG_TO_FACT_KEY: Record<string, string> = {
  'london': 'gmt',
  'new-york': 'est',
  'tokyo': 'jst',
  'paris': 'cet',
  'singapore': 'sgt',
  'sydney': 'aest',
  'los-angeles': 'pst',
  'denver': 'mst',
  'chicago': 'cst',
  'halifax': 'ast',
  'seoul': 'kst',
  'new-delhi': 'ist',
  'kolkata': 'ist'
};

export function getTimezoneFacts(slug: string, displayName: string, zoneName: string): TimezoneFact {
  const cleanSlug = slug.toLowerCase().trim();
  const key = SLUG_TO_FACT_KEY[cleanSlug] || cleanSlug;
  
  if (TIMEZONE_FACTS_MAP[key]) {
    return TIMEZONE_FACTS_MAP[key];
  }
  
  return {
    fullName: displayName.toUpperCase(),
    standardOffset: zoneName,
    regions: `Regions observing ${displayName}`,
    businessUsage: `Business coordination and corporate activities in ${displayName} and surrounding areas.`,
    travelRelevance: `Airport connections and regional hubs serving the ${displayName} timezone.`,
    remoteWork: `Remote collaboration, project handoffs, and team alignment across the ${displayName} zone.`
  };
}

export function calculateTimeDifference(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): { diffText: string; formattedDiff: string } {
  const now = DateTime.now();
  const timeA = now.setZone(zoneA.zoneName);
  const timeB = now.setZone(zoneB.zoneName);
  
  const offsetA = timeA.offset; // in minutes
  const offsetB = timeB.offset;
  const diffMinutes = offsetB - offsetA;
  
  const absMinutes = Math.abs(diffMinutes);
  const diffHours = Math.floor(absMinutes / 60);
  const diffMinsRemaining = absMinutes % 60;
  
  let diffText = "";
  let formattedDiff = "";
  
  if (diffMinutes === 0) {
    diffText = "are at the same time";
    formattedDiff = "0 hours difference";
  } else {
    const direction = diffMinutes > 0 ? "ahead of" : "behind";
    const minPart = diffMinsRemaining > 0 ? ` ${diffMinsRemaining} minutes` : "";
    diffText = `${diffHours} hour${diffHours !== 1 ? 's' : ''}${minPart} ${direction}`;
    formattedDiff = `${diffHours}h${diffMinsRemaining > 0 ? ` ${diffMinsRemaining}m` : ''} ${direction}`;
  }
  
  return { diffText, formattedDiff };
}

export interface OverlapRecommendation {
  overlapHoursCount: number;
  overlapRangeA: string;
  overlapRangeB: string;
  recommendation: string;
}

export function calculateOverlapAndRecommendation(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): OverlapRecommendation {
  const overlapHours: number[] = [];
  const baseDate = DateTime.now().setZone(zoneA.zoneName).startOf('day');
  
  for (let h = 0; h < 24; h++) {
    const dtA = baseDate.plus({ hours: h });
    const dtB = dtA.setZone(zoneB.zoneName);
    
    const isWorkingA = dtA.hour >= 9 && dtA.hour < 17;
    const isWorkingB = dtB.hour >= 9 && dtB.hour < 17;
    
    if (isWorkingA && isWorkingB) {
      overlapHours.push(h);
    }
  }
  
  const count = overlapHours.length;
  
  const formatHour = (h: number) => {
    const displayHour = h % 12 === 0 ? 12 : h % 12;
    const period = h >= 12 ? 'PM' : 'AM';
    return `${displayHour}:00 ${period}`;
  };
  
  let rangeA = "No overlap";
  let rangeB = "No overlap";
  let rec = "";
  
  if (count > 0) {
    const startA = overlapHours[0];
    const endA = overlapHours[count - 1] + 1;
    rangeA = `${formatHour(startA)} - ${formatHour(endA)}`;
    
    const startB_dt = baseDate.plus({ hours: startA }).setZone(zoneB.zoneName);
    const endB_dt = baseDate.plus({ hours: endA }).setZone(zoneB.zoneName);
    rangeB = `${startB_dt.toFormat('h:mm a')} - ${endB_dt.toFormat('h:mm a')}`;
    
    if (count >= 4) {
      rec = `There is an excellent business-hour overlap of ${count} hours between ${zoneA.displayName} and ${zoneB.displayName}. The optimal slot to schedule meetings is from ${rangeA} in ${zoneA.cityName} time (corresponding to ${rangeB} in ${zoneB.cityName} time). This provides a comfortable window for both parties during their standard workday.`;
    } else {
      rec = `There is a moderate business-hour overlap of ${count} hour${count !== 1 ? 's' : ''} between ${zoneA.displayName} and ${zoneB.displayName}. We recommend scheduling your calls between ${rangeA} ${zoneA.displayName} (corresponding to ${rangeB} ${zoneB.displayName}) to ensure everyone is connected within their standard working hours.`;
    }
  } else {
    const dtA_morning = baseDate.plus({ hours: 8 });
    const dtB_morning = dtA_morning.setZone(zoneB.zoneName);
    
    const dtA_evening = baseDate.plus({ hours: 17 });
    const dtB_evening = dtA_evening.setZone(zoneB.zoneName);
    
    rec = `There is no overlap during standard 9-to-5 working hours between ${zoneA.displayName} and ${zoneB.displayName}. To coordinate meetings, you will need to schedule slightly outside standard hours. We recommend trying ${dtA_morning.toFormat('h:mm a')} in ${zoneA.cityName} (corresponding to ${dtB_morning.toFormat('h:mm a')} in ${zoneB.cityName}), or ${dtA_evening.toFormat('h:mm a')} in ${zoneA.cityName} (${dtB_evening.toFormat('h:mm a')} in ${zoneB.cityName}).`;
  }
  
  return {
    overlapHoursCount: count,
    overlapRangeA: rangeA,
    overlapRangeB: rangeB,
    recommendation: rec
  };
}

export interface DstDetail {
  displayName: string;
  observeDst: boolean;
  isCurrentlyDst: boolean;
  nextChange: string | null;
  description: string;
}

export function getDstDetail(zone: ResolvedTimezone): DstDetail {
  const dt = DateTime.now().setZone(zone.zoneName);
  const isDst = dt.isInDST;
  
  let nextChangeDate: string | null = null;
  
  // 1. Month-by-month scan (max 12 checks)
  let changeMonthIdx = -1;
  for (let m = 1; m <= 12; m++) {
    const checkTime = dt.plus({ months: m });
    if (checkTime.isInDST !== isDst) {
      changeMonthIdx = m;
      break;
    }
  }

  // 2. Binary search the days in that month (max 5 checks)
  if (changeMonthIdx !== -1) {
    const rangeStart = dt.plus({ months: changeMonthIdx - 1 });
    const rangeEnd = dt.plus({ months: changeMonthIdx });
    
    let lowDays = 0;
    let highDays = Math.ceil(rangeEnd.diff(rangeStart, 'days').days);
    
    while (lowDays < highDays) {
      const midDays = Math.floor((lowDays + highDays) / 2);
      const midTime = rangeStart.plus({ days: midDays });
      if (midTime.isInDST !== isDst) {
        highDays = midDays;
      } else {
        lowDays = midDays + 1;
      }
    }
    
    nextChangeDate = rangeStart.plus({ days: lowDays }).toFormat('LLLL d, yyyy');
  }
  
  const observeDst = nextChangeDate !== null;
  
  let desc = "";
  if (!observeDst) {
    desc = `${zone.displayName} (${zone.cityName}) does not observe Daylight Saving Time. The local clocks remain offset by UTC${dt.toFormat('Z')} year-round.`;
  } else {
    const targetOffset = isDst ? "standard" : "daylight saving";
    desc = `${zone.displayName} (${zone.cityName}) observes Daylight Saving Time. It is currently ${isDst ? "active" : "inactive"}. The next clock change will occur on ${nextChangeDate}, when clocks will shift to accommodate the transition to ${targetOffset} time.`;
  }
  
  return {
    displayName: zone.displayName,
    observeDst,
    isCurrentlyDst: isDst,
    nextChange: nextChangeDate,
    description: desc
  };
}

export function generateDynamicIntro(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): string {
  const nameA = zoneA.displayName;
  const nameB = zoneB.displayName;
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  
  return `Convert ${nameA} to ${nameB} easily. View the live time difference, compare working hour overlaps, and schedule international meetings between ${cityA} and ${cityB} using our interactive timeline planner.`;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQs(
  zoneA: ResolvedTimezone,
  zoneB: ResolvedTimezone,
  diffText: string,
  overlapRec: string,
  dstA: DstDetail,
  dstB: DstDetail
): FAQItem[] {
  return [
    {
      question: `What is the time difference between ${zoneA.displayName} and ${zoneB.displayName}?`,
      answer: `Currently, ${zoneB.displayName} is ${diffText} compared to ${zoneA.displayName}. The time difference updates dynamically if either region changes for Daylight Saving Time.`
    },
    {
      question: `When is the best time to schedule a meeting between ${zoneA.cityName} and ${zoneB.cityName}?`,
      answer: overlapRec
    },
    {
      question: `Do ${zoneA.displayName} and ${zoneB.displayName} observe Daylight Saving Time?`,
      answer: `${dstA.description} Meanwhile, ${dstB.description}`
    }
  ];
}

export interface RelatedLink {
  label: string;
  url: string;
}

const ALL_ABBRS = ['est', 'ist', 'pst', 'utc', 'gmt', 'cet', 'mst', 'cst', 'ast', 'sgt', 'jst', 'kst', 'aest'];

export function generateRelatedConverters(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): RelatedLink[] {
  const slugA = zoneA.slug.toLowerCase();
  const slugB = zoneB.slug.toLowerCase();
  
  const links: RelatedLink[] = [];
  
  links.push({
    label: `${zoneB.displayName} to ${zoneA.displayName}`,
    url: `/convert/${slugB}-to-${slugA}`
  });
  
  const otherAbbrs = ALL_ABBRS.filter(a => a !== slugA && a !== slugB).slice(0, 4);
  otherAbbrs.forEach(abbr => {
    const displayAbbr = abbr.toUpperCase();
    links.push({
      label: `${zoneA.displayName} to ${displayAbbr}`,
      url: `/convert/${slugA}-to-${abbr}`
    });
    links.push({
      label: `${displayAbbr} to ${zoneB.displayName}`,
      url: `/convert/${abbr}-to-${slugB}`
    });
  });
  
  return links.slice(0, 5);
}

export function generateRelatedCities(zoneA: ResolvedTimezone, zoneB: ResolvedTimezone): RelatedLink[] {
  const slugify = (city: string) => city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  
  const cityA = zoneA.cityName;
  const cityB = zoneB.cityName;
  
  const links: RelatedLink[] = [
    {
      label: `${cityA} to ${cityB} Meeting Planner`,
      url: `/timezone/${slugify(cityA)}-to-${slugify(cityB)}`
    }
  ];
  
  const popularCities = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris', 'Singapore'].filter(c => c !== cityA && c !== cityB);
  popularCities.slice(0, 3).forEach(city => {
    links.push({
      label: `${cityA} to ${city} Comparison`,
      url: `/timezone/${slugify(cityA)}-to-${slugify(city)}`
    });
    links.push({
      label: `${city} to ${cityB} Comparison`,
      url: `/timezone/${slugify(city)}-to-${slugify(cityB)}`
    });
  });
  
  return links.slice(0, 5);
}

export interface CityGeoInfo {
  country: string;
  region: string;
  lat: number;
  lng: number;
}

export const POPULAR_CITIES_GEO: Record<string, CityGeoInfo> = {
  'london': { country: 'United Kingdom', region: 'England', lat: 51.5074, lng: -0.1278 },
  'new-york': { country: 'United States', region: 'New York', lat: 40.7128, lng: -74.0060 },
  'tokyo': { country: 'Japan', region: 'Tokyo', lat: 35.6762, lng: 139.6503 },
  'sydney': { country: 'Australia', region: 'New South Wales', lat: -33.8688, lng: 151.2093 },
  'paris': { country: 'France', region: 'Île-de-France', lat: 48.8566, lng: 2.3522 },
  'dubai': { country: 'United Arab Emirates', region: 'Dubai', lat: 25.2048, lng: 55.2708 },
  'los-angeles': { country: 'United States', region: 'California', lat: 34.0522, lng: -118.2437 },
  'chicago': { country: 'United States', region: 'Illinois', lat: 41.8781, lng: -87.6298 },
  'hong-kong': { country: 'Hong Kong', region: 'Hong Kong', lat: 22.3193, lng: 114.1694 },
  'singapore': { country: 'Singapore', region: 'Central Region', lat: 1.3521, lng: 103.8198 },
  'mumbai': { country: 'India', region: 'Maharashtra', lat: 19.0760, lng: 72.8777 },
  'kolkata': { country: 'India', region: 'West Bengal', lat: 22.5726, lng: 88.3639 },
  'new-delhi': { country: 'India', region: 'Delhi', lat: 28.6139, lng: 77.2090 },
  'delhi': { country: 'India', region: 'Delhi', lat: 28.7041, lng: 77.1025 },
  'san-francisco': { country: 'United States', region: 'California', lat: 37.7749, lng: -122.4194 },
  'seoul': { country: 'South Korea', region: 'Seoul Capital Area', lat: 37.5665, lng: 126.9780 },
  'berlin': { country: 'Germany', region: 'Berlin', lat: 52.5200, lng: 13.4050 },
  'denver': { country: 'United States', region: 'Colorado', lat: 39.7392, lng: -104.9903 },
  'halifax': { country: 'Canada', region: 'Nova Scotia', lat: 44.6488, lng: -63.5752 }
};

export function getCountryForTimezone(zone: string): string {
  const zoneLower = zone.toLowerCase();
  if (zoneLower.includes('kolkata') || zoneLower.includes('delhi') || zoneLower.includes('mumbai') || zoneLower.includes('calcutta')) return 'India';
  if (zoneLower.includes('london')) return 'United Kingdom';
  if (zoneLower.includes('tokyo')) return 'Japan';
  if (zoneLower.includes('sydney') || zoneLower.includes('melbourne') || zoneLower.includes('brisbane') || zoneLower.includes('adelaide') || zoneLower.includes('perth') || zoneLower.includes('hobart')) return 'Australia';
  if (zoneLower.includes('paris')) return 'France';
  if (zoneLower.includes('dubai')) return 'United Arab Emirates';
  if (zoneLower.includes('seoul')) return 'South Korea';
  if (zoneLower.includes('singapore')) return 'Singapore';
  if (zoneLower.includes('hong_kong') || zoneLower.includes('hongkong')) return 'Hong Kong';
  if (zoneLower.includes('berlin') || zoneLower.includes('frankfurt') || zoneLower.includes('munich')) return 'Germany';
  if (zoneLower.includes('rome') || zoneLower.includes('milan')) return 'Italy';
  if (zoneLower.includes('madrid') || zoneLower.includes('barcelona')) return 'Spain';
  if (zoneLower.includes('toronto') || zoneLower.includes('montreal') || zoneLower.includes('vancouver') || zoneLower.includes('halifax') || zoneLower.includes('winnipeg') || zoneLower.includes('calgary')) return 'Canada';
  if (zoneLower.includes('new_york') || zoneLower.includes('los_angeles') || zoneLower.includes('chicago') || zoneLower.includes('denver') || zoneLower.includes('phoenix') || zoneLower.includes('anchorage') || zoneLower.includes('honolulu')) return 'United States';
  
  if (zone.startsWith('America/')) {
    if (zone.includes('Argentina')) return 'Argentina';
    if (zone.includes('Brazil') || zone.includes('Sao_Paulo') || zone.includes('Rio')) return 'Brazil';
    if (zone.includes('Mexico')) return 'Mexico';
    return 'United States';
  }
  if (zone.startsWith('Europe/')) {
    if (zone.includes('Dublin')) return 'Ireland';
    if (zone.includes('Amsterdam')) return 'Netherlands';
    if (zone.includes('Brussels')) return 'Belgium';
    if (zone.includes('Vienna')) return 'Austria';
    if (zone.includes('Zurich')) return 'Switzerland';
    if (zone.includes('Stockholm')) return 'Sweden';
    if (zone.includes('Oslo')) return 'Norway';
    if (zone.includes('Copenhagen')) return 'Denmark';
    if (zone.includes('Warsaw')) return 'Poland';
    return 'Europe';
  }
  if (zone.startsWith('Asia/')) {
    if (zone.includes('Shanghai') || zone.includes('Beijing')) return 'China';
    if (zone.includes('Bangkok')) return 'Thailand';
    if (zone.includes('Jakarta')) return 'Indonesia';
    if (zone.includes('Manila')) return 'Philippines';
    if (zone.includes('Kuala_Lumpur')) return 'Malaysia';
    if (zone.includes('Taipei')) return 'Taiwan';
    return 'Asia';
  }
  if (zone.startsWith('Australia/')) return 'Australia';
  if (zone.startsWith('Africa/')) return 'Africa';
  if (zone.startsWith('Pacific/')) return 'Pacific';
  if (zone === 'UTC' || zone === 'GMT') return 'Coordinated Universal Time';
  return 'Global';
}

export function generateTimeInIntro(zone: ResolvedTimezone, country: string): string {
  const cityName = zone.cityName;
  const zoneName = zone.zoneName;
  
  const introTemplates = [
    `Welcome to the live time resource for **${cityName}**, ${country}. Currently, the local time in ${cityName} is determined by the ${zoneName} timezone rules. Whether you are scheduling an international business call, coordinating project handovers with remote team members, or planning your next vacation, keeping track of time zone differences is essential. Our digital clock displays the current local time in ${cityName} with high precision, updating in real time. Below, you will find a full breakdown of standard UTC offsets, daylight saving status, standard working hours, and comparative tables linking ${cityName} with other key global cities.`,
    `Need to know the current local time in **${cityName}**, ${country} right now? MeetMyZone coordinates live time metrics for the ${zoneName} timezone. Correctly calculating offsets is critical for remote coordinators, global investors, and travelers trying to avoid late-night calendar errors. The live-updating clock above shows the exact standard or daylight time for ${cityName}. In addition to the current time and date, this guide outlines the area's local working hours, daylight saving rules, and features shortcuts to popular converters so you can align team meetings without timezone friction.`,
    `Staying aligned with **${cityName}**, ${country} is easy with our real-time world clock tracker. Clocks in ${cityName} run on the official ${zoneName} database parameters, which adjust automatically for local daylight saving transitions. If you manage client relations, remote software development pipelines, or are calling friends abroad, checking local hours avoids disruptive disruptions. Explore our summary tables below to find standard business hours, coordinates, travel gateway information, and dynamic answers to frequently asked questions about ${cityName} time.`
  ];

  // Deterministically select template based on city name length
  const seed = cityName.length % 3;
  return introTemplates[seed];
}

export function generateCityFAQs(zone: ResolvedTimezone, dst: DstDetail): FAQItem[] {
  const cityName = zone.cityName;
  
  const now = DateTime.now();
  const dtCity = now.setZone(zone.zoneName);
  const dtLondon = now.setZone('Europe/London');
  const dtNY = now.setZone('America/New_York');
  
  const diffLondon = (dtCity.offset - dtLondon.offset) / 60;
  let ansLondon = "";
  if (diffLondon > 0) {
    ansLondon = `Yes, ${cityName} is ${diffLondon} ${diffLondon === 1 ? 'hour' : 'hours'} ahead of London.`;
  } else if (diffLondon < 0) {
    ansLondon = `No, ${cityName} is ${Math.abs(diffLondon)} ${Math.abs(diffLondon) === 1 ? 'hour' : 'hours'} behind London.`;
  } else {
    ansLondon = `No, ${cityName} is currently at the same time as London.`;
  }
  
  const diffNY = (dtCity.offset - dtNY.offset) / 60;
  let ansNY = "";
  if (diffNY > 0) {
    ansNY = `Yes, ${cityName} is ${diffNY} ${diffNY === 1 ? 'hour' : 'hours'} ahead of New York.`;
  } else if (diffNY < 0) {
    ansNY = `No, ${cityName} is ${Math.abs(diffNY)} ${Math.abs(diffNY) === 1 ? 'hour' : 'hours'} behind New York.`;
  } else {
    ansNY = `No, ${cityName} is currently at the same time as New York.`;
  }

  // Get current offset formatting (e.g. UTC+05:30)
  const offsetMinutes = dtCity.offset;
  const absOffsetMinutes = Math.abs(offsetMinutes);
  const offsetHours = Math.floor(absOffsetMinutes / 60);
  const offsetMinsRemainder = absOffsetMinutes % 60;
  const sign = offsetMinutes >= 0 ? '+' : '-';
  const offsetVal = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinsRemainder).padStart(2, '0')}`;

  return [
    {
      question: `What time is it in ${cityName} right now?`,
      answer: `You can view the exact live local time in ${cityName} on our interactive digital clock above. The clock updates continuously to ensure accuracy for business planning and travel.`
    },
    {
      question: `Does ${cityName} observe Daylight Saving Time (DST)?`,
      answer: dst.description
    },
    {
      question: `What UTC offset is used in ${cityName}?`,
      answer: `${cityName} currently uses the offset ${offsetVal} based on its standard timezone (${zone.displayName}).`
    },
    {
      question: `Is ${cityName} ahead of London?`,
      answer: `${ansLondon} When London shifts for British Summer Time (BST) or standard Greenwich Mean Time (GMT), this relationship may change depending on local daylight saving transitions.`
    },
    {
      question: `Is ${cityName} ahead of New York?`,
      answer: `${ansNY} This difference is calculated dynamically using live timezone database rules and automatically updates for Eastern Standard Time (EST) or Eastern Daylight Time (EDT) shifts.`
    }
  ];
}

export function generateRelatedLinksForCity(zone: ResolvedTimezone): { converters: RelatedLink[]; currentTimes: RelatedLink[] } {
  const slugify = (city: string) => city.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-');
  const citySlug = slugify(zone.cityName);
  const currentCity = zone.cityName;
  
  const converters: RelatedLink[] = [];
  const currentTimes: RelatedLink[] = [];
  
  const isEurope = zone.zoneName.startsWith('Europe/');
  const isAmerica = zone.zoneName.startsWith('America/');
  const isAsiaOrIndian = zone.zoneName.startsWith('Asia/') || zone.zoneName.startsWith('Indian/');
  const isAusOrPacific = zone.zoneName.startsWith('Australia/') || zone.zoneName.startsWith('Pacific/');
  
  if (isEurope) {
    converters.push(
      { label: `${currentCity} to New York Converter`, url: `/convert/${citySlug}-to-new-york` },
      { label: `${currentCity} to London Converter`, url: `/convert/${citySlug}-to-london` },
      { label: `${currentCity} to Sydney Converter`, url: `/convert/${citySlug}-to-sydney` },
      { label: `${currentCity} to Tokyo Converter`, url: `/convert/${citySlug}-to-tokyo` }
    );
    const citiesList = ['Paris', 'Berlin', 'Rome', 'Amsterdam', 'Madrid', 'London'].filter(c => c !== currentCity);
    citiesList.slice(0, 4).forEach(c => {
      currentTimes.push({ label: `Current Time in ${c}`, url: `/time-in/${slugify(c)}` });
    });
  } else if (isAmerica) {
    converters.push(
      { label: `${currentCity} to London Converter`, url: `/convert/${citySlug}-to-london` },
      { label: `${currentCity} to Tokyo Converter`, url: `/convert/${citySlug}-to-tokyo` },
      { label: `${currentCity} to Sydney Converter`, url: `/convert/${citySlug}-to-sydney` },
      { label: `${currentCity} to Los Angeles Converter`, url: `/convert/${citySlug}-to-los-angeles` }
    );
    const citiesList = ['New York', 'Los Angeles', 'Chicago', 'Denver', 'Halifax', 'Toronto', 'San Francisco'].filter(c => c !== currentCity);
    citiesList.slice(0, 4).forEach(c => {
      currentTimes.push({ label: `Current Time in ${c}`, url: `/time-in/${slugify(c)}` });
    });
  } else if (isAsiaOrIndian) {
    converters.push(
      { label: `${currentCity} to London Converter`, url: `/convert/${citySlug}-to-london` },
      { label: `${currentCity} to New York Converter`, url: `/convert/${citySlug}-to-new-york` },
      { label: `${currentCity} to Sydney Converter`, url: `/convert/${citySlug}-to-sydney` },
      { label: `${currentCity} to Paris Converter`, url: `/convert/${citySlug}-to-paris` }
    );
    const citiesList = ['Tokyo', 'Seoul', 'Singapore', 'Hong Kong', 'Mumbai', 'Dubai', 'Beijing'].filter(c => c !== currentCity);
    citiesList.slice(0, 4).forEach(c => {
      currentTimes.push({ label: `Current Time in ${c}`, url: `/time-in/${slugify(c)}` });
    });
  } else if (isAusOrPacific) {
    converters.push(
      { label: `${currentCity} to Tokyo Converter`, url: `/convert/${citySlug}-to-tokyo` },
      { label: `${currentCity} to London Converter`, url: `/convert/${citySlug}-to-london` },
      { label: `${currentCity} to New York Converter`, url: `/convert/${citySlug}-to-new-york` },
      { label: `${currentCity} to Singapore Converter`, url: `/convert/${citySlug}-to-singapore` }
    );
    const citiesList = ['Sydney', 'Melbourne', 'Brisbane', 'Auckland', 'Singapore', 'Tokyo'].filter(c => c !== currentCity);
    citiesList.slice(0, 4).forEach(c => {
      currentTimes.push({ label: `Current Time in ${c}`, url: `/time-in/${slugify(c)}` });
    });
  } else {
    // Fallback
    converters.push(
      { label: `${currentCity} to New York Converter`, url: `/convert/${citySlug}-to-new-york` },
      { label: `${currentCity} to London Converter`, url: `/convert/${citySlug}-to-london` },
      { label: `${currentCity} to Tokyo Converter`, url: `/convert/${citySlug}-to-tokyo` },
      { label: `${currentCity} to Sydney Converter`, url: `/convert/${citySlug}-to-sydney` }
    );
    const citiesList = ['London', 'New York', 'Tokyo', 'Sydney', 'Paris'].filter(c => c !== currentCity);
    citiesList.slice(0, 4).forEach(c => {
      currentTimes.push({ label: `Current Time in ${c}`, url: `/time-in/${slugify(c)}` });
    });
  }

  return { converters, currentTimes };
}
