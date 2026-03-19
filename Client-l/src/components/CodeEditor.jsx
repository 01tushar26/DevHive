import React from 'react'
import { Editor } from '@monaco-editor/react'

const CodeEditor = ({ code, setCode, language }) => {
  return (
    <div className="flex-1">
      <Editor
        height="100%"
        language={language}
        value={code}
        onChange={(value) => setCode(value)}
        theme="vs-dark"
        options={{
          fontSize: 14,
          minimap: { enabled: false },
          automaticLayout: true,
          wordWrap: "on",
        }}
      />
    </div>
  )
}

export default CodeEditor