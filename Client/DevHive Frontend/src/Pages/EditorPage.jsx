import React from 'react'
import { useState,useRef,useEffect } from 'react';
import CodeEditor from '../Component/Editor/CodeEditor';
import EditorToolBar from '../Component/Editor/EditorToolBar';
import { connectSocket,sendCodeUpdate } from '../Websockets/socket';


const EditorPage = () => {
  const [code, setCode] = useState("// Start coding...");
  const [language, setLanguage] = useState("javascript");

  const roomId = "3ea04a69"; // later dynamic
  const username = "Tushar"; // later auth-based

  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    connectSocket(roomId, (data) => {
      isRemoteUpdate.current = true;
      setCode(data.code);
    });
  }, [roomId]);

  const handleCodeChange = (newCode) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(newCode);
    sendCodeUpdate(roomId, newCode, username);
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
  );
};

export default EditorPage;