import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const DATA_KEY = "studyflow:data:v1";
const THEME_KEY = "studyflow:theme";

export const CATEGORIES = [
  { id: "study", name: "공부", icon: "menu_book", colorClass: "bg-secondary-container text-on-secondary-container" },
  { id: "exercise", name: "운동", icon: "fitness_center", colorClass: "bg-primary-fixed text-on-primary-fixed" },
  { id: "club", name: "동아리", icon: "groups", colorClass: "bg-tertiary-fixed text-on-tertiary-fixed" },
  { id: "personal", name: "개인", icon: "person", colorClass: "bg-surface-container-high text-on-surface" },
];

const initialData = {
  tasks: [],
  events: [],
  settings: {
    version: "0.1.0",
    weekStartsOn: "monday",
    notificationCategories: {},
    timeBands: [],
    aiEnabled: false,
    profile: { name: "StudyFlow", photo: "" },
  },
};

const AppContext = createContext(null);

export function toISODate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function todayISO() {
  return toISODate(new Date());
}

function parseISODate(value) {
  const [year, month, day] = String(value || todayISO()).split("-").map(Number);
  return new Date(year, month - 1, day);
}

function safeParse(value, fallback) {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
}

function normalizeData(value) {
  return {
    ...initialData,
    ...value,
    tasks: Array.isArray(value?.tasks) ? value.tasks : [],
    events: Array.isArray(value?.events) ? value.events : [],
    settings: {
      ...initialData.settings,
      ...(value?.settings ?? {}),
      profile: { ...initialData.settings.profile, ...(value?.settings?.profile ?? {}) },
    },
  };
}

