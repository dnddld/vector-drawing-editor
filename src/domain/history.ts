import type { PresentState } from "./present";

// Undo/Redo를 위한 히스토리 상태 구조
export type HistoryState = {
  past: PresentState[];
  present: PresentState;
  future: PresentState[];
};

export const HISTORY_LIMIT = 40;
