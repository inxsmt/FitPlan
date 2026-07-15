/**
 * Wzor Mifflina-St Jeora (BMR - Basal Metabolic Rate)
 * Mezczyzni: 10*waga + 6.25*wzrost - 5*wiek + 5
 * Kobiety:   10*waga + 6.25*wzrost - 5*wiek - 161
 */
export const calculateBMR = ({ weight, height, age, gender }) => {
  const w = Number(weight)
  const h = Number(height)
  const a = Number(age)

  if (!w || !h || !a) return 0

  const base = 10 * w + 6.25 * h - 5 * a
  return gender === 'female' ? base - 161 : base + 5
}

/**
 * Wspolczynniki PAL (Physical Activity Level)
 */
export const ACTIVITY_LEVELS = [
  { value: 1.2, label: 'Siedzacy tryb (brak cwiczen)', description: 'Praca biurowa, brak aktywnosci' },
  { value: 1.375, label: 'Lekka aktywnosc (1-3 dni/tydz.)', description: 'Lekkie cwiczenia lub spacery' },
  { value: 1.55, label: 'Umiarkowana aktywnosc (3-5 dni/tydz.)', description: 'Trening silowy lub cardio' },
  { value: 1.725, label: 'Wysoka aktywnosc (6-7 dni/tydz.)', description: 'Intensywne treningi codziennie' },
  { value: 1.9, label: 'Bardzo wysoka (sportowiec)', description: 'Praca fizyczna + treningi 2x dziennie' },
]

/**
 * TDEE = BMR * PAL
 */
export const calculateTDEE = (bmr, activityLevel) => {
  return Math.round(bmr * Number(activityLevel))
}

/**
 * Cele kaloryczne (deficyt/nadwyzka)
 */
export const GOAL_ADJUSTMENTS = [
  { value: -500, label: 'Redukcja masy (-0.5 kg/tydz.)' },
  { value: -250, label: 'Lagodna redukcja (-0.25 kg/tydz.)' },
  { value: 0, label: 'Utrzymanie masy' },
  { value: 250, label: 'Lagodna budowa (+0.25 kg/tydz.)' },
  { value: 500, label: 'Budowa masy (+0.5 kg/tydz.)' },
]

/**
 * Sumuje makroskladniki z listy posilkow
 */
export const sumMacros = (meals = []) => {
  return meals.reduce(
    (acc, m) => ({
      calories: acc.calories + (m.calories || 0),
      protein: acc.protein + (m.protein || 0),
      carbs: acc.carbs + (m.carbs || 0),
      fat: acc.fat + (m.fat || 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
}

/**
 * Filtruje posilki z danego dnia
 */
export const filterTodayMeals = (meals = []) => {
  const today = new Date().toISOString().slice(0, 10)
  return meals.filter((m) => m.created_at?.slice(0, 10) === today)
}

/**
 * Rekomendacja makro wg standardowego rozkladu:
 * Bialko: 1.6g/kg masy ciala (lub 25% kcal)
 * Tluszcze: 25% kcal
 * Weglowodany: reszta
 */
export const recommendedMacros = (targetCalories, weight = 70) => {
  const protein = Math.round(weight * 1.6)
  const proteinKcal = protein * 4
  const fatKcal = targetCalories * 0.25
  const fat = Math.round(fatKcal / 9)
  const carbsKcal = targetCalories - proteinKcal - fatKcal
  const carbs = Math.round(carbsKcal / 4)
  return { protein, carbs, fat }
}

/**
 * Rozmiar standardowej szklanki wody
 */
export const GLASS_SIZE_ML = 250

/**
 * Rekomendowane dzienne spozycie wody: ok. 35ml/kg masy ciala
 * (przy braku wagi - domyslnie 2500ml)
 */
export const recommendedWaterMl = (weight = null) => {
  if (!weight) return 2500
  return Math.round((weight * 35) / 50) * 50
}

/**
 * Sumuje ilosc wypitej wody (ml) z listy logow
 */
export const sumWater = (waterLogs = []) => {
  return waterLogs.reduce((sum, w) => sum + (w.amount_ml || 0), 0)
}

/**
 * Filtruje logi wody z danego dnia
 */
export const filterTodayWater = (waterLogs = []) => {
  const today = new Date().toISOString().slice(0, 10)
  return waterLogs.filter((w) => w.created_at?.slice(0, 10) === today)
}

/**
 * Wyznacza tendencje wagi na podstawie pierwszego i ostatniego wpisu:
 * kierunek (up/down/stable) i tempo zmiany na tydzien.
 * Tempo tygodniowe liczone tylko gdy miedzy wpisami minela co najmniej doba
 * (przy krotszym okresie ekstrapolacja na tydzien byłaby niemiarodajna).
 */
export const calculateWeightTrend = (weightLogs = []) => {
  if (weightLogs.length < 2) return { direction: 'stable', changeKg: 0, changePerWeek: null }

  const sorted = [...weightLogs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  const first = sorted[0]
  const last = sorted[sorted.length - 1]
  const days = (new Date(last.created_at) - new Date(first.created_at)) / (1000 * 60 * 60 * 24)

  const changeKg = Number((last.weight_kg - first.weight_kg).toFixed(1))
  const changePerWeek = days >= 1 ? Number(((changeKg / days) * 7).toFixed(2)) : null
  const direction = changeKg > 0.1 ? 'up' : changeKg < -0.1 ? 'down' : 'stable'

  return { direction, changeKg, changePerWeek }
}

/**
 * WHR (Waist-to-Hip Ratio) - stosunek obwodu talii do obwodu bioder.
 * Uzywany do oceny rozmieszczenia tkanki tluszczowej (otylosc brzuszna),
 * niezaleznie od samej masy ciala.
 */
export const calculateWHR = (waistCm, hipsCm) => {
  if (!waistCm || !hipsCm) return null
  return Number((waistCm / hipsCm).toFixed(2))
}

/**
 * Kategoria ryzyka zdrowotnego na podstawie WHR wg progow WHO.
 * Progi rozne dla kobiet i mezczyzn:
 * Kobiety: <0.80 niskie, 0.80-0.84 podwyzszone, >=0.85 wysokie
 * Mezczyzni: <0.90 niskie, 0.90-0.99 podwyzszone, >=1.0 wysokie
 */
export const whrRiskCategory = (whr, gender) => {
  if (!whr) return null
  const isFemale = gender === 'female'
  const lowMax = isFemale ? 0.80 : 0.90
  const highMin = isFemale ? 0.85 : 1.0
  if (whr < lowMax) return { label: 'Niskie ryzyko', color: 'text-green-500' }
  if (whr < highMin) return { label: 'Podwyzszone ryzyko', color: 'text-amber-500' }
  return { label: 'Wysokie ryzyko', color: 'text-red-500' }
}
