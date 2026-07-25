import { useState, useMemo, useEffect } from 'react'
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
    const newForm = { ...form, [field]: value }
    setForm(newForm)
    setSaved(false)
    if (['activity', 'goal', 'weight'].includes(field)) {
      const newBmr = calculateBMR(newForm)
      const newTdee = calculateTDEE(newBmr, newForm.activity)
      const newGoalCal = newTdee + Number(newForm.goal)
      const newMacros = recommendedMacros(newGoalCal, newForm.weight)
      setMacroForm({ protein: newMacros.protein, carbs: newMacros.carbs, fat: newMacros.fat })
    }
  }

  const bmr = useMemo(() => calculateBMR(form), [form])
  const tdee = useMemo(() => calculateTDEE(bmr, form.activity), [bmr, form.activity])
  const goalCalories = useMemo(() => tdee + Number(form.goal), [tdee, form.goal])
  const calcMacros = useMemo(() => recommendedMacros(goalCalories, form.weight), [goalCalories, form.weight])


  const macroKcal = (parseInt(macroForm.protein) || 0) * 4 + (parseInt(macroForm.carbs) || 0) * 4 + (parseInt(macroForm.fat) || 0) * 9

  const [savingMacros, setSavingMacros] = useState(false)
  const [savedMacros, setSavedMacros] = useState(false)

  const handleSaveMacros = async () => {
    setSavingMacros(true)
    const { error } = await updateProfile({
      target_calories: macroKcal,
      target_protein: parseInt(macroForm.protein) || 0,
      target_carbs: parseInt(macroForm.carbs) || 0,
      target_fat: parseInt(macroForm.fat) || 0,
    })
    setSavingMacros(false)
    if (!error) { setSavedMacros(true); setTimeout(() => setSavedMacros(false), 3000) }
  }

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
          Oblicz swoje dzienne zapotrzebowanie kaloryczne (wzór Mifflina-St Jeora)
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Wprowadź dane" icon={Calculator}>
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
                <label className="label">Płeć</label>
                <select
                  value={form.gender}
                  onChange={handleChange('gender')}
                  className="input-field"
                >
                  <option value="male">Mężczyzna</option>
                  <option value="female">Kobieta</option>
                  <option value="other">Inna / nieokreślona</option>
                </select>
              </div>
            </div>

            <div>
              <label className="label">Poziom aktywności (PAL)</label>
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
                Energia potrzebna na podstawowe funkcje życiowe w spoczynku
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
              <p className="text-sm text-slate-500 mb-1">TDEE (całkowite zapotrzebowanie)</p>
              <p className="text-2xl font-bold">{tdee} kcal</p>
              <p className="text-xs text-slate-500 mt-1">
                BMR × współczynnik aktywności fizycznej
              </p>
            </div>

            <div className="p-4 rounded-xl bg-brand-100 dark:bg-brand-900/30 border-2 border-brand-500">
              <p className="text-sm text-brand-700 dark:text-brand-400 mb-1">
                Twój cel kaloryczny
              </p>
              <p className="text-3xl font-bold text-brand-700 dark:text-brand-400">
                {goalCalories} kcal
              </p>
              <p className="text-xs text-brand-700 dark:text-brand-400 mt-1">
                Spożywaj tyle, aby osiągnąć wybrany cel
              </p>
            </div>

            <div className="flex items-center justify-between pt-1">
              <p className="text-xs text-slate-500">Możesz ręcznie dostosować makroskładniki:</p>
              <button
                onClick={handleSaveMacros}
                disabled={savingMacros}
                className="flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-700 px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
              >
                <Save size={12} /> {savingMacros ? 'Zapisuję...' : savedMacros ? 'Zapisano!' : 'Zapisz makro'}
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { key: 'protein', label: 'Białko', color: 'blue', opt: 'opt. 1,6–2,2' },
                { key: 'carbs', label: 'Węglow.', color: 'amber', opt: null },
                { key: 'fat', label: 'Tłuszcze', color: 'red', opt: 'opt. 0,6–1,2' },
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
              Łącznie z makro: {macroKcal} kcal
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
              {saving ? 'Zapisywanie...' : saved ? 'Zapisano!' : 'Zapisz jako mój cel'}
            </Button>

            {saved && (
              <p className="text-sm text-brand-600 text-center animate-fade-in">
                Cel kaloryczny i makroskładniki zostały zaktualizowane w profilu
              </p>
            )}
          </div>
        </Card>
      </div>

      <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <div className="flex gap-3">
          <Info className="text-blue-600 shrink-0" size={20} />
          <div className="text-sm text-blue-900 dark:text-blue-200 space-y-3">
            <div>
              <p className="font-semibold mb-1">Dlaczego wzór Mifflina-St Jeora?</p>
              <p>
                Mifflin-St Jeor (1990) jest uznawany przez Academy of Nutrition and Dietetics za
                najdokładniejszy wzór do oszacowania BMR u zdrowych dorosłych — dlatego jest domyślny
                w tym kalkulatorze. Dokładność wynosi około +/- 10%. Współczynniki aktywności (PAL)
                pochodzą z zaleceń FAO/WHO/UNU (2004).
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">A co z osobami trenującymi?</p>
              <p>
                Mifflin liczy z całkowitej masy ciała i nie rozróżnia mięśni od tłuszczu. U osób bardzo
                umięśnionych (niski % tkanki tłuszczowej) może lekko zaniżać wynik, a przy wysokim
                poziomie tłuszczu — lekko zawyżać. Dla większości ćwiczących różnica jest niewielka i
                wzór sprawdza się dobrze. Kto zna swój % tłuszczu, może dla porównania sięgnąć po wzory
                oparte na beztłuszczowej masie ciała (Katch-McArdle, Cunningham).
              </p>
            </div>

            <div>
              <p className="font-semibold mb-1">Traktuj wynik jako punkt startowy</p>
              <p>
                Każdy wzór to tylko szacunek (~+/- 10%), a największym źródłem błędu jest zwykle wybór
                poziomu aktywności. Najdokładniejsza metoda to użyć wyniku jako startu i skorygować go
                po 2–3 tygodniach na podstawie realnych zmian wagi i dziennika posiłków — a to możesz
                robić w zakładkach <span className="font-semibold">Waga</span> i{' '}
                <span className="font-semibold">Posiłki</span>. Jeśli waga nie zmienia się zgodnie z
                celem, zmień kaloryczność o 100–200 kcal i obserwuj dalej.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
