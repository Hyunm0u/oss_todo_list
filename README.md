# StudyFlow

> **사용자의 학습 상황과 마감을 AI가 분석해, 우선순위와 동기부여를 실시간으로 바꿔주는 적응형(Adaptive) 학습 스케줄러**

StudyFlow는 단순히 할 일을 나열하는 To-Do 앱이 아니라, **지금 사용자가 처한 상황**(마감 임박, 일정 지연, 시험 일정 등)에 따라 화면과 추천이 능동적으로 변하는 적응형 학습 관리 앱입니다.

---

## 🎯 우리 팀의 Adaptiveness (적응형 컨셉)

> **"같은 To-Do 목록이라도, 사용자의 상황에 따라 다르게 보여준다."**

StudyFlow의 인터페이스는 고정되어 있지 않고, **상황과 사용자 상호작용에 따라 실시간으로 변합니다.**

| 적응 요소 | 무엇에 따라 변하나 | 어떻게 변하나 |
| --- | --- | --- |
| **우선순위 강조** | 마감 임박도(D-day) | 가장 시급한 할 일을 상단에 강조 카드로 노출 |
| **지연 추적** | 할 일의 지연 일수 | "2일째 지연 중"처럼 미뤄진 항목을 별도 영역에 표시 |
| **AI 스마트 제언** | 사용자의 일정·시험·할 일 데이터 | AI가 분석해 "지금 무엇을 먼저 해야 하는지" 추천 |
| **동기부여 메시지** | 진행 상황·시간대 | 상황에 맞는 동기부여 문구를 AI가 생성 |
| **맥락 알림** | 시간대 / 카테고리 / 방해금지 설정 | 사용자 상황에 맞춰 알림 동작을 조절 |

즉, **AI 서버가 사용자의 학습 상황을 분석 → 프런트엔드 UI가 그 결과에 따라 우선순위·추천·동기부여를 적응적으로 재구성**하는 것이 StudyFlow의 핵심 컨셉입니다.

---

## ✨ 주요 기능

- **홈 대시보드** — 가장 시급한 할 일, 오늘의 할 일, 미뤄진 할 일, AI 스마트 제언을 한 화면에서 적응적으로 표시
- **인터랙티브 캘린더** — 일정 기반으로 학습 계획을 시각화
- **일정 추가** — 카테고리·마감일 기반으로 할 일 등록
- **학습 통계** — 학습 현황 분석 (AI 기능 활성화 시 AI 분석 결과 표시)
- **AI 분석 기능** — 할 일/일정 목록을 분석해 요약·추천·동기부여 메시지 제공 (옵트인)
- **맥락 알림** — 시간대 알림, 카테고리 알림, 방해금지 시간 설정

---

## 🛠 기술 스택

- **Frontend**: React 18, Vite, React Router, Tailwind CSS
- **Backend (AI Server)**: Node.js, Express
- **AI**: OpenAI API 연동 (미설정 시 로컬 fallback 메시지로 동작)

---

## 📁 프로젝트 구조

```
oss_todo_list/
├─ src/            # React + Vite 프런트엔드 (메인 To-Do / 스케줄 앱)
├─ server/         # Express 기반 AI 서버 (분석·동기부여 메시지 제공)
├─ index.html
├─ package.json
├─ vite.config.js
├─ tailwind.config.js
└─ README.md
```

> Stitch로 내보낸 디자인 목업 HTML과 실제 React 소스는 의도적으로 분리해 관리합니다.

---

## 🚀 실행 방법

### 1) 프런트엔드 (To-Do 앱)

```bash
cd oss_todo_list
npm install        # 최초 1회
npm run dev
# 브라우저에서 http://localhost:5173 접속
```

### 2) AI 서버

```bash
cd oss_todo_list/server
npm install        # 최초 1회

# (선택) 실제 OpenAI API 사용 시 환경변수 설정
# Windows PowerShell:
$env:OPENAI_API_KEY="your_openai_api_key"
# macOS/Linux:
export OPENAI_API_KEY="your_openai_api_key"

npm start
# 상태 확인: http://localhost:5174
```

- `GET  /ai/motivation` : AI 동기부여 메시지 반환
- `POST /ai/insights`   : 할 일/일정 목록을 보내면 요약·추천·동기부여 반환

> **설정**에서 AI 기능을 켜야 **통계** 화면에 AI 분석 결과가 표시됩니다.

---

## 🤝 Git & 협업

- 로컬·원격(GitHub) 저장소를 함께 활용
- 기능별 브랜치 분리 후 Pull Request 기반 협업
- 의미 있는 커밋 메시지 작성 (`feat:`, `fix:`, `style:`, `docs:` 등)
- 최종 제출 버전은 Git tag로 표시 (`v1.0.0`)