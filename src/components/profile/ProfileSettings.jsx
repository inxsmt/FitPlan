import { useState, useEffect } from 'react'
import { User, Save, CheckCircle, Lock, Scale, ShieldCheck, Mail } from 'lucide-react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { PrivacyNotice } from '../ui/PrivacyNotice'
import { CONTACT_EMAIL } from '../feedback/FeedbackModal'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'

export const ProfileSettings = () => {
  const { user, updatePassword, signIn } = useAuth()
  const { profile, loading, updateProfile } = useProfile()

  const [personalForm, setPersonalForm] = useState({ first_name: '', last_name: '', age: '', weight: '', height: '', gender: '' })
  const [savingPersonal, setSavingPersonal] = useState(false)
  const [savedPersonal, setSavedPersonal] = useState(false)
  const [personalError, setPersonalError] = useState('')

  const [savingConsent, setSavingConsent] = useState(false)
  const [consentError, setConsentError] = useState('')

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
      first_name: personalForm.first_name.trim().slice(0, 50),
      last_name: personalForm.last_name.trim().slice(0, 50),
      age: personalForm.age ? parseInt(personalForm.age) : null,
      weight: personalForm.weight ? parseFloat(personalForm.weight) : null,
      height: personalForm.height ? parseFloat(personalForm.height) : null,
      gender: personalForm.gender || null,
    })
    setSavingPersonal(false)
    if (error) setPersonalError(error.message)
    else { setSavedPersonal(true); setTimeout(() => setSavedPersonal(false), 3000) }
  }

  // Zgode mozna w aplikacji tylko UDZIELIC - raz udzielonej nie da sie
  // odznaczyc (pole jest wtedy wylaczone). Wycofanie odbywa sie mailowo:
  // uzytkownik pisze na adres kontaktowy, a konto wraz z danymi jest usuwane
  // z bazy - o czym informuje komunikat pod polem. Dlatego handler reaguje
  // wylacznie na zaznaczenie; ewentualne odznaczenie jest ignorowane.
  const handleConsentToggle = async (checked) => {
    if (!checked) return
    setConsentError('')
    setSavingConsent(true)
    const { error } = await updateProfile({
      presentation_consent_at: new Date().toISOString(),
    })
    setSavingConsent(false)
    if (error) setConsentError(error.message)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()
    setPasswordError('')
    if (!passwordForm.currentPassword) { setPasswordError('Podaj aktualne hasło'); return }
    if (passwordForm.newPassword.length < 6) { setPasswordError('Nowe hasło musi mieć co najmniej 6 znaków'); return }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) { setPasswordError('Hasła nie są identyczne'); return }
    setSavingPassword(true)
    const { error: authError } = await signIn(user.email, passwordForm.currentPassword)
    if (authError) { setSavingPassword(false); setPasswordError('Aktualne hasło jest nieprawidłowe'); return }
    const { error } = await updatePassword(passwordForm.newPassword)
    setSavingPassword(false)
    if (error) setPasswordError(error.message)
    else { setSavedPassword(true); setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' }); setTimeout(() => setSavedPassword(false), 3000) }
  }

  if (loading) return <div className="text-center py-12 text-slate-500">Ładowanie...</div>

  const weight = parseFloat(personalForm.weight) || null

  // NULL w kolumnie = brak zgody, data = zgoda udzielona wtedy i wtedy.
  const hasConsent = Boolean(profile?.presentation_consent_at)
  const consentDate = hasConsent
    ? new Date(profile.presentation_consent_at).toLocaleDateString('pl-PL', {
        day: 'numeric', month: 'long', year: 'numeric',
      })
    : null

  return (
    <div className="space-y-6 animate-fade-in max-w-lg">
      <div>
        <h1 className="text-3xl font-bold mb-1">Ustawienia profilu</h1>
        <p className="text-slate-500 dark:text-slate-400">Uzupełnij swoje dane osobowe i zmień hasło</p>
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
              placeholder="Jan" maxLength={50} />
            <Input label="Nazwisko" icon={User} value={personalForm.last_name}
              onChange={(e) => setPersonalForm({ ...personalForm, last_name: e.target.value })}
              placeholder="Kowalski" maxLength={50} />
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

      {/* Udział w projekcie - zgode mozna udzielic, ale nie cofnac w aplikacji.
          Wycofanie odbywa sie mailowo (usuniecie konta i danych z bazy). */}
      <Card>
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <ShieldCheck size={18} /> Udział w projekcie
        </h2>

        {/* Ta sama klauzula co przy rejestracji - dzieki temu widza ja rowniez
            osoby, ktore zalozyly konto, zanim zostala wprowadzona. */}
        <PrivacyNotice className="mb-4" />

        <label className={`flex items-start gap-3 ${hasConsent ? 'cursor-default' : 'cursor-pointer'}`}>
          <input
            type="checkbox"
            checked={hasConsent}
            disabled={savingConsent || hasConsent}
            onChange={(e) => handleConsentToggle(e.target.checked)}
            className="mt-0.5 w-4 h-4 shrink-0 rounded border-slate-300 dark:border-dark-border text-brand-600 focus:ring-2 focus:ring-brand-500 disabled:cursor-not-allowed disabled:opacity-60"
          />
          <span className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            <span className="font-semibold">Zgadzam się na udział w projekcie.</span>{' '}
            Moje konto (imię, nazwisko, adres e-mail i statystyki w aplikacji) może zostać
            pokazane podczas obrony i w dokumentacji projektu.
            {!hasConsent && (
              <span className="block mt-1 text-xs text-slate-400 dark:text-slate-500">
                Zgoda jest dobrowolna — jej brak w niczym nie ogranicza działania konta.
              </span>
            )}
          </span>
        </label>

        {consentError && (
          <div className="mt-3 p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
            {consentError}
          </div>
        )}
        {savingConsent && (
          <p className="mt-3 text-xs text-slate-400">Zapisywanie...</p>
        )}
        {!savingConsent && hasConsent && (
          <>
            <p className="mt-3 text-xs text-green-600 dark:text-green-400 flex items-center gap-1.5">
              <CheckCircle size={13} /> Zgoda udzielona {consentDate}
            </p>
            <div className="mt-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-dark-border">
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed flex items-start gap-2">
                <Mail size={14} className="shrink-0 mt-0.5 text-slate-400" />
                <span>
                  Zgody nie można cofnąć samodzielnie w aplikacji. Jeśli chcesz zostać
                  usunięty z listy uczestników projektu, napisz na{' '}
                  <a
                    href={`mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent('FitPlan — wycofanie udziału w projekcie')}`}
                    className="font-semibold underline underline-offset-2 hover:text-brand-600 dark:hover:text-brand-400 break-all"
                  >
                    {CONTACT_EMAIL}
                  </a>
                  {' '}— Twoje konto wraz ze wszystkimi danymi zostanie wtedy usunięte z bazy.
                </span>
              </p>
            </div>
          </>
        )}
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
