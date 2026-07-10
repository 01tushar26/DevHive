import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import ThemeSelector from './ThemeSelector'
import { Code2, Copy, Link2, LogOut, Users } from 'lucide-react'
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

  <DialogContent className="sm:max-w-md bg-surface-container-low border border-outline-variant/10 rounded-xl shadow-2xl overflow-hidden p-0 gap-0 text-on-surface">
    {/* Fake window chrome, echoing the editor mockup */}
    <div className="flex items-center justify-between px-4 py-3 bg-surface-container-high">
      <div className="flex gap-2">
        <div className="w-3 h-3 rounded-full bg-error/30" />
        <div className="w-3 h-3 rounded-full bg-primary-container/30" />
        <div className="w-3 h-3 rounded-full bg-secondary/30" />
      </div>
      <div className="text-xs font-label text-on-surface-variant uppercase tracking-widest">
        invite-link.js
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
          Share this link with your team to collaborate in real-time.
        </DialogDescription>
      </DialogHeader>

      <Field className="space-y-2 pt-6">
        <FieldLabel className="text-xs font-label uppercase tracking-widest text-on-surface-variant">
          Invite URL
        </FieldLabel>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              readOnly
              value={link}
              className="w-full bg-surface-container rounded-lg border border-outline-variant/20 px-4 py-3 font-mono text-sm text-on-surface placeholder:text-outline focus-visible:ring-1 focus-visible:ring-primary-container/50 focus:border-primary-container/50 transition-all"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 h-2 w-2 rounded-full bg-primary-container/60 animate-pulse" />
          </div>
          <Button
            onClick={() => copyCode()}
            size="xl"
            className="px-4 gap-2 shrink-0"
          >
            <Copy className="w-4 h-4" />
          </Button>
        </div>
      </Field>
    </div>
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