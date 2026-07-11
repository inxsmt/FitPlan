import { useState, useMemo, useEffect, useRef } from 'react'
import { Calculator, Save, Info } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import {
  calculateBMR,
  calculateTDEE,
  ACTIVITY_LEVELS,
  GOAL_ADJUSTMENTS,
  recommendedMacros,
} from '../../utils/calculations'

export const TDEECalculator = () => {
  const { profile, updateProfile } = useProfile()

  const [form, setForm] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('tdee_settings') || '{}')
    return {
      weight: 70,
      height: 175,
      age: 25,
      gender: 'male',
      activity: saved.activity || 1.55,
      goal: saved.goal ?? 0,
    }
  })

  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)
  const [macroForm, setMacroForm] = useState(() => {
    const ls = JSON.parse(localStorage.getItem('tdee_macros') || 'null')
    return ls || { protein: 160, carbs: 196, fat: 64 }
  })

  const prevCalcKey = useRef(null)

  useEffect(() => {
    if (profile) {
      setForm((prev) => ({
        ...prev,
        weight: profile.weight || prev.weight,
        height: profile.height || prev.height,
        age: profile.age || prev.age,
        gender: profile.gender || prev.gender,
      }))
      if (!localStorage.getItem('tdee_macros') && profile.target_protein) {
        setMacroForm({ protein: profile.target_protein, carbs: profile.target_carbs, fat: profile.target_fat })
      }
    }
  }, [profile])

  useEffect(() => {
    localStorage.setItem('tdee_settings', JSON.stringify({ activity: form.activity, goal: form.goal }))
  }, [form.activity, form.goal])

  useEffect(() => {
    localStorage.setItem('tdee_macros', JSON.stringify(macroForm))
  }, [macroForm])

  const handleChange = (field) => (e) => {
    const value = e.target.type === 'number' ? Number(e.target.value) : e.target.value
    setForm({ ...form, [field]: value })
    setSaved(false)
  }

  const bmr = useMemo(() => calculateBMR(form), [form])
  const tdee = useMemo(() => calculateTDEE(bmr, form.activity), [bmr, form.activity])
  const goalCalories = useMemo(() => tdee + Number(form.goal), [tdee, form.goal])
  const calcMacros = useMemo(() => recommendedMacros(goalCalories, form.weight), [goalCalories, form.weight])

  useEffect(() => {
    const key = `${form.activity}_${form.goal}_${form.weight}`
    if (prevCalcKey.current !== null && prevCalcKey.current !== key) {
      setMacroForm({ protein: calcMacros.protein, carbs: calcMacros.carbs, fat: calcMacros.fat })
    }
    prevCalcKey.current = key
  }, [form.activity, form.goal, form.weight, calcMacros.protein, calcMacros.carbs, calcMacros.fat])

  const macroKcal = (parseInt(macroForm.protein) || 0) * 4 + (parseInt(macroForm.carbs) || 0) * 4 + (parseInt(macroForm.fat) || 0) * 9

  const handleSave = async () => {
    setSaving(true)
    const { error } = await updateProfile({
      weight: form.weight,
      height: form.height,
      age: form.age,
      gender: form.gender,
      tdee: tdee,
      target_calories: macroKcal,
      target_protein: parseInt(macroForm.protein) || 0,
      target_carbs: parseInt(macroForm.carbs) || 0,
      target_fat: parseInt(macroForm.fat) || 0,
    })
    setSaving(false)
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Kalkulator TDEE</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Oblicz swoje dzienne zapotrzebowanie kaloryczne (wzor Mifflina-St Jeora)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Wprowadz dane" icon={Calculator}>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Waga (kg)"
                type="number"
                min="20"
                max="300"
                step="0.1"
                value={form.weight}
                onChange={handleChange('weight')}
              />
              <Input
                label="Wzrost (cm)"
                type="number"
                min="100"
                max="250"
                value={form.height}
                onChange={handleChange('height')}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Input
                label="Wiek (lat)"
                type="number"
                min="10"
                max="120"
                value={form.age}
                onChange={handleChange('age')}
              />
              <div>
                <label className="label">Plec</label>
                <select
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="input-field"
                >
                  <option value="male">Mezczyzna</option>
                  <option value="female">Kobieta</option>
                  <option value="other">Inna / nieokreslona</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Poziom aktywnosci (PAL)</label>
              <select
                value={form.activity}
                onChange={handleChange('activity')}
                className="input-field"
              >
                {ACTIVITY_LEVELS.map((lvl) => (
                  <option key={lvl.value} value={lvl.value}>
                    {lvl.label}
                  </option>
                ))}
              </select>
              <p className="text-xs text-slate-500 mt-1">
                {ACTIVITY_LEVELS.find((l) => l.value === Number(form.activity))?.description}
              </p>
            </div>

            <div>
              <label className="label">Cel</label>
              <select
                value={form.goal}
                onChange={handleChange('goal')}
                className="input-field"
              >
                {GOAL_ADJUSTMENTS.map((g) => (
                  <option key={g.value} value={g.value}>
                    {g.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </Card>

        <Card title="Twoje wyniki" subtitle="Obliczone na podstawie wzoru Mifflina-St Jeora">
          <div className="space-y-4">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">BMR (podstawowa przemiana materii)</p>
              <p className="text-2xl font-bold">{Math.round(bmr)} kcal</p>
              <p className="text-xs text-slate-500 mt-1">
                Energia potrzebna na podstawowe funkcje zyciowe w spoczynku
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">TDEE (calkowite zapotrzebowanie)</p>
              <p className="text-2xl font-bold">{tdee} kcal</p>
              <p className="text-xs text-slate-500 mt-1">
                BMR x wspolczynnik aktywnosci fizycznej
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-100 dark:bg-brand-900/30 border-2 border-brand-500">
              <p className="text-sm text-brand-700 dark:text-brand-400 mb-1">
                Twoj cel kaloryczny
              </p>
              <p className="text-3xl font-bold text-brand-700 dark:text-brand-400">
                {goalCalories} kcal
              </p>
              <p className="text-xs text-brand-700 dark:text-brand-400 mt-1">
                Spozywaj tyle, aby osiagnac wybrany cel
              </p>
            </div>

            <p className="text-xs text-slate-500 pt-1">Mozesz recznie dostosowac makroskladniki:</p>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'protein', label: 'Bialko', color: 'blue', opt: 'opt. 1,6–2,2' },
                { key: 'carbs', label: 'Weglow.', color: 'amber', opt: null },
                { key: 'fat', label: 'Tluszcze', color: 'red', opt: 'opt. 0,6–1,2' },
              ].map(({ key, label, color, opt }) => (
                <div key={key} className={`p-3 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
                  <p className={`text-xs text-${color}-700 dark:text-${color}-400 mb-1 font-medium`}>{label}</p>
                  <input
                    type="number"
                    min="0"
                    value={macroForm[key]}
                    onChange={(e) => { setMacroForm({ ...macroForm, [key]: e.target.value }); setSaved(false) }}
                    className={`w-full px-2 py-1.5 rounded-lg border border-${color}-200 dark:border-${color}-800 bg-white dark:bg-dark-bg text-sm font-bold text-${color}-700 dark:text-${color}-400 focus:outline-none focus:ring-2 focus:ring-${color}-400`}
                  />
                  <p className={`text-xs text-${color}-500 mt-1`}>
                    {form.weight > 0 ? (macroForm[key] / form.weight).toFixed(1) : '–'}g/kg
                  </p>
                  {opt && <p className={`text-xs text-${color}-300 dark:text-${color}-700`}>{opt}</p>}
                </div>
              ))}
            </div>
            <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-sm font-semibold text-brand-700 dark:text-brand-400">
              Lacznie z makro: {macroKcal} kcal
              {Math.abs(macroKcal - goalCalories) > 50 && (
                <span className="text-xs font-normal text-slate-500 ml-2">(TDEE cel: {goalCalories} kcal)</span>
              )}
            </div>

            <Button
              onClick={handleSave}
              disabled={saving}
              icon={Save}
              className="w-full"
            >
              {saving ? 'Zapisywanie...' : saved ? 'Zapisano!' : 'Zapisz jako moj cel'}
            </Button>

            {saved && (
              <p className="text-sm text-brand-600 text-center animate-fade-in">
                Cel kaloryczny i makroskladniki zostaly zaktualizowane w profilu
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <Info className="text-blue-600 shrink-0" size={20} />
          <div className="text-sm text-blue-900 dark:text-blue-200">
            <p className="font-semibold mb-1">Informacja merytoryczna (EBM):</p>
            <p>
              Wzor Mifflina-St Jeora (1990) jest uznawany przez Academy of Nutrition and Dietetics
              za najdokladniejszy do oszacowania BMR u zdrowych doroslych. Dokladnosc wynosi okolo
              +/- 10%. Wspolczynniki PAL pochodza z zalecen FAO/WHO/UNU (2004).
            </p>
          </div>
        </div>
      </Card>
    </div>
  )
}
