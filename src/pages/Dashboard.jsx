import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { getCategory, getTodayISO, formatDateLabel, useAppData } from "../context/AppContext.jsx";
import { screenLinks } from "../data/navigation.js";
import { calculateStats } from "../utils/stats.js";

export default function Dashboard() {
  const { tasks, events, toggleTask, deleteTask, postponeTask, settings } = useAppData();
  const today = getTodayISO();
  const stats = calculateStats(tasks, events);
  const todayTasks = tasks.filter((task) => task.date === today).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const overdueTasks = tasks.filter((task) => !task.completed && task.date < today).sort((a, b) => a.date.localeCompare(b.date));
  const todayEvents = events.filter((event) => event.date === today).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  const todayTaskCount = todayTasks.length;

  return (
    <PageShell withFab>
      <AppHeader title="StudyFlow" showProfile />
      <main className="mx-auto mt-stack-md flex w-full max-w-5xl flex-col gap-stack-lg px-margin-mobile">
        <section className="flex flex-col gap-stack-sm">
          <p className="text-label-md font-label-md uppercase text-on-surface-variant">{formatDateLabel(today)}</p>
          <h2 className="text-headline-xl font-headline-xl text-on-surface">오늘의 학습 흐름을 시작해볼까요?</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">작업, 일정, 통계가 하나의 저장된 데이터로 함께 연결됩니다.</p>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h3 className="text-title-md font-title-md text-on-surface">AI 분석 & 추천</h3>
          <AIInsights enabled={Boolean(settings?.aiEnabled)} tasks={tasks} events={events} />
        </section>

        <section className="grid grid-cols-2 gap-gutter md:grid-cols-4">
          <Metric icon="task_alt" label="전체 작업" value={stats.totalTasks} />
          <Metric icon="done_all" label="완료" value={stats.completedTasks} />
          <Metric icon="percent" label="완료율" value={`${stats.completionRate}%`} />
          <Metric icon="local_fire_department" label="연속 기록" value={`${stats.currentStreak}일`} />
        </section>

        {overdueTasks.length ? (
          <section className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">확인이 필요한 작업</h3>
            {overdueTasks.slice(0, 3).map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onPostpone={postponeTask} overdue />
            ))}
          </section>
        ) : null}

        <section className="flex flex-col gap-stack-md">
          <div className="flex items-center justify-between">
            <h3 className="text-title-md font-title-md text-on-surface">오늘의 작업</h3>
            <Link to="/add?type=task" className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10">작업 추가</Link>
          </div>
          <div className="flex flex-col gap-stack-sm">
            {todayTasks.length ? todayTasks.map((task) => (
              <TaskRow key={task.id} task={task} onToggle={toggleTask} onDelete={deleteTask} onPostpone={postponeTask} />
            )) : (
              <EmptyState icon="check_circle" title="오늘 예정된 작업이 없습니다" action="/add?type=task" actionLabel="작업 만들기" />
            )}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-stack-lg md:grid-cols-2">
          <div className="flex flex-col gap-stack-md">
            <div className="flex items-center justify-between">
              <h3 className="text-title-md font-title-md text-on-surface">오늘의 일정</h3>
              <Link to="/add?type=event" className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10">일정 추가</Link>
            </div>
            {todayEvents.length ? todayEvents.map((event) => {
              const category = getCategory(event.category);
              return (
                <SurfaceCard key={event.id} className="flex items-center gap-gutter p-stack-md">
                  <span className="h-12 w-1 rounded-full bg-primary" />
                  <div className="flex-1">
                    <p className="text-label-md text-on-surface-variant">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</p>
                    <h4 className="text-body-lg font-title-md text-on-surface">{event.title}</h4>
                  </div>
                  <span className={`rounded-pill px-base py-stack-sm text-label-md font-label-md ${category.colorClass}`}>{category.name}</span>
                </SurfaceCard>
              );
            }) : <EmptyState icon="event_available" title="오늘 예정된 일정이 없습니다" action="/add?type=event" actionLabel="일정 만들기" />}
          </div>

          <section className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">생산성 인사이트</h3>
            <div className="flex gap-stack-md rounded-xl bg-primary-container p-stack-lg text-on-primary-container shadow-soft">
              <Icon fill className="text-[28px]">auto_awesome</Icon>
              <p className="text-body-md font-body-md leading-relaxed">{stats.insight}</p>
            </div>
          </section>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h3 className="text-title-md font-title-md text-on-surface">빠른 실행</h3>
          <div className="grid grid-cols-2 gap-gutter md:grid-cols-4">
            {screenLinks.map((link) => (
              <Link key={link.to} to={link.to} className="flex items-center gap-gutter rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md transition-colors hover:bg-surface-container-low">
                <Icon className="text-primary">{link.icon}</Icon>
                <span className="text-body-md font-body-md text-on-surface">{link.label}</span>
              </Link>
            ))}
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

