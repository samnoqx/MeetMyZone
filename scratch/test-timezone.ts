import { generateTimezoneMatrix } from '../utils/timezone';

const cities = ['London', 'New York'];
const matrix = generateTimezoneMatrix(cities);

console.log("Timezone Matrix Test (UTC hours 0, 12, and 23):");
[0, 12, 23].forEach(hour => {
  const row = matrix[hour];
  console.log(`\nUTC Hour: ${row.utcHour} (${row.formattedUtcTime})`);
  cities.forEach(city => {
    const data = row.cities[city];
    console.log(`  City: ${city}`);
    console.log(`    Local Time: ${data.localTime}`);
    console.log(`    Offset:     ${data.offset} (${data.offsetName})`);
    console.log(`    Working?:   ${data.isWorking}`);
    console.log(`    Local Hour: ${data.localHour}`);
  });
});
