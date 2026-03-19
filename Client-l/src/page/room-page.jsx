import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState ,useRef,useEffect} from 'react';
import CodeEditor from '@/components/CodeEditor';
import { connectSocket,sendCodeUpdate } from '@/Websockets/socket';

const RoomPage = () => {
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");

    const {roomId } = useParams()
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
      <RoomEditorToolBar
        language={language}
        setLanguage={setLanguage}
        roomId = {roomId}
      />

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
        language={language}
      />
    </div>)
}

export default RoomPage