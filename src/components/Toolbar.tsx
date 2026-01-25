import type { Tool } from "../domain/tool";

type Props = {
  tool: Tool;
  strokeColor: string;
  strokeWidth: number;

  canUndo: boolean;
  canRedo: boolean;

  onSelectTool: (tool: Tool) => void;
  onChangeColor: (color: string) => void;
  onChangeWidth: (width: number) => void;

  onUndo: () => void;
  onRedo: () => void;

  onAddDummyShape: () => void;
};

const TOOL_LABEL: Record<Tool, string> = {
  free: "자유",
  line: "직선",
  rect: "사각형",
  ellipse: "타원",
  polygon: "다각형",
};

const COLOR_PRESETS = ["#111111", "#E11D48", "#2563EB", "#16A34A", "#F59E0B", "#7C3AED"];

function clampWidth(value: number): number {
  if (Number.isNaN(value)) return 5;
  if (value < 5) return 5;
  if (value > 50) return 50;
  return value;
}

// 사용자 도구 선택 및 설정 UI 컴포넌트
export default function Toolbar(props: Props) {
  const {
    tool,
    strokeColor,
    strokeWidth,
    canUndo,
    canRedo,
    onSelectTool,
    onChangeColor,
    onChangeWidth,
    onUndo,
    onRedo,
    onAddDummyShape,
  } = props;

  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: 12,
        alignItems: "center",
        padding: 12,
        border: "1px solid #eee",
        borderRadius: 8,
        marginBottom: 12,
      }}
    >
      <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#555", width: 54 }}>Tool</div>
        {Object.keys(TOOL_LABEL).map((k) => {
          const t = k as Tool;
          const isActive = t === tool;
          return (
            <button
              key={t}
              onClick={() => onSelectTool(t)}
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid #ddd",
                background: isActive ? "#111" : "#fff",
                color: isActive ? "#fff" : "#111",
                cursor: "pointer",
              }}
            >
              {TOOL_LABEL[t]}
            </button>
          );
        })}
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#555", width: 54 }}>Color</div>

        <div
          title={`현재 색상: ${strokeColor}`}
          style={{
            width: 18,
            height: 18,
            borderRadius: 4,
            border: "1px solid #ccc",
            background: strokeColor,
          }}
        />

        {COLOR_PRESETS.map((c) => {
          const isActive = c.toLowerCase() === strokeColor.toLowerCase();
          return (
            <button
              key={c}
              onClick={() => onChangeColor(c)}
              title={c}
              style={{
                width: 22,
                height: 22,
                borderRadius: 999,
                border: isActive ? "2px solid #111" : "1px solid #ccc",
                background: c,
                cursor: "pointer",
              }}
            />
          );
        })}

        <input
          type="color"
          value={strokeColor}
          onChange={(e) => onChangeColor(e.target.value)}
          style={{ width: 36, height: 28, padding: 0, border: "none", background: "transparent" }}
          aria-label="색상 선택"
        />
      </div>

      <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
        <div style={{ fontSize: 12, color: "#555", width: 54 }}>Width</div>

        <input
          type="range"
          min={5}
          max={50}
          step={1}
          value={strokeWidth}
          onChange={(e) => onChangeWidth(clampWidth(Number(e.target.value)))}
        />

        <input
          type="number"
          min={5}
          max={50}
          value={strokeWidth}
          onChange={(e) => onChangeWidth(clampWidth(Number(e.target.value)))}
          style={{ width: 64 }}
        />
      </div>

      <div style={{ display: "flex", gap: 6, alignItems: "center", marginLeft: "auto" }}>
        <button onClick={onUndo} disabled={!canUndo}>
          실행 취소
        </button>
        <button onClick={onRedo} disabled={!canRedo}>
          Redo
        </button>

        <button onClick={onAddDummyShape} style={{ marginLeft: 8 }}>
          다시 실행
        </button>
      </div>
    </div>
  );
}
