export function toDateKey(d: Date): string {
  return d.toLocaleDateString('en-CA') // yyyy-mm-dd, local time
}

export function todayKey(): string {
  return toDateKey(new Date())
}

export function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

export function datesInMonth(year: number, month: number): string[] {
  const count = daysInMonth(year, month)
  const dates: string[] = []
  for (let day = 1; day <= count; day++) {
    dates.push(toDateKey(new Date(year, month, day)))
  }
  return dates
}

export function addDays(dateKey: string, delta: number): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  const date = new Date(y, m - 1, d + delta)
  return toDateKey(date)
}

export function weekdayName(dateKey: string): string {
  const [y, m, d] = dateKey.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString('en-US', { weekday: 'short' })
}

export const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
]
