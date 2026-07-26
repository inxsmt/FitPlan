import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useWeightLogs = () => {
  const { user } = useAuth()
  const [weightLogs, setWeightLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWeightLogs = useCallback(async () => {
    if (!user) {
      setWeightLogs([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('weight_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setWeightLogs(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchWeightLogs()
  }, [fetchWeightLogs])

  const addWeightLog = async ({ weightKg, waistCm = null, hipsCm = null }) => {
    if (!user) return { error: 'Brak użytkownika' }
    const { data, error } = await supabase
      .from('weight_logs')
      .insert([{ weight_kg: weightKg, waist_cm: waistCm, hips_cm: hipsCm, user_id: user.id }])
      .select()
      .single()
    if (!error && data) setWeightLogs((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteWeightLog = async (id) => {
    if (!user) return { error: 'Brak użytkownika' }
    const { error } = await supabase
      .from('weight_logs')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)
    if (!error) setWeightLogs((prev) => prev.filter((w) => w.id !== id))
    return { error }
  }

  return { weightLogs, loading, error, addWeightLog, deleteWeightLog, refetch: fetchWeightLogs }
}
