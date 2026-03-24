# Neurocle Drawing Tool

React 19와 Konva(`react-konva`) 기반으로 구축된 강력한 웹용 벡터 드로잉 에디터입니다. 다양한 도형 그리기, 색상 및 두께 조절, 실행 취소/다시 실행(Undo/Redo), 로컬 스토리지 자동 저장 등의 기능을 제공합니다.

🔗 **라이브 데모:** [Neurocle Drawing Tool (Vercel)](https://woong-vector-drawing-editor.vercel.app/)

## ✨ 주요 기능

*   **다양한 드로잉 도구 지원**
    *   `자유(Free)`: 마우스를 드래그하여 자유롭게 선 그리기
    *   `직선(Line)`: 두 점을 연결하는 직선 그리기
    *   `사각형(Rect)`: 너비와 높이를 지정하여 사각형 그리기
    *   `타원(Ellipse)`: 중심점 기반 타원 그리기
    *   `다각형(Polygon)`: 여러 점을 연결하여 다각형 그리기 (시작점 클릭 시 닫힘)
    *   `지우개(Eraser)`: 브러시 형태로 캔버스 위 그려진 영역 지우기
*   **세밀한 스타일 제어**
    *   선 색상(Color) 및 두께(Width)를 자유롭게 변경할 수 있습니다.
*   **Undo / Redo 시스템**
    *   이전 작업 상태로 되돌리거나, 다시 복구할 수 있는 강력한 히스토리 관리(최대 40단계)를 지원합니다.
*   **자동 저장 기능 (Local Storage 연동)**
    *   새로고침을 하거나 브라우저를 닫았다 열어도 기존에 그렸던 내용이 안전하게 복원됩니다.

## 🛠 기술 스택

*   **Framework:** React 19, TypeScript
*   **Build Tool:** Vite
*   **Canvas Rendering:** Konva (`react-konva`)
*   **State Management:** React `useReducer`
*   **Deployment:** Vercel

## 📂 아키텍처 및 폴더 구조

프로젝트는 유지보수성과 확장성을 고려하여 **도메인 모델(Domain) - 상태 제어(State) - UI(Components)** 로 관심사를 분리하여 설계되었습니다.

```text
src/
├── components/          # UI 및 렌더링 컴포넌트
│   ├── CanvasStage.tsx  # Konva Stage, Layer 렌더링 및 마우스 이벤트 처리
│   └── Toolbar.tsx      # 도구 선택, 색상, 두께 조절 및 히스토리 버튼 UI
├── domain/              # 핵심 도메인 모델 정의 (TypeScript 타입)
│   ├── action.ts        # 상태 변경을 위한 Reducer Action 타입
│   ├── history.ts       # Undo/Redo 용 과거/현재/미래 상태 구조 정의
│   ├── present.ts       # 현재 화면에 표시되는 확정(shapes) 및 임시(draft) 상태
│   ├── shape.ts         # 각 도형별(Free, Rect, 등) 속성 인터페이스
│   └── tool.ts          # 사용 가능한 드로잉 도구 종류
├── state/               # 상태 관리 로직
│   ├── drawingReducer.ts # 애플리케이션의 핵심 비즈니스 로직 및 상태 업데이트
│   └── historyHelpers.ts # Undo/Redo 스택(past/future) 조작 유틸리티 함수
├── storage/             # 외부 저장소 연동
│   └── storage.ts       # 로컬 스토리지 저장 및 불러오기 (임시 draft 데이터 필터링 등)
├── App.tsx              # 최상위 컴포넌트 (Reducer 상태 구독, 스토리지 연동, 하위 컴포넌트 통합)
└── main.tsx             # React 앱 진입점
```

### 상태 관리 패턴 (Reducer)
사용자의 마우스 입력에 따라 다음과 같이 상태가 전환됩니다.
1. `POINTER_DOWN`: 현재 선택된 도구에 맞춰 임시 도형(`draft`) 생성 시작
2. `POINTER_MOVE`: 임시 도형(`draft`)의 속성(좌표, 크기 등)을 실시간으로 업데이트
3. `POINTER_UP`: 드로잉 완료 시 `draft`를 `shapes` 배열에 반영(Commit)하고, Undo 목록(`past` 스택)에 기록

## 🚀 로컬 실행 방법

1. 저장소를 클론합니다.
```bash
git clone https://github.com/dnddld/vector-drawing-editor.git
cd vector-drawing-editor
```

2. 의존성 패키지를 설치합니다.
```bash
npm install
```

3. 개발 서버를 실행합니다.
```bash
npm run dev
```

4. 브라우저에서 `http://localhost:5173/` 에 접속하여 확인합니다.
