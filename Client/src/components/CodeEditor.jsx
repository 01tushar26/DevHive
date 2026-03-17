import Editor from "@monaco-editor/react";

function CodeEditor({ code, setCode }) {

const handleChange = (value) => {
    setCode(value);
};

return (
    <Editor
      height="90vh"
      theme="vs-dark"
      language="javascript"
      value={code}
      onChange={handleChange}
    />
  );
}

export default CodeEditor;
