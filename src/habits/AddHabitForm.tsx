import { useState } from 'react'
import type { HabitType } from './types'

type Props = {
  onAdd: (name: string, type: HabitType, unit?: string, target?: number) => void
}

export function AddHabitForm({ onAdd }: Props) {
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
    setName('')
    setType('boolean')
    setUnit('')
    setTarget('')
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-medium text-zinc-300">Add a habit</h2>

      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="e.g. Push ups"
        className="mb-3 w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
      />

      <div className="mb-3 flex gap-2">
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
        <div className="mb-3 flex gap-2">
          <input
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            placeholder="unit (reps)"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
          />
          <input
            type="number"
            inputMode="numeric"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            placeholder="target (20)"
            className="w-full rounded-md border border-zinc-700 bg-zinc-800 px-3 py-2 text-zinc-100 placeholder-zinc-500"
          />
        </div>
      )}

      <button
        type="submit"
        className="w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950"
      >
        Add habit
      </button>
    </form>
  )
}
