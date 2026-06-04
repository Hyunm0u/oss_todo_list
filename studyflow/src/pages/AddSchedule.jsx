import React, { useState } from "react";
import { TextHeader } from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const categories = [
  { id: 1, name: "운동", icon: "fitness_center", color: "#0050cb" },
  { id: 2, name: "공부", icon: "menu_book", color: "#fe9400" },
  { id: 3, name: "동아리", icon: "groups", color: "#b60009" },
  { id: 4, name: "기타", icon: "more_horiz", color: "#727687" },
];

export default function AddSchedule() {
  const [category, setCategory] = useState(2);

  return (
    <PageShell withNav={false} className="flex flex-col overflow-x-hidden">
      <TextHeader title="일정 추가" leftLabel="취소" rightLabel="완료" />
      <main className="flex-grow px-margin-mobile py-stack-lg max-w-2xl mx-auto w-full pb-safe">
        <div className="space-y-stack-lg">
          <section className="space-y-stack-sm">
            <label className="font-label-md text-label-md text-on-surface-variant px-1">일정 제목</label>
            <input className="w-full bg-surface-container-lowest border border-outline-variant rounded-2xl px-container-padding py-4 font-body-lg text-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" placeholder="할 일을 입력하세요" type="text" />
          </section>

          <section className="space-y-stack-md">
            <label className="font-label-md text-label-md text-on-surface-variant px-1">카테고리</label>
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-gutter">
              {categories.map((item) => {
                const active = category === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setCategory(item.id)}
                    className={`group flex flex-col items-center justify-center p-4 rounded-2xl border transition-all relative ${active ? "scale-105 border-primary bg-primary/5 text-primary" : "border-outline-variant bg-surface-container-lowest text-on-surface"}`}
                  >
                    <Icon className="mb-2 text-3xl" style={{ color: item.color }}>{item.icon}</Icon>
                    <span className="font-label-md text-label-md">{item.name}</span>
                    {active ? <span className="absolute -top-1 -right-1 w-7 h-7 bg-white rounded-full flex items-center justify-center shadow-lg border border-outline-variant/20"><Icon className="text-primary text-[16px]">edit</Icon></span> : null}
                  </button>
                );
              })}
              <button type="button" className="flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-dashed border-outline-variant hover:border-primary hover:bg-primary/5 transition-all group order-last">
                <Icon className="mb-2 text-3xl text-outline group-hover:text-primary">add</Icon>
                <span className="font-label-md text-label-md text-outline group-hover:text-primary">추가</span>
              </button>
            </div>
          </section>

          <section className="space-y-stack-md">
            <label className="font-label-md text-label-md text-on-surface-variant px-1">날짜 및 시간</label>
            <button className="w-full bg-surface-container-low border-none rounded-xl px-container-padding py-3 font-body-md text-body-md text-on-surface flex justify-between items-center transition-all hover:bg-surface-container-high active:scale-[0.98]">
              <span className="flex items-center gap-gutter"><Icon className="text-primary">calendar_today</Icon>2026년 5월 31일</span>
              <Icon className="text-on-surface-variant">chevron_right</Icon>
            </button>
            <div className="grid grid-cols-2 gap-gutter">
              <button className="bg-surface-container-low rounded-xl px-container-padding py-3 flex justify-between items-center hover:bg-surface-container-high">
                <span className="flex items-center gap-gutter"><Icon className="text-primary">schedule</Icon>09:00</span>
                <span className="text-label-md text-outline">시작</span>
              </button>
              <button className="bg-surface-container-low rounded-xl px-container-padding py-3 flex justify-between items-center hover:bg-surface-container-high">
                <span className="flex items-center gap-gutter"><Icon className="text-primary">schedule</Icon>10:30</span>
                <span className="text-label-md text-outline">종료</span>
              </button>
            </div>
          </section>

          <section className="space-y-stack-sm">
            <label className="font-label-md text-label-md text-on-surface-variant px-1">메모</label>
            <textarea className="w-full min-h-32 bg-surface-container-lowest border border-outline-variant rounded-2xl px-container-padding py-4 font-body-lg text-body-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-outline" placeholder="세부 내용을 적어두세요" />
          </section>

          <section className="glass-modal bg-white/80 rounded-3xl p-stack-lg border border-outline-variant/30 shadow-lg">
            <h3 className="font-headline-lg text-on-surface mb-stack-md">시간 설정</h3>
            <div className="flex gap-gutter overflow-x-auto pb-2">
              {["아침", "운동", "공부", "밤"].map((label) => (
                <button key={label} className="px-4 py-2 rounded-full bg-white/50 border border-outline-variant/20 font-label-md text-label-md text-on-surface-variant hover:bg-primary/10 hover:text-primary transition-all">{label}</button>
              ))}
            </div>
          </section>
        </div>
      </main>
    </PageShell>
  );
}
