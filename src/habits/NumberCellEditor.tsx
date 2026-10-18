// Small tap-to-open stepper for number-habit cells in the month grid/calendar —
// clearer than a tap-vs-hold gesture, and gives an obvious way to undo a mistap.
type Props = {
  habitName: string
  date: string
  value: number
  unit?: string
  onChange: (value: number) => void
  onClose: () => void
}

export function NumberCellEditor({ habitName, date, value, unit, onChange, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60" onClick={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-64 rounded-2xl border border-zinc-800 bg-zinc-900 p-5 text-center"
      >
        <div className="text-sm text-zinc-300">{habitName}</div>
        <div className="mt-0.5 text-xs text-zinc-600">{date}</div>

        <div className="mt-4 flex items-center justify-center gap-5">
          <button
            onClick={() => onChange(Math.max(0, value - 1))}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-xl text-zinc-300"
          >
            −
          </button>
          <span className="w-16 text-3xl font-semibold text-zinc-50">
            {value}
            {unit && <span className="ml-1 text-sm font-normal text-zinc-500">{unit}</span>}
          </span>
          <button
            onClick={() => onChange(value + 1)}
            className="flex h-11 w-11 items-center justify-center rounded-full border border-zinc-700 text-xl text-zinc-300"
          >
            +
          </button>
        </div>

        <button onClick={onClose} className="mt-5 text-sm text-zinc-500">
          Done
        </button>
      </div>
    </div>
  )
}
