import { Stage, Layer, Rect, Text } from "react-konva";

function App() {
  return (
    <div style={{ padding: 16 }}>
      <h1 style={{ margin: 0, marginBottom: 12 }}>Neurocle Drawing Tool (Scaffold)</h1>

      <Stage
        width={900}
        height={600}
        style={{
          border: "1px solid #ddd",
          background: "#fff",
        }}
      >
        <Layer>
          <Text text="테스트" x={12} y={12} fontSize={18} />
          <Rect x={12} y={50} width={200} height={120} stroke="black" strokeWidth={2} />
        </Layer>
      </Stage>
    </div>
  );
}

export default App;
