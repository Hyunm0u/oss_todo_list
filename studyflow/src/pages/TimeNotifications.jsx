import React from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const timeBands = [
  { name: "취침 시간", caption: "Night Time", time: "23:00 - 07:00", days: "월 수 금", color: "bg-primary", enabled: true },
  { name: "운동", caption: "Exercise", time: "18:00 - 19:30", days: "화 목 토", color: "bg-secondary-container", enabled: true },
];

export default function TimeNotifications() {
  return (
    <PageShell>
      <AppHeader title="시간대별 알림 설정" back action={<span className="w-10" />} />
      <main className="flex-1 px-margin-mobile py-stack-lg max-w-2xl mx-auto w-full mb-24">
        <section className="bg-primary-fixed rounded-xl p-stack-lg mb-stack-lg">
          <p className="text-body-md text-on-primary-fixed">특정 시간대에 알림 강도를 자동으로 조절합니다.</p>
        </section>

        <section className="flex items-center justify-between mb-stack-md">
          <h2 className="font-title-md text-title-md text-on-surface">방해 금지 시간 목록</h2>
          <Link to="/notifications/dnd" className="flex items-center gap-2 px-4 py-2 bg-primary-container text-on-primary-container rounded-lg font-label-md text-label-md active:scale-95 transition-transform">
            <Icon className="text-[18px]">add</Icon>
            추가
          </Link>
        </section>

        <section className="space-y-stack-md">
          {timeBands.map((band) => (
            <article key={band.name} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
              <div className="flex items-start gap-gutter">
                <div className={`w-3 self-stretch rounded-full ${band.color}`} />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-gutter">
                    <div>
                      <h3 className="font-title-md text-title-md text-on-surface">{band.name} <span className="text-on-surface-variant">({band.caption})</span></h3>
                      <p className="text-body-md text-on-surface-variant mt-stack-sm">{band.time}</p>
                    </div>
                    <span className={`px-base py-stack-sm rounded-pill text-label-md font-label-md ${band.enabled ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-outline"}`}>
                      {band.enabled ? "ON" : "OFF"}
                    </span>
                  </div>
                  <div className="mt-stack-md flex items-center gap-stack-sm text-body-md text-on-surface-variant">
                    <Icon className="text-[18px]">repeat</Icon>
                    {band.days}
                  </div>
                  <div className="mt-stack-lg grid grid-cols-2 gap-gutter">
                    <Link to="/notifications/dnd" className="text-center py-3 bg-primary/10 text-primary rounded-xl font-title-md hover:bg-primary/20 transition-colors">수정</Link>
                    <button className="py-3 bg-error-container/50 text-error rounded-xl font-title-md hover:bg-error-container transition-colors">삭제</button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </section>

        <section className="mt-stack-lg bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <h2 className="font-headline-lg text-headline-lg text-on-surface">시간대 추가</h2>
          <div className="mt-stack-lg space-y-stack-md">
            <input className="w-full bg-surface-container-low border border-outline-variant rounded-xl p-3" placeholder="시간대 이름" />
            <div className="grid grid-cols-2 gap-gutter">
              <button className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex justify-between">시작 <span>08:00</span></button>
              <button className="bg-surface-container-low border border-outline-variant rounded-xl p-3 flex justify-between">종료 <span>22:00</span></button>
            </div>
            <div className="flex justify-between">
              {["월", "화", "수", "목", "금", "토", "일"].map((day, index) => (
                <button key={day} className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md transition-colors ${index < 5 ? "bg-primary text-on-primary" : "bg-surface-container-low text-on-surface-variant"}`}>{day}</button>
              ))}
            </div>
            <button className="w-full bg-primary text-on-primary py-4 rounded-xl font-title-md hover:opacity-90 active:scale-[0.98] transition-all">
              저장
            </button>
          </div>
        </section>
      </main>
    </PageShell>
  );
}
