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

/**
 * Resolves a city name to an official IANA timezone identifier.
 * Uses exact checks, dynamic index mapping, custom overrides, and partial scans.
 */
export function resolveTimeZone(city: string): string {
  const normalized = city.trim().toLowerCase();
  
  // 1. Try raw IANA matching
  const directIana = ALL_IANA_ZONES.find(z => z.toLowerCase() === normalized);
  if (directIana) {
    return directIana;
  }

  // 2. Try exact search match
  const indexMatch = ZONE_SEARCH_INDEX.find(item => item.key === normalized);
  if (indexMatch) {
    return indexMatch.zone;
  }

  // 3. Try custom CITY_TO_ZONE override
  if (CITY_TO_ZONE[normalized]) {
    return CITY_TO_ZONE[normalized];
  }
  
  // 4. Try partial matches
  const partial = ZONE_SEARCH_INDEX.find(item => 
    item.key.includes(normalized) || normalized.includes(item.key)
  );
  if (partial) {
    return partial.zone;
  }
  
  return city; // Fallback
}

/**
 * Checks if a formatted time string (e.g. '09:00 AM') represents a standard working hour
 * (between custom start and end hours inclusive).
 */
export function isWorkingHour(time: string, startHour: number = 8, endHour: number = 17): boolean {
  // Parse using Luxon's fromFormat
  const parsed = DateTime.fromFormat(time, 'hh:mm a');
  if (!parsed.isValid) return false;
  
  // Create boundary times on the same arbitrary day
  const start = parsed.set({ hour: startHour, minute: 0 });
  const end = parsed.set({ hour: endHour, minute: 0 });
  
  // Verify if it falls between start and end hours (handling overnight wraps)
  if (startHour <= endHour) {
    return parsed >= start && parsed <= end;
  } else {
    return parsed >= start || parsed <= end;
  }
}

export interface TimeMatrixCell {
  localTime: string;      // e.g. "09:00 AM"
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
  
  for (let h = 0; h < 24; h++) {
    const refTime = baseTime.plus({ hours: h });
    const citiesData: Record<string, TimeMatrixCell> = {};
    
    for (const city of cities) {
      const zone = (customMappings && customMappings[city]) || resolveTimeZone(city);
      const localTime = refTime.setZone(zone);
      
      const formattedLocal = localTime.toFormat('hh:mm a');
      const offsetVal = localTime.toFormat('ZZ'); // Format e.g., -05:00 or +01:00
      
      citiesData[city] = {
        localTime: formattedLocal,
        offset: `UTC${offsetVal}`,
        offsetName: localTime.offsetNameShort || '',
        isWorking: isWorkingHour(formattedLocal, workStart, workEnd),
        localHour: localTime.hour,
        cityName: city,
        ianaZone: zone,
      };
    }
    
    matrix.push({
      utcHour: h, // The column index (0 to 23 local to reference city)
      formattedUtcTime: refTime.toFormat('hh:mm a') + ` (${referenceCity})`,
      cities: citiesData,
    });
  }
  
  return matrix;
}
