import { HABIT_COLORS, colorClasses, type HabitColor } from './colors'

export function ColorSwatchPicker({
  value,
  onChange,
}: {
  value: HabitColor
  onChange: (color: HabitColor) => void
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {HABIT_COLORS.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          aria-label={c}
          className={`h-8 w-8 rounded-full ${colorClasses(c).dot} ${
            value === c ? 'ring-2 ring-offset-2 ring-offset-zinc-900 ' + colorClasses(c).ring : ''
          }`}
        />
      ))}
    </div>
  )
}
