import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import { userService } from '../../services/modules/userService.js';
import Loader from '../../components/common/Loader.jsx';
import PageLayout from '../../components/layout/PageLayout.jsx';

const Profile = () => {
  const { user, loading: authLoading } = useAuth();
  const { showToast } = useToast();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const response = await userService.getCurrentUser();
        setUserData(response.user);
      } catch (err) {
        console.error('Error loading user data:', err);
        showToast('Không thể tải thông tin cá nhân.', 'error');
      } finally {
        setLoading(false);
      }
    };

    if (authLoading === false) {
      loadUserData();
    }
  }, [authLoading, showToast]);

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader />
      </div>
    );
  }

  return (
    <PageLayout title="Thông tin cá nhân">
      <div className="card card-body max-w-2xl">
        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-500">Tên</label>
            <p className="mt-1 text-lg font-medium text-slate-900">{userData?.name || user?.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500">Email</label>
            <p className="mt-1 text-lg text-slate-900">{userData?.email || user?.email}</p>
          </div>
          {userData?.weight && (
            <div>
              <label className="block text-sm font-medium text-slate-500">Cân nặng</label>
              <p className="mt-1 text-slate-900">{userData.weight} kg</p>
            </div>
          )}
          {userData?.height && (
            <div>
              <label className="block text-sm font-medium text-slate-500">Chiều cao</label>
              <p className="mt-1 text-slate-900">{userData.height} cm</p>
            </div>
          )}
          {userData?.gender && (
            <div>
              <label className="block text-sm font-medium text-slate-500">Giới tính</label>
              <p className="mt-1 text-slate-900">
                {userData.gender === 'male' ? 'Nam' : userData.gender === 'female' ? 'Nữ' : 'Khác'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default Profile;
