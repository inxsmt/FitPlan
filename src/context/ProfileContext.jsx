import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from './AuthContext'

const ProfileContext = createContext(null)

export const ProfileProvider = ({ children }) => {
  const { user } = useAuth()
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchProfile = useCallback(async () => {
    if (!user) {
      setProfile(null)
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) setError(error.message)
    else { setProfile(data); setError(null) }
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchProfile()
  }, [fetchProfile])

  const updateProfile = async (updates) => {
    if (!user) return { error: 'Brak użytkownika' }
    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (!error && data) setProfile(data)
    return { data, error }
  }

  return (
    <ProfileContext.Provider value={{ profile, loading, error, updateProfile, refetch: fetchProfile }}>
      {children}
    </ProfileContext.Provider>
  )
}

export const useProfileContext = () => {
  const ctx = useContext(ProfileContext)
  if (!ctx) throw new Error('useProfileContext musi byc wewnatrz ProfileProvider')
  return ctx
}
