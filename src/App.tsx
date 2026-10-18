import { useState } from 'react'
import { useAuth } from './auth/AuthContext'
import { useHabits } from './habits/useHabits'

function SignInScreen() {
  const { signIn } = useAuth()
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 text-zinc-100">
      <button
        onClick={signIn}
        className="rounded-lg bg-emerald-500 px-6 py-3 font-medium text-zinc-950 hover:bg-emerald-400"
      >
        Sign in with Google
      </button>
    </div>
  )
}

function HabitList({ uid }: { uid: string }) {
  const { habits, logsByDate, addHabit, toggleToday, todayKey } = useHabits(uid)
  const [name, setName] = useState('')
  const date = todayKey()

  return (
    <div className="mx-auto max-w-md px-4 py-8">
      <form
        className="mb-6 flex gap-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!name.trim()) return
          addHabit(name.trim())
          setName('')
        }}
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New habit"
          className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-3 py-2 text-zinc-100 placeholder-zinc-500"
        />
        <button
          type="submit"
          className="rounded-md bg-emerald-500 px-4 py-2 font-medium text-zinc-950 hover:bg-emerald-400"
        >
          Add
        </button>
      </form>

      <ul className="space-y-2">
        {habits
          .filter((h) => !h.archived)
          .map((h) => {
            const done = logsByDate[`${h.id}_${date}`]?.done ?? false
            return (
              <li key={h.id}>
                <button
                  onClick={() => toggleToday(h.id)}
                  className={`flex w-full items-center justify-between rounded-md border px-4 py-3 text-left transition ${
                    done
                      ? 'border-emerald-500 bg-emerald-500/10 text-emerald-300'
                      : 'border-zinc-700 bg-zinc-900 text-zinc-100'
                  }`}
                >
                  <span>{h.name}</span>
                  <span>{done ? '✓' : ''}</span>
                </button>
              </li>
            )
          })}
        {habits.length === 0 && (
          <p className="text-center text-sm text-zinc-500">No habits yet — add one above.</p>
        )}
      </ul>
    </div>
  )
}

function App() {
  const { user, loading, signOutUser } = useAuth()

  if (loading) {
    return <div className="min-h-screen bg-zinc-950" />
  }

  if (!user) {
    return <SignInScreen />
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <header className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
        <h1 className="text-lg font-semibold">Habits</h1>
        <button onClick={signOutUser} className="text-sm text-zinc-400 hover:text-zinc-200">
          Sign out
        </button>
      </header>
      <HabitList uid={user.uid} />
    </div>
  )
}

export default App
