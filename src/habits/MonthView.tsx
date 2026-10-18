import { useState } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { datesInMonth, MONTH_NAMES, todayKey } from '../lib/date'
import { getValue } from './streaks'
import { HabitDial } from './HabitDial'
import { colorClasses } from './colors'
import { MonthHabitHeatmaps } from './MonthHabitHeatmaps'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onSetValue: (habitId: string, date: string, value: boolean | number) => void
}

const WEEKDAY_HEADERS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

export function MonthView({ habits, logsByDate, onSetValue }: Props) {
  const now = new Date()
  const [year, setYear] = useState(now.getFullYear())
  const [month, setMonth] = useState(now.getMonth())
  const active = habits.filter((h) => !h.archived)
  const [selectedId, setSelectedId] = useState(active[0]?.id)
  const habit = active.find((h) => h.id === selectedId) ?? active[0]

  const dates = datesInMonth(year, month)
  const today = todayKey()
  const firstWeekday = new Date(year, month, 1).getDay()
  const cells: (string | null)[] = [...Array(firstWeekday).fill(null), ...dates]

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

  if (active.length === 0) {
    return <p className="px-4 py-8 text-center text-sm text-zinc-500">No habits yet.</p>
  }

  const cellTap = (date: string) => {
    const current = getValue(habit.id, date, logsByDate)
    if (habit.type === 'boolean') {
      onSetValue(habit.id, date, !(current === true))
    } else {
      onSetValue(habit.id, date, (Number(current) || 0) + 1)
    }
  }

  const doneCount = dates.filter((d) => isDone(habit, getValue(habit.id, d, logsByDate))).length
  const rate = dates.length ? Math.round((doneCount / dates.length) * 100) : 0
  const c = colorClasses(habit.color)

  return (
    <div className="mx-auto max-w-md px-4 pb-24 pt-6">
      <div className="mb-4 flex items-center justify-between">
        <button onClick={() => changeMonth(-1)} className="px-2 text-zinc-400">
          ‹
        </button>
        <div className="text-center">
          <div className="font-medium text-zinc-100">
            {MONTH_NAMES[month]} {year}
          </div>
          <div className="text-xs text-zinc-500">{rate}% complete</div>
        </div>
        <button onClick={() => changeMonth(1)} className="px-2 text-zinc-400">
          ›
        </button>
      </div>

      <div className="mb-2 grid grid-cols-7 gap-1.5">
        {WEEKDAY_HEADERS.map((w, i) => (
          <div key={i} className="text-center text-xs text-zinc-600">
            {w}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {cells.map((date, i) => {
          if (!date) return <div key={`pad-${i}`} />
          const value = getValue(habit.id, date, logsByDate)
          const done = isDone(habit, value)
          const dayNum = Number(date.slice(8, 10))
          const future = date > today
          return (
            <button
              key={date}
              onClick={() => !future && cellTap(date)}
              disabled={future}
              className={`flex aspect-square flex-col items-center justify-center rounded-lg text-sm ${
                future
                  ? 'cursor-not-allowed bg-zinc-950 text-zinc-800'
                  : done
                    ? `${c.bgSolid} ${c.onSolid}`
                    : 'bg-zinc-900 text-zinc-500 hover:bg-zinc-800'
              } ${date === today ? 'ring-1 ring-zinc-400' : ''}`}
            >
              <span>{dayNum}</span>
              {!future && habit.type === 'number' && Number(value) > 0 && (
                <span className="text-[9px] opacity-80">{Number(value)}</span>
              )}
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <HabitDial habits={active} selectedId={habit.id} onSelect={setSelectedId} />
      </div>

      <div className="mt-8">
        <h2 className="mb-3 text-xs font-medium text-zinc-500">All habits this month</h2>
        <MonthHabitHeatmaps habits={active} logsByDate={logsByDate} dates={dates} />
      </div>
    </div>
  )
}
