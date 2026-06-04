import React from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { screenLinks } from "../data/navigation.js";

const todayTasks = [
  { id: "task1", title: "운동하기", tag: "Health", tagClass: "bg-primary-fixed text-on-primary-fixed" },
  { id: "task2", title: "TOEIC 단어 외우기", tag: "Study", tagClass: "bg-secondary-fixed text-on-secondary-fixed" },
  { id: "task3", title: "팀 프로젝트 회의", tag: "Club", tagClass: "bg-tertiary-fixed text-on-tertiary-fixed", active: true },
];

export default function Dashboard() {
  return (
    <PageShell withFab>
      <AppHeader title="StudyFlow" showProfile />
      <main className="px-margin-mobile mt-stack-md flex flex-col gap-stack-lg">
        <section className="flex flex-col gap-stack-sm">
          <h2 className="text-headline-xl font-headline-xl text-on-surface">좋은 저녁이에요, 김철수님</h2>
          <p className="text-body-lg font-body-lg text-on-surface-variant">오늘의 목표를 향해 한 걸음 더 나아가볼까요?</p>
        </section>

        <section className="flex flex-col gap-stack-md">
          <div className="flex items-center justify-between">
            <h3 className="text-title-md font-title-md text-on-surface">가장 시급한 할 일</h3>
          </div>
          <SurfaceCard className="p-stack-lg flex items-center gap-gutter relative overflow-hidden shadow-lg active:scale-[0.98] transition-transform">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-tertiary-container" />
            <div className="flex-1">
              <h4 className="text-title-md font-title-md text-on-surface">유형문화학 과제 제출</h4>
              <p className="text-body-md font-body-md text-tertiary font-medium mt-stack-sm flex items-center gap-1">
                <Icon className="text-[18px]">schedule</Icon>
                D-1 | 오늘 오후 11:59까지
              </p>
            </div>
            <div className="w-10 h-10 rounded-full bg-error-container flex items-center justify-center text-on-error-container">
              <Icon className="font-bold">priority_high</Icon>
            </div>
          </SurfaceCard>
        </section>

        <section className="flex flex-col gap-stack-md">
          <h3 className="text-title-md font-title-md text-on-surface">오늘의 할 일</h3>
          <div className="flex flex-col gap-stack-sm">
            {todayTasks.map((task) => (
              <SurfaceCard key={task.id} className="p-stack-md flex items-center justify-between hover:bg-surface-container-low transition-colors group">
                <div className="flex items-center gap-stack-md">
                  <input className="satisfying-snap w-6 h-6 rounded-md border-outline text-primary focus:ring-primary" id={task.id} type="checkbox" />
                  <label className="text-body-lg font-body-lg text-on-surface cursor-pointer select-none" htmlFor={task.id}>{task.title}</label>
                </div>
                <div className="flex items-center gap-stack-sm">
                  {task.active ? <span className="pulse-ongoing w-2 h-2 rounded-full bg-primary" /> : null}
                  <span className={`px-base py-stack-sm text-label-md font-label-md rounded-pill ${task.tagClass}`}>{task.tag}</span>
                </div>
              </SurfaceCard>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-stack-lg">
          <section className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">미뤄진 할 일</h3>
            <div className="bg-surface-container-low border border-dashed border-outline-variant rounded-xl p-stack-md flex flex-col gap-stack-sm">
              <div className="flex items-start gap-stack-md">
                <Icon className="text-secondary mt-1">history</Icon>
                <div>
                  <p className="text-body-md font-body-md font-semibold text-on-surface">TOEIC 공부</p>
                  <p className="text-label-md font-label-md text-secondary">2일째 지연 중</p>
                </div>
              </div>
            </div>
          </section>

          <section className="flex flex-col gap-stack-md">
            <h3 className="text-title-md font-title-md text-on-surface">AI 스마트 제언</h3>
            <div className="bg-primary-container text-on-primary-container rounded-xl p-stack-lg shadow-soft flex gap-stack-md">
              <Icon fill className="text-[28px]">auto_awesome</Icon>
              <p className="text-body-md font-body-md leading-relaxed">
                내일 시험이 있으니 <span className="font-bold underline decoration-2">전공 과목 공부</span>를 먼저 끝내는 것을 추천해요.
              </p>
            </div>
          </section>
        </div>

        <section className="flex flex-col gap-stack-md">
          <h3 className="text-title-md font-title-md text-on-surface">연결된 화면</h3>
          <div className="grid grid-cols-2 gap-gutter">
            {screenLinks.map((link) => (
              <Link key={link.to} to={link.to} className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-md flex items-center gap-gutter hover:bg-surface-container-low transition-colors">
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
