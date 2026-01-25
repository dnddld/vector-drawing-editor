import type { PresentState } from "../domain/present";

const STORAGE_KEY = "neurocle_drawing_present_v1";

// 저장 전 상태 정규화 (Draft 및 커서 정보 제거)
function sanitizePresent(present: PresentState): PresentState {
  return {
    ...present,
    draft: { kind: "none" },
    polygonCursor: null,
  };
}

// 현재 상태를 로컬 스토리지에 저장
export function savePresentToStorage(present: PresentState): void {
  try {
    const safe = sanitizePresent(present);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
  } catch {
    return;
  }
}

// 로컬 스토리지에서 상태 불러오기
export function loadPresentFromStorage(): PresentState | null {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) return null;

  try {
    const parsed = JSON.parse(raw) as PresentState;
    return sanitizePresent(parsed);
  } catch {
    return null;
  }
}
