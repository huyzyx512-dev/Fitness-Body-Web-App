import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { workoutService } from '../../services/modules/workoutService.js';
import Loader from '../../components/common/Loader.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const quickLinks = [
  { to: '/workouts', label: 'Buổi tập', icon: '💪', color: 'bg-emerald-500' },
  { to: '/exercises', label: 'Bài tập', icon: '📋', color: 'bg-blue-500' },
  { to: '/bmi', label: 'BMI', icon: '📊', color: 'bg-amber-500' },
  { to: '/food', label: 'Ăn uống', icon: '🥗', color: 'bg-rose-500' },
  { to: '/ai-assistant', label: 'AI Trợ lý', icon: '🤖', color: 'bg-violet-500' },
  { to: '/workout-logs', label: 'Lịch sử', icon: '📅', color: 'bg-slate-600' },
];

const Dashboard = () => {
  const { user } = useAuth();
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await workoutService.getAll();
        setWorkouts(res.workouts || []);
      } catch {
        setWorkouts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const planned = workouts.filter((w) => w.status === 'planned').length;
  const completed = workouts.filter((w) => w.status === 'completed').length;
  const inProgress = workouts.filter((w) => w.status === 'in_progress').length;

  return (
    <PageLayout title={`Xin chào, ${user?.name || 'Bạn'}!`}>
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader />
        </div>
      ) : (
        <div className="space-y-8">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="card card-body">
              <p className="text-sm font-medium text-slate-500">Tổng buổi tập</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{workouts.length}</p>
            </div>
            <div className="card card-body">
              <p className="text-sm font-medium text-slate-500">Đã lên lịch</p>
              <p className="text-2xl font-bold text-emerald-600 mt-1">{planned}</p>
            </div>
            <div className="card card-body">
              <p className="text-sm font-medium text-slate-500">Đang tập</p>
              <p className="text-2xl font-bold text-blue-600 mt-1">{inProgress}</p>
            </div>
            <div className="card card-body">
              <p className="text-sm font-medium text-slate-500">Hoàn thành</p>
              <p className="text-2xl font-bold text-amber-600 mt-1">{completed}</p>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Truy cập nhanh</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              {quickLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className="card card-body flex flex-col items-center justify-center text-center hover:shadow-md hover:border-emerald-200 transition-all min-h-[100px]"
                >
                  <span className="text-2xl mb-2">{link.icon}</span>
                  <span className="font-medium text-slate-800 text-sm">{link.label}</span>
                </Link>
              ))}
            </div>
          </div>

          {/* Recent workouts */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-slate-900">Buổi tập gần đây</h2>
              <Link to="/workouts" className="text-sm font-medium text-emerald-600 hover:text-emerald-700">
                Xem tất cả →
              </Link>
            </div>
            {workouts.length === 0 ? (
              <div className="card card-body text-center py-12 text-slate-500">
                Chưa có buổi tập. <Link to="/workouts" className="text-emerald-600 font-medium">Tạo buổi tập mới</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {workouts.slice(0, 5).map((w) => (
                  <Link
                    key={w.id}
                    to="/workouts"
                    className="card card-body flex flex-row items-center justify-between hover:bg-slate-50/80 transition-colors"
                  >
                    <div>
                      <p className="font-medium text-slate-900">{w.title}</p>
                      <p className="text-sm text-slate-500">
                        {w.scheduled_at && new Date(w.scheduled_at).toLocaleDateString('vi-VN')} ·{' '}
                        {w.status === 'completed' ? 'Hoàn thành' : w.status === 'in_progress' ? 'Đang tập' : 'Đã lên lịch'}
                      </p>
                    </div>
                    <span className="text-slate-400">→</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </PageLayout>
  );
};

export default Dashboard;
