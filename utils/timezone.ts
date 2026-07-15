import { DateTime } from 'luxon';

/**
 * Map of common city names to their corresponding IANA timezone identifiers.
 */
export const CITY_TO_ZONE: Record<string, string> = {
  'london': 'Europe/London',
  'new york': 'America/New_York',
  'tokyo': 'Asia/Tokyo',
  'sydney': 'Australia/Sydney',
  'paris': 'Europe/Paris',
  'dubai': 'Asia/Dubai',
  'los angeles': 'America/Los_Angeles',
  'chicago': 'America/Chicago',
  'hong kong': 'Asia/Hong_Kong',
  'singapore': 'Asia/Singapore',
  'mumbai': 'Asia/Kolkata',
  'kolkata': 'Asia/Kolkata',
  'new delhi': 'Asia/Kolkata',
  'delhi': 'Asia/Kolkata',
  'san francisco': 'America/Los_Angeles',
  'seoul': 'Asia/Seoul',
  'berlin': 'Europe/Berlin',
};

/**
 * Safely fetches all supported IANA timezone identifiers from the Intl API.
 * Falls back to a high-coverage list if the API is unavailable.
 */
function getSupportedTimeZones(): string[] {
  try {
    if (typeof Intl !== 'undefined' && typeof Intl.supportedValuesOf === 'function') {
      return Intl.supportedValuesOf('timeZone');
    }
  } catch {
    // Ignore error
  }
  
  return [
    'Africa/Abidjan', 'Africa/Accra', 'Africa/Addis_Ababa', 'Africa/Algiers', 'Africa/Asmara', 
    'Africa/Bamako', 'Africa/Bangui', 'Africa/Banjul', 'Africa/Bissau', 'Africa/Blantyre', 
    'Africa/Brazzaville', 'Africa/Bujumbura', 'Africa/Cairo', 'Africa/Casablanca', 'Africa/Ceuta', 
    'Africa/Conakry', 'Africa/Dakar', 'Africa/Dar_es_Salaam', 'Africa/Djibouti', 'Africa/Douala', 
    'Africa/El_Aaiun', 'Africa/Freetown', 'Africa/Gaborone', 'Africa/Harare', 'Africa/Johannesburg', 
    'Africa/Juba', 'Africa/Kampala', 'Africa/Khartoum', 'Africa/Kigali', 'Africa/Kinshasa', 
    'Africa/Lagos', 'Africa/Libreville', 'Africa/Lome', 'Africa/Luanda', 'Africa/Lubumbashi', 
    'Africa/Lusaka', 'Africa/Malabo', 'Africa/Maputo', 'Africa/Maseru', 'Africa/Mbabane', 
    'Africa/Mogadishu', 'Africa/Monrovia', 'Africa/Nairobi', 'Africa/Ndjamena', 'Africa/Niamey', 
    'Africa/Nouakchott', 'Africa/Ouagadougou', 'Africa/Porto-Novo', 'Africa/Sao_Tome', 'Africa/Tripoli', 
    'Africa/Tunis', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Anguilla', 
    'America/Antigua', 'America/Araguaina', 'America/Argentina/Buenos_Aires', 'America/Argentina/Catamarca', 
    'America/Argentina/Cordoba', 'America/Argentina/Jujuy', 'America/Argentina/La_Rioja', 
    'America/Argentina/Mendoza', 'America/Argentina/Rio_Gallegos', 'America/Argentina/Salta', 
    'America/Argentina/San_Juan', 'America/Argentina/San_Luis', 'America/Argentina/Tucuman', 
    'America/Argentina/Ushuaia', 'America/Aruba', 'America/Asuncion', 'America/Atikokan', 
    'America/Bahia', 'America/Bahia_Banderas', 'America/Barbados', 'America/Belem', 'America/Belize', 
    'America/Blanc-Sablon', 'America/Boa_Vista', 'America/Bogota', 'America/Boise', 'America/Cambridge_Bay', 
    'America/Campo_Grande', 'America/Cancun', 'America/Caracas', 'America/Cayenne', 'America/Cayman', 
    'America/Chicago', 'America/Chihuahua', 'America/Costa_Rica', 'America/Creston', 'America/Cuiaba', 
    'America/Curacao', 'America/Danmarkshavn', 'America/Dawson', 'America/Dawson_Creek', 'America/Denver', 
    'America/Detroit', 'America/Dominica', 'America/Edmonton', 'America/Eirunepe', 'America/El_Salvador', 
    'America/Fort_Nelson', 'America/Fortaleza', 'America/Glace_Bay', 'America/Goose_Bay', 
    'America/Grand_Turk', 'America/Grenada', 'America/Guadeloupe', 'America/Guatemala', 'America/Guayaquil', 
    'America/Guyana', 'America/Halifax', 'America/Havana', 'America/Hermosillo', 'America/Indiana/Indianapolis', 
    'America/Indiana/Knox', 'America/Indiana/Marengo', 'America/Indiana/Vevay', 'America/Indiana/Vincennes', 
    'America/Indiana/Winamac', 'America/Inuvik', 'America/Iqaluit', 'America/Jamaica', 'America/Juneau', 
    'America/Kentucky/Louisville', 'America/Kentucky/Monticello', 'America/Kralendijk', 'America/La_Paz', 
    'America/Lima', 'America/Los_Angeles', 'America/Lower_Princes', 'America/Maceio', 'America/Managua', 
    'America/Manaus', 'America/Marigot', 'America/Martinique', 'America/Matamoros', 'America/Mazatlan', 
    'America/Menominee', 'America/Merida', 'America/Metlakatla', 'America/Mexico_City', 'America/Miquelon', 
    'America/Moncton', 'America/Monterrey', 'America/Montevideo', 'America/Nassau', 'America/New_York', 
    'America/Nipigon', 'America/Nome', 'America/Noronha', 'America/North_Dakota/Beulah', 
    'America/North_Dakota/Center', 'America/North_Dakota/New_Salem', 'America/Ojinaga', 'America/Panama', 
    'America/Pangnirtung', 'America/Paramaribo', 'America/Phoenix', 'America/Port-au-Prince', 
    'America/Port_of_Spain', 'America/Porto_Velho', 'America/Puerto_Rico', 'America/Punta_Arenas', 
    'America/Rainy_River', 'America/Rankin_Inlet', 'America/Recife', 'America/Regina', 'America/Resolute', 
    'America/Rio_Branco', 'America/Santa_Isabel', 'America/Santarem', 'America/Santiago', 'America/Santo_Domingo', 
    'America/Sao_Paulo', 'America/Scoresbysund', 'America/Sitka', 'America/St_Barthelemy', 'America/St_Johns', 
    'America/St_Kitts', 'America/St_Lucia', 'America/St_Thomas', 'America/St_Vincent', 'America/Swift_Current', 
    'America/Tegucigalpa', 'America/Thule', 'America/Thunder_Bay', 'America/Tijuana', 'America/Toronto', 
    'America/Tortola', 'America/Vancouver', 'America/Whitehorse', 'America/Winnipeg', 'America/Yakutat', 
    'Antarctica/Casey', 'Antarctica/Davis', 'Antarctica/DumontDUrville', 'Antarctica/Macquarie', 
    'Antarctica/Mawson', 'Antarctica/McMurdo', 'Antarctica/Palmer', 'Antarctica/Rothera', 'Antarctica/Syowa', 
    'Antarctica/Troll', 'Antarctica/Vostok', 'Asia/Aden', 'Asia/Almaty', 'Asia/Amman', 'Asia/Anadyr', 
    'Asia/Aqtau', 'Asia/Aqtobe', 'Asia/Ashgabat', 'Asia/Atyrau', 'Asia/Baghdad', 'Asia/Bahrain', 
    'Asia/Baku', 'Asia/Bangkok', 'Asia/Barnaul', 'Asia/Beirut', 'Asia/Bishkek', 'Asia/Brunei', 
    'Asia/Chita', 'Asia/Choibalsan', 'Asia/Colombo', 'Asia/Damascus', 'Asia/Dhaka', 'Asia/Dili', 
    'Asia/Dubai', 'Asia/Dushanbe', 'Asia/Famagusta', 'Asia/Gaza', 'Asia/Hebron', 'Asia/Ho_Chi_Minh', 
    'Asia/Hong_Kong', 'Asia/Hovd', 'Asia/Irkutsk', 'Asia/Jakarta', 'Asia/Jayapura', 'Asia/Jerusalem', 
    'Asia/Kabul', 'Asia/Kamchatka', 'Asia/Karachi', 'Asia/Kathmandu', 'Asia/Khandyga', 'Asia/Kolkata', 
    'Asia/Krasnoyarsk', 'Asia/Kuala_Lumpur', 'Asia/Kuching', 'Asia/Kuwait', 'Asia/Macau', 'Asia/Magadan', 
    'Asia/Makassar', 'Asia/Manila', 'Asia/Muscat', 'Asia/Nicosia', 'Asia/Novokuznetsk', 'Asia/Novosibirsk', 
    'Asia/Omsk', 'Asia/Oral', 'Asia/Phnom_Penh', 'Asia/Pontianak', 'Asia/Pyongyang', 'Asia/Qatar', 
    'Asia/Qostanay', 'Asia/Qyzylorda', 'Asia/Riyadh', 'Asia/Sakhalin', 'Asia/Samarkand', 'Asia/Seoul', 
    'Asia/Shanghai', 'Asia/Singapore', 'Asia/Srednekolymsk', 'Asia/Taipei', 'Asia/Tashkent', 'Asia/Tbilisi', 
    'Asia/Tehran', 'Asia/Thimphu', 'Asia/Tokyo', 'Asia/Tomsk', 'Asia/Ulaanbaatar', 'Asia/Urumqi', 
    'Asia/Ust-Nera', 'Asia/Vientiane', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yangon', 'Asia/Yekaterinburg', 
    'Asia/Yerevan', 'Atlantic/Azores', 'Atlantic/Bermuda', 'Atlantic/Canary', 'Atlantic/Cape_Verde', 
    'Atlantic/Faroe', 'Atlantic/Madeira', 'Atlantic/Reykjavik', 'Atlantic/South_Georgia', 'Atlantic/St_Helena', 
    'Atlantic/Stanley', 'Australia/Adelaide', 'Australia/Brisbane', 'Australia/Broken_Hill', 'Australia/Darwin', 
    'Australia/Eucla', 'Australia/Hobart', 'Australia/Lindeman', 'Australia/Lord_Howe', 'Australia/Melbourne', 
    'Australia/Perth', 'Australia/Sydney', 'Europe/Amsterdam', 'Europe/Andorra', 'Europe/Astrakhan', 
    'Europe/Athens', 'Europe/Belgrade', 'Europe/Berlin', 'Europe/Bratislava', 'Europe/Brussels', 
    'Europe/Bucharest', 'Europe/Budapest', 'Europe/Busingen', 'Europe/Chisinau', 'Europe/Copenhagen', 
    'Europe/Dublin', 'Europe/Gibraltar', 'Europe/Guernsey', 'Europe/Helsinki', 'Europe/Isle_of_Man', 
    'Europe/Istanbul', 'Europe/Jersey', 'Europe/Kaliningrad', 'Europe/Kirov', 'Europe/Kyiv', 
    'Europe/Lisbon', 'Europe/Ljubljana', 'Europe/London', 'Europe/Luxembourg', 'Europe/Madrid', 
    'Europe/Malta', 'Europe/Mariehamn', 'Europe/Minsk', 'Europe/Monaco', 'Europe/Moscow', 'Europe/Oslo', 
    'Europe/Paris', 'Europe/Podgorica', 'Europe/Prague', 'Europe/Riga', 'Europe/Rome', 'Europe/Samara', 
    'Europe/San_Marino', 'Europe/Sarajevo', 'Europe/Saratov', 'Europe/Simferopol', 'Europe/Skopje', 
    'Europe/Sofia', 'Europe/Stockholm', 'Europe/Tallinn', 'Europe/Tirane', 'Europe/Ulyanovsk', 
    'Europe/Vaduz', 'Europe/Vatican', 'Europe/Vienna', 'Europe/Vilnius', 'Europe/Volgograd', 
    'Europe/Warsaw', 'Europe/Zagreb', 'Europe/Zurich', 'Indian/Antananarivo', 'Indian/Chagos', 
    'Indian/Christmas', 'Indian/Cocos', 'Indian/Comoro', 'Indian/Kerguelen', 'Indian/Mahe', 
    'Indian/Maldives', 'Indian/Mauritius', 'Indian/Mayotte', 'Indian/Reunion', 'Pacific/Apia', 
    'Pacific/Auckland', 'Pacific/Bougainville', 'Pacific/Chatham', 'Pacific/Chuuk', 'Pacific/Easter', 
    'Pacific/Efate', 'Pacific/Fakaofo', 'Pacific/Fiji', 'Pacific/Funafuti', 'Pacific/Galapagos', 
    'Pacific/Gambier', 'Pacific/Guadalcanal', 'Pacific/Guam', 'Pacific/Honolulu', 'Pacific/Kanton', 
    'Pacific/Kiritimati', 'Pacific/Kosrae', 'Pacific/Kwajalein', 'Pacific/Majuro', 'Pacific/Marquesas', 
    'Pacific/Nauru', 'Pacific/Niue', 'Pacific/Norfolk', 'Pacific/Noumea', 'Pacific/Pago_Pago', 
    'Pacific/Palau', 'Pacific/Pitcairn', 'Pacific/Pohnpei', 'Pacific/Port_Moresby', 'Pacific/Rarotonga', 
    'Pacific/Saipan', 'Pacific/Tahiti', 'Pacific/Tarawa', 'Pacific/Tongatapu', 'Pacific/Wake', 
    'Pacific/Wallis', 'UTC', 'GMT'
  ];
}

