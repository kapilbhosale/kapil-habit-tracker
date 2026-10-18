import { useState } from 'react'
import type { HabitType } from './types'

type Props = {
  onAdd: (name: string, type: HabitType, unit?: string, target?: number) => void
  onClose: () => void
}

export function AddHabitModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<HabitType>('boolean')
  const [unit, setUnit] = useState('')
  const [target, setTarget] = useState('')

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(
      name.trim(),
      type,
      type === 'number' && unit.trim() ? unit.trim() : undefined,
      type === 'number' && target ? Number(target) : undefined,
    )
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/60 sm:items-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        onSubmit={submit}
        className="w-full max-w-sm rounded-t-2xl bg-zinc-900 p-5 sm:rounded-2xl"
      >
        <h2 className="mb-4 text-lg font-semibold text-zinc-100">New habit</h2>

        <label className="mb-1 block text-sm text-zinc-400">Name</label>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Push ups"
          className="mb-4 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
        />

        <label className="mb-1 block text-sm text-zinc-400">Type</label>
        <div className="mb-4 flex gap-2">
          <button
            type="button"
            onClick={() => setType('boolean')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
              type === 'boolean'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                : 'border-zinc-700 text-zinc-400'
            }`}
          >
            Yes / No
          </button>
          <button
            type="button"
            onClick={() => setType('number')}
            className={`flex-1 rounded-md border px-3 py-2 text-sm font-medium ${
              type === 'number'
                ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                : 'border-zinc-700 text-zinc-400'
            }`}
          >
            Number
          </button>
        </div>

        {type === 'number' && (
          <div className="mb-4 flex gap-2">
            <div className="flex-1">
              <label className="mb-1 block text-sm text-zinc-400">Unit (optional)</label>
              <input
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="reps"
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
              />
            </div>
            <div className="flex-1">
              <label className="mb-1 block text-sm text-zinc-400">Daily target (optional)</label>
              <input
                type="number"
                inputMode="numeric"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                placeholder="20"
                className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-md border border-zinc-700 px-4 py-2 text-zinc-300"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex-1 rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950"
          >
            Add habit
          </button>
        </div>
      </form>
    </div>
  )
}
