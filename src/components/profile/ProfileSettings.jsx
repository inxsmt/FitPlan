import { useState, useEffect } from 'react'
import { User, Save, CheckCircle, Lock, Scale } from 'lucide-react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'

export const ProfileSettings = () => {
  const { user, updatePassword, signIn } = useAuth()
  const { profile, loading, updateProfile } = useProfile()

  const [personalForm, setPersonalForm] = useState({ first_name: '', last_name: '', age: '', weight: '', height: '', gender: '' })
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [savedPersonal, setSavedPersonal] = useState(false)
  const [personalError, setPersonalError] = useState('')

  const[passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [savingPassword, setSavingPassword] = useState(false)
  const [savedPassword, setSavedPassword] = useState(false)
  const [passwordError, setPasswordError] = useState('')

  useEffect(() => {
    if (profile) {
      setPersonalForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
        age: profile.age || '',
        weight: profile.weight || '',
        height: profile.height || '',
        gender: profile.gender || '',
      })
    }
  }, [profile])

  const handlePersonalSubmit = async (e) => {
    e.preventDefault()
    setPersonalError('')
    setSavingPersonal(true)
    const { error } = await updateProfile({
      first_name: personalForm.first_name.trim(),
      last_name: personalForm.last_name.trim(),
      age: personalForm.age ? parseInt(personalForm.age) : null,
      weight: personalForm.weight ? parseFloat(personalForm.weight) : null,
      height: personalForm.height ? parseFloat(personalForm.height) : null,
      gender: personalForm.gender || null,
    })
    setSavingPersonal(false)
    if (error) setPersonalError(error.message)
    else { setSavedPersonal(true); setTimeout(() => setSavedPersonal(false), 3000) }
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (!passwordForm.currentPassword) { setPasswordError('Podaj aktualne haslo'); return }
    if (passwordForm.newPassword.length < 6) { setPasswordError('Nowe haslo musi miec co najmniej 6 znakow'); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError('Hasla nie sa identyczne'); return }
    setSavingPassword(true)
    const { error: authError } = await signIn(user.email, passwordForm.currentPassword)
    if (authError) { setSavingPassword(false); setPasswordError('Aktualne haslo jest nieprawidlowe'); return }
    const { error } = await updatePassword(passwordForm.newPassword)
    setSavingPassword(false)
    if (error) setPasswordError(error.message)
    else { setSavedPassword(true); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setTimeout(() => setSavedPassword(false), 3000) }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Ladowanie...</div>

  const weight = parseFloat(personalForm.weight) || null

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div>
        <h1 className="text-3xl font-bold mb-1">Ustawienia profilu</h1>
        <p className="text-slate-500 dark:text-slate-400">Uzupelnij swoje dane osobowe i zmien haslo</p>
      </div>

      {/* Dane osobowe */}
      <Card>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <User size={18} /> Dane osobowe
        </h2>
        <form onSubmit={handlePersonalSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <Input label="Imię" icon={User} value={personalForm.first_name}
              onChange={(e) => setPersonalForm({ ...personalForm, first_name: e.target.value })}
              placeholder="Jan" />
            <Input label="Nazwisko" icon={User} value={personalForm.last_name}
              onChange={(e) => setPersonalForm({ ...personalForm, last_name: e.target.value })}
              placeholder="Kowalski" />
          </div>
          <div className="grid grid-cols-3 gap-3">
            <Input label="Wiek (lata)" type="number" icon={User} value={personalForm.age}
              onChange={(e) => setPersonalForm({ ...personalForm, age: e.target.value })}
              placeholder="25" min="10" max="100" />
            <Input label="Waga (kg)" type="number" icon={Scale} value={personalForm.weight}
              onChange={(e) => setPersonalForm({ ...personalForm, weight: e.target.value })}
              placeholder="80" min="30" max="300" />
            <Input label="Wzrost (cm)" type="number" icon={Scale} value={personalForm.height}
              onChange={(e) => setPersonalForm({ ...personalForm, height: e.target.value })}
              placeholder="180" min="100" max="250" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1.5 text-slate-700 dark:text-slate-300">Płeć</label>
            <select
              value={personalForm.gender}
              onChange={(e) => setPersonalForm({ ...personalForm, gender: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Wybierz płeć</option>
              <option value="male">Mężczyzna</option>
              <option value="female">Kobieta</option>
              <option value="other">Inna</option>
            </select>
          </div>

          {personalError && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{personalError}</div>}
          {savedPersonal && <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Zapisano!</div>}

          <Button type="submit" icon={Save} disabled={savingPersonal} className="w-full">
            {savingPersonal ? 'Zapisywanie...' : 'Zapisz dane'}
          </Button>
        </form>
      </Card>

      {/* Zmiana hasła */}
      <Card>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <Lock size={18} /> Zmiana hasła
        </h2>
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input label="Aktualne hasło" type="password" icon={Lock} value={passwordForm.currentPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
            placeholder="Wpisz aktualne hasło" autoComplete="current-password" />
          <Input label="Nowe hasło" type="password" icon={Lock} value={passwordForm.newPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
            placeholder="Min. 6 znaków" autoComplete="new-password" />
          <Input label="Powtórz nowe hasło" type="password" icon={Lock} value={passwordForm.confirmPassword}
            onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
            placeholder="Powtórz hasło" autoComplete="new-password" />

          {passwordError && <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">{passwordError}</div>}
          {savedPassword && <div className="p-3 rounded-xl bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 text-sm flex items-center gap-2"><CheckCircle size={16} /> Hasło zostało zmienione!</div>}

          <Button type="submit" icon={Lock} disabled={savingPassword} className="w-full">
            {savingPassword ? 'Zmienianie...' : 'Zmień hasło'}
          </Button>
        </form>
      </Card>
    </div>
  )
}
