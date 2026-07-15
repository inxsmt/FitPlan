import { useMemo, useState } from 'react'
import { Droplet, Plus, Minus, Trash2, GlassWater, Info } from 'lucide-react'
import { useWater } from '../../hooks/useWater'
import { useProfile } from '../../hooks/useProfile'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { MacroRing } from '../dashboard/MacroRing'
import { GLASS_SIZE_ML, recommendedWaterMl, sumWater, filterTodayWater } from '../../utils/calculations'

const QUICK_AMOUNTS = [
  { label: 'Szklanka', ml: 250 },
  { label: 'Kubek', ml: 350 },
  { label: 'Butelka', ml: 500 },
]

const HYDRATION_TIPS = [
  'Pij szklanke wody zaraz po przebudzeniu, aby uzupelnic straty z nocy.',
  'Zapotrzebowanie rosnie w dni treningowe - dolicz ok. 500-750ml na kazda godzine wysiłku.',
  'Nie czekaj na pragnienie - to sygnal, ze organizm jest juz lekko odwodniony.',
  'W upalne dni oraz przy gorączce zwieksz spozycie wody o 10-20%.',
  'Rownomiernie rozloz picie w ciagu dnia zamiast duzych ilosci na raz.',
  'Kawa i herbata licza sie do bilansu plynow, ale najlepszym wyborem pozostaje czysta woda.',
]

export const WaterTracker = () => {
  const { waterLogs, loading, addWater, deleteWater } = useWater()
  const { profile } = useProfile()
  const [adding, setAdding] = useState(false)

  const todayWater = useMemo(() => filterTodayWater(waterLogs), [waterLogs])
  const todayMl = useMemo(() => sumWater(todayWater), [todayWater])

  const weight = profile?.weight || null
  const targetMl = recommendedWaterMl(weight)
  const glasses = Math.round(todayMl / GLASS_SIZE_ML)
  const targetGlasses = Math.round(targetMl / GLASS_SIZE_ML)

  const handleAdd = async (ml) => {
    setAdding(true)
    await addWater(ml)
    setAdding(false)
  }

  const handleRemoveLast = async () => {
    if (todayWater.length === 0) return
    await deleteWater(todayWater[0].id)
  }

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ladowanie...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Nawodnienie</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Sledz ile wody wypijasz w ciagu dnia
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Dzisiejsze nawodnienie" icon={Droplet} className="lg:col-span-1">
          <div className="flex flex-col items-center">
            <MacroRing current={todayMl} target={targetMl} label="Woda" unit="ml" color="#0ea5e9" />
            <p className="mt-3 text-sm text-slate-500">
              <span className="font-semibold text-sky-500">{glasses}</span> / {targetGlasses} szklanek (250ml)
            </p>
            {weight && (
              <p className="text-xs text-slate-400 mt-1">cel wg wagi {weight}kg - {targetMl}ml/dzien</p>
            )}
          </div>

          <div className="grid grid-cols-3 gap-2 mt-6">
            {QUICK_AMOUNTS.map(({ label, ml }) => (
              <button
                key={ml}
                onClick={() => handleAdd(ml)}
                disabled={adding}
                className="flex flex-col items-center gap-1 p-3 rounded-xl border border-slate-200 dark:border-dark-border hover:bg-sky-50 dark:hover:bg-sky-900/20 hover:border-sky-300 transition disabled:opacity-50"
              >
                <GlassWater size={20} className="text-sky-500" />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-xs text-slate-400">{ml}ml</span>
              </button>
            ))}
          </div>

          <div className="flex gap-2 mt-3">
            <Button
              icon={Plus}
              variant="primary"
              className="flex-1"
              disabled={adding}
              onClick={() => handleAdd(GLASS_SIZE_ML)}
            >
              Dodaj szklanke
            </Button>
            <Button
              icon={Minus}
              variant="secondary"
              disabled={adding || todayWater.length === 0}
              onClick={handleRemoveLast}
            >
              Cofnij
            </Button>
          </div>
        </Card>

        <Card title={`Dzisiejsze wpisy (${todayWater.length})`} className="lg:col-span-1">
          {todayWater.length === 0 ? (
            <p className="text-sm text-slate-500 text-center py-6">Brak wpisow - dodaj pierwsza porcje wody!</p>
          ) : (
            <ul className="space-y-2 max-h-80 overflow-y-auto">
              {todayWater.map((w) => (
                <li
                  key={w.id}
                  className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
                >
                  <div className="flex items-center gap-2">
                    <Droplet size={16} className="text-sky-500" />
                    <span className="font-medium text-sm">{w.amount_ml}ml</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-400">
                      {new Date(w.created_at).toLocaleTimeString('pl-PL', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <button
                      onClick={() => deleteWater(w.id)}
                      className="text-slate-400 hover:text-red-500 transition"
                      aria-label="Usun wpis"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Zalecenia dot. nawodnienia" icon={Info} className="lg:col-span-1">
          <ul className="space-y-3">
            {HYDRATION_TIPS.map((tip, i) => (
              <li key={i} className="flex items-start gap-2 text-sm text-slate-600 dark:text-slate-300">
                <span className="w-1.5 h-1.5 rounded-full bg-sky-500 mt-1.5 shrink-0" />
                {tip}
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  )
}
