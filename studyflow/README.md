# StudyFlow

학습 일정 관리(투두) 앱. React + Vite + Tailwind 기반의 단일 페이지 앱이며,
디자인 원본(Stitch HTML)은 참고용으로 `design/` 폴더에 분리 보관합니다.

> 코드(`src/`)와 디자인 원본(`design/`)은 **서로 병합되어 있지 않습니다.**
> `src/`의 화면은 깔끔한 컴포넌트 구조로 작성된 버전이고, `design/`은 Stitch가
> 출력한 고해상도 목업/프로토타입입니다.

## 실행

```bash
npm install
npm run dev      # 개발 서버
npm run build    # 프로덕션 빌드 (dist/)
npm run preview  # 빌드 결과 미리보기
```

## 폴더 구조

```
studyflow/
├─ index.html              # Vite 진입 HTML (#root)
├─ package.json
├─ vite.config.js
├─ tailwind.config.js      # 디자인 토큰(색상/타이포/간격) 정의
├─ postcss.config.js
├─ src/
│  ├─ main.jsx             # 앱 부트스트랩 + 라우터
│  ├─ App.jsx              # 라우트 정의
│  ├─ styles.css           # Tailwind + 전역 스타일/키프레임
│  ├─ components/          # 공통 컴포넌트
│  │  ├─ AppHeader.jsx     #   상단 헤더 (+ TextHeader)
│  │  ├─ BottomNav.jsx     #   하단 탭 네비게이션
│  │  ├─ Fab.jsx           #   플로팅 추가 버튼
│  │  ├─ Icon.jsx          #   Material Symbols 아이콘 래퍼
│  │  ├─ PageShell.jsx     #   페이지 공통 래퍼(nav/fab 토글)
│  │  └─ SurfaceCard.jsx   #   카드 컨테이너
│  ├─ data/
│  │  └─ navigation.js     # 네비게이션 항목 정의
│  └─ pages/               # 화면(라우트 단위)
│     ├─ Dashboard.jsx
│     ├─ Calendar.jsx
│     ├─ Stats.jsx
│     ├─ Settings.jsx
│     ├─ AddSchedule.jsx
│     ├─ CategoryNotifications.jsx
│     ├─ TimeNotifications.jsx
│     └─ DoNotDisturb.jsx
└─ design/                 # 참고용 (빌드에 포함되지 않음)
   ├─ stitch/              # Stitch 원본 8개 화면 (HTML)
   └─ prototype/
      └─ StudyFlow.html    # 8개 화면을 iframe으로 묶은 단일 파일 프로토타입
```

## 라우트 ↔ 페이지 ↔ Stitch 원본 매핑

| 라우트 | 페이지 컴포넌트 | Stitch 원본 |
|---|---|---|
| `/` | `pages/Dashboard.jsx` | `design/stitch/홈_대시보드.html` |
| `/calendar` | `pages/Calendar.jsx` | `design/stitch/인터렉티브_캘린더.html` |
| `/stats` | `pages/Stats.jsx` | `design/stitch/학습통계.html` |
| `/settings` | `pages/Settings.jsx` | `design/stitch/앱_설정.html` |
| `/add` | `pages/AddSchedule.jsx` | `design/stitch/일정추가.html` |
| `/notifications/category` | `pages/CategoryNotifications.jsx` | `design/stitch/카테고리_알림.html` |
| `/notifications/time` | `pages/TimeNotifications.jsx` | `design/stitch/시간대_알림.html` |
| `/notifications/dnd` | `pages/DoNotDisturb.jsx` | `design/stitch/방해금지_시간.html` |
