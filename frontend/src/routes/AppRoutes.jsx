import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import Login from '../pages/auth/Login.jsx';
import Register from '../pages/auth/Register.jsx';
import Home from '../pages/home/Home.jsx';
import Dashboard from '../pages/dashboard/Dashboard.jsx';
import Workouts from '../pages/dashboard/Workouts.jsx';
import WorkoutDetail from '../pages/dashboard/WorkoutDetail.jsx';
import WorkoutLogs from '../pages/dashboard/WorkoutLogs.jsx';
import Exercises from '../pages/dashboard/Exercises.jsx';
import Profile from '../pages/dashboard/Profile.jsx';
import BMICalculator from '../pages/tools/BMICalculator.jsx';
import AIAssistant from '../pages/tools/AIAssistant.jsx';
import FoodTracker from '../pages/tools/FoodTracker.jsx';
import NotFound from '../pages/not-found/NotFound.jsx';
import Loader from '../components/common/Loader.jsx';
import TestDashboard from '../pages/dashboard/TestDashboard.jsx';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }
  return !isAuthenticated ? children : <Navigate to="/dashboard" replace />;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
      <Route path="/testdashboard" element={<ProtectedRoute><TestDashboard /></ProtectedRoute>} />
        <Route path="/workouts" element={<ProtectedRoute><Workouts /></ProtectedRoute>} />
        <Route path="/workouts/:id" element={<ProtectedRoute><WorkoutDetail /></ProtectedRoute>} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/workout-logs" element={<ProtectedRoute><WorkoutLogs /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

        <Route path="/bmi" element={<BMICalculator />} />
        <Route path="/ai-assistant" element={<ProtectedRoute><AIAssistant /></ProtectedRoute>} />
        <Route path="/food" element={<ProtectedRoute><FoodTracker /></ProtectedRoute>} />

        <Route path="*" element={<NotFound />} />
      </Routes>
  );
};

      export default AppRoutes;
