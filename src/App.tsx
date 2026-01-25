import { useReducer } from "react";
import CanvasStage from "./components/CanvasStage";
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
      />

      <CanvasStage present={present} dispatch={dispatch} />

    </div>
  );
}

export default App;
