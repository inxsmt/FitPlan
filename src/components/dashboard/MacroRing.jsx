export const MacroRing = ({ current = 0, target = 100, label, unit = 'g', color = '#22c55e' }) => {
  const safeTarget = target > 0 ? target : 1
  const percentage = Math.min((current / safeTarget) * 100, 100)
  const radius = 56
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percentage / 100) * circumference

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-32 h-32">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 128 128">
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth="10"
            className="text-slate-200 dark:text-slate-700"
          />
          <circle
            cx="64"
            cy="64"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth="10"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className="transition-all duration-700 ease-out"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-2xl font-bold">{Math.round(current)}</span>
          <span className="text-xs text-slate-500">/ {target}{unit}</span>
        </div>
      </div>
      <p className="mt-2 font-medium text-sm">{label}</p>
      <p className="text-xs text-slate-500">{Math.round(percentage)}%</p>
    </div>
  )
}
