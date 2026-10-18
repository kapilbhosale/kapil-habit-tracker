import { useEffect, useRef } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { getValue } from './streaks'
import { addDays, todayKey } from '../lib/date'
import { dayCompletionColorClass } from './colors'

const WEEKS = 53
const CELL = 10
const GAP = 3

// Aggregate, all-habits version of YearHeatmap: each cell is colored by how
// many of that day's habits were completed, using the same red -> amber ->
// lime -> green scale as the month grid's day-total column.
export function YearCompletionHeatmap({
  habits,
  logsByDate,
}: {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
}) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const today = todayKey()
  const totalDays = WEEKS * 7
  const todayWeekday = new Date().getDay()
  const startOffset = -(totalDays - 1 - (6 - todayWeekday))

  const columns = Array.from({ length: WEEKS }, (_, w) =>
    Array.from({ length: 7 }, (_, d) => addDays(today, startOffset + w * 7 + d)),
  )

  useEffect(() => {
    const raf = requestAnimationFrame(() => {
      const el = scrollRef.current
      if (el) el.scrollLeft = el.scrollWidth
    })
    return () => cancelAnimationFrame(raf)
  }, [habits.length])

  const dayTotal = (date: string) => habits.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length

  const perfectDays = columns.flat().filter((d) => d <= today && dayTotal(d) === habits.length && habits.length > 0).length

  return (
    <div>
      <div className="mb-2 flex items-center justify-between text-xs text-zinc-500">
        <span>Year completion</span>
        <span>{perfectDays} perfect days</span>
      </div>
      <div ref={scrollRef} className="overflow-x-auto [&::-webkit-scrollbar]:hidden" style={{ scrollbarWidth: 'none' }}>
        <div className="flex gap-[3px]" style={{ width: WEEKS * (CELL + GAP) }}>
          {columns.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[3px]">
              {week.map((date) => {
                const future = date > today
                return (
                  <div
                    key={date}
                    title={date}
                    className={`rounded-[2px] ${
                      future ? 'opacity-0' : dayCompletionColorClass(dayTotal(date), habits.length)
                    } ${date === today ? 'ring-1 ring-zinc-400' : ''}`}
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
