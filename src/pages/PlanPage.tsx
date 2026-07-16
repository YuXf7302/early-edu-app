import { WeekPlanView } from '../components/plan/WeekPlanView';

export function PlanPage() {
  return (
    <div className="page-container">
      <h1 className="text-xl font-bold text-warm-800 mb-4">📋 周计划</h1>
      <WeekPlanView />
    </div>
  );
}
