import { useEffect, useRef } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { getValue } from './streaks'
import { addDays, monthShortName, todayKey } from '../lib/date'
import { densityClass } from './colors'

const WEEKS = 53
const CELL = 10
const GAP = 3

export function YearHeatmap({ habit, logsByDate }: { habit: Habit; logsByDate: Record<string, HabitLog> }) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const today = todayKey()
  const totalDays = WEEKS * 7
  // Align the grid so today lands at the bottom of the last column.
  const todayWeekday = new Date().getDay()
  const startOffset = -(totalDays - 1 - (6 - todayWeekday))

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(today, startOffset + w * 7 + d)),
  )

  useEffect(() => {
    // Wait a frame so the scroll container has its final laid-out width.
    const raf = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollLeft = el.scrollWidth
    })
    return () => cancelAnimationFrame(raf)
  }, [habit.id])

  const doneCount = columns.flat().filter((d) => isDone(habit, getValue(habit.id, d, logsByDate))).length

  // Label the first column of each new month.
  const monthLabels = columns.map((week, wi) => {
    const prevMonth = wi > 0 ? monthShortName(columns[wi - 1][0]) : null
    const thisMonth = monthShortName(week[0])
    return thisMonth !== prevMonth ? thisMonth : ''
  })

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>~1 year</span>
        <span>{doneCount} days</span>
      </div>
      <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-[3px]" style={{ width: WEEKS * (CELL + GAP) }}>
          {columns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date) => {
                const value = getValue(habit.id, date, logsByDate)
                const future = date > today
                const rate =
                  habit.type === 'number'
                    ? Math.min(1, (Number(value) || 0) / (habit.target || 1))
                    : value === true
                      ? 1
                      : 0
                return (
                  <div
                    key={date}
                    title={date}
                    className={`rounded-[2px] ${future ? 'opacity-0' : densityClass(habit.color, rate)} ${
                      date === today ? 'ring-1 ring-zinc-400' : ''
                    }`}
                    style={{ width: CELL, height: CELL }}
                  />
                )
              })}
            </div>
          ))}
        </div>
        <div className="mt-1 flex gap-[3px]" style={{ width: WEEKS * (CELL + GAP) }}>
          {monthLabels.map((label, wi) => (
            <div key={wi} className="text-[9px] text-zinc-600" style={{ width: CELL }}>
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