function uid(prefix) {
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function applyTheme(mode) {
  const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
  const isDark = mode === "dark" || (mode === "system" && prefersDark);
  document.documentElement.classList.toggle("dark", isDark);
  document.documentElement.dataset.theme = mode;
}

function addRecurringDate(date, rule) {
  const next = new Date(date);
  if (rule === "daily") next.setDate(next.getDate() + 1);
  if (rule === "weekly") next.setDate(next.getDate() + 7);
  if (rule === "monthly") next.setMonth(next.getMonth() + 1);
  return next;
}

function buildEvent(payload, now, overrides = {}) {
  return {
    id: overrides.id || payload.id || uid("event"),
    title: payload.title.trim(),
    category: payload.category || "study",
    date: overrides.date || payload.date || todayISO(),
    startTime: payload.startTime || "09:00",
    endTime: payload.endTime || "",
    notes: payload.notes || "",
    recurring: payload.recurring || "none",
    recurrenceGroupId: overrides.recurrenceGroupId || payload.recurrenceGroupId || null,
    recurrenceIndex: overrides.recurrenceIndex ?? payload.recurrenceIndex ?? 0,
    createdAt: payload.createdAt || now,
    updatedAt: now,
  };
}

function expandRecurringEvents(payload, now) {
  if (!payload.recurring || payload.recurring === "none") return [buildEvent(payload, now)];
  const groupId = payload.recurrenceGroupId || uid("series");
  const events = [];
  let date = parseISODate(payload.date);
  const count = payload.recurring === "monthly" ? 12 : 90;
  for (let index = 0; index < count; index += 1) {
    events.push(buildEvent(payload, now, {
      id: index === 0 && payload.id ? payload.id : uid("event"),
      date: toISODate(date),
      recurrenceGroupId: groupId,
      recurrenceIndex: index,
    }));
    date = addRecurringDate(date, payload.recurring);
  }
  return events;
}

export function AppProvider({ children }) {
  const [data, setData] = useState(() => normalizeData(safeParse(localStorage.getItem(DATA_KEY), initialData)));
  const [themeMode, setThemeMode] = useState(() => localStorage.getItem(THEME_KEY) || "system");

  useEffect(() => {
    localStorage.setItem(DATA_KEY, JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    localStorage.setItem(THEME_KEY, themeMode);
    applyTheme(themeMode);
    const media = window.matchMedia?.("(prefers-color-scheme: dark)");
    if (!media) return undefined;
    const listener = () => applyTheme(themeMode);
    media.addEventListener("change", listener);
    return () => media.removeEventListener("change", listener);
  }, [themeMode]);

  const upsertTask = useCallback((payload) => {
    setData((current) => {
      const now = new Date().toISOString();
      const task = {
        id: payload.id || uid("task"),
        title: payload.title.trim(),
        category: payload.category || "study",
        date: payload.date || todayISO(),
        time: payload.time || "",
        notes: payload.notes || "",
        completed: Boolean(payload.completed),
        createdAt: payload.createdAt || now,
        updatedAt: now,
        completedAt: payload.completedAt || null,
        postponedCount: Number(payload.postponedCount || 0),
      };
      const exists = current.tasks.some((item) => item.id === task.id);
      return { ...current, tasks: exists ? current.tasks.map((item) => (item.id === task.id ? { ...item, ...task } : item)) : [...current.tasks, task] };
    });
  }, []);

  const deleteTask = useCallback((id) => {
    setData((current) => ({ ...current, tasks: current.tasks.filter((task) => task.id !== id) }));
  }, []);

  const toggleTask = useCallback((id) => {
    setData((current) => ({
      ...current,
      tasks: current.tasks.map((task) => {
        if (task.id !== id) return task;
        const completed = !task.completed;
        return { ...task, completed, completedAt: completed ? new Date().toISOString() : null, updatedAt: new Date().toISOString() };
      }),
    }));
  }, []);

  const upsertEvent = useCallback((payload, options = {}) => {
    setData((current) => {
      const now = new Date().toISOString();
      const exists = current.events.find((item) => item.id === payload.id);
      if (exists && options.scope === "future" && exists.recurrenceGroupId) {
        const kept = current.events.filter((event) => event.recurrenceGroupId !== exists.recurrenceGroupId || event.date < exists.date);
        return { ...current, events: [...kept, ...expandRecurringEvents({ ...payload, recurrenceGroupId: exists.recurrenceGroupId }, now)] };
      }
      if (!exists && payload.recurring && payload.recurring !== "none") {
        return { ...current, events: [...current.events, ...expandRecurringEvents(payload, now)] };
      }
      const event = buildEvent({ ...exists, ...payload, recurring: payload.recurring || "none" }, now, { id: payload.id });
      return { ...current, events: exists ? current.events.map((item) => (item.id === event.id ? { ...item, ...event } : item)) : [...current.events, event] };
    });
  }, []);

  const deleteEvent = useCallback((id, scope = "single") => {
    setData((current) => {
      const target = current.events.find((event) => event.id === id);
      if (scope === "future" && target?.recurrenceGroupId) {
        return { ...current, events: current.events.filter((event) => event.recurrenceGroupId !== target.recurrenceGroupId || event.date < target.date) };
      }
      return { ...current, events: current.events.filter((event) => event.id !== id) };
    });
  }, []);

  const importData = useCallback((value) => {
    const parsed = typeof value === "string" ? safeParse(value, null) : value;
    if (!parsed || !Array.isArray(parsed.tasks) || !Array.isArray(parsed.events)) throw new Error("유효하지 않은 JSON 데이터입니다.");
    setData(normalizeData(parsed));
  }, []);

  const clearData = useCallback(() => setData(initialData), []);
  const setAiEnabled = useCallback((enabled) => setData((current) => ({ ...current, settings: { ...current.settings, aiEnabled: Boolean(enabled) } })), []);
  const updateSettings = useCallback((patch) => setData((current) => ({ ...current, settings: { ...current.settings, ...patch } })), []);

  const value = useMemo(() => ({
    ...data,
    categories: CATEGORIES,
    themeMode,
    setThemeMode,
    setAiEnabled,
    updateSettings,
    upsertTask,
    deleteTask,
    toggleTask,
    upsertEvent,
    deleteEvent,
    importData,
    clearData,
  }), [data, themeMode, updateSettings, upsertTask, deleteTask, toggleTask, upsertEvent, deleteEvent, importData, clearData]);

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppData() {
  const value = useContext(AppContext);
  if (!value) throw new Error("useAppData must be used inside AppProvider");
  return value;
}

export function getCategory(categoryId) {
  return CATEGORIES.find((category) => category.id === categoryId) ?? CATEGORIES[0];
}

export function formatDateLabel(dateString) {
  const date = parseISODate(dateString);
  return new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", weekday: "short" }).format(date);
}

export function getTodayISO() {
  return todayISO();
}
