import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import ThemeSelector from './ThemeSelector'
import { Code2, Copy, LogOut, Users } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import axios from 'axios'
import axiosInstance from '@/lib/axios-instance'
import { toast } from 'sonner'
import ShinyText from './ui/shinyText'


const RoomEditorToolBar = ({ language, setLanguage ,roomId ,theme ,setTheme}) => {

  async function deleteRoom() {

    
    try {
      await axiosInstance.delete(`/rooms/${roomId}/end`);

      toast.success(`Room with id ${roomId} deleted successfully`,{position:"top-center"})
      
    } catch (error) {
      toast.success(`Failed to delete room with id ${roomId}`,{position:"top-center"})
    }
  }
  

   const inputRef = useRef()
   const link = `http://localhost:5173/room/${roomId}/join`;
   
  function copyCode() {
  
  

  navigator.clipboard.writeText(link).then(() => {
    toast.success("Code copied to clipboard!");
  }).catch(err => {
    // Handle potential errors
    toast.error('Failed to copy code: ');
  });
}
 

  
    return (
     <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-emerald-500/10 rounded-lg border border-emerald-500/20">
          <Code2 className="w-5 h-5 text-emerald-500" />
        </div>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold  tracking-tight ">
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
          {/* <span className="text-xs text-emerald-500 font-medium mt-1">Live Room: {roomId.slice(0, 8)}...</span> */}
        </div>
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
        <div className="h-6 w-px bg-zinc-700 mx-1"></div> {/* Divider */}
  
          {/* <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
            Run
          </button> */}
          <Dialog>
           <DialogTrigger asChild>
                      <Button className="bg-emerald-600 hover:bg-emerald-700 text-black gap-2 border-0">
                        <Users className="w-4 h-4" />
                        Invite
                      </Button>
                    </DialogTrigger>
          <DialogContent className="bg-zinc-900 border-zinc-800 text-zinc-100 sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl">Room Invite Link</DialogTitle>
              <DialogDescription className="text-zinc-400 pt-2 pb-4">
                Share this link with your team to collaborate in real-time.
              </DialogDescription>
              <Field className="space-y-2">
                <FieldLabel className="text-zinc-300">Invite URL</FieldLabel>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={link} 
                    className="bg-zinc-950 border-zinc-800 text-zinc-300 focus-visible:ring-emerald-500"
                  />
                  <Button onClick={()=>copyCode()} className="bg-zinc-800 hover:bg-zinc-700 text-white px-3">
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>
              </Field>
            </DialogHeader>
          </DialogContent>
        </Dialog>

          <Button 
          onClick={()=>deleteRoom()} 
          variant="destructive" 
          className="bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white border border-red-500/20 transition-colors gap-2"
        >
          <LogOut className="w-4 h-4" />
          End Session
        </Button>

          
        </div>
      </div>)

        }
export default RoomEditorToolBar