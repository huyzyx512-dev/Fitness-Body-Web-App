import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

const signIpSchema = z.object({
  email: z.email("Email không hợp lệ"),
  password: z.string().min(1, "Mật khẩu không được để trống"),
});

const Login = () => {

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(signIpSchema),
  })

  const { loginUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    
    try {
      await loginUser(data.email, data.password);
      showToast('Đăng nhập thành công.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
      showToast(msg, 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-slate-50 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="card card-body shadow-lg">
          <h2 className="text-2xl font-bold text-slate-900 text-center">
            Đăng nhập
          </h2>
          <p className="mt-2 text-center text-sm text-slate-600">
            Chưa có tài khoản?{' '}
            <Link to="/register" className="font-medium text-emerald-600 hover:text-emerald-700">
              Đăng ký
            </Link>
          </p>

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
      
            <Input
              label="Email"
              type="email"
              name="email"
              {...register('email')}
              placeholder="email@example.com"
              // required
            />
            {errors.email && (<p className="text-destructive text-sm text-red-500">{errors.email.message}</p>)}
            <Input
              label="Mật khẩu"
              type="password"
              name="password"
               {...register('password')}
              placeholder="••••••••"
              // required
            />
             {errors.password && (<p className="text-destructive text-sm text-red-500">{errors.password.message}</p>)}
            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? <Loader size="sm" /> : 'Đăng nhập'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
