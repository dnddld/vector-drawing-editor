import type { PresentState } from "../domain/present";

const STORAGE_KEY = "neurocle_drawing_present_v1";

// 현재 상태를 로컬 스토리지에 저장
export function savePresentToStorage(present: PresentState): void {
  const safe: PresentState = { ...present, draft: { kind: "none" } };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
}

// 로컬 스토리지에서 상태 불러오기
export function loadPresentFromStorage(): PresentState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PresentState;
    return { ...parsed, draft: { kind: "none" } };
  } catch {
    return null;
  }
}
