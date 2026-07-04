import { useMemo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { UtensilsCrossed, Calculator, Brain, TrendingUp, Flame, CheckCircle } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'
import { useMeals } from '../../hooks/useMeals'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { MacroRing } from './MacroRing'
import { sumMacros, filterTodayMeals, recommendedMacros } from '../../utils/calculations'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

export const Dashboard = () => {
  const { profile, loading: profileLoading } = useProfile()
  const { meals, loading: mealsLoading } = useMeals()
  const [showWelcome, setShowWelcome] = useState(false)

  useEffect(() => {
    if (sessionStorage.getItem('accountCreated')) {
      sessionStorage.removeItem('accountCreated')
      setShowWelcome(true)
      setTimeout(() => setShowWelcome(false), 3000)
    }
  }, [])

  const todayMeals = useMemo(() => filterTodayMeals(meals), [meals])
  const todayMacros = useMemo(() => sumMacros(todayMeals), [todayMeals])

  const targetCalories = profile?.target_calories || 2000
  const recommended = useMemo(
    () => recommendedMacros(targetCalories, 70),
    [targetCalories]
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
        <div className="animate-pulse text-slate-500">Ladowanie danych...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {showWelcome && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-green-500 text-white px-6 py-4 rounded-2xl shadow-xl animate-fade-in">
          <CheckCircle size={22} />
          <span className="font-semibold">Konto zostalo utworzone! Witaj w FitPlan!</span>
        </div>
      )}
      <div>
        <h1 className="text-3xl font-bold mb-1">
          Czesc, {profile?.initials || 'Uzytkowniku'}!
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Oto Twoje podsumowanie z dzisiaj - {new Date().toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <Card title="Dzisiejsze spozycie" icon={Flame} subtitle="Kalorie i makroskladniki">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <MacroRing
            current={todayMacros.calories}
            target={targetCalories}
            label="Kalorie"
            unit=" kcal"
            color="#22c55e"
          />
          <MacroRing
            current={todayMacros.protein}
            target={recommended.protein}
            label="Bialko"
            unit="g"
            color="#3b82f6"
          />
          <MacroRing
            current={todayMacros.carbs}
            target={recommended.carbs}
            label="Weglowodany"
            unit="g"
            color="#f59e0b"
          />
          <MacroRing
            current={todayMacros.fat}
            target={recommended.fat}
            label="Tluszcze"
            unit="g"
            color="#ef4444"
          />
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <Card title="Ostatnie 7 dni" icon={TrendingUp} subtitle="Spozycie kalorii vs cel">
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
                  <Bar dataKey="kcal" fill="#22c55e" radius={[8, 8, 0, 0]} name="Spozycie (kcal)" />
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
                  Dodaj posilek
                </Button>
              </Link>
              <Link to="/tdee">
                <Button icon={Calculator} variant="secondary" className="w-full mt-2">
                  Przelicz TDEE
                </Button>
              </Link>
              <Link to="/quiz">
                <Button icon={Brain} variant="ghost" className="w-full mt-2">
                  Rozwiaz quiz
                </Button>
              </Link>
            </div>
          </Card>

          <Card>
            <p className="text-sm text-slate-500 mb-1">Posilkow dzis</p>
            <p className="text-3xl font-bold">{todayMeals.length}</p>
            <p className="text-xs text-slate-500 mt-1">
              Pozostalo: {Math.max(targetCalories - todayMacros.calories, 0)} kcal
            </p>
          </Card>
        </div>
      </div>
    </div>
  )
}
