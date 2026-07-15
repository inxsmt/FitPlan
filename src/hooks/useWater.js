import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useWater = () => {
  const { user } = useAuth()
  const [waterLogs, setWaterLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchWater = useCallback(async () => {
    if (!user) {
      setWaterLogs([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('water_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setWaterLogs(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchWater()
  }, [fetchWater])

  const addWater = async (amountMl) => {
    if (!user) return { error: 'Brak uzytkownika' }
    const { data, error } = await supabase
      .from('water_logs')
      .insert([{ amount_ml: amountMl, user_id: user.id }])
      .select()
      .single()
    if (!error && data) setWaterLogs((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteWater = async (id) => {
    const { error } = await supabase.from('water_logs').delete().eq('id', id)
    if (!error) setWaterLogs((prev) => prev.filter((w) => w.id !== id))
    return { error }
  }

  return { waterLogs, loading, error, addWater, deleteWater, refetch: fetchWater }
}
