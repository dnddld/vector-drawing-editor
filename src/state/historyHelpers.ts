import type { HistoryState } from "../domain/history";
import { HISTORY_LIMIT } from "../domain/history";
import type { PresentState } from "../domain/present";

// 히스토리에 저장하기 전, Draft 상태를 제거(정규화)하는 함수
function stripDraft(present: PresentState): PresentState {
  return {
    ...present,
    draft: { kind: "none" },
  };
}

// 새로운 상태를 히스토리에 확정(commit)하고, 미래(Redo) 스택을 초기화
export function commitPresent(history: HistoryState, nextPresent: PresentState): HistoryState {
  const nextPast = [...history.past, stripDraft(history.present)];
  const trimmedPast = nextPast.length > HISTORY_LIMIT ? nextPast.slice(nextPast.length - HISTORY_LIMIT) : nextPast;

  return {
    past: trimmedPast,
    present: stripDraft(nextPresent),
    future: [],
  };
}

// 실행 취소
export function undo(history: HistoryState): HistoryState {
  if (history.past.length === 0) return history;

  const previous = stripDraft(history.past[history.past.length - 1]);
  const newPast = history.past.slice(0, -1);
  const newFuture = [stripDraft(history.present), ...history.future];

  return {
    past: newPast,
    present: previous,
    future: newFuture,
  };
}

// 다시 실행
export function redo(history: HistoryState): HistoryState {
  if (history.future.length === 0) return history;

  const next = stripDraft(history.future[0]);
  const newFuture = history.future.slice(1);

  const nextPast = [...history.past, stripDraft(history.present)];
  const trimmedPast = nextPast.length > HISTORY_LIMIT ? nextPast.slice(nextPast.length - HISTORY_LIMIT) : nextPast;

  return {
    past: trimmedPast,
    present: next,
    future: newFuture,
  };
}
