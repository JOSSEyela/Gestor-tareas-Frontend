import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { db } from '../firebase/config'
import type { CreateTaskInput, Status, Task, UpdateTaskInput } from '../types'

interface TaskState {
  tasks: Task[]
  userId: string | null
  isLoading: boolean
  setUserId: (id: string | null) => void
  addTask: (input: CreateTaskInput) => Promise<void>
  updateTask: (id: string, input: UpdateTaskInput) => Promise<void>
  deleteTask: (id: string) => Promise<void>
  moveTask: (id: string, status: Status) => Promise<void>
  subscribeToTasks: () => () => void
}

export const useTaskStore = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: [],
      userId: null,
      isLoading: false,

      setUserId: (id) => set({ userId: id }),

      addTask: async (input) => {
        const { userId } = get()
        if (!userId) return
        await addDoc(collection(db, 'tasks'), {
          ...input,
          createdAt: new Date().toISOString(),
        })
      },

      updateTask: async (id, input) => {
        await updateDoc(doc(db, 'tasks', id), { ...input })
      },

      deleteTask: async (id) => {
        await deleteDoc(doc(db, 'tasks', id))
      },

      moveTask: async (id, status) => {
        await updateDoc(doc(db, 'tasks', id), { status })
      },

      subscribeToTasks: () => {
        const { userId } = get()
        if (!userId) return () => {}

        set({ isLoading: true })

        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', userId),
          orderBy('createdAt', 'desc'),
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const tasks = snapshot.docs.map((docSnap) => ({
            id: docSnap.id,
            ...(docSnap.data() as Omit<Task, 'id'>),
          }))
          set({ tasks, isLoading: false })
        })

        return unsubscribe
      },
    }),
    {
      name: 'task-store',
      partialize: (state) => ({ tasks: state.tasks }),
    },
  ),
)
