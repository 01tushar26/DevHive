import React from 'react'
import { Editor } from '@monaco-editor/react'

const CodeEditor = ({ code, setCode, language ,theme }) => {
  return (
    <div className="w-full h-full bg-[#1e1e1e]">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme={theme}
        options={{
          fontSize: 15,
          fontFamily: "'JetBrains Mono', 'Fira Code', 'Cascadia Code', Consolas, monospace",
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
          padding: { top: 16, bottom: 16 },
          scrollBeyondLastLine: false,
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          formatOnPaste: true,
        }}
      />
    </div>
  )
}

export default CodeEditor