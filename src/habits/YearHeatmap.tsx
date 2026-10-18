import { useEffect, useRef } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { getValue } from './streaks'
import { addDays, todayKey } from '../lib/date'
import { colorClasses } from './colors'

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
  const c = colorClasses(habit.color)

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

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>Past year</span>
        <span>{doneCount} days</span>
      </div>
      <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-[3px]" style={{ width: WEEKS * (CELL + GAP) }}>
          {columns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date) => {
                const done = isDone(habit, getValue(habit.id, date, logsByDate))
                const future = date > today
                return (
                  <div
                    key={date}
                    title={date}
                    className={`rounded-[2px] ${future ? 'opacity-0' : done ? c.dot : 'bg-zinc-800'} ${
                      date === today ? 'ring-1 ring-zinc-400' : ''
                    }`}
                    style={{ width: CELL, height: CELL }}
                  />
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
