import React, { useRef, useState } from 'react'
import EditorToolBar from '@/components/EditorToolBar';
import CodeEditor from '@/components/CodeEditor';
import Whiteboard from '@/components/Whiteboard';

const DefaultPage = () => {

     const [code, setCode] = useState("// Start coding...");
     const [language, setLanguage] = useState("javascript");
     const [theme, setTheme] = useState("vs-dark");
     const [viewMode, setViewMode] = useState("code"); // "code" | "whiteboard"

     // solo editor — no socket, so whiteboard is purely local state
     const [whiteboardElements, setWhiteboardElements] = useState([]);
     const excalidrawAPIRef = useRef(null);

     const handleCodeChange = (newCode) => {

    setCode(newCode);
   
  };

  return (
   <div className="h-screen flex flex-col bg-background text-on-surface overflow-hidden">
      <EditorToolBar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />

      {viewMode === "code" ? (
        <CodeEditor
          code={code}
          setCode={handleCodeChange}
          language={language}
          theme={theme}
        />
      ) : (
        <Whiteboard
          elements={whiteboardElements}
          onLocalChange={setWhiteboardElements}
          excalidrawAPIRef={excalidrawAPIRef}
        />
      )}
    </div>
  )
}

export default DefaultPage