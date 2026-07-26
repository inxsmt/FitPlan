// Wyszukiwarka produktów spożywczych oparta o Open Food Facts.
// Darmowe, otwarte API bez klucza — https://openfoodfacts.org
// Zwraca wartości odżywcze na 100 g/ml produktu (znormalizowane).

import { searchLocalFoods } from './localFoods'

const SEARCH_URL = 'https://world.openfoodfacts.org/cgi/search.pl'

const num = (v) => {
  const n = Number(v)
  return Number.isFinite(n) ? n : null
}

const round1 = (n) => Math.round(n * 10) / 10

// Zamienia surowy produkt z OFF na uproszczony obiekt z makro na 100 g
const normalize = (p) => {
  const nut = p.nutriments || {}

  // kcal bezpośrednio, a jeśli brak — przelicz z kJ (1 kcal = 4.184 kJ)
  let kcal = num(nut['energy-kcal_100g'])
  if (kcal == null && num(nut['energy_100g']) != null) {
    kcal = num(nut['energy_100g']) / 4.184
  }

  const name = (p.product_name_pl || p.product_name || p.generic_name_pl || '').trim()
  if (!name || kcal == null || kcal <= 0) return null

  return {
    id: p.code || `${name}-${kcal}`,
    name,
    brand: (p.brands || '').split(',')[0]?.trim() || '',
    servingSize: p.serving_size || null,
    per100: {
      calories: Math.round(kcal),
      protein: num(nut.proteins_100g) != null ? round1(num(nut.proteins_100g)) : 0,
      carbs: num(nut.carbohydrates_100g) != null ? round1(num(nut.carbohydrates_100g)) : 0,
      fat: num(nut.fat_100g) != null ? round1(num(nut.fat_100g)) : 0,
    },
  }
}

// Deduplikacja po nazwie+marce (OFF ma sporo duplikatów)
const dedupe = (items) => {
  const seen = new Set()
  return items.filter((it) => {
    const key = `${it.name.toLowerCase()}|${it.brand.toLowerCase()}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

/**
 * Wyszukuje produkty po nazwie (np. "pomidor", "jogurt naturalny").
 * @param {string} query
 * @param {AbortSignal} [signal] - do anulowania poprzedniego zapytania
 * @returns {Promise<Array>} lista produktów z makro na 100 g
 */
export const searchFoods = async (query, signal) => {
  const q = query.trim()
  if (q.length < 2) return []

  // 1) Najpierw lokalna baza podstawowych produktów (wiarygodne wartości IŻŻ)
  const local = searchLocalFoods(q)

  // 2) Potem Open Food Facts (produkty markowe, kod kreskowy itd.)
  let off = []
  try {
    const params = new URLSearchParams({
      search_terms: q,
      search_simple: '1',
      action: 'process',
      json: '1',
      page_size: '30',
      lc: 'pl',
      fields: 'code,product_name,product_name_pl,generic_name_pl,brands,nutriments,serving_size',
    })
    const res = await fetch(`${SEARCH_URL}?${params.toString()}`, { signal })
    if (!res.ok) throw new Error(`Błąd wyszukiwania (${res.status})`)
    const data = await res.json()
    const items = (data.products || []).map(normalize).filter(Boolean).map((it) => ({ ...it, source: 'off' }))

    // Sortowanie: produkty z pełnym makro i krótszą, bardziej "generyczną" nazwą wyżej
    const scored = items.map((it) => {
      const complete = it.per100.protein > 0 || it.per100.carbs > 0 || it.per100.fat > 0
      const startsWith = it.name.toLowerCase().startsWith(q.toLowerCase())
      return { it, score: (complete ? 2 : 0) + (startsWith ? 1 : 0) - it.name.length / 100 }
    })
    scored.sort((a, b) => b.score - a.score)
    off = scored.map((s) => s.it)
  } catch (err) {
    // Jeśli OFF nie odpowie, zwróć chociaż wyniki lokalne (o ile są)
    if (err.name === 'AbortError') throw err
    if (local.length === 0) throw err
  }

  // Łączymy: lokalne pierwsze, potem OFF; deduplikacja po nazwie+marce
  return dedupe([...local, ...off]).slice(0, 25)
}

/**
 * Przelicza makro produktu (na 100 g) na podaną gramaturę.
 */
export const scaleMacros = (per100, grams) => {
  const f = (Number(grams) || 0) / 100
  return {
    calories: Math.round(per100.calories * f),
    protein: Math.round(per100.protein * f),
    carbs: Math.round(per100.carbs * f),
    fat: Math.round(per100.fat * f),
  }
}
