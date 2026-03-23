import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import Button from '../../components/common/Button.jsx';

const features = [
  {
    title: 'Lên lịch tập',
    description: 'Tạo buổi tập, thêm bài tập và theo dõi tiến độ mỗi ngày.',
    icon: '💪',
  },
  {
    title: 'BMI & Sức khỏe',
    description: 'Tính chỉ số BMI và theo dõi cân nặng, mục tiêu thể hình.',
    icon: '📊',
  },
  {
    title: 'Theo dõi ăn uống',
    description: 'Ghi nhận bữa ăn và calo để cân đối dinh dưỡng.',
    icon: '🥗',
  },
  {
    title: 'Trợ lý AI',
    description: 'Hỏi đáp nhanh về tập luyện, dinh dưỡng và sức khỏe.',
    icon: '🤖',
  },
];

const Home = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23ffffff\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')] opacity-80" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-20 sm:py-28">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight">
              Sức khỏe & Thể hình
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-emerald-100">
              Theo dõi tập luyện, BMI, ăn uống và nhận gợi ý từ AI. Bắt đầu hành trình của bạn ngay hôm nay.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              {isAuthenticated ? (
                <Link to="/dashboard">
                  <Button size="lg" className="bg-white text-emerald-700 hover:bg-emerald-400 border-0">
                    Dashboard
                  </Button>
                </Link>
              ) : (
                <>
                  <Link to="/register">
                    <Button size="lg" className="bg-amber-400 text-slate-900 hover:bg-amber-300 border-0">
                      Đăng ký miễn phí
                    </Button>
                  </Link>
                  <Link to="/login">
                    <Button size="lg" variant="outline" className="border-2 border-white text-white hover:bg-white/10">
                      Đăng nhập
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 sm:py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Mọi thứ bạn cần trong một app
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f) => (
              <div
                key={f.title}
                className="card card-body hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-3 block">{f.icon}</span>
                <h3 className="font-semibold text-slate-900">{f.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isAuthenticated && (
        <section className="py-16 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-2xl font-bold text-slate-900">Sẵn sàng bắt đầu?</h2>
            <p className="mt-2 text-slate-600">Tạo tài khoản miễn phí, không cần thẻ tín dụng.</p>
            <Link to="/register" className="inline-block mt-6">
              <Button size="lg">Đăng ký ngay</Button>
            </Link>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
