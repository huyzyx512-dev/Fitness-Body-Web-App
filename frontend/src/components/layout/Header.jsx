import { Link, useNavigate } from "react-router-dom"
import Button from "../common/Button"

const Header = () => {
    const user = []
    const userProfile = {
        displayName: "Huy Nguyen"
    }
    const navigate = useNavigate()

    const handleLogout = async () => {
        await logout();
        navigate('/login');
        setMobileOpen(false);
      };
    
    
      const linkClass = (to) =>
        `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
          location.pathname === to
            ? 'bg-emerald-100 text-emerald-800'
            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
        }`;

    return (
        <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-16">
                    {/* Logo/Brand */}
                    <Link to={"/"} className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center">
                            <span className="text-white font-bold text-sm">FB</span>
                        </div>
                        <span className="text-xl font-bold text-gray-900">Fitness Body</span>
                    </Link>

                    {/* Navigation */}
                    <nav className="hidden md:flex space-x-8">
                        {user ? (
                            <>
                                <Link
                                    to="/dashboard"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    to="/testdashboard"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    TestDashboard
                                </Link>
                                <Link
                                    to="/bmi"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    BMI Calculator
                                </Link>
                                <Link
                                    to="/ai-assistant"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    🤖 AI Assistant
                                </Link>
                                <Link
                                    to="/food"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Food Tracker
                                </Link>
                                <Link
                                    to="/workouts"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Workout Tracker
                                </Link>
                                <Link
                                    to="/progress"
                                    className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                                >
                                    Progress
                                </Link>
                            </>
                        ) : (
                            <Link
                                to="/"
                                className="text-gray-700 hover:text-primary-600 px-3 py-2 text-sm font-medium transition-colors"
                            >
                                Home
                            </Link>
                        )}
                    </nav>

                    {/* User section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center space-x-3">
                                {/* User info */}
                                <div className="hidden sm:block text-right">
                                    <div className="text-sm font-medium text-gray-900">
                                        {userProfile?.displayName || userProfile?.firstName
                                            ? `${userProfile.firstName || ''} ${userProfile.lastName || ''}`.trim() || userProfile.displayName
                                            : user?.email}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {user?.email}
                                    </div>
                                </div>

                                {/* Logout button */}
                                <Button
                                    variant="secondary"
                                    size="sm"
                                    onClick={handleLogout}
                                    className="text-sm"
                                >
                                    Logout
                                </Button>
                            </div>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <Link to="/login">
                                    <Button variant="secondary" size="sm">
                                        Login
                                    </Button>
                                </Link>
                                <Link to="/signup">
                                    <Button variant="primary" size="sm">
                                        Sign Up
                                    </Button>
                                </Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile menu button - could be expanded later */}
                    <div className="md:hidden">
                        <button className="text-gray-500 hover:text-gray-700">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default Header