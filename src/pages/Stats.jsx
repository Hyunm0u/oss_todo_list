import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { useAppData } from "../context/AppContext.jsx";
import { calculateStats } from "../utils/stats.js";
import { getFallbackInsights } from "../utils/priority.js";

export default function Stats() {
  const { tasks, events } = useAppData();
  const [range, setRange] = useState("weekly");
  const stats = calculateStats(tasks, events);
  const bars = range === "weekly" ? stats.weeklyTrend : stats.monthlyTrend;
  const max = Math.max(1, ...bars.map((bar) => bar.total || 0));
  const insights = getFallbackInsights(tasks, events);

  return (
    <PageShell withFab>
      <AppHeader title="통계" action={<span className="w-10" />} />
      <main className="mx-auto mt-stack-lg w-full max-w-5xl space-y-stack-lg px-margin-mobile">
        <section className="rounded-xl bg-primary-container p-stack-lg text-on-primary-container shadow-soft">
          <p className="text-label-md font-label-md opacity-90">현재 진행</p>
          <h2 className="mt-stack-sm text-title-md font-title-md">{stats.currentStreak}일 연속</h2>
          <div className="mt-stack-lg grid grid-cols-3 gap-gutter">
            <Metric value={stats.totalTasks} label="전체 작업" />
            <Metric value={stats.completedTasks} label="완료" />
            <Metric value={`${stats.completionRate}%`} label="완료율" />
          </div>
        </section>

        <SurfaceCard className="p-stack-lg">
          <h2 className="mb-stack-sm text-title-md font-title-md text-on-surface">완료 흐름</h2>
          <p className="whitespace-pre-wrap break-words text-body-md font-body-md text-on-surface-variant">{stats.insight}</p>
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <div className="mb-stack-lg flex items-center justify-between">
            <h3 className="text-title-md font-title-md text-on-surface">{range === "weekly" ? "주간" : "월간"} 추세</h3>
            <div className="flex rounded-pill bg-surface-container p-1">
              {["weekly", "monthly"].map((item) => (
                <button key={item} type="button" onClick={() => setRange(item)} className={`rounded-pill px-stack-md py-1 text-label-sm font-label-sm ${range === item ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}>
                  {item === "weekly" ? "주간" : "월간"}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-44 items-end gap-gutter">
            {bars.map((bar) => {
              const height = Math.max(4, Math.round(((bar.total || 0) / max) * 100));
              return (
                <div key={bar.date || bar.label} className="flex flex-1 flex-col items-center gap-stack-sm">
                  <div className="flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-primary-fixed">
                    <div className="w-full rounded-t-lg bg-primary transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-center text-label-md text-outline">{bar.label}</span>
                </div>
              );
            })}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <h3 className="mb-stack-md text-title-md font-title-md text-on-surface">우선순위 TOP3</h3>
          {insights.priorities.length ? (
            <ol className="list-decimal space-y-stack-md pl-5 text-body-md text-on-surface">
              {insights.priorities.map((item) => (
                <li key={`${item.type}-${item.id}`}>
                  <p className="font-title-md">{item.title}</p>
                  <ul className="mt-stack-sm list-disc space-y-1 pl-5 text-on-surface-variant">
                    {(item.details?.length ? item.details : [item.reason]).map((detail) => <li key={detail}>{detail}</li>)}
                  </ul>
                </li>
              ))}
            </ol>
          ) : <p className="text-body-md text-on-surface-variant">표시할 항목이 없습니다.</p>}
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <h3 className="mb-stack-lg text-title-md font-title-md text-on-surface">카테고리 분포</h3>
          <div className="space-y-stack-md">
            {stats.categoryDistribution.length ? stats.categoryDistribution.map((item) => (
              <div key={item.id}>
                <div className="mb-stack-sm flex justify-between text-body-md font-body-md">
                  <span className="text-on-surface">{item.name}</span>
                  <span className="text-on-surface-variant">{item.percent}% · {item.count}</span>
                </div>
                <div className="h-3 overflow-hidden rounded-pill bg-surface-container"><div className="h-full rounded-pill bg-primary" style={{ width: `${item.percent}%` }} /></div>
              </div>
            )) : <p className="text-body-md text-on-surface-variant">아직 분류된 데이터가 없습니다.</p>}
          </div>
        </SurfaceCard>

        <section className="grid grid-cols-1 gap-stack-lg sm:grid-cols-2">
          <Insight icon="event" title="예정된 일정" body={`${stats.totalEvents}개의 일정이 저장되어 있습니다.`} />
          <Insight icon="warning" title="지연 작업" body={`${stats.overdueTasks}개의 지난 미완료 작업은 통계에서 제외되었습니다.`} />
        </section>
      </main>
    </PageShell>
  );
}

function Metric({ value, label }) {
  return <div><p className="text-headline-lg font-headline-lg">{value}</p><p className="text-label-md font-label-md opacity-90">{label}</p></div>;
}

function Insight({ icon, title, body }) {
  return (
    <SurfaceCard className="p-stack-lg">
      <h3 className="flex items-center gap-2 text-title-md font-title-md text-on-surface"><Icon className="text-primary">{icon}</Icon>{title}</h3>
      <p className="mt-stack-sm text-body-md font-body-md text-on-surface-variant">{body}</p>
    </SurfaceCard>
  );
}
