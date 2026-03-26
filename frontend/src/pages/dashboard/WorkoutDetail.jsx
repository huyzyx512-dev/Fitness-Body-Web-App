import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

import { useToast } from '../../context/ToastContext.jsx';
import { workoutService } from '../../services/modules/workoutService.js';
import { exerciseService } from '../../services/modules/exerciseService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

// --- SCHEMAS VALIDATION ---
const workoutSchema = z.object({
  title: z.string().min(1, 'Tiêu đề không được để trống'),
  notes: z.string().min(1, 'Ghi chú không được để trống'),
  scheduled_at: z.string().min(1, 'Vui lòng chọn ngày giờ'),
});

const exerciseSchema = z.object({
  exerciseId: z.string().min(1, 'Vui lòng chọn bài tập'),
  sets: z.coerce.number().min(1, 'Số hiệp phải lớn hơn 0'),
  reps: z.coerce.number().min(1, 'Số lần lặp phải lớn hơn 0'),
  weight: z.coerce.number().nullable().optional(),
  comment: z.string().optional(),
});

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

  const {
    register: registerWorkout,
    handleSubmit: handleSubmitWorkout,
    reset: resetWorkout,
    formState: { errors: workoutErrors },
  } = useForm({
    resolver: zodResolver(workoutSchema),
  });

  const {
    register: registerExercise,
    handleSubmit: handleSubmitExercise,
    reset: resetExercise,
    formState: { errors: exerciseErrors },
  } = useForm({
    resolver: zodResolver(exerciseSchema),
    defaultValues: { weight: null, comment: '' }
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
        // Cập nhật giá trị vào form khi load xong data
        resetWorkout({
          title: foundWorkout.title || '',
          notes: foundWorkout.notes || '',
          scheduled_at: formatDateTimeInput(foundWorkout.scheduled_at)
        })
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

  // --- HANDLERS ---
  const onUpdateWorkout = async (data) => {
    try {
      await workoutService.update(id, data);
      await loadData();
      showToast('Đã cập nhật thông tin buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể cập nhật buổi tập';
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
      showToast(msg, 'error');
    }
  };

  const handleCompleteWorkout = async () => {
    try {
      await workoutService.complete(id, { comment: '' });
      await loadData();
      showToast('Đã hoàn thành buổi tập.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi', 'error');
    }
  };

  const onAddExercise = async (data) => {
    try {
      await workoutService.addExercise(id, data.exerciseId, {
        sets: data.sets,
        reps: data.reps,
        weight: data.weight,
        comment: data.comment,
      });

      setShowAddExerciseModal(false);
      resetExercise(); // Reset modal form
      await loadData();
      showToast('Đã thêm bài tập vào buổi tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể thêm bài tập';
      showToast(msg, 'error');
    }
  };

  const handleRemoveExercise = async (workoutExerciseId) => {
    try {
      await workoutService.removeExercise(id, workoutExerciseId);
      await loadData();
      showToast('Đã xóa bài tập khỏi buổi tập.');
    } catch (err) {
      showToast(err.response?.data?.message || 'Lỗi', 'error');
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

      <form onSubmit={handleSubmitWorkout(onUpdateWorkout)} className="card card-body space-y-4">
        <h2 className="text-lg font-semibold text-slate-900">Thông tin buổi tập</h2>
        <Input
          label="Tiêu đề"
          name="title"
          {...registerWorkout('title')}
          error={workoutErrors.title?.message}
        />
        <Input
          label="Ghi chú"
          name="notes"
          {...registerWorkout('notes')}
          error={workoutErrors.notes?.message}
        />
        <Input
          label="Ngày lên lịch"
          type="datetime-local"
          name="scheduled_at"
          {...registerWorkout('scheduled_at')}
          error={workoutErrors.scheduled_at?.message}
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

      {/* List Exercise */}
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
                  <div className='flex items-center'>
                    <Button variant='warming' size='sm' className='mx-3' onClick={() => { }}>
                      Sửa
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveExercise(item.id)}>
                      Xóa
                    </Button>
                  </div>
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
            <Button onClick={handleSubmitExercise(onAddExercise)}>Thêm</Button>
          </>
        }
      >
        <form onSubmit={handleSubmitExercise(onAddExercise)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Bài tập <span className="text-rose-500">*</span>
            </label>
            <select
              {...registerExercise('exerciseId')}
              className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <option value="">Chọn bài tập</option>
              {selectableExercises.map((exercise) => (
                <option key={exercise.id} value={exercise.id}>
                  {exercise.name}
                </option>
              ))}
            </select>
            {exerciseErrors.exerciseId && <p className="text-xs text-rose-500 mt-1">{exerciseErrors.exerciseId.message}</p>}
          </div>
          <Input
            label="Số hiệp"
            type="number"
            name="sets"
            {...registerExercise('sets')}
            error={exerciseErrors.sets?.message}
            required
          />
          <Input
            label="Số lần lặp"
            type="number"
            name="reps"
            {...registerExercise('reps')}
            error={exerciseErrors.reps?.message}
            required
          />
          <Input
            label="Trọng lượng (kg)"
            type="number"
            step="0.1"
            name="weight"
            {...registerExercise('weight')}
            error={exerciseErrors.weight?.message}
          />
          <Input
            label="Ghi chú"
            name="comment"
            {...registerExercise('comment')}
          />
        </form>
      </Modal>
    </PageLayout>
  );
};

export default WorkoutDetail;