export const ALL_IANA_ZONES = getSupportedTimeZones();

// Pre-computed lowercase map for raw IANA matching
const ALL_IANA_ZONES_LOWER_MAP = new Map<string, string>();
ALL_IANA_ZONES.forEach((z) => {
  ALL_IANA_ZONES_LOWER_MAP.set(z.toLowerCase(), z);
});

export interface ZoneSearchItem {
  key: string;
  label: string;
  zone: string;
}

// Generate a fast city-to-zone search index
export const ZONE_SEARCH_INDEX: ZoneSearchItem[] = ALL_IANA_ZONES.map((zone) => {
  const parts = zone.split('/');
  const lastPart = parts[parts.length - 1];
  const cityName = lastPart.replace(/_/g, ' ');
  return {
    key: cityName.toLowerCase(),
    label: cityName,
    zone,
  };
});

// Pre-computed map for exact search matches
const ZONE_SEARCH_INDEX_MAP = new Map<string, string>();
ZONE_SEARCH_INDEX.forEach((item) => {
  ZONE_SEARCH_INDEX_MAP.set(item.key, item.zone);
});

// Resolution cache for resolveTimeZone
const resolveCache = new Map<string, string>();

/**
 * Resolves a city name to an official IANA timezone identifier.
 * Uses exact checks, dynamic index mapping, custom overrides, and partial scans.
 */
