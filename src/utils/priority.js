import { getTodayISO } from "../context/AppContext.jsx";

function minutesUntil(date, time) {
  if (!date) return Number.POSITIVE_INFINITY;
  const due = new Date(`${date}T${time || "23:59"}:00`);
  return Math.round((due.getTime() - Date.now()) / 60000);
}

function describeMinutes(minutes, type) {
  if (minutes < 0) return type === "event" ? "이미 시작" : "마감 지남";
  if (minutes < 60) return `${minutes}분 후 ${type === "event" ? "시작" : "마감"}`;
  if (minutes < 1440) return `${Math.round(minutes / 60)}시간 후 ${type === "event" ? "시작" : "마감"}`;
  return type === "event" ? "예정 일정" : "예정 작업";
}

export function getPriorityTop3(tasks, events) {
  const today = getTodayISO();
  const taskItems = tasks
    .filter((task) => !task.completed)
    .map((task) => {
      const minutes = minutesUntil(task.date, task.time);
      const todayBoost = task.date === today ? -300 : 0;
      return {
        id: task.id,
        title: task.title,
        type: "task",
        reason: task.date === today && !task.time ? "오늘 마감" : describeMinutes(minutes, "task"),
        score: minutes + todayBoost,
      };
    });

  const eventItems = events.map((event) => {
    const minutes = minutesUntil(event.date, event.startTime);
    const todayBoost = event.date === today ? -250 : 0;
    return {
      id: event.id,
      title: event.title,
      type: "event",
      reason: event.date === today && !event.startTime ? "오늘 일정" : describeMinutes(minutes, "event"),
      score: minutes + todayBoost,
    };
  });

  return [...taskItems, ...eventItems]
    .filter((item) => Number.isFinite(item.score))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);
}

export function getFallbackInsights(tasks, events) {
  const priorities = getPriorityTop3(tasks, events);
  return {
    summary: priorities.length ? "마감 시간, 일정 시작 시간, 오늘 여부, 완료 상태를 기준으로 우선순위를 계산했습니다." : "분석할 작업이나 일정이 아직 없습니다.",
    recommendation: priorities.length ? priorities.map((item, index) => `${index + 1}. ${item.title} (${item.reason})`).join("\n") : "작업 또는 일정을 추가하면 우선순위 TOP3가 표시됩니다.",
    motivation: priorities.length ? "가장 가까운 항목부터 하나씩 처리하세요." : "오늘의 첫 항목을 추가해 흐름을 시작하세요.",
    priorities,
    fallback: true,
  };
}
