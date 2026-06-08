import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { getCategory, getTodayISO, toISODate, useAppData } from "../context/AppContext.jsx";

export default function Calendar() {
  const { tasks, events, deleteTask, deleteEvent } = useAppData();
  const [cursor, setCursor] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });
  const [selectedDate, setSelectedDate] = useState(getTodayISO());
  const [pickerOpen, setPickerOpen] = useState(false);
  const [picker, setPicker] = useState({ year: cursor.getFullYear(), month: cursor.getMonth() + 1 });

  const calendarDays = useMemo(() => {
    const first = new Date(cursor.getFullYear(), cursor.getMonth(), 1);
    const startOffset = -first.getDay();
    return Array.from({ length: 42 }, (_, index) => {
      const date = new Date(first);
      date.setDate(date.getDate() + startOffset + index);
      return date;
    });
  }, [cursor]);

  const selectedEvents = events.filter((event) => event.date === selectedDate).sort((a, b) => (a.startTime || "").localeCompare(b.startTime || ""));
  const selectedTasks = tasks.filter((task) => task.date === selectedDate).sort((a, b) => (a.time || "99:99").localeCompare(b.time || "99:99"));
  const monthLabel = new Intl.DateTimeFormat("ko-KR", { month: "long", year: "numeric" }).format(cursor);
  const years = Array.from({ length: 11 }, (_, index) => cursor.getFullYear() - 5 + index);

  const moveMonth = (step) => setCursor((current) => new Date(current.getFullYear(), current.getMonth() + step, 1));
  const jumpMonth = () => {
    const next = new Date(Number(picker.year), Number(picker.month) - 1, 1);
    setCursor(next);
    setSelectedDate(toISODate(next));
    setPickerOpen(false);
  };

  const deleteRecurring = (event) => {
    const scope = event.recurrenceGroupId && window.confirm("확인을 누르면 이후 모든 반복 일정을 삭제합니다. 취소를 누르면 이번 일정만 삭제합니다.") ? "future" : "single";
    deleteEvent(event.id, scope);
  };

  return (
    <PageShell withFab>
      <AppHeader title="캘린더" action={<span className="w-10" />} />
      <main className="mx-auto w-full max-w-5xl space-y-stack-lg px-margin-mobile">
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-lg">
          <div className="mb-stack-lg flex items-center justify-between">
            <button type="button" onClick={() => setPickerOpen((value) => !value)} className="rounded-lg px-2 py-1 text-title-md font-title-md text-on-surface transition-colors hover:bg-surface-container-high">
              {monthLabel}
            </button>
            <div className="flex gap-stack-sm">
              <button type="button" onClick={() => moveMonth(-1)} className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high" aria-label="이전 달"><Icon>chevron_left</Icon></button>
              <button type="button" onClick={() => moveMonth(1)} className="rounded-full p-1 text-on-surface-variant hover:bg-surface-container-high" aria-label="다음 달"><Icon>chevron_right</Icon></button>
            </div>
          </div>

          {pickerOpen ? (
            <div className="mb-stack-lg grid grid-cols-3 gap-gutter rounded-xl bg-surface-container-low p-stack-md">
              <select className="field-input" value={picker.year} onChange={(event) => setPicker((current) => ({ ...current, year: event.target.value }))}>
                {years.map((year) => <option key={year} value={year}>{year}년</option>)}
              </select>
              <select className="field-input" value={picker.month} onChange={(event) => setPicker((current) => ({ ...current, month: event.target.value }))}>
                {Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{index + 1}월</option>)}
              </select>
              <button type="button" onClick={jumpMonth} className="rounded-xl bg-primary px-4 py-3 text-label-md font-label-md text-on-primary">이동</button>
            </div>
          ) : null}

          <div className="calendar-grid mb-stack-sm text-center text-label-md font-label-md text-outline">
            {["일", "월", "화", "수", "목", "금", "토"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {calendarDays.map((date) => {
              const dateString = toISODate(date);
              const inMonth = date.getMonth() === cursor.getMonth();
              const isSelected = dateString === selectedDate;
              const count = tasks.filter((task) => task.date === dateString).length + events.filter((event) => event.date === dateString).length;
              return (
                <button
                  key={dateString}
                  type="button"
                  onClick={() => setSelectedDate(dateString)}
                  className={`flex aspect-square flex-col items-center justify-center rounded-xl text-body-md transition-all ${inMonth ? "text-on-surface hover:bg-surface-container-high" : "text-outline/50"} ${isSelected ? "bg-primary text-on-primary hover:bg-primary" : ""}`}
                >
                  <span>{date.getDate()} {count ? <span className="text-label-sm">•{count}</span> : null}</span>
                  {count ? <span className={`mt-1 h-1.5 w-8 rounded-full ${isSelected ? "bg-on-primary" : "bg-primary"}`} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-stack-md">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">
            {new Intl.DateTimeFormat("ko-KR", { weekday: "long", month: "long", day: "numeric" }).format(new Date(`${selectedDate}T00:00:00`))}
          </h2>
          {selectedEvents.length || selectedTasks.length ? (
            <div className="grid grid-cols-1 gap-stack-md md:grid-cols-2">
              {selectedEvents.map((event) => <EventCard key={event.id} event={event} onDelete={() => deleteRecurring(event)} />)}
              {selectedTasks.map((task) => <TaskCard key={task.id} task={task} onDelete={() => deleteTask(task.id)} />)}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-stack-lg text-body-md text-on-surface-variant">
              이 날짜에는 작업이나 일정이 없습니다.
            </div>
          )}
        </section>
      </main>
    </PageShell>
  );
}

function TaskCard({ task, onDelete }) {
  const category = getCategory(task.category);
  return (
    <SurfaceCard className="flex gap-gutter p-stack-md">
      <div className="w-1 rounded-full bg-secondary-container" />
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface-variant">{task.time || "시간 미정"} · 작업</p>
        <h3 className={`truncate text-body-lg font-title-md text-on-surface ${task.completed ? "line-through opacity-60" : ""}`}>{task.title}</h3>
      </div>
      <Actions type="task" id={task.id} title={task.title} category={category} onDelete={onDelete} />
    </SurfaceCard>
  );
}

function EventCard({ event, onDelete }) {
  const category = getCategory(event.category);
  return (
    <SurfaceCard className="flex gap-gutter p-stack-md">
      <div className="w-1 rounded-full bg-primary" />
      <div className="min-w-0 flex-1">
        <p className="text-label-md text-on-surface-variant">{event.startTime}{event.endTime ? ` - ${event.endTime}` : ""} · 일정</p>
        <h3 className="truncate text-body-lg font-title-md text-on-surface">{event.title}{event.recurring !== "none" ? " 반복" : ""}</h3>
      </div>
      <Actions type="event" id={event.id} title={event.title} category={category} onDelete={onDelete} />
    </SurfaceCard>
  );
}

function Actions({ type, id, title, category, onDelete }) {
  return (
    <div className="flex shrink-0 items-start gap-stack-sm">
      <span className={`hidden rounded-pill px-base py-stack-sm text-label-md font-label-md sm:inline-flex ${category.colorClass}`}>{category.name}</span>
      <Link to={`/add?type=${type}&id=${id}`} className="rounded-full p-2 text-on-surface-variant hover:bg-surface-container-high" aria-label={`${title} 수정`}><Icon>edit</Icon></Link>
      <button type="button" onClick={onDelete} className="rounded-full p-2 text-error hover:bg-error-container/30" aria-label={`${title} 삭제`}><Icon>delete</Icon></button>
    </div>
  );
}
