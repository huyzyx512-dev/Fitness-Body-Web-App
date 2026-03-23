import { useState } from 'react';
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
  const [bmi, setBmi] = useState(null)
  const [category, setCategory] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // BMI Calculation: weight (kg) / [height (m)]²
  const calculateBMI = () => {
    const heightInMeters = parseFloat(height) / 100 // Convert cm to meters
    const weightInKg = parseFloat(weight)

    if (!heightInMeters || !weightInKg || heightInMeters <= 0 || weightInKg <= 0) {
      return null
    }

    return weightInKg / (heightInMeters * heightInMeters)
  }

  // Get BMI category based on standard ranges
  const getBMICategory = (bmiValue) => {
    if (bmiValue < 18.5) {
      return {
        label: 'Thiếu cân',
        description: 'BMI less than 18.5',
        color: 'text-blue-600',
        bgColor: 'bg-blue-50',
        borderColor: 'border-blue-200'
      }
    } else if (bmiValue >= 18.5 && bmiValue < 25) {
      return {
        label: 'Cân nặng bình thường',
        description: 'BMI 18.5-24.9',
        color: 'text-green-600',
        bgColor: 'bg-green-50',
        borderColor: 'border-green-200'
      }
    } else if (bmiValue >= 25 && bmiValue < 30) {
      return {
        label: 'Thừa cân',
        description: 'BMI 25-29.9',
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50',
        borderColor: 'border-yellow-200'
      }
    } else {
      return {
        label: 'Béo phì',
        description: 'BMI 30 or greater',
        color: 'text-red-600',
        bgColor: 'bg-red-50',
        borderColor: 'border-red-200'
      }
    }
  }

  // Handle calculation
  const handleCalculate = () => {
    const bmiValue = calculateBMI()
    if (bmiValue) {
      setBmi(bmiValue)
      setCategory(getBMICategory(bmiValue))
      setSaveMessage('')
    }
  }

  // Reset form
  const handleReset = () => {
    setHeight('')
    setWeight('')
    setBmi(null)
    setCategory('')
    setSaveMessage('')
  }

  return (
    <div className='max-w-2xl mx-auto'>
      <div className='text-center mb-8'>
        <h1 className='text-3xl font-bold text-gray-900 mb-2'>Tính chỉ số BMI</h1>
        <p className='text-gray-600'>Tính chỉ số khối cơ thể của bạn và theo dõi tiến độ sức khỏe của bạn</p>
      </div>

      {/* Form calculator BMI */}
      <div className='bg-white rounded-lg shadow-sm border border-gray-200 p-6'>
        <div className='grid md:grid-cols-2 gap-6 mb-6'>
          <div>
            <label htmlFor="height" className='block text-sm font-medium text-gray-700 mb-2'>Height (cm)</label>
            <Input
              id="height"
              type='number'
              placeholder="Enter height in centimeters"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              min="50"
              max="250"
              step="0.1"
            />
          </div>
          <div>
            <label htmlFor="weight" className='block text-sm font-medium text-gray-700 mb-2'>Weight (kg)</label>
            <Input
              id="weight"
              type='number'
              placeholder="Enter weight in kilograms"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              min="20"
              max="300"
              step="0.1"
            />
          </div>
        </div>

        {/* Action Button */}
        <div className='flex gap-4 mb-6'>
          <Button onClick={handleCalculate} disabled={!height || !weight} className='flex-1'>Tính BMI</Button>
          <Button variant='secondary' onClick={handleReset} className='flex-1'>Reset</Button>
        </div>

        {/* BMI Result */}
        {bmi && category && (
          <div className={`rounded-lg border p-6 mb-6 ${category.bgColor} ${category.borderColor}`}>
            <div className='text-center'>
              <div className={`text-4xl font-bold ${category.color} mb-2`}>
                {bmi.toFixed(1)}
              </div>
              <div className={`text-xl font-semibold ${category.color} mb-2`}>
                {category.label}
              </div>
              <div className="text-sm text-gray-600 mb-4">
                {category.description}
              </div>

              {/* BMI Scale Visualization */}
              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Danh mục BMI:</div>
                <div className="flex text-xs">
                  <div className="flex-1 text-center p-2 bg-blue-50 text-blue-700 rounded-l">Thiếu cân &lt;18.5</div>
                  <div className="flex-1 text-center p-2 bg-green-50 text-green-700">Bình thường 18.5-24.9</div>
                  <div className="flex-1 text-center p-2 bg-yellow-50 text-yellow-700">Thừa cân 25-29.9</div>
                  <div className="flex-1 text-center p-2 bg-red-50 text-red-700 rounded-r">Béo phì ≥30</div>
                </div>
              </div>
            </div>
          </div>
        )}


        {/* BMI Information */}
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">BMI là gì?</h3>
          <p className="text-sm text-gray-600 mb-3">
            Chỉ số khối cơ thể (BMI) là thước đo lượng mỡ trong cơ thể dựa trên chiều cao và cân nặng áp dụng cho nam giới và phụ nữ trưởng thành.
          </p>
          <p className="text-sm text-gray-600">
            <strong>Công thức:</strong> BMI = weight (kg) / [height (m)]²
          </p>
        </div>
      </div>
    </div>
  );
};

export default BMICalculator;
