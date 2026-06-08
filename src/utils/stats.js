import { CATEGORIES } from "../context/AppContext.jsx";

function toDate(value) {
  return new Date(`${value}T00:00:00`);
}

function isoDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
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

function chunk(items, size) {
  const groups = [];
  for (let index = 0; index < items.length; index += size) groups.push(items.slice(index, index + size));
  return groups;
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
  const weekdayLabels = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weeklyTrend = weekDays.map((date) => {
    const completed = tasks.filter((task) => task.completedAt?.slice(0, 10) === date).length;
    const due = tasks.filter((task) => task.date === date).length;
    const eventCount = events.filter((event) => event.date === date).length;
    return { date, label: weekdayLabels[toDate(date).getDay()], completed, due, events: eventCount, total: completed + eventCount };
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthLength = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthDays = rangeDays(monthStart, monthLength);
  const monthlyTrend = chunk(monthDays, 7).map((days, index) => ({
    label: `${index + 1}주`,
    completed: days.reduce((sum, date) => sum + tasks.filter((task) => task.completedAt?.slice(0, 10) === date).length, 0),
    events: days.reduce((sum, date) => sum + events.filter((event) => event.date === date).length, 0),
  })).map((item) => ({ ...item, total: item.completed + item.events }));

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
    ? "첫 작업을 추가하면 생산성 흐름을 기록할 수 있습니다."
    : completionRate >= 80
      ? "완료율이 좋습니다. 지금처럼 현실적인 범위로 계획을 유지하세요."
      : overdueTasks > 0
        ? "기한이 지난 작업이 있습니다. 완료하거나 일정을 다시 조정해 보세요."
        : `${bestDay?.label ?? "이번 주"}의 완료 흐름이 가장 좋습니다.`;

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
