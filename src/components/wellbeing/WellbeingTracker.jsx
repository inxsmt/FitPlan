import { useMemo, useState } from 'react'
import { HeartPulse, Zap, Smile, Moon, Activity, Utensils, Trash2, Clock } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useWellbeing } from '../../hooks/useWellbeing'
import { useMeals } from '../../hooks/useMeals'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import {
  SYMPTOM_OPTIONS,
  BRISTOL_TYPES,
  filterTodayWellbeing,
  filterTodayMeals,
  tallySymptoms,
  dailyWellbeingAverages,
} from '../../utils/calculations'

const LEVEL_COLOR = (level) => (level >= 4 ? 'text-green-500' : level === 3 ? 'text-amber-500' : 'text-red-500')

const summarizeEntry = (w) => {
  const parts = []
  if (w.energy_level) parts.push(`Energia ${w.energy_level}/5`)
  if (w.mood_level) parts.push(`Nastrój ${w.mood_level}/5`)
  if (w.sleep_hours != null) parts.push(`Sen ${w.sleep_hours}h`)
  if (w.bristol_scale) parts.push(`Bristol typ ${w.bristol_scale}`)
  if (w.symptoms?.length) parts.push(w.symptoms.join(', '))
  return parts.join(' · ') || 'Wpis samopoczucia'
}

