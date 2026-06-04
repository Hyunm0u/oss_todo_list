import React, { useMemo, useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const schedules = {
  10: [
    { time: "09:00", title: "경제학 원론 읽기", tag: "공부", color: "bg-secondary-container" },
    { time: "18:00", title: "헬스장 운동", tag: "운동", color: "bg-primary" },
  ],
  14: [{ time: "15:00", title: "동아리 회의", tag: "동아리", color: "bg-tertiary" }],
  22: [{ time: "20:00", title: "TOEIC 복습", tag: "공부", color: "bg-secondary-container" }],
};

export default function Calendar() {
  const [selected, setSelected] = useState(10);
  const days = useMemo(() => Array.from({ length: 35 }, (_, i) => i - 2), []);
  const selectedSchedules = schedules[selected] ?? [];

  return (
    <PageShell withFab>
      <AppHeader title="캘린더" action={<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"><Icon className="text-primary">today</Icon></button>} />
      <main className="px-margin-mobile space-y-stack-lg">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <div className="flex items-center justify-between mb-stack-lg">
            <button className="flex items-center gap-1 text-title-md font-title-md text-on-surface hover:bg-surface-container-high px-2 py-1 rounded-lg transition-colors">
              2026년 5월
              <Icon className="text-on-surface-variant">expand_more</Icon>
            </button>
            <div className="flex gap-stack-sm">
              <button className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-high rounded-full p-1 transition-colors">chevron_left</button>
              <button className="material-symbols-outlined text-on-surface-variant cursor-pointer hover:bg-surface-container-high rounded-full p-1 transition-colors">chevron_right</button>
            </div>
          </div>
          <div className="calendar-grid text-center text-label-md font-label-md text-outline mb-stack-sm">
            {["월", "화", "수", "목", "금", "토", "일"].map((day) => <span key={day}>{day}</span>)}
          </div>
          <div className="calendar-grid">
            {days.map((day, index) => {
              const inMonth = day > 0 && day <= 31;
              const isSelected = day === selected;
              const hasSchedule = Boolean(schedules[day]);
              return (
                <button
                  key={index}
                  disabled={!inMonth}
                  onClick={() => setSelected(day)}
                  className={`aspect-square rounded-full flex flex-col items-center justify-center text-body-md transition-all ${!inMonth ? "text-transparent cursor-default" : "hover:bg-surface-container-high text-on-surface"} ${isSelected ? "bg-primary text-on-primary font-bold hover:bg-primary" : ""}`}
                >
                  <span>{inMonth ? day : ""}</span>
                  {hasSchedule ? <span className={`w-1.5 h-1.5 rounded-full mt-1 ${isSelected ? "bg-on-primary" : "bg-primary"}`} /> : null}
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-stack-md">
          <h2 className="text-headline-lg-mobile font-headline-lg-mobile text-on-surface">5월 {selected}일의 일정</h2>
          {selectedSchedules.length ? (
            selectedSchedules.map((task) => (
              <div key={`${task.time}-${task.title}`} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex gap-gutter">
                <div className={`w-1 rounded-full ${task.color}`} />
                <div className="flex-1">
                  <p className="text-label-md font-label-md text-on-surface-variant">{task.time}</p>
                  <h3 className="text-body-lg font-title-md text-on-surface">{task.title}</h3>
                </div>
                <span className="px-base py-stack-sm bg-surface-container text-label-md font-label-md rounded-pill text-on-surface-variant self-start">{task.tag}</span>
              </div>
            ))
          ) : (
            <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-stack-lg text-body-md text-on-surface-variant">
              등록된 일정이 없습니다.
            </div>
          )}
        </section>

        <section className="bg-primary-fixed rounded-xl p-stack-lg">
          <h2 className="text-title-md font-title-md text-on-surface">반복 일정 추천</h2>
          <div className="mt-stack-md bg-surface-container-lowest rounded-xl p-stack-md flex items-start gap-gutter">
            <Icon fill className="text-primary">auto_awesome</Icon>
            <div>
              <h3 className="text-body-lg font-title-md text-on-surface">전공 서적 독서 (경제학 원론)</h3>
              <p className="text-body-md text-on-surface-variant">매주 화/목 오전 9시에 반복하면 현재 패턴과 잘 맞아요.</p>
            </div>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
