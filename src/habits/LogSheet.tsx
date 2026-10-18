import type { Habit, HabitLog } from './types'
import { TodayView } from './TodayView'

type Props = {
  habits: Habit[]
  logsByDate: Record<string, HabitLog>
  onToggle: (habitId: string) => void
  onSetValue: (habitId: string, date: string, value: number) => void
  onClose: () => void
}

export function LogSheet({ habits, logsByDate, onToggle, onSetValue, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-2xl bg-zinc-950 sm:rounded-2xl"
      >
        <div className="sticky top-0 flex items-center justify-between border-b border-zinc-800 bg-zinc-950 px-4 py-3">
          <h2 className="font-semibold text-zinc-100">Log today</h2>
          <button onClick={onClose} className="text-zinc-400">
            Done
          </button>
        </div>
        <TodayView
          habits={habits}
          logsByDate={logsByDate}
          onToggle={onToggle}
          onSetValue={onSetValue}
        />
      </div>
    </div>
  )
}
