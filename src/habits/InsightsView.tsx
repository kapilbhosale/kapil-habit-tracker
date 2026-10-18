import type { Habit, HabitLog } from './types'
import { datesInMonth, MONTH_NAMES } from '../lib/date'
import {
  bestWeekday,
  completionRate,
  currentStreak,
  longestStreak,
  perfectDaysCount,
  trendDelta,
} from './streaks'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
}

export function InsightsView({ habits, logsByDate }: Props) {
  const active = habits.filter((h) => !h.archived)
  const now = new Date()
  const dates = datesInMonth(now.getFullYear(), now.getMonth())
  const elapsedDates = dates.filter((d) => d <= dates[now.getDate() - 1])

  const overallRate =
    active.length === 0
      ? 0
      : Math.round(
          (active.reduce((sum, h) => sum + completionRate(h, logsByDate, elapsedDates), 0) /
            active.length) *
            100,
        )
  const perfectDays = perfectDaysCount(active, logsByDate, elapsedDates)

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 py-6">
      <div className="grid grid-cols-2 gap-3">
        <StatCard label={`${MONTH_NAMES[now.getMonth()]} consistency`} value={`${overallRate}%`} />
        <StatCard label="Perfect days" value={`${perfectDays} / ${elapsedDates.length}`} />
      </div>

      <div className="space-y-3">
        {active.map((h) => {
          const streak = currentStreak(h, logsByDate)
          const longest = longestStreak(h, logsByDate, elapsedDates)
          const rate = Math.round(completionRate(h, logsByDate, elapsedDates) * 100)
          const best = bestWeekday(h, logsByDate, elapsedDates)
          const trend = trendDelta(h, logsByDate, elapsedDates)

          return (
            <div key={h.id} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <div className="mb-2 flex items-center justify-between">
                <span className="font-medium text-zinc-100">{h.name}</span>
                <span className="text-sm text-zinc-400">{rate}% this month</span>
              </div>
              <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-zinc-500">
                <span>🔥 {streak} day streak</span>
                <span>🏆 best {longest} days</span>
                {best && best.rate > 0 && <span>📅 strongest on {best.weekday}</span>}
                {Math.abs(trend) >= 0.15 && (
                  <span className={trend > 0 ? 'text-emerald-400' : 'text-amber-400'}>
                    {trend > 0 ? '↑ trending up' : '↓ trending down'}
                  </span>
                )}
              </div>
            </div>
          )
        })}
        {active.length === 0 && (
          <p className="py-8 text-center text-sm text-zinc-500">
            Add a few habits and check in daily to see insights here.
          </p>
        )}
      </div>
    </div>
  )
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
      <div className="text-2xl font-semibold text-emerald-400">{value}</div>
      <div className="mt-1 text-xs text-zinc-500">{label}</div>
    </div>
  )
}
