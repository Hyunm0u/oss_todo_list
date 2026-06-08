import React, { useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { TextHeader } from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import { getTodayISO, useAppData } from "../context/AppContext.jsx";

export default function AddSchedule() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const { tasks, events, categories, upsertTask, upsertEvent } = useAppData();
  const type = params.get("type") === "event" ? "event" : "task";
  const id = params.get("id");
  const dateParam = params.get("date");
  const existing = useMemo(() => (type === "task" ? tasks.find((task) => task.id === id) : events.find((event) => event.id === id)), [events, id, tasks, type]);
  const [form, setForm] = useState(() => ({
    title: existing?.title ?? "",
    category: existing?.category ?? "study",
    date: existing?.date ?? dateParam ?? getTodayISO(),
    time: existing?.time ?? existing?.startTime ?? "09:00",
    endTime: existing?.endTime ?? "",
    notes: existing?.notes ?? "",
    recurring: existing?.recurring ?? "none",
  }));

  const title = existing ? "일정 수정" : type === "task" ? "작업 추가" : "일정 추가";
  const canSave = form.title.trim().length > 0;

  const update = (key, value) => setForm((current) => ({ ...current, [key]: value }));

  const save = () => {
    if (!canSave) return;
    if (type === "task") {
      upsertTask({
        ...existing,
        title: form.title,
        category: form.category,
        date: form.date,
        time: form.time,
        notes: form.notes,
      });
    } else {
      upsertEvent({
        ...existing,
        title: form.title,
        category: form.category,
        date: form.date,
        startTime: form.time,
        endTime: form.endTime,
        notes: form.notes,
        recurring: form.recurring,
      });
    }
    navigate(type === "event" ? "/calendar" : "/");
  };

  return (
    <PageShell withNav={false} className="flex flex-col">
      <TextHeader title={title} rightLabel="저장" onRight={save} rightDisabled={!canSave} />
      <main className="mx-auto w-full max-w-2xl flex-grow space-y-stack-lg px-margin-mobile py-stack-lg pb-safe">
        <section className="space-y-stack-sm">
          <label className="px-1 text-label-md font-label-md text-on-surface-variant">제목</label>
          <input
            className="w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-container-padding py-4 text-body-lg font-body-lg placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder={type === "task" ? "3장 읽기" : "스터디 모임"}
            value={form.title}
            onChange={(event) => update("title", event.target.value)}
            autoFocus
          />
        </section>

        <section className="space-y-stack-md">
          <label className="px-1 text-label-md font-label-md text-on-surface-variant">카테고리</label>
          <div className="grid grid-cols-2 gap-gutter sm:grid-cols-4">
            {categories.map((item) => {
              const active = form.category === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => update("category", item.id)}
                  className={`flex items-center gap-gutter rounded-xl border p-stack-md text-left transition-all active:scale-95 ${active ? "border-primary bg-primary/10 text-primary" : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container-low"}`}
                >
                  <Icon>{item.icon}</Icon>
                  <span className="text-label-md font-label-md">{item.name}</span>
                </button>
              );
            })}
          </div>
        </section>

        <section className="grid grid-cols-1 gap-gutter sm:grid-cols-3">
          <Field label="날짜">
            <input className="field-input" type="date" value={form.date} onChange={(event) => update("date", event.target.value)} />
          </Field>
          <Field label={type === "task" ? "마감 시간" : "시작"}>
            <input className="field-input" type="time" value={form.time} onChange={(event) => update("time", event.target.value)} />
          </Field>
          {type === "event" ? (
            <Field label="종료">
              <input className="field-input" type="time" value={form.endTime} onChange={(event) => update("endTime", event.target.value)} />
            </Field>
          ) : null}
        </section>

        {type === "event" ? (
          <section className="space-y-stack-sm">
            <label className="px-1 text-label-md font-label-md text-on-surface-variant">반복</label>
            <select className="field-input" value={form.recurring} onChange={(event) => update("recurring", event.target.value)}>
              <option value="none">반복 안 함</option>
              <option value="daily">매일</option>
              <option value="weekly">매주</option>
              <option value="monthly">매월</option>
            </select>
          </section>
        ) : null}

        <section className="space-y-stack-sm">
          <label className="px-1 text-label-md font-label-md text-on-surface-variant">메모</label>
          <textarea
            className="min-h-32 w-full rounded-xl border border-outline-variant bg-surface-container-lowest px-container-padding py-4 text-body-lg font-body-lg placeholder:text-outline focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="유용한 메모를 추가하세요"
            value={form.notes}
            onChange={(event) => update("notes", event.target.value)}
          />
        </section>

        <div className="grid grid-cols-2 gap-gutter">
          <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-outline-variant bg-surface-container px-6 py-4 text-title-md font-title-md text-on-surface-variant active:scale-95">
            취소
          </button>
          <button type="button" onClick={save} disabled={!canSave} className="rounded-xl bg-primary px-6 py-4 text-title-md font-title-md text-on-primary shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-40">
            저장
          </button>
        </div>
      </main>
    </PageShell>
  );
}

function Field({ label, children }) {
  return (
    <label className="space-y-stack-sm">
      <span className="px-1 text-label-md font-label-md text-on-surface-variant">{label}</span>
      {children}
    </label>
  );
}
