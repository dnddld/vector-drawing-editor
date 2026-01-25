import type { HistoryState } from "../domain/history";
import type { PresentState } from "../domain/present";
import type { Action } from "../domain/action";
import { commitPresent, redo, undo } from "./historyHelpers";

export function createInitialPresent(): PresentState {
  return {
    shapes: [],
    tool: "free",
    strokeColor: "#111111",
    strokeWidth: 5,
    draft: { kind: "none" },
  };
}

export function createInitialHistory(): HistoryState {
  return {
    past: [],
    present: createInitialPresent(),
    future: [],
  };
}

// 상태 변경을 처리하는 리듀서 함수
export function drawingReducer(state: HistoryState, action: Action): HistoryState {
  switch (action.type) {
    case "SET_TOOL": {
      return {
        ...state,
        present: {
          ...state.present,
          tool: action.tool,
          draft: { kind: "none" },
        },
      };
    }

    case "SET_STROKE_COLOR": {
      return {
        ...state,
        present: {
          ...state.present,
          strokeColor: action.color,
        },
      };
    }

    case "SET_STROKE_WIDTH": {
      return {
        ...state,
        present: {
          ...state.present,
          strokeWidth: action.width,
        },
      };
    }

    case "COMMIT_SHAPE": {
      const nextPresent: PresentState = {
        ...state.present,
        shapes: [...state.present.shapes, action.shape],
        draft: { kind: "none" },
      };
      return commitPresent(state, nextPresent);
    }

    case "UNDO":
      return undo(state);

    case "REDO":
      return redo(state);

    case "LOAD_PRESENT":
      return {
        past: [],
        present: action.present,
        future: [],
      };

    default:
      return state;
  }
}
