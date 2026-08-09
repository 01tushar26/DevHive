import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState ,useRef,useEffect} from 'react';
import CodeEditor from '@/components/CodeEditor';
import Whiteboard from '@/components/Whiteboard';
import { connectSocket, sendCodeUpdate, disconnectSocket, sendLanguageUpdate, sendWhiteboardUpdate } from '@/Websockets/socket';

import { toast  } from 'sonner';
import axiosInstance from '@/lib/axios-instance';
import VideoCallPanel from '@/components/VideoCallPanel';


const RoomPage = () => {

    const [isOwner, setIsOwner] = useState(false);
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [roomClosed, setRoomClosed] = useState(false)
    const navigate = useNavigate()
    const [vcActive, setVcActive] = useState(false);
    const [vcToken, setVcToken] = useState(null);
    const [vcServerUrl, setVcServerUrl] = useState(null);
    const [inCall, setInCall] = useState(false);
    const justStartedVc = useRef(false);
    const [viewMode, setViewMode] = useState("code"); // "code" | "whiteboard"
    const [whiteboardElements, setWhiteboardElements] = useState([]);
    const excalidrawAPIRef = useRef(null);
    const wbDebounceRef = useRef(null);
    // tracks the exact JSON string of the last whiteboard payload WE sent —
    // lets us recognize the server broadcasting our own update back to us
    // (STOMP's simple broker doesn't exclude the sender) and drop it before
    // it ever reaches state, instead of relying on timing-based flags.
    const lastSentWhiteboardRef = useRef("");


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
          setVcActive(res.data.data.vcActive)
          setIsOwner(res.data.data.ViewerOwner)
          setWhiteboardElements(
           res.data.data.whiteboardElements
           ? JSON.parse(res.data.data.whiteboardElements)
           : []
          )
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

        if (data.message === "ROOM_ENDED") {
          // endRoom — disconnect all and redirect
          disconnectSocket();
          
          toast.error("The room has been closed by the host")
          navigate("/editor")
        } 
       else if (data.message === "USER_LEFT") {
        
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
    else if (data.message === "WB_UPDATE") {
      // if this is exactly what we just sent, it's our own broadcast
      // echoing back — ignore it, don't touch state, don't re-apply it
      if (data.elements === lastSentWhiteboardRef.current) {
        return;
      }
      setWhiteboardElements(JSON.parse(data.elements));
    }
    else if(data.message =="LANG_UPDATE"){
      
      isRemoteLanguageUpdate.current=true;
      setLanguage(data.language);
      toast.success(` Room language successfully changed !!`);
    }
    else if (data.message === "VC_STARTED") {
       if (justStartedVc.current) {
    justStartedVc.current = false;
  } else {
    setVcActive(true);
    toast.success("Video call started join the video call !!");
  }
    
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
    sendCodeUpdate(roomId, newCode);
  };

  const handleWhiteboardChange = (newElements) => {
    setWhiteboardElements(newElements);
    clearTimeout(wbDebounceRef.current);
    wbDebounceRef.current = setTimeout(() => {
      const serialized = JSON.stringify(newElements);
      lastSentWhiteboardRef.current = serialized; // record before sending
      sendWhiteboardUpdate(roomId, newElements);
    }, 300);
  };

  const handlelanguageChange = (newLang) => {
    if (isRemoteLanguageUpdate.current) {
      isRemoteLanguageUpdate.current = false;
      return;
    }

    setLanguage(newLang);
    sendLanguageUpdate(roomId, newLang);
  };

  const handleStartVc = async () => {
  try {
     toast.success("Starting the call ..." );
    const res = await axiosInstance.post(`/livekit/start/${roomId}`);
    setVcServerUrl(res.data.data.url);
    setVcToken(res.data.data.token);
     justStartedVc.current = true;
    setVcActive(true);
    setInCall(true);
    // toast.success("Successfully start the call !!" );
  } catch (err) {
    toast.error("Failed to start video call !!");
  }
};

 const handleJoinCall = async () => {
  try {
    
    const res = await axiosInstance.post(`/livekit/token/${roomId}`);
    setVcServerUrl(res.data.data.url);
    setVcToken(res.data.data.token);
    setInCall(true);
    toast.success("Successfully joined video call !!");
  } catch (err) {
    toast.error("Failed to join video call");
  }
};

const handleVcDisconnected = () => {
  setVcToken(null);
  setVcServerUrl(null);
  setInCall(false);
};
  
return (
    <div className="h-screen flex flex-col bg-background">
      <RoomEditorToolBar
  language={language}
  setLanguage={handlelanguageChange}
  roomId={roomId}
  theme={theme}
  setTheme={setTheme}
  onStartVc={handleStartVc}
  onJoinVc={handleJoinCall}
  vcActive={vcActive}
  inCall={inCall}
  isOwner={isOwner}
  viewMode={viewMode}
  setViewMode={setViewMode}
/>

  <div className="flex flex-1 overflow-hidden">
  <div className="flex-1 min-w-0">
  {viewMode === "code" ? (
    <CodeEditor code={code} setCode={handleCodeChange} language={language} theme={theme} />
  ) : (
    <Whiteboard
      elements={whiteboardElements}
      onLocalChange={handleWhiteboardChange}
      excalidrawAPIRef={excalidrawAPIRef}
    />
  )}
</div>

  {inCall && (
  <div className="w-80 shrink-0 border-l border-outline-variant/10 relative overflow-hidden">
    <VideoCallPanel
      serverUrl={vcServerUrl}
      token={vcToken}
      onDisconnected={handleVcDisconnected}
    />
  </div>
)}
</div>
</div>
)
}

export default RoomPage