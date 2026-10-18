import type { Habit, HabitLog } from './types'
import { completionRate, currentStreak, trendDelta } from './streaks'

type Tip = { icon: string; text: string; tone: 'good' | 'warn' }

function buildTips(active: Habit[], logsByDate: Record<string, HabitLog>, elapsedDates: string[]): Tip[] {
  if (active.length === 0 || elapsedDates.length < 3) return []

  const ranked = active.map((h) => ({
    h,
    rate: completionRate(h, logsByDate, elapsedDates),
    streak: currentStreak(h, logsByDate),
  }))

  const tips: Tip[] = []

  const best = [...ranked].sort((a, b) => b.rate - a.rate || b.streak - a.streak)[0]
  if (best && (best.rate >= 0.7 || best.streak >= 3)) {
    tips.push({
      icon: '✨',
      text:
        best.streak >= 3
          ? `${best.h.name} is on a ${best.streak}-day streak — keep it up`
          : `${best.h.name} is going great — ${Math.round(best.rate * 100)}% this month`,
      tone: 'good',
    })
  }

  const worst = [...ranked].filter((x) => x.rate < 0.4).sort((a, b) => a.rate - b.rate)[0]
  if (worst && worst.h.id !== best?.h.id) {
    tips.push({
      icon: '⚠️',
      text: `${worst.h.name} needs attention — only ${Math.round(worst.rate * 100)}% this month`,
      tone: 'warn',
    })
  }

  if (tips.length < 3) {
    const trending = active
      .map((h) => ({ h, trend: trendDelta(h, logsByDate, elapsedDates) }))
      .filter((x) => x.h.id !== best?.h.id && x.h.id !== worst?.h.id)
      .sort((a, b) => Math.abs(b.trend) - Math.abs(a.trend))[0]
    if (trending && Math.abs(trending.trend) >= 0.15) {
      tips.push({
        icon: trending.trend > 0 ? '📈' : '📉',
        text: `${trending.h.name} is ${trending.trend > 0 ? 'trending up' : 'slipping'} this month`,
        tone: trending.trend > 0 ? 'good' : 'warn',
      })
    }
  }

  return tips.slice(0, 3)
}

export function DashboardTips({
  habits,
  logsByDate,
  elapsedDates,
}: {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  elapsedDates: string[]
}) {
  const tips = buildTips(habits, logsByDate, elapsedDates)
  if (tips.length === 0) return null

  return (
    <div className="space-y-2">
      {tips.map((tip, i) => (
        <div
          key={i}
          className={`rounded-xl border p-3 text-sm ${
            tip.tone === 'good' ? 'border-emerald-800/50 bg-emerald-500/5' : 'border-amber-800/50 bg-amber-500/5'
          }`}
        >
          <span className="mr-1.5">{tip.icon}</span>
          <span className={tip.tone === 'good' ? 'text-emerald-200' : 'text-amber-200'}>{tip.text}</span>
        </div>
      ))}
    </div>
  )
}
