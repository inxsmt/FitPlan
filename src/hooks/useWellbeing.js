import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useWellbeing = () => {
  const { user } = useAuth()
  const [wellbeingLogs, setWellbeingLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWellbeing = useCallback(async () => {
    if (!user) {
      setWellbeingLogs([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('wellbeing_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setWellbeingLogs(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchWellbeing()
  }, [fetchWellbeing])

  const addWellbeing = async (entry) => {
    if (!user) return { error: 'Brak uzytkownika' }
    const { data, error } = await supabase
      .from('wellbeing_logs')
      .insert([{ ...entry, user_id: user.id }])
      .select()
      .single()
    if (!error && data) setWellbeingLogs((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteWellbeing = async (id) => {
    const { error } = await supabase.from('wellbeing_logs').delete().eq('id', id)
    if (!error) setWellbeingLogs((prev) => prev.filter((w) => w.id !== id))
    return { error }
  }

  return { wellbeingLogs, loading, error, addWellbeing, deleteWellbeing, refetch: fetchWellbeing }
}
