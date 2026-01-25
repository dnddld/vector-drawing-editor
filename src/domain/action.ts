import type { Tool } from "./tool";
import type { Shape } from "./shape";
import type { PresentState } from "./present";

// 상태 변경을 위한 액션 타입 정의
export type Action =
  | { type: "SET_TOOL"; tool: Tool }
  | { type: "SET_STROKE_COLOR"; color: string }
  | { type: "SET_STROKE_WIDTH"; width: number }

  | { type: "POINTER_DOWN"; x: number; y: number }
  | { type: "POINTER_MOVE"; x: number; y: number }
  | { type: "POINTER_UP"; x: number; y: number }
  
  | { type: "COMMIT_SHAPE"; shape: Shape }
  | { type: "UNDO" }
  | { type: "REDO" }
  | { type: "LOAD_PRESENT"; present: PresentState };
