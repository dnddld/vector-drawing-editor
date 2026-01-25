# Neurocle Vector Drawing Tool (React + TypeScript + Konva)

React + TypeScript + Konva로 구현한 **벡터(SVG) 방식 드로잉 툴**입니다.  
이 프로젝트는 Konva 사용법 자체보다, **도형 상태를 순수 데이터(JSON)로 모델링하고 사용자 인터랙션을 상태 전이로 설계**하는 데 초점을 두었습니다.

- Konva는 **View(렌더링 도구)** 로만 사용합니다.
- 도형 상태는 **직렬화 가능한 JSON 데이터**로만 관리합니다.
- Undo/Redo는 **past/present/future** 구조로 구현합니다.

---

## Tech Stack
- React 18
- TypeScript
- Vite
- Konva / react-konva

---

## Run

```bash
npm install
npm run dev
