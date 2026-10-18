import type { HabitColor } from './colors'

export type HabitType = 'boolean' | 'number'

export type Habit = {
  id: string
  name: string
  type: HabitType
  color?: HabitColor // undefined -> falls back to the default color
  unit?: string // e.g. "reps", "glasses" — number habits only
  target?: number // optional daily target — number habits only
  createdAt: number
  archived: boolean
}

// One doc per habit per day, keyed by `${habitId}_${yyyy-mm-dd}`.
export type HabitLog = {
  id: string
  habitId: string
  date: string // yyyy-mm-dd, local
  value: boolean | number
}

export function isDone(habit: Habit, value: boolean | number | undefined): boolean {
  if (value === undefined) return false
  if (habit.type === 'boolean') return value === true
  const n = value as number
  return habit.target ? n >= habit.target : n > 0
}
