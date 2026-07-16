import { Outlet } from 'react-router-dom';
import { TabBar } from './TabBar';
import { useAppStore } from '../../stores/useAppStore';

export function AppLayout() {
  const fontSize = useAppStore((s) => s.fontSize);
  const sizeMap = { normal: '14px', large: '18px', xl: '22px' };
  return (
    <div className="app-shell flex min-h-0 flex-col overflow-hidden bg-warm-50" style={{ fontSize: sizeMap[fontSize] }}>
      <Outlet />
      <TabBar />
    </div>
  );
}
