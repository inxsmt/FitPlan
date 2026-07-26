import { Trash2, Clock, List } from 'lucide-react'
import { MEAL_TYPES, MEAL_TYPE_KEYS } from '../../lib/mealTypes'

const formatTime = (iso) =>
  new Date(iso).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })

const MealItem = ({ meal, onDelete }) => (
  <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand-500 transition-colors group">
    <div className="flex-1 min-w-0">
      <div className="flex items-center gap-2 mb-0.5">
        <h4 className="font-medium text-sm truncate">{meal.meal_name}</h4>
        <span className="text-xs text-slate-400 flex items-center gap-1 shrink-0">
          <Clock size={11} />
          {formatTime(meal.created_at)}
        </span>
      </div>
      <div className="flex flex-wrap gap-2.5 text-xs">
        <span className="text-brand-600 dark:text-brand-400 font-semibold">{meal.calories} kcal</span>
        <span className="text-blue-500">B: {meal.protein}g</span>
        <span className="text-amber-500">W: {meal.carbs}g</span>
        <span className="text-red-500">T: {meal.fat}g</span>
      </div>
    </div>
    <button
      onClick={() => onDelete(meal.id)}
      className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100"
      aria-label="Usuń produkt"
    >
      <Trash2 size={16} />
    </button>
  </div>
)

export const MealList = ({ meals, onDelete }) => {
  if (!meals.length) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="mb-2">Brak posiłków na ten dzień.</p>
        <p className="text-sm">Dodaj swój pierwszy produkt powyżej</p>
      </div>
    )
  }

  // Grupowanie po typie posiłku (nieznane / stare wpisy -> "Inne")
  const sections = [...MEAL_TYPES, { key: 'inne', label: 'Inne', icon: List }]
    .map((type) => {
      const items = meals.filter((m) => {
        const key = MEAL_TYPE_KEYS.has(m.meal_type) ? m.meal_type : 'inne'
        return key === type.key
      })
      const subtotal = items.reduce(
        (a, m) => ({
          calories: a.calories + m.calories,
          protein: a.protein + m.protein,
          carbs: a.carbs + m.carbs,
          fat: a.fat + m.fat,
        }),
        { calories: 0, protein: 0, carbs: 0, fat: 0 }
      )
      return { ...type, items, subtotal }
    })
    .filter((s) => s.items.length)

  return (
    <div className="space-y-5">
      {sections.map(({ key, label, icon: Icon, items, subtotal }) => (
        <div key={key}>
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-400 flex items-center justify-center">
                <Icon size={15} />
              </div>
              <h3 className="font-bold">{label}</h3>
              <span className="text-xs text-slate-400">({items.length})</span>
            </div>
            <div className="text-right">
              <span className="font-bold text-brand-600 dark:text-brand-400 text-sm">{subtotal.calories} kcal</span>
              <p className="text-xs text-slate-400">
                B {subtotal.protein}g · W {subtotal.carbs}g · T {subtotal.fat}g
              </p>
            </div>
          </div>
          <div className="space-y-2 pl-1">
            {items.map((meal) => (
              <MealItem key={meal.id} meal={meal} onDelete={onDelete} />
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
