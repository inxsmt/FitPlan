import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Salad, LogIn } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const Login = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white mb-4 shadow-lg">
            <Salad size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">FitPlan</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Zaloguj sie do swojego konta
          </p>
        </div>

        <div className="card animate-slide-up">
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

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              icon={LogIn}
              className="w-full"
            >
              {loading ? 'Logowanie...' : 'Zaloguj sie'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Nie masz konta?{' '}
            <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">
              Zarejestruj sie
            </Link>
          </p>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6">
          Projekt edukacyjny - Uniwersytet VIZJA
        </p>
      </div>
    </div>
  )
}
