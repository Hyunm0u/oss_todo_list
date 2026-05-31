import React, { useState } from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";

const days = ["월", "화", "수", "목", "금", "토", "일"];
const colors = ["#0066ff", "#fe9400", "#b60009", "#2d1600", "#727687", "#003fa4"];

export default function DoNotDisturb() {
  const [selectedDays, setSelectedDays] = useState(["월", "수", "금"]);
  const [color, setColor] = useState(colors[0]);

  const toggleDay = (day) => {
    setSelectedDays((current) => current.includes(day) ? current.filter((item) => item !== day) : [...current, day]);
  };

  return (
    <PageShell withNav={false} className="bg-surface text-on-surface min-h-screen flex flex-col">
      <AppHeader title="방해 금지 시간 추가" back action={<span className="w-10" />} className="border-b border-outline-variant h-16" />
      <main className="flex-1 px-margin-mobile pt-stack-lg space-y-stack-lg pb-32">
        <section className="bg-primary-fixed rounded-xl p-stack-lg">
          <p className="text-body-md text-on-primary-fixed">반복되는 집중 시간에는 알림을 잠시 조용하게 만들어요.</p>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg space-y-stack-md">
          <h3 className="font-title-md text-title-md">시간 및 요일 설정</h3>
          <div className="grid grid-cols-2 gap-gutter">
            <TimeButton label="시작" time="22:00" />
            <TimeButton label="종료" time="07:00" />
          </div>
          <div>
            <label className="font-label-md text-label-md text-on-surface-variant">반복 요일</label>
            <div className="flex justify-between mt-stack-md">
              {days.map((day) => {
                const active = selectedDays.includes(day);
                return (
                  <button
                    key={day}
                    onClick={() => toggleDay(day)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-label-md text-label-md transition-all border active:scale-90 ${active ? "bg-primary-container text-on-primary-container border-primary" : "bg-surface-container-low text-on-surface-variant border-outline-variant hover:border-primary"}`}
                  >
                    {day}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg space-y-stack-md">
          <h3 className="font-title-md text-title-md">표시 설정</h3>
          <input className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md" defaultValue="취침 시간" />
          <div className="flex gap-gutter">
            {colors.map((item) => (
              <button
                key={item}
                onClick={() => setColor(item)}
                className={`w-8 h-8 rounded-full transition-all ${color === item ? "ring-4 ring-primary/20 outline outline-2 outline-primary" : ""}`}
                style={{ backgroundColor: item }}
                aria-label={`${item} 색상`}
              />
            ))}
          </div>
        </section>

        <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-stack-lg">
          <h3 className="font-title-md text-title-md mb-stack-md">알림 동작</h3>
          <div className="space-y-stack-md">
            <Option icon="notifications_off" title="푸시 알림 끄기" body="선택한 시간에는 푸시를 보내지 않습니다." />
            <Option icon="volume_off" title="소리 없이 받기" body="중요 알림은 배너만 표시합니다." />
          </div>
        </section>
      </main>
      <footer className="fixed bottom-0 left-0 right-0 bg-surface-container-lowest border-t border-outline-variant p-margin-mobile grid grid-cols-3 gap-gutter">
        <button className="py-4 px-6 rounded-xl font-title-md text-title-md bg-surface-container border border-outline-variant text-on-surface-variant hover:bg-surface-variant transition-all active:scale-95">취소</button>
        <button className="col-span-2 py-4 px-6 rounded-xl font-title-md text-title-md bg-primary text-on-primary shadow-lg shadow-primary/20 hover:bg-primary-container transition-all active:scale-95">일정 저장하기</button>
      </footer>
    </PageShell>
  );
}

function TimeButton({ label, time }) {
  return (
    <button className="w-full bg-surface-container-low border border-outline-variant rounded-lg p-3 font-body-md text-body-md text-left flex justify-between items-center">
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-title-md text-title-md">{time}</span>
    </button>
  );
}

function Option({ icon, title, body }) {
  return (
    <div className="flex items-start gap-gutter">
      <div className="w-10 h-10 rounded-full bg-surface-container-low flex items-center justify-center text-primary">
        <Icon>{icon}</Icon>
      </div>
      <div>
        <p className="font-title-md text-title-md text-on-surface">{title}</p>
        <p className="text-body-md text-on-surface-variant">{body}</p>
      </div>
    </div>
  );
}
