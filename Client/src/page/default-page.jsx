import React from 'react'
import EditorToolBar from '@/components/EditorToolBar';
import CodeEditor from '@/components/CodeEditor';
import { useState } from 'react';
const DefaultPage = () => {

     const [code, setCode] = useState("// Start coding...");
     const [language, setLanguage] = useState("javascript");
     const [theme, setTheme] = useState("vs-dark");

     const handleCodeChange = (newCode) => {

    setCode(newCode);
   
  };

  return (
   <div className="h-screen flex flex-col bg-zinc-950 text-zinc-100 overflow-hidden">
      <EditorToolBar
        language={language}
        setLanguage={setLanguage}
        theme={theme}
        setTheme={setTheme}
      />

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
        language={language}
        theme={theme}
      />
    </div>
  )
}

export default DefaultPage