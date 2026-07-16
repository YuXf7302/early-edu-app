import { useState } from 'react';
import { ChildProfile } from '../components/profile/ChildProfile';
import { FontSizeToggle } from '../components/shared/FontSizeToggle';
import { Key } from 'lucide-react';

export function ProfilePage() {
  const [token, setToken] = useState(() => {
    try { return localStorage.getItem('early-edu-sync-token') || '' } catch { return '' }
  });

  const handleTokenChange = (val: string) => {
    setToken(val);
    try { localStorage.setItem('early-edu-sync-token', val) } catch {}
    // 刷新页面让同步模块读新的 token
    setTimeout(() => window.location.reload(), 500);
  };

  return (
    <div>
      <ChildProfile />
      <div className="px-4 pb-6">
        <div className="mt-2 pt-4 border-t border-warm-200">
          <FontSizeToggle />
        </div>

        {/* 同步密码设置 */}
        <div className="mt-4 pt-4 border-t border-warm-200">
          <label className="block text-sm font-medium text-warm-700 mb-2">
            🔑 同步密码
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={token}
              onChange={(e) => handleTokenChange(e.target.value)}
              placeholder="输入家人共享密码"
              className="flex-1 px-4 py-2.5 rounded-xl border border-warm-300 bg-white text-warm-800 focus:outline-none focus:ring-2 focus:ring-primary-400"
            />
          </div>
          <p className="text-xs text-warm-400 mt-1.5">
            {token ? '✅ 已设置同步密码，数据将通过密码加密传输' : '未设置密码，家人数据可被公开访问'}
          </p>
        </div>
      </div>
    </div>
  );
}
