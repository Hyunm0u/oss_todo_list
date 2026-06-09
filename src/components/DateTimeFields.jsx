import React, { useEffect, useRef, useState } from "react";
import Icon from "./Icon.jsx";

const HOURS = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, "0"));
const MINUTES = Array.from({ length: 60 }, (_, index) => String(index).padStart(2, "0"));

function splitTime(value) {
  const [hour = "09", minute = "00"] = String(value || "09:00").split(":");
  return { hour: hour.padStart(2, "0"), minute: minute.padStart(2, "0") };
}

function joinTime(hour, minute) {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

export default function DateTimeFields({ type, date, time, endTime, onChange }) {
  const start = splitTime(time);
  const end = splitTime(endTime || "10:00");
  const showEnd = type === "event";

  const updateStart = (part, value) => {
    onChange("time", part === "hour" ? joinTime(value, start.minute) : joinTime(start.hour, value));
  };

  const updateEnd = (part, value) => {
    onChange("endTime", part === "hour" ? joinTime(value, end.minute) : joinTime(end.hour, value));
  };

  return (
    <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-stack-md shadow-soft">
      <div className="mb-stack-md flex items-center justify-between gap-gutter">
        <div>
          <p className="text-label-md font-label-md text-on-surface-variant">날짜 및 시간</p>
          <h3 className="text-title-md font-title-md text-on-surface">{type === "task" ? "마감 설정" : "일정 시간 설정"}</h3>
        </div>
        <div className="rounded-xl bg-surface-container-low px-3 py-2 text-right">
          <p className="text-label-md text-on-surface-variant">{date}</p>
          <p className="text-title-md font-title-md text-on-surface">{time}{showEnd && endTime ? ` - ${endTime}` : ""}</p>
        </div>
      </div>

      <label className="mb-stack-md block space-y-stack-sm">
        <span className="px-1 text-label-md font-label-md text-on-surface-variant">날짜</span>
        <input className="field-input" type="date" value={date} onChange={(event) => onChange("date", event.target.value)} />
      </label>

      <div className="space-y-stack-md">
        <WheelTimePicker
          icon={type === "task" ? "alarm" : "schedule"}
          label={type === "task" ? "마감 시간" : "시작 시간"}
          hour={start.hour}
          minute={start.minute}
          onHour={(value) => updateStart("hour", value)}
          onMinute={(value) => updateStart("minute", value)}
        />
        {showEnd ? (
          <WheelTimePicker
            icon="timer_off"
            label="종료 시간"
            hour={end.hour}
            minute={end.minute}
            onHour={(value) => updateEnd("hour", value)}
            onMinute={(value) => updateEnd("minute", value)}
          />
        ) : null}
      </div>
    </section>
  );
}

function WheelTimePicker({ icon, label, hour, minute, onHour, onMinute }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-stack-md">
      <div className="mb-stack-sm flex items-center gap-gutter">
        <Icon className="text-primary">{icon}</Icon>
        <span className="text-body-lg font-body-lg text-on-surface">{label}</span>
      </div>
      <div className="relative rounded-xl bg-surface-container-lowest px-3 py-stack-md">
        <div className="pointer-events-none absolute left-3 right-3 top-1/2 h-10 -translate-y-1/2 rounded-lg bg-primary-fixed" />
        <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-gutter">
          <WheelSelect label={`${label} 시`} value={hour} options={HOURS} suffix="시" onChange={onHour} />
          <span className="z-10 text-title-md font-title-md text-on-surface-variant">:</span>
          <WheelSelect label={`${label} 분`} value={minute} options={MINUTES} suffix="분" onChange={onMinute} />
        </div>
      </div>
    </div>
  );
}

function WheelSelect({ label, value, options, suffix, onChange }) {
  const scrollerRef = useRef(null);
  const timerRef = useRef(null);
  const [displayValue, setDisplayValue] = useState(value);
  const itemHeight = 36;
  const padding = 54;

  useEffect(() => {
    const index = Math.max(0, options.indexOf(value));
    const scroller = scrollerRef.current;
    if (!scroller) return;
    setDisplayValue(value);
    window.requestAnimationFrame(() => {
      scroller.scrollTo({ top: index * itemHeight, behavior: "auto" });
    });
  }, [options, value]);

  useEffect(() => () => window.clearTimeout(timerRef.current), []);

  const commitNearest = () => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const index = Math.max(0, Math.min(options.length - 1, Math.round(scroller.scrollTop / itemHeight)));
    const next = options[index];
    scroller.scrollTo({ top: index * itemHeight, behavior: "smooth" });
    if (next !== value) onChange(next);
  };

  const handleScroll = () => {
    const scroller = scrollerRef.current;
    if (scroller) {
      const index = Math.max(0, Math.min(options.length - 1, Math.round(scroller.scrollTop / itemHeight)));
      setDisplayValue(options[index]);
    }
    window.clearTimeout(timerRef.current);
    timerRef.current = window.setTimeout(commitNearest, 140);
  };

  const handleWheel = (event) => {
    event.preventDefault();
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const currentIndex = Math.max(0, Math.min(options.length - 1, Math.round(scroller.scrollTop / itemHeight)));
    const step = event.deltaY > 0 ? 1 : -1;
    const nextIndex = Math.max(0, Math.min(options.length - 1, currentIndex + step));
    const next = options[nextIndex];
    setDisplayValue(next);
    scroller.scrollTo({ top: nextIndex * itemHeight, behavior: "smooth" });
    if (next !== value) onChange(next);
  };

  return (
    <div className="relative h-36 overflow-hidden" aria-label={label}>
      <div
        ref={scrollerRef}
        role="listbox"
        tabIndex={0}
        onScroll={handleScroll}
        onWheel={handleWheel}
        className="time-scroll-wheel relative z-20 h-full overflow-y-auto scroll-smooth px-1"
        style={{ paddingTop: padding, paddingBottom: padding }}
      >
        {options.map((option) => {
          const active = option === displayValue;
          return (
            <div
              key={option}
              role="option"
              aria-selected={active}
              className={`flex h-9 snap-center items-center justify-center text-center transition-colors ${active ? "text-title-md font-title-md text-on-primary-fixed" : "text-body-md text-outline"}`}
            >
              {option}<span className="ml-1 text-label-md">{suffix}</span>
            </div>
          );
        })}
      </div>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-30 flex h-full flex-col items-center justify-center">
        {[-2, -1, 0, 1, 2].map((offset) => (
          <div key={offset} className={`h-9 w-full ${offset === 0 ? "" : Math.abs(offset) === 2 ? "bg-surface-container-lowest/70" : "bg-surface-container-lowest/35"}`} />
        ))}
      </div>
    </div>
  );
}
