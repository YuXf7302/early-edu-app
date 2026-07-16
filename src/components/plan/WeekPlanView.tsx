import { useEffect, useState, useMemo } from 'react';
import { useChildStore } from '../../stores/useChildStore';
import { usePlanStore } from '../../stores/usePlanStore';
import { db } from '../../db';
import { generateWeeklyPlan } from '../../engine/planGenerator';
import { DIMENSION_LABELS, DIMENSION_ICONS } from '../../constants';
import { getWeeklyBooks } from '../../engine/books';
import { getWeeklyMontessoriTip, MONTESSORI_PRACTICAL_LIFE } from '../../engine/montessori';
import { getDailyGrandparentPlan } from '../../engine/grandparent';
import { WeekDayCell } from './WeekDayCell';
import { getMondayString, parseLocalDate, addDays as _addDays } from '../../utils/date';
import {
  RefreshCw, ChevronLeft, ChevronRight, Eye, Sparkles, BarChart3,
  Package, BookOpen, Users, Lightbulb, ChevronDown, ChevronUp,
} from 'lucide-react';

function getWeekRange(monday: string) {
  const start = parseLocalDate(monday);
  const end = _addDays(start, 6);
  const fmt = (d: Date) => `${d.getMonth() + 1}月${d.getDate()}日`;
  return `${fmt(start)} - ${fmt(end)}`;
}

const DAY_LABELS = ['一', '二', '三', '四', '五', '六', '日'];
const VIBE_LABELS: Record<string, string> = {
  calm: '🌅 启动', push: '🔥 发力', easy: '🌿 轻松', deep: '🚀 深度',
};
const VIBE_COLORS: Record<string, string> = {
  calm: 'bg-blue-50 text-blue-600', push: 'bg-orange-50 text-orange-600',
  easy: 'bg-green-50 text-green-600', deep: 'bg-purple-50 text-purple-600',
};

