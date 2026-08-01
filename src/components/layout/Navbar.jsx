import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Salad, LogOut, Menu, X, User, Settings, ChevronDown, Users } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useProfile } from '../../hooks/useProfile'
import { useUserCount, osobyLabel } from '../../hooks/useUserCount'
import { ConsentBadge } from './ConsentBadge'

export const Navbar = ({ onToggleSidebar, sidebarOpen }) => {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const { profile } = useProfile()
  const userCount = useUserCount()
  const [menuOpen, setMenuOpen] = useState(false)

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  const displayName = profile?.first_name
    ? `${profile.first_name}${profile.last_name ? ' ' + profile.last_name : ''}`
    : user?.email

  const avatarLetter = profile?.first_name
    ? profile.first_name[0].toUpperCase()
    : (user?.email?.[0]?.toUpperCase() || 'U')

  return (
    <header className="sticky top-0 z-30 bg-white dark:bg-dark-card border-b border-slate-200 dark:border-dark-border">
      <div className="px-4 lg:px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800"
            aria-label="Toggle sidebar"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>

          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-brand-600 text-white flex items-center justify-center">
              <Salad size={20} />
            </div>
            <span className="font-bold text-lg hidden sm:inline">FitPlan</span>
          </Link>

          {userCount !== null && userCount > 0 && (
            <div
              title="Liczba zarejestrowanych użytkowników FitPlan"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 dark:bg-brand-900/20 text-brand-700 dark:text-brand-400 text-xs sm:text-sm font-semibold"
            >
              <Users size={14} />
              <span>
                <span className="font-bold">{userCount}</span>
                <span className="hidden sm:inline"> zarejestrowanych</span>
                <span className="sm:hidden"> {osobyLabel(userCount)}</span>
              </span>
            </div>
          )}

          <ConsentBadge />
        </div>

        <div className="relative">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
          >
            <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center font-semibold text-sm">
              {avatarLetter}
            </div>
            <span className="hidden sm:inline text-sm font-medium max-w-[150px] truncate">
              {displayName}
            </span>
            <ChevronDown size={14} className={`hidden sm:block opacity-50 transition-transform duration-200 ${menuOpen ? 'rotate-180' : ''}`} />
          </button>

          {menuOpen && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setMenuOpen(false)} />
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-dark-card border border-slate-200 dark:border-dark-border rounded-xl shadow-lg z-50 overflow-hidden animate-fade-in">
                <div className="p-3 border-b border-slate-200 dark:border-dark-border">
                  <p className="text-sm font-semibold truncate">{displayName}</p>
                  <p className="text-xs text-slate-500 truncate">{user?.email}</p>
                </div>
                <Link
                  to="/profile"
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-3 py-2 text-sm hover:bg-slate-50 dark:hover:bg-slate-800 flex items-center gap-2"
                >
                  <Settings size={16} /> Ustawienia profilu
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                >
                  <LogOut size={16} /> Wyloguj
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
