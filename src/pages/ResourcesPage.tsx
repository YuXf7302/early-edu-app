import { useState, useEffect, useMemo } from 'react';
import { db } from '../db';
import { usePlanStore } from '../stores/usePlanStore';
import { BOOKS } from '../engine/books';
import { getDailyGrandparentPlan } from '../engine/grandparent';
import { DIMENSION_LABELS, DIMENSION_ICONS } from '../constants';
import { BookOpen, Users, Package } from 'lucide-react';

export function ResourcesPage() {
  const [tab, setTab] = useState<'books' | 'grandparent'>('books');
  const { currentPlan, loadWeek } = usePlanStore();
  const [materials, setMaterials] = useState<string[]>([]);

  useEffect(() => {
    const monday = getMonday();
    loadWeek(monday);
  }, []);

  // 加载本周材料
  useEffect(() => {
    if (!currentPlan) return;
    const allIds = currentPlan.days.flatMap((d: any) =>
      d.activities.map((a: any) => a.activityId)
    );
    const unique = [...new Set(allIds)] as number[];
    Promise.all(unique.map((id) => db.activities.get(id))).then((acts) => {
      const mats = new Set<string>();
      acts.filter(Boolean).forEach((a: any) => {
        a.materials.forEach((m: string) => mats.add(m));
      });
      setMaterials([...mats]);
    });
  }, [currentPlan]);

  const grandparentPlan = useMemo(() => getDailyGrandparentPlan(), []);

  return (
    <div className="page-container">
      {/* 顶部切换 */}
      <div className="flex gap-2 mb-4">
        <button
          onClick={() => setTab('books')}
          className={`flex-1 py-3 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2 ${
            tab === 'books'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-warm-100 text-warm-600'
          }`}
        >
          <BookOpen size={20} /> 绘本推荐
        </button>
        <button
          onClick={() => setTab('grandparent')}
          className={`flex-1 py-3 rounded-xl text-base font-medium transition-all flex items-center justify-center gap-2 ${
            tab === 'grandparent'
              ? 'bg-primary-500 text-white shadow-sm'
              : 'bg-warm-100 text-warm-600'
          }`}
        >
          <Users size={20} /> 老人指引
        </button>
      </div>

      {/* 本周材料提醒 */}
      {tab === 'books' && materials.length > 0 && (
        <div className="card bg-amber-50 border-amber-200 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Package size={20} className="text-amber-600" />
            <span className="text-base font-semibold text-amber-700">本周需要准备的材料</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {materials.map((m) => (
              <span key={m} className="text-sm bg-amber-100 text-amber-700 px-3 py-1.5 rounded-lg font-medium">
                {m}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* 绘本推荐 */}
      {tab === 'books' && (
        <div className="space-y-3">
          {BOOKS.map((book, i) => (
            <div key={i} className="card">
              <h3 className="text-base font-bold text-warm-800">{book.title}</h3>
              <p className="text-sm text-warm-500 mt-0.5">{book.author}</p>
              <div className="flex gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-primary-100 text-primary-600 px-2 py-0.5 rounded-full">{book.theme}</span>
                <span className="text-xs bg-warm-100 text-warm-600 px-2 py-0.5 rounded-full">
                  {DIMENSION_ICONS[book.dimension as keyof typeof DIMENSION_ICONS] || ''} {DIMENSION_LABELS[book.dimension as keyof typeof DIMENSION_LABELS] || book.dimension}
                </span>
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{book.ageRange}</span>
              </div>
              <p className="text-sm text-warm-600 mt-2 leading-relaxed">{book.why}</p>
              {book.montessoriAlign && (
                <p className="text-xs text-purple-500 mt-1">🏫 {book.montessoriAlign}</p>
              )}
            </div>
          ))}
        </div>
      )}

      {/* 老人白天指引 */}
      {tab === 'grandparent' && (
        <div className="space-y-2">
          <p className="text-sm text-warm-500 mb-3">
            以下活动简单易行，无需屏幕，老人可以随时穿插在日常生活中：
          </p>
          {grandparentPlan.map((a, i) => (
            <div key={i} className="card border-l-4 border-l-primary-400">
              <div className="flex items-start gap-3">
                <span className="text-sm font-bold text-primary-600 bg-primary-50 px-2 py-1 rounded-lg">{a.when}</span>
                <div className="flex-1">
                  <h4 className="text-base font-semibold text-warm-800">{a.title}</h4>
                  {a.englishWord && (
                    <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full mt-1 inline-block">
                      🗣️ {a.englishWord}
                    </span>
                  )}
                  <p className="text-sm text-warm-600 mt-2 leading-relaxed">{a.instructions}</p>
                  <p className="text-sm text-primary-600 mt-1">💡 {a.tip}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
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
