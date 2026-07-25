import { useState } from 'react'
import { Search, X, AlertTriangle, Apple, ShieldCheck, Users, Lightbulb, BookMarked } from 'lucide-react'
import { Card } from '../ui/Card'
import { NUTRIENTS, CATEGORIES, RISK_LEVELS } from './micronutrientsData'

// Pełne, literalne klasy — Tailwind nie wykrywa dynamicznie sklejanych nazw klas.
const RISK_STYLES = {
  wysokie: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
  umiarkowane: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
  niskie: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
}

const RiskBadge = ({ level }) => {
  const risk = RISK_LEVELS[level]
  if (!risk) return null
  return (
    <span
      className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full ${RISK_STYLES[level]}`}
    >
      <AlertTriangle size={11} />
      {risk.label}
    </span>
  )
}

const Section = ({ icon: Icon, title, children }) => (
  <div className="mb-5">
    <h3 className="flex items-center gap-2 font-semibold mb-2">
      <Icon size={16} className="text-brand-600 dark:text-brand-400" />
      {title}
    </h3>
    {children}
  </div>
)

const NutrientModal = ({ nutrient, onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={onClose}>
    <div
      className="bg-white dark:bg-dark-card rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center shrink-0">
              {nutrient.symbol}
            </div>
            <div>
              <h2 className="text-xl font-bold leading-tight">{nutrient.name}</h2>
              <p className="text-sm text-slate-500">{nutrient.tagline}</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 shrink-0">
            <X size={18} />
          </button>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-5">
          <div className="text-center px-3 py-2 rounded-lg bg-blue-100 dark:bg-blue-900/30">
            <p className="text-xs text-blue-600 dark:text-blue-400">Norma (mężczyźni)</p>
            <p className="font-bold text-sm text-blue-700 dark:text-blue-400">{nutrient.rda.men}</p>
          </div>
          <div className="text-center px-3 py-2 rounded-lg bg-pink-100 dark:bg-pink-900/30">
            <p className="text-xs text-pink-600 dark:text-pink-400">Norma (kobiety)</p>
            <p className="font-bold text-sm text-pink-700 dark:text-pink-400">{nutrient.rda.women}</p>
          </div>
        </div>

        <Section icon={ShieldCheck} title="Dlaczego ważny dla ćwiczących">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{nutrient.whyActive}</p>
        </Section>

        <Section icon={AlertTriangle} title="Objawy niedoboru">
          <ul className="space-y-1.5">
            {nutrient.deficiencySigns.map((sign, i) => (
              <li key={i} className="flex items-start gap-2 text-sm">
                <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                {sign}
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Users} title="Kto jest najbardziej narażony">
          <div className="flex flex-wrap gap-1.5">
            {nutrient.atRisk.map((group, i) => (
              <span key={i} className="text-xs px-2 py-1 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400">
                {group}
              </span>
            ))}
          </div>
        </Section>

        <Section icon={Apple} title="Najlepsze źródła w diecie">
          <ul className="space-y-1">
            {nutrient.sources.map((src, i) => (
              <li key={i} className="flex items-center justify-between gap-3 text-sm py-1 border-b border-slate-100 dark:border-slate-800 last:border-0">
                <span>{src.food}</span>
                <span className="font-semibold text-brand-600 dark:text-brand-400 shrink-0">{src.amount}</span>
              </li>
            ))}
          </ul>
        </Section>

        <Section icon={Lightbulb} title="Wskazówka praktyczna">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed bg-brand-50 dark:bg-brand-900/20 rounded-xl p-3">
            {nutrient.tip}
          </p>
        </Section>

        <Section icon={AlertTriangle} title="Uwaga o suplementacji">
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{nutrient.upperLimit}</p>
        </Section>

        <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
          <h3 className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1.5">
            <BookMarked size={13} /> Źródła
          </h3>
          <ul className="space-y-0.5">
            {nutrient.references.map((ref, i) => (
              <li key={i} className="text-xs text-slate-400">• {ref}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
)

const NutrientCard = ({ nutrient, onClick }) => (
  <button onClick={onClick} className="text-left group w-full">
    <div className="card hover:shadow-lg hover:scale-[1.01] transition-all h-full flex flex-col">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-11 h-11 rounded-xl bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-400 font-bold flex items-center justify-center shrink-0">
          {nutrient.symbol}
        </div>
        <div className="min-w-0">
          <h3 className="font-bold text-base leading-tight group-hover:text-brand-600 dark:group-hover:text-brand-400 transition-colors">
            {nutrient.name}
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">{nutrient.tagline}</p>
        </div>
      </div>

      <div className="mt-auto pt-2 flex items-center justify-between gap-2">
        <RiskBadge level={nutrient.riskForActive} />
        <span className="text-xs text-slate-400">Norma: {nutrient.rda.men}</span>
      </div>
    </div>
  </button>
)

export const Micronutrients = () => {
  const [activeCategory, setActiveCategory] = useState('all')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)

  const filtered = NUTRIENTS.filter((n) => {
    if (activeCategory !== 'all' && n.category !== activeCategory) return false
    if (search && !n.name.toLowerCase().includes(search.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Mikroskładniki dla ćwiczących</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Witaminy i minerały kluczowe dla osób aktywnych fizycznie — normy, objawy niedoboru, najlepsze źródła i praktyczne wskazówki
        </p>
      </div>

      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Szukaj składnika..."
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
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-center text-slate-500 py-8">Brak składników pasujących do filtrów.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((nutrient) => (
            <NutrientCard key={nutrient.id} nutrient={nutrient} onClick={() => setSelected(nutrient)} />
          ))}
        </div>
      )}

      <Card className="bg-slate-50 dark:bg-slate-800/40">
        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
          <strong>Zastrzeżenie:</strong> Materiał ma charakter edukacyjny i nie zastępuje porady lekarza ani dietetyka.
          Podane normy (RDA/AI) dotyczą dorosłych i mają charakter orientacyjny (na podstawie „Norm żywienia dla populacji
          Polski”, NIZP-PZH 2020). Suplementację, zwłaszcza żelaza i witaminy D, warto wdrażać po badaniach krwi.
        </p>
      </Card>

      {selected && <NutrientModal nutrient={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
