import { useState } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { datesInMonth, MONTH_NAMES, todayKey } from '../lib/date'
import { getValue } from './streaks'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onSetValue: (habitId: string, date: string, value: boolean | number) => void
}

export function MonthGrid({ habits, logsByDate, onSetValue }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const active = habits.filter((h) => !h.archived)
  const dates = datesInMonth(year, month)
  const today = todayKey()

  const changeMonth = (delta: number) => {
    let m = month + delta
    let y = year
    if (m < 0) {
      m = 11
      y--
    } else if (m > 11) {
      m = 0
      y++
    }
    setMonth(m)
    setYear(y)
  }

  const cellTap = (habit: Habit, date: string) => {
    const current = getValue(habit.id, date, logsByDate)
    if (habit.type === 'boolean') {
      onSetValue(habit.id, date, !(current === true))
    } else {
      onSetValue(habit.id, date, (Number(current) || 0) + 1)
    }
  }

  const dayTotal = (date: string) =>
    active.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length

  return (
    <div className="mx-auto max-w-5xl px-2 py-6">
      <div className="mb-4 flex items-center justify-between px-2">
        <button onClick={() => changeMonth(-1)} className="px-2 text-zinc-400">
          ‹
        </button>
        <h2 className="font-medium text-zinc-100">
          {MONTH_NAMES[month]} {year}
        </h2>
        <button onClick={() => changeMonth(1)} className="px-2 text-zinc-400">
          ›
        </button>
      </div>

      <div className="overflow-x-auto rounded-lg border border-zinc-800">
        <table className="border-collapse text-xs">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 min-w-[120px] bg-zinc-900 px-2 py-2 text-left text-zinc-400">
                Habit
              </th>
              {dates.map((d) => (
                <th
                  key={d}
                  className={`w-7 px-0.5 py-2 text-center font-normal ${
                    d === today ? 'text-emerald-400' : 'text-zinc-500'
                  }`}
                >
                  {Number(d.slice(8, 10))}
                </th>
              ))}
              <th className="min-w-[60px] px-2 py-2 text-right text-zinc-400">Rate</th>
            </tr>
          </thead>
          <tbody>
            {active.map((h) => {
              const doneCount = dates.filter((d) => isDone(h, getValue(h.id, d, logsByDate))).length
              const rate = dates.length ? Math.round((doneCount / dates.length) * 100) : 0
              return (
                <tr key={h.id} className="border-t border-zinc-800">
                  <td className="sticky left-0 z-10 min-w-[120px] bg-zinc-950 px-2 py-1.5 text-zinc-200">
                    {h.name}
                  </td>
                  {dates.map((d) => {
                    const value = getValue(h.id, d, logsByDate)
                    const done = isDone(h, value)
                    return (
                      <td key={d} className="w-7 px-0.5 py-1.5 text-center">
                        <button
                          onClick={() => cellTap(h, d)}
                          className={`flex h-6 w-6 items-center justify-center rounded ${
                            done
                              ? 'bg-emerald-500 text-zinc-950'
                              : 'bg-zinc-900 text-zinc-700 hover:bg-zinc-800'
                          }`}
                        >
                          {h.type === 'number'
                            ? Number(value) || ''
                            : done
                              ? '✓'
                              : ''}
                        </button>
                      </td>
                    )
                  })}
                  <td className="px-2 py-1.5 text-right text-zinc-400">{rate}%</td>
                </tr>
              )
            })}
            <tr className="border-t border-zinc-700 font-medium">
              <td className="sticky left-0 z-10 bg-zinc-950 px-2 py-1.5 text-zinc-300">Day total</td>
              {dates.map((d) => (
                <td key={d} className="px-0.5 py-1.5 text-center text-zinc-400">
                  {dayTotal(d) || ''}
                </td>
              ))}
              <td className="px-2 py-1.5 text-right text-zinc-500">/{active.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {active.length === 0 && (
        <p className="py-8 text-center text-sm text-zinc-500">No habits yet.</p>
      )}
    </div>
  )
}