function TaskRow({ task, onToggle, onDelete, onPostpone, overdue = false }) {
  const category = getCategory(task.category);
  return (
    <SurfaceCard className={`flex items-center justify-between gap-gutter p-stack-md transition-colors hover:bg-surface-container-low ${overdue ? "border-error/50" : ""}`}>
      <div className="flex min-w-0 items-center gap-stack-md">
        <input
          className="satisfying-snap h-6 w-6 rounded-md border-outline text-primary focus:ring-primary"
          checked={task.completed}
          onChange={() => onToggle(task.id)}
          id={task.id}
          type="checkbox"
        />
        <div className="min-w-0">
          <label className={`block cursor-pointer select-none truncate text-body-lg font-body-lg text-on-surface ${task.completed ? "line-through opacity-60" : ""}`} htmlFor={task.id}>{task.title}</label>
          <p className="text-label-md text-on-surface-variant">{task.time || "시간 미정"}{overdue ? ` · 기한 ${formatDateLabel(task.date)}` : ""}</p>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-stack-sm">
        <span className={`hidden rounded-pill px-base py-stack-sm text-label-md font-label-md sm:inline-flex ${category.colorClass}`}>{category.name}</span>
        <Link to={`/add?type=task&id=${task.id}`} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label={`${task.title} 수정`}><Icon>edit</Icon></Link>
        <button onClick={() => onPostpone(task.id)} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label={`${task.title} 내일로 미루기`}><Icon>event_repeat</Icon></button>
        <button onClick={() => onDelete(task.id)} className="rounded-full p-2 text-error hover:bg-error-container/30" aria-label={`${task.title} 삭제`}><Icon>delete</Icon></button>
      </div>
    </SurfaceCard>
  );
}

function EmptyState({ icon, title, action, actionLabel }) {
  return (
    <div className="flex items-center justify-between gap-gutter rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-stack-lg text-on-surface-variant">
      <div className="flex items-center gap-gutter">
        <Icon>{icon}</Icon>
        <span className="text-body-md">{title}</span>
      </div>
      <Link to={action} className="text-label-md font-label-md text-primary">{actionLabel}</Link>
    </div>
  );
}

function AIInsights({ enabled, tasks, events }) {
  const [loading, setLoading] = useState(false);
  const [insights, setInsights] = useState(null);
  const [error, setError] = useState("");

  const fetchInsights = async (force = false) => {
    if (!enabled) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`http://localhost:5174/ai/insights${force ? "?force=1" : ""}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tasks, events }),
      });
      if (!res.ok) throw new Error("서버 응답 오류");
      const data = await res.json();
      setInsights(data);
    } catch (e) {
      setError("AI 분석을 가져오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled) fetchInsights();
  }, [enabled, tasks, events]);

  if (!enabled) {
    return (
      <SurfaceCard className="p-stack-md">
        <p className="text-body-md text-on-surface-variant">AI 분석 기능이 꺼져 있습니다. 설정에서 켜면 작업 목록을 분석하고 추천을 보여줍니다.</p>
        <div className="mt-stack-sm text-right">
          <a href="/settings" className="text-primary text-label-md">설정으로 이동</a>
        </div>
      </SurfaceCard>
    );
  }

  return (
    <SurfaceCard className="p-stack-md">
      {loading ? (
        <p className="text-body-md text-on-surface-variant">AI 분석 중...</p>
      ) : (
        <div className="space-y-stack-md">
          {error ? (
            <p className="text-body-md text-error">{error}</p>
          ) : (
            <>
              <p className="text-body-lg font-body-lg text-on-surface">{insights?.summary || "목록을 분석하여 오늘의 추천을 준비했습니다."}</p>
              <div className="rounded-xl bg-surface-container-lowest p-stack-md">
                <h4 className="text-title-sm font-title-md text-on-surface">이번 주 추천</h4>
                <p className="text-body-md text-on-surface-variant">{insights?.recommendation || "사용자 목록을 분석하고 추천 작업을 제안합니다."}</p>
              </div>
              <div className="rounded-xl bg-primary-container p-stack-md text-on-primary-container">
                <h4 className="text-title-sm font-title-md">동기부여</h4>
                <p className="text-body-md">{insights?.motivation || "오늘도 차근차근 진행해봐요."}</p>
              </div>
            </>
          )}
          <div className="text-right">
            <button onClick={() => fetchInsights(true)} className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10">다시 분석</button>
          </div>
        </div>
      )}
    </SurfaceCard>
  );
}
