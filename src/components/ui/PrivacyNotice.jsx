import { Info } from 'lucide-react'

/**
 * Klauzula informacyjna wymagana przez art. 13 RODO.
 *
 * To informacja, a nie zgoda - uzytkownik niczego nie zaznacza.
 * Wyswietlana w dwoch miejscach, zeby dotrzec takze do osob, ktore
 * zalozyly konto przed jej wprowadzeniem:
 *   - przy rejestracji (Register.jsx),
 *   - w ustawieniach profilu (ProfileSettings.jsx).
 */
export const PrivacyNotice = ({ className = '' }) => (
  <div
    className={`p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-dark-border text-xs text-slate-500 dark:text-slate-400 leading-relaxed ${className}`}
  >
    <p className="font-semibold text-slate-600 dark:text-slate-300 mb-1 flex items-center gap-1.5">
      <Info size={13} /> Informacja o przetwarzaniu danych
    </p>
    FitPlan to projekt edukacyjny realizowany w ramach studiów na Uniwersytecie VIZJA.
    Twoje dane (imię, nazwisko, adres e-mail oraz wprowadzone pomiary) są przetwarzane
    wyłącznie po to, aby aplikacja działała, i nie są nikomu udostępniane ani sprzedawane.
    W każdej chwili możesz je zmienić lub usunąć konto w ustawieniach profilu.
  </div>
)
