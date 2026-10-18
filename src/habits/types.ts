export type Habit = {
  id: string
  name: string
  createdAt: number
  archived: boolean
}

// One doc per habit per day, keyed by `${habitId}_${yyyy-mm-dd}`.
export type HabitLog = {
  id: string
  habitId: string
  date: string // yyyy-mm-dd, local
  done: boolean
}
