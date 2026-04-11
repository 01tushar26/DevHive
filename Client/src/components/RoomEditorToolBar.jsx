import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import ThemeSelector from './ThemeSelector'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import axios from 'axios'
import axiosInstance from '@/lib/axios-instance'


const RoomEditorToolBar = ({ language, setLanguage ,roomId ,theme ,setTheme}) => {

  async function deleteRoom() {

    await axiosInstance.delete(`/rooms/${roomId}/end`)
    console.log(`Room with id ${roomId} deleted successfully`)
  }

   const inputRef = useRef()
   
  function copyCode() {
  // Get the text from the code snippet element
  const link = inputRef.current.value
  // Use the Clipboard API to write the text to the clipboard
  navigator.clipboard.writeText(link).then(() => {
    // Optional: Provide user feedback
    alert("Code copied to clipboard!");
  }).catch(err => {
    // Handle potential errors
    console.error('Failed to copy code: ', err);
  });
}

  
    return (
     <div className="flex items-center justify-between px-4 py-2 bg-[#14171d] border-b border-gray-700">
        <h1 className="text-sm font-semibold text-[#00ffaab4]">Dev Editor</h1>
  
        <div className="flex items-center gap-2">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />
          <ThemeSelector
          theme={theme}
          setTheme={setTheme}
        />
  
          {/* <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
            Run
          </button> */}

          <button onClick = {()=>{
            deleteRoom()
          }}className="bg-[#00ffaab4] text-black hover:bg-blue-700 px-3 py-1 text-sm rounded ">
            EndSession
          </button>
          <Dialog>
    <DialogTrigger>
      <Button className="bg-[#00ffaab4] text-black" variant="secondary">
        Share
      </Button>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Live collaboration</DialogTitle>
        <DialogDescription>
          <Field>
            <FieldLabel>
              Link
            </FieldLabel>
            <div className='flex'>
            <Input  ref = {inputRef} type="text" value ={`http://localhost:5173/room/${roomId}/join`}/>
            <Button onClick={()=>copyCode()}>Copy</Button>
            </div>
            
          </Field>
          <span>Invite people to collaborate on your drawing.
  Don't worry, the session is end-to-end encrypted, and fully private. Not even our server can see what you draw.</span>
          
        </DialogDescription>
      </DialogHeader>
    </DialogContent>
  </Dialog>
        </div>
      </div>)
}

export default RoomEditorToolBar