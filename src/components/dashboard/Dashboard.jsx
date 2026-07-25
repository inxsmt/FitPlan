import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Calculator, Brain, TrendingUp, Flame, CheckCircle, Pencil, X, Save, TrendingDown, Minus, ChevronDown } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useMeals } from '../../hooks/useMeals'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { MacroRing } from './MacroRing'
import { sumMacros, filterTodayMeals, recommendedMacros } from '../../utils/calculations'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const { profile, loading: profileLoading, updateProfile } = useProfile()
  const [editingGoals, setEditingGoals] = useState(false)
  const [goalsForm, setGoalsForm] = useState({ target_protein: '', target_carbs: '', target_fat: '' })
  const [savingGoals, setSavingGoals] = useState(false)
  const { meals, loading: mealsLoading } = useMeals()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('accountCreated')) {
      sessionStorage.removeItem('accountCreated')
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 3000)
    }
  }, [])

  useEffect(() => {
    if (profile) {
      setGoalsForm({
        target_protein: profile.target_protein || 160,
        target_carbs: profile.target_carbs || 196,
        target_fat: profile.target_fat || 64,
        weight: profile.weight || '',
        height: profile.height || '',
      })
    }
  }, [profile])

  const handleSaveGoals = async () => {
    const p = parseInt(goalsForm.target_protein) || 0
    const c = parseInt(goalsForm.target_carbs) || 0
    const f = parseInt(goalsForm.target_fat) || 0
    const w = goalsForm.weight ? parseFloat(goalsForm.weight) : null
    const h = goalsForm.height ? parseFloat(goalsForm.height) : null
    setSavingGoals(true)
    await updateProfile({ target_protein: p, target_carbs: c, target_fat: f, target_calories: p * 4 + c * 4 + f * 9, ...(w !== null && { weight: w }), ...(h !== null && { height: h }) })
    setSavingGoals(false)
    setEditingGoals(false)
  }

  const todayMeals = useMemo(() => filterTodayMeals(meals), [meals])
  const todayMacros = useMemo(() => sumMacros(todayMeals), [todayMeals])

  const targetCalories = profile?.target_calories || 2000
  const weight = profile?.weight || null
  const recommended = useMemo(
    () => ({
      protein: profile?.target_protein || recommendedMacros(targetCalories, weight || 70).protein,
      carbs: profile?.target_carbs || recommendedMacros(targetCalories, weight || 70).carbs,
      fat: profile?.target_fat || recommendedMacros(targetCalories, weight || 70).fat,
    }),
    [profile, targetCalories, weight]
  )

  const last7Days = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().slice(0, 10)
      const dayMeals = meals.filter((m) => m.created_at?.slice(0, 10) === dateStr)
      const macros = sumMacros(dayMeals)
      days.push({
        day: date.toLocaleDateString('pl-PL', { weekday: 'short' }),
        kcal: macros.calories,
        cel: targetCalories,
      })
    }
    return days
  }, [meals, targetCalories])

  if (profileLoading || mealsLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-pulse text-slate-500">Ładowanie danych...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {showWelcome && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl animate-fade-in">
          <CheckCircle size={22} />
          <span className="font-semibold">
            Konto zostało utworzone! Witaj w FitPlan{profile?.first_name ? `, ${profile.first_name}` : ''}!
          </span>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Cześć, {profile?.first_name
            ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
            : 'Użytkowniku'}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Oto Twoje podsumowanie z dzisiaj - {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Flame size={18} className="text-brand-600" />
            <span className="font-bold">Dzisiejsze spożycie</span>
            {(profile?.weight || profile?.age || profile?.gender) && (
              <span className="text-xs text-slate-400 hidden sm:inline">
                {profile.weight && `· ${profile.weight}kg`}
                {profile.age && ` · ${profile.age}l`}
                {profile.gender && ` · ${profile.gender === 'male' ? 'M' : profile.gender === 'female' ? 'K' : 'I'}`}
              </span>
            )}
          </div>
          <button
            onClick={() => setEditingGoals(!editingGoals)}
            className="flex items-center gap-1.5 text-xs text-brand-600 hover:text-brand-700 font-semibold px-2 py-1 rounded-lg hover:bg-brand-50 dark:hover:bg-brand-900/20 transition"
          >
            {editingGoals
              ? <><X size={14} /> Anuluj</>
              : <><Pencil size={14} /> Edytuj cele <ChevronDown size={14} className="opacity-60" /></>
            }
          </button>
        </div>

        {editingGoals ? (
          <div className="space-y-3">
            <p className="text-xs text-slate-500">Kalorie obliczają się automatycznie z makroskładników</p>
            <div className="flex gap-3">
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Waga (kg)</label>
                <input
                  type="number"
                  value={goalsForm.weight}
                  onChange={(e) => setGoalsForm({ ...goalsForm, weight: e.target.value })}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="np. 80"
                  min="30" max="300"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Wzrost (cm)</label>
                <input
                  type="number"
                  value={goalsForm.height}
                  onChange={(e) => setGoalsForm({ ...goalsForm, height: e.target.value })}
                  className="w-28 px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
                  placeholder="np. 180"
                  min="100" max="250"
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: 'target_protein', label: 'Białko (g)', color: 'text-blue-600', opt: 'opt. 1,6–2,2g/kg' },
                { key: 'target_carbs', label: 'Węglowodany (g)', color: 'text-amber-600', opt: 'reszta kalorii' },
                { key: 'target_fat', label: 'Tłuszcze (g)', color: 'text-red-600', opt: 'min. 0,6g/kg (opt. 0,6–1,2g/kg)' },
              ].map(({ key, label, color, opt }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                  <input
                    type="number"
                    value={goalsForm[key]}
                    onChange={(e) => setGoalsForm({ ...goalsForm, [key]: e.target.value })}
                    className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm font-bold ${color} focus:outline-none focus:ring-2 focus:ring-brand-500`}
                    min="0"
                  />
                  {goalsForm.weight && <p className={`text-xs mt-0.5 ${color}`}>{(goalsForm[key] / goalsForm.weight).toFixed(1)}g/kg</p>}
                  <p className="text-xs text-slate-400 mt-0.5">{opt}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-brand-600">
                Łącznie: {(parseInt(goalsForm.target_protein)||0)*4 + (parseInt(goalsForm.target_carbs)||0)*4 + (parseInt(goalsForm.target_fat)||0)*9} kcal
              </p>
              <button
                onClick={handleSaveGoals}
                disabled={savingGoals}
                className="flex items-center gap-1.5 text-sm bg-brand-600 text-white px-4 py-2 rounded-xl font-semibold hover:bg-brand-700 transition"
              >
                <Save size={14} /> {savingGoals ? 'Zapisywanie...' : 'Zapisz'}
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <MacroRing current={todayMacros.calories} target={targetCalories} label="Kalorie" unit=" kcal" color="#22c55e" />
            </div>
            <div className="text-center">
              <MacroRing current={todayMacros.protein} target={recommended.protein} label="Białko" unit="g" color="#3b82f6" />
              {weight && <p className="text-xs text-blue-500 mt-1 font-medium">{(todayMacros.protein/weight).toFixed(1)}g/kg</p>}
              {weight && <p className="text-xs text-slate-400">cel {(recommended.protein/weight).toFixed(1)}g/kg</p>}
              <p className="text-xs text-slate-300 dark:text-slate-600">opt. 1,6–2,2g/kg</p>
            </div>
            <div className="text-center">
              <MacroRing current={todayMacros.carbs} target={recommended.carbs} label="Węglowodany" unit="g" color="#f59e0b" />
              {weight && <p className="text-xs text-amber-500 mt-1 font-medium">{(todayMacros.carbs/weight).toFixed(1)}g/kg</p>}
              {weight && <p className="text-xs text-slate-400">cel {(recommended.carbs/weight).toFixed(1)}g/kg</p>}
              <p className="text-xs text-slate-300 dark:text-slate-600">reszta kalorii</p>
            </div>
            <div className="text-center">
              <MacroRing current={todayMacros.fat} target={recommended.fat} label="Tłuszcze" unit="g" color="#ef4444" />
              {weight && <p className="text-xs text-red-500 mt-1 font-medium">{(todayMacros.fat/weight).toFixed(1)}g/kg</p>}
              {weight && <p className="text-xs text-slate-400">cel {(recommended.fat/weight).toFixed(1)}g/kg</p>}
              <p className="text-xs text-slate-300 dark:text-slate-600">min. 0,6 (opt. 0,6–1,2g/kg)</p>
            </div>
          </div>
        )}

        {weight && (
          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-dark-border text-xs text-slate-500 flex flex-wrap gap-x-4 gap-y-1">
            <span>Waga: <strong>{weight} kg</strong></span>
            <span>· Cel białko: <strong className="text-blue-500">{(recommended.protein / weight).toFixed(2)}g/kg</strong></span>
            <span>· Cel węgle: <strong className="text-amber-500">{(recommended.carbs / weight).toFixed(2)}g/kg</strong></span>
            <span>· Cel tłuszcz: <strong className="text-red-500">{(recommended.fat / weight).toFixed(2)}g/kg</strong></span>
          </div>
        )}
      </Card>

      {/* Bilans kaloryczny */}
      {(() => {
        const tdee = profile?.tdee || null
        const todayBalance = todayMacros.calories - targetCalories
        const plannedBalance = tdee ? targetCalories - tdee : null

        const balanceColor = (val) => val > 50 ? 'text-red-500' : val < -50 ? 'text-blue-500' : 'text-green-500'
        const balanceLabel = (val) => val > 50 ? 'nadwyżka' : val < -50 ? 'deficyt' : 'w celu'
        const BalanceIcon = (val) => val > 50 ? TrendingUp : val < -50 ? TrendingDown : Minus

        return (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="!p-4">
              <p className="text-xs text-slate-500 mb-1">Zapotrzebowanie (TDEE)</p>
              <p className="text-xl font-bold">{tdee ? `${tdee} kcal` : '–'}</p>
              <p className="text-xs text-slate-400 mt-1">utrzymanie masy ciała</p>
              {!tdee && <p className="text-xs text-amber-500 mt-1">Przelicz kalkulator TDEE</p>}
            </Card>
            <Card className="!p-4">
              <p className="text-xs text-slate-500 mb-1">Cel kaloryczny</p>
              <p className="text-xl font-bold text-brand-600">{targetCalories} kcal</p>
              <p className="text-xs text-slate-400 mt-1">twój dzienny cel</p>
            </Card>
            <Card className="!p-4">
              <p className="text-xs text-slate-500 mb-1">Planowany bilans</p>
              {plannedBalance !== null ? (
                <>
                  <p className={`text-xl font-bold ${balanceColor(plannedBalance)}`}>
                    {plannedBalance > 0 ? '+' : ''}{plannedBalance} kcal
                  </p>
                  <p className={`text-xs mt-1 font-medium ${balanceColor(plannedBalance)}`}>
                    {balanceLabel(plannedBalance)}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl font-bold text-slate-400">–</p>
                  <p className="text-xs text-amber-500 mt-1">brak TDEE</p>
                </>
              )}
            </Card>
            <Card className="!p-4">
              <p className="text-xs text-slate-500 mb-1">Pozostało dziś</p>
              {(() => {
                const remaining = targetCalories - todayMacros.calories
                if (remaining > 0) return (
                  <>
                    <p className="text-xl font-bold text-brand-600">{remaining} kcal</p>
                    <p className="text-xs text-slate-400 mt-1">do dziennego celu</p>
                  </>
                )
                return (
                  <>
                    <p className="text-xl font-bold text-red-500">{Math.abs(remaining)} kcal</p>
                    <p className="text-xs text-red-500 mt-1 font-medium">powyżej celu</p>
                  </>
                )
              })()}
            </Card>
          </div>
        )
      })()}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Ostatnie 7 dni" icon={TrendingUp} subtitle="Spożycie kalorii vs cel">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={last7Days}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                    }}
                  />
                  <Bar dataKey="kcal" fill="#22c55e" radius={[8, 8, 0, 0]} name="Spożycie (kcal)" />
                  <Bar dataKey="cel" fill="#64748b" radius={[8, 8, 0, 0]} opacity={0.3} name="Cel (kcal)" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="space-y-4">
          <Card title="Szybkie akcje">
            <div className="space-y-2">
              <Link to="/meals">
                <Button icon={UtensilsCrossed} variant="primary" className="w-full">
                  Dodaj posiłek
                </Button>
              </Link>
              <Link to="/tdee">
                <Button icon={Calculator} variant="secondary" className="w-full mt-2">
                  Przelicz TDEE
                </Button>
              </Link>
              <Link to="/quiz">
                <Button icon={Brain} variant="ghost" className="w-full mt-2">
                  Rozwiąż quiz
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <p className="text-sm text-slate-500 mb-1">Posiłków dziś</p>
            <p className="text-3xl font-bold">{todayMeals.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              Pozostało: {Math.max(targetCalories - todayMacros.calories, 0)} kcal
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
