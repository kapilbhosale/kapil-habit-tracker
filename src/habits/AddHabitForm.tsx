import { useState } from 'react'
import type { HabitType } from './types'
import { HABIT_COLORS, suggestColorForName, type HabitColor } from './colors'
import { ColorSwatchPicker } from './ColorSwatchPicker'

type Props = {
  onAdd: (name: string, type: HabitType, color: HabitColor, unit?: string, target?: number) => void
  existingCount: number
}

export function AddHabitForm({ onAdd, existingCount }: Props) {
  const [name, setName] = useState('')
  const [type, setType] = useState<HabitType>('boolean')
  const [color, setColor] = useState<HabitColor>(HABIT_COLORS[existingCount % HABIT_COLORS.length])
  const [colorTouched, setColorTouched] = useState(false)
  const [unit, setUnit] = useState('')
  const [target, setTarget] = useState('')

  const handleNameChange = (value: string) => {
    setName(value)
    // Suggest a color from the name itself so new habits land on a nice,
    // varied palette automatically — until the user picks one themselves.
    if (!colorTouched && value.trim()) setColor(suggestColorForName(value.trim()))
  }

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    onAdd(
      name.trim(),
      type,
      color,
      type === 'number' && unit.trim() ? unit.trim() : undefined,
      type === 'number' && target ? Number(target) : undefined,
    )
    setName('')
    setType('boolean')
    setColor(HABIT_COLORS[(existingCount + 1) % HABIT_COLORS.length])
    setColorTouched(false)
    setUnit('')
    setTarget('')
  }

  return (
    <form onSubmit={submit} className="rounded-xl border border-zinc-800 bg-zinc-900 p-4">
      <h2 className="mb-3 text-sm font-medium text-zinc-300">Add a habit</h2>

      <input
        value={name}
        onChange={(e) => handleNameChange(e.target.value)}
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

      <label className="mb-1.5 block text-sm text-zinc-400">
        Color {!colorTouched && name.trim() && <span className="text-zinc-600">(suggested)</span>}
      </label>
      <div className="mb-4">
        <ColorSwatchPicker
          value={color}
          onChange={(c) => {
            setColor(c)
            setColorTouched(true)
          }}
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950"
      >
        Add habit
      </button>
    </form>
  )
}
