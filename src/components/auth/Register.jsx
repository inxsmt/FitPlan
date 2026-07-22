import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Mail, Lock, Salad, UserPlus, CheckCircle, User, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useUserCount, osobyLabel } from '../../hooks/useUserCount'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const Register = () => {
  const navigate = useNavigate()
  const { signUp } = useAuth()
  const userCount = useUserCount()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [error, setError] = useState('')
  const [status, setStatus] = useState(null) // null | 'confirm_email' | 'success'
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!firstName.trim() || !lastName.trim()) {
      setError('Podaj imie i nazwisko')
      return
    }
    const nameRegex = /^[\p{L}][\p{L} '-]*$/u
    if (!nameRegex.test(firstName.trim()) || !nameRegex.test(lastName.trim())) {
      setError('Imie i nazwisko moga zawierac tylko litery, spacje i myslnik')
      return
    }
    if (password.length < 6) {
      setError('Haslo musi miec co najmniej 6 znakow')
      return
    }
    if (password !== passwordConfirm) {
      setError('Hasla nie sa identyczne')
      return
    }

    setLoading(true)
    const { data, error } = await signUp(email, password, firstName, lastName)
    setLoading(false)

    if (error) {
      setError(error.message)
    } else if (data?.session) {
      sessionStorage.setItem('accountCreated', 'true')
      setStatus('success')
      setTimeout(() => navigate('/dashboard'), 2000)
    } else {
      setStatus('confirm_email')
    }
  }

  if (status === 'confirm_email') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
        <div className="card max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">Sprawdz swoja skrzynke!</h2>
          <p className="text-slate-500 dark:text-slate-400 mb-2">
            Wyslalismy link potwierdzajacy na adres:
          </p>
          <p className="font-semibold text-brand-600 mb-4">{email}</p>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">
            Kliknij w link w mailu aby aktywowac konto, a nastepnie zaloguj sie.
          </p>
          <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold text-sm">
            Przejdz do logowania
          </Link>
        </div>
      </div>
    )
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
        <div className="card max-w-md w-full text-center animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Witaj, {firstName.trim()}! Konto utworzone!
          </h2>
          <p className="text-slate-500 dark:text-slate-400">
            Przekierowuje do dashboardu...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-brand-50 dark:from-dark-bg dark:to-slate-900 p-4">
      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-600 text-white mb-4 shadow-lg">
            <Salad size={32} />
          </div>
          <h1 className="text-3xl font-bold mb-2">Dolacz do FitPlan</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Stworz darmowe konto w 30 sekund
          </p>
          {userCount !== null && userCount > 0 && (
            <div className="inline-flex items-center gap-2 mt-4 px-4 py-1.5 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-sm font-semibold">
              <Users size={16} />
              Dolaczylo juz {userCount} {osobyLabel(userCount)}!
            </div>
          )}
        </div>

        <div className="card animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Imie"
                type="text"
                icon={User}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Jan"
                required
                autoComplete="given-name"
              />
              <Input
                label="Nazwisko"
                type="text"
                icon={User}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Kowalski"
                required
                autoComplete="family-name"
              />
            </div>
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

            <Button type="submit" disabled={loading} icon={UserPlus} className="w-full">
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
