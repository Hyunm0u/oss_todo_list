import React from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const groups = [
  {
    title: "화면 및 표시",
    items: [
      { icon: "dark_mode", label: "다크 모드", value: "끔" },
      { icon: "language", label: "언어", value: "한국어" },
      { icon: "calendar_month", label: "주 시작 요일", value: "월요일" },
    ],
  },
  {
    title: "알림 설정",
    items: [
      { icon: "category", label: "카테고리별 알림", value: "설정", to: "/notifications/category" },
      { icon: "schedule", label: "시간대별 알림", value: "설정", to: "/notifications/time" },
      { icon: "do_not_disturb_on", label: "방해 금지 시간", value: "설정", to: "/notifications/dnd" },
    ],
  },
];

export default function Settings() {
  return (
    <PageShell withFab>
      <AppHeader title="설정" action={<button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-surface-container-high transition-colors active:scale-95"><Icon className="text-primary">help</Icon></button>} />
      <main className="px-margin-mobile mt-stack-lg space-y-stack-lg">
        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg flex items-center gap-gutter">
          <div className="w-14 h-14 rounded-full overflow-hidden bg-surface-container-high">
            <img alt="김지수" className="w-full h-full object-cover" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80" />
          </div>
          <div className="flex-1">
            <h2 className="text-title-md font-title-md text-on-surface">김지수</h2>
            <p className="text-body-md text-on-surface-variant">studyflow@example.com</p>
          </div>
          <button className="text-primary font-label-md">수정</button>
        </section>

        {groups.map((group) => (
          <section key={group.title}>
            <h3 className="text-label-sm font-label-sm text-outline uppercase tracking-wider mb-stack-sm">{group.title}</h3>
            <div className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
              {group.items.map((item, index) => {
                const content = (
                  <>
                    <Icon className="text-primary">{item.icon}</Icon>
                    <span className="flex-1 text-body-lg font-body-lg text-on-surface">{item.label}</span>
                    <span className="text-body-md text-on-surface-variant">{item.value}</span>
                    <Icon className="text-outline">chevron_right</Icon>
                  </>
                );
                const className = `w-full px-container-padding py-stack-md flex items-center gap-gutter hover:bg-surface-container-low transition-colors ${index ? "border-t border-outline-variant/50" : ""}`;
                return item.to ? <Link key={item.label} to={item.to} className={className}>{content}</Link> : <button key={item.label} className={className}>{content}</button>;
              })}
            </div>
          </section>
        ))}

        <button className="w-full py-stack-md border border-error/20 text-error font-title-md rounded-xl hover:bg-error-container/10 transition-colors active:scale-95">
          로그아웃
        </button>
      </main>
    </PageShell>
  );
}