export const WellbeingTracker = () => {
  const { wellbeingLogs, loading, addWellbeing, deleteWellbeing } = useWellbeing()
  const { meals } = useMeals()

  const [energyLevel, setEnergyLevel] = useState(null)
  const [moodLevel, setMoodLevel] = useState(null)
  const [sleepHours, setSleepHours] = useState('')
  const [bristol, setBristol] = useState(null)
  const [symptoms, setSymptoms] = useState([])
  const [note, setNote] = useState('')
  const [saving, setSaving] = useState(false)

  const todayWellbeing = useMemo(() => filterTodayWellbeing(wellbeingLogs), [wellbeingLogs])
  const todayMeals = useMemo(() => filterTodayMeals(meals), [meals])

  const timeline = useMemo(() => {
    const items = [
      ...todayMeals.map((m) => ({
        type: 'meal',
        time: m.created_at,
        title: m.meal_name,
        detail: `${m.calories} kcal`,
      })),
      ...todayWellbeing.map((w) => ({
        type: 'wellbeing',
        time: w.created_at,
        title: summarizeEntry(w),
        detail: w.note,
      })),
    ]
    return items.sort((a, b) => new Date(a.time) - new Date(b.time))
  }, [todayMeals, todayWellbeing])

  const trendData = useMemo(() => dailyWellbeingAverages(wellbeingLogs, 14), [wellbeingLogs])
  const symptomTally = useMemo(() => tallySymptoms(wellbeingLogs, 30), [wellbeingLogs])
  const maxTally = symptomTally[0]?.count || 1

  const toggleSymptom = (s) => {
    setSymptoms((prev) => (prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s]))
  }

  const hasAnyInput = energyLevel || moodLevel || sleepHours || bristol || symptoms.length > 0 || note.trim()

  const handleAdd = async () => {
    if (!hasAnyInput) return
    setSaving(true)
    await addWellbeing({
      energy_level: energyLevel,
      mood_level: moodLevel,
      sleep_hours: sleepHours ? parseFloat(sleepHours.replace(',', '.')) : null,
      bristol_scale: bristol,
      symptoms,
      note: note.trim() || null,
    })
    setEnergyLevel(null)
    setMoodLevel(null)
    setSleepHours('')
    setBristol(null)
    setSymptoms([])
    setNote('')
    setSaving(false)
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ładowanie...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Samopoczucie</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Zapisuj energię, nastrój i objawy trawienne, aby powiązać je z tym, co jesz
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Dodaj wpis" icon={HeartPulse} className="lg:col-span-1">
          <div>
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1"><Zap size={13} /> Energia</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setEnergyLevel(n === energyLevel ? null : n)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
                    energyLevel === n
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1"><Smile size={13} /> Nastrój</p>
            <div className="flex gap-1.5">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setMoodLevel(n === moodLevel ? null : n)}
                  className={`flex-1 py-1.5 rounded-lg text-sm font-semibold border transition ${
                    moodLevel === n
                      ? 'bg-brand-600 text-white border-brand-600'
                      : 'border-slate-200 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1"><Moon size={13} /> Sen (godziny)</p>
            <input
              type="number"
              step="0.5"
              min="0"
              max="24"
              value={sleepHours}
              onChange={(e) => setSleepHours(e.target.value)}
              placeholder="np. 7.5"
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5 flex items-center gap-1"><Activity size={13} /> Objawy trawienne</p>
            <div className="flex flex-wrap gap-1.5">
              {SYMPTOM_OPTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => toggleSymptom(s)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium border transition ${
                    symptoms.includes(s)
                      ? 'bg-red-500 text-white border-red-500'
                      : 'border-slate-200 dark:border-dark-border text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Skala Bristolska (opcjonalnie)</p>
            <select
              value={bristol || ''}
              onChange={(e) => setBristol(e.target.value ? Number(e.target.value) : null)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            >
              <option value="">Nie określono</option>
              {BRISTOL_TYPES.map((b) => (
                <option key={b.value} value={b.value}>{b.label} - {b.desc}</option>
              ))}
            </select>
          </div>

          <div className="mt-4">
            <p className="text-xs font-medium text-slate-500 mb-1.5">Notatka</p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="np. wzdęcia po nabiale"
              rows={2}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <Button
            variant="primary"
            className="w-full mt-4"
            disabled={saving || !hasAnyInput}
            onClick={handleAdd}
          >
            {saving ? 'Zapisywanie...' : 'Zapisz wpis'}
          </Button>
        </Card>

        <div className="lg:col-span-2 space-y-6">
          <Card title="Oś czasu dnia" icon={Clock} subtitle="Posiłki i samopoczucie razem">
            {timeline.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Brak wpisów z dzisiaj</p>
            ) : (
              <ul className="space-y-2">
                {timeline.map((item, i) => (
                  <li key={i} className="flex items-start gap-3 px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                    <div className={`p-1.5 rounded-lg ${item.type === 'meal' ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-600' : 'bg-red-100 dark:bg-red-900/30 text-red-500'}`}>
                      {item.type === 'meal' ? <Utensils size={14} /> : <HeartPulse size={14} />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{item.title}</p>
                      {item.detail && <p className="text-xs text-slate-500 truncate">{item.detail}</p>}
                    </div>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(item.time).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </Card>

          <Card title="Trend energii i nastroju" icon={Zap} subtitle="Ostatnie 14 dni">
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" domain={[1, 5]} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="energia" stroke="#f59e0b" strokeWidth={2.5} dot={{ r: 3 }} name="Energia" connectNulls />
                  <Line type="monotone" dataKey="nastroj" stroke="#3b82f6" strokeWidth={2.5} dot={{ r: 3 }} name="Nastrój" connectNulls />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card title="Najczęstsze objawy" icon={Activity} subtitle="Ostatnie 30 dni">
            {symptomTally.length === 0 ? (
              <p className="text-sm text-slate-500 text-center py-6">Brak zarejestrowanych objawów</p>
            ) : (
              <ul className="space-y-2">
                {symptomTally.map(({ symptom, count }) => (
                  <li key={symptom} className="flex items-center gap-3">
                    <span className="text-sm w-36 shrink-0 truncate">{symptom}</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className="h-full bg-red-500 rounded-full"
                        style={{ width: `${(count / maxTally) * 100}%` }}
                      />
                    </div>
                    <span className="text-xs text-slate-500 w-6 text-right shrink-0">{count}x</span>
                  </li>
                ))}
              </ul>
            )}
          </Card>
        </div>
      </div>

      <Card title={`Historia wpisów (${wellbeingLogs.length})`}>
        {wellbeingLogs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Brak wpisów - dodaj pierwszy wpis samopoczucia!</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {wellbeingLogs.map((w) => (
              <li
                key={w.id}
                className="flex items-start justify-between gap-3 px-3 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-3 flex-wrap text-sm">
                    {w.energy_level && <span className={`font-semibold ${LEVEL_COLOR(w.energy_level)}`}>Energia {w.energy_level}/5</span>}
                    {w.mood_level && <span className={`font-semibold ${LEVEL_COLOR(w.mood_level)}`}>Nastrój {w.mood_level}/5</span>}
                    {w.sleep_hours != null && <span className="text-slate-500">Sen {w.sleep_hours}h</span>}
                    {w.bristol_scale && <span className="text-slate-500">Bristol typ {w.bristol_scale}</span>}
                  </div>
                  {w.symptoms?.length > 0 && (
                    <p className="text-xs text-red-500 mt-1">{w.symptoms.join(', ')}</p>
                  )}
                  {w.note && <p className="text-xs text-slate-400 mt-1 italic">"{w.note}"</p>}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-slate-400">
                    {new Date(w.created_at).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' })}{' '}
                    {new Date(w.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <button
                    onClick={() => deleteWellbeing(w.id)}
                    className="text-slate-400 hover:text-red-500 transition"
                    aria-label="Usuń wpis"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  )
}
