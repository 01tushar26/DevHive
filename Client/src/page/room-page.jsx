import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useParams } from 'react-router-dom';
import { useState ,useRef,useEffect} from 'react';
import CodeEditor from '@/components/CodeEditor';
import { connectSocket,sendCodeUpdate,disconnectSocket } from '@/Websockets/socket';
import { toast  } from 'sonner';
import axios from 'axios';
import axiosInstance from '@/lib/axios-instance';

const RoomPage = () => {
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");

    const {roomId } = useParams()
    const username = "Tushar"; // later auth-based

  const isRemoteUpdate = useRef(false);

  useEffect(() => {

    connectSocket(roomId, (data) => {
       if (data.message === "USER_LEFT") {
        // setParticipants(prev => prev.filter(p => p.userId !== data.userId));
        toast.error(`${data.userName} left the room`);  // or any notification lib

    } else if (data.message === "USER_JOIN") {
        // setParticipants(prev => [...prev, { userId: data.userId, name: data.name }]);
        toast.success(`${data.userName} joined the room`);

    } else {
        // code update
        ('updating code .....')
        isRemoteUpdate.current = true;  // 
        setCode(data.code);
    }
    });
     return () => disconnectSocket();

  }, [roomId]);

  useEffect(()=>{
    async function getRoomCode() {

      const res = await axiosInstance.get(`/rooms/${roomId}`)
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