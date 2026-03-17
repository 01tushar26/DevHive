import { useState } from "react";
import Editor from "@monaco-editor/react";
import { FaPlay } from "react-icons/fa";

function EditorPage() {

  const [code, setCode] = useState(`function greet(name) {
  console.log("Hello " + name);
}

greet("DevHive");`);

  const [language, setLanguage] = useState("javascript");
  const [theme, setTheme] = useState("vs-dark");
  const [output, setOutput] = useState("");

  const runCode = () => {
    if (language !== "javascript") {
      setOutput("Execution only supported for JavaScript in browser.");
      return;
    }

    try {
      const logs = [];
      const consoleLog = console.log;

      console.log = (...args) => {
        logs.push(args.join(" "));
      };

      eval(code);

      console.log = consoleLog;

      setOutput(logs.join("\n"));
    } catch (err) {
      setOutput(err.message);
    }
  };

  return (
    <div style={{ height: "100vh", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <div
        style={{
          background: "#1e1e1e",
          color: "white",
          padding: "10px 20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <h2>DevHive Editor</h2>

        <div style={{ display: "flex", gap: "10px" }}>

          {/* LANGUAGE */}
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
          >
            <option value="javascript">JavaScript</option>
            <option value="java">Java</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
          </select>

          {/* THEME */}
          <select
            value={theme}
            onChange={(e) => setTheme(e.target.value)}
          >
            <option value="vs-dark">Dark</option>
            <option value="light">Light</option>
          </select>

          {/* RUN BUTTON */}
          <button
            onClick={runCode}
            style={{
              background: "#22c55e",
              border: "none",
              padding: "8px 15px",
              cursor: "pointer",
              color: "white",
              display: "flex",
              alignItems: "center",
              gap: "5px"
            }}
          >
            <FaPlay /> Run
          </button>

        </div>
      </div>

      {/* MAIN AREA */}
      <div style={{ flex: 1, display: "flex" }}>

        {/* EDITOR */}
        <div style={{ flex: 2 }}>
          <Editor
            height="100%"
            language={language}
            theme={theme}
            value={code}
            onChange={(value) => setCode(value)}
          />
        </div>

        {/* OUTPUT PANEL */}
        <div
          style={{
            flex: 1,
            background: "#0f172a",
            color: "white",
            padding: "10px",
            overflow: "auto"
          }}
        >
          <h3>Console Output</h3>
          <pre>{output}</pre>
        </div>

      </div>

    </div>
  );
}

export default EditorPage;