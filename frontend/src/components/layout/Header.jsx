import { useEffect, useMemo, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import Button from '../common/Button.jsx'
import { useAuth } from '../../context/AuthContext.jsx'

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', auth: true },
  { to: '/testdashboard', label: 'TestDashboard', auth: true },
  { to: '/bmi', label: 'BMI Calculator', auth: false },
  { to: '/ai-assistant', label: '🤖 AI Assistant', auth: true },
  { to: '/food', label: 'Food Tracker', auth: true },
  { to: '/workouts', label: 'Workout Tracker', auth: true },
  { to: '/progress', label: 'Progress', auth: true },
  { to: '/profile', label: 'Cá nhân', auth: true },
]

export default function Header() {
  const { isAuthenticated, user, logout, loading: authLoading } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [mobileOpen, setMobileOpen] = useState(false)

  // Close mobile menu when navigation changes
  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const visibleLinks = useMemo(
    () => navLinks.filter((l) => !l.auth || isAuthenticated),
    [isAuthenticated]
  )

  const linkClass = (to) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === to
        ? 'bg-emerald-100 text-emerald-800'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`

  const handleLogout = async () => {
    await logout()
    navigate('/login')
    setMobileOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">FB</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Fitness Body</span>
          </Link>

          {/* Desktop navigation */}
          <nav className="hidden md:flex items-center gap-1">
            {visibleLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                {l.label}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="ml-4 flex items-center gap-3 border-l border-slate-200 pl-4">
                <div className="text-right leading-tight">
                  <div className="text-sm font-medium text-gray-900 truncate max-w-[160px]">
                    {user?.name || 'Người dùng'}
                  </div>
                  <div className="text-xs text-gray-500 truncate max-w-[160px]">
                    {user?.email}
                  </div>
                </div>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              !authLoading && (
                <div className="ml-4 flex items-center gap-2">
                  <Link to="/login">
                    <Button variant="secondary" size="sm">
                      Đăng nhập
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button size="sm">Đăng ký</Button>
                  </Link>
                </div>
              )
            )}
          </nav>

          {/* Mobile */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && (
              <span className="text-sm text-slate-600 truncate max-w-[110px]">
                {user?.name}
              </span>
            )}
            <button
              type="button"
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Mở menu"
              onClick={() => setMobileOpen((o) => !o)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3">
          <div className="space-y-1">
            {visibleLinks.map((l) => (
              <Link
                key={l.to}
                to={l.to}
                className={linkClass(l.to)}
                onClick={() => setMobileOpen(false)}
              >
                {l.label}
              </Link>
            ))}
          </div>

          {isAuthenticated ? (
            <div className="mt-3">
              <button
                type="button"
                onClick={handleLogout}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
              >
                Đăng xuất
              </button>
            </div>
          ) : (
            !authLoading && (
              <div className="mt-3 flex gap-2">
                <Link to="/login" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" size="sm" className="w-full">
                    Đăng nhập
                  </Button>
                </Link>
                <Link to="/register" className="flex-1" onClick={() => setMobileOpen(false)}>
                  <Button size="sm" className="w-full">
                    Đăng ký
                  </Button>
                </Link>
              </div>
            )
          )}
        </div>
      )}
    </header>
  )
}
