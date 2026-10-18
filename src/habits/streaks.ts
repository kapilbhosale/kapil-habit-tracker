import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { addDays, todayKey, weekdayName } from '../lib/date'

export function getValue(
  habitId: string,
  date: string,
  logsByDate: Record<string, HabitLog>,
): boolean | number | undefined {
  return logsByDate[`${habitId}_${date}`]?.value
}

export function currentStreak(
  habit: Habit,
  logsByDate: Record<string, HabitLog>,
): number {
  const today = todayKey()
  let cursor = isDone(habit, getValue(habit.id, today, logsByDate)) ? today : addDays(today, -1)
  let streak = 0
  while (isDone(habit, getValue(habit.id, cursor, logsByDate))) {
    streak++
    cursor = addDays(cursor, -1)
  }
  return streak
}

export function longestStreak(
  habit: Habit,
  logsByDate: Record<string, HabitLog>,
  dateKeys: string[],
): number {
  let longest = 0
  let running = 0
  for (const date of dateKeys) {
    if (isDone(habit, getValue(habit.id, date, logsByDate))) {
      running++
      longest = Math.max(longest, running)
    } else {
      running = 0
    }
  }
  return longest
}

export function completionRate(
  habit: Habit,
  logsByDate: Record<string, HabitLog>,
  dateKeys: string[],
): number {
  if (dateKeys.length === 0) return 0
  const done = dateKeys.filter((d) => isDone(habit, getValue(habit.id, d, logsByDate))).length
  return done / dateKeys.length
}

export function bestWeekday(
  habit: Habit,
  logsByDate: Record<string, HabitLog>,
  dateKeys: string[],
): { weekday: string; rate: number } | null {
  const buckets: Record<string, { done: number; total: number }> = {}
  for (const date of dateKeys) {
    const wd = weekdayName(date)
    buckets[wd] ??= { done: 0, total: 0 }
    buckets[wd].total++
    if (isDone(habit, getValue(habit.id, date, logsByDate))) buckets[wd].done++
  }
  let best: { weekday: string; rate: number } | null = null
  for (const [weekday, { done, total }] of Object.entries(buckets)) {
    const rate = total > 0 ? done / total : 0
    if (!best || rate > best.rate) best = { weekday, rate }
  }
  return best
}

export function perfectDaysCount(
  habits: Habit[],
  logsByDate: Record<string, HabitLog>,
  dateKeys: string[],
): number {
  const active = habits.filter((h) => !h.archived)
  if (active.length === 0) return 0
  return dateKeys.filter((date) =>
    active.every((h) => isDone(h, getValue(h.id, date, logsByDate))),
  ).length
}

export function trendDelta(
  habit: Habit,
  logsByDate: Record<string, HabitLog>,
  dateKeys: string[],
): number {
  if (dateKeys.length < 4) return 0
  const mid = Math.floor(dateKeys.length / 2)
  const firstHalf = dateKeys.slice(0, mid)
  const secondHalf = dateKeys.slice(mid)
  return completionRate(habit, logsByDate, secondHalf) - completionRate(habit, logsByDate, firstHalf)
}
