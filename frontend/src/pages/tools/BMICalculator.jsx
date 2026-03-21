import { useState } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const getBMICategory = (bmi) => {
  if (bmi < 18.5) return { label: 'Thiếu cân', color: 'text-blue-600', bg: 'bg-blue-100' };
  if (bmi < 25) return { label: 'Bình thường', color: 'text-emerald-600', bg: 'bg-emerald-100' };
  if (bmi < 30) return { label: 'Thừa cân', color: 'text-amber-600', bg: 'bg-amber-100' };
  return { label: 'Béo phì', color: 'text-rose-600', bg: 'bg-rose-100' };
};

const BMICalculator = () => {
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const h = parseFloat(height) / 100;
    const w = parseFloat(weight);
    if (h > 0 && w > 0) {
      const bmi = (w / (h * h)).toFixed(1);
      setResult({ bmi: parseFloat(bmi), ...getBMICategory(parseFloat(bmi)) });
    } else {
      setResult(null);
    }
  };

  return (
    <PageLayout title="Tính chỉ số BMI">
      <div className="max-w-xl">
        <div className="card card-body">
          <p className="text-slate-600 mb-6">
            Chỉ số BMI (Body Mass Index) giúp đánh giá mức độ cân nặng so với chiều cao. Nhập chiều cao (cm) và cân nặng (kg).
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Chiều cao (cm)"
              type="number"
              min="100"
              max="250"
              step="0.1"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              placeholder="170"
              required
            />
            <Input
              label="Cân nặng (kg)"
              type="number"
              min="30"
              max="300"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              placeholder="65"
              required
            />
            <Button type="submit" size="lg" className="w-full sm:w-auto">
              Tính BMI
            </Button>
          </form>

          {result && (
            <div className={`mt-8 p-6 rounded-xl ${result.bg}`}>
              <p className="text-sm font-medium text-slate-600">Kết quả</p>
              <p className={`text-4xl font-bold mt-1 ${result.color}`}>{result.bmi}</p>
              <p className={`font-semibold mt-2 ${result.color}`}>{result.label}</p>
              <p className="text-sm text-slate-600 mt-3">
                {result.label === 'Thiếu cân' && 'Nên tăng cường dinh dưỡng và tập luyện tăng cơ.'}
                {result.label === 'Bình thường' && 'Cân nặng của bạn đang ở mức tốt. Duy trì chế độ ăn và tập luyện hợp lý.'}
                {result.label === 'Thừa cân' && 'Cân nhắc giảm calo và tăng vận động để về mức bình thường.'}
                {result.label === 'Béo phì' && 'Nên gặp bác sĩ hoặc chuyên gia dinh dưỡng để có kế hoạch giảm cân an toàn.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default BMICalculator;
