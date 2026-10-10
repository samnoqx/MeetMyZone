/** Escape TEXT values before inserting them into an RFC 5545 property. */
export function escapeCalendarText(value: string): string {
  return value.replace(/\\/g, '\\\\').replace(/\r\n|\r|\n/g, '\\n').replace(/;/g, '\\;').replace(/,/g, '\\,');
}
/** Fold at 75 UTF-8 octets without splitting a Unicode code point. */
export function foldCalendarLine(line: string): string {
  const encoder = new TextEncoder();
  let result = '', size = 0;
  for (const char of line) {
    const bytes = encoder.encode(char).length;
    if (size + bytes > 75) { result += '\r\n '; size = 1; }
    result += char; size += bytes;
  }
  return result;
}
