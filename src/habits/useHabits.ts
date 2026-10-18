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
import { todayKey } from '../lib/date'
import type { Habit, HabitLog, HabitType } from './types'

export function useHabits(uid: string | undefined) {
  const [habits, setHabits] = useState<Habit[]>([])
  const [logsByDate, setLogsByDate] = useState<Record<string, HabitLog>>({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!uid) return
    const habitsRef = collection(db, 'users', uid, 'habits')
    const unsubHabits = onSnapshot(query(habitsRef, orderBy('createdAt', 'asc')), (snap) => {
      setHabits(snap.docs.map((d) => ({ id: d.id, ...d.data() }) as Habit))
      setLoading(false)
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

  const addHabit = async (name: string, type: HabitType, unit?: string, target?: number) => {
    if (!uid) return
    const habit: Record<string, unknown> = {
      name,
      type,
      createdAt: Date.now(),
      archived: false,
    }
    if (type === 'number') {
      if (unit) habit.unit = unit
      if (target) habit.target = target
    }
    await addDoc(collection(db, 'users', uid, 'habits'), habit)
  }

  const setValue = async (habitId: string, date: string, value: boolean | number) => {
    if (!uid) return
    const logId = `${habitId}_${date}`
    await setDoc(doc(db, 'users', uid, 'logs', logId), { habitId, date, value })
  }

  const toggleToday = async (habitId: string) => {
    const date = todayKey()
    const current = logsByDate[`${habitId}_${date}`]?.value
    await setValue(habitId, date, !(current === true))
  }

  const archiveHabit = async (habitId: string) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'habits', habitId), { archived: true })
  }

  const unarchiveHabit = async (habitId: string) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'habits', habitId), { archived: false })
  }

  const renameHabit = async (habitId: string, name: string) => {
    if (!uid) return
    await updateDoc(doc(db, 'users', uid, 'habits', habitId), { name })
  }

  return {
    habits,
    logsByDate,
    loading,
    addHabit,
    setValue,
    toggleToday,
    archiveHabit,
    unarchiveHabit,
    renameHabit,
  }
}
