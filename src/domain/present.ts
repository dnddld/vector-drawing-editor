import type { Shape } from "./shape";
import type { Tool } from "./tool";

// 드로잉 중인 임시 도형 상태
export type Draft =
  | { kind: "none" }
  | { kind: "free"; points: number[] }
  | { kind: "line"; x1: number; y1: number; x2: number; y2: number }
  | { kind: "rect"; x: number; y: number; width: number; height: number }
  | { kind: "ellipse"; x: number; y: number; radiusX: number; radiusY: number }
  | { kind: "polygon"; points: number[] };

// 현재 화면에 표시되는 전체 상태
export type PresentState = {
  shapes: Shape[];
  tool: Tool;
  strokeColor: string;
  strokeWidth: number;
  draft: Draft;
};
