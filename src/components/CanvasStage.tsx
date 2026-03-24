import { Stage, Layer, Line, Rect, Ellipse, Circle } from "react-konva";
import React, { useState } from "react";
import type { PresentState } from "../domain/present";
import type { Action } from "../domain/action";

type Props = {
  present: PresentState;
  dispatch: React.Dispatch<Action>;
};

// Konva Stage 렌더링 및 이벤트 처리 컴포넌트
export default function CanvasStage({ present, dispatch }: Props) {
  const [cursorPos, setCursorPos] = useState<{ x: number; y: number } | null>(null);

  function normalizeRect(x: number, y: number, width: number, height: number) {
  const nx = width < 0 ? x + width : x;
  const ny = height < 0 ? y + height : y;
  const nw = Math.abs(width);
  const nh = Math.abs(height);
  return { x: nx, y: ny, width: nw, height: nh };
  }

  const POLYGON_CLOSE_THRESHOLD = 12;

  // 다각형 그리기 시 시작점 근처 클릭 여부 판별
  function isNearFirstPoint(points: number[], x: number, y: number): boolean {
    if (points.length < 2) return false;

    const x0 = points[0];
    const y0 = points[1];

    const dx = x - x0;
    const dy = y - y0;

    return Math.sqrt(dx * dx + dy * dy) <= POLYGON_CLOSE_THRESHOLD;
  }

  return (
    <Stage
      width={1700}
      height={700}
      style={{
        border: "1px solid #ddd",
        background: "#fff",
        cursor: present.tool === "eraser"
          ? 'url(\'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="black" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21"/><path d="M22 21H7"/><path d="m5 11 9 9"/></svg>\') 0 24, auto'
          : "crosshair",
      }}
      onPointerDown={(e) => {
        const stage = e.target.getStage();
        const pos = stage?.getPointerPosition();
        if (!pos) return;

        if (present.tool === "polygon") {
          if (present.draft.kind === "polygon" && isNearFirstPoint(present.draft.points, pos.x, pos.y)) {
            dispatch({ type: "POLYGON_CLOSE" });
            return;
          }

          dispatch({ type: "POLYGON_ADD_POINT", x: pos.x, y: pos.y });
          return;
        }

        dispatch({ type: "POINTER_DOWN", x: pos.x, y: pos.y });
      }}
      onPointerMove={(e) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        if (present.tool === "polygon") {
          dispatch({ type: "POLYGON_MOVE", x: pos.x, y: pos.y });
          return;
        }

        setCursorPos({ x: pos.x, y: pos.y });
        dispatch({ type: "POINTER_MOVE", x: pos.x, y: pos.y });
      }}

      onPointerLeave={() => {
        setCursorPos(null);
      }}

      onPointerUp={(e) => {
        if (present.tool === "polygon") return;

        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        dispatch({ type: "POINTER_UP", x: pos.x, y: pos.y });
      }}

    >
      <Layer>
        {/* 확정된 도형 목록 렌더링 */}
        {present.shapes.map((shape) => {
          if (shape.type === "free") {
            return (
              <Line
                key={shape.id}
                points={shape.points}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            );
          }

          if (shape.type === "line") {
            return (
              <Line
                key={shape.id}
                points={[shape.x1, shape.y1, shape.x2, shape.y2]}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                lineCap="round"
                lineJoin="round"
              />
            );
          }

          if (shape.type === "rect") {
            const r = normalizeRect(shape.x, shape.y, shape.width, shape.height);
            return (
              <Rect
                key={shape.id}
                x={r.x}
                y={r.y}
                width={r.width}
                height={r.height}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
              />
            );
          }

          if (shape.type === "ellipse") {
            return (
              <Ellipse
                key={shape.id}
                x={shape.x}
                y={shape.y}
                radiusX={shape.radiusX}
                radiusY={shape.radiusY}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
              />
            );
          }

          if (shape.type === "polygon") {
            return (
              <Line
                key={shape.id}
                points={[...shape.points, shape.points[0], shape.points[1]]}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                closed
                lineJoin="round"
              />
            );
          }         

          if (shape.type === "eraser") {
            return (
              <Line
                key={shape.id}
                points={shape.points}
                stroke={shape.stroke}
                strokeWidth={shape.strokeWidth}
                lineCap="round"
                lineJoin="round"
                globalCompositeOperation="destination-out"
              />
            );
          }
          
        })}

        {/* 임시 드로잉 상태 (Draft) 렌더링 */}
        {present.draft.kind === "free" && (
          <Line
            points={present.draft.points}
            stroke={present.strokeColor}
            strokeWidth={present.strokeWidth}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {present.draft.kind === "line" && (
          <Line
            points={[present.draft.x1, present.draft.y1, present.draft.x2, present.draft.y2]}
            stroke={present.strokeColor}
            strokeWidth={present.strokeWidth}
            lineCap="round"
            lineJoin="round"
          />
        )}

        {present.draft.kind === "rect" && (() => {
          const r = normalizeRect(present.draft.x, present.draft.y, present.draft.width, present.draft.height);
          return (
            <Rect
              x={r.x}
              y={r.y}
              width={r.width}
              height={r.height}
              stroke={present.strokeColor}
              strokeWidth={present.strokeWidth}
            />
          );
        })()}

        {present.draft.kind === "ellipse" && (
          <Ellipse
            x={present.draft.x}
            y={present.draft.y}
            radiusX={present.draft.radiusX}
            radiusY={present.draft.radiusY}
            stroke={present.strokeColor}
            strokeWidth={present.strokeWidth}
          />
        )}

        {present.draft.kind === "polygon" && (
          <Line
            points={
              present.polygonCursor
                ? [...present.draft.points, present.polygonCursor.x, present.polygonCursor.y]
                : present.draft.points
            }
            stroke={present.strokeColor}
            strokeWidth={present.strokeWidth}
            lineJoin="round"
          />
        )}

        {present.draft.kind === "eraser" && (
          <Line
            points={present.draft.points}
            stroke={present.strokeColor}
            strokeWidth={present.strokeWidth}
            lineCap="round"
            lineJoin="round"
            globalCompositeOperation="destination-out"
          />
        )}

        {/* 지우개 도구 사용 시 현재 굵기를 나타내는 커서 (실제 렌더링엔 포함되지 않고 UI로만 보임) */}
        {present.tool === "eraser" && cursorPos && (
          <Circle
            x={cursorPos.x}
            y={cursorPos.y}
            radius={present.strokeWidth / 2}
            stroke="#666"
            strokeWidth={1}
            fill="rgba(200, 200, 200, 0.5)"
            listening={false}
          />
        )}

      </Layer>
    </Stage>
  );
}
