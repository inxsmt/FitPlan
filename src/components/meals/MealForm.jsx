import { useState, useMemo } from 'react'
import { Plus } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export const MealForm = ({ onAdd }) => {
  const [form, setForm] = useState({
    meal_name: '',
    protein: '',
    carbs: '',
    fat: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const calories = useMemo(() => {
    const p = parseFloat(form.protein) || 0
    const c = parseFloat(form.carbs) || 0
    const f = parseFloat(form.fat) || 0
    return Math.round(p * 4 + c * 4 + f * 9)
  }, [form.protein, form.carbs, form.fat])

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!form.meal_name.trim()) {
      setError('Podaj nazwe posilku')
      return
    }
    if (calories <= 0) {
      setError('Podaj makroskładniki aby obliczyc kalorie')
      return
    }

    setLoading(true)
    const { error } = await onAdd({
      meal_name: form.meal_name.trim(),
      calories,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    })
    setLoading(false)

    if (error) {
      setError(error.message || 'Blad dodawania posilku')
    } else {
      setForm({ meal_name: '', protein: '', carbs: '', fat: '' })
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        label="Nazwa posilku"
        value={form.meal_name}
        onChange={handleChange('meal_name')}
        placeholder="np. Owsianka z owocami"
        required
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          label="Bialko (g)"
          type="number"
          min="0"
          value={form.protein}
          onChange={handleChange('protein')}
          placeholder="20"
        />
        <Input
          label="Weglow. (g)"
          type="number"
          min="0"
          value={form.carbs}
          onChange={handleChange('carbs')}
          placeholder="60"
        />
        <Input
          label="Tluszcze (g)"
          type="number"
          min="0"
          value={form.fat}
          onChange={handleChange('fat')}
          placeholder="12"
        />
      </div>

      <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 text-sm font-semibold">
        Kalorie: {calories} kcal
      </div>

      {error && (
        <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
          {error}
        </div>
      )}

      <Button type="submit" icon={Plus} disabled={loading} className="w-full md:w-auto">
        {loading ? 'Dodawanie...' : 'Dodaj posilek'}
      </Button>
    </form>
  )
}
