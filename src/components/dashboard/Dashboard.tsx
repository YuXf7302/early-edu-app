import { useEffect, useMemo, useState } from 'react';
import { usePlanStore } from '../../stores/usePlanStore';
import { useChildStore } from '../../stores/useChildStore';
import { useAppStore, type FontSizeMode } from '../../stores/useAppStore';
import { db } from '../../db';
import { DIMENSION_LABELS, DIMENSION_ICONS, DIMENSION_COLORS, type DimensionId } from '../../constants';
import { Target, CalendarCheck, TrendingUp, Sun, Moon, SunMoon } from 'lucide-react';

export function Dashboard() {
  const { currentPlan, loadWeek } = usePlanStore();
  const { profile, loadProfile } = useChildStore();
  const [activityMap, setActivityMap] = useState<Record<number, DimensionId>>({});

  useEffect(() => {
    loadProfile();
    const monday = getMonday();
    loadWeek(monday);
  }, []);

  useEffect(() => {
    db.activities.toArray().then((acts) => {
      const map: Record<number, DimensionId> = {};
      for (const a of acts) {
        if (a.id) map[a.id] = a.dimensionId;
      }
      setActivityMap(map);
    });
  }, []);

  const stats = useMemo(() => {
    if (!currentPlan) return null;
    let total = 0;
    let completed = 0;
    const dimCounts: Record<DimensionId, { total: number; completed: number }> = {} as any;
    for (const dim of Object.keys(DIMENSION_LABELS) as DimensionId[]) {
      dimCounts[dim] = { total: 0, completed: 0 };
    }
    const dayData: { date: string; dayLabel: string; total: number; completed: number }[] = [];

    for (const day of currentPlan.days) {
      const d = new Date(day.date + 'T00:00:00');
      let dt = 0;
      let dc = 0;
      for (const act of day.activities) {
        total++;
        dt++;
        if (act.completed) {
          completed++;
          dc++;
        }
        const dim = activityMap[act.activityId];
        if (dim) {
          dimCounts[dim].total++;
          if (act.completed) dimCounts[dim].completed++;
        }
      }
      dayData.push({
        date: day.date,
        dayLabel: ['日', '一', '二', '三', '四', '五', '六'][d.getDay()],
        total: dt,
        completed: dc,
      });
    }

    return { total, completed, dimCounts, dayData };
  }, [currentPlan, activityMap]);

  if (!profile) {
    return (
      <div className="text-center py-10">
        <p className="text-warm-500">请先设置孩子档案</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-10">
        <p className="text-warm-500">请先生成本周计划</p>
      </div>
    );
  }

  const { total, completed, dimCounts, dayData } = stats;
  const weekRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const selfCare = dimCounts.selfCare;
  const selfCareRate = selfCare.total > 0 ? Math.round((selfCare.completed / selfCare.total) * 100) : 0;

  return (
    <div className="space-y-4">
      {/* 顶部指标卡 */}
      <div className="grid grid-cols-3 gap-3">
        <StatCard icon={<CalendarCheck size={24} />} label="周完成率" value={`${weekRate}%`} color="#f97316" />
        <StatCard icon={<Target size={24} />} label="自理进度" value={`${selfCareRate}%`} color="#22c55e" />
        <StatCard icon={<TrendingUp size={24} />} label="活动数" value={`${completed}/${total}`} color="#3b82f6" />
      </div>

      {/* ====== 复盘：每日完成情况 ====== */}
      <div className="card">
        <h3 className="text-base font-semibold text-warm-700 mb-3">📋 每日复盘</h3>
        <div className="space-y-2">
          {dayData.map((d) => {
            const rate = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
            const color = rate >= 80 ? 'bg-green-500'
              : rate >= 40 ? 'bg-amber-500'
              : rate === 0 ? 'bg-gray-300'
              : 'bg-red-400';
            return (
              <div key={d.date} className="flex items-center gap-3">
                <span className="w-6 text-center text-sm font-medium text-warm-600">{d.dayLabel}</span>
                <div className="flex-1 h-7 bg-warm-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${color}`}
                    style={{ width: `${rate}%`, minWidth: rate > 0 ? '1.5rem' : '0' }}
                  />
                </div>
                <span className="w-12 text-right text-xs text-warm-500">
                  {d.completed}/{d.total}
                </span>
                <span className="w-10 text-right text-sm font-medium"
                  style={{ color: rate >= 80 ? '#22c55e' : rate >= 40 ? '#f97316' : '#ef4444' }}>
                  {rate}%
                </span>
              </div>
            );
          })}
        </div>

        {/* 复盘结论 */}
        <div className="mt-4 pt-3 border-t border-warm-100">
          <ReviewInsights dayData={dayData} weekRate={weekRate} total={total} completed={completed} />
        </div>
      </div>

      {/* 维度热力图 */}
      <div className="card">
        <h3 className="text-base font-semibold text-warm-700 mb-3">📊 本周维度覆盖</h3>
        <HeatmapGrid dimCounts={dimCounts} dayData={dayData} activityMap={activityMap} plan={currentPlan} />
      </div>

      {/* 自理目标 */}
      <div className="card">
        <h3 className="text-base font-semibold text-warm-700 mb-2">🎯 自理目标</h3>
        <p className="text-sm text-warm-500 mb-3">{currentPlan?.selfCareGoal}</p>
        <div className="w-full bg-warm-200 rounded-full h-4 overflow-hidden">
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${selfCareRate}%`, backgroundColor: '#22c55e' }} />
        </div>
        <div className="flex justify-between mt-1">
          <span className="text-xs text-warm-400">{selfCare.completed}/{selfCare.total} 次</span>
          <span className="text-xs text-green-500 font-medium">{selfCareRate}%</span>
        </div>
      </div>

      {/* 亮点 */}
      <div className="card bg-amber-50 border-amber-200">
        <h3 className="text-base font-semibold text-amber-700 mb-1">🏆 本周亮点</h3>
        {weekRate >= 80 ? (
          <p className="text-sm text-amber-700">本周完成率 {weekRate}%，太棒了！</p>
        ) : weekRate >= 40 ? (
          <p className="text-sm text-amber-700">保持节奏！每一点进步都值得记录。</p>
        ) : (
          <p className="text-sm text-amber-700">新的一周刚开始，慢慢来，不着急。</p>
        )}
      </div>
    </div>
  );
}

// 复盘结论组件
function ReviewInsights({ dayData, weekRate, total, completed }: {
  dayData: { date: string; dayLabel: string; total: number; completed: number }[];
  weekRate: number;
  total: number;
  completed: number;
}) {
  // 找出完成率最高的天和最低的天
  const best = [...dayData].sort((a, b) => (b.completed / Math.max(b.total, 1)) - (a.completed / Math.max(a.total, 1)))[0];
  const worst = [...dayData].sort((a, b) => (a.completed / Math.max(a.total, 1)) - (b.completed / Math.max(b.total, 1)))[0];
  const emptyDays = dayData.filter(d => d.total === 0);

  return (
    <div className="text-sm text-warm-600 space-y-1">
      {weekRate >= 80 && <p className="text-green-600 font-medium">✅ 这周很棒，宝宝适应得很好！</p>}
      {weekRate >= 40 && weekRate < 80 && <p className="text-amber-600 font-medium">📈 还有进步空间，下周继续加油</p>}
      {weekRate < 40 && total > 0 && <p className="text-orange-600 font-medium">🧘 这周活动量较少，下周可以试试多安排一些</p>}
      {total === 0 && <p className="text-warm-500">还没有开始打卡哦，去首页开始今天的活动吧</p>}

      {best && best.completed > 0 && best.total > 0 && (
        <p>👍 <strong>周{best.dayLabel}</strong> 完成最好（{Math.round(best.completed/best.total*100)}%）</p>
      )}
      {worst && worst.total > 0 && worst.completed === 0 && (
        <p>💪 <strong>周{worst.dayLabel}</strong> 还没开始，今天试试做一两个活动</p>
      )}
      {emptyDays.length > 0 && (
        <p>📅 有 {emptyDays.length} 天没有安排活动，可以去「计划」里生成</p>
      )}
      {completed > 0 && (
        <p className="text-green-600 font-medium mt-2">
          🎉 本周完成了 {completed} 个活动，继续保持！
        </p>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, color }: { icon: React.ReactNode; label: string; value: string; color: string }) {
  return (
    <div className="card text-center">
      <div className="text-2xl mb-1" style={{ color }}>{icon}</div>
      <div className="text-lg font-bold text-warm-800">{value}</div>
      <div className="text-xs text-warm-500">{label}</div>
    </div>
  );
}

// 热力图
function HeatmapGrid({ dayData, activityMap, plan }: {
  dimCounts: Record<DimensionId, { total: number; completed: number }>;
  dayData: { date: string; dayLabel: string; total: number; completed: number }[];
  activityMap: Record<number, DimensionId>;
  plan: any;
}) {
  const dims = Object.keys(DIMENSION_LABELS) as DimensionId[];
  const grid: Record<string, Record<DimensionId, { total: number; completed: number }>> = {};

  for (const day of dayData) {
    grid[day.date] = {} as any;
    for (const dim of dims) grid[day.date][dim] = { total: 0, completed: 0 };
  }

  for (const day of plan.days) {
    for (const act of day.activities) {
      const dim = activityMap[act.activityId];
      if (dim && grid[day.date]) {
        grid[day.date][dim].total++;
        if (act.completed) grid[day.date][dim].completed++;
      }
    }
  }

  return (
    <div className="overflow-x-auto scrollbar-hide">
      <div className="inline-grid gap-1" style={{ gridTemplateColumns: `auto repeat(${dayData.length}, 1fr)` }}>
        <div className="w-16" />
        {dayData.map((d) => <div key={d.date} className="w-8 text-center"><div className="text-[10px] text-warm-400">{d.dayLabel}</div></div>)}

        {dims.map((dim) => (
          <div key={dim} className="contents">
            <div className="flex items-center gap-1 py-1 pr-1">
              <span className="text-xs">{DIMENSION_ICONS[dim]}</span>
              <span className="text-[10px] text-warm-500 truncate">{DIMENSION_LABELS[dim]}</span>
            </div>
            {dayData.map((d) => {
              const cell = grid[d.date]?.[dim] ?? { total: 0, completed: 0 };
              const opacity = cell.total > 0 ? (cell.completed === cell.total ? 1 : 0.3 + (cell.completed / cell.total) * 0.4) : 0;
              return (
                <div key={`${d.date}-${dim}`} className="w-8 h-7 flex items-center justify-center">
                  <div className="w-6 h-5 rounded" style={{ backgroundColor: cell.total > 0 ? DIMENSION_COLORS[dim] : '#f5f5f4', opacity: cell.total > 0 ? Math.max(opacity, 0.15) : 1 }}
                    title={`${DIMENSION_LABELS[dim]}: ${cell.completed}/${cell.total}`} />
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function getMonday(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split('T')[0];
}
