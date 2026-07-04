import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Salad, UserPlus, CheckCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('Haslo musi miec co najmniej 6 znakow')
      return
    }
    if (password !== passwordConfirm) {
      setError('Hasla nie sa identyczne')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else if (data?.user) {
      sessionStorage.setItem('accountCreated', 'true')
      setSuccess(true)
      if (!data.session) setTimeout(() => navigate('/login'), 2500)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
      {success && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl animate-fade-in">
          <CheckCircle size={22} />
          <span className="font-semibold">Konto zostalo utworzone!</span>
        </div>
      )}
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white mb-4 shadow-lg">
            <Salad size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Dolacz do FitPlan</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Stworz darmowe konto w 30 sekund
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
              placeholder="Min. 6 znakow"
              required
              autoComplete="new-password"
            />
            <Input
              label="Powtorz haslo"
              type="password"
              icon={Lock}
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Powtorz haslo"
              required
              autoComplete="new-password"
            />

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button
              type="submit"
              disabled={loading}
              icon={UserPlus}
              className="w-full"
            >
              {loading ? 'Tworzenie konta...' : 'Zarejestruj sie'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500 dark:text-slate-400 mt-6">
            Masz juz konto?{' '}
            <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
              Zaloguj sie
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
