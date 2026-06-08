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

function getCountedTasks(tasks, today) {
  return tasks.filter((task) => task.completed || !task.date || task.date >= today);
}

function getCountedEvents(events, today) {
  return events.filter((event) => !event.date || event.date >= today);
}

export function calculateStats(tasks, events) {
  const now = new Date();
  const today = isoDate(now);
  const countedTasks = getCountedTasks(tasks, today);
  const countedEvents = getCountedEvents(events, today);
  const totalTasks = countedTasks.length;
  const completedTasks = countedTasks.filter((task) => task.completed).length;
  const completionRate = totalTasks ? Math.round((completedTasks / totalTasks) * 100) : 0;
  const overdueTasks = tasks.filter((task) => !task.completed && task.date && task.date < today).length;

  const weekStart = startOfWeek(now);
  const weekDays = rangeDays(weekStart, 7);
  const weekdayLabels = ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"];
  const weeklyTrend = weekDays.map((date) => {
    const completed = countedTasks.filter((task) => task.completedAt?.slice(0, 10) === date).length;
    const due = countedTasks.filter((task) => task.date === date).length;
    const eventCount = countedEvents.filter((event) => event.date === date).length;
    return { date, label: weekdayLabels[toDate(date).getDay()], completed, due, events: eventCount, total: completed + due + eventCount };
  });

  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
  const monthLength = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
  const monthDays = rangeDays(monthStart, monthLength);
  const monthlyTrend = chunk(monthDays, 7).map((days, index) => {
    const completed = days.reduce((sum, date) => sum + countedTasks.filter((task) => task.completedAt?.slice(0, 10) === date).length, 0);
    const due = days.reduce((sum, date) => sum + countedTasks.filter((task) => task.date === date).length, 0);
    const eventCount = days.reduce((sum, date) => sum + countedEvents.filter((event) => event.date === date).length, 0);
    return { label: `${index + 1}주`, completed, due, events: eventCount, total: completed + due + eventCount };
  });

  const categoryDistribution = CATEGORIES.map((category) => {
    const count = countedTasks.filter((task) => task.category === category.id).length + countedEvents.filter((event) => event.category === category.id).length;
    return { ...category, count, percent: countedTasks.length + countedEvents.length ? Math.round((count / (countedTasks.length + countedEvents.length)) * 100) : 0 };
  }).filter((category) => category.count > 0);

  const completedDates = new Set(countedTasks.filter((task) => task.completedAt).map((task) => task.completedAt.slice(0, 10)));
  let currentStreak = 0;
  for (let index = 0; index < 365; index += 1) {
    const date = new Date(now);
    date.setDate(date.getDate() - index);
    if (!completedDates.has(isoDate(date))) break;
    currentStreak += 1;
  }

  const mostPostponedTask = [...countedTasks].sort((a, b) => Number(b.postponedCount || 0) - Number(a.postponedCount || 0))[0] ?? null;
  const upcomingEvents = countedEvents.sort((a, b) => `${a.date} ${a.startTime}`.localeCompare(`${b.date} ${b.startTime}`)).slice(0, 3);
  const bestDay = [...weeklyTrend].sort((a, b) => b.completed - a.completed)[0];
  const insight = totalTasks === 0
    ? "오늘 이후의 작업을 추가하면 생산성 흐름을 기록할 수 있습니다."
    : completionRate >= 80
      ? "완료율이 좋습니다. 지금처럼 현실적인 범위로 계획을 유지하세요."
      : overdueTasks > 0
        ? "지난 미완료 작업은 통계에서 제외했습니다. 오늘 이후 작업에 집중하세요."
        : `${bestDay?.label ?? "이번 주"}의 완료 흐름이 가장 좋습니다.`;

  return {
    totalTasks,
    completedTasks,
    completionRate,
    overdueTasks,
    totalEvents: countedEvents.length,
    weeklyTrend,
    monthlyTrend,
    categoryDistribution,
    currentStreak,
    mostPostponedTask,
    upcomingEvents,
    insight,
  };
}
