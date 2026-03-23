import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../common/Button.jsx';

const navLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/dashboard', label: 'Dashboard', auth: true },
  { to: '/workouts', label: 'Buổi tập', auth: true },
  { to: '/exercises', label: 'Bài tập' },
  { to: '/bmi', label: 'BMI' },
  { to: '/food', label: 'Ăn uống', auth: true },
  { to: '/ai-assistant', label: 'AI Trợ lý', auth: true },
  { to: '/workout-logs', label: 'Lịch sử', auth: true },
  { to: '/profile', label: 'Cá nhân', auth: true },
];

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
    setMobileOpen(false);
  };

  const visibleLinks = navLinks.filter((l) => !l.auth || isAuthenticated);

  const linkClass = (to) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      location.pathname === to
        ? 'bg-emerald-100 text-emerald-800'
        : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
    }`;

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-xl font-bold text-emerald-600">FitnessBody</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center gap-1">
            {visibleLinks.map((l) => (
              <Link key={l.to} to={l.to} className={linkClass(l.to)}>
                {l.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <div className="ml-4 flex items-center gap-3 border-l border-slate-200 pl-4">
                <span className="text-sm text-slate-600">Hi, {user?.name}</span>
                <Button variant="outline" size="sm" onClick={handleLogout}>
                  Đăng xuất
                </Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center gap-2">
                <Link to="/login">
                  <Button variant="outline" size="sm">Đăng nhập</Button>
                </Link>
                <Link to="/register">
                  <Button size="sm">Đăng ký</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center gap-2">
            {isAuthenticated && <span className="text-sm text-slate-600 truncate max-w-[100px]">{user?.name}</span>}
            <button
              type="button"
              onClick={() => setMobileOpen((o) => !o)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100"
              aria-label="Menu"
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

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1">
          {visibleLinks.map((l) => (
            <Link key={l.to} to={l.to} className={linkClass(l.to)} onClick={() => setMobileOpen(false)}>
              {l.label}
            </Link>
          ))}
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              Đăng xuất
            </button>
          ) : (
            <div className="flex gap-2 pt-2">
              <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button variant="outline" size="sm" className="w-full">Đăng nhập</Button>
              </Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1">
                <Button size="sm" className="w-full">Đăng ký</Button>
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
