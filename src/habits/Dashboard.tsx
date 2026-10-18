import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { addDays, datesInMonth, todayKey, weekdayName } from '../lib/date'
import { currentStreak, getValue, perfectDaysCount, trendDelta } from './streaks'
import { RecentHeatmap, RingMeter, WeekBars } from './charts'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onOpenLog: () => void
}

export function Dashboard({ habits, logsByDate, onOpenLog }: Props) {
  const active = habits.filter((h) => !h.archived)
  const today = todayKey()
  const now = new Date()
  const monthDates = datesInMonth(now.getFullYear(), now.getMonth())
  const elapsedDates = monthDates.slice(0, now.getDate())

  const dayRate = (date: string) => {
    if (active.length === 0) return 0
    const done = active.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length
    return done / active.length
  }

  const todayDone = active.filter((h) => isDone(h, getValue(h.id, today, logsByDate))).length
  const todayRate = active.length ? todayDone / active.length : 0

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
  const last14 = Array.from({ length: 14 }, (_, i) => addDays(today, i - 13))
  const weekData = last7.map((date) => ({
    label: weekdayName(date)[0],
    value: active.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length,
    max: active.length,
  }))

  const bestStreakHabit = active
    .map((h) => ({ h, streak: currentStreak(h, logsByDate) }))
    .filter((x) => x.streak > 0)
    .sort((a, b) => b.streak - a.streak)[0]

  const perfectDays = perfectDaysCount(active, logsByDate, elapsedDates)

  const topInsight = active
    .map((h) => ({ h, trend: trendDelta(h, logsByDate, elapsedDates) }))
    .sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend))[0]

  return (
    <div className="mx-auto max-w-md space-y-5 px-4 pb-28 pt-4">
      <button onClick={onOpenLog} className="flex w-full flex-col items-center gap-1.5 py-1">
        <RingMeter
          value={todayRate}
          size={112}
          label={`${todayDone}/${active.length}`}
          sublabel="today"
        />
        <span className="text-sm text-zinc-500">Tap to log today's habits</span>
      </button>

      {active.length === 0 ? (
        <p className="py-8 text-center text-sm text-zinc-500">
          No habits yet — add some from Settings.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <div className="text-2xl font-semibold text-emerald-400">
                {bestStreakHabit ? `🔥 ${bestStreakHabit.streak}` : '—'}
              </div>
              <div className="mt-1 text-xs text-zinc-500">
                {bestStreakHabit ? bestStreakHabit.h.name : 'No active streak'}
              </div>
            </div>
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4 text-center">
              <div className="text-2xl font-semibold text-emerald-400">{perfectDays}</div>
              <div className="mt-1 text-xs text-zinc-500">perfect days this month</div>
            </div>
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 text-xs font-medium text-zinc-400">Last 7 days</div>
            <WeekBars data={weekData} />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-3 text-xs font-medium text-zinc-400">Last 14 days</div>
            <RecentHeatmap dates={last14} rateByDate={dayRate} todayKey={today} />
          </div>

          {topInsight && Math.abs(topInsight.trend) >= 0.15 && (
            <div className="rounded-xl border border-emerald-800/50 bg-emerald-500/5 p-4 pr-14 text-sm">
              <span className="text-emerald-300">
                {topInsight.trend > 0 ? '📈' : '📉'} {topInsight.h.name}
              </span>{' '}
              <span className="text-zinc-400">
                is {topInsight.trend > 0 ? 'trending up' : 'slipping'} this month
              </span>
            </div>
          )}
        </>
      )}
    </div>
  )
}
