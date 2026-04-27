import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { userService } from '../../services/modules/userService.js';
import Button from '../../components/common/Button.jsx';
import Input from '../../components/common/Input.jsx';
import Loader from '../../components/common/Loader.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const toInitials = (name) => {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'U';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
};

const formatDateInput = (value) => {
  if (!value) return '';
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  const year = d.getFullYear();
  const month = `${d.getMonth() + 1}`.padStart(2, '0');
  const day = `${d.getDate()}`.padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const genderLabel = (gender) => {
  if (gender === 'male') return 'Nam';
  if (gender === 'female') return 'Nữ';
  return 'Khác';
};

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();

  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({
    name: '',
    weight: '',
    height: '',
    gender: 'male',
    date_of_birth: '',
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        setError('');
        const response = await userService.getCurrentUser();
        setUserData(response.user);

        // Initialize form from server data
        setForm({
          name: response.user?.name || '',
          weight: response.user?.weight !== null && response.user?.weight !== undefined ? String(response.user.weight) : '',
          height: response.user?.height !== null && response.user?.height !== undefined ? String(response.user.height) : '',
          gender: response.user?.gender || 'male',
          date_of_birth: formatDateInput(response.user?.date_of_birth),
        });
      } catch (err) {
        console.error('Error loading user data:', err);
        setError('Không thể tải thông tin cá nhân.');
        showToast('Không thể tải thông tin cá nhân.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading === false) loadUserData();
  }, [authLoading, showToast]);

  const initials = useMemo(() => toInitials(userData?.name || user?.name), [userData, user]);

  const payload = useMemo(() => {
    // Only send defined fields so backend won't overwrite with NaN
    const next = {};
    if (form.name !== '') next.name = form.name.trim();
    if (form.weight !== '') next.weight = Number(form.weight);
    if (form.height !== '') next.height = Number(form.height);
    if (form.gender !== '') next.gender = form.gender;
    if (form.date_of_birth !== '') next.date_of_birth = form.date_of_birth;
    return next;
  }, [form]);

  const resetFormFromUser = (u) => {
    setForm({
      name: u?.name || '',
      weight: u?.weight !== null && u?.weight !== undefined ? String(u.weight) : '',
      height: u?.height !== null && u?.height !== undefined ? String(u.height) : '',
      gender: u?.gender || 'male',
      date_of_birth: formatDateInput(u?.date_of_birth),
    });
  };

  const handleSave = async (e) => {
    if (e?.preventDefault) e.preventDefault();
    if (Object.keys(payload).length === 0) {
      showToast('Không có thay đổi nào để lưu.');
      return;
    }

    try {
      setSaving(true);
      setError('');
      await userService.updateCurrentUser(payload);
      const fresh = await userService.getCurrentUser();
      setUserData(fresh.user);
      resetFormFromUser(fresh.user);

      setIsEditing(false);
      showToast('Đã lưu thông tin cá nhân.');
    } catch (err) {
      const msg = err.response?.data?.message || 'Không thể lưu thông tin cá nhân.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  const viewUser = userData || user;

  return (
    <PageLayout
      title="Thông tin cá nhân"
      actions={
        !isEditing ? (
          <Button onClick={() => setIsEditing(true)}>Chỉnh sửa</Button>
        ) : (
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsEditing(false);
                resetFormFromUser(userData || user);
              }}
              disabled={saving}
            >
              Hủy
            </Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? 'Đang lưu...' : 'Lưu'}
            </Button>
          </>
        )
      }
    >
      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl mb-6">
          {error}
        </div>
      )}

      <div className="card card-body max-w-3xl space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center justify-center">
            <span className="text-emerald-700 font-bold text-lg">{initials}</span>
          </div>
          <div className="min-w-0">
            <h2 className="text-xl font-semibold text-slate-900 truncate">{viewUser?.name || '—'}</h2>
            <p className="text-sm text-slate-500 truncate">{viewUser?.email || '—'}</p>
          </div>
        </div>

        {!isEditing ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-500">Cân nặng</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {viewUser?.weight !== null && viewUser?.weight !== undefined ? `${viewUser.weight} kg` : '—'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-500">Chiều cao</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {viewUser?.height !== null && viewUser?.height !== undefined ? `${viewUser.height} cm` : '—'}
                </p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <p className="text-sm font-medium text-slate-500">Giới tính</p>
                <p className="text-lg font-semibold text-slate-900 mt-1">
                  {viewUser?.gender ? genderLabel(viewUser.gender) : '—'}
                </p>
              </div>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white">
              <p className="text-sm font-medium text-slate-700">Ngày sinh</p>
              <p className="text-slate-900 mt-1">
                {viewUser?.date_of_birth ? formatDateInput(viewUser.date_of_birth) : '—'}
              </p>
            </div>
          </>
        ) : (
          <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Tên"
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
            </div>

            <Input
              label="Cân nặng (kg)"
              name="weight"
              type="number"
              step="0.1"
              value={form.weight}
              onChange={(e) => setForm({ ...form, weight: e.target.value })}
            />

            <Input
              label="Chiều cao (cm)"
              name="height"
              type="number"
              step="0.1"
              value={form.height}
              onChange={(e) => setForm({ ...form, height: e.target.value })}
            />

            <div className="sm:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Giới tính
              </label>
              <select
                value={form.gender}
                onChange={(e) => setForm({ ...form, gender: e.target.value })}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
            </div>

            <div className="sm:col-span-2">
              <Input
                label="Ngày sinh"
                name="date_of_birth"
                type="date"
                value={form.date_of_birth}
                onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
              />
            </div>

            <div className="sm:col-span-2 text-sm text-slate-500">
              Bạn có thể chỉnh sửa các thông tin hình thể. Sau khi lưu, dữ liệu sẽ được cập nhật ngay.
            </div>
          </form>
        )}
      </div>
    </PageLayout>
  );
};

export default Profile;
