function OutputPanel({ output }) {

  return (
    <div
      style={{
        background: "#0f172a",
        color: "white",
        height: "90vh",
        padding: "10px",
        overflow: "auto"
      }}
    >
      <h3>Output</h3>

      <pre>{output}</pre>
    </div>
  );
}

export default OutputPanel;