import { ImageResponse } from 'next/og';
import { DateTime } from 'luxon';
import { generateTimezoneMatrix, resolveTimeZone } from '@/utils/timezone';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const citiesParam = searchParams.get('cities');
    const zonesParam = searchParams.get('zones');
    const refParam = searchParams.get('reference');
    const startParam = searchParams.get('workStart');
    const endParam = searchParams.get('workEnd');
    const dateParam = searchParams.get('date');

    // Parse parameters
    const citiesList = citiesParam
      ? citiesParam.split(',').map((c) => decodeURIComponent(c.trim())).filter(Boolean)
      : ['London', 'New York'];

    const zonesList = zonesParam
      ? zonesParam.split(',').map((z) => decodeURIComponent(z.trim())).filter(Boolean)
      : [];

    const customMappings: Record<string, string> = {};
    citiesList.forEach((city, idx) => {
      customMappings[city] = zonesList[idx] || resolveTimeZone(city);
    });

    const referenceCity = refParam || citiesList[0] || 'London';
    const workStart = startParam ? parseInt(startParam) : 9;
    const workEnd = endParam ? parseInt(endParam) : 17;
    const selectedDate = dateParam || DateTime.now().toISODate() || '';

    // Calculate dates
    const dateObj = DateTime.fromISO(selectedDate);
    const dateStr = dateObj.isValid
      ? dateObj.toFormat('EEEE, LLLL dd, yyyy')
      : DateTime.now().toFormat('EEEE, LLLL dd, yyyy');

    // Calculate timezone matrix and find best overlapping slots
    const matrix = generateTimezoneMatrix(citiesList, referenceCity, workStart, workEnd, selectedDate, customMappings);
    
    // Find overlapping slots score
    const slots = matrix.map((row) => {
      const workingCities: string[] = [];
      citiesList.forEach((city) => {
        const cell = row.cities[city];
        if (cell && cell.isWorking) {
          workingCities.push(city);
        }
      });
      return {
        formattedUtc: row.formattedUtcTime,
        workingCities,
        score: workingCities.length,
      };
    });

    const recommendedSlots = slots
      .filter((slot) => slot.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 1);

    const bestSlot = recommendedSlots.length > 0 ? recommendedSlots[0] : null;
    const bestSlotIdx = bestSlot 
      ? matrix.findIndex(r => r.formattedUtcTime === bestSlot.formattedUtc)
      : -1;

    // Render image
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            backgroundColor: '#030712',
            backgroundImage: 'radial-gradient(circle at 80% 20%, #1e1b4b 0%, #030712 60%)',
            padding: '60px 80px',
            boxSizing: 'border-box',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          {/* Header Row */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div
                style={{
                  height: '12px',
                  width: '12px',
                  borderRadius: '9999px',
                  backgroundColor: '#0ea5e9',
                  marginRight: '12px',
                }}
              />
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: '800',
                  color: '#38bdf8',
                  textTransform: 'uppercase',
                  letterSpacing: '0.15em',
                }}
              >
                Timezone Matrix
              </span>
            </div>
            <span style={{ fontSize: '14px', fontWeight: '600', color: '#94a3b8' }}>{dateStr}</span>
          </div>

          {/* Main Content Area */}
          <div style={{ display: 'flex', width: '100%', justifyContent: 'space-between', alignItems: 'center', marginTop: '20px' }}>
            {/* Left side: Info & Overlap */}
            <div style={{ display: 'flex', flexDirection: 'column', width: '480px' }}>
              <span style={{ fontSize: '40px', fontWeight: '800', color: '#ffffff', lineHeight: '1.2' }}>
                Aligned Timezone Meeting Planner
              </span>
              <span style={{ fontSize: '16px', color: '#94a3b8', marginTop: '16px', lineHeight: '1.5' }}>
                Coordinating meeting availability across {citiesList.length} global regions. View schedules, overlaps, and sync times instantly.
              </span>

              {bestSlot && (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    marginTop: '28px',
                    padding: '16px 20px',
                    backgroundColor: 'rgba(16, 185, 129, 0.08)',
                    border: '1px solid rgba(16, 185, 129, 0.2)',
                    borderRadius: '12px',
                  }}
                >
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '800',
                      color: '#34d399',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Optimal Shared Window
                  </span>
                  <span style={{ fontSize: '20px', fontWeight: '800', color: '#ffffff', marginTop: '6px' }}>
                    {bestSlot.formattedUtc}
                  </span>
                  <span style={{ fontSize: '12px', color: '#a7f3d0', marginTop: '4px' }}>
                    Perfect overlap for {bestSlot.score} / {citiesList.length} locations
                  </span>
                </div>
              )}
            </div>

            {/* Right side: Locations Stack */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '460px',
                backgroundColor: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid #1e293b',
                borderRadius: '16px',
                padding: '24px',
              }}
            >
              {citiesList.slice(0, 4).map((city, idx) => {
                const cellAtSlot = bestSlotIdx !== -1 
                  ? matrix[bestSlotIdx]?.cities[city] 
                  : matrix[9]?.cities[city] || matrix[0]?.cities[city];
                
                if (!cellAtSlot) return null;

                const zone = cellAtSlot.ianaZone;
                const offsetStr = cellAtSlot.offset;
                const localTimeStr = cellAtSlot.localTime;
                const isWorkingAtSlot = cellAtSlot.isWorking;

                return (
                  <div
                    key={`og-city-${city}`}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '12px 0',
                      borderBottom: idx === Math.min(citiesList.length, 4) - 1 ? 'none' : '1px solid rgba(30, 41, 59, 0.5)',
                    }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <span style={{ fontSize: '18px', fontWeight: '700', color: '#f1f5f9' }}>{city.split(',')[0]}</span>
                      <span style={{ fontSize: '11px', color: '#64748b', marginTop: '2px' }}>{zone}</span>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span
                        style={{
                          fontSize: '15px',
                          fontWeight: '700',
                          fontFamily: 'monospace',
                          color: isWorkingAtSlot ? '#34d399' : '#94a3b8',
                          marginRight: '12px',
                        }}
                      >
                        {localTimeStr}
                      </span>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '800',
                          color: '#64748b',
                          backgroundColor: '#1e293b',
                          padding: '3px 8px',
                          borderRadius: '6px',
                          fontFamily: 'monospace',
                        }}
                      >
                        {offsetStr}
                      </span>
                    </div>
                  </div>
                );
              })}
              {citiesList.length > 4 && (
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                    + {citiesList.length - 4} more locations...
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Footer Row */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              width: '100%',
              borderTop: '1px solid #1e293b',
              paddingTop: '24px',
            }}
          >
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>
              meetmyzone.com
            </span>
            <span style={{ fontSize: '12px', color: '#475569', fontWeight: '700' }}>
              Interactive Meeting Link Preview
            </span>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    return new Response(`Failed to generate Open Graph image: ${errorMessage}`, {
      status: 500,
    });
  }
}
