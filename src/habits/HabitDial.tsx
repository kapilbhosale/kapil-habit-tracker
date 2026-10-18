import { useEffect, useRef } from 'react'
import type { Habit } from './types'

const ITEM_HEIGHT = 40
const VISIBLE = 3 // odd, so one item centers exactly
const PAD = Math.floor(VISIBLE / 2) * ITEM_HEIGHT

type Props = {
  habits: Habit[]
  selectedId: string | undefined
  onSelect: (id: string) => void
}

export function HabitDial({ habits, selectedId, onSelect }: Props) {
  const ref = useRef<HTMLDivElement>(null)
  const settleTimer = useRef<ReturnType<typeof setTimeout>>(undefined)
  const selectedIndex = habits.findIndex((h) => h.id === selectedId)

  // Keep the dial in sync when selection changes from outside (e.g. month nav resets).
  useEffect(() => {
    const el = ref.current
    if (!el || selectedIndex < 0) return
    const target = selectedIndex * ITEM_HEIGHT
    if (Math.abs(el.scrollTop - target) > 2) el.scrollTo({ top: target })
  }, [selectedIndex])

  const handleScroll = () => {
    clearTimeout(settleTimer.current)
    settleTimer.current = setTimeout(() => {
      const el = ref.current
      if (!el) return
      const index = Math.round(el.scrollTop / ITEM_HEIGHT)
      const clamped = Math.max(0, Math.min(habits.length - 1, index))
      const habit = habits[clamped]
      if (habit && habit.id !== selectedId) onSelect(habit.id)
      el.scrollTo({ top: clamped * ITEM_HEIGHT, behavior: 'smooth' })
    }, 100)
  }

  const step = (delta: number) => {
    const next = Math.max(0, Math.min(habits.length - 1, selectedIndex + delta))
    onSelect(habits[next].id)
  }

  return (
    <div className="mx-auto flex max-w-xs items-center gap-2">
      <button
        onClick={() => step(-1)}
        className="shrink-0 px-2 text-zinc-500 disabled:opacity-20"
        disabled={selectedIndex <= 0}
      >
        ‹
      </button>

      <div className="relative flex-1 overflow-hidden" style={{ height: VISIBLE * ITEM_HEIGHT }}>
        <div
          className="pointer-events-none absolute inset-x-0 top-1/2 z-10 -translate-y-1/2 rounded-lg border border-zinc-700"
          style={{ height: ITEM_HEIGHT }}
        />
        <div
          ref={ref}
          onScroll={handleScroll}
          className="h-full snap-y snap-mandatory overflow-y-auto scroll-smooth [&::-webkit-scrollbar]:hidden"
          style={{ paddingBlock: PAD, scrollbarWidth: 'none' }}
        >
          {habits.map((h) => (
            <button
              key={h.id}
              onClick={() => onSelect(h.id)}
              className={`flex w-full snap-center items-center justify-center truncate px-2 text-center transition-colors ${
                h.id === selectedId ? 'text-base font-medium text-emerald-300' : 'text-sm text-zinc-600'
              }`}
              style={{ height: ITEM_HEIGHT }}
            >
              {h.name}
            </button>
          ))}
        </div>
      </div>

      <button
        onClick={() => step(1)}
        className="shrink-0 px-2 text-zinc-500 disabled:opacity-20"
        disabled={selectedIndex >= habits.length - 1}
      >
        ›
      </button>
    </div>
  )
}
