import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useAppStore } from '../../stores/useAppStore';

export function AppLayout() {
  const fontSize = useAppStore((s) => s.fontSize);

  // Tailwind 动态类名 font-size-{size} 会被 Tree-shaking 去掉
  // 改用 inline style 确保字体缩放生效
  const sizeMap = { normal: '14px', large: '18px', xl: '22px' };

  return (
    <div className="flex flex-col h-screen bg-warm-50" style={{ fontSize: sizeMap[fontSize] }}>
      <Outlet />
      <TabBar />
    </div>
  );
}
