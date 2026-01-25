import { useReducer } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import { createInitialHistory, drawingReducer } from "./state/drawingReducer";

function App() {
  const [state, dispatch] = useReducer(drawingReducer, undefined, createInitialHistory);

  const { present, past, future } = state;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Neurocle Drawing Tool</h1>

      <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <button onClick={() => dispatch({ type: "UNDO" })} disabled={past.length === 0}>
          Undo
        </button>
        <button onClick={() => dispatch({ type: "REDO" })} disabled={future.length === 0}>
          Redo
        </button>

        <div style={{ marginLeft: 12, fontSize: 12, color: "#555" }}>
          past: {past.length} / future: {future.length} / shapes: {present.shapes.length}
        </div>

        <button
          style={{ marginLeft: "auto" }}
          onClick={() => {
            const now = Date.now();
            dispatch({
              type: "COMMIT_SHAPE",
              shape: {
                id: String(now),
                type: "rect",
                stroke: present.strokeColor,
                strokeWidth: present.strokeWidth,
                createdAt: now,
                x: 20 + present.shapes.length * 10,
                y: 60 + present.shapes.length * 10,
                width: 120,
                height: 80,
              },
            });
          }}
        >
          (임시) 더미 도형 추가
        </button>
      </div>

      <Stage width={900} height={600} style={{ border: "1px solid #ddd", background: "#fff" }}>
        <Layer>
          <Text text="History/Reducer Ready" x={12} y={12} fontSize={18} />

          {/* 확정된 도형들 렌더(현재는 rect만 더미로 들어오지만, Shape 렌더러는 다음 단계에서 분기 처리한다) */}
          {present.shapes.map((s) => {
            if (s.type !== "rect") return null;
            return (
              <Rect
                key={s.id}
                x={s.x}
                y={s.y}
                width={s.width}
                height={s.height}
                stroke={s.stroke}
                strokeWidth={s.strokeWidth}
              />
            );
          })}
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
