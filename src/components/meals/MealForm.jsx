import { useState, useMemo, useEffect, useRef } from 'react'
import { Plus, Search, Loader2, ArrowLeft, Pencil, X, BadgeCheck } from 'lucide-react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { searchFoods, scaleMacros } from '../../lib/foodApi'
import { MEAL_TYPES, guessMealType } from '../../lib/mealTypes'

const MacroChip = ({ label, value, color }) => (
  <span className={`text-xs font-semibold ${color}`}>{label}: {value}</span>
)

export const MealForm = ({ onAdd }) => {
  const [mode, setMode] = useState('search') // 'search' | 'manual'
  const [mealType, setMealType] = useState(guessMealType())

  // --- wyszukiwarka ---
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [searching, setSearching] = useState(false)
  const [searchError, setSearchError] = useState('')
  const [selected, setSelected] = useState(null) // wybrany produkt (per100)
  const [grams, setGrams] = useState(100)
  const abortRef = useRef(null)

  // --- ręczne ---
  const [form, setForm] = useState({ meal_name: '', protein: '', carbs: '', fat: '' })

  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Debounce wyszukiwania
  useEffect(() => {
    if (selected) return
    const q = query.trim()
    if (q.length < 2) {
      setResults([])
      setSearching(false)
      return
    }
    setSearching(true)
    setSearchError('')
    const t = setTimeout(async () => {
      if (abortRef.current) abortRef.current.abort()
      const controller = new AbortController()
      abortRef.current = controller
      try {
        const items = await searchFoods(q, controller.signal)
        setResults(items)
      } catch (err) {
        if (err.name !== 'AbortError') setSearchError('Nie udało się połączyć z bazą produktów.')
      } finally {
        setSearching(false)
      }
    }, 350)
    return () => clearTimeout(t)
  }, [query, selected])

  const selectedMacros = useMemo(
    () => (selected ? scaleMacros(selected.per100, grams) : null),
    [selected, grams]
  )

  const handleSelectFood = (food) => {
    setSelected(food)
    setGrams(100)
    setResults([])
    setError('')
  }

  const resetSearch = () => {
    setSelected(null)
    setQuery('')
    setResults([])
    setGrams(100)
  }

  const handleAddFromSearch = async () => {
    setError('')
    if (!selected) return
    if (!grams || grams <= 0) {
      setError('Podaj gramaturę większą od zera.')
      return
    }
    const m = selectedMacros
    setLoading(true)
    const { error } = await onAdd({
      meal_name: `${selected.name} (${grams} g)`,
      meal_type: mealType,
      calories: m.calories,
      protein: m.protein,
      carbs: m.carbs,
      fat: m.fat,
    })
    setLoading(false)
    if (error) setError(error.message || 'Błąd dodawania posiłku')
    else resetSearch()
  }

  // --- ręczne dodawanie ---
  const manualCalories = useMemo(() => {
    const p = parseFloat(form.protein) || 0
    const c = parseFloat(form.carbs) || 0
    const f = parseFloat(form.fat) || 0
    return Math.round(p * 4 + c * 4 + f * 9)
  }, [form.protein, form.carbs, form.fat])

  const handleManualChange = (field) => (e) => setForm({ ...form, [field]: e.target.value })

  const handleManualSubmit = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.meal_name.trim()) return setError('Podaj nazwę posiłku')
    if (manualCalories <= 0) return setError('Podaj makroskładniki, aby obliczyć kalorie')

    setLoading(true)
    const { error } = await onAdd({
      meal_name: form.meal_name.trim(),
      meal_type: mealType,
      calories: manualCalories,
      protein: parseFloat(form.protein) || 0,
      carbs: parseFloat(form.carbs) || 0,
      fat: parseFloat(form.fat) || 0,
    })
    setLoading(false)
    if (error) setError(error.message || 'Błąd dodawania posiłku')
    else setForm({ meal_name: '', protein: '', carbs: '', fat: '' })
  }

  return (
    <div>
      {/* Wybór posiłku */}
      <div className="mb-4">
        <p className="text-sm font-medium text-slate-600 dark:text-slate-300 mb-2">Do którego posiłku?</p>
        <div className="flex flex-wrap gap-2">
          {MEAL_TYPES.map(({ key, label, icon: Icon }) => (
            <button
              key={key}
              type="button"
              onClick={() => setMealType(key)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition ${
                mealType === key
                  ? 'bg-brand-600 text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>
      </div>

      {/* Przełącznik trybu */}
      <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-dark-border mb-4 w-full sm:w-auto">
        <button
          type="button"
          onClick={() => { setMode('search'); setError('') }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition ${mode === 'search' ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Search size={16} /> Wyszukaj produkt
        </button>
        <button
          type="button"
          onClick={() => { setMode('manual'); setError('') }}
          className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-semibold transition ${mode === 'manual' ? 'bg-brand-600 text-white' : 'hover:bg-slate-100 dark:hover:bg-slate-800'}`}
        >
          <Pencil size={16} /> Wpisz ręcznie
        </button>
      </div>

      {mode === 'search' ? (
        !selected ? (
          <div className="space-y-3">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Wpisz produkt, np. pomidor, jogurt naturalny, pierś z kurczaka..."
                className="input-field pl-10 pr-10"
                autoFocus
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {searching && (
              <div className="flex items-center gap-2 text-sm text-slate-500 py-2">
                <Loader2 size={16} className="animate-spin" /> Szukam w bazie produktów...
              </div>
            )}

            {searchError && (
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-sm">
                {searchError} Możesz dodać posiłek ręcznie (zakładka „Wpisz ręcznie").
              </div>
            )}

            {!searching && query.trim().length >= 2 && results.length === 0 && !searchError && (
              <p className="text-sm text-slate-500 py-2">
                Brak wyników dla „{query}". Spróbuj innej nazwy lub dodaj ręcznie.
              </p>
            )}

            {results.length > 0 && (
              <div className="max-h-80 overflow-y-auto rounded-xl border border-slate-200 dark:border-dark-border divide-y divide-slate-100 dark:divide-slate-800">
                {results.map((food) => (
                  <button
                    key={food.id}
                    type="button"
                    onClick={() => handleSelectFood(food)}
                    className="w-full text-left p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate flex items-center gap-1.5">
                          {food.source === 'local' && (
                            <BadgeCheck size={15} className="text-brand-500 shrink-0" title="Zweryfikowane wartości (IŻŻ)" />
                          )}
                          {food.name}
                          {food.brand && <span className="text-slate-400 font-normal"> · {food.brand}</span>}
                        </p>
                        <div className="flex gap-2.5 mt-0.5">
                          <MacroChip label="B" value={`${food.per100.protein}g`} color="text-blue-500" />
                          <MacroChip label="W" value={`${food.per100.carbs}g`} color="text-amber-500" />
                          <MacroChip label="T" value={`${food.per100.fat}g`} color="text-red-500" />
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="font-bold text-brand-600">{food.per100.calories}</p>
                        <p className="text-xs text-slate-400">kcal/100g</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            <p className="text-xs text-slate-400 flex items-start gap-1.5">
              <BadgeCheck size={14} className="text-brand-500 shrink-0 mt-0.5" />
              <span>
                Produkty z tą ikoną pochodzą z naszej zweryfikowanej bazy (wartości IŻŻ). Pozostałe wyniki
                z bazy Open Food Facts — wartości mogą się różnić zależnie od marki, więc je sprawdzaj.
              </span>
            </p>
          </div>
        ) : (
          // Wybrany produkt — ustaw gramaturę
          <div className="space-y-4">
            <button
              type="button"
              onClick={resetSearch}
              className="flex items-center gap-1.5 text-sm text-brand-600 hover:text-brand-700 font-semibold"
            >
              <ArrowLeft size={15} /> Zmień produkt
            </button>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-border">
              <p className="font-bold">{selected.name}</p>
              {selected.brand && <p className="text-xs text-slate-400 mb-1">{selected.brand}</p>}
              <p className="text-xs text-slate-500">
                Na 100 g: {selected.per100.calories} kcal · B {selected.per100.protein}g · W {selected.per100.carbs}g · T {selected.per100.fat}g
              </p>
            </div>

            <div className="w-40">
              <Input
                label="Ilość (g)"
                type="number"
                min="1"
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
              />
            </div>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 text-center">
                <p className="text-xs text-slate-500">Kalorie</p>
                <p className="font-bold text-brand-600">{selectedMacros.calories}</p>
              </div>
              <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-900/20 text-center">
                <p className="text-xs text-slate-500">Białko</p>
                <p className="font-bold text-blue-500">{selectedMacros.protein}g</p>
              </div>
              <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 text-center">
                <p className="text-xs text-slate-500">Węgle</p>
                <p className="font-bold text-amber-500">{selectedMacros.carbs}g</p>
              </div>
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 text-center">
                <p className="text-xs text-slate-500">Tłuszcze</p>
                <p className="font-bold text-red-500">{selectedMacros.fat}g</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
                {error}
              </div>
            )}

            <Button type="button" icon={Plus} disabled={loading} onClick={handleAddFromSearch} className="w-full sm:w-auto">
              {loading ? 'Dodawanie...' : 'Dodaj posiłek'}
            </Button>
          </div>
        )
      ) : (
        // Tryb ręczny
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <Input
            label="Nazwa posiłku"
            value={form.meal_name}
            onChange={handleManualChange('meal_name')}
            placeholder="np. Owsianka z owocami"
            required
          />

          <div className="grid grid-cols-3 gap-3">
            <Input label="Białko (g)" type="number" min="0" value={form.protein} onChange={handleManualChange('protein')} placeholder="20" />
            <Input label="Węglow. (g)" type="number" min="0" value={form.carbs} onChange={handleManualChange('carbs')} placeholder="60" />
            <Input label="Tłuszcze (g)" type="number" min="0" value={form.fat} onChange={handleManualChange('fat')} placeholder="12" />
          </div>

          <div className="p-3 rounded-xl bg-brand-50 dark:bg-brand-900/20 border border-brand-200 dark:border-brand-800 text-brand-700 dark:text-brand-400 text-sm font-semibold">
            Kalorie: {manualCalories} kcal
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-sm">
              {error}
            </div>
          )}

          <Button type="submit" icon={Plus} disabled={loading} className="w-full md:w-auto">
            {loading ? 'Dodawanie...' : 'Dodaj posiłek'}
          </Button>
        </form>
      )}
    </div>
  )
}
