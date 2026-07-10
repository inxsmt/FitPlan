import { useState } from 'react'
import { Clock, Flame, Beef, Wheat, Droplets } from 'lucide-react'
import { Card } from '../ui/Card'
import { diets } from './dietData'

const MacroBadge = ({ label, value, unit, color }) => (
  <div className={`text-center px-3 py-2 rounded-xl ${color}`}>
    <p className="text-xs font-semibold opacity-70">{label}</p>
    <p className="text-lg font-bold">{value}<span className="text-xs ml-0.5">{unit}</span></p>
  </div>
)

const MealCard = ({ meal }) => (
  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-border">
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <Clock size={14} className="text-slate-400" />
        <span className="text-xs text-slate-400">{meal.time}</span>
        <h3 className="font-bold text-sm">{meal.name}</h3>
      </div>
      <span className="text-sm font-bold text-brand-600">{meal.macros.calories} kcal</span>
    </div>

    <ul className="space-y-0.5 mb-3">
      {meal.items.map((item, i) => (
        <li key={i} className="text-sm text-slate-600 dark:text-slate-400 flex items-center gap-1.5">
          <span className="w-1 h-1 rounded-full bg-brand-400 shrink-0" />
          {item}
        </li>
      ))}
    </ul>

    <div className="flex gap-2 text-xs">
      <span className="text-blue-500 font-semibold">B: {meal.macros.protein}g</span>
      <span className="text-amber-500 font-semibold">W: {meal.macros.carbs}g</span>
      <span className="text-red-500 font-semibold">T: {meal.macros.fat}g</span>
    </div>
  </div>
)

export const Diets = () => {
  const [selected, setSelected] = useState('2500')
  const diet = diets.find((d) => d.id === selected)

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Plany dietetyczne</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Przykładowe diety dla sportowców — dobierz kaloryczność do swojego celu
        </p>
      </div>

      <div className="flex gap-2 flex-wrap">
        {diets.map((d) => (
          <button
            key={d.id}
            onClick={() => setSelected(d.id)}
            className={`px-5 py-2.5 rounded-xl font-bold text-sm transition ${
              selected === d.id
                ? 'bg-brand-600 text-white shadow-md'
                : 'bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand-400'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <Card>
        <div className="mb-4">
          <div className="flex items-center gap-3 mb-1">
            <Flame size={20} className="text-brand-600" />
            <h2 className="text-xl font-bold">{diet.label} — {diet.goal}</h2>
          </div>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-2">{diet.description}</p>
          <p className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Przykład dla osoby o masie ciała: <span className="text-brand-600">{diet.bodyWeight} kg</span>
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-3">
          <MacroBadge label="Białko" value={diet.macros.protein} unit="g" color="bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400" />
          <MacroBadge label="Węglowodany" value={diet.macros.carbs} unit="g" color="bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400" />
          <MacroBadge label="Tłuszcze" value={diet.macros.fat} unit="g" color="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400" />
        </div>

        <div className="grid grid-cols-3 gap-2 mb-2 text-center text-xs text-slate-500 dark:text-slate-400">
          <span>= <strong className="text-blue-500">{diet.perKg.protein}g</strong> / kg m.c.</span>
          <span>= <strong className="text-amber-500">{diet.perKg.carbs}g</strong> / kg m.c.</span>
          <span>= <strong className="text-red-500">{diet.perKg.fat}g</strong> / kg m.c.</span>
        </div>

        <div className="grid grid-cols-3 gap-2 mb-6 text-center text-xs text-slate-400 dark:text-slate-500">
          <span>opt. 1,6–2,2g/kg</span>
          <span>reszta kalorii</span>
          <span>min. 0,6g/kg (opt. 0,6–1,2g/kg)</span>
        </div>

        <h3 className="font-bold mb-3">Plan posiłków</h3>
        <div className="space-y-3">
          {diet.meals.map((meal, i) => (
            <MealCard key={i} meal={meal} />
          ))}
        </div>
      </Card>
    </div>
  )
}
