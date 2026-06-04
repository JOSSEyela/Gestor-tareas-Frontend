import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from 'firebase/auth'
import { useEffect, useState } from 'react'
import { auth } from '../firebase/config'
import { useTaskStore } from '../store/useTaskStore'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const setUserId = useTaskStore((s) => s.setUserId)
  const subscribeToTasks = useTaskStore((s) => s.subscribeToTasks)
  const userId = useTaskStore((s) => s.userId)


  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
      setIsLoading(false)
      if (firebaseUser) {
        setUserId(firebaseUser.uid)
      } else {
        setUserId(null)
        useTaskStore.setState({ tasks: [] })
      }
    })
    return unsubscribeAuth
  }, [setUserId])

  useEffect(() => {
    if (!userId) return
    const unsubscribe = subscribeToTasks()
    return unsubscribe
  }, [userId, subscribeToTasks])

  const login = async () => {
    await signInWithPopup(auth, new GoogleAuthProvider())
  }

  const logout = async () => {
    await signOut(auth)
  }

  return { user, isLoading, login, logout }
}
