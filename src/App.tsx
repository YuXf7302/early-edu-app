import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/layout/AppLayout';
import { HomePage } from './pages/HomePage';
import { PlanPage } from './pages/PlanPage';
import { RecordPage } from './pages/RecordPage';
import { ResourcesPage } from './pages/ResourcesPage';
import { DashboardPage } from './pages/DashboardPage';
import { ProfilePage } from './pages/ProfilePage';
import { syncInit, syncSubscribe } from './utils/sync';
import { useChildStore } from './stores/useChildStore';
import { usePlanStore } from './stores/usePlanStore';

function App() {
  const { loadProfile } = useChildStore();
  const { loadWeek } = usePlanStore();

  useEffect(() => {
    (async () => {
      const data = await syncInit();
      if (data?.profiles?.default) {
        const { applyRemoteProfile } = useChildStore.getState();
        applyRemoteProfile(data.profiles.default);
      }
      if (data?.plans) {
        const keys = Object.keys(data.plans);
        if (keys.length > 0) {
          usePlanStore.getState().setPlan(data.plans[keys[keys.length - 1]]);
        }
      }
    })();

    const unsub = syncSubscribe((data) => {
      // 远端数据 → 直接 setState，不触发 saveProfile（避免无限推送回环）
      if (data.profiles?.default) {
        useChildStore.getState().applyRemoteProfile(data.profiles.default);
      }
      if (data.plans) {
        const keys = Object.keys(data.plans);
        if (keys.length > 0) {
          usePlanStore.getState().setPlan(data.plans[keys[keys.length - 1]]);
        }
      }
    });
    return () => unsub();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/plan" element={<PlanPage />} />
          <Route path="/record" element={<RecordPage />} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
