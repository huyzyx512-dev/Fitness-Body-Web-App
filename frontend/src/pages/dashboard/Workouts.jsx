import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import { workoutService } from '../../services/modules/workoutService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';
import DatePicker from '../../components/common/DatePicker.jsx';

const getStatusColor = (status) => {
  switch (status) {
    case 'completed':
      return 'bg-emerald-100 text-emerald-800';
    case 'in_progress':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-slate-100 text-slate-700';
  }
};

const getStatusLabel = (status) => {
  if (status === 'completed') return 'Hoàn thành';
  if (status === 'in_progress') return 'Đang tập';
  return 'Đã lên lịch';
};

const isSameDay = (dateA, dateB) =>
  dateA.getFullYear() === dateB.getFullYear() &&
  dateA.getMonth() === dateB.getMonth() &&
  dateA.getDate() === dateB.getDate();

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    scheduled_at: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const workoutsRes = await workoutService.getAll();
      setWorkouts(workoutsRes.workouts || []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải dữ liệu';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateWorkout = async (e) => {
    e.preventDefault();
    try {
      await workoutService.create(formData);
      setShowCreateModal(false);
      setFormData({ title: '', notes: '', scheduled_at: '' });
      await loadData();
      showToast('Đã tạo buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tạo buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (!window.confirm('Bạn có chắc muốn xóa buổi tập này?')) return;

    try {
      await workoutService.delete(id);
      await loadData();
      showToast('Đã xóa buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể xóa buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const filteredWorkouts = useMemo(
    () =>
      workouts.filter((workout) => {
        if (!workout.scheduled_at) return false;
        const workoutDate = new Date(workout.scheduled_at);
        if (Number.isNaN(workoutDate.getTime())) return false;
        return isSameDay(workoutDate, selectedDate);
      }),
    [workouts, selectedDate]
  );

  const stats = useMemo(() => {
    const planned = workouts.filter((w) => w.status === 'planned').length;
    const inProgress = workouts.filter((w) => w.status === 'in_progress').length;
    const completed = workouts.filter((w) => w.status === 'completed').length;

    return {
      total: workouts.length,
      planned,
      inProgress,
      completed,
    };
  }, [workouts]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <PageLayout
      title="Trình theo dõi tập luyện"
      actions={<Button onClick={() => setShowCreateModal(true)}>Tạo buổi tập</Button>}
    >
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="card card-body">
          <p className="text-sm font-medium text-slate-500">Tổng buổi tập</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{stats.total}</p>
        </div>
        <div className="card card-body">
          <p className="text-sm font-medium text-slate-500">Đã lên lịch</p>
          <p className="text-2xl font-bold text-emerald-600 mt-1">{stats.planned}</p>
        </div>
        <div className="card card-body">
          <p className="text-sm font-medium text-slate-500">Đang tập</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{stats.inProgress}</p>
        </div>
        <div className="card card-body">
          <p className="text-sm font-medium text-slate-500">Hoàn thành</p>
          <p className="text-2xl font-bold text-amber-600 mt-1">{stats.completed}</p>
        </div>
      </div>

      <div className="mt-6 max-w-xs">
        <label className="block text-sm font-medium text-gray-700 mb-2">Chọn ngày</label>
        <DatePicker selectedDate={selectedDate} onDateChange={setSelectedDate} />
      </div>

      <div className="mt-6 space-y-4">
        {filteredWorkouts.map((workout) => (
          <div key={workout.id} className="card card-body flex justify-between items-start gap-4">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">{workout.title}</h3>
              <span className="text-sm text-slate-500">
                {workout.scheduled_at
                  ? new Date(workout.scheduled_at).toLocaleDateString('vi-VN')
                  : 'Chưa có lịch'}
              </span>
              <p className="text-slate-600 text-sm mt-2">{workout.notes || 'Chưa có ghi chú cho buổi tập này.'}</p>
            </div>
            
            {/* //TODO: Hiển thị thêm phần calo đã đốt và các thông tin cần thiết khác */}
            <div className="flex flex-col items-end gap-2">
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(workout.status)}`}>
                {getStatusLabel(workout.status)}
              </span>
              <div className="flex flex-col  gap-2">
                <Link to={`/workouts/${workout.id}`}>
                  <Button size="sm">Chi tiết</Button>
                </Link>
                {workout.status !== 'in_progress' && (
                  <Button size="sm" variant="danger" onClick={() => handleDeleteWorkout(workout.id)}>
                    Xóa
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="card card-body text-center py-12 text-slate-500 mt-6">
          Chưa có buổi tập nào. Tạo buổi tập mới để bắt đầu!
        </div>
      )}

      {workouts.length > 0 && filteredWorkouts.length === 0 && (
        <div className="card card-body text-center py-10 text-slate-500 mt-6">
          Không có buổi tập trong ngày đã chọn.
        </div>
      )}

      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo Buổi Tập Mới"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreateWorkout}>Tạo</Button>
          </>
        }
      >
        <form onSubmit={handleCreateWorkout} className="space-y-4">
          <Input
            label="Tiêu đề"
            name="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
          <Input
            label="Ghi chú"
            name="notes"
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            required
          />
          <Input
            label="Ngày lên lịch"
            type="datetime-local"
            name="scheduled_at"
            value={formData.scheduled_at}
            onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
            required
          />
        </form>
      </Modal>
    </PageLayout>
  );
};

export default Workouts;
