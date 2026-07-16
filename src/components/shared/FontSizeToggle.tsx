import { useAppStore, type FontSizeMode } from '../../stores/useAppStore';
import { Sun, Moon, SunMoon } from 'lucide-react';

export function FontSizeToggle() {
  const { fontSize, setFontSize } = useAppStore();
  const options: { key: FontSizeMode; label: string; icon: React.ReactNode }[] = [
    { key: 'normal', label: '标准', icon: <SunMoon size={18} /> },
    { key: 'large', label: '大号', icon: <Sun size={18} /> },
    { key: 'xl', label: '特大', icon: <Moon size={18} /> },
  ];

  return (
    <div>
      <label className="block text-sm font-medium text-warm-700 mb-2">🔤 字体大小</label>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt.key}
            onClick={() => setFontSize(opt.key)}
            className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-sm font-medium transition-all flex-1 justify-center ${
              fontSize === opt.key
                ? 'bg-primary-500 text-white shadow-sm'
                : 'bg-warm-100 text-warm-600 hover:bg-warm-200'
            }`}
          >
            {opt.icon}
            {opt.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-warm-400 mt-1.5">
        {fontSize === 'normal' ? '标准大小' : fontSize === 'large' ? '大字模式，适合老人使用' : '特大字，看得更清楚'}
      </p>
    </div>
  );
}
