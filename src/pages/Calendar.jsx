import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { getCategory, getTodayISO, useAppData } from "../context/AppContext.jsx";

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function Calendar() {
  const { tasks, events, deleteEvent } = useAppData();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(getTodayISO());

  const calendarDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const firstDay = first.getDay();
    const startOffset = -firstDay;
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(first);
      date.setDate(date.getDate() + startOffset + index);
      return date;
    });
  }, [cursor]);

  const selectedEvents = events.filter((event) => event.date === selectedDate).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  const selectedTasks = tasks.filter((task) => task.date === selectedDate).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const monthLabel = new Intl.DateTimeFormat("ko-KR", { month: "long", year: "numeric" }).format(cursor);

  const moveMonth = (step) => {
    setCursor((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));
  };

  return (
    <PageShell withFab>
      <AppHeader
        title="캘린더"
        action={<Link to="/add?type=event" className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-surface-container-high active:scale-95" aria-label="새 일정"><Icon className="text-primary">event</Icon></Link>}
      />
      <main className="mx-auto w-full max-w-5xl space-y-stack-lg px-margin-mobile">
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-lg">
          <div className="mb-stack-lg flex items-center justify-between">
            <button type="button" onClick={() => setSelectedDate(getTodayISO())} className="rounded-lg px-2 py-1 text-title-md font-title-md text-on-surface transition-colors hover:bg-surface-container-high">
              {monthLabel}
            </button>
            <div className="flex gap-stack-sm">
              <button type="button" onClick={() => moveMonth(-1)} className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high" aria-label="이전 달"><Icon>chevron_left</Icon></button>
              <button type="button" onClick={() => moveMonth(1)} className="rounded-full p-1 text-on-surface-variant transition-colors hover:bg-surface-container-high" aria-label="다음 달"><Icon>chevron_right</Icon></button>
            </div>
          </div>
          <div className="calendar-grid mb-stack-sm text-center text-label-md font-label-md text-outline">
            {['일', '월', '화', '수', '목', '금', '토'].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((date) => {
              const dateString = isoDate(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const isSelected = dateString === selectedDate;
              const hasData = events.some((event) => event.date === dateString) || tasks.some((task) => task.date === dateString);
              return (
                <button
                  key={dateString}
                  type="button"
                  onClick={() => setSelectedDate(dateString)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-full text-body-md transition-all ${inMonth ? "text-on-surface hover:bg-surface-container-high" : "text-outline/50"} ${isSelected ? "bg-primary text-on-primary hover:bg-primary" : ""}`}
                >
                  <span>{date.getDate()}</span>
                  {hasData ? <span className={`mt-1 h-1.5 w-1.5 rounded-full ${isSelected ? "bg-on-primary" : "bg-primary"}`} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-stack-md">
          <div className="flex items-center justify-between">
            <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
              {new Intl.DateTimeFormat("ko-KR", { weekday: "long", month: "long", day: "numeric" }).format(new Date(`${selectedDate}T00:00:00`))}
            </h2>
            <Link to={`/add?type=event&date=${selectedDate}`} className="rounded-lg px-3 py-2 text-label-md font-label-md text-primary hover:bg-primary-container/10">일정 추가</Link>
          </div>

          {selectedEvents.length || selectedTasks.length ? (
            <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
              {selectedEvents.map((event) => (
                <EventCard key={event.id} event={event} onDelete={deleteEvent} />
              ))}
              {selectedTasks.map((task) => {
                const category = getCategory(task.category);
                return (
                  <SurfaceCard key={task.id} className="flex gap-gutter p-stack-md">
                    <div className="w-1 rounded-full bg-secondary-container" />
                    <div className="flex-1">
                    <p className="text-label-md text-on-surface-variant">{task.time || "시간 미정"} · 작업</p>
                      <h3 className={`text-body-lg font-title-md text-on-surface ${task.completed ? "line-through opacity-60" : ""}`}>{task.title}</h3>
                    </div>
                    <span className={`self-start rounded-pill px-base py-stack-sm text-label-md font-label-md ${category.colorClass}`}>{category.name}</span>
                  </SurfaceCard>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-stack-lg text-body-md text-on-surface-variant">
              이 날짜에는 예정된 일정이 없습니다.
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function recurrenceLabel(rule) {
  if (rule === "daily") return "매일";
  if (rule === "weekly") return "매주";
  if (rule === "monthly") return "매월";
  return "반복 안 함";
}

function EventCard({ event, onDelete }) {
  const category = getCategory(event.category);
  return (
    <SurfaceCard className="flex gap-gutter p-stack-md">
      <div className="w-1 rounded-full bg-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface-variant">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""}</p>
        <h3 className="truncate text-body-lg font-title-md text-on-surface">{event.title}</h3>
        {event.recurring !== "none" ? <p className="text-label-md text-primary">반복: {recurrenceLabel(event.recurring)}</p> : null}
      </div>
      <div className="flex items-start gap-stack-sm">
        <span className={`rounded-pill px-base py-stack-sm text-label-md font-label-md ${category.colorClass}`}>{category.name}</span>
        <Link to={`/add?type=event&id=${event.id}`} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label={`${event.title} 수정`}><Icon>edit</Icon></Link>
        <button type="button" onClick={() => onDelete(event.id)} className="rounded-full p-2 text-error hover:bg-error-container/30" aria-label={`${event.title} 삭제`}><Icon>delete</Icon></button>
      </div>
    </SurfaceCard>
  );
}
