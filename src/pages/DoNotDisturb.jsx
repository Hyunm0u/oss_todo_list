import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { useAppData } from "../context/AppContext.jsx";

const days = ["월", "화", "수", "목", "금", "토", "일"];

export default function DoNotDisturb() {
  const navigate = useNavigate();
  const { tasks, events, settings, importData } = useAppData();
  const [selectedDays, setSelectedDays] = useState(["Mon", "Tue", "Wed", "Thu", "Fri"]);
  const [form, setForm] = useState({ name: "Focus time", start: "22:00", end: "07:00", quietPush: true, quietSound: true });

  const toggleDay = (day) => {
    setSelectedDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  };

  const save = () => {
    const timeBands = settings.timeBands ?? [];
    importData({
      tasks,
      events,
      settings: {
        ...settings,
        timeBands: [...timeBands, { id: `band_${Date.now()}`, ...form, days: selectedDays, enabled: true }],
      },
    });
    navigate("/notifications/time");
  };

  return (
    <PageShell withNav={false} className="flex min-h-screen flex-col bg-surface text-on-surface">
      <AppHeader title="방해 금지" back action={<span className="w-10" />} className="border-b border-outline-variant" />
      <main className="flex-1 space-y-stack-lg px-margin-mobile pt-stack-lg pb-32">
        <section className="rounded-xl bg-primary-fixed p-stack-lg">
          <p className="text-body-md text-on-primary-fixed">반복되는 집중 또는 휴식 시간 동안 알림을 음소거합니다.</p>
        </section>

        <SurfaceCard className="space-y-stack-md p-stack-lg">
          <h3 className="text-title-md font-title-md">시간 및 요일</h3>
          <input className="field-input" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
          <div className="grid grid-cols-2 gap-gutter">
            <TimeInput label="시작" value={form.start} onChange={(value) => setForm({ ...form, start: value })} />
            <TimeInput label="종료" value={form.end} onChange={(value) => setForm({ ...form, end: value })} />
          </div>
          <div>
            <label className="text-label-md font-label-md text-on-surface-variant">Repeat days</label>
            <div className="mt-stack-md flex flex-wrap gap-gutter">
              {days.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex h-10 w-12 items-center justify-center rounded-full border text-label-md font-label-md transition-all active:scale-90 ${active ? "border-primary bg-primary-container text-on-primary-container" : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:border-primary"}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </SurfaceCard>

        <SurfaceCard className="p-stack-lg">
          <h3 className="mb-stack-md text-title-md font-title-md">알림 동작</h3>
          <div className="space-y-stack-md">
            <Option icon="notifications_off" title="알림 알림 음소거" active={form.quietPush} onClick={() => setForm({ ...form, quietPush: !form.quietPush })} />
            <Option icon="volume_off" title="알림 소리 음소거" active={form.quietSound} onClick={() => setForm({ ...form, quietSound: !form.quietSound })} />
          </div>
        </SurfaceCard>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 grid grid-cols-3 gap-gutter border-t border-outline-variant bg-surface-container-lowest p-margin-mobile">
        <button type="button" onClick={() => navigate(-1)} className="rounded-xl border border-outline-variant bg-surface-container px-6 py-4 text-title-md font-title-md text-on-surface-variant active:scale-95">취소</button>
        <button type="button" onClick={save} disabled={!form.name.trim()} className="col-span-2 rounded-xl bg-primary px-6 py-4 text-title-md font-title-md text-on-primary shadow-lg shadow-primary/20 active:scale-95 disabled:opacity-40">저장</button>
      </footer>
    </PageShell>
  );
}

function TimeInput({ label, value, onChange }) {
  return (
    <label className="space-y-stack-sm">
      <span className="text-label-md font-label-md text-on-surface-variant">{label}</span>
      <input className="field-input" type="time" value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Option({ icon, title, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className="flex w-full items-center gap-gutter rounded-xl bg-surface-container-low p-stack-md text-left">
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-surface-container-high text-primary">
        <Icon>{icon}</Icon>
      </div>
      <span className="flex-1 text-title-md font-title-md text-on-surface">{title}</span>
      <span className={`rounded-pill px-base py-stack-sm text-label-md font-label-md ${active ? "bg-primary text-on-primary" : "bg-surface-container text-outline"}`}>{active ? "켜짐" : "끔"}</span>
    </button>
  );
}
