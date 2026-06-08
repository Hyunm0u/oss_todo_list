import React, { useRef, useState } from "react";
import { Link } from "react-router-dom";
import AppHeader from "../components/AppHeader.jsx";
import Icon from "../components/Icon.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { useAppData } from "../context/AppContext.jsx";

export default function Settings() {
  const { tasks, events, settings, themeMode, setThemeMode, clearData, setAiEnabled, updateSettings, importData } = useAppData();
  const [message, setMessage] = useState("");
  const fileRef = useRef(null);
  const importRef = useRef(null);
  const profile = settings.profile ?? { name: "StudyFlow", photo: "" };

  const clearEverything = () => {
    if (!window.confirm("StudyFlow의 모든 작업, 일정, 설정을 초기화하시겠습니까?")) return;
    clearData();
    setMessage("데이터가 모두 초기화되었습니다.");
  };

  const updateProfile = (patch) => updateSettings({ profile: { ...profile, ...patch } });

  const uploadPhoto = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => updateProfile({ photo: reader.result });
    reader.readAsDataURL(file);
  };

  const importJson = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        importData(String(reader.result));
        setMessage("JSON 데이터를 가져왔습니다.");
      } catch (error) {
        setMessage(error.message || "유효하지 않은 JSON 파일입니다.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <PageShell withFab>
      <AppHeader title="설정" action={<span className="w-10" />} />
      <main className="mx-auto mt-stack-lg w-full max-w-3xl space-y-stack-lg px-margin-mobile">
        <SurfaceCard className="flex items-center gap-gutter p-stack-lg">
          <button type="button" onClick={() => fileRef.current?.click()} className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-full bg-primary-fixed text-on-primary-fixed">
            {profile.photo ? <img src={profile.photo} alt="프로필" className="h-full w-full object-cover" /> : <Icon fill className="text-[34px]">person</Icon>}
          </button>
          <input ref={fileRef} className="hidden" type="file" accept="image/*" onChange={(event) => uploadPhoto(event.target.files?.[0])} />
          <div className="flex-1">
            <input className="field-input" value={profile.name} onChange={(event) => updateProfile({ name: event.target.value })} aria-label="이름" />
            <p className="mt-stack-sm text-body-md text-on-surface-variant">{tasks.length}개 작업 · {events.length}개 일정</p>
          </div>
          <span className="rounded-pill bg-surface-container px-base py-stack-sm text-label-md text-on-surface-variant">v{settings.version}</span>
        </SurfaceCard>

        <section>
          <h3 className="mb-stack-sm text-label-sm font-label-sm uppercase tracking-wider text-outline">테마</h3>
          <SurfaceCard className="p-stack-md">
            <div className="grid grid-cols-3 gap-gutter">
              {[
                { id: "light", icon: "light_mode", label: "라이트" },
                { id: "dark", icon: "dark_mode", label: "다크" },
                { id: "system", icon: "devices", label: "시스템" },
              ].map((item) => (
                <button key={item.id} type="button" onClick={() => setThemeMode(item.id)} className={`flex flex-col items-center gap-stack-sm rounded-xl border p-stack-md transition-all active:scale-95 ${themeMode === item.id ? "border-primary bg-primary/10 text-primary" : "border-outline-variant bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high"}`}>
                  <Icon>{item.icon}</Icon>
                  <span className="text-label-md font-label-md">{item.label}</span>
                </button>
              ))}
            </div>
          </SurfaceCard>
        </section>

        <section>
          <h3 className="mb-stack-sm text-label-sm font-label-sm uppercase tracking-wider text-outline">AI 기능</h3>
          <SurfaceCard className="p-stack-md">
            <div className="flex items-center justify-between gap-gutter">
              <div>
                <p className="text-body-lg font-body-lg text-on-surface">AI 분석</p>
                <p className="text-label-md text-on-surface-variant">작업과 일정을 분석해 우선순위 TOP3를 표시합니다.</p>
              </div>
              <button type="button" onClick={() => setAiEnabled(!settings?.aiEnabled)} aria-pressed={Boolean(settings?.aiEnabled)} className={`relative inline-flex h-9 w-16 flex-shrink-0 items-center rounded-full border-2 transition-colors duration-200 ${settings?.aiEnabled ? "border-primary bg-primary/20" : "border-outline-variant bg-surface-container-high"}`}>
                <span className={`absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow transition-transform duration-200 ${settings?.aiEnabled ? "translate-x-7" : "translate-x-0"}`} />
              </button>
            </div>
          </SurfaceCard>
        </section>

        <section>
          <h3 className="mb-stack-sm text-label-sm font-label-sm uppercase tracking-wider text-outline">알림</h3>
          <SurfaceCard className="overflow-hidden">
            <NavAction icon="category" label="카테고리 알림" to="/notifications/category" />
            <NavAction icon="schedule" label="시간대 알림" to="/notifications/time" divider />
          </SurfaceCard>
        </section>

        <section>
          <h3 className="mb-stack-sm text-label-sm font-label-sm uppercase tracking-wider text-outline">데이터</h3>
          <SurfaceCard className="overflow-hidden">
            <input ref={importRef} className="hidden" type="file" accept="application/json,.json" onChange={(event) => importJson(event.target.files?.[0])} />
            <Action icon="upload_file" label="JSON 데이터 가져오기" value="가져오기" onClick={() => importRef.current?.click()} />
            <Action icon="delete_forever" label="데이터 초기화" value="초기화" onClick={clearEverything} divider danger />
          </SurfaceCard>
          {message ? <p className="mt-stack-sm text-body-md text-on-surface-variant">{message}</p> : null}
        </section>
      </main>
    </PageShell>
  );
}

function Action({ icon, label, value, onClick, divider = false, danger = false }) {
  return (
    <button type="button" onClick={onClick} className={`flex w-full items-center gap-gutter px-container-padding py-stack-md text-left transition-colors hover:bg-surface-container-low ${divider ? "border-t border-outline-variant/50" : ""}`}>
      <Icon className={danger ? "text-error" : "text-primary"}>{icon}</Icon>
      <span className="flex-1 text-body-lg font-body-lg text-on-surface">{label}</span>
      <span className={danger ? "text-body-md text-error" : "text-body-md text-on-surface-variant"}>{value}</span>
      <Icon className="text-outline">chevron_right</Icon>
    </button>
  );
}

function NavAction({ icon, label, to, divider = false }) {
  return (
    <Link to={to} className={`flex w-full items-center gap-gutter px-container-padding py-stack-md transition-colors hover:bg-surface-container-low ${divider ? "border-t border-outline-variant/50" : ""}`}>
      <Icon className="text-primary">{icon}</Icon>
      <span className="flex-1 text-body-lg font-body-lg text-on-surface">{label}</span>
      <Icon className="text-outline">chevron_right</Icon>
    </Link>
  );
}
