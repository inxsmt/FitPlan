import { Sunrise, Sandwich, UtensilsCrossed, Apple, Moon } from 'lucide-react'

// Typy posiłków w kolejności dnia. Klucz zapisujemy w kolumnie meal_type.
export const MEAL_TYPES = [
  { key: 'sniadanie', label: 'Śniadanie', icon: Sunrise },
  { key: 'ii_sniadanie', label: 'II śniadanie', icon: Sandwich },
  { key: 'obiad', label: 'Obiad', icon: UtensilsCrossed },
  { key: 'przekaska', label: 'Przekąska', icon: Apple },
  { key: 'kolacja', label: 'Kolacja', icon: Moon },
]

export const MEAL_TYPE_KEYS = new Set(MEAL_TYPES.map((t) => t.key))

// Domyślny posiłek na podstawie pory dnia
export const guessMealType = () => {
  const h = new Date().getHours()
  if (h < 10) return 'sniadanie'
  if (h < 12) return 'ii_sniadanie'
  if (h < 16) return 'obiad'
  if (h < 18) return 'przekaska'
  return 'kolacja'
}

export const mealTypeLabel = (key) => MEAL_TYPES.find((t) => t.key === key)?.label || 'Inne'
