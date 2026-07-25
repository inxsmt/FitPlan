import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'

export const useMeals = () => {
  const { user } = useAuth()
  const [meals, setMeals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const fetchMeals = useCallback(async () => {
    if (!user) {
      setMeals([])
      setLoading(false)
      return
    }
    setLoading(true)
    const { data, error } = await supabase
      .from('meal_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) setError(error.message)
    else setMeals(data || [])
    setLoading(false)
  }, [user])

  useEffect(() => {
    fetchMeals()
  }, [fetchMeals])

  const addMeal = async (meal) => {
    if (!user) return { error: 'Brak użytkownika' }
    const { data, error } = await supabase
      .from('meal_logs')
      .insert([{ ...meal, user_id: user.id }])
      .select()
      .single()
    if (!error && data) setMeals((prev) => [data, ...prev])
    return { data, error }
  }

  const deleteMeal = async (id) => {
    const { error } = await supabase.from('meal_logs').delete().eq('id', id)
    if (!error) setMeals((prev) => prev.filter((m) => m.id !== id))
    return { error }
  }

  return { meals, loading, error, addMeal, deleteMeal, refetch: fetchMeals }
}
