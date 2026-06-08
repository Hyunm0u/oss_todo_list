import { CATEGORIES } from "../context/AppContext.jsx";

const DAY_MS = 24 * 60 * 60 * 1000;

function toDate(value) {
  return new Date(`${value}T00:00:00`);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function startOfWeek(date) {
  const copy = new Date(date);
  const day = copy.getDay();
  const diff = day === 0 ? -6 : 1 - day;
  copy.setDate(copy.getDate() + diff);
  copy.setHours(0, 0, 0, 0);
  return copy;
}

function rangeDays(start, length) {
  return Array.from({ length }, (_, index) => {
    const date = new Date(start);
    date.setDate(date.getDate() + index);
    return isoDate(date);
  });
}

export function calculateStats(tasks, events) {
  const now = new Date();
  const today = isoDate(now);
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter((task) => !task.completed && task.date && task.date < today).length;

  const weekStart = startOfWeek(now);
  const weekDays = rangeDays(weekStart, 7);
  const weeklyTrend = weekDays.map((date) => ({
    date,
    label: new Intl.DateTimeFormat("en", { weekday: "short" }).format(toDate(date)),
    completed: tasks.filter((task) => task.completedAt?.slice(0, 10) === date).length,
    due: tasks.filter((task) => task.date === date).length,
    events: events.filter((event) => event.date === date).length,
  }));

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthLength = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthDays = rangeDays(monthStart, monthLength);
  const monthlyCompleted = monthDays.map((date) => tasks.filter((task) => task.completedAt?.slice(0, 10) === date).length);
  const monthlyTrend = chunk(monthlyCompleted, 7).map((items, index) => ({
    label: `W${index + 1}`,
    completed: items.reduce((sum, item) => sum + item, 0),
  }));

  const categoryDistribution = CATEGORIES.map((category) => {
    const count = tasks.filter((task) => task.category === category.id).length + events.filter((event) => event.category === category.id).length;
    return { ...category, count, percent: tasks.length + events.length ? Math.round((count / (tasks.length + events.length)) * 100) : 0 };
  }).filter((category) => category.count > 0);

  const completedDates = new Set(tasks.filter((task) => task.completedAt).map((task) => task.completedAt.slice(0, 10)));
  let currentStreak = 0;
  for (let index = 0; index < 365; index += 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - index);
    if (!completedDates.has(isoDate(date))) break;
    currentStreak += 1;
  }

  const mostPostponedTask = [...tasks].sort((a, b) => Number(b.postponedCount || 0) - Number(a.postponedCount || 0))[0] ?? null;
  const upcomingEvents = events.filter((event) => event.date >= today).sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)).slice(0, 3);

  const bestDay = [...weeklyTrend].sort((a, b) => b.completed - a.completed)[0];
  const insight = totalTasks === 0
    ? "첫 작업을 추가하면 생산성 기록을 쌓기 시작할 수 있어요."
    : completionRate >= 80
      ? "완료율이 좋아요. 지금처럼 할 일을 현실적인 범위로 유지해 보세요."
      : overdueTasks > 0
        ? "기한이 지난 작업이 있어요. 완료하거나 내일로 미뤄 대시보드를 정리해 보세요."
        : `${bestDay?.label ?? "이번 주"}에 완료 흐름이 가장 좋아요.`;

  return {
    totalTasks,
    completedTasks,
    completionRate,
    overdueTasks,
    totalEvents: events.length,
    weeklyTrend,
    monthlyTrend,
    categoryDistribution,
    currentStreak,
    mostPostponedTask,
    upcomingEvents,
    insight,
  };
}

function chunk(items, size) {
  const groups = [];
  for (let index = 0; index < items.length; index += size) {
    groups.push(items.slice(index, index + size));
  }
  return groups;
}
