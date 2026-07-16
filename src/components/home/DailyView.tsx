import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useChildStore } from '../../stores/useChildStore';
import { usePlanStore } from '../../stores/usePlanStore';
import { ActivityCard } from './ActivityCard';
import { EnergyToggle } from './EnergyToggle';
import { TomorrowPreview } from './TomorrowPreview';
import { getMondayString } from '../../utils/date';

export function DailyView() {
  const navigate = useNavigate();
  const { profile, isFirstLaunch, loadProfile } = useChildStore();
  const { currentPlan, loadWeek, getTodayPlan, toggleComplete } = usePlanStore();

  useEffect(() => {
    loadProfile();
  }, []);

  // 加载本周计划
  useEffect(() => {
    if (profile) {
      loadWeek(getMondayString());
    }
  }, [profile]);

  const todayPlan = getTodayPlan();
  const todayActivities = todayPlan?.activities ?? [];

  const handleToggle = async (date: string, idx: number) => {
    await toggleComplete(date, idx);
  };

  // 首次启动 / 无档案
  if (isFirstLaunch || !profile) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-warm-800">今日活动</h1>
            <p className="text-sm text-warm-500 mt-0.5">
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long', day: 'numeric', weekday: 'long',
              })}
            </p>
          </div>
        </div>

        <div className="card text-center py-10">
          <div className="text-5xl mb-3">🧒</div>
          <h2 className="text-lg font-semibold text-warm-700 mb-2">欢迎使用早教计划助手</h2>
          <p className="text-warm-500 mb-6 text-sm">设置宝宝档案，开始个性化早教之旅</p>
          <button onClick={() => navigate('/profile')} className="btn-primary">
            开始设置 →
          </button>
        </div>
      </div>
    );
  }

  // 有档案但无本周计划
  if (!currentPlan) {
    return (
      <div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-bold text-warm-800">今日活动</h1>
            <p className="text-sm text-warm-500 mt-0.5">
              {new Date().toLocaleDateString('zh-CN', {
                month: 'long', day: 'numeric', weekday: 'long',
              })}
            </p>
          </div>
        </div>

        <div className="card text-center py-10">
          <div className="text-5xl mb-3">📋</div>
          <h2 className="text-lg font-semibold text-warm-700 mb-2">还没有本周计划</h2>
          <p className="text-warm-500 mb-6 text-sm">去周计划页面生成一份吧</p>
          <button onClick={() => navigate('/plan')} className="btn-primary">
            去生成计划 →
          </button>
        </div>
      </div>
    );
  }

  // 正常日视图
  const completed = todayActivities.filter((a: { completed: boolean }) => a.completed).length;
  const total = todayActivities.length;

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <div>
          <h1 className="text-xl font-bold text-warm-800">今日活动</h1>
          <p className="text-sm text-warm-500 mt-0.5">
            {new Date().toLocaleDateString('zh-CN', {
              month: 'long', day: 'numeric', weekday: 'long',
            })}
          </p>
        </div>
        <div className="text-right">
          <div className={`text-2xl font-bold ${completed === total && total > 0 ? 'text-green-500' : 'text-primary-500'}`}>
            {completed}/{total}
          </div>
          <div className="text-xs text-warm-400">已完成</div>
        </div>
      </div>

      <EnergyToggle />

      {todayActivities.length === 0 ? (
        <div className="card text-center py-8 mt-4">
          <p className="text-warm-500">今天没有安排活动，休息一下吧 🧘</p>
        </div>
      ) : (
        <div className="space-y-3 mt-4">
          {todayActivities.map((act: { activityId: number; type: 'required' | 'optional'; completed: boolean }, idx: number) => (
            <ActivityCard
              key={idx}
              activityId={act.activityId}
              type={act.type}
              completed={act.completed}
              onToggle={() => handleToggle(todayPlan!.date, idx)}
            />
          ))}
        </div>
      )}

      {/* 明日预览 */}
      <TomorrowPreview plan={currentPlan} />
    </div>
  );
}

// getMonday 已统一到 utils/date.ts（getMondayString）
