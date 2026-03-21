import { useState, useEffect } from 'react';
import { workoutService } from '../../services/modules/workoutService.js';
import { exerciseService } from '../../services/modules/exerciseService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const Workouts = () => {
  const [workouts, setWorkouts] = useState([]);
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [selectedWorkout, setSelectedWorkout] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    notes: '',
    scheduled_at: '',
  });
  const [exerciseFormData, setExerciseFormData] = useState({
    sets: '',
    reps: '',
    weight: '',
    comment: '',
  });
  const { showToast } = useToast();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');
      const [workoutsRes, exercisesRes] = await Promise.all([
        workoutService.getAll(),
        exerciseService.getAll(),
      ]);
      setWorkouts(workoutsRes.workouts || []);
      setExercises(exercisesRes || []);
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
      setError('');
      loadData();
      showToast('Đã tạo buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tạo buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      await workoutService.addExercise(
        selectedWorkout.id,
        exerciseFormData.exerciseId,
        {
          sets: parseInt(exerciseFormData.sets),
          reps: parseInt(exerciseFormData.reps),
          weight: parseFloat(exerciseFormData.weight),
          comment: exerciseFormData.comment,
        }
      );
      setShowAddExerciseModal(false);
      setExerciseFormData({ sets: '', reps: '', weight: '', comment: '', exerciseId: '' });
      setError('');
      loadData();
      showToast('Đã thêm bài tập vào buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thêm bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleStartWorkout = async (id) => {
    try {
      await workoutService.start(id);
      setError('');
      loadData();
      showToast('Đã bắt đầu buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể bắt đầu buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleCompleteWorkout = async (id) => {
    try {
      await workoutService.complete(id, { comment: '' });
      setError('');
      loadData();
      showToast('Đã hoàn thành buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể hoàn thành buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDeleteWorkout = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa buổi tập này?')) {
      try {
        await workoutService.delete(id);
        setError('');
        loadData();
        showToast('Đã xóa buổi tập.');
      } catch (err) {
        const msg = err.response?.data?.message || 'Không thể xóa buổi tập';
        setError(msg);
        showToast(msg, 'error');
      }
    }
  };

  const handleRemoveExercise = async (workoutId, workoutExerciseId) => {
    try {
      await workoutService.removeExercise(workoutId, workoutExerciseId);
      setError('');
      loadData();
      showToast('Đã xóa bài tập khỏi buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể xóa bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

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

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <PageLayout
      title="Buổi tập"
      actions={<Button onClick={() => setShowCreateModal(true)}>Tạo buổi tập</Button>}
    >
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {workouts.map((workout) => (
          <div key={workout.id} className="card card-body">
            <div className="flex justify-between items-start mb-3">
              <h3 className="text-lg font-semibold text-slate-900">{workout.title}</h3>
              <span className={`px-2.5 py-1 rounded-lg text-xs font-medium ${getStatusColor(workout.status)}`}>
                {workout.status === 'completed' ? 'Hoàn thành' : workout.status === 'in_progress' ? 'Đang tập' : 'Đã lên lịch'}
              </span>
            </div>
            <p className="text-slate-600 text-sm mb-2">{workout.notes}</p>
            <p className="text-xs text-slate-500 mb-4">{workout.scheduled_at && new Date(workout.scheduled_at).toLocaleDateString('vi-VN')}</p>

            {workout.exercises && workout.exercises.length > 0 && (
              <div className="mb-4">
                <h4 className="text-sm font-medium text-slate-700 mb-2">Bài tập</h4>
                <ul className="space-y-1.5">
                  {workout.exercises.map((we) => (
                    <li key={we.id} className="flex justify-between items-center text-sm text-slate-600">
                      <span>{we.exercise?.name} – {we.sets}x{we.reps} @ {we.weight}kg</span>
                      {workout.status !== 'completed' && (
                        <button type="button" onClick={() => handleRemoveExercise(workout.id, we.id)} className="text-rose-600 hover:text-rose-700">
                          ×
                        </button>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="flex gap-2 flex-wrap pt-2 border-t border-slate-100">
              {workout.status === 'planned' && (
                <>
                  <Button size="sm" variant="primary" onClick={() => { setSelectedWorkout(workout); setShowAddExerciseModal(true); }}>
                    Thêm bài tập
                  </Button>
                  <Button size="sm" variant="success" onClick={() => handleStartWorkout(workout.id)}>Bắt đầu</Button>
                </>
              )}
              {workout.status === 'in_progress' && (
                <Button size="sm" variant="success" onClick={() => handleCompleteWorkout(workout.id)}>Hoàn thành</Button>
              )}
              {workout.status !== 'in_progress' && (
                <Button size="sm" variant="danger" onClick={() => handleDeleteWorkout(workout.id)}>Xóa</Button>
              )}
            </div>
          </div>
        ))}
      </div>

      {workouts.length === 0 && (
        <div className="card card-body text-center py-12 text-slate-500">
          Chưa có buổi tập nào. Tạo buổi tập mới để bắt đầu!
        </div>
      )}

      {/* Create Workout Modal */}
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

      {/* Add Exercise Modal */}
      <Modal
        isOpen={showAddExerciseModal}
        onClose={() => setShowAddExerciseModal(false)}
        title="Thêm Bài Tập"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowAddExerciseModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleAddExercise}>Thêm</Button>
          </>
        }
      >
        <form onSubmit={handleAddExercise} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bài tập <span className="text-rose-500">*</span>
            </label>
            <select
              value={exerciseFormData.exerciseId}
              onChange={(e) => setExerciseFormData({ ...exerciseFormData, exerciseId: e.target.value })}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              required
            >
              <option value="">Chọn bài tập</option>
              {exercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
          </div>
          <Input
            label="Số hiệp"
            type="number"
            name="sets"
            value={exerciseFormData.sets}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, sets: e.target.value })}
            required
          />
          <Input
            label="Số lần lặp"
            type="number"
            name="reps"
            value={exerciseFormData.reps}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, reps: e.target.value })}
            required
          />
          <Input
            label="Trọng lượng (kg)"
            type="number"
            step="0.1"
            name="weight"
            value={exerciseFormData.weight}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, weight: e.target.value })}
          />
          <Input
            label="Ghi chú"
            name="comment"
            value={exerciseFormData.comment}
            onChange={(e) => setExerciseFormData({ ...exerciseFormData, comment: e.target.value })}
          />
        </form>
      </Modal>
    </PageLayout>
  );
};

export default Workouts;
