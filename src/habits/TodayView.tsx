import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { todayKey } from '../lib/date'
import { currentStreak } from './streaks'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onToggle: (habitId: string) => void
  onSetValue: (habitId: string, date: string, value: number) => void
  onArchive: (habitId: string) => void
}

export function TodayView({ habits, logsByDate, onToggle, onSetValue, onArchive }: Props) {
  const date = todayKey()
  const active = habits.filter((h) => !h.archived)

  return (
    <div className="mx-auto max-w-md px-4 py-6">
      <ul className="space-y-2">
        {active.map((h) => {
          const value = logsByDate[`${h.id}_${date}`]?.value
          const done = isDone(h, value)
          const streak = currentStreak(h, logsByDate)

          return (
            <li
              key={h.id}
              className={`group rounded-xl border px-4 py-3 transition ${
                done
                  ? 'border-emerald-500 bg-emerald-500/10'
                  : 'border-zinc-800 bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                {h.type === 'boolean' ? (
                  <button
                    onClick={() => onToggle(h.id)}
                    className="flex flex-1 items-center justify-between text-left"
                  >
                    <span className={done ? 'text-emerald-300' : 'text-zinc-100'}>{h.name}</span>
                    <span
                      className={`flex h-6 w-6 items-center justify-center rounded-full border-2 text-sm ${
                        done ? 'border-emerald-400 bg-emerald-400 text-zinc-950' : 'border-zinc-600'
                      }`}
                    >
                      {done ? '✓' : ''}
                    </span>
                  </button>
                ) : (
                  <>
                    <span className={done ? 'text-emerald-300' : 'text-zinc-100'}>{h.name}</span>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onSetValue(h.id, date, Math.max(0, (Number(value) || 0) - 1))}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 text-zinc-300"
                      >
                        −
                      </button>
                      <span className="min-w-[2.5rem] text-center text-zinc-100">
                        {Number(value) || 0}
                        {h.unit ? <span className="text-zinc-500"> {h.unit}</span> : null}
                      </span>
                      <button
                        onClick={() => onSetValue(h.id, date, (Number(value) || 0) + 1)}
                        className="flex h-7 w-7 items-center justify-center rounded-full border border-zinc-700 text-zinc-300"
                      >
                        +
                      </button>
                    </div>
                  </>
                )}
                <button
                  onClick={() => onArchive(h.id)}
                  className="ml-1 hidden text-xs text-zinc-600 hover:text-red-400 group-hover:block"
                  title="Archive"
                >
                  ✕
                </button>
              </div>
              {streak > 0 && (
                <div className="mt-1 text-xs text-zinc-500">🔥 {streak} day streak</div>
              )}
              {h.type === 'number' && h.target ? (
                <div className="mt-1 text-xs text-zinc-500">target {h.target}{h.unit ? ` ${h.unit}` : ''}</div>
              ) : null}
            </li>
          )
        })}
        {active.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">No habits yet — add one below.</p>
        )}
      </ul>
    </div>
  )
}
