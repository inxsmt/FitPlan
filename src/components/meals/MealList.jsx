import { Trash2, Clock } from 'lucide-react'

export const MealList = ({ meals, onDelete }) => {
  if (!meals.length) {
    return (
      <div className="text-center py-12 text-slate-500">
        <p className="mb-2">Brak posilkow na ten dzien.</p>
        <p className="text-sm">Dodaj swoj pierwszy posilek powyzej</p>
      </div>
    )
  }

  const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString('pl-PL', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <div className="space-y-2">
      {meals.map((meal) => (
        <div
          key={meal.id}
          className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-border hover:border-brand-500 transition-colors group"
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold truncate">{meal.meal_name}</h4>
              <span className="text-xs text-slate-500 flex items-center gap-1 shrink-0">
                <Clock size={12} />
                {formatTime(meal.created_at)}
              </span>
            </div>
            <div className="flex flex-wrap gap-3 text-sm">
              <span className="text-brand-600 dark:text-brand-400 font-semibold">
                {meal.calories} kcal
              </span>
              <span className="text-blue-500">B: {meal.protein}g</span>
              <span className="text-amber-500">W: {meal.carbs}g</span>
              <span className="text-red-500">T: {meal.fat}g</span>
            </div>
          </div>
          <button
            onClick={() => onDelete(meal.id)}
            className="p-2 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition opacity-0 group-hover:opacity-100"
            aria-label="Usun posilek"
          >
            <Trash2 size={18} />
          </button>
        </div>
      ))}
    </div>
  )
}
