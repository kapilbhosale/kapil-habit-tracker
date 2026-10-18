import { useEffect, useState } from 'react'
import {
  addDoc,
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
} from 'firebase/firestore'
import { db } from '../firebase'
import type { Habit, HabitLog } from './types'

function todayKey() {
  return new Date().toLocaleDateString('en-CA') // yyyy-mm-dd, local time
}

export function useHabits(uid: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logsByDate, setLogsByDate] = useState<Record<string, HabitLog>>({})

  useEffect(() => {
    if (!uid) return
    const habitsRef = collection(db, 'users', uid, 'habits')
    const unsubHabits = onSnapshot(query(habitsRef, orderBy('createdAt', 'asc')), (snap) => {
      setHabits(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Habit))
    })

    const logsRef = collection(db, 'users', uid, 'logs')
    const unsubLogs = onSnapshot(query(logsRef, orderBy('date', 'desc')), (snap) => {
      const map: Record<string, HabitLog> = {}
      for (const d of snap.docs) {
        const data = d.data() as Omit<HabitLog, 'id'>
        map[d.id] = { id: d.id, ...data }
      }
      setLogsByDate(map)
    })

    return () => {
      unsubHabits()
      unsubLogs()
    }
  }, [uid])

  const addHabit = async (name: string) => {
    if (!uid) return
    await addDoc(collection(db, 'users', uid, 'habits'), {
      name,
      createdAt: Date.now(),
      archived: false,
    })
  }

  const toggleToday = async (habitId: string) => {
    if (!uid) return
    const date = todayKey()
    const logId = `${habitId}_${date}`
    const current = logsByDate[logId]
    await setDoc(doc(db, 'users', uid, 'logs', logId), {
      habitId,
      date,
      done: !current?.done,
    })
  }

  const archiveHabit = async (habitId: string) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'habits', habitId), { archived: true })
  }

  return { habits, logsByDate, addHabit, toggleToday, archiveHabit, todayKey }
}
