import { useMemo, useState } from 'react'
import { UtensilsCrossed, CalendarDays, List } from 'lucide-react'
import { useMeals } from '../../hooks/useMeals'
import { Card } from '../ui/Card'
import { MealForm } from './MealForm'
import { MealList } from './MealList'
import { MealCalendar } from './MealCalendar'
import { filterTodayMeals, sumMacros } from '../../utils/calculations'

export const MealTracker = () => {
  const { meals, loading, addMeal, deleteMeal } = useMeals()
  const [view, setView] = useState('today')

  const todayMeals = useMemo(() => filterTodayMeals(meals), [meals])
  const todayMacros = useMemo(() => sumMacros(todayMeals), [todayMeals])

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ladowanie...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-start justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-3xl font-bold mb-1">Tracker posilkow</h1>
          <p className="text-slate-500 dark:text-slate-400">
            Zapisuj wszystko co jesz, aby kontrolowac bilans kaloryczny
          </p>
        </div>
        <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-dark-border">
          <button
            onClick={() => setView('today')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition ${view === 'today' ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <List size={16} /> Dzisiaj
          </button>
          <button
            onClick={() => setView('calendar')}
            className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold transition ${view === 'calendar' ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
          >
            <CalendarDays size={16} /> Kalendarz
          </button>
        </div>
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

      {view === 'today' ? (
        <>
          <Card title="Dodaj nowy posilek" icon={UtensilsCrossed}>
            <MealForm onAdd={addMeal} />
          </Card>
          <Card title={`Dzisiejsze posilki (${todayMeals.length})`}>
            <MealList meals={todayMeals} onDelete={deleteMeal} />
          </Card>
        </>
      ) : (
        <MealCalendar meals={meals} onDelete={deleteMeal} />
      )}
    </div>
  )
}
