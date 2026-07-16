import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { db } from '../../db';
import { DIMENSION_ICONS } from '../../constants';
import type { WeeklyPlan } from '../../types';
import type { Activity } from '../../types';
import { Eye, ArrowRight, Shuffle } from 'lucide-react';

interface Props {
  plan: WeeklyPlan | null;
}

export function TomorrowPreview({ plan }: Props) {
  const navigate = useNavigate();
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const tomorrowDate = new Date(tomorrow + 'T00:00:00');

  if (!plan) return null;

  const tomorrowPlan = plan.days.find((d) => d.date === tomorrow);
  if (!tomorrowPlan || tomorrowPlan.activities.length === 0) return null;

  return (
    <div className="mt-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Eye size={16} className="text-blue-500" />
          <span className="text-sm font-semibold text-warm-700">明日预览</span>
          <span className="text-xs text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">
            {tomorrowDate.toLocaleDateString('zh-CN', { weekday: 'long', month: 'short', day: 'numeric' })}
          </span>
        </div>
        <button
          onClick={() => navigate('/plan')}
          className="text-xs text-primary-500 flex items-center gap-0.5"
        >
          查看全周 <ArrowRight size={12} />
        </button>
      </div>

      <div className="card bg-gradient-to-r from-blue-50/50 to-white border-blue-200">
        <div className="space-y-2">
          {tomorrowPlan.activities.map((act, idx) => (
            <TomorrowActivityRow key={idx} act={act} />
          ))}
        </div>
      </div>
    </div>
  );
}

function TomorrowActivityRow({ act }: { act: { activityId: number; type: string; completed: boolean } }) {
  const [detail, setDetail] = useState<Activity | null>(null);
  const [alternatives, setAlternatives] = useState<Activity[]>([]);
  const [showAlt, setShowAlt] = useState(false);

  useEffect(() => {
    db.activities.get(act.activityId).then((a) => setDetail(a ?? null));
    if (act.type === 'optional') {
      db.activities.get(act.activityId).then((a) => {
        if (a) {
          db.activities
            .where('dimensionId')
            .equals(a.dimensionId)
            .filter((x) => x.id !== a.id)
            .limit(2)
            .toArray()
            .then(setAlternatives);
        }
      });
    }
  }, [act.activityId]);

  if (!detail) return null;

  return (
    <div>
      <div className="flex items-center gap-2">
        <span
          className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
            act.type === 'required' ? 'bg-coral-100 text-coral-600' : 'bg-blue-50 text-blue-600'
          }`}
        >
          {act.type === 'required' ? '必做' : '可选'}
        </span>
        <span className="text-sm text-warm-700">{detail.title}</span>
        <span className="text-xs text-warm-400 ml-auto">{detail.durationMinutes}分钟</span>

        {/* 可选活动可切换 */}
        {act.type === 'optional' && alternatives.length > 0 && (
          <button
            onClick={() => setShowAlt(!showAlt)}
            className="p-1 text-warm-400 hover:text-primary-500"
            title="换一个"
          >
            <Shuffle size={13} />
          </button>
        )}
      </div>

      {showAlt && alternatives.length > 0 && (
        <div className="ml-8 mt-1 space-y-1">
          {alternatives.map((alt) => (
            <button
              key={alt.id}
              onClick={() => setShowAlt(false)}
              className="w-full text-left text-xs text-warm-500 p-1 rounded hover:bg-blue-50 hover:text-primary-600 flex items-center gap-1"
            >
              <Shuffle size={10} />
              {DIMENSION_ICONS[alt.dimensionId]} {alt.title}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
