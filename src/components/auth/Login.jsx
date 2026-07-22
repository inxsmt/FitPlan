import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Salad, LogIn, CheckCircle, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserCount, osobyLabel } from '../../hooks/useUserCount'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const Login = () => {
  const navigate = useNavigate()
  const { signIn, resetPassword } = useAuth()
  const userCount = useUserCount()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [forgotMode, setForgotMode] = useState(false)
  const [resetSent, setResetSent] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) {
      setError(error.message === 'Invalid login credentials'
        ? 'Nieprawidlowy email lub haslo'
        : error.message)
    } else {
      navigate('/dashboard')
    }
  }

  const handleReset = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const { error } = await resetPassword(email)
    setLoading(false)
    if (error) {
      setError(error.message)
    } else {
      setResetSent(true)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white mb-4 shadow-lg">
            <Salad size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">FitPlan</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {forgotMode ? 'Resetowanie hasla' : 'Zaloguj sie do swojego konta'}
          </p>
          {!forgotMode && userCount !== null && userCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-sm font-semibold">
              <Users size={16} />
              Dolaczylo juz {userCount} {osobyLabel(userCount)}!
            </div>
          )}
        </div>

        <div className="card animate-slide-up">
          {resetSent ? (
            <div className="text-center py-4">
              <div className="flex justify-center mb-4 text-green-500">
                <CheckCircle size={48} />
              </div>
              <h2 className="text-xl font-bold mb-2">Sprawdz swoj email</h2>
              <p className="text-slate-500 dark:text-slate-400 mb-4">
                Wyslalismy link do resetowania hasla na adres <strong>{email}</strong>
              </p>
              <button
                onClick={() => { setForgotMode(false); setResetSent(false) }}
                className="text-brand-600 hover:text-brand-700 font-semibold text-sm"
              >
                Wróc do logowania
              </button>
            </div>
          ) : forgotMode ? (
            <form onSubmit={handleReset} className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.com"
                required
                autoComplete="email"
              />

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} icon={Mail} className="w-full">
                {loading ? 'Wysylanie...' : 'Wyslij link resetujacy'}
              </Button>

              <p className="text-center text-sm text-slate-500 dark:text-slate-400">
                <button
                  type="button"
                  onClick={() => { setForgotMode(false); setError('') }}
                  className="text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Wróc do logowania
                </button>
              </p>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Email"
                type="email"
                icon={Mail}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="twoj@email.com"
                required
                autoComplete="email"
              />
              <Input
                label="Haslo"
                type="password"
                icon={Lock}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="********"
                required
                autoComplete="current-password"
              />

              <div className="text-right">
                <button
                  type="button"
                  onClick={() => { setForgotMode(true); setError('') }}
                  className="text-sm text-brand-600 hover:text-brand-700 font-semibold"
                >
                  Nie pamietasz hasla?
                </button>
              </div>

              {error && (
                <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                  {error}
                </div>
              )}

              <Button type="submit" disabled={loading} icon={LogIn} className="w-full">
                {loading ? 'Logowanie...' : 'Zaloguj sie'}
              </Button>
            </form>
          )}

          {!forgotMode && !resetSent && (
            <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
              Nie masz konta?{' '}
              <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">
                Zarejestruj sie
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Projekt edukacyjny - Uniwersytet VIZJA
        </p>
      </div>
    </div>
  )
}
