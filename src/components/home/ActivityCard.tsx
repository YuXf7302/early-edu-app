import { useEffect, useState } from 'react';
import { db } from '../../db';
import type { Activity as ActivityType } from '../../types';
import {
  DIMENSION_LABELS,
  DIMENSION_ICONS,
  DIMENSION_COLORS,
  INTERACTION_LABELS,
} from '../../constants';
import { Check, Circle } from 'lucide-react';

interface Props {
  activityId: number;
  type: 'required' | 'optional';
  completed: boolean;
  onToggle: () => void;
}

export function ActivityCard({ activityId, type, completed, onToggle }: Props) {
  const [activity, setActivity] = useState<ActivityType | null>(null);

  useEffect(() => {
    db.activities.get(activityId).then((a) => setActivity(a ?? null));
  }, [activityId]);

  if (!activity) {
    return (
      <div className="card animate-pulse">
        <div className="h-16 bg-warm-100 rounded-lg" />
      </div>
    );
  }

  const color = DIMENSION_COLORS[activity.dimensionId];

  return (
    <div
      className={`card relative overflow-hidden transition-all active:scale-[0.98] ${
        completed ? 'opacity-70 bg-warm-50' : ''
      }`}
    >
      {/* 顶部分类色条 */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start gap-3 pt-1">
        {/* 打卡按钮 */}
        <button
          onClick={onToggle}
          className={`mt-1 flex-shrink-0 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all ${
            completed
              ? 'bg-green-500 border-green-500 text-white'
              : 'border-warm-300 hover:border-primary-400'
          }`}
        >
          {completed ? <Check size={16} strokeWidth={3} /> : <Circle size={14} />}
        </button>

        {/* 活动内容 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                type === 'required' ? 'bg-coral-100 text-coral-600' : 'bg-blue-50 text-blue-600'
              }`}
            >
              {type === 'required' ? '必做' : '可选'}
            </span>
            <span
              className="text-xs px-2 py-0.5 rounded-full"
              style={{ backgroundColor: color + '18', color }}
            >
              {DIMENSION_ICONS[activity.dimensionId]} {DIMENSION_LABELS[activity.dimensionId]}
            </span>
          </div>

          <h3 className={`font-semibold text-sm ${completed ? 'line-through text-warm-400' : 'text-warm-800'}`}>
            {activity.title}
          </h3>
          <p className="text-xs text-warm-500 mt-0.5 line-clamp-2">{activity.description}</p>

          <div className="flex items-center gap-2 mt-2 text-xs text-warm-400">
            <span>⏱ {activity.durationMinutes}分钟</span>
            <span>·</span>
            <span>{INTERACTION_LABELS[activity.interactionType]}</span>
            {activity.isScreen && <span className="text-amber-500">📺 屏幕</span>}
            {activity.isOutdoor && <span>🌳 户外</span>}
            {activity.materials.length > 0 && (
              <>
                <span>·</span>
                <span>📦 {activity.materials.slice(0, 3).join('、')}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
