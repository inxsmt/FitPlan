import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabaseClient'

/**
 * Pobiera laczna liczbe zarejestrowanych uzytkownikow
 * (przez funkcje RPC get_user_count omijajaca RLS).
 */
export const useUserCount = () => {
  const [count, setCount] = useState(null)

  useEffect(() => {
    let active = true
    supabase.rpc('get_user_count').then(({ data, error }) => {
      if (active && !error && typeof data === 'number') setCount(data)
    })
    return () => {
      active = false
    }
  }, [])

  return count
}

/**
 * Poprawna polska odmiana slowa "osoba" wg liczby.
 * 1 -> osoba, 2-4 -> osoby, 5+ oraz 12-14 -> osob
 */
export const osobyLabel = (n) => {
  const mod10 = n % 10
  const mod100 = n % 100
  if (n === 1) return 'osoba'
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return 'osoby'
  return 'osób'
}
