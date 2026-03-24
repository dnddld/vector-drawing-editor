import { useEffect, useReducer } from "react";
import "./App.css";
import CanvasStage from "./components/CanvasStage";
import Toolbar from "./components/Toolbar";
import {
  createInitialHistoryFromPresent,
  drawingReducer,
} from "./state/drawingReducer";
import { loadPresentFromStorage, savePresentToStorage } from "./storage/storage";

// 메인 애플리케이션 컴포넌트
function App() {
  // Reducer를 사용하여 상태 관리 (초기화 시 로컬 스토리지 데이터 로드)
  const [state, dispatch] = useReducer(
    drawingReducer,
    undefined,
    () => createInitialHistoryFromPresent(loadPresentFromStorage())
  );

  const { present, past, future } = state;

  // 상태 변경 시 로컬 스토리지에 자동 저장
  useEffect(() => {
    savePresentToStorage(present);
  }, [present]);

  return (
    <>
      <header className="app-header">
        <h1 className="app-title">Neurocle Drawing Tool</h1>

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
          onClearAll={() => dispatch({ type: "CLEAR_ALL" })}
        />
      </header>

      <main className="canvas-container">
        <CanvasStage present={present} dispatch={dispatch} />
      </main>
    </>
  );
}

export default App;
