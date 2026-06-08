import React from "react";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import { useAppData } from "../context/AppContext.jsx";

export default function CategoryNotifications() {
  const { categories, settings, importData, tasks, events } = useAppData();
  const categorySettings = settings.notificationCategories ?? {};

  const toggle = (id, key) => {
    importData({
      tasks,
      events,
      settings: {
        ...settings,
        notificationCategories: {
          ...categorySettings,
          [id]: {
            push: true,
            sound: false,
            vibrate: false,
            ...(categorySettings[id] ?? {}),
            [key]: !(categorySettings[id]?.[key] ?? (key === "push")),
          },
        },
      },
    });
  };

  return (
    <PageShell>
      <AppHeader title="카테고리 알림" back action={<span className="w-10" />} />
      <main className="mx-auto flex w-full max-w-3xl flex-col gap-stack-lg px-margin-mobile pt-stack-lg">
        <section>
          <h2 className="text-title-md font-title-md text-on-surface">알림 설정</h2>
          <p className="mt-stack-sm text-body-md text-on-surface-variant">카테고리별로 푸시, 소리, 진동을 설정하세요.</p>
        </section>

        <section className="overflow-hidden rounded-xl border border-outline-variant bg-surface-container-lowest">
          {categories.map((row, index) => {
            const prefs = { push: true, sound: false, vibrate: false, ...(categorySettings[row.id] ?? {}) };
            return (
              <div key={row.id} className={`p-stack-md ${index ? "border-t border-outline-variant/50" : ""}`}>
                <div className="mb-stack-md flex items-center gap-gutter">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary-fixed text-primary">
                    <Icon>{row.icon}</Icon>
                  </div>
                  <h3 className="text-title-md font-title-md text-on-surface">{row.name}</h3>
                </div>
                <div className="grid grid-cols-3 gap-gutter">
                  <Toggle label="푸시" active={prefs.push} onClick={() => toggle(row.id, "push")} />
                  <Toggle label="소리" active={prefs.sound} onClick={() => toggle(row.id, "sound")} />
                  <Toggle label="진동" active={prefs.vibrate} onClick={() => toggle(row.id, "vibrate")} />
                </div>
              </div>
            );
          })}
        </section>
      </main>
    </PageShell>
  );
}

function Toggle({ label, active, onClick }) {
  return (
    <button type="button" onClick={onClick} className={`h-11 rounded-xl border text-label-md font-label-md transition-all ${active ? "border-primary bg-primary text-on-primary" : "border-outline-variant bg-surface-container-low text-on-surface-variant"}`}>
      {label}
    </button>
  );
}
