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
