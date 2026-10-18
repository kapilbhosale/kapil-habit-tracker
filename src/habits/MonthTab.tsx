import { useState } from 'react'
import type { Habit, HabitLog } from './types'
import { MonthView } from './MonthView'
import { MonthGrid } from './MonthGrid'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onSetValue: (habitId: string, date: string, value: boolean | number) => void
}

type View = 'calendar' | 'grid'

export function MonthTab({ habits, logsByDate, onSetValue }: Props) {
  const [view, setView] = useState<View>('calendar')

  return (
    <div>
      <div className="mx-auto flex max-w-5xl justify-center gap-1 px-4 pt-4">
        <div className="inline-flex rounded-full border border-zinc-800 p-0.5">
          {(['calendar', 'grid'] as View[]).map((v) => (
            <button
              key={v}
              onClick={() => setView(v)}
              className={`rounded-full px-4 py-1.5 text-sm capitalize ${
                view === v ? 'bg-emerald-500 text-zinc-950' : 'text-zinc-400'
              }`}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {view === 'calendar' ? (
        <MonthView habits={habits} logsByDate={logsByDate} onSetValue={onSetValue} />
      ) : (
        <MonthGrid habits={habits} logsByDate={logsByDate} onSetValue={onSetValue} />
      )}
    </div>
  )
}
