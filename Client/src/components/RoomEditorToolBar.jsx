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

      toast.success(`Room with id ${roomId} deleted successfully`)
      
    } catch (error) {
       const message =
        error.response?.data?.error?.message || 
        error.response?.data?.data?.message || 
        "Failed to delete room"
      toast.success(message);
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
     <div className="flex items-center justify-between px-6 py-3 bg-surface-container-low border-b border-outline-variant/10">
      <div className="flex items-center gap-3">
        <div className="flex items-center justify-center w-8 h-8 bg-primary-container/10 rounded-lg border border-primary-container/20">
          <Code2 className="w-5 h-5 text-primary-container" />
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
          {/* <span className="text-xs text-primary-container font-medium mt-1">Live Room: {roomId.slice(0, 8)}...</span> */}
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
        <div className="h-6 w-px bg-outline-variant/40 mx-1"></div> {/* Divider */}
  
          {/* <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
            Run
          </button> */}
          <Dialog>
           <DialogTrigger asChild>
                      <Button className="bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container gap-2 border-0">
                        <Users className="w-4 h-4" />
                        Invite
                      </Button>
                    </DialogTrigger>
          <DialogContent className="bg-surface-container-low border-outline-variant/10 text-on-surface sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-headline">Room Invite Link</DialogTitle>
              <DialogDescription className="text-on-surface-variant pt-2 pb-4">
                Share this link with your team to collaborate in real-time.
              </DialogDescription>
              <Field className="space-y-2">
                <FieldLabel className="text-on-surface-variant">Invite URL</FieldLabel>
                <div className="flex gap-2">
                  <Input 
                    readOnly 
                    value={link} 
                    className="bg-surface-container-lowest border-outline-variant/10 text-on-surface-variant focus-visible:ring-primary-container"
                  />
                  <Button onClick={()=>copyCode()} className="bg-surface-container-high hover:bg-surface-bright text-on-surface px-3">
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