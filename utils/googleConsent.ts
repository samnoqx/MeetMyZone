// Google's ISO 3166-1 regional defaults keep the existing automatic collection
// outside the EEA, UK and Switzerland. The Google CMP updates these defaults
// from the visitor's actual choices, not a home-grown analytics banner.
export const EUROPEAN_CONSENT_REGIONS = [
  'AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR',
  'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL', 'PL', 'PT', 'RO', 'SK',
  'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH',
];
export const GOOGLE_CONSENT_BOOTSTRAP = `window.dataLayer=window.dataLayer||[];window.gtag=window.gtag||function(){window.dataLayer.push(arguments);};window.gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',region:${JSON.stringify(EUROPEAN_CONSENT_REGIONS)},wait_for_update:500});`;
