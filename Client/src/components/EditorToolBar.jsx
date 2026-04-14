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
import { Code2, Share2, Users } from 'lucide-react'
import { toast } from 'sonner'
import ShinyText from './ui/shinyText'

const EditorToolBar = ({ language, setLanguage,theme,setTheme }) => {
  // inputRef used for get its input value ....and we used it because it did not rerender the compnent
  const inputRef =useRef()
  const roomLinkRef = useRef()
  const navigate = useNavigate()

  const sendCreateRoomRequest=async()=>{

      if(!inputRef.current || inputRef.current.value == ""){
           toast.error("Please enter your name !!")
          return
        }

      try {
        
       
      const response =  await axiosInstance.post("/rooms"
        ,{ userName: inputRef.current.value}
       )
       

       if(response.status === 201){
        const roomId = response.data.data.id

      
      localStorage.setItem(`room_owner_${roomId}`, "true")
      localStorage.setItem("userName", inputRef.current.value)
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
   <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <Code2 className="w-5 h-5 text-emerald-600" />
        </div>
        <h1 className="text-lg font-bold  tracking-tight">
          

<ShinyText
  text="DevHive"
  speed={2.3}
  delay={0}
  color="#F4F4F5"
  shineColor="#059669"
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
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-black gap-2 border-0">
              <Users className="w-4 h-4" />
              Collaborate
            </Button>
          </DialogTrigger>

  <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl flex items-center gap-2">
                <Share2 className="w-5 h-5 text-emerald-600" />
                Live Collaboration
              </DialogTitle>
              <DialogDescription className="text-zinc-400 pt-2 pb-4">
                Invite people to collaborate on your code. The session is end-to-end encrypted and fully private.
              </DialogDescription>
              <div className="space-y-4">
                <Field>
                  <FieldLabel className="text-zinc-300">Enter your name</FieldLabel>
                  <Input 
                    ref={inputRef} 
                    placeholder="e.g. John Doe" 
                    className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-600 pl-8 focus-visible:ring-emerald-600"
                    required
                  />
                </Field>
                <Button 
                  onClick={sendCreateRoomRequest} 
                  className="w-full bg-emerald-600 hover:bg-emerald-700 text-black"
                >
                  Start Session
                </Button>
              </div>
            </DialogHeader>

    

  {/* --- JOIN SESSION SECTION --- */}
  <div className="relative flex items-center ">
  <div className="flex-grow border-t border-zinc-800"></div>
  <span className="flex-shrink mx-4 text-zinc-500 text-sm uppercase tracking-wider font-medium">
    Or
  </span>
  <div className="flex-grow border-t border-zinc-800"></div>
</div>
 <DialogHeader>
  <DialogDescription className="text-zinc-400 pt-2 pb-2">
    Join an existing collaboration session by pasting the room link below.
  </DialogDescription>
</DialogHeader>

  <div className="space-y-1">
    {/* <Field>
      <FieldLabel className="text-zinc-300">Enter your name</FieldLabel>
      <Input 
        ref={joinNameRef} 
        placeholder="e.g. Jane Doe" 
        className="bg-zinc-950 border-zinc-800 focus:ring-emerald-500"
        required
      />
    </Field> */}
    
   <Field>
    <FieldLabel className="text-zinc-300">Room Link</FieldLabel>
    <Input 
      ref={roomLinkRef} 
      placeholder="Paste room URL or ID here" 
       className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-600 pl-8 focus-visible:ring-emerald-600"
      required
    />
  </Field>

    <div className="pt-2">
    <Button 
      onClick={sendJoinRoomRequest} 
      className="w-full bg-emerald-600 hover:bg-emerald-700 text-black"
    >
      Join Session
    </Button>
  </div>

  </div>

          </DialogContent>
</Dialog>
      </div>
    </div>
  )
}

export default EditorToolBar