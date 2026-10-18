import { useState } from 'react'
import type { Habit, HabitType } from './types'
import { AddHabitForm } from './AddHabitForm'
import { ColorSwatchPicker } from './ColorSwatchPicker'
import { colorClasses, type HabitColor } from './colors'

type Props = {
  habits: Habit[]
  onAdd: (name: string, type: HabitType, color: HabitColor, unit?: string, target?: number) => void
  onArchive: (habitId: string) => void
  onUnarchive: (habitId: string) => void
  onRename: (habitId: string, name: string) => void
  onRecolor: (habitId: string, color: HabitColor) => void
  onSignOut: () => void
}

export function SettingsView({
  habits,
  onAdd,
  onArchive,
  onUnarchive,
  onRename,
  onRecolor,
  onSignOut,
}: Props) {
  const active = habits.filter((h) => !h.archived)
  const archived = habits.filter((h) => h.archived)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editName, setEditName] = useState('')
  const [pickingColorFor, setPickingColorFor] = useState<string | null>(null)

  const startEdit = (h: Habit) => {
    setEditingId(h.id)
    setEditName(h.name)
  }

  const saveEdit = () => {
    if (editingId && editName.trim()) onRename(editingId, editName.trim())
    setEditingId(null)
  }

  return (
    <div className="mx-auto max-w-md space-y-6 px-4 pb-24 pt-6">
      <AddHabitForm onAdd={onAdd} existingCount={habits.length} />

      <div>
        <h2 className="mb-2 text-sm font-medium text-zinc-400">Your habits</h2>
        <ul className="space-y-2">
          {active.map((h) => (
            <li key={h.id} className="rounded-lg border border-zinc-800 bg-zinc-900 px-3 py-2">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setPickingColorFor(pickingColorFor === h.id ? null : h.id)}
                  className={`h-4 w-4 shrink-0 rounded-full ${colorClasses(h.color).dot}`}
                  aria-label="Change color"
                />
                {editingId === h.id ? (
                  <input
                    autoFocus
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    onBlur={saveEdit}
                    onKeyDown={(e) => e.key === 'Enter' && saveEdit()}
                    className="ml-2 flex-1 rounded border border-zinc-700 bg-zinc-800 px-2 py-1 text-zinc-100"
                  />
                ) : (
                  <button onClick={() => startEdit(h)} className="ml-2 flex-1 text-left text-zinc-100">
                    {h.name}
                    {h.type === 'number' && (
                      <span className="ml-2 text-xs text-zinc-500">
                        number{h.target ? ` · target ${h.target}${h.unit ? ` ${h.unit}` : ''}` : ''}
                      </span>
                    )}
                  </button>
                )}
                <button
                  onClick={() => onArchive(h.id)}
                  className="ml-2 text-xs text-zinc-500 hover:text-red-400"
                >
                  Archive
                </button>
              </div>
              {pickingColorFor === h.id && (
                <div className="mt-3 border-t border-zinc-800 pt-3">
                  <ColorSwatchPicker
                    value={h.color ?? 'emerald'}
                    onChange={(c) => {
                      onRecolor(h.id, c)
                      setPickingColorFor(null)
                    }}
                  />
                </div>
              )}
            </li>
          ))}
          {active.length === 0 && (
            <p className="py-4 text-center text-sm text-zinc-500">No habits yet.</p>
          )}
        </ul>
      </div>

      {archived.length > 0 && (
        <div>
          <h2 className="mb-2 text-sm font-medium text-zinc-400">Archived</h2>
          <ul className="space-y-2">
            {archived.map((h) => (
              <li
                key={h.id}
                className="flex items-center justify-between rounded-lg border border-zinc-800 bg-zinc-900/50 px-3 py-2 text-zinc-500"
              >
                <span>{h.name}</span>
                <button
                  onClick={() => onUnarchive(h.id)}
                  className="text-xs text-emerald-400 hover:text-emerald-300"
                >
                  Restore
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      <button
        onClick={onSignOut}
        className="w-full rounded-md border border-zinc-800 px-4 py-2 text-sm text-zinc-400"
      >
        Sign out
      </button>
    </div>
  )
}