export function resolveTimeZone(city: string): string {
  const normalized = city.trim().toLowerCase();
  
  const cached = resolveCache.get(normalized);
  if (cached) {
    return cached;
  }

  let result = city;

  // 1. Try raw IANA matching
  const directIana = ALL_IANA_ZONES_LOWER_MAP.get(normalized);
  if (directIana) {
    result = directIana;
  } else {
    // 2. Try exact search match
    const indexMatch = ZONE_SEARCH_INDEX_MAP.get(normalized);
    if (indexMatch) {
      result = indexMatch;
    } else if (CITY_TO_ZONE[normalized]) {
      // 3. Try custom CITY_TO_ZONE override
      result = CITY_TO_ZONE[normalized];
    } else {
      // 4. Try partial matches
      const partial = ZONE_SEARCH_INDEX.find(item => 
        item.key.includes(normalized) || normalized.includes(item.key)
      );
      if (partial) {
        result = partial.zone;
      }
    }
  }

  resolveCache.set(normalized, result);
  return result;
}

/**
 * Checks if a local hour and minute falls within standard working hours
 * (between custom start and end hours inclusive).
 */
export function isWorkingHour(hour: number, minute: number, startHour: number = 8, endHour: number = 17): boolean {
  const currentMinutes = hour * 60 + minute;
  const startMinutes = startHour * 60;
  const endMinutes = endHour * 60;

  if (startHour <= endHour) {
    return currentMinutes >= startMinutes && currentMinutes <= endMinutes;
  } else {
    return currentMinutes >= startMinutes || currentMinutes <= endMinutes;
  }
}

