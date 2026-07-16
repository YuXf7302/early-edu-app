import { useState } from 'react';
import { ChildProfile } from '../components/profile/ChildProfile';
import { FontSizeToggle } from '../components/shared/FontSizeToggle';

const TOKEN_KEY = 'early-edu-sync-token';

export function ProfilePage() {
  const [token, setToken] = useState(() => { try { return localStorage.getItem(TOKEN_KEY) || '' } catch { return '' } });
  const [savedToken, setSavedToken] = useState(token);

  const saveToken = () => {
    const next = token.trim();
    try {
      if (next) localStorage.setItem(TOKEN_KEY, next); else localStorage.removeItem(TOKEN_KEY);
      setToken(next);
      setSavedToken(next);
    } catch {}
  };

  return (
    <main className="page-container">
      <ChildProfile />
      <section className="mt-6 border-t border-warm-200 pt-6">
        <FontSizeToggle />
      </section>
      <section className="mt-6 border-t border-warm-200 pt-6 pb-4">
        <label htmlFor="sync-token" className="mb-2 block text-sm font-medium text-warm-700">🔑 同步密码</label>
        <input
          id="sync-token" type="password" value={token}
          onChange={e => setToken(e.target.value)}
          onBlur={saveToken}
          onKeyDown={e => { if (e.key === 'Enter') e.currentTarget.blur() }}
          placeholder="输入家人共享密码"
          autoComplete="off"
          className="w-full rounded-xl border border-warm-300 bg-white px-4 py-3 text-warm-800 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-primary-400"
        />
        <p className="mt-2 text-xs text-warm-400">
          {token !== savedToken ? '⚠️ 密码尚未保存，离开输入框后自动保存'
           : savedToken ? '✅ 同步密码已保存，将用于验证同步请求'
           : '未设置同步密码'}
        </p>
      </section>
    </main>
  );
}
