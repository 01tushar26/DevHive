import React from 'react'
import EditorToolBar from '@/components/EditorToolBar';
import CodeEditor from '@/components/CodeEditor';
import { useState } from 'react';
const DefaultPage = () => {

     const [code, setCode] = useState("// Start coding...");
     const [language, setLanguage] = useState("javascript");

     const handleCodeChange = (newCode) => {

    setCode(newCode);
   
  };

  return (
   <div className="h-screen flex flex-col bg-gray-900">
      <EditorToolBar
        language={language}
        setLanguage={setLanguage}
      />

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
        language={language}
      />
    </div>
  )
}

export default DefaultPage