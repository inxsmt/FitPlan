import { useMemo, useState } from 'react'
import { Scale, TrendingUp, TrendingDown, Minus, Trash2, Ruler } from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { useWeightLogs } from '../../hooks/useWeightLogs'
import { useProfile } from '../../hooks/useProfile'
import { Card } from '../ui/Card'
import { Button } from '../ui/Button'
import { calculateWeightTrend, calculateWHR, whrRiskCategory } from '../../utils/calculations'

const TREND_META = {
  up: { icon: TrendingUp, color: 'text-amber-500', label: 'Tendencja wzrostowa' },
  down: { icon: TrendingDown, color: 'text-sky-500', label: 'Tendencja spadkowa' },
  stable: { icon: Minus, color: 'text-slate-400', label: 'Waga stabilna' },
}

export const WeightTracker = () => {
  const { weightLogs, loading, addWeightLog, deleteWeightLog } = useWeightLogs()
  const { profile, updateProfile } = useProfile()
  const [weightInput, setWeightInput] = useState('')
  const [waistInput, setWaistInput] = useState('')
  const [hipsInput, setHipsInput] = useState('')
  const [saving, setSaving] = useState(false)

  const sortedLogs = useMemo(
    () => [...weightLogs].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)),
    [weightLogs]
  )

  const hasWaistData = sortedLogs.some((w) => w.waist_cm)

  const chartData = useMemo(
    () => sortedLogs.map((w) => ({
      date: new Date(w.created_at).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit' }),
      waga: Number(w.weight_kg),
      talia: w.waist_cm ? Number(w.waist_cm) : null,
    })),
    [sortedLogs]
  )

  const trend = useMemo(() => calculateWeightTrend(weightLogs), [weightLogs])
  const lastLog = sortedLogs.length > 0 ? sortedLogs[sortedLogs.length - 1] : null
  const currentWeight = lastLog?.weight_kg || profile?.weight || null

  const lastWithMeasurements = [...sortedLogs].reverse().find((w) => w.waist_cm && w.hips_cm)
  const whr = lastWithMeasurements ? calculateWHR(lastWithMeasurements.waist_cm, lastWithMeasurements.hips_cm) : null
  const whrRisk = whr ? whrRiskCategory(whr, profile?.gender) : null

  const handleAdd = async () => {
    const kg = parseFloat(weightInput.replace(',', '.'))
    if (!kg || kg <= 0) return
    const waist = waistInput ? parseFloat(waistInput.replace(',', '.')) : null
    const hips = hipsInput ? parseFloat(hipsInput.replace(',', '.')) : null
    setSaving(true)
    await addWeightLog({ weightKg: kg, waistCm: waist, hipsCm: hips })
    await updateProfile({ weight: kg })
    setWeightInput('')
    setWaistInput('')
    setHipsInput('')
    setSaving(false)
  }

  const { icon: TrendIcon, color: trendColor, label: trendLabel } = TREND_META[trend.direction]

  if (loading) {
    return <div className="text-center py-12 text-slate-500">Ladowanie...</div>
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold mb-1">Waga</h1>
        <p className="text-slate-500 dark:text-slate-400">
          Zapisuj regularne pomiary wagi i obwodow, aby sledzic zmiane sylwetki w czasie
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card title="Dodaj pomiar" icon={Scale} className="lg:col-span-1">
          <div className="flex gap-2">
            <input
              type="number"
              step="0.1"
              min="1"
              value={weightInput}
              onChange={(e) => setWeightInput(e.target.value)}
              placeholder="np. 78.5"
              className="flex-1 px-3 py-2.5 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <span className="flex items-center px-2 text-sm text-slate-400">kg</span>
          </div>

          <p className="text-xs text-slate-500 mt-4 mb-2">Obwody (opcjonalnie)</p>
          <div className="grid grid-cols-2 gap-2">
            <div className="flex gap-1.5">
              <input
                type="number"
                step="0.5"
                min="1"
                value={waistInput}
                onChange={(e) => setWaistInput(e.target.value)}
                placeholder="Talia"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="flex items-center px-1 text-xs text-slate-400">cm</span>
            </div>
            <div className="flex gap-1.5">
              <input
                type="number"
                step="0.5"
                min="1"
                value={hipsInput}
                onChange={(e) => setHipsInput(e.target.value)}
                placeholder="Biodra"
                className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-dark-border bg-white dark:bg-dark-bg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
              <span className="flex items-center px-1 text-xs text-slate-400">cm</span>
            </div>
          </div>

          <Button
            variant="primary"
            className="w-full mt-3"
            disabled={saving || !weightInput}
            onClick={handleAdd}
          >
            {saving ? 'Zapisywanie...' : 'Zapisz pomiar'}
          </Button>

          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-border text-center">
            <p className="text-xs text-slate-500 mb-1">Aktualna waga</p>
            <p className="text-3xl font-bold">{currentWeight ? `${currentWeight} kg` : '–'}</p>

            <div className={`flex items-center justify-center gap-1.5 mt-3 font-semibold ${trendColor}`}>
              <TrendIcon size={18} />
              <span className="text-sm">{trendLabel}</span>
            </div>
            {weightLogs.length >= 2 && (
              <p className="text-xs text-slate-400 mt-1">
                {trend.changeKg > 0 ? '+' : ''}{trend.changeKg}kg lacznie
                {trend.changePerWeek !== null && (
                  <> · {trend.changePerWeek > 0 ? '+' : ''}{trend.changePerWeek}kg/tydz.</>
                )}
              </p>
            )}
          </div>

          {whr && (
            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-dark-border text-center">
              <p className="text-xs text-slate-500 mb-1 flex items-center justify-center gap-1">
                <Ruler size={13} /> Wskaznik WHR (talia/biodra)
              </p>
              <p className="text-3xl font-bold">{whr}</p>
              <p className={`text-sm font-semibold mt-1 ${whrRisk.color}`}>{whrRisk.label}</p>
              <p className="text-xs text-slate-400 mt-1">
                {lastWithMeasurements.waist_cm}cm / {lastWithMeasurements.hips_cm}cm
              </p>
            </div>
          )}
        </Card>

        <Card
          title="Wykres wagi i talii"
          icon={TrendingUp}
          subtitle="Historia pomiarow"
          className="lg:col-span-2"
        >
          {chartData.length < 2 ? (
            <div className="h-64 flex items-center justify-center text-sm text-slate-500 text-center px-6">
              Dodaj co najmniej 2 pomiary, aby zobaczyc wykres tendencji
            </div>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#475569" opacity={0.2} />
                  <XAxis dataKey="date" stroke="#94a3b8" />
                  <YAxis yAxisId="waga" stroke="#22c55e" domain={['dataMin - 1', 'dataMax + 1']} />
                  {hasWaistData && (
                    <YAxis yAxisId="talia" orientation="right" stroke="#0ea5e9" domain={['dataMin - 2', 'dataMax + 2']} />
                  )}
                  <Tooltip
                    contentStyle={{
                      backgroundColor: '#1e293b',
                      border: '1px solid #334155',
                      borderRadius: '12px',
                    }}
                  />
                  <Legend />
                  <Line yAxisId="waga" type="monotone" dataKey="waga" stroke="#22c55e" strokeWidth={2.5} dot={{ r: 3 }} name="Waga (kg)" />
                  {hasWaistData && (
                    <Line yAxisId="talia" type="monotone" dataKey="talia" stroke="#0ea5e9" strokeWidth={2.5} dot={{ r: 3 }} name="Talia (cm)" connectNulls />
                  )}
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </Card>
      </div>

      <Card title={`Historia pomiarow (${weightLogs.length})`}>
        {weightLogs.length === 0 ? (
          <p className="text-sm text-slate-500 text-center py-6">Brak wpisow - dodaj pierwszy pomiar!</p>
        ) : (
          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {weightLogs.map((w) => (
              <li
                key={w.id}
                className="flex items-center justify-between px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800/50"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-2">
                    <Scale size={16} className="text-brand-600" />
                    <span className="font-medium text-sm">{w.weight_kg} kg</span>
                  </div>
                  {(w.waist_cm || w.hips_cm) && (
                    <span className="text-xs text-slate-400">
                      {w.waist_cm && `talia ${w.waist_cm}cm`}
                      {w.waist_cm && w.hips_cm && ' · '}
                      {w.hips_cm && `biodra ${w.hips_cm}cm`}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-slate-400">
                    {new Date(w.created_at).toLocaleDateString('pl-PL', { day: '2-digit', month: '2-digit', year: 'numeric' })}
                  </span>
                  <button
                    onClick={() => deleteWeightLog(w.id)}
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
    </div>
  )
}
