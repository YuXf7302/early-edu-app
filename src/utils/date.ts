// ====== 本地日期工具（避免 toISOString 的 UTC 偏移问题） ======

/** 取本地零点（不依赖 UTC） */
function startOfLocalDay(d?: Date): Date {
  const x = d ? new Date(d) : new Date();
  x.setHours(0, 0, 0, 0);
  return x;
}

/** 把 Date 序列化为本地日期字符串 "YYYY-MM-DD"（不受时区影响） */
export function formatLocalDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** 从 "YYYY-MM-DD" 解析为本地零点 Date */
export function parseLocalDate(s: string): Date {
  const [y, m, d] = s.split('-').map(Number);
  return new Date(y, (m || 1) - 1, d || 1, 0, 0, 0, 0);
}

/** 取本周一（本地） */
export function getMonday(input?: Date | string): Date {
  const base = typeof input === 'string' ? parseLocalDate(input) : (input ? new Date(input) : new Date());
  const d = startOfLocalDay(base);
  const day = d.getDay(); // 0=Sun, 1=Mon ... 6=Sat
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return d;
}

/** 取本周一的本地日期字符串 "YYYY-MM-DD" */
export function getMondayString(input?: Date | string): string {
  return formatLocalDate(getMonday(input));
}

/** 给一个 Date 加 n 天，返回新 Date（不修改原对象） */
export function addDays(d: Date, n: number): Date {
  const r = new Date(d);
  r.setDate(r.getDate() + n);
  return r;
}

/** 今日本地日期字符串 */
export function todayString(): string {
  return formatLocalDate(new Date());
}
