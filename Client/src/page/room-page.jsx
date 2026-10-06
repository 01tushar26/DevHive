import RoomEditorToolBar from '@/components/RoomEditorToolBar';
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { useState, useRef, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import CodeEditor from '@/components/CodeEditor';
import Whiteboard from '@/components/Whiteboard';
import { connectSocket, sendCodeUpdate, disconnectSocket, sendLanguageUpdate, sendWhiteboardUpdate } from '@/Websockets/socket';

import { toast } from 'sonner';
import axiosInstance from '@/lib/axios-instance';
import { getErrorMessage } from '@/lib/get-error-message';
import VideoCallPanel from '@/components/VideoCallPanel';


const RoomPage = () => {

    const [isOwner, setIsOwner] = useState(false);
    const [code, setCode] = useState("// Start coding...");
    const [language, setLanguage] = useState("javascript");
    const [theme, setTheme] = useState("vs-dark");
    const [roomClosed, setRoomClosed] = useState(false)
    const [pageLoading, setPageLoading] = useState(true)
    const navigate = useNavigate()
    const [vcActive, setVcActive] = useState(false);
    const [vcToken, setVcToken] = useState(null);
    const [vcServerUrl, setVcServerUrl] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [startingVc, setStartingVc] = useState(false);
    const [joiningVc, setJoiningVc] = useState(false);
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


    const { roomId } = useParams()
    const isRemoteUpdate = useRef(false);
    const isRemoteLanguageUpdate = useRef(false);

  useEffect(() => {
    async function getRoomCode() {
      try {
        setPageLoading(true)
        const res = await axiosInstance.get(`/rooms/${roomId}`)
        if (res.status === 200) {
          if (res.data.data.status === "CLOSED") {
            setRoomClosed(true)
            toast.error("Room closed", {
              description: "This room has been closed.",
            })

            setTimeout(() => navigate("/editor"), 1000)
            return // keep the loader visible until redirect
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
        setPageLoading(false)
      } catch (error) {
        toast.error("Failed to load room", {
          description: getErrorMessage(error, "Failed to load room."),
        })
        setTimeout(() => navigate("/editor"), 3000)
        // loader stays on until redirect
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

        toast.error("Room closed", {
          description: "The room has been closed by the host.",
        })
        navigate("/editor")
      }
      else if (data.message === "USER_LEFT") {
        toast.error(`${data.userName} left the room`);
      } else if (data.message === "USER_JOIN") {
        toast.success(`${data.userName} joined the room`);
      } else if (data.message == "USER_REJOIN") {
        toast.success(`${data.userName} rejoined the room`);
      }
      else if (data.message == "CODE_UPDATE") {
        isRemoteUpdate.current = true;
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
      else if (data.message == "LANG_UPDATE") {
        isRemoteLanguageUpdate.current = true;
        setLanguage(data.language);
        toast.success("Language changed", {
          description: "The room language was updated.",
        });
      }
      else if (data.message === "VC_STARTED") {
        if (justStartedVc.current) {
          justStartedVc.current = false;
        } else {
          setVcActive(true);
          toast.success("Video call started", {
            description: "Join the call from the toolbar.",
          });
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
    if (startingVc || joiningVc) return;
    try {
      setStartingVc(true);
      const res = await axiosInstance.post(`/livekit/start/${roomId}`);
      setVcServerUrl(res.data.data.url);
      setVcToken(res.data.data.token);
      justStartedVc.current = true;
      setVcActive(true);
      setInCall(true);
      toast.success("Video call started", {
        description: "You're live in the call.",
      });
    } catch (err) {
      toast.error("Failed to start video call", {
        description: getErrorMessage(err),
      });
    } finally {
      setStartingVc(false);
    }
  };

  const handleJoinCall = async () => {
    if (startingVc || joiningVc) return;
    try {
      setJoiningVc(true);
      const res = await axiosInstance.post(`/livekit/token/${roomId}`);
      setVcServerUrl(res.data.data.url);
      setVcToken(res.data.data.token);
      setInCall(true);
      toast.success("Joined video call", {
        description: "You're connected.",
      });
    } catch (err) {
      toast.error("Failed to join video call", {
        description: getErrorMessage(err),
      });
    } finally {
      setJoiningVc(false);
    }
  };

  const handleVcDisconnected = () => {
    setVcToken(null);
    setVcServerUrl(null);
    setInCall(false);
  };

  if (pageLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background text-on-surface">
        <Loader2 className="h-8 w-8 animate-spin text-primary-container mb-4" />
        <p className="text-lg font-medium tracking-tight font-headline">Loading room...</p>
        <p className="text-sm text-outline mt-2">Syncing code, whiteboard and call status.</p>
      </div>
    )
  }

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
        startingVc={startingVc}
        joiningVc={joiningVc}
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