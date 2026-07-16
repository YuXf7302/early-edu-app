import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Calendar, BookOpen, BarChart3, User } from 'lucide-react';
import { useAppStore } from '../../stores/useAppStore';

const tabs = [
  { path: '/', icon: Home, label: '今日' },
  { path: '/plan', icon: Calendar, label: '计划' },
  { path: '/resources', icon: BookOpen, label: '资源' },
  { path: '/dashboard', icon: BarChart3, label: '看板' },
  { path: '/profile', icon: User, label: '设置' },
];

export function TabBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const fontSize = useAppStore((s) => s.fontSize);
  const iconSize = fontSize === 'xl' ? 32 : fontSize === 'large' ? 28 : 24;

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-warm-200 z-50"
         style={{ maxWidth: '480px', margin: '0 auto' }}>
      <div className="flex items-center justify-around h-20 px-2 pb-2">
        {tabs.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center gap-1 min-w-0 flex-1 py-2 transition-colors rounded-xl active:bg-warm-100 ${
                isActive ? 'text-primary-500' : 'text-warm-400'
              }`}
            >
              <Icon size={iconSize} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-sm font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
