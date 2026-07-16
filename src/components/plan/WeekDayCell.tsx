import { useEffect, useState, useCallback } from 'react';
import { db } from '../../db';
import { usePlanStore } from '../../stores/usePlanStore';
import {
  ENERGY_LABELS, type EnergyMode,
} from '../../constants';
import type { DayPlan, DayActivity } from '../../types';
import { Check, Circle, ChevronDown, ChevronUp, Zap, Battery, Flame, Shuffle, RefreshCw } from 'lucide-react';

const DAY_LABELS = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

const ENERGY_ICONS: Record<EnergyMode, typeof Zap> = {
  light: Battery,
  standard: Zap,
  deep: Flame,
};

interface Props {
  day: DayPlan;
  dayIndex: number;
  isToday: boolean;
  isTomorrow: boolean;
  expanded: boolean;
  onToggleExpand: () => void;
}

const VIBE_LABELS: Record<number, string> = {
  0: '🌅', 1: '🔥', 2: '🔥', 3: '🔥', 4: '🌿', 5: '🚀', 6: '🌅',
};

export function WeekDayCell({ day, dayIndex, isToday, isTomorrow, expanded, onToggleExpand }: Props) {
  const { toggleComplete, replaceActivity, regenerateDay } = usePlanStore();
  const date = new Date(day.date + 'T00:00:00');
  const dayLabel = DAY_LABELS[date.getDay()];
  const monthDay = `${date.getMonth() + 1}/${date.getDate()}`;
  const completed = day.activities.filter((a) => a.completed).length;
  const total = day.activities.length;

  const energy: EnergyMode = day.energyOverride ?? (day.mode === 'weekend' ? 'deep' : 'standard');
  const EnergyIcon = ENERGY_ICONS[energy];

  return (
    <div
      className={`card transition-all ${
        isToday ? 'ring-2 ring-primary-400 shadow-md' : ''
      } ${isTomorrow ? 'border-blue-300 bg-blue-50/30' : ''}`}
    >
      {/* 头部：可点击展开 */}
      <button
        onClick={onToggleExpand}
        className="w-full flex items-center gap-3 text-left"
      >
        {/* 日期 */}
        <div className={`w-10 h-10 rounded-xl flex flex-col items-center justify-center text-xs ${
          isToday ? 'bg-primary-500 text-white' : 'bg-warm-100 text-warm-600'
        }`}>
          <span className="font-bold text-sm">{monthDay.split('/')[1]}</span>
          <span className="text-[10px]">{dayLabel}</span>
        </div>

        {/* 标签 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            {isToday && <span className="text-xs bg-primary-100 text-primary-600 px-1.5 py-0.5 rounded font-medium">今天</span>}
            {isTomorrow && <span className="text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 rounded font-medium">明天</span>}
            <span className="text-xs text-warm-400 flex items-center gap-0.5">
              <span className="text-[11px]">{VIBE_LABELS[dayIndex] ?? ''}</span>
              <EnergyIcon size={12} />
              {ENERGY_LABELS[energy]}
            </span>
          </div>
          <div className="text-xs text-warm-500 mt-0.5">
            {total > 0 ? `${completed}/${total} 完成` : '暂无活动'}
          </div>
        </div>

        {/* 进度环 */}
        {total > 0 && (
          <div className="flex-shrink-0">
            <svg width="28" height="28" viewBox="0 0 36 36">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#e7e5e4" strokeWidth="4" />
              <circle
                cx="18" cy="18" r="14" fill="none"
                stroke={completed === total ? '#22c55e' : '#f97316'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(completed / Math.max(total, 1)) * 88} 88`}
                transform="rotate(-90 18 18)"
              />
              <text x="18" y="22" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#44403c">
                {completed}/{total}
              </text>
            </svg>
          </div>
        )}

        <div className="text-warm-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </button>

      {/* 展开的活动列表 */}
      {expanded && (
        <div className="mt-3 pt-3 border-t border-warm-100 space-y-2 animate-slide-up">
          {day.activities.length === 0 ? (
            <p className="text-sm text-warm-400 text-center py-3">休息日 🧘</p>
          ) : (
            <>
              {day.activities.map((act, idx) => (
                <DayActivityRow
                  key={idx}
                  activity={act}
                  dayDate={day.date}
                  actIdx={idx}
                  onToggle={() => toggleComplete(day.date, idx)}
                  onReplace={(newId) => replaceActivity(day.date, idx, newId)}
                />
              ))}
              {/* 换一天按钮 */}
              <button
                onClick={() => regenerateDay(dayIndex)}
                className="w-full mt-2 text-xs text-warm-400 hover:text-primary-500 flex items-center justify-center gap-1 py-1.5 rounded-lg hover:bg-warm-50 transition-colors"
              >
                <RefreshCw size={12} />
                换一批活动
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// 单日活动行（可打卡 + 可选切换）
function DayActivityRow({
  activity, dayDate, actIdx, onToggle, onReplace,
}: {
  activity: DayActivity;
  dayDate: string;
  actIdx: number;
  onToggle: () => void;
  onReplace: (newId: number) => void;
}) {
  const [detail, setDetail] = useState<any>(null);
  const [alternatives, setAlternatives] = useState<any[]>([]);
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
    db.activities.get(activity.activityId).then(setDetail);
    if (activity.type === 'optional') {
      db.activities.get(activity.activityId).then((a) => {
        if (a) {
          // 找同维度的其他活动，随机取 3 个
          db.activities
            .where('dimensionId')
            .equals(a.dimensionId)
            .filter((x) => x.id !== a.id)
            .toArray()
            .then((all) => {
              const shuffled = all.sort(() => Math.random() - 0.5);
              setAlternatives(shuffled.slice(0, 3));
            });
        }
      });
    }
  }, [activity.activityId]);

  if (!detail) return null;

  return (
    <div>
      <div className="flex items-center gap-2">
        {/* 打卡按钮 */}
        <button
          onClick={onToggle}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
            activity.completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-warm-300 hover:border-primary-400'
          }`}
        >
          {activity.completed ? <Check size={13} strokeWidth={3} /> : <Circle size={11} />}
        </button>

        <span
          className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
            activity.type === 'required' ? 'bg-coral-100 text-coral-600' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {activity.type === 'required' ? '必做' : '可选'}
        </span>

        <span className={`text-sm flex-1 truncate ${activity.completed ? 'line-through text-warm-400' : 'text-warm-700'}`}>
          {detail.title}
        </span>

        {/* 可选活动：切换按钮 */}
        {activity.type === 'optional' && alternatives.length > 0 && (
          <button
            onClick={() => setShowAlt(!showAlt)}
            className="flex-shrink-0 p-1 text-warm-400 hover:text-primary-500 transition-colors"
            title="换一个活动"
          >
            <Shuffle size={14} />
          </button>
        )}
      </div>

      {/* 替代活动选择 */}
      {showAlt && alternatives.length > 0 && (
        <div className="ml-8 mt-1 p-2 bg-warm-50 rounded-lg space-y-1">
          <p className="text-xs text-warm-500 mb-1">换一个：</p>
          {alternatives.map((alt) => (
            <button
              key={alt.id}
              className="w-full text-left text-xs text-warm-700 p-1.5 rounded hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-1"
              onClick={() => {
                onReplace(alt.id);
                setShowAlt(false);
              }}
            >
              <Shuffle size={10} />
              {alt.title}
              <span className="text-warm-400 ml-auto">{alt.durationMinutes}分钟</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
