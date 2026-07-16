import { useEffect, useState } from 'react';
import { useRecordStore } from '../../stores/useRecordStore';
import { db } from '../../db';
import { DIMENSION_ICONS, DIMENSION_LABELS, type DimensionId } from '../../constants';
import { Calendar } from 'lucide-react';
import type { DailyRecord } from '../../types';

export function Timeline() {
  const { records, loadAllRecords } = useRecordStore();
  const [grouped, setGrouped] = useState<Record<string, DailyRecord[]>>({});

  useEffect(() => {
    loadAllRecords();
  }, []);

  useEffect(() => {
    const g: Record<string, DailyRecord[]> = {};
    for (const r of records) {
      if (!g[r.date]) g[r.date] = [];
      g[r.date].push(r);
    }
    setGrouped(g);
  }, [records]);

  const dates = Object.keys(grouped).sort().reverse();

  if (dates.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-3">✍️</div>
        <h3 className="text-lg font-semibold text-warm-700 mb-2">还没有记录</h3>
        <p className="text-warm-500 text-sm">完成活动后写一条观察笔记，记录宝宝的成长瞬间</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* 时间线竖线 */}
      <div className="absolute left-3 top-2 bottom-2 w-0.5 bg-warm-200" />

      <div className="space-y-6">
        {dates.map((date) => (
          <div key={date} className="relative pl-8">
            {/* 时间点 */}
            <div className="absolute left-1.5 top-1.5 w-3 h-3 rounded-full bg-primary-400 border-2 border-white shadow-sm" />

            {/* 日期标题 */}
            <div className="flex items-center gap-2 mb-2">
              <Calendar size={14} className="text-warm-400" />
              <span className="text-sm font-medium text-warm-600">
                {new Date(date + 'T00:00:00').toLocaleDateString('zh-CN', {
                  month: 'long', day: 'numeric', weekday: 'short',
                })}
              </span>
            </div>

            {/* 笔记卡片 */}
            <div className="space-y-2">
              {grouped[date].map((r) => (
                <NoteCard key={r.id} record={r} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function NoteCard({ record }: { record: DailyRecord }) {
  const [activityTitle, setActivityTitle] = useState('');
  const [dimId, setDimId] = useState<DimensionId | null>(null);

  useEffect(() => {
    if (record.activityId) {
      db.activities.get(record.activityId).then((a) => {
        if (a) {
          setActivityTitle(a.title);
          setDimId(a.dimensionId);
        }
      });
    }
  }, [record.activityId]);

  return (
    <div className="card bg-white">
      {activityTitle && (
        <div className="flex items-center gap-1.5 mb-1.5">
          {dimId && (
            <span className="text-xs px-1.5 py-0.5 rounded-full bg-warm-100 text-warm-600">
              {DIMENSION_ICONS[dimId]} {DIMENSION_LABELS[dimId]}
            </span>
          )}
          <span className="text-xs text-primary-500 font-medium">{activityTitle}</span>
        </div>
      )}
      {record.note && (
        <p className="text-sm text-warm-700 leading-relaxed">{record.note}</p>
      )}
      {record.milestone && (
        <div className="mt-2 px-3 py-1.5 bg-amber-50 rounded-lg border border-amber-200">
          <span className="text-xs text-amber-700">🏆 {record.milestone}</span>
        </div>
      )}
      {!record.note && !record.milestone && (
        <p className="text-xs text-warm-400">✅ 已完成打卡</p>
      )}
    </div>
  );
}
