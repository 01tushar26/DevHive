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
import axios from 'axios'
import { Input } from './ui/input'
import { Field, FieldLabel } from './ui/field'
import { useNavigate } from 'react-router-dom'
import ThemeSelector from './ThemeSelector'
import axiosInstance from '@/lib/axios-instance'

const EditorToolBar = ({ language, setLanguage,theme,setTheme }) => {
  // inputRef used for get its input value ....and we used it because it did not rerender the compnent
  const inputRef =useRef()
  const navigate = useNavigate()

  const sendCreateRoomRequest=async()=>{

      try {
        if(!inputRef.current || inputRef.current.value == ""){
          return
        }
       
      const response =  await axiosInstance.post("/rooms"
        ,{ userName: inputRef.current.value}
       )
       console.log(response)

       if(response.status === 201){
        console.log(response.data.data.id)
        navigate(`/room/${response.data.data.id}`)
       }
        
      } catch (error) {
        
      }
  }
  return (
   <div className="flex items-center justify-between px-4 py-2 bg-[#14171d] border-b border-gray-700">
      <h1 className="text-sm font-semibold text-[#00ffaab4]">Dev Hive</h1>

      <div className="flex items-center gap-2">
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
  <DialogTrigger>
    <Button className="bg-[#00ffaab4] text-black}" variant="secondary">
      Share
    </Button>
  </DialogTrigger>
  <DialogContent className="flex justify-center items-center bg-[#00ffaab4] px-10">
    <DialogHeader>
      <DialogTitle>Live collaboration</DialogTitle>
      <DialogDescription>
        <span>Invite people to collaborate on your drawing.
Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</span>
        <Field>
          <FieldLabel>
            Enter your name
          </FieldLabel>
          <Input ref={inputRef} placeholder="John" type="text" required/>
        </Field>
        
        <Button onClick={()=>sendCreateRoomRequest()}>Start Session</Button>
      </DialogDescription>
    </DialogHeader>
  </DialogContent>
</Dialog>
      </div>
    </div>
  )
}

export default EditorToolBar