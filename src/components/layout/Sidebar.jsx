import { NavLink } from 'react-router-dom'
import { LayoutDashboard, UtensilsCrossed, Calculator, Brain, BookOpen, Salad, Droplet, Scale, HeartPulse, ChefHat, Pill, User, Star, X, MessageSquarePlus } from 'lucide-react'

const navItems = [
  { to: '/tdee', label: 'Kalkulator TDEE', icon: Calculator },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/meals', label: 'Posiłki', icon: UtensilsCrossed },
  { to: '/recipes', label: 'Przepisy', icon: ChefHat },
  { to: '/diets', label: 'Diety', icon: Salad },
  { to: '/micronutrients', label: 'Mikroskładniki', icon: Pill },
  { to: '/water', label: 'Woda', icon: Droplet },
  { to: '/weight', label: 'Waga', icon: Scale },
  { to: '/wellbeing', label: 'Samopoczucie', icon: HeartPulse },
  { to: '/quiz', label: 'Quizy EBM', icon: Brain },
  { to: '/blog', label: 'Blog', icon: BookOpen },
  { to: '/reviews', label: 'Oceń aplikację', icon: Star },
  { to: '/about', label: 'O autorze', icon: User },
]

export const Sidebar = ({ open, onClose, onOpenFeedback }) => {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white dark:bg-dark-card border-r border-slate-200 dark:border-dark-border z-40 transition-transform flex flex-col ${
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex items-center justify-between p-4 lg:hidden shrink-0">
          <span className="font-semibold">Menu</span>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
            <X size={18} />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
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
              <Icon size={18} className="shrink-0" />
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Poza lista stron - to nie jest osobna podstrona, tylko okno
            wywolywane z dowolnego miejsca aplikacji. */}
        <div className="shrink-0 px-4 pb-3">
          <button
            onClick={() => {
              onClose()
              onOpenFeedback()
            }}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl border border-dashed border-slate-300 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-brand-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors"
          >
            <MessageSquarePlus size={18} className="shrink-0" />
            <span className="text-sm font-medium">Zgłoś błąd lub pomysł</span>
          </button>
        </div>

        <div className="shrink-0 m-4 mt-0 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs text-slate-500">
          <p className="font-semibold mb-1">Projekt edukacyjny</p>
          <p>Aplikacja stworzona w ramach pracy dla Uniwersytetu VIZJA.</p>
          <p className="mt-1.5 pt-1.5 border-t border-slate-200 dark:border-slate-700">
            Marcel Tryniszewski · 55074
          </p>
        </div>
      </aside>
    </>
  )
}
