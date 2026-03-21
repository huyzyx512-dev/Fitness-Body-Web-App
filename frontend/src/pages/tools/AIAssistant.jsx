import { useState, useRef, useEffect } from 'react';
import PageLayout from '../../components/layout/PageLayout.jsx';
import Button from '../../components/common/Button.jsx';

const placeholderResponses = [
  'Tính năng AI đang được phát triển. Bạn có thể hỏi về tập luyện, dinh dưỡng hoặc BMI. Tôi sẽ trả lời sớm nhất khi API được kết nối.',
  'Ví dụ: "Làm sao để tăng cơ?", "Calo một ngày nên ăn bao nhiêu?", "Bài tập nào tốt cho vai?"',
];

const AIAssistant = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Xin chào! Tôi là trợ lý thể hình. Bạn muốn hỏi gì về tập luyện, dinh dưỡng hay sức khỏe? (Lưu ý: phản hồi AI thật sẽ có khi backend tích hợp API.)' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || loading) return;
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: text }]);
    setLoading(true);
    // Simulate delay – replace with real API call later
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: placeholderResponses[Math.floor(Math.random() * placeholderResponses.length)] },
      ]);
      setLoading(false);
    }, 800);
  };

  return (
    <PageLayout title="Trợ lý AI">
      <div className="max-w-3xl mx-auto">
        <div className="card overflow-hidden flex flex-col" style={{ minHeight: '420px' }}>
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 ${
                    m.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-100 text-slate-800'
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap">{m.content}</p>
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                  <span className="text-slate-500 text-sm">Đang suy nghĩ...</span>
                </div>
              </div>
            )}
            <div ref={bottomRef} />
          </div>
          <form onSubmit={handleSubmit} className="p-4 border-t border-slate-200 bg-slate-50/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Nhập câu hỏi..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                disabled={loading}
              />
              <Button type="submit" disabled={loading || !input.trim()}>
                Gửi
              </Button>
            </div>
          </form>
        </div>
      </div>
    </PageLayout>
  );
};

export default AIAssistant;
