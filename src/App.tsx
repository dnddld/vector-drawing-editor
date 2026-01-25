import { useReducer } from "react";
import { Stage, Layer, Rect, Text } from "react-konva";
import Toolbar from "./components/Toolbar";
import { createInitialHistory, drawingReducer } from "./state/drawingReducer";

function App() {
  const [state, dispatch] = useReducer(drawingReducer, undefined, createInitialHistory);

  const { present, past, future } = state;

  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Neurocle Drawing Tool</h1>

      <Toolbar
        tool={present.tool}
        strokeColor={present.strokeColor}
        strokeWidth={present.strokeWidth}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onSelectTool={(tool) => dispatch({ type: "SET_TOOL", tool })}
        onChangeColor={(color) => dispatch({ type: "SET_STROKE_COLOR", color })}
        onChangeWidth={(width) => dispatch({ type: "SET_STROKE_WIDTH", width })}
        onUndo={() => dispatch({ type: "UNDO" })}
        onRedo={() => dispatch({ type: "REDO" })}
        onAddDummyShape={() => {
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
      />

      <Stage width={900} height={600} style={{ border: "1px solid #ddd", background: "#fff" }}>
        <Layer>
          <Text text="Toolbar Ready" x={12} y={12} fontSize={18} />

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
