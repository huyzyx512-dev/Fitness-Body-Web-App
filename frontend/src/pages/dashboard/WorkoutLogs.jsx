import { useState, useEffect } from 'react';
import { workoutLogService } from '../../services/modules/workoutLogService.js';
import Loader from '../../components/common/Loader.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

/**
 * Workout history – use API GET/POST /workout-logs when the backend is implemented.
 * Now displays empty state or list if API returns data.
 */
const WorkoutLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { showToast } = useToast();

  useEffect(() => {
    loadLogs();
  }, []);

  const loadLogs = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await workoutLogService.getList();
      setLogs(Array.isArray(data) ? data : data?.logs ?? []);
    } catch (err) {
      // The backend has not been implemented yet but still displays empty state, does not block the page
      setLogs([]);
      setError('');
      const msg = err.response?.data?.message || 'Chưa thể tải lịch sử tập.';
      showToast(msg, 'info');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <PageLayout title="Lịch sử tập">
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      {logs.length === 0 && (
        <div className="card card-body text-center py-16">
          <p className="text-slate-600 mb-2">Chưa có lịch sử buổi tập.</p>
          <p className="text-sm text-slate-500">
            Các buổi tập đã hoàn thành sẽ hiển thị tại đây khi backend hỗ trợ API lịch sử.
          </p>
        </div>
      )}

      {logs.length > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {logs.map((log) => (
            <div key={log.id} className="card card-body">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-slate-900">{log.workout?.title ?? log.title ?? 'Buổi tập'}</h3>
                {log.completed_at && (
                  <span className="text-xs text-slate-500">{new Date(log.completed_at).toLocaleDateString('vi-VN')}</span>
                )}
              </div>
              {log.duration_minutes != null && (
                <p className="text-sm text-slate-600 mt-2">Thời gian: {log.duration_minutes} phút</p>
              )}
            </div>
          ))}
        </div>
      )}
    </PageLayout>
  );
};

export default WorkoutLogs;
