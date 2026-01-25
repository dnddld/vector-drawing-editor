import { Stage, Layer, Line, Rect } from "react-konva";
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

  return (
    <Stage
      width={1700}
      height={700}
      style={{ border: "1px solid #ddd", background: "#fff" }}
      onPointerDown={(e) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        dispatch({ type: "POINTER_DOWN", x: pos.x, y: pos.y });
      }}
      onPointerMove={(e) => {
        const pos = e.target.getStage()?.getPointerPosition();
        if (!pos) return;

        dispatch({ type: "POINTER_MOVE", x: pos.x, y: pos.y });
      }}
      onPointerUp={(e) => {
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
        
      </Layer>
    </Stage>
  );
}
