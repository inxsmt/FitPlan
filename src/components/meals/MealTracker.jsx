import { useMemo } from 'react'
import { UtensilsCrossed } from 'lucide-react'
import { useMeals } from '../../hooks/useMeals'
import { Card } from '../ui/Card'
import { MealForm } from './MealForm'
import { MealList } from './MealList'
import { filterTodayMeals, sumMacros } from '../../utils/calculations'

export const MealTracker = () => {
  const { meals, loading, addMeal, deleteMeal } = useMeals()

  const todayMeals = useMemo(() => filterTodayMeals(meals), [meals])
  const todayMacros = useMemo(() => sumMacros(todayMeals), [todayMeals])

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ladowanie...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Tracker posilkow</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Zapisuj wszystko co jesz, aby kontrolowac bilans kaloryczny
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card className="text-center !p-4">
          <p className="text-xs text-slate-500 mb-1">Kalorie</p>
          <p className="text-2xl font-bold text-brand-600">{todayMacros.calories}</p>
          <p className="text-xs text-slate-500">kcal</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-xs text-slate-500 mb-1">Bialko</p>
          <p className="text-2xl font-bold text-blue-500">{todayMacros.protein}</p>
          <p className="text-xs text-slate-500">g</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-xs text-slate-500 mb-1">Weglow.</p>
          <p className="text-2xl font-bold text-amber-500">{todayMacros.carbs}</p>
          <p className="text-xs text-slate-500">g</p>
        </Card>
        <Card className="text-center !p-4">
          <p className="text-xs text-slate-500 mb-1">Tluszcze</p>
          <p className="text-2xl font-bold text-red-500">{todayMacros.fat}</p>
          <p className="text-xs text-slate-500">g</p>
        </Card>
      </div>

      <Card title="Dodaj nowy posilek" icon={UtensilsCrossed}>
        <MealForm onAdd={addMeal} />
      </Card>

      <Card title={`Dzisiejsze posilki (${todayMeals.length})`}>
        <MealList meals={todayMeals} onDelete={deleteMeal} />
      </Card>
    </div>
  )
}