export function WeekPlanView() {
  const { profile } = useChildStore();
  const { currentPlan, savePlan, loadWeek } = usePlanStore();
  const [monday, setMonday] = useState(getMondayString());
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewDay, setPreviewDay] = useState<string | null>(null);
  const [showSummary, setShowSummary] = useState(false);

  useEffect(() => {
    if (profile) loadWeek(monday);
  }, [monday, profile]);

  const handleGenerate = async (targetMonday: string = monday) => {
    if (!profile) return;
    setIsGenerating(true);
    try {
      const activities = await db.activities.toArray();
      const plan = generateWeeklyPlan(profile, activities, targetMonday);
      // savePlan 内部已经 set currentPlan，不需要再 setPlan
      await savePlan(plan);
    } catch (err) {
      console.error('[generate] 周计划生成失败:', err);
      window.alert('生成失败，请重试或查看控制台');
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePrevWeek = () => {
    const d = parseLocalDate(monday);
    d.setDate(d.getDate() - 7);
    setMonday(getMondayString(d));
  };

  const handleNextWeek = () => {
    const d = parseLocalDate(monday);
    d.setDate(d.getDate() + 7);
    setMonday(getMondayString(d));
  };

  const today = new Date();
  const tomorrowObj = new Date(today);
  tomorrowObj.setDate(tomorrowObj.getDate() + 1);
  const tomorrow = `${tomorrowObj.getFullYear()}-${String(tomorrowObj.getMonth() + 1).padStart(2, '0')}-${String(tomorrowObj.getDate()).padStart(2, '0')}`;
  const isSunday = today.getDay() === 0;
  const isThisWeek = monday === getMondayString();

  // 计算总结
  const summary = useMemo(() => {
    if (!currentPlan) return null;
    let total = 0, completed = 0;
    for (const day of currentPlan.days) {
      for (const act of day.activities) {
        total++;
        if (act.completed) completed++;
      }
    }
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, rate };
  }, [currentPlan]);

  if (!profile) {
    return (
      <div className="card text-center py-10">
        <p className="text-warm-500">请先设置孩子档案</p>
      </div>
    );
  }

  return (
    <div>
      {/* 周选择器 */}
      <div className="flex items-center justify-between mb-4">
        <button onClick={handlePrevWeek} className="p-2 text-warm-500 active:text-warm-700">
          <ChevronLeft size={20} />
        </button>
        <div className="text-center">
          <h2 className="font-semibold text-warm-800">{getWeekRange(monday)}</h2>
          <p className="text-xs text-warm-400">
            {monday === getMondayString() ? '本周' : '历史周'}
            {isThisWeek && isSunday && ' · 今天是周日 🎯'}
          </p>
        </div>
        <button onClick={handleNextWeek} className="p-2 text-warm-500 active:text-warm-700">
          <ChevronRight size={20} />
        </button>
      </div>

      {/* 生成按钮 */}
      {!currentPlan && (
        <button
          onClick={() => handleGenerate()}
          disabled={isGenerating}
          className="btn-primary w-full mb-4 flex items-center justify-center gap-2"
        >
          <RefreshCw size={18} className={isGenerating ? 'animate-spin' : ''} />
          {isGenerating ? '正在智能编排...' : '🤖 智能生成周计划'}
        </button>
      )}

      {currentPlan && (
        <>
          {/* 主题和目标 */}
          <div className="card bg-gradient-to-r from-primary-50 to-amber-50 border-primary-200 mb-4">
            <div className="flex items-start gap-2">
              <span className="text-xl">🎯</span>
              <div className="flex-1">
                <p className="text-sm font-semibold text-primary-700">{currentPlan.selfCareGoal}</p>
                <p className="text-xs text-primary-500 mt-0.5">本周聚焦：{currentPlan.selfCareSkill}</p>
              </div>
            </div>
            {/* 周节奏指示 */}
            <div className="flex gap-1 mt-3 pt-3 border-t border-primary-200">
              {currentPlan.days.map((day, i) => {
                const vibeKey = day.energyOverride === 'deep' ? 'deep'
                  : day.energyOverride === 'light' ? 'easy'
                  : i < 5 ? (i === 0 || i === 4 ? 'calm' : 'push') : 'deep';
                return (
                  <div
                    key={day.date}
                    className={`flex-1 text-center rounded-lg py-1.5 text-[10px] font-medium ${VIBE_COLORS[vibeKey] || 'bg-warm-50 text-warm-500'}`}
                  >
                    <div>{DAY_LABELS[i]}</div>
                    <div className="text-[9px] mt-0.5 opacity-70">{VIBE_LABELS[vibeKey]?.split(' ')[0]}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 明日预览 */}
          {currentPlan.days.find((d) => d.date === tomorrow) && (
            <button
              onClick={() => setPreviewDay(tomorrow)}
              className="card w-full mb-4 text-left bg-gradient-to-r from-blue-50 to-white border-blue-200 active:scale-[0.98] transition-transform"
            >
              <div className="flex items-center gap-2 mb-2">
                <Eye size={18} className="text-blue-500" />
                <span className="font-semibold text-blue-700">明天预览</span>
                <span className="text-xs text-blue-500 ml-auto">
                  {new Date(tomorrow + 'T00:00:00').toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' })}
                </span>
              </div>
              <TomorrowPreview plan={currentPlan} tomorrow={tomorrow} />
            </button>
          )}

          {/* 周日总结按钮 */}
          {isThisWeek && isSunday && summary && (
            <button
              onClick={() => setShowSummary(!showSummary)}
              className="card w-full mb-4 text-left bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 active:scale-[0.98]"
            >
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-green-600" />
                <span className="font-semibold text-green-700">📊 本周总结</span>
                <span className="text-xs text-green-500 ml-auto">
                  完成 {summary.completed}/{summary.total} ({summary.rate}%)
                </span>
              </div>
              {showSummary && (
                <div className="mt-3 pt-3 border-t border-green-200 text-sm text-green-700">
                  {summary.rate >= 80 && <p>🎉 太棒了！本周完成率 {summary.rate}%，宝宝进步明显！</p>}
                  {summary.rate >= 50 && summary.rate < 80 && <p>👍 本周完成了 {summary.completed} 个活动，保持节奏！</p>}
                  {summary.rate < 50 && <p>🧘 这周比较轻松，下周可以适当加量。每一小步都是成长。</p>}
                  <p className="mt-2 text-xs text-green-500">
                    建议：{isThisWeek ? '去首页生成本周计划，开始新的一周吧 →' : ''}
                  </p>
                  <button
                    onClick={async () => {
                      // 修复：用异步链保证先 setMonday 完成，再调 handleGenerate
                      // 避免闭包陷阱：显式传参
                      const newMonday = getMondayString();
                      setMonday(newMonday);
                      setShowSummary(false);
                      await handleGenerate(newMonday);
                    }}
                    className="btn-primary w-full mt-2 text-sm flex items-center justify-center gap-1"
                  >
                    <Sparkles size={14} />
                    生成本周计划
                  </button>
                </div>
              )}
            </button>
          )}

          {/* 7天总览 */}
          <div className="space-y-2">
            {currentPlan.days.map((day, i) => (
              <WeekDayCell
                key={day.date}
                day={day}
                dayIndex={i}
                isToday={day.date === today}
                isTomorrow={day.date === tomorrow}
                expanded={previewDay === day.date}
                onToggleExpand={() =>
                  setPreviewDay(previewDay === day.date ? null : day.date)
                }
              />
            ))}
          </div>

          {/* ====== 扩展资源卡片 ====== */}
          <div className="mt-4 space-y-2">
            <MaterialsCard plan={currentPlan} />
            <BooksCard theme={currentPlan.selfCareSkill} />
            <GrandparentCard />
            <MontessoriCard />
          </div>

          {/* 重新生成 */}
          <button
            onClick={() => handleGenerate()}
            disabled={isGenerating}
            className="btn-ghost w-full mt-4 text-sm flex items-center justify-center gap-1"
          >
            <RefreshCw size={14} className={isGenerating ? 'animate-spin' : ''} />
            重新生成
          </button>
        </>
      )}
    </div>
  );
}

// 明日预览
function TomorrowPreview({ plan, tomorrow }: { plan: any; tomorrow: string }) {
  const day = plan.days.find((d: any) => d.date === tomorrow);
  if (!day || day.activities.length === 0) return <p className="text-sm text-warm-400">明天暂无安排</p>;

  const required = day.activities.filter((a: any) => a.type === 'required');
  const optional = day.activities.filter((a: any) => a.type === 'optional');

  return (
    <div className="space-y-1 text-sm">
      {required.map((act: any) => (
        <ActivityName key={act.activityId} id={act.activityId} badge="必做" badgeColor="bg-coral-100 text-coral-600" />
      ))}
      {optional.map((act: any) => (
        <ActivityName key={act.activityId} id={act.activityId} badge="可选" badgeColor="bg-blue-50 text-blue-600" />
      ))}
    </div>
  );
}

function ActivityName({ id, badge, badgeColor }: { id: number; badge: string; badgeColor: string }) {
  const [title, setTitle] = useState('');
  const [dim, setDim] = useState('');
  useEffect(() => {
    db.activities.get(id).then((a) => {
      if (a) {
        setTitle(a.title);
        setDim(DIMENSION_ICONS[a.dimensionId] + ' ' + DIMENSION_LABELS[a.dimensionId]);
      }
    });
  }, [id]);

  return (
    <div className="flex items-center gap-2">
      <span className={`text-xs px-1.5 py-0.5 rounded ${badgeColor}`}>{badge}</span>
      <span className="text-warm-700 truncate">{title}</span>
      <span className="text-xs text-warm-400 ml-auto">{dim}</span>
    </div>
  );
}

// ====== 材料清单卡片 ======
function MaterialsCard({ plan }: { plan: any }) {
  const [open, setOpen] = useState(false);
  const [materials, setMaterials] = useState<string[]>([]);

  useEffect(() => {
    const allIds = plan.days.flatMap((d: any) => d.activities.map((a: any) => a.activityId));
    const unique = [...new Set(allIds)] as number[];
    Promise.all(unique.map((id) => db.activities.get(id))).then((acts) => {
      const mats = new Set<string>();
      acts.filter(Boolean).forEach((a) => a!.materials.forEach((m: string) => mats.add(m)));
      setMaterials([...mats]);
    });
  }, [plan]);

  return (
    <CollapsibleCard
      open={open}
      onToggle={() => setOpen(!open)}
      icon={<Package size={16} />}
      title="📦 本周材料清单（提前准备）"
      badge={materials.length > 0 ? `${materials.length}项` : undefined}
    >
      {materials.length === 0 ? (
        <p className="text-xs text-warm-500">本周活动无需特殊材料</p>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {materials.map((m) => (
            <span key={m} className="text-xs bg-warm-100 text-warm-600 px-2 py-1 rounded-full">{m}</span>
          ))}
        </div>
      )}
    </CollapsibleCard>
  );
}

// ====== 绘本推荐卡片 ======
function BooksCard({ theme }: { theme?: string }) {
  const [open, setOpen] = useState(false);
  const books = useMemo(() => getWeeklyBooks(theme, 3), [theme]);

  return (
    <CollapsibleCard
      open={open}
      onToggle={() => setOpen(!open)}
      icon={<BookOpen size={16} />}
      title="📚 本周绘本推荐"
      badge={books.length > 0 ? `${books.length}本` : undefined}
    >
      <div className="space-y-2">
        {books.map((b) => (
          <div key={b.title} className="text-xs">
            <span className="font-medium text-warm-700">{b.title}</span>
            <span className="text-warm-400"> — {b.author}</span>
            <p className="text-warm-500 mt-0.5">{b.why}</p>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}

// ====== 老人白天指引卡片 ======
function GrandparentCard() {
  const [open, setOpen] = useState(false);
  const activities = useMemo(() => getDailyGrandparentPlan(), []);

  return (
    <CollapsibleCard
      open={open}
      onToggle={() => setOpen(!open)}
      icon={<Users size={16} />}
      title="👵 老人白天早教指引"
      subtitle="简单易行，无需屏幕"
    >
      <p className="text-xs text-warm-500 mb-2">以下是今天推荐的活动，老人可以随时穿插在日常生活中：</p>
      <div className="space-y-2">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-2 text-xs">
            <span className="text-warm-400 mt-0.5">{a.when}</span>
            <div className="flex-1">
              <span className="font-medium text-warm-700">{a.title}</span>
              {a.englishWord && (
                <span className="text-blue-500 ml-1">({a.englishWord})</span>
              )}
              <p className="text-warm-500">{a.instructions}</p>
              <p className="text-primary-500 mt-0.5">💡 {a.tip}</p>
            </div>
          </div>
        ))}
      </div>
    </CollapsibleCard>
  );
}

// ====== 蒙氏小贴士卡片 ======
function MontessoriCard() {
  const [open, setOpen] = useState(false);
  const tip = useMemo(() => getWeeklyMontessoriTip(), []);

  return (
    <CollapsibleCard
      open={open}
      onToggle={() => setOpen(!open)}
      icon={<Lightbulb size={16} />}
      title="🏫 蒙氏小贴士"
    >
      <p className="text-xs text-warm-600 mb-3">{tip}</p>
      <p className="text-xs text-warm-500 font-medium mb-1">入园前可练习的日常生活技能：</p>
      <div className="flex flex-wrap gap-1.5">
        {MONTESSORI_PRACTICAL_LIFE.slice(0, 5).map((m) => (
          <span key={m.name} className="text-xs bg-purple-50 text-purple-600 px-2 py-1 rounded-full">
            {m.name}
          </span>
        ))}
      </div>
    </CollapsibleCard>
  );
}

// ====== 通用可折叠卡片 ======
function CollapsibleCard({
  open, onToggle, icon, title, subtitle, badge, children,
}: {
  open: boolean; onToggle: () => void;
  icon: React.ReactNode; title: string; subtitle?: string; badge?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card">
      <button onClick={onToggle} className="w-full flex items-center gap-2 text-left">
        <span className="text-warm-500">{icon}</span>
        <span className="text-sm font-medium text-warm-700 flex-1">{title}</span>
        {subtitle && <span className="text-xs text-warm-400">{subtitle}</span>}
        {badge && <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded-full">{badge}</span>}
        {open ? <ChevronUp size={16} className="text-warm-400" /> : <ChevronDown size={16} className="text-warm-400" />}
      </button>
      {open && <div className="mt-3 pt-3 border-t border-warm-100">{children}</div>}
    </div>
  );
}
