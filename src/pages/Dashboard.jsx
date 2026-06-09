import React, { useEffect, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { formatDateLabel, getCategory, getTodayISO, useAppData } from "../context/AppContext.jsx";
import { calculateStats } from "../utils/stats.js";
import { getFallbackInsights } from "../utils/priority.js";

export default function Dashboard() {
  const { tasks, events, toggleTask, settings } = useAppData();
  const today = getTodayISO();
  const stats = calculateStats(tasks, events);
  const todayTasks = tasks.filter((task) => task.date === today).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const todayEvents = events.filter((event) => event.date === today).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));

  return (
    <PageShell withFab>
      <AppHeader title="StudyFlow" showProfile />
      <main className="mx-auto mt-stack-md flex w-full max-w-5xl flex-col gap-stack-lg px-margin-mobile">
        <section className="flex flex-col gap-stack-sm">
          <p className="text-label-md font-label-md uppercase text-on-surface-variant">{formatDateLabel(today)}</p>
          <h2 className="text-headline-xl font-headline-xl text-on-surface">오늘의 학습 흐름을 정리하세요</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">홈에서는 완료 체크만 하고, 수정과 삭제는 캘린더에서 관리합니다.</p>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h3 className="text-title-md font-title-md text-on-surface">AI 분석 & 추천</h3>
          <AIInsights enabled={Boolean(settings?.aiEnabled)} tasks={tasks} events={events} />
        </section>

        <section className="grid grid-cols-2 gap-gutter md:grid-cols-4">
          <Metric icon="task_alt" label="전체 작업" value={stats.totalTasks} />
          <Metric icon="done_all" label="완료" value={stats.completedTasks} />
          <Metric icon="percent" label="완료율" value={`${stats.completionRate}%`} />
          <Metric icon="event" label="오늘 일정" value={todayEvents.length} />
        </section>

        <section className="grid grid-cols-1 gap-stack-lg md:grid-cols-2">
          <div className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">오늘의 작업</h3>
            {todayTasks.length ? todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} />
            )) : <EmptyState icon="check_circle" title="오늘 예정된 작업이 없습니다." />}
          </div>

          <div className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">오늘의 일정</h3>
            {todayEvents.length ? todayEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            )) : <EmptyState icon="event_available" title="오늘 예정된 일정이 없습니다." />}
          </div>
        </section>
      </main>
    </PageShell>
  );
}

function Metric({ icon, label, value }) {
  return (
    <SurfaceCard className="p-stack-md">
      <Icon className="text-primary">{icon}</Icon>
      <p className="mt-stack-sm text-headline-lg-mobile font-headline-lg-mobile text-on-surface">{value}</p>
      <p className="text-label-md text-on-surface-variant">{label}</p>
    </SurfaceCard>
  );
}

function TaskRow({ task, onToggle }) {
  const category = getCategory(task.category);
  return (
    <SurfaceCard className="flex items-center justify-between gap-gutter p-stack-md">
      <div className="flex min-w-0 items-center gap-stack-md">
        <input className="satisfying-snap h-6 w-6 rounded-md border-outline text-primary focus:ring-primary" checked={task.completed} onChange={() => onToggle(task.id)} id={task.id} type="checkbox" />
        <div className="min-w-0">
          <label className={`block cursor-pointer select-none truncate text-body-lg font-body-lg text-on-surface ${task.completed ? "line-through opacity-60" : ""}`} htmlFor={task.id}>{task.title}</label>
          <p className="text-label-md text-on-surface-variant">{task.time || "시간 미정"}</p>
        </div>
      </div>
      <span className={`shrink-0 rounded-pill px-base py-stack-sm text-label-md font-label-md ${category.colorClass}`}>{category.name}</span>
    </SurfaceCard>
  );
}

function EventRow({ event }) {
  const category = getCategory(event.category);
  return (
    <SurfaceCard className="flex items-center justify-between gap-gutter p-stack-md">
      <div className="min-w-0">
        <p className="text-label-md text-on-surface-variant">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</p>
        <h4 className="truncate text-body-lg font-title-md text-on-surface">{event.title}{event.recurring !== "none" && " 🔁"}</h4>
      </div>
      <span className={`shrink-0 rounded-pill px-base py-stack-sm text-label-md font-label-md ${category.colorClass}`}>{category.name}</span>
    </SurfaceCard>
  );
}

function EmptyState({ icon, title }) {
  return (
    <div className="flex items-center gap-gutter rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-stack-lg text-on-surface-variant">
      <Icon>{icon}</Icon>
      <span className="text-body-md">{title}</span>
    </div>
  );
}

function AIInsights({ enabled, tasks, events }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(() => getFallbackInsights(tasks, events));

  const fetchInsights = async (force = false) => {
    const fallback = getFallbackInsights(tasks, events);
    if (!enabled) {
      setInsights(fallback);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5174/ai/insights${force ? "?force=1" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, events, now: new Date().toISOString() }),
      });
      if (!res.ok) throw new Error("AI 응답 오류");
      const data = await res.json();
      setInsights({ ...fallback, ...data, priorities: data.priorities?.length ? data.priorities : fallback.priorities });
    } catch {
      setInsights(fallback);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [enabled, tasks, events]);

  return (
    <SurfaceCard className="h-auto p-stack-lg">
      {loading ? <p className="text-body-md text-on-surface-variant">AI 분석 중...</p> : (
        <div className="space-y-stack-md">
          <p className="whitespace-pre-wrap break-words text-body-md text-on-surface-variant">{enabled ? insights.summary : "AI 기능이 꺼져 있어 로컬 우선순위 로직으로 표시합니다."}</p>
          <div className="rounded-xl bg-surface-container-lowest p-stack-md">
            <h4 className="text-title-sm font-title-md text-on-surface">우선순위 TOP3</h4>
            {insights.priorities.length ? (
              <ol className="mt-stack-md list-decimal space-y-stack-md pl-5 text-body-md text-on-surface">
                {insights.priorities.map((item) => (
                  <li key={`${item.type}-${item.id}`} className="whitespace-normal break-words">
                    <p className="font-title-md text-on-surface">{item.title}</p>
                    <ul className="mt-stack-sm list-disc space-y-1 pl-5 text-on-surface-variant">
                      {(item.details?.length ? item.details : [item.reason]).map((detail) => <li key={detail}>{detail}</li>)}
                    </ul>
                  </li>
                ))}
              </ol>
            ) : <p className="mt-stack-sm text-body-md text-on-surface-variant">표시할 항목이 없습니다.</p>}
          </div>
          <button onClick={() => fetchInsights(true)} className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10">다시 분석</button>
        </div>
      )}
    </SurfaceCard>
  );
}
