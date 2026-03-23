import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useToast } from '../../context/ToastContext.jsx';
import { workoutService } from '../../services/modules/workoutService.js';
import { exerciseService } from '../../services/modules/exerciseService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const formatDateTimeInput = (dateValue) => {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  if (Number.isNaN(date.getTime())) return '';
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, '0');
  const day = `${date.getDate()}`.padStart(2, '0');
  const hour = `${date.getHours()}`.padStart(2, '0');
  const minute = `${date.getMinutes()}`.padStart(2, '0');
  return `${year}-${month}-${day}T${hour}:${minute}`;
};

const WorkoutDetail = () => {
  const { id } = useParams();
  const { showToast } = useToast();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [workout, setWorkout] = useState(null);
  const [allExercises, setAllExercises] = useState([]);
  const [showAddExerciseModal, setShowAddExerciseModal] = useState(false);
  const [exerciseFormData, setExerciseFormData] = useState({
    exerciseId: '',
    sets: '',
    reps: '',
    weight: '',
    comment: '',
  });
  const [workoutFormData, setWorkoutFormData] = useState({
    title: '',
    notes: '',
    scheduled_at: '',
  });

  useEffect(() => {
    loadData();
  }, [id]);

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [workoutsRes, exercisesRes] = await Promise.all([
        workoutService.getAll(),
        exerciseService.getAll(),
      ]);

      const foundWorkout = (workoutsRes.workouts || []).find((item) => `${item.id}` === `${id}`);
      setWorkout(foundWorkout || null);
      setAllExercises(exercisesRes || []);

      if (foundWorkout) {
        setWorkoutFormData({
          title: foundWorkout.title || '',
          notes: foundWorkout.notes || '',
          scheduled_at: formatDateTimeInput(foundWorkout.scheduled_at),
        });
      }
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải chi tiết buổi tập';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const selectableExercises = useMemo(() => {
    const currentIds = new Set((workout?.exercises || []).map((item) => item.exercise?.id));
    return allExercises.filter((item) => !currentIds.has(item.id));
  }, [allExercises, workout]);

  const handleUpdateWorkout = async (e) => {
    e.preventDefault();
    try {
      await workoutService.update(id, workoutFormData);
      await loadData();
      showToast('Đã cập nhật thông tin buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể cập nhật buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleStartWorkout = async () => {
    try {
      await workoutService.start(id);
      await loadData();
      showToast('Đã bắt đầu buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể bắt đầu buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      await workoutService.complete(id, { comment: '' });
      await loadData();
      showToast('Đã hoàn thành buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể hoàn thành buổi tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleAddExercise = async (e) => {
    e.preventDefault();
    try {
      await workoutService.addExercise(id, exerciseFormData.exerciseId, {
        sets: Number.parseInt(exerciseFormData.sets, 10),
        reps: Number.parseInt(exerciseFormData.reps, 10),
        weight: exerciseFormData.weight ? Number.parseFloat(exerciseFormData.weight) : null,
        comment: exerciseFormData.comment,
      });

      setShowAddExerciseModal(false);
      setExerciseFormData({ exerciseId: '', sets: '', reps: '', weight: '', comment: '' });
      await loadData();
      showToast('Đã thêm bài tập vào buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thêm bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleRemoveExercise = async (workoutExerciseId) => {
    try {
      await workoutService.removeExercise(id, workoutExerciseId);
      await loadData();
      showToast('Đã xóa bài tập khỏi buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể xóa bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  if (!workout) {
    return (
      <PageLayout title="Chi tiết buổi tập">
        <div className="card card-body text-center py-12 text-slate-500">
          Không tìm thấy buổi tập.
          <div className="mt-4">
            <Link to="/workouts">
              <Button>Quay lại danh sách</Button>
            </Link>
          </div>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout
      title="Chi tiết buổi tập"
      actions={
        <Link to="/workouts">
          <Button variant="secondary">Quay lại</Button>
        </Link>
      }
    >
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleUpdateWorkout} className="card card-body space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Thông tin buổi tập</h2>
        <Input
          label="Tiêu đề"
          name="title"
          value={workoutFormData.title}
          onChange={(e) => setWorkoutFormData({ ...workoutFormData, title: e.target.value })}
          required
        />
        <Input
          label="Ghi chú"
          name="notes"
          value={workoutFormData.notes}
          onChange={(e) => setWorkoutFormData({ ...workoutFormData, notes: e.target.value })}
          required
        />
        <Input
          label="Ngày lên lịch"
          type="datetime-local"
          name="scheduled_at"
          value={workoutFormData.scheduled_at}
          onChange={(e) => setWorkoutFormData({ ...workoutFormData, scheduled_at: e.target.value })}
          required
        />
        <div className="flex flex-wrap gap-2">
          <Button type="submit">Lưu thay đổi</Button>
          {workout.status === 'planned' && <Button onClick={handleStartWorkout}>Bắt đầu tập</Button>}
          {workout.status === 'in_progress' && (
            <Button variant="success" onClick={handleCompleteWorkout}>
              Hoàn thành buổi tập
            </Button>
          )}
        </div>
      </form>

      <div className="card card-body mt-6">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <h2 className="text-lg font-semibold text-slate-900">Bài tập trong buổi</h2>
          {workout.status !== 'completed' && (
            <Button size="sm" onClick={() => setShowAddExerciseModal(true)}>
              Thêm bài tập
            </Button>
          )}
        </div>

        {(workout.exercises || []).length === 0 ? (
          <p className="text-slate-500">Buổi tập này chưa có bài tập nào.</p>
        ) : (
          <div className="space-y-3">
            {(workout.exercises || []).map((item) => (
              <div key={item.id} className="border border-slate-200 rounded-xl p-4 flex justify-between gap-4">
                <div>
                  <p className="font-medium text-slate-900">{item.exercise?.name || 'Bài tập không xác định'}</p>
                  <p className="text-sm text-slate-600 mt-1">
                    {item.sets} hiệp x {item.reps} reps
                    {item.weight ? ` @ ${item.weight}kg` : ''}
                  </p>
                  {item.comment && <p className="text-sm text-slate-500 mt-1">{item.comment}</p>}
                </div>

                {workout.status !== 'completed' && (
                  <Button variant="danger" size="sm" onClick={() => handleRemoveExercise(item.id)}>
                    Xóa
                  </Button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

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
              {selectableExercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
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

export default WorkoutDetail;
