import { useState, useEffect } from 'react';
import { exerciseService } from '../../services/modules/exerciseService.js';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import Modal from '../../components/common/Modal.jsx';
import Input from '../../components/common/Input.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const Exercises = () => {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: '',
    muscle_group: '',
  });
  const { isAuthenticated } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    loadExercises();
  }, []);

  const loadExercises = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await exerciseService.getAll();
      setExercises(Array.isArray(data) ? data : []);
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tải danh sách bài tập';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await exerciseService.create(formData);
      setShowCreateModal(false);
      setFormData({ name: '', description: '', category: '', muscle_group: '' });
      setError('');
      loadExercises();
      showToast('Đã tạo bài tập thành công.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể tạo bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleEdit = (exercise) => {
    setSelectedExercise(exercise);
    setFormData({
      name: exercise.name,
      description: exercise.description,
      category: exercise.category,
      muscle_group: exercise.muscle_group,
    });
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await exerciseService.update(selectedExercise.id, formData);
      setShowEditModal(false);
      setSelectedExercise(null);
      setFormData({ name: '', description: '', category: '', muscle_group: '' });
      setError('');
      loadExercises();
      showToast('Đã cập nhật bài tập.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể cập nhật bài tập';
      setError(msg);
      showToast(msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc muốn xóa bài tập này?')) {
      try {
        await exerciseService.delete(id);
        setError('');
        loadExercises();
        showToast('Đã xóa bài tập.');
      } catch (err) {
        const msg = err.response?.data?.message || 'Không thể xóa bài tập';
        setError(msg);
        showToast(msg, 'error');
      }
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
      title="Bài tập"
      actions={isAuthenticated ? <Button onClick={() => setShowCreateModal(true)}>Tạo bài tập</Button> : null}
    >
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {exercises.map((exercise) => (
          <div key={exercise.id} className="card card-body">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">{exercise.name}</h3>
            <p className="text-slate-600 text-sm mb-4 line-clamp-2">{exercise.description}</p>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-medium">
                {exercise.category}
              </span>
              <span className="px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg text-xs font-medium">
                {exercise.muscle_group}
              </span>
            </div>
            {isAuthenticated && (
              <div className="flex gap-2 pt-2 border-t border-slate-100">
                <Button size="sm" variant="outline" onClick={() => handleEdit(exercise)}>Sửa</Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(exercise.id)}>Xóa</Button>
              </div>
            )}
          </div>
        ))}
      </div>

      {exercises.length === 0 && (
        <div className="card card-body text-center py-12 text-slate-500">
          Chưa có bài tập nào.
        </div>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Tạo Bài Tập Mới"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowCreateModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleCreate}>Tạo</Button>
          </>
        }
      >
        <form onSubmit={handleCreate} className="space-y-4">
          <Input
            label="Tên bài tập"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Input
            label="Danh mục"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <Input
            label="Nhóm cơ"
            name="muscle_group"
            value={formData.muscle_group}
            onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
            required
          />
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedExercise(null);
        }}
        title="Sửa Bài Tập"
        footer={
          <>
            <Button variant="secondary" onClick={() => setShowEditModal(false)}>
              Hủy
            </Button>
            <Button onClick={handleUpdate}>Cập nhật</Button>
          </>
        }
      >
        <form onSubmit={handleUpdate} className="space-y-4">
          <Input
            label="Tên bài tập"
            name="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            label="Mô tả"
            name="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
          <Input
            label="Danh mục"
            name="category"
            value={formData.category}
            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            required
          />
          <Input
            label="Nhóm cơ"
            name="muscle_group"
            value={formData.muscle_group}
            onChange={(e) => setFormData({ ...formData, muscle_group: e.target.value })}
            required
          />
        </form>
      </Modal>
    </PageLayout>
  );
};

export default Exercises;