export interface TimeMatrixCell {
  localTime: string;      // e.g. "09:00 AM"
  localTime24: string;    // e.g. "09:00"
  offset: string;         // e.g. "UTC-05:00"
  offsetName: string;     // e.g. "EST"
  isWorking: boolean;
  localHour: number;      // 0 to 23
  cityName: string;
  ianaZone: string;
}

export interface TimeMatrixHour {
  utcHour: number;
  formattedUtcTime: string; // e.g. "12:00 AM UTC"
  cities: Record<string, TimeMatrixCell>; // Map city name -> cell data
}

/**
 * Generates a 24-hour matrix of local times and offsets across multiple cities,
 * aligned column-by-column by the reference city's local hours (0 to 23).
 */
export function generateTimezoneMatrix(
  cities: string[], 
  referenceCity: string = 'London',
  workStart: number = 8,
  workEnd: number = 17,
  selectedDateStr?: string,
  customMappings?: Record<string, string>
): TimeMatrixHour[] {
  const matrix: TimeMatrixHour[] = [];
  
  // Resolve reference city timezone
  const refZone = (customMappings && customMappings[referenceCity]) || resolveTimeZone(referenceCity);
  
  // Start with selectedDate or today's date in reference zone at 00:00 local time
  const baseTime = selectedDateStr
    ? DateTime.fromISO(selectedDateStr).setZone(refZone).startOf('day')
    : DateTime.now().setZone(refZone).startOf('day');
  
  // Pre-resolve timezone names and short offset names once per city for the entire matrix
  const cityZones: Record<string, string> = {};
  const cityOffsetNames: Record<string, string> = {};
  for (const city of cities) {
    const zone = (customMappings && customMappings[city]) || resolveTimeZone(city);
    cityZones[city] = zone;
    cityOffsetNames[city] = baseTime.setZone(zone).offsetNameShort || '';
  }

  for (let h = 0; h < 24; h++) {
    const refTime = baseTime.plus({ hours: h });
    const citiesData: Record<string, TimeMatrixCell> = {};
    
    for (const city of cities) {
      const zone = cityZones[city];
      const localTime = refTime.setZone(zone);
      
      const hr = localTime.hour;
      const min = localTime.minute;
      const minStr = String(min).padStart(2, '0');
      
      const formattedLocal24 = `${String(hr).padStart(2, '0')}:${minStr}`;
      
      const period = hr >= 12 ? 'PM' : 'AM';
      const hr12 = hr % 12 === 0 ? 12 : hr % 12;
      const formattedLocal = `${String(hr12).padStart(2, '0')}:${minStr} ${period}`;
      
      const offsetMinutes = localTime.offset;
      const absOffsetMinutes = Math.abs(offsetMinutes);
      const offsetHours = Math.floor(absOffsetMinutes / 60);
      const offsetMinsRemainder = absOffsetMinutes % 60;
      const sign = offsetMinutes >= 0 ? '+' : '-';
      const offsetVal = `UTC${sign}${String(offsetHours).padStart(2, '0')}:${String(offsetMinsRemainder).padStart(2, '0')}`;
      
      citiesData[city] = {
        localTime: formattedLocal,
        localTime24: formattedLocal24,
        offset: offsetVal,
        offsetName: cityOffsetNames[city],
        isWorking: isWorkingHour(hr, min, workStart, workEnd),
        localHour: hr,
        cityName: city,
        ianaZone: zone,
      };
    }
    
    const refHour = refTime.hour;
    const refMin = refTime.minute;
    const refPeriod = refHour >= 12 ? 'PM' : 'AM';
    const refHour12 = refHour % 12 === 0 ? 12 : refHour % 12;
    const refFormattedTime = `${String(refHour12).padStart(2, '0')}:${String(refMin).padStart(2, '0')} ${refPeriod} (${referenceCity})`;

    matrix.push({
      utcHour: h, // The column index (0 to 23 local to reference city)
      formattedUtcTime: refFormattedTime,
      cities: citiesData,
    });
  }
  
  return matrix;
}

/**
 * Deduplicates search suggestions based on both their display label and IANA timezone.
 * Preserves the original ordering of the first occurrence.
 */
export function deduplicateSuggestions<T extends { label: string; timezone: string }>(list: T[]): T[] {
  const uniqueList: T[] = [];
  const seen = new Set<string>();
  for (const item of list) {
    const key = `${item.label.trim().toLowerCase()}|${item.timezone}`;
    if (!seen.has(key)) {
      seen.add(key);
      uniqueList.push(item);
    }
  }
  return uniqueList;
}

