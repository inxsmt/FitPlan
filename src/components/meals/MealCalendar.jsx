import { useState, useMemo } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card } from '../ui/Card'
import { MealList } from './MealList'

const DAYS = ['Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob', 'Nd']

export const MealCalendar = ({ meals, onDelete }) => {
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(new Date(today.getFullYear(), today.getMonth(), 1))
  const [selectedDate, setSelectedDate] = useState(today.toISOString().slice(0, 10))

  const mealsByDay = useMemo(() => {
    const map = {}
    meals.forEach((meal) => {
      const day = meal.created_at.slice(0, 10)
      if (!map[day]) map[day] = { calories: 0, count: 0 }
      map[day].calories += meal.calories
      map[day].count += 1
    })
    return map
  }, [meals])

  const selectedMeals = useMemo(() => {
    return meals.filter((m) => m.created_at.slice(0, 10) === selectedDate)
  }, [meals, selectedDate])

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear()
    const month = currentMonth.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)

    // Monday-based week: 0=Mon, 6=Sun
    let startOffset = firstDay.getDay() - 1
    if (startOffset < 0) startOffset = 6

    const days = []
    for (let i = 0; i < startOffset; i++) days.push(null)
    for (let d = 1; d <= lastDay.getDate(); d++) days.push(new Date(year, month, d))
    return days
  }, [currentMonth])

  const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1))
  const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1))

  const monthLabel = currentMonth.toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' })
  const todayStr = today.toISOString().slice(0, 10)

  return (
    <div className="space-y-4">
      <Card>
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <ChevronLeft size={20} />
          </button>
          <h2 className="font-bold text-lg capitalize">{monthLabel}</h2>
          <button onClick={nextMonth} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
            <ChevronRight size={20} />
          </button>
        </div>

        <div className="grid grid-cols-7 gap-1 mb-1">
          {DAYS.map((d) => (
            <div key={d} className="text-center text-xs text-slate-500 font-semibold py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map((date, i) => {
            if (!date) return <div key={i} />
            const dateStr = date.toISOString().slice(0, 10)
            const data = mealsByDay[dateStr]
            const isToday = dateStr === todayStr
            const isSelected = dateStr === selectedDate

            return (
              <button
                key={dateStr}
                onClick={() => setSelectedDate(dateStr)}
                className={`
                  flex flex-col items-center justify-center rounded-xl p-1 min-h-[52px] transition
                  ${isSelected ? 'bg-brand-600 text-white' : isToday ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}
                `}
              >
                <span className="text-sm font-semibold">{date.getDate()}</span>
                {data && (
                  <span className={`text-xs leading-tight ${isSelected ? 'text-white/80' : 'text-brand-600 dark:text-brand-400'}`}>
                    {data.calories} kcal
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </Card>

      <Card title={`Posiłki: ${new Date(selectedDate + 'T12:00:00').toLocaleDateString('pl-PL', { weekday: 'long', day: 'numeric', month: 'long' })}`}>
        <MealList
          meals={selectedMeals}
          onDelete={selectedDate === todayStr ? onDelete : () => {}}
        />
      </Card>
    </div>
  )
}
