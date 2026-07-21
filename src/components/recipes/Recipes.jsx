import { useState } from 'react'
import { ChefHat, Clock, Search, Plus, X, Check } from 'lucide-react'
import { supabase } from '../../lib/supabaseClient'
import { useAuth } from '../../context/AuthContext'
import { Card } from '../ui/Card'
import { RECIPES, CATEGORIES, TAGS } from './recipesData'

const MacroBadge = ({ label, value, unit = 'g', color }) => (
  <div className={`text-center px-3 py-1.5 rounded-lg bg-${color}-100 dark:bg-${color}-900/30`}>
    <p className={`text-xs text-${color}-600 dark:text-${color}-400`}>{label}</p>
    <p className={`font-bold text-sm text-${color}-700 dark:text-${color}-400`}>{value}{unit}</p>
  </div>
)

const RecipeModal = ({ recipe, onClose }) => {
  const { user } = useAuth()
  const [adding, setAdding] = useState(false)
  const [added, setAdded] = useState(false)
  const [error, setError] = useState('')

  const handleAdd = async () => {
    if (!user) return
    setAdding(true)
    setError('')
    const { error } = await supabase.from('meal_logs').insert([{
      user_id: user.id,
      meal_name: recipe.title,
      calories: recipe.macros.calories,
      protein: recipe.macros.protein,
      carbs: recipe.macros.carbs,
      fat: recipe.macros.fat,
    }])
    setAdding(false)
    if (error) {
      setError('Błąd dodawania — spróbuj ponownie')
    } else {
      setAdded(true)
      setTimeout(() => setAdded(false), 3000)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
      <div
        className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-5">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wide text-brand-600 dark:text-brand-400">
                {CATEGORIES.find((c) => c.id === recipe.category)?.label}
              </span>
              <h2 className="text-xl font-bold mt-0.5">{recipe.title}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-slate-500">
                <Clock size={14} />
                <span>{recipe.prepTime} min</span>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">
              <X size={18} />
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2 mb-5">
            <MacroBadge label="Kalorie" value={recipe.macros.calories} unit=" kcal" color="brand" />
            <MacroBadge label="Białko" value={recipe.macros.protein} color="blue" />
            <MacroBadge label="Węgle" value={recipe.macros.carbs} color="amber" />
            <MacroBadge label="Tłuszcze" value={recipe.macros.fat} color="red" />
          </div>

          <div className="mb-5">
            <h3 className="font-semibold mb-2">Składniki</h3>
            <ul className="space-y-1.5">
              {recipe.ingredients.map((ing, i) => (
                <li key={i} className="flex items-start gap-2 text-sm">
                  <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-brand-500 shrink-0" />
                  {ing}
                </li>
              ))}
            </ul>
          </div>

          <div className="mb-5">
            <h3 className="font-semibold mb-2">Przygotowanie</h3>
            <ol className="space-y-2">
              {recipe.steps.map((step, i) => (
                <li key={i} className="flex gap-3 text-sm">
                  <span className="shrink-0 w-6 h-6 rounded-full bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 text-xs font-bold flex items-center justify-center">
                    {i + 1}
                  </span>
                  <span className="pt-0.5">{step}</span>
                </li>
              ))}
            </ol>
          </div>

          {error && (
            <p className="text-sm text-red-600 mb-3">{error}</p>
          )}

          <button
            onClick={handleAdd}
            disabled={adding}
            className={`w-full flex items-center justify-center gap-2 py-3 rounded-xl font-semibold transition ${
              added
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                : 'bg-brand-600 hover:bg-brand-700 text-white'
            }`}
          >
            {added ? (
              <><Check size={18} /> Dodano do dziennika!</>
            ) : adding ? (
              'Dodawanie...'
            ) : (
              <><Plus size={18} /> Dodaj do dziennika posiłków</>
            )}
          </button>
          <p className="text-xs text-center text-slate-400 mt-2">Doda dzisiejszy posiłek w Trackerze posiłków</p>
        </div>
      </div>
    </div>
  )
}

const RecipeCard = ({ recipe, onClick }) => {
  const categoryLabel = CATEGORIES.find((c) => c.id === recipe.category)?.label

  return (
    <button onClick={onClick} className="text-left group w-full">
      <div className="card hover:shadow-lg hover:scale-[1.01] transition-all h-full flex flex-col">
        <div className="flex items-start justify-between mb-2">
          <span className="text-xs font-semibold bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 px-2 py-0.5 rounded-full">
            {categoryLabel}
          </span>
          <span className="flex items-center gap-1 text-xs text-slate-400">
            <Clock size={12} /> {recipe.prepTime} min
          </span>
        </div>

        <h3 className="font-bold text-base mb-2 leading-snug group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
          {recipe.title}
        </h3>

        <div className="grid grid-cols-4 gap-1.5 mt-auto pt-3">
          <div className="text-center">
            <p className="text-xs text-slate-400">kcal</p>
            <p className="font-bold text-sm">{recipe.macros.calories}</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-blue-400">białko</p>
            <p className="font-bold text-sm text-blue-600 dark:text-blue-400">{recipe.macros.protein}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-amber-400">węgle</p>
            <p className="font-bold text-sm text-amber-600 dark:text-amber-400">{recipe.macros.carbs}g</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-red-400">tłuszcz</p>
            <p className="font-bold text-sm text-red-600 dark:text-red-400">{recipe.macros.fat}g</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-1 mt-3">
          {recipe.tags.map((tag) => (
            <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500">
              {TAGS.find((t) => t.id === tag)?.label}
            </span>
          ))}
        </div>
      </div>
    </button>
  )
}

export const Recipes = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [activeTag, setActiveTag] = useState(null)
  const [search, setSearch] = useState('')
  const [selectedRecipe, setSelectedRecipe] = useState(null)

  const filtered = RECIPES.filter((r) => {
    if (activeCategory !== 'all' && r.category !== activeCategory) return false
    if (activeTag && !r.tags.includes(activeTag)) return false
    if (search && !r.title.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Baza przepisów</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Przepisy z obliczonymi makroskładnikami — dodaj posiłek do dziennika jednym kliknięciem
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj przepisu..."
            className="input-field pl-9"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c.id}
              onClick={() => setActiveCategory(c.id)}
              className={`px-3 py-1.5 rounded-full text-sm font-semibold transition ${
                activeCategory === c.id
                  ? 'bg-brand-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {TAGS.map((t) => (
            <button
              key={t.id}
              onClick={() => setActiveTag(activeTag === t.id ? null : t.id)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                activeTag === t.id
                  ? 'bg-slate-700 text-white dark:bg-slate-300 dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-slate-500 py-8">Brak przepisów pasujących do filtrów.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard key={recipe.id} recipe={recipe} onClick={() => setSelectedRecipe(recipe)} />
          ))}
        </div>
      )}

      <p className="text-xs text-center text-slate-400">
        {filtered.length} z {RECIPES.length} przepisów • Makroskładniki podane dla 1 porcji
      </p>

      {selectedRecipe && (
        <RecipeModal recipe={selectedRecipe} onClose={() => setSelectedRecipe(null)} />
      )}
    </div>
  )
}
