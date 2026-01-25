export type ShapeType = "free" | "line" | "rect" | "ellipse" | "polygon";

// 모든 도형이 공통으로 가지는 속성
export type ShapeBase = {
  id: string;
  type: ShapeType;
  stroke: string;
  strokeWidth: number;
  createdAt: number;
};

export type FreeShape = ShapeBase & {
  type: "free";
  points: number[];
};

// 자유 곡선
export type LineShape = ShapeBase & {
  type: "line";
  x1: number;
  y1: number;
  x2: number;
  y2: number;
};

// 사각형
export type RectShape = ShapeBase & {
  type: "rect";
  x: number;
  y: number;
  width: number;
  height: number;
};

// 타원
export type EllipseShape = ShapeBase & {
  type: "ellipse";
  x: number;
  y: number;
  radiusX: number;
  radiusY: number;
};

// 다각형
export type PolygonShape = ShapeBase & {
  type: "polygon";
  points: number[];
};

export type Shape = FreeShape | LineShape | RectShape | EllipseShape | PolygonShape;
