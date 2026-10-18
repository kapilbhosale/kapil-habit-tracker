import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { getValue } from './streaks'
import { colorClasses } from './colors'
import { todayKey } from '../lib/date'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  dates: string[] // the month's dates, oldest first
}

const COLS = 16 // wraps ~31 days into two tidy rows, Streaks-app style

export function MonthHabitHeatmaps({ habits, logsByDate, dates }: Props) {
  const today = todayKey()

  return (
    <div className="space-y-4">
      {habits.map((h) => {
        const c = colorClasses(h.color)
        const doneCount = dates.filter((d) => isDone(h, getValue(h.id, d, logsByDate))).length

        return (
          <div key={h.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-3">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={`h-2 w-2 rounded-full ${c.dot}`} />
                <span className="text-sm text-zinc-200">{h.name}</span>
              </div>
              <span className="text-xs text-zinc-500">
                {doneCount}/{dates.length}
              </span>
            </div>
            <div
              className="grid gap-1"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))` }}
            >
              {dates.map((d) => {
                const done = isDone(h, getValue(h.id, d, logsByDate))
                return (
                  <div
                    key={d}
                    title={d}
                    className={`aspect-square rounded-sm ${done ? c.dot : 'bg-zinc-800'} ${
                      d === today ? 'ring-1 ring-zinc-400' : ''
                    }`}
                  />
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
