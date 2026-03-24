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
    polygonCursor: null,
  };
}

export function createInitialHistory(): HistoryState {
  return {
    past: [],
    present: createInitialPresent(),
    future: [],
  };
}

// 초기 로드 시 로컬 스토리지 데이터로 히스토리 초기화
export function createInitialHistoryFromPresent(restoredPresent: PresentState | null): HistoryState {
  if (!restoredPresent) return createInitialHistory();

  return {
    past: [],
    present: {
      ...restoredPresent,
      draft: { kind: "none" },
      polygonCursor: null,
    },
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
          polygonCursor: null,
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
        present: {
          ...action.present,
          draft: { kind: "none" },
          polygonCursor: null,
        },
        future: [],
      };

    case "CLEAR_ALL": {
      const nextPresent: PresentState = {
        ...state.present,
        shapes: [],
        draft: { kind: "none" },
        polygonCursor: null,
      };
      return commitPresent(state, nextPresent);
    }

    case "POINTER_DOWN": {
      if (state.present.tool === "free") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "free",
              points: [action.x, action.y],
            },
          },
        };
      }

      if (state.present.tool === "eraser") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "eraser",
              points: [action.x, action.y],
            },
          },
        };
      }

      if (state.present.tool === "line") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "line",
              x1: action.x,
              y1: action.y,
              x2: action.x,
              y2: action.y,
            },
          },
        };
      }

      if (state.present.tool === "rect") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "rect",
              x: action.x,
              y: action.y,
              width: 0,
              height: 0,
            },
          },
        };
      }

      if (state.present.tool === "ellipse") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "ellipse",
              startX: action.x,
              startY: action.y,
              x: action.x,
              y: action.y,
              radiusX: 0,
              radiusY: 0,
            },
          },
        };
      }

      return state;
    }

    case "POINTER_MOVE": {
      if (state.present.draft.kind === "free") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "free",
              points: [...state.present.draft.points, action.x, action.y],
            },
          },
        };
      }

      if (state.present.draft.kind === "eraser") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "eraser",
              points: [...state.present.draft.points, action.x, action.y],
            },
          },
        };
      }

      if (state.present.draft.kind === "line") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              ...state.present.draft,
              x2: action.x,
              y2: action.y,
            },
          },
        };
      }

      if (state.present.draft.kind === "rect") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              ...state.present.draft,
              width: action.x - state.present.draft.x,
              height: action.y - state.present.draft.y,
            },
          },
        };
      }

      if (state.present.draft.kind === "ellipse") {
        const startX = state.present.draft.startX;
        const startY = state.present.draft.startY;

        const centerX = (startX + action.x) / 2;
        const centerY = (startY + action.y) / 2;

        const radiusX = Math.abs(action.x - startX) / 2;
        const radiusY = Math.abs(action.y - startY) / 2;

        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              ...state.present.draft,
              x: centerX,
              y: centerY,
              radiusX,
              radiusY,
            },
          },
        };
      }
      
      return state;
    }

    case "POINTER_UP": {
      // 드로잉 종료 시 도형 확정 및 커밋
      if (state.present.draft.kind === "free") {
        const now = Date.now();
        const nextPresent: PresentState = {
          ...state.present,
          shapes: [
            ...state.present.shapes,
            {
              id: String(now),
              type: "free",
              points: state.present.draft.points,
              stroke: state.present.strokeColor,
              strokeWidth: state.present.strokeWidth,
              createdAt: now,
            },
          ],
          draft: { kind: "none" },
        };

        return commitPresent(state, nextPresent);
      }

      if (state.present.draft.kind === "eraser") {
        const now = Date.now();
        const nextPresent: PresentState = {
          ...state.present,
          shapes: [
            ...state.present.shapes,
            {
              id: String(now),
              type: "eraser",
              points: state.present.draft.points,
              stroke: state.present.strokeColor,
              strokeWidth: state.present.strokeWidth,
              createdAt: now,
            },
          ],
          draft: { kind: "none" },
        };

        return commitPresent(state, nextPresent);
      }

      if (state.present.draft.kind === "line") {
        const now = Date.now();
        const nextPresent: PresentState = {
          ...state.present,
          shapes: [
            ...state.present.shapes,
            {
              id: String(now),
              type: "line",
              x1: state.present.draft.x1,
              y1: state.present.draft.y1,
              x2: state.present.draft.x2,
              y2: state.present.draft.y2,
              stroke: state.present.strokeColor,
              strokeWidth: state.present.strokeWidth,
              createdAt: now,
            },
          ],
          draft: { kind: "none" },
        };

        return commitPresent(state, nextPresent);
      }

      if (state.present.draft.kind === "rect") {
        const now = Date.now();
        const nextPresent: PresentState = {
          ...state.present,
          shapes: [
            ...state.present.shapes,
            {
              id: String(now),
              type: "rect",
              x: state.present.draft.x,
              y: state.present.draft.y,
              width: state.present.draft.width,
              height: state.present.draft.height,
              stroke: state.present.strokeColor,
              strokeWidth: state.present.strokeWidth,
              createdAt: now,
            },
          ],
          draft: { kind: "none" },
        };

        return commitPresent(state, nextPresent);
      }

      if (state.present.draft.kind === "ellipse") {
        const now = Date.now();

        const nextPresent: PresentState = {
          ...state.present,
          shapes: [
            ...state.present.shapes,
            {
              id: String(now),
              type: "ellipse",
              x: state.present.draft.x,
              y: state.present.draft.y,
              radiusX: state.present.draft.radiusX,
              radiusY: state.present.draft.radiusY,
              stroke: state.present.strokeColor,
              strokeWidth: state.present.strokeWidth,
              createdAt: now,
            },
          ],
          draft: { kind: "none" },
        };

        return commitPresent(state, nextPresent);
      }



      return state;
    }

    
    case "POLYGON_ADD_POINT": {
      if (state.present.tool !== "polygon") return state;

      if (state.present.draft.kind !== "polygon") {
        return {
          ...state,
          present: {
            ...state.present,
            draft: {
              kind: "polygon",
              points: [action.x, action.y],
            },
            polygonCursor: { x: action.x, y: action.y },
          },
        };
      }

      return {
        ...state,
        present: {
          ...state.present,
          draft: {
            kind: "polygon",
            points: [...state.present.draft.points, action.x, action.y],
          },
          polygonCursor: { x: action.x, y: action.y },
        },
      };
    }
    
    case "POLYGON_CLOSE": {
      if (state.present.tool !== "polygon") return state;
      if (state.present.draft.kind !== "polygon") return state;

      if (state.present.draft.points.length < 6) {
        return {
          ...state,
          present: {
            ...state.present,
            draft: { kind: "none" },
            polygonCursor: null,
          },
        };
      }

      const now = Date.now();
      const nextPresent: PresentState = {
        ...state.present,
        shapes: [
          ...state.present.shapes,
          {
            id: String(now),
            type: "polygon",
            points: state.present.draft.points,
            stroke: state.present.strokeColor,
            strokeWidth: state.present.strokeWidth,
            createdAt: now,
          },
        ],
        draft: { kind: "none" },
        polygonCursor: null,
      };

      return commitPresent(state, nextPresent);
    }

    case "POLYGON_MOVE": {
      if (state.present.tool !== "polygon") return state;
      if (state.present.draft.kind !== "polygon") return state;

      return {
        ...state,
        present: {
          ...state.present,
          polygonCursor: { x: action.x, y: action.y },
        },
      };
    }
    
    default:
      return state;
  }
}
