import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '../lib/supabase.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      if (session?.user) fetchProfile(session.user.id)
      else { setProfile(null); setLoading(false) }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    let { data } = await supabase
      .from('users')
      .select('*, roles(name)')
      .eq('id', userId)
      .single()

    // If no profile row exists yet, create it from auth user data
    if (!data) {
      const { data: { user: authUser } } = await supabase.auth.getUser()
      await supabase.from('users').insert({
        id: userId,
        email: authUser?.email || '',
        login: authUser?.email?.split('@')[0] || '',
        role_id: 2,
      })
      const { data: fresh } = await supabase
        .from('users')
        .select('*, roles(name)')
        .eq('id', userId)
        .single()
      data = fresh
    }

    setProfile(data)
    setLoading(false)
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    return { data, error }
  }

  async function signUp(email, password, login) {
    const { data, error } = await supabase.auth.signUp({ email, password })
    if (error) return { error }

    if (data.user) {
      await supabase.from('users').insert({
        id: data.user.id,
        email,
        login,
        role_id: 2,
      })
    }
    return { data, error }
  }

  async function signOut() {
    await supabase.auth.signOut()
    setProfile(null)
  }

  async function updateProfile(updates) {
    const { error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', user.id)
    if (!error) await fetchProfile(user.id)
    return { error }
  }

  async function deleteAccount() {
    await supabase.from('users').delete().eq('id', user.id)
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signIn, signUp, signOut, updateProfile, deleteAccount, fetchProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
