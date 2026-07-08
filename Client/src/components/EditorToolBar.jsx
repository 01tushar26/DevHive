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
        <div className="flex items-center justify-center w-8 h-8 bg-primary-container/10 rounded-lg border border-primary-container/20">
          <Code2 className="w-5 h-5 text-primary-container" />
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

  <DialogContent className="bg-surface-container-low border-outline-variant/10 text-on-surface sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-headline flex items-center gap-2">
                <Share2 className="w-5 h-5 text-primary-container" />
                Live Collaboration
              </DialogTitle>
              <DialogDescription className="text-on-surface-variant pt-2 pb-4">
                Invite people to collaborate on your code. The session is end-to-end encrypted and fully private.
              </DialogDescription>
              <div className="space-y-4">
                <Field>
                  <FieldLabel className="text-on-surface-variant">Enter your name</FieldLabel>
                  <Input 
                    ref={inputRef} 
                    placeholder="e.g. John Doe" 
                    className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline pl-8 focus-visible:ring-primary-container"
                    required
                  />
                </Field>
                <Button 
                  onClick={sendCreateRoomRequest} 
                  className="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container"
                >
                  Start Session
                </Button>
              </div>
            </DialogHeader>

    

  {/* --- JOIN SESSION SECTION --- */}
  <div className="relative flex items-center ">
  <div className="flex-grow border-t border-outline-variant/10"></div>
  <span className="flex-shrink mx-4 text-outline text-sm uppercase tracking-wider font-medium">
    Or
  </span>
  <div className="flex-grow border-t border-outline-variant/10"></div>
</div>
 <DialogHeader>
  <DialogDescription className="text-on-surface-variant pt-2 pb-2">
    Join an existing collaboration session by pasting the room link below.
  </DialogDescription>
</DialogHeader>

  <div className="space-y-1">
    {/* <Field>
      <FieldLabel className="text-on-surface-variant">Enter your name</FieldLabel>
      <Input 
        ref={joinNameRef} 
        placeholder="e.g. Jane Doe" 
        className="bg-surface-container-lowest border-outline-variant/10 focus:ring-primary-container"
        required
      />
    </Field> */}
    
   <Field>
    <FieldLabel className="text-on-surface-variant">Room Link</FieldLabel>
    <Input 
      ref={roomLinkRef} 
      placeholder="Paste room URL or ID here" 
       className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline pl-8 focus-visible:ring-primary-container"
      required
    />
  </Field>

    <div className="pt-2">
    <Button 
      onClick={sendJoinRoomRequest} 
      className="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container"
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