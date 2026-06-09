import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DateTimeFields from "../components/DateTimeFields.jsx";
import AppHeader from "../components/AppHeader.jsx";
import PageShell from "../components/PageShell.jsx";
import SurfaceCard from "../components/SurfaceCard.jsx";
import { getTodayISO, useAppData } from "../context/AppContext.jsx";

export default function TimeNotifications() {
  const navigate = useNavigate();
  const { settings, updateSettings } = useAppData();
  const [name, setName] = useState("");
  const [date, setDate] = useState(getTodayISO());
  const [start, setStart] = useState("08:00");
  const [end, setEnd] = useState("22:00");
  const timeBands = settings.timeBands ?? [];

  const addBand = () => {
    if (!name.trim()) return;
    updateSettings({ timeBands: [...timeBands, { id: `band_${Date.now()}`, name: name.trim(), date, start, end, enabled: true }] });
    navigate("/");
  };

  const toggleBand = (id) => updateSettings({ timeBands: timeBands.map((band) => (band.id === id ? { ...band, enabled: !band.enabled } : band)) });
  const deleteBand = (id) => updateSettings({ timeBands: timeBands.filter((band) => band.id !== id) });
  const updateDateTime = (key, value) => {
    if (key === "date") setDate(value);
    if (key === "time") setStart(value);
    if (key === "endTime") setEnd(value);
  };

  return (
    <PageShell>
      <AppHeader title="시간대 알림" back action={<span className="w-10" />} />
      <main className="mx-auto w-full max-w-3xl px-margin-mobile py-stack-lg">
        <section className="mb-stack-lg rounded-xl bg-primary-fixed p-stack-lg">
          <p className="text-body-md text-on-primary-fixed">특정 시간대의 알림 흐름을 설정하세요.</p>
        </section>

        <section className="space-y-stack-md">
          {timeBands.length ? timeBands.map((band) => (
            <SurfaceCard key={band.id} className="p-stack-lg">
              <div className="flex items-start gap-gutter">
                <div className="w-3 self-stretch rounded-full bg-primary" />
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-gutter">
                    <div>
                      <h3 className="text-title-md font-title-md text-on-surface">{band.name}</h3>
                      <p className="mt-stack-sm text-body-md text-on-surface-variant">{band.start} - {band.end}</p>
                    </div>
                    <button type="button" onClick={() => toggleBand(band.id)} className={`rounded-pill px-base py-stack-sm text-label-md font-label-md ${band.enabled ? "bg-primary-fixed text-on-primary-fixed" : "bg-surface-container text-outline"}`}>{band.enabled ? "켜짐" : "꺼짐"}</button>
                  </div>
                  <button type="button" onClick={() => deleteBand(band.id)} className="mt-stack-md rounded-lg px-3 py-2 text-label-md font-label-md text-error hover:bg-error-container/30">삭제</button>
                </div>
              </div>
            </SurfaceCard>
          )) : <div className="rounded-xl border border-dashed border-outline-variant bg-surface-container-low p-stack-lg text-body-md text-on-surface-variant">저장된 시간대가 없습니다.</div>}
        </section>

        <SurfaceCard className="mt-stack-lg p-stack-lg">
          <h2 className="text-title-md font-title-md text-on-surface">시간대 추가</h2>
          <div className="mt-stack-lg space-y-stack-md">
            <input className="field-input" placeholder="집중 블록" value={name} onChange={(event) => setName(event.target.value)} />
            <DateTimeFields type="event" date={date} time={start} endTime={end} onChange={updateDateTime} />
            <button type="button" onClick={addBand} disabled={!name.trim()} className="w-full rounded-xl bg-primary py-4 text-title-md font-title-md text-on-primary active:scale-[0.98] disabled:opacity-40">저장</button>
          </div>
        </SurfaceCard>
      </main>
    </PageShell>
  );
}
