import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const initial = [
  { id: "study", name: "공부", icon: "menu_book", push: true, sound: true, vibrate: false },
  { id: "exercise", name: "운동", icon: "fitness_center", push: true, sound: false, vibrate: true },
  { id: "club", name: "동아리", icon: "groups", push: false, sound: true, vibrate: false },
  { id: "etc", name: "기타", icon: "more_horiz", push: true, sound: false, vibrate: false },
];

export default function CategoryNotifications() {
  const [rows, setRows] = useState(initial);

  const toggle = (id, key) => {
    setRows((current) => current.map((row) => row.id === id ? { ...row, [key]: !row[key] } : row));
  };

  return (
    <PageShell>
      <AppHeader title="카테고리별 알림 설정" back action={<span className="w-10" />} />
      <main className="flex-1 px-margin-mobile pt-stack-lg flex flex-col gap-stack-lg">
        <section>
          <h2 className="font-title-md text-title-md text-on-surface">알림 유형 개인화</h2>
          <p className="text-body-md text-on-surface-variant mt-stack-sm">카테고리마다 푸시, 소리, 진동 방식을 다르게 설정합니다.</p>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl overflow-hidden">
          {rows.map((row, index) => (
            <div key={row.id} className={`p-stack-md ${index ? "border-t border-outline-variant/50" : ""}`}>
              <div className="flex items-center gap-gutter mb-stack-md">
                <div className="w-10 h-10 rounded-full bg-primary-fixed flex items-center justify-center text-primary">
                  <Icon>{row.icon}</Icon>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface">{row.name}</h3>
              </div>
              <div className="grid grid-cols-3 gap-gutter">
                <Toggle label="푸시" active={row.push} onClick={() => toggle(row.id, "push")} />
                <Toggle label="소리" active={row.sound} onClick={() => toggle(row.id, "sound")} />
                <Toggle label="진동" active={row.vibrate} onClick={() => toggle(row.id, "vibrate")} />
              </div>
            </div>
          ))}
        </section>

        <button className="w-full h-14 bg-primary text-on-primary rounded-xl font-title-md text-title-md shadow-lg active:scale-95 transition-transform duration-150 flex items-center justify-center gap-2">
          <Icon>save</Icon>
          저장하기
        </button>
      </main>
    </PageShell>
  );
}

function Toggle({ label, active, onClick }) {
  return (
    <button onClick={onClick} className={`h-11 rounded-xl border font-label-md text-label-md transition-all ${active ? "bg-primary text-on-primary border-primary" : "bg-surface-container-low text-on-surface-variant border-outline-variant"}`}>
      {label}
    </button>
  );
}
