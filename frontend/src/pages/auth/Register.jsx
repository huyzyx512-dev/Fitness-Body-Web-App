import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { useToast } from '../../context/ToastContext.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';
import Loader from '../../components/common/Loader.jsx';
import z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';

const signUpSchema = z.object({
  name: z.string().min(3, "Tên phải có ít nhất 3 ký tự"),
  email: z.email("Email không hợp lệ"),
  birthday: z.coerce.date({
    error: issue => issue.input === undefined ? "Ngày sinh không được để trống" : "Ngày sinh không hợp lệ",
  }),
  weight: z.number({
    invalid_type_error: "Vui lòng nhập cân nặng (phải là số)",
    required_error: "Cân nặng không được để trống",
  })
    .min(30, "Cân nặng phải lớn hơn 30")
    .max(200, "Cân nặng phải nhỏ hơn 200"),
  height: z.number({
    invalid_type_error: "Vui lòng nhập chiều cao (phải là số)",
  })
    .min(150, "Chiều cao phải lớn hơn 150")
    .max(250, "Chiều cao phải nhỏ hơn 250"),
  password: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  confirmPassword: z.string().min(6, "Mật khẩu phải có ít nhất 6 ký tự"),
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Vui lòng chọn giới tính hợp lệ" }),
  }).default('male'),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Mật khẩu xác nhận không khớp",
  path: ["confirmPassword"]
});

const Register = () => {

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      gender: 'male',        // Giá trị mặc định
      height: 0,           // Giá trị mặc định hợp lý hơn
      weight: 0,
    }
  });

  const { registerUser } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const onSubmit = async (data) => {

    try {
      await registerUser(data);

      showToast('Đăng ký thành công.');
      navigate('/dashboard');
    } catch (err) {
      const msg = err.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.';
      showToast(msg, 'error');
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

          <form className="mt-6 space-y-4" onSubmit={handleSubmit(onSubmit)}>
            <Input label="Họ và tên" type="text" name="name" placeholder="Nguyễn Văn A" {...register('name')} />
            {errors.name && (<p className="text-destructive text-sm text-red-500">{errors.name.message}</p>)}
            <Input label="Email" type="email" name="email" placeholder="email@example.com" {...register('email')} />
            {errors.email && <p className="text-destructive text-sm text-red-500">{errors.email.message}</p>}
            <Input label="Birthday" type="date" name="birthday" {...register('birthday')} />
            {errors.birthday && <p className="text-destructive text-sm text-red-500">{errors.birthday.message}</p>}
            <div className="space-y-1">
              <label className="text-sm font-medium text-slate-700">Giới tính</label>
              <select
                {...register('gender')}
                className="w-full px-4 py-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 bg-white"
              >
                <option value="male">Nam</option>
                <option value="female">Nữ</option>
                <option value="other">Khác</option>
              </select>
              {errors.gender && (
                <p className="text-destructive text-sm text-red-500">{errors.gender.message}</p>
              )}
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              <Input label="Height (cm)" type="number" name="height" placeholder="170" {...register('height', { valueAsNumber: true, value: 0 })} />
              <Input label="Weight (kg)" type="number" name="weight" placeholder="60" {...register('weight', { valueAsNumber: true, value: 0 })} />
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
              {errors.height && <p className="text-destructive text-sm text-red-500">{errors.height.message}</p>}
              {errors.weight && <p className="text-destructive text-sm text-red-500">{errors.weight.message}</p>}
            </div>
            <Input label="Mật khẩu" type="password" name="password" placeholder="••••••" {...register('password')} />
            {errors.password && <p className="text-destructive text-sm text-red-500">{errors.password.message}</p>}
            <Input label="Xác nhận mật khẩu" type="password" name="confirmPassword" placeholder="••••••" {...register('confirmPassword')} />
            {errors.confirmPassword && <p className="text-destructive text-sm text-red-500">{errors.confirmPassword.message}</p>}
            <Button type="submit" variant="primary" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? <Loader size="sm" /> : 'Đăng ký'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;
