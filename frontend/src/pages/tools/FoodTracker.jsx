import { useState, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import Input from '../../components/common/Input.jsx';
import Button from '../../components/common/Button.jsx';

const STORAGE_KEY = 'fitness_food_log';

const FoodTracker = () => {
  const [entries, setEntries] = useState([]);
  const [form, setForm] = useState({ name: '', calories: '', meal: 'breakfast' });
  const [dateFilter, setDateFilter] = useState(new Date().toISOString().slice(0, 10));

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setEntries(JSON.parse(raw));
    } catch {
      setEntries([]);
    }
  }, []);

  useEffect(() => {
    if (entries.length) localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
  }, [entries]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const name = form.name.trim();
    const calories = parseInt(form.calories, 10);
    if (!name || isNaN(calories) || calories < 0) return;
    setEntries((prev) => [
      ...prev,
      {
        id: Date.now(),
        name,
        calories,
        meal: form.meal,
        date: dateFilter,
      },
    ]);
    setForm({ name: '', calories: '', meal: 'breakfast' });
  };

  const handleDelete = (id) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const filtered = entries.filter((e) => e.date === dateFilter);
  const totalCal = filtered.reduce((sum, e) => sum + e.calories, 0);
  const mealLabel = { breakfast: 'Sáng', lunch: 'Trưa', dinner: 'Tối', snack: 'Phụ' };

  return (
    <PageLayout title="Theo dõi ăn uống">
      <div className="max-w-2xl space-y-6">
        <div className="card card-body">
          <p className="text-slate-600 mb-4">
            Ghi lại bữa ăn và calo (dữ liệu lưu trên trình duyệt). Sau này có thể kết nối API backend.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Món ăn / mô tả"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="Cơm trưa, bánh mì..."
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Calo (kcal)"
                type="number"
                min="0"
                value={form.calories}
                onChange={(e) => setForm({ ...form, calories: e.target.value })}
                placeholder="350"
                required
              />
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Bữa</label>
                <select
                  value={form.meal}
                  onChange={(e) => setForm({ ...form, meal: e.target.value })}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                >
                  <option value="breakfast">Sáng</option>
                  <option value="lunch">Trưa</option>
                  <option value="dinner">Tối</option>
                  <option value="snack">Phụ</option>
                </select>
              </div>
            </div>
            <Button type="submit">Thêm món</Button>
          </form>
        </div>

        <div className="card card-body">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <h2 className="text-lg font-semibold text-slate-900">Hôm nay</h2>
            <input
              type="date"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="px-3 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <p className="text-slate-600 mb-4">
            Tổng calo: <span className="font-bold text-emerald-600">{totalCal}</span> kcal
          </p>
          {filtered.length === 0 ? (
            <p className="text-slate-500 text-sm">Chưa có món nào. Thêm món ở form trên.</p>
          ) : (
            <ul className="space-y-2">
              {filtered.map((e) => (
                <li
                  key={e.id}
                  className="flex items-center justify-between py-2 border-b border-slate-100 last:border-0"
                >
                  <div>
                    <span className="font-medium text-slate-800">{e.name}</span>
                    <span className="ml-2 text-sm text-slate-500">{mealLabel[e.meal]} · {e.calories} kcal</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleDelete(e.id)}
                    className="text-slate-400 hover:text-rose-600 text-sm"
                  >
                    Xóa
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </PageLayout>
  );
};

export default FoodTracker;
