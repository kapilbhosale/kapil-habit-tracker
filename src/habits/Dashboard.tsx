import { useState } from 'react'
import type { Habit, HabitLog } from './types'
import { isDone } from './types'
import { addDays, datesFrom, datesInMonth, todayKey, weekdayName } from '../lib/date'
import { currentStreak, getValue, longestStreak, perfectDaysCount } from './streaks'
import { MonthLineChart, RingMeter, StatTile, WeekBars } from './charts'
import { HabitDial } from './HabitDial'
import { YearHeatmap } from './YearHeatmap'
import { YearCompletionHeatmap } from './YearCompletionHeatmap'
import { DashboardTips } from './DashboardTips'
import { useAuth } from '../auth/AuthContext'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onOpenLog: () => void
}

export function Dashboard({ habits, logsByDate, onOpenLog }: Props) {
  const { user } = useAuth()
  const firstName = user?.displayName?.split(' ')[0]

  const active = habits.filter((h) => !h.archived)
  const today = todayKey()
  const now = new Date()
  const monthDates = datesInMonth(now.getFullYear(), now.getMonth())
  const elapsedDates = monthDates.slice(0, now.getDate())

  const [yearHabitId, setYearHabitId] = useState(active[0]?.id)
  const yearHabit = active.find((h) => h.id === yearHabitId) ?? active[0]

  const todayDone = active.filter((h) => isDone(h, getValue(h.id, today, logsByDate))).length
  const todayRate = active.length ? todayDone / active.length : 0

  const last7 = Array.from({ length: 7 }, (_, i) => addDays(today, i - 6))
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

  const totalCheckins = elapsedDates.reduce(
    (sum, date) => sum + active.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length,
    0,
  )
  const totalPossible = elapsedDates.length * active.length
  const overallRate = totalPossible > 0 ? Math.round((totalCheckins / totalPossible) * 100) : 0
  const avgDaily = elapsedDates.length > 0 ? (totalCheckins / elapsedDates.length).toFixed(1) : '0.0'

  const allTimeStreak = active
    .map((h) => {
      const start = new Date(h.createdAt).toLocaleDateString('en-CA')
      return { h, best: longestStreak(h, logsByDate, datesFrom(start, today)) }
    })
    .sort((a, b) => b.best - a.best)[0]

  const last30 = Array.from({ length: 30 }, (_, i) => addDays(today, i - 29))
  const last30LineData = last30.map((date) => ({
    label: date.slice(8, 10),
    value: active.filter((h) => isDone(h, getValue(h.id, date, logsByDate))).length,
  }))

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 pb-28 pt-4">
      <h1 className="text-center text-lg font-medium text-zinc-100">
        {firstName ? `Welcome, ${firstName}` : 'Welcome back'}
      </h1>

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
          <div className="grid grid-cols-3 gap-2">
            <StatTile value={`${overallRate}%`} label="overall completion" color="emerald" />
            <StatTile value={`${totalCheckins}`} label="total check-ins" color="sky" />
            <StatTile value={avgDaily} label="avg daily habits" color="amber" />
            <StatTile
              value={bestStreakHabit ? `🔥 ${bestStreakHabit.streak}` : '—'}
              label={bestStreakHabit ? bestStreakHabit.h.name : 'no active streak'}
              color="violet"
            />
            <StatTile value={`${perfectDays}`} label="perfect days" color="rose" />
            <StatTile
              value={allTimeStreak && allTimeStreak.best > 0 ? `🏆 ${allTimeStreak.best}` : '—'}
              label={allTimeStreak && allTimeStreak.best > 0 ? `${allTimeStreak.h.name} best ever` : 'no record yet'}
              color="cyan"
            />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 text-xs font-medium text-zinc-400">Last 7 days</div>
            <WeekBars data={weekData} />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <div className="mb-2 text-xs font-medium text-zinc-400">Last 30 days</div>
            <MonthLineChart data={last30LineData} max={active.length} />
          </div>

          <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
            <YearCompletionHeatmap habits={active} logsByDate={logsByDate} />
          </div>

          {yearHabit && (
            <div className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
              <YearHeatmap habit={yearHabit} logsByDate={logsByDate} />
              <div className="mt-3">
                <HabitDial habits={active} selectedId={yearHabit.id} onSelect={setYearHabitId} />
              </div>
            </div>
          )}

          <DashboardTips habits={active} logsByDate={logsByDate} elapsedDates={elapsedDates} />
        </>
      )}
    </div>
  )
}
