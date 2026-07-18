import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState ,useRef,useEffect} from 'react';
import CodeEditor from '@/components/CodeEditor';
import { connectSocket,sendCodeUpdate,disconnectSocket, sendLanguageUpdate } from '@/Websockets/socket';
import { toast  } from 'sonner';
import axios from 'axios';
import axiosInstance from '@/lib/axios-instance';


const RoomPage = () => {

    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [roomClosed, setRoomClosed] = useState(false)
    const navigate = useNavigate()


    const {roomId } = useParams()
    const username = "Tushar"; // later auth-based
    const isRemoteUpdate = useRef(false);
    const isRemoteLanguageUpdate = useRef(false);

     useEffect(() => {
    async function getRoomCode() {
      try {
        const res = await axiosInstance.get(`/rooms/${roomId}`)
        if (res.status === 200) {
          if (res.data.data.status === "CLOSED") {
            setRoomClosed(true)
            toast.error("This room has been closed.")

            setTimeout(() => navigate("/editor"), 1000)
            return
          }
          setCode(res.data.data.code)
          setLanguage(res.data.data.language)
        }
      } catch (error) {
          const message = error.response?.data?.error?.message || "Failed to load room."
          toast.error(message)
        setTimeout(() => navigate("/editor"), 3000)
      }
    }
    getRoomCode()
  }, [roomId, navigate])


  // todo- data .message is checked two time first on socket .js and second is here edit it
  useEffect(() => {

      if (roomClosed) return

    connectSocket(roomId, (data) => {
       if (data.message === "USER_LEFT") {
        
        toast.error(`${data.userName} left the room !!`);  
    } else if (data.message === "USER_JOIN") {
        
        toast.success(`${data.userName} joined the room !!`);

    } else if(data.message == "USER_REJOIN") {
      toast.success(`${data.userName} rejoined the room !!`);
    }
    else if(data.message == "CODE_UPDATE"){
      ('updating code .....')
        isRemoteUpdate.current = true;  // 
        setCode(data.code);
    }
    else if(data.message =="LANG_UPDATE"){
      
      isRemoteLanguageUpdate.current=true;
      setLanguage(data.language);
      toast.success(` Room language successfully changed !!`);
    }
    else {
        
        console.warn("Unknown message type received:", data);
    }
    });
     return () => disconnectSocket();

  }, [roomId]);


 

  const handleCodeChange = (newCode) => {
    if (isRemoteUpdate.current) {
      isRemoteUpdate.current = false;
      return;
    }

    setCode(newCode);
    sendCodeUpdate(roomId, newCode, username);
  };

  const handlelanguageChange = (newLang) => {
    if (isRemoteLanguageUpdate.current) {
      isRemoteLanguageUpdate.current = false;
      return;
    }

    setLanguage(newLang);
    sendLanguageUpdate(roomId, newLang, username);
  };
  

 return (
    <div className="h-screen flex flex-col bg-background">
      <RoomEditorToolBar
        language={language}
        setLanguage={handlelanguageChange}
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