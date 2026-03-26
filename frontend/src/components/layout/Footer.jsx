import { Link } from 'react-router-dom';

const footerLinks = [
  { to: '/', label: 'Trang chủ' },
  { to: '/exercises', label: 'Bài tập' },
  { to: '/bmi', label: 'BMI' },
  { to: '/dashboard', label: 'Dashboard' },
];

const Footer = () => {
  return (
    <footer className="bg-slate-800 text-slate-300 mt-auto">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <Link to="/" className="text-lg font-bold text-white">FitnessBody</Link>
            <p className="mt-2 text-sm text-slate-400 max-w-xs">
              Theo dõi thể hình, BMI, ăn uống và nhận gợi ý từ AI.
            </p>
          </div>
          <div className="flex flex-wrap gap-6">
            {footerLinks.map((l) => (
              <Link key={l.to} to={l.to} className="text-sm hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-slate-700 text-center text-sm text-slate-500">
          © {new Date().getFullYear()} FitnessBody. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
