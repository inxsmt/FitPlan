export const Card = ({ children, className = '', title, subtitle, icon: Icon }) => {
  return (
    <div className={`bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-2xl p-6 shadow-sm transition-all hover:shadow-md ${className}`}>
      {(title || Icon) && (
        <div className="flex items-center gap-3 mb-4">
          {Icon && (
            <div className="p-2 rounded-xl bg-brand-100 dark:bg-brand-900/30 text-brand-600 dark:text-brand-500">
              <Icon size={20} />
            </div>
          )}
          <div>
            {title && <h3 className="font-semibold text-lg">{title}</h3>}
            {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
          </div>
        </div>
      )}
      {children}
    </div>
  )
}
