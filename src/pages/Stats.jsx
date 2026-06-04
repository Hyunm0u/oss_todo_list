import React from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const bars = [48, 68, 84, 55, 76, 44, 62];
const categories = [
  { name: "공부", value: "42%", color: "bg-secondary-container" },
  { name: "운동", value: "28%", color: "bg-primary" },
  { name: "동아리", value: "18%", color: "bg-tertiary" },
  { name: "기타", value: "12%", color: "bg-outline" },
];

export default function Stats() {
  return (
    <PageShell withFab>
      <AppHeader title="학습 통계 리포트" action={<button className="material-symbols-outlined text-primary hover:bg-surface-container-high transition-colors p-base rounded-full active:scale-95">download</button>} />
      <main className="px-margin-mobile mt-stack-lg space-y-stack-lg">
        <section className="bg-primary-container text-on-primary-container rounded-xl p-stack-lg shadow-soft">
          <p className="text-label-md font-label-md opacity-80">이번 주 집중 기록</p>
          <h2 className="text-title-md font-title-md mt-stack-sm">15일 연속 달성 중!</h2>
          <div className="mt-stack-lg grid grid-cols-3 gap-gutter">
            <Metric value="24h" label="학습 시간" />
            <Metric value="31" label="완료 태스크" />
            <Metric value="92%" label="달성률" />
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <h2 className="text-title-md font-title-md text-on-surface mb-stack-sm">화요일에 가장 효율적입니다</h2>
          <p className="text-body-md font-body-md text-on-surface-variant">주중 중반에 완료율이 높고, 저녁 시간대 집중력이 안정적이에요.</p>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <div className="flex justify-between items-center mb-stack-lg">
            <h3 className="text-title-md font-title-md text-on-surface">태스크 달성 트렌드</h3>
            <div className="bg-surface-container rounded-pill p-1 flex">
              <button className="bg-white text-primary text-label-sm font-label-sm px-stack-md py-1 rounded-pill shadow-sm">Weekly</button>
              <button className="text-outline text-label-sm font-label-sm px-stack-md py-1 rounded-pill">Monthly</button>
            </div>
          </div>
          <div className="h-40 flex items-end gap-gutter">
            {bars.map((height, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-stack-sm">
                <div className="w-full bg-primary-fixed rounded-t-lg overflow-hidden flex items-end" style={{ height: 140 }}>
                  <div className="w-full bg-primary rounded-t-lg" style={{ height: `${height}%` }} />
                </div>
                <span className="text-label-md text-outline">{["월", "화", "수", "목", "금", "토", "일"][index]}</span>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <h3 className="text-title-md font-title-md text-on-surface mb-stack-lg">카테고리별 수행 비율</h3>
          <div className="space-y-stack-md">
            {categories.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-body-md font-body-md mb-stack-sm">
                  <span>{item.name}</span>
                  <span className="text-on-surface-variant">{item.value}</span>
                </div>
                <div className="h-3 bg-surface-container rounded-pill overflow-hidden">
                  <div className={`h-full ${item.color} rounded-pill`} style={{ width: item.value }} />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg">
          <Insight icon="trending_up" title="집중 시간 증가" body="지난주보다 18% 더 오래 집중했습니다." />
          <Insight icon="auto_awesome" title="추천 루틴" body="오전 9시 공부 블록을 반복 일정으로 등록해보세요." />
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
    <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
      <h3 className="text-title-md font-title-md text-on-surface flex items-center gap-2"><Icon className="text-primary">{icon}</Icon>{title}</h3>
      <p className="text-body-md font-body-md text-on-surface-variant mt-stack-sm">{body}</p>
    </div>
  );
}
