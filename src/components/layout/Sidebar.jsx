import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Calculator, Brain, BookOpen, Salad, X } from 'lucide-react'

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/meals', label: 'Posilki', icon: UtensilsCrossed },
  { to: '/diets', label: 'Diety', icon: Salad },
  { to: '/tdee', label: 'Kalkulator TDEE', icon: Calculator },
  { to: '/quiz', label: 'Quizy EBM', icon: Brain },
  { to: '/blog', label: 'Blog', icon: BookOpen },
]

export const Sidebar = ({ open, onClose }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border z-40 transition-transform ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors ${
                  isActive
                    ? 'bg-brand-100 dark:bg-brand-900/30 text-brand-700 dark:text-brand-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`
              }
            >
              <Icon size={18} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-4 left-4 right-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
          <p className="font-semibold mb-1">Projekt edukacyjny</p>
          <p>Aplikacja stworzona w ramach pracy dla Uniwersytetu VIZJA.</p>
        </div>
      </aside>
    </>
  )
}
