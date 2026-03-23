import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    birthday: '',
    weight: '',
    height: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return;
    }

    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (formData.name.length < 3) {
      setError('Tên phải có ít nhất 3 ký tự');
      return;
    }

    setLoading(true);

    try {
      await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });
      showToast('Đăng ký thành công.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      setError(msg);
      showToast(msg, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card card-body shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Đăng ký tài khoản
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Đã có tài khoản?{' '}
            <Link to="/login" className="font-medium text-emerald-600 hover:text-emerald-700">
              Đăng nhập
            </Link>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-rose-50 border border-rose-200 text-rose-700 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            <Input label="Họ và tên" type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Nguyễn Văn A" required />
            <Input label="Email" type="email" name="email" value={formData.email} onChange={handleChange} placeholder="email@example.com" required />
            <Input label="Birthday" type="date" name="birthday" value={formData.birthday} onChange={handleChange} required />
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input label="Weight (kg)" type="number" name="weight" value={formData.weight} onChange={handleChange} placeholder="60" required />
              <Input label="Height (cm)" type="number" name="height" value={formData.height} onChange={handleChange} placeholder="170" required />
            </div>
            <Input label="Mật khẩu" type="password" name="password" value={formData.password} onChange={handleChange} placeholder="••••••" required />
            <Input label="Xác nhận mật khẩu" type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder="••••••" required />
            <Button type="submit" variant="primary" size="lg" disabled={loading} className="w-full">
              {loading ? <Loader size="sm" /> : 'Đăng ký'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
