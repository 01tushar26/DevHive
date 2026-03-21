import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState ,useRef,useEffect} from 'react';
import CodeEditor from '@/components/CodeEditor';
import { connectSocket,sendCodeUpdate } from '@/Websockets/socket';
import axios from 'axios';

const RoomPage = () => {
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");

    const {roomId } = useParams()
    const username = "Tushar"; // later auth-based

  const isRemoteUpdate = useRef(false);

  useEffect(() => {
    connectSocket(roomId, (data) => {
      isRemoteUpdate.current = true;
      setCode(data.code);
    });

  }, [roomId]);

  useEffect(()=>{
    async function getRoomCode() {

      const res = await axios.get(`http://localhost:8080/api/v1/rooms/${roomId}`)
      if(res.status === 200){
        setCode(res.data.data.code)
      }
      
    }
    getRoomCode()
  },[roomId])

  const handleCodeChange = (newCode) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(newCode);
    sendCodeUpdate(roomId, newCode, username);
  };

 return (
    <div className="h-screen flex flex-col bg-[#0e1115]">
      <RoomEditorToolBar
        language={language}
        setLanguage={setLanguage}
        roomId = {roomId}
        theme={theme}
        setTheme={setTheme}
      />

      <CodeEditor
        code={code}
        setCode={handleCodeChange}
        language={language}
        theme={theme}
      />
    </div>)
}

export default RoomPage