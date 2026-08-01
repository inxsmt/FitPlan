import { Link } from 'react-router-dom'
import { ShieldCheck, Shield } from 'lucide-react'
import { useProfile } from '../../hooks/useProfile'

/**
 * Wskaznik udzialu w projekcie w gornym pasku.
 *
 * Pokazuje aktualny stan zgody, a po najechaniu kursorem tlumaczy,
 * co to znaczy i gdzie to zmienic. Klikniecie prowadzi wprost
 * do ustawien profilu.
 *
 * Ukryty na malych ekranach - navbar jest tam ciasny, a ta sama
 * informacja jest dostepna w ustawieniach profilu.
 */
export const ConsentBadge = () => {
  const { profile } = useProfile()

  // Profil jeszcze sie laduje - nie migamy niepoprawnym stanem.
  if (!profile) return null

  const hasConsent = Boolean(profile.presentation_consent_at)

  return (
    <Link
      to="/profile"
      className="relative group hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold transition-colors
        bg-slate-100 text-slate-500 hover:bg-slate-200
        dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-slate-700"
      aria-label="Udział w projekcie — przejdź do ustawień"
    >
      {hasConsent ? (
        <>
          <ShieldCheck size={14} className="text-green-600 dark:text-green-400" />
          <span className="text-green-700 dark:text-green-400">W projekcie</span>
        </>
      ) : (
        <>
          <Shield size={14} />
          <span>Poza projektem</span>
        </>
      )}

      {/* Tooltip - pojawia sie po najechaniu kursorem.
          pointer-events-none, zeby nie przechwytywal klikniecia w badge. */}
      <span
        role="tooltip"
        className="pointer-events-none absolute left-1/2 -translate-x-1/2 top-full mt-2 w-64 p-3 rounded-xl
          bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border shadow-lg
          text-xs font-normal leading-relaxed text-slate-600 dark:text-slate-300
          opacity-0 invisible group-hover:opacity-100 group-hover:visible
          transition-opacity duration-150 z-50"
      >
        {hasConsent ? (
          <>
            <span className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Bierzesz udział w projekcie
            </span>
            Zgodziłeś się, aby Twoje konto mogło zostać pokazane podczas obrony
            i w dokumentacji projektu FitPlan.
          </>
        ) : (
          <>
            <span className="block font-semibold text-slate-700 dark:text-slate-200 mb-1">
              Nie bierzesz udziału w projekcie
            </span>
            Twoje konto nie będzie pokazywane w prezentacji ani w dokumentacji.
            Aplikacja działa normalnie — to bez znaczenia dla korzystania z niej.
          </>
        )}
        <span className="block mt-1.5 text-brand-600 dark:text-brand-400 font-medium">
          Kliknij, aby zmienić w ustawieniach profilu →
        </span>
      </span>
    </Link>
  )
}
