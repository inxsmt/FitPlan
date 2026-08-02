import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { X, Bug, Lightbulb, Mail, Copy, Check } from 'lucide-react'

export const CONTACT_EMAIL = 'trynima1545_aeh@students.vizja.pl'

/**
 * Buduje link mailto z gotowym tematem i trescia.
 *
 * Adres i tak jest widoczny w oknie, wiec osoba bez skonfigurowanego
 * klienta poczty moze go po prostu skopiowac przyciskiem obok.
 */
const mailto = (subject, body) =>
  `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

/**
 * Stopka doklejana do zgloszenia bledu. Bez tych danych wiekszosc
 * zgloszen konczy sie dopytywaniem "a gdzie dokladnie i na czym?".
 */
const bugContext = (path) =>
  [
    '',
    '---',
    'Dane techniczne (pomagaja znalezc blad, mozesz zostawic):',
    `Strona: ${path}`,
    `Przegladarka: ${navigator.userAgent}`,
    `Ekran: ${window.innerWidth}x${window.innerHeight}`,
  ].join('\n')

export const FeedbackModal = ({ open, onClose }) => {
  const { pathname } = useLocation()
  const [copied, setCopied] = useState(false)

  // Escape zamyka okno - standardowe zachowanie modala.
  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  // Po zamknieciu wracamy do stanu wyjsciowego, zeby przy kolejnym
  // otwarciu nie wisial komunikat "Skopiowano" sprzed kwadransa.
  useEffect(() => {
    if (!open) setCopied(false)
  }, [open])

  if (!open) return null

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTACT_EMAIL)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Brak uprawnien do schowka (albo strona bez HTTPS) - adres jest
      // widoczny obok, wiec da sie go zaznaczyc recznie.
    }
  }

  const options = [
    {
      icon: Bug,
      color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30',
      title: 'Coś nie działa',
      text: 'Błąd, dziwne zachowanie, coś się nie zapisuje albo nie wyświetla.',
      href: mailto(
        'FitPlan — zgłoszenie błędu',
        [
          'Co się stało:',
          '',
          'Co robiłem/robiłam, zanim to wystąpiło:',
          '',
          bugContext(pathname),
        ].join('\n')
      ),
    },
    {
      icon: Lightbulb,
      color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30',
      title: 'Mam pomysł na funkcję',
      text: 'Czegoś brakuje albo dałoby się zrobić wygodniej? Chętnie posłucham.',
      href: mailto(
        'FitPlan — propozycja funkcji',
        ['Co chciałbym/chciałabym w aplikacji:', '', 'Do czego by mi się to przydało:', ''].join('\n')
      ),
    },
    {
      icon: Mail,
      color: 'text-brand-600 dark:text-brand-400 bg-brand-100 dark:bg-brand-900/30',
      title: 'Coś innego',
      text: 'Pytanie, uwaga do treści, sprawa dotycząca danych osobowych.',
      href: mailto('FitPlan — wiadomość', ''),
    },
  ]

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center bg-black/50 p-0 sm:p-4"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="feedback-title"
        onClick={(e) => e.stopPropagation()}
        className="w-full sm:max-w-lg max-h-[90vh] overflow-y-auto bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-t-2xl sm:rounded-2xl shadow-xl animate-fade-in"
      >
        <div className="flex items-start justify-between gap-4 p-5 pb-3">
          <div>
            <h2 id="feedback-title" className="text-xl font-bold">Zgłoś błąd lub pomysł</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              FitPlan jest w wersji beta i rozwijam go na podstawie Waszych uwag
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Zamknij"
            className="shrink-0 p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X size={18} />
          </button>
        </div>

        <div className="px-5 space-y-2">
          {options.map(({ icon: Icon, color, title, text, href }) => (
            <a
              key={title}
              href={href}
              onClick={onClose}
              className="flex items-start gap-3 p-3 rounded-xl border border-slate-200 dark:border-dark-border hover:border-brand-500 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
            >
              <span className={`shrink-0 p-2 rounded-xl ${color}`}>
                <Icon size={18} />
              </span>
              <span>
                <span className="block font-semibold text-sm">{title}</span>
                <span className="block text-xs text-slate-500 dark:text-slate-400 leading-relaxed mt-0.5">
                  {text}
                </span>
              </span>
            </a>
          ))}
        </div>

        <div className="m-5 mt-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1.5">
            Nie masz skonfigurowanej poczty? Napisz z dowolnej skrzynki na adres:
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 text-xs sm:text-sm font-semibold break-all select-all">
              {CONTACT_EMAIL}
            </code>
            <button
              onClick={handleCopy}
              aria-label="Skopiuj adres e-mail"
              className="shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border hover:border-brand-500 transition-colors"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-green-600" /> Skopiowano
                </>
              ) : (
                <>
                  <Copy size={14} /> Kopiuj
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
