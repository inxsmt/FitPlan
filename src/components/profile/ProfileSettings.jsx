import { useState, useEffect } from 'react'
import { User, Save, CheckCircle } from 'lucide-react'
import { Card } from '../ui/Card'
import { Input } from '../ui/Input'
import { Button } from '../ui/Button'
import { useProfile } from '../../hooks/useProfile'
import { useAuth } from '../../context/AuthContext'

export const ProfileSettings = () => {
  const { user } = useAuth()
  const { profile, loading, updateProfile } = useProfile()
  const [form, setForm] = useState({ first_name: '', last_name: '' })
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (profile) {
      setForm({
        first_name: profile.first_name || '',
        last_name: profile.last_name || '',
      })
    }
  }, [profile])

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
    </div>
  )
}
