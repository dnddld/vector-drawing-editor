import { Stage, Layer, Line } from "react-konva";
import type { PresentState } from "../domain/present";
import type { Action } from "../domain/action";

type Props = {
  present: PresentState;
  dispatch: React.Dispatch<Action>;
};

// Konva Stage 렌더링 및 이벤트 처리 컴포넌트
export default function CanvasStage({ present, dispatch }: Props) {
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
          if (shape.type !== "free") return null;

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
      </Layer>
    </Stage>
  );
}
