import { Link } from 'react-router-dom';
import Button from '../../components/common/Button.jsx';

const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4">
      <div className="text-center">
        <h1 className="text-6xl sm:text-7xl font-bold text-slate-800 mb-2">404</h1>
        <p className="text-lg text-slate-600 mb-8">Trang không tồn tại</p>
        <Link to="/">
          <Button size="lg">Về trang chủ</Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
