import { useState, useEffect } from 'react'
import { User, Save, CheckCircle, Lock, Flame } from 'lucide-react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'

export const ProfileSettings = () => {
  const { user, updatePassword, signIn } = useAuth()
  const { profile, loading, updateProfile } = useProfile()
  const [form, setForm] = useState({ first_name: '', last_name: '' })
  const [calories, setCalories] = useState('')
  const [savingCalories, setSavingCalories] = useState(false)
  const [savedCalories, setSavedCalories] = useState(false)
  const [caloriesError, setCaloriesError] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [savedPassword, setSavedPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      })
      setCalories(profile.target_calories || 2000)
    }
  }, [profile])

  const handleCaloriesSubmit = async (e) => {
    e.preventDefault()
    setCaloriesError('')
    const val = parseInt(calories)
    if (!val || val < 500 || val > 10000) {
      setCaloriesError('Podaj wartość między 500 a 10000 kcal')
      return
    }
    setSavingCalories(true)
    const { error } = await updateProfile({ target_calories: val })
    setSavingCalories(false)
    if (error) {
      setCaloriesError(error.message)
    } else {
      setSavedCalories(true)
      setTimeout(() => setSavedCalories(false), 3000)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSaving(true)
    const { error } = await updateProfile({
      first_name: form.first_name.trim(),
      last_name: form.last_name.trim(),
    })
    setSaving(false)
    if (error) {
      setError(error.message)
    } else {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (!passwordForm.currentPassword) {
      setPasswordError('Podaj aktualne haslo')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      setPasswordError('Nowe haslo musi miec co najmniej 6 znakow')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPasswordError('Hasla nie sa identyczne')
      return
    }
    setSavingPassword(true)
    const { error: authError } = await signIn(user.email, passwordForm.currentPassword)
    if (authError) {
      setSavingPassword(false)
      setPasswordError('Aktualne haslo jest nieprawidlowe')
      return
    }
    const { error } = await updatePassword(passwordForm.newPassword)
    setSavingPassword(false)
    if (error) {
      setPasswordError(error.message)
    } else {
      setSavedPassword(true)
      setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      setTimeout(() => setSavedPassword(false), 3000)
    }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Ladowanie...</div>

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div>
        <h1 className="text-3xl font-bold mb-1">Ustawienia profilu</h1>
        <p className="text-slate-500 dark:text-slate-400">Uzupelnij swoje dane osobowe</p>
      </div>

      <Card>
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-brand-600 text-white flex items-center justify-center text-2xl font-bold">
            {form.first_name ? form.first_name[0].toUpperCase() : <User size={28} />}
          </div>
          <div>
            <p className="font-semibold text-lg">
              {form.first_name || form.last_name
                ? `${form.first_name} ${form.last_name}`.trim()
                : 'Brak imienia'}
            </p>
            <p className="text-sm text-slate-500">{user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Imię"
            icon={User}
            value={form.first_name}
            onChange={(e) => setForm({ ...form, first_name: e.target.value })}
            placeholder="np. Jan"
          />
          <Input
            label="Nazwisko"
            icon={User}
            value={form.last_name}
            onChange={(e) => setForm({ ...form, last_name: e.target.value })}
            placeholder="np. Kowalski"
          />

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          {saved && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Zapisano pomyślnie!
            </div>
          )}

          <Button type="submit" icon={Save} disabled={saving} className="w-full">
            {saving ? 'Zapisywanie...' : 'Zapisz zmiany'}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Flame size={18} /> Docelowe kalorie
        </h2>
        <form onSubmit={handleCaloriesSubmit} className="space-y-4">
          <Input
            label="Docelowe kalorie (kcal/dzień)"
            type="number"
            icon={Flame}
            value={calories}
            onChange={(e) => setCalories(e.target.value)}
            placeholder="np. 2000"
            min="500"
            max="10000"
          />

          {caloriesError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {caloriesError}
            </div>
          )}

          {savedCalories && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Kalorie zostały zaktualizowane!
            </div>
          )}

          <Button type="submit" icon={Save} disabled={savingCalories} className="w-full">
            {savingCalories ? 'Zapisywanie...' : 'Zapisz kalorie'}
          </Button>
        </form>
      </Card>

      <Card>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Lock size={18} /> Zmiana hasła
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            label="Aktualne hasło"
            type="password"
            icon={Lock}
            value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            placeholder="Wpisz aktualne hasło"
            autoComplete="current-password"
          />
          <Input
            label="Nowe hasło"
            type="password"
            icon={Lock}
            value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="Min. 6 znaków"
            autoComplete="new-password"
          />
          <Input
            label="Powtórz nowe hasło"
            type="password"
            icon={Lock}
            value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            placeholder="Powtórz hasło"
            autoComplete="new-password"
          />

          {passwordError && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {passwordError}
            </div>
          )}

          {savedPassword && (
            <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2">
              <CheckCircle size={16} /> Hasło zostało zmienione!
            </div>
          )}

          <Button type="submit" icon={Lock} disabled={savingPassword} className="w-full">
            {savingPassword ? 'Zmienianie...' : 'Zmień hasło'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
