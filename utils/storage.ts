/** Browser preferences must remain optional when storage is blocked or full. */
export function readSession(key: string): string | null {
  try { return window.sessionStorage.getItem(key); } catch { return null; }
}
export function writeSession(key: string, value: string): void {
  try { window.sessionStorage.setItem(key, value); } catch { /* Keep the current UI usable. */ }
}
export function removeSession(key: string): void {
  try { window.sessionStorage.removeItem(key); } catch { /* Storage is optional. */ }
}
