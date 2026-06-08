import React, { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { useAppData } from "../context/AppContext.jsx";
import { calculateStats } from "../utils/stats.js";

export default function Stats() {
  const { tasks, events, settings } = useAppData();
  const [range, setRange] = useState("weekly");
  const [aiInsights, setAiInsights] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);
  const [aiError, setAiError] = useState("");
  const stats = calculateStats(tasks, events);
  const bars = range === "weekly" ? stats.weeklyTrend : stats.monthlyTrend;
  const max = Math.max(1, ...bars.map((bar) => bar.completed || 0));

  const downloadStats = () => {
    const blob = new Blob([JSON.stringify(stats, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "studyflow-stats.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const fetchAiInsights = async (force = false) => {
    if (!settings?.aiEnabled) return;
    setLoadingAi(true);
    setAiError("");
    try {
      const res = await fetch(`http://localhost:5174/ai/insights${force ? "?force=1" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, events }),
      });
      if (!res.ok) throw new Error("AI 통신 오류");
      const data = await res.json();
      setAiInsights(data);
    } catch (error) {
      console.error(error);
      setAiError("AI 분석을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoadingAi(false);
    }
  };

  useEffect(() => {
    if (settings?.aiEnabled) {
      fetchAiInsights();
    }
  }, [settings?.aiEnabled, tasks, events]);

  return (
    <PageShell withFab>
      <AppHeader title="통계" action={<button type="button" onClick={downloadStats} className="rounded-full p-base text-primary transition-colors hover:bg-surface-container-high active:scale-95" aria-label="통계 다운로드"><Icon>download</Icon></button>} />
      <main className="mx-auto mt-stack-lg w-full max-w-5xl space-y-stack-lg px-margin-mobile">
        <section className="rounded-xl bg-primary-container p-stack-lg text-on-primary-container shadow-soft">
          <p className="text-label-md font-label-md opacity-80">현재 진행</p>
          <h2 className="mt-stack-sm text-title-md font-title-md">{stats.currentStreak}일 연속</h2>
          <div className="mt-stack-lg grid grid-cols-3 gap-gutter">
            <Metric value={stats.totalTasks} label="전체 작업" />
            <Metric value={stats.completedTasks} label="완료" />
            <Metric value={`${stats.completionRate}%`} label="완료율" />
          </div>
        </section>

        <SurfaceCard className="p-stack-lg">
          <h2 className="mb-stack-sm text-title-md font-title-md text-on-surface">생산성 인사이트</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">{stats.insight}</p>
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <div className="mb-stack-lg flex items-center justify-between">
            <h3 className="text-title-md font-title-md text-on-surface">{range === "weekly" ? "주간" : "월간"} 추세</h3>
            <div className="flex rounded-pill bg-surface-container p-1">
              {['weekly', 'monthly'].map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setRange(item)}
                  className={`rounded-pill px-stack-md py-1 text-label-sm font-label-sm transition-colors ${range === item ? "bg-surface-container-lowest text-primary shadow-sm" : "text-outline hover:text-on-surface"}`}
                >
                  {item === 'weekly' ? '주간' : '월간'}
                </button>
              ))}
            </div>
          </div>
          <div className="flex h-44 items-end gap-gutter">
            {bars.map((bar) => {
              const height = Math.max(4, Math.round(((bar.completed || 0) / max) * 100));
              return (
                <div key={bar.date || bar.label} className="flex flex-1 flex-col items-center gap-stack-sm">
                  <div className="flex h-36 w-full items-end overflow-hidden rounded-t-lg bg-primary-fixed">
                    <div className="w-full rounded-t-lg bg-primary transition-all" style={{ height: `${height}%` }} />
                  </div>
                  <span className="text-label-md text-outline">{bar.label}</span>
                </div>
              );
            })}
          </div>
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
                <div className="h-3 overflow-hidden rounded-pill bg-surface-container">
                  <div className="h-full rounded-pill bg-primary" style={{ width: `${item.percent}%` }} />
                </div>
              </div>
            )) : <p className="text-body-md text-on-surface-variant">아직 분류된 활동이 없습니다.</p>}
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <div className="mb-stack-lg flex items-center justify-between">
            <div>
              <h2 className="text-title-md font-title-md text-on-surface">AI 기반 분석</h2>
              <p className="text-body-sm text-on-surface-variant">작업/일정 목록을 분석해 이번 주 추천과 동기부여를 제공합니다.</p>
            </div>
            <button
              type="button"
              onClick={() => fetchAiInsights(true)}
              className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10"
            >
              다시 분석
            </button>
          </div>
          {settings?.aiEnabled ? (
            loadingAi ? (
              <p className="text-body-md text-on-surface-variant">AI 분석 중...</p>
            ) : aiError ? (
              <p className="text-body-md text-error">{aiError}</p>
            ) : aiInsights ? (
              <div className="space-y-stack-lg">
                <SurfaceCard className="p-stack-md bg-surface-container-lowest">
                  <h3 className="text-body-md font-title-md text-on-surface">요약</h3>
                  <p className="mt-stack-sm text-body-lg text-on-surface">{aiInsights.summary}</p>
                </SurfaceCard>
                <SurfaceCard className="p-stack-md bg-surface-container-low">
                  <h3 className="text-body-md font-title-md text-on-surface">이번 주 추천</h3>
                  <p className="mt-stack-sm text-body-lg text-on-surface-variant">{aiInsights.recommendation}</p>
                </SurfaceCard>
                <SurfaceCard className="p-stack-md bg-primary-container text-on-primary-container">
                  <h3 className="text-body-md font-title-md">동기부여</h3>
                  <p className="mt-stack-sm text-body-lg">{aiInsights.motivation}</p>
                </SurfaceCard>
              </div>
            ) : (
              <p className="text-body-md text-on-surface-variant">AI 분석 결과를 불러오고 있습니다.</p>
            )
          ) : (
            <div className="space-y-stack-sm">
              <p className="text-body-md text-on-surface-variant">AI 기능이 꺼져 있습니다. 설정에서 켜면 작업/일정 분석과 추천을 받을 수 있습니다.</p>
              <a href="/settings" className="text-primary text-label-md">설정으로 이동</a>
            </div>
          )}
        </SurfaceCard>

        <section className="grid grid-cols-1 gap-stack-lg sm:grid-cols-2">
          <Insight icon="event" title="예정된 일정" body={`${stats.totalEvents}개의 일정이 저장되었습니다.`} />
          <Insight icon="event_repeat" title="가장 많이 미룬 작업" body={stats.mostPostponedTask && stats.mostPostponedTask.postponedCount ? `${stats.mostPostponedTask.title}를 ${stats.mostPostponedTask.postponedCount}회 미루었습니다.` : "아직 미룬 작업이 없습니다."} />
          <Insight icon="warning" title="연체된 작업" body={`${stats.overdueTasks}개의 작업이 연체되었습니다.`} />
          <Insight icon="upcoming" title="예정된 일정" body={stats.upcomingEvents.length ? stats.upcomingEvents.map((event) => event.title).join(", ") : "예정된 일정이 없습니다."} />
        </section>
      </main>
    </PageShell>
  );
}

function Metric({ value, label }) {
  return (
    <div>
      <p className="text-headline-lg font-headline-lg">{value}</p>
      <p className="text-label-md font-label-md opacity-80">{label}</p>
    </div>
  );
}

function Insight({ icon, title, body }) {
  return (
    <SurfaceCard className="p-stack-lg">
      <h3 className="flex items-center gap-2 text-title-md font-title-md text-on-surface"><Icon className="text-primary">{icon}</Icon>{title}</h3>
      <p className="mt-stack-sm text-body-md font-body-md text-on-surface-variant">{body}</p>
    </SurfaceCard>
  );
}
