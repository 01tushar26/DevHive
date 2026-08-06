import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import ThemeSelector from './ThemeSelector'
import { Code2, Copy, Link2, LogOut, Users, Video, PenLine } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import axiosInstance from '@/lib/axios-instance'
import { toast } from 'sonner'
import ShinyText from './ui/shinyText'
import { useNavigate } from 'react-router-dom'


const RoomEditorToolBar = ({ language, setLanguage, roomId, theme, setTheme, onStartVc, vcActive, inCall, onJoinVc, isOwner, viewMode, setViewMode }) => {

   const navigate = useNavigate()

  async function deleteRoom() {
    try {
      await axiosInstance.delete(`/rooms/${roomId}/end`);
      toast.success(`Room with id ${roomId} deleted successfully`)
    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.data?.message ||
        "Failed to delete room"
      toast.error(message);
    }
  }
  async function leaveRoom() {
    try {
      await axiosInstance.delete(`/rooms/${roomId}/leave`);
      toast.success("You left the room")
       navigate("/editor")

    } catch (error) {
      const message =
        error.response?.data?.error?.message ||
        error.response?.data?.data?.message ||
        "Failed to leave room"
      toast.error(message);
    }
  }

  const link = `http://localhost:5173/room/${roomId}/join`;

  function copyCode() {
    navigator.clipboard.writeText(link).then(() => {
      toast.success("Code copied to clipboard!");
    }).catch(err => {
      toast.error('Failed to copy code: ');
    });
  }

  return (
    <div className="flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
          <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
          <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold tracking-tight font-headline">
            <ShinyText
              text="DevHive"
              speed={2.3}
              delay={0}
              color="#F4F4F5"
              shineColor="#00ffa3"
              spread={120}
              direction="left"
              yoyo={false}
              pauseOnHover={false}
              disabled={false}
            />
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
    
        <div className="flex items-center bg-surface-container-lowest rounded-md p-1 border border-outline-variant/20">
          <button
            onClick={() => setViewMode("code")}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors ${
              viewMode === "code"
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <Code2 className="w-4 h-4" /> Code
          </button>
          <button
            onClick={() => setViewMode("whiteboard")}
            className={`px-3 py-1.5 rounded text-sm flex items-center gap-1.5 transition-colors ${
              viewMode === "whiteboard"
                ? "bg-primary-container text-on-primary-container"
                : "text-on-surface-variant hover:text-on-surface"
            }`}
          >
            <PenLine className="w-4 h-4" /> Whiteboard
          </button>
        </div>

      
        {viewMode === "code" && (
          <>
            <LanguageSelector language={language} setLanguage={setLanguage} />
            <ThemeSelector theme={theme} setTheme={setTheme} />
          </>
        )}

        <div className="h-6 w-px bg-outline-variant/40 mx-1"></div>

        
        {!vcActive && (
    <Button onClick={onStartVc} className="gap-2">
      <Video className="w-4 h-4" /> Start VC
    </Button>
  )}
  {vcActive && !inCall && (
    <Button onClick={onJoinVc} className="gap-2">
      <Video className="w-4 h-4" /> Join Call
    </Button>
  )}

        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container gap-2 border-0">
              <Users className="w-4 h-4" />
              Invite
            </Button>
          </DialogTrigger>

          <DialogContent className="sm:max-w-md bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden p-0 gap-0 text-on-surface">
            <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-error/30" />
                <div className="w-3 h-3 rounded-full bg-primary-container/30" />
                <div className="w-3 h-3 rounded-full bg-secondary/30" />
              </div>
              <div className="text-xs font-label text-on-surface-variant tracking-widest">
                DevHive
              </div>
              <div className="w-12" />
            </div>

            <div className="p-6">
              <DialogHeader>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg bg-primary-container/10 flex items-center justify-center shrink-0">
                    <Link2 className="text-primary-container" size={18} />
                  </div>
                  <DialogTitle className="text-2xl font-headline font-bold tracking-tight">
                    Room Invite Link
                  </DialogTitle>
                </div>
                <DialogDescription className="text-on-surface-variant font-body leading-relaxed">
                  Share this room link with your team to collaborate in real-time.
                </DialogDescription>
              </DialogHeader>

              <Field className="space-y-3 pt-6">
                <FieldLabel className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
                  Invite URL
                </FieldLabel>

                <div className="relative">
                  <Input
                    readOnly
                    value={link}
                    className="w-full bg-surface-container rounded-lg border border-outline-variant/20 px-4 py-3 font-mono text-sm text-on-surface placeholder:text-outline focus-visible:ring-1 focus-visible:ring-primary-container/50 focus:border-primary-container/50 transition-all truncate"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-container/60 animate-pulse" />
                </div>

                <Button onClick={() => copyCode()} size="xl" className="w-full rounded-full gap-2">
                  <Copy className="w-4 h-4" />
                  Copy Link
                </Button>
              </Field>
            </div>
          </DialogContent>
        </Dialog>

        {isOwner?<Button
          onClick={() => deleteRoom()}
          variant="destructive"
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors gap-2"
        >
          <LogOut className="w-4 h-4" />
          End Session
        </Button>
        :<Button
          onClick={() => leaveRoom()}
          variant="destructive"
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors gap-2"
        >
          <LogOut className="w-4 h-4" />
          Leave Session
        </Button>}
      </div>
    </div>
  )
}
export default RoomEditorToolBar