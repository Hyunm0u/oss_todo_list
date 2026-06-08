const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5174;

app.use(cors());
app.use(express.json());

let cache = { date: null, message: null };

app.get('/', (req, res) => {
  res.send('StudyFlow AI server is running. Use GET /ai/motivation');
});

function todayISO() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || "";

function generateMessage(taskCount = 0) {
  const templates = [
    "작은 한 걸음이 큰 변화를 만듭니다 — 지금 25분 집중해보세요.",
    "지금 시작하면 오늘이 더 나은 하루가 됩니다. 한 가지 일만 끝내보세요.",
    "당신의 꾸준함이 성과를 만듭니다. 지금 한 작업을 완료해보세요.",
    "짧은 휴식 후 다시 시작하세요. 10분 산책이 도움이 될 수 있어요.",
    "우선순위 1개를 선택하고 30분 동안 전념하세요. 결과가 달라집니다.",
  ];

  if (taskCount >= 8) return `오늘 할 일이 ${taskCount}개 있으니, 가장 중요한 1개를 먼저 끝내고 작은 보상을 주세요.`;
  if (taskCount >= 4) return `할 일이 ${taskCount}개네요 — 짧게 나눠서 2개 먼저 해결해볼까요?`;
  return templates[Math.floor(Math.random() * templates.length)];
}

function summarizeCategoryCounts(tasks, events) {
  const counts = {};
  [...tasks, ...events].forEach((item) => {
    const category = item.category || "study";
    counts[category] = (counts[category] || 0) + 1;
  });
  return counts;
}

function generateInsightsFallback(tasks = [], events = []) {
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const overdueTasks = tasks.filter((task) => !task.completed && task.date && task.date < todayISO()).length;
  const totalEvents = events.length;
  const categoryCounts = summarizeCategoryCounts(tasks, events);
  const topCategory = Object.entries(categoryCounts).sort((a, b) => b[1] - a[1])[0] || ["study", 0];

  let recommendation = "오늘 할 목록이 빈약해 보여요. 작은 목표 하나를 추가해 보세요.";
  if (overdueTasks > 0) {
    recommendation = `기한이 지난 작업이 ${overdueTasks}개 있습니다. 먼저 그 중 하나를 완료하거나 오늘 다시 계획해 보세요.`;
  } else if (totalTasks >= 6) {
    recommendation = `현재 작업이 ${totalTasks}개 있으니, 이번 주에는 '${topCategory[0] === "study" ? "운동" : "공부"}' 관련 작은 작업을 하나 추가해 보세요.`;
  } else if (totalEvents < 2) {
    recommendation = "일정이 적어요. 이번 주에는 휴식이나 회고 시간을 일정으로 추가해 보세요.";
  }

  const motivation = overdueTasks > 0
    ? "지금 바로 한 가지 일을 끝내면 마음이 한결 가벼워질 거예요."
    : totalTasks === 0
      ? "첫 작업을 추가하는 것이 가장 큰 시작입니다. 작게 시작해 보세요."
      : "꾸준히 기록하는 모습이 이미 좋은 습관이에요. 오늘도 한 단계를 완성해 보세요.";

  const summary = `현재 전체 작업 ${totalTasks}개, 완료 ${completedTasks}개, 일정 ${totalEvents}개가 있습니다. 가장 많은 항목은 '${topCategory[0]}' 카테고리입니다.`;

  return {
    summary,
    recommendation,
    motivation,
  };
}

async function parseAIResponse(text) {
  try {
    return JSON.parse(text);
  } catch {
    const lines = text.split(/\r?\n/).filter(Boolean);
    const result = { summary: lines[0] || "", recommendation: "", motivation: "" };
    lines.slice(1).forEach((line) => {
      if (line.toLowerCase().includes("추천")) result.recommendation += `${line} `;
      else if (line.toLowerCase().includes("동기")) result.motivation += `${line} `;
      else if (!result.summary) result.summary = line;
    });
    return {
      summary: result.summary.trim(),
      recommendation: result.recommendation.trim() || "이번 주에는 중요한 일을 하나 추가해 보세요.",
      motivation: result.motivation.trim() || "한 걸음씩 천천히 나아가면 좋습니다.",
    };
  }
}

async function fetchOpenAIInsights(tasks = [], events = []) {
  if (!OPENAI_API_KEY) {
    return generateInsightsFallback(tasks, events);
  }

  const prompt = `당신은 한국어로 공부와 일정 관리를 돕는 AI입니다. 아래 JSON 형식으로 된 사용자 데이터를 읽고, 세 부분을 포함하는 JSON 응답만 반환하세요. 1) summary: 현재 할 일과 일정의 요약 분석, 2) recommendation: 이번 주에 추가하면 좋을 작업 제안, 3) motivation: 짧은 동기부여 문장. JSON 키는 summary, recommendation, motivation으로만 작성하세요.\n\n사용자 데이터:\n${JSON.stringify({ tasks, events }, null, 2)}`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${OPENAI_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "당신은 사용자 작업/일정 데이터를 분석하여 한국어로 통찰과 추천을 제공하는 전문 어시스턴트입니다." },
        { role: "user", content: prompt },
      ],
      max_tokens: 220,
      temperature: 0.85,
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("OpenAI API error:", response.status, errorBody);
    return generateInsightsFallback(tasks, events);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content || data?.choices?.[0]?.text;
  if (!content) return generateInsightsFallback(tasks, events);

  const parsed = await parseAIResponse(content);
  return parsed;
}

app.post('/ai/insights', async (req, res) => {
  try {
    const tasks = Array.isArray(req.body.tasks) ? req.body.tasks : [];
    const events = Array.isArray(req.body.events) ? req.body.events : [];

    const insights = await fetchOpenAIInsights(tasks, events);
    return res.json({ ...insights, usingOpenAI: Boolean(OPENAI_API_KEY) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류' });
  }
});

app.get('/ai/motivation', async (req, res) => {
  try {
    const force = req.query.force === '1' || req.query.force === 'true';
    const taskCount = Number(req.query.taskCount || 0);
    const today = todayISO();

    if (!force && cache.date === today && cache.message) {
      return res.json({ message: cache.message, cached: true, usingOpenAI: Boolean(OPENAI_API_KEY) });
    }

    const message = await fetchOpenAIMessage(taskCount);
    cache.date = today;
    cache.message = message;

    return res.json({ message, cached: false, usingOpenAI: Boolean(OPENAI_API_KEY) });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: '서버 오류' });
  }
});

app.listen(PORT, () => {
  console.log(`AI mock server listening on http://localhost:${PORT}`);
});
