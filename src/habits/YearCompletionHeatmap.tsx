import { useEffect, useRef } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { getValue } from './streaks'
import { addDays, monthShortName, todayKey } from '../lib/date'
import { githubGreenClass } from './colors'

const WEEKS = 53
const CELL = 10
const GAP = 3

// Aggregate, all-habits version of YearHeatmap: each cell is colored by how
// many of that day's habits were completed, on a GitHub-style gray -> dark
// green ramp (the Month tab's red/amber/green status scale stays there).
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

  const monthLabels = columns.map((week, wi) => {
    const prevMonth = wi > 0 ? monthShortName(columns[wi - 1][0]) : null
    const thisMonth = monthShortName(week[0])
    return thisMonth !== prevMonth ? thisMonth : ''
  })

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
                const rate = habits.length > 0 ? dayTotal(date) / habits.length : 0
                return (
                  <div
                    key={date}
                    title={date}
                    className={`rounded-[2px] ${future ? 'opacity-0' : githubGreenClass(rate)} ${
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
