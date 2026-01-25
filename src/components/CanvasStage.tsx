import { Stage, Layer, Line, Rect, Ellipse } from "react-konva";
import type { PresentState } from "../domain/present";
import type { Action } from "../domain/action";

type Props = {
  present: PresentState;
  dispatch: React.Dispatch<Action>;
};

// Konva Stage 렌더링 및 이벤트 처리 컴포넌트
export default function CanvasStage({ present, dispatch }: Props) {
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
      style={{ border: "1px solid #ddd", background: "#fff" }}
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

        dispatch({ type: "POINTER_MOVE", x: pos.x, y: pos.y });
      }}

      onPointerUp={(e) => {
        if (present.tool === "polygon") return;

        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        dispatch({ type: "POINTER_UP", x: pos.x, y: pos.y });
      }}
    >
      <Layer>
        {/* 확정된 도형 */}
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

          return null;
        })}

        {/* draft 프리뷰 */}
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
        
      </Layer>
    </Stage>
  );
}
