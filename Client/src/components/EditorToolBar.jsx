import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button'
import { Input } from './ui/input'
import { Field, FieldLabel } from './ui/field'
import { useNavigate } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'
import axiosInstance from '@/lib/axios-instance'
import { ArrowRight, Code2, Share2, Users } from 'lucide-react'
import { toast } from 'sonner'
import ShinyText from './ui/shinyText'

const EditorToolBar = ({ language, setLanguage,theme,setTheme }) => {
  // inputRef used for get its input value ....and we used it because it did not rerender the compnent
  
  const roomLinkRef = useRef()
  const navigate = useNavigate()

  const sendCreateRoomRequest=async()=>{

    

      try {
        
       
      const response =  await axiosInstance.post("/rooms"
       )
       

       if(response.status === 201){
        const roomId = response.data.data.id

      //this is to check wether the current client is owner or not so that to show leave and end button there
      // localStorage.setItem(`room_owner_${roomId}`, "true")
      // localStorage.setItem("userName", inputRef.current.value)
      toast.success("Room created successfully !!")
      
         setTimeout(() => navigate(`/room/${response.data.data.id}`), 1000)
        
       }
        
      } 
      catch (error) {
       const message =
        error.response?.data?.error?.message || 
        error.response?.data?.data?.message || 
        "Failed to create room"

      toast.error(message)
        
      }
  }

  const sendJoinRoomRequest=async()=>{

      if(!roomLinkRef.current || roomLinkRef.current.value == ""){
           toast.error("Please enter room link !!")
          return
        }
        window.location.href = roomLinkRef.current.value;

      
  }
  return (
   <div className="flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
         <div className="flex items-center gap-2">
    <span className="w-3 h-3 rounded-full bg-[#ff5f57]"></span>
    <span className="w-3 h-3 rounded-full bg-[#febc2e]"></span>
    <span className="w-3 h-3 rounded-full bg-[#28c840]"></span>
  </div>
        
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

      <div className="flex items-center gap-4">
        <LanguageSelector
          language={language}
          setLanguage={setLanguage}
        />
      
        <ThemeSelector
          theme={theme}
          setTheme={setTheme}
        />
        
        {/* <button className="bg-[#00ffaab4] text-black hover:bg-blue-700 px-3 py-1 text-sm rounded">
          Run
        </button> */}
  <Dialog>
  <DialogTrigger asChild>
    <Button className="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container gap-2 border-0">
      <Users className="w-4 h-4" />
      Collaborate
    </Button>
  </DialogTrigger>

  <DialogContent className="sm:max-w-md bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden p-0 gap-0 text-on-surface">
    {/* Fake window chrome, echoing the editor mockup */}
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
            <Share2 className="text-primary-container" size={18} />
          </div>
          <DialogTitle className="text-2xl font-headline font-bold tracking-tight">
            Live Collaboration
          </DialogTitle>
        </div>
        <DialogDescription className="text-on-surface-variant font-body leading-relaxed pt-2">
          Invite people to collaborate on your code. The session is end-to-end encrypted and fully private.
        </DialogDescription>
      </DialogHeader>

      <div className="pt-6">
        <Button
          onClick={sendCreateRoomRequest}
          size="xl"
          className="w-full gap-2"
        >
          Start Session
        </Button>
      </div>

      {/* --- DIVIDER --- */}
      <div className="relative flex items-center py-8">
        <div className="flex-grow border-t border-outline-variant/10" />
        <span className="flex-shrink mx-4 text-xs font-label text-outline uppercase tracking-widest">
          Or
        </span>
        <div className="flex-grow border-t border-outline-variant/10" />
      </div>

      {/* --- JOIN SESSION SECTION --- */}
      <p className="text-on-surface-variant font-body leading-relaxed mb-4 -mt-2">
        Join an existing collaboration session by pasting the room link below.
      </p>

      <div className="space-y-1">
        <Field>
          <FieldLabel className="text-xs font-label uppercase tracking-widest text-on-surface-variant mb-2 block">
            Room Link
          </FieldLabel>
          <div className="relative">
            <Input
              ref={roomLinkRef}
              placeholder="Paste room URL"
              required
              className="w-full bg-surface-container rounded-lg border border-outline-variant/20 px-4 py-3 font-mono text-sm text-on-surface placeholder:text-outline focus:outline-none focus-visible:ring-1 focus-visible:ring-primary-container/50 focus:border-primary-container/50 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-container/60 animate-pulse" />
          </div>
        </Field>

        <div className="pt-4">
          <Button
            onClick={sendJoinRoomRequest}
            size="xl"
            className="w-full gap-2"
          >
            Join Session <ArrowRight size={18} />
          </Button>
        </div>
      </div>
    </div>
  </DialogContent>
</Dialog>
      </div>
    </div>
  )
}

export default EditorToolBar