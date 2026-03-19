import React, { useRef } from 'react'
import LanguageSelector from './LanguageSelector'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'
import axios from 'axios'


const RoomEditorToolBar = ({ language, setLanguage ,roomId}) => {

  async function deleteRoom() {

    await axios.delete(`http://localhost:8080/api/v1/rooms/${roomId}/end`)
    console.log("Room deleted sucessfully")
    
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
     <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
        <h1 className="text-sm font-semibold text-white">Dev Editor</h1>
  
        <div className="flex items-center gap-2">
          <LanguageSelector
            language={language}
            setLanguage={setLanguage}
          />
  
          <button className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
            Run
          </button>
          <button onClick = {()=>{
            deleteRoom()
          }}className="bg-blue-600 hover:bg-blue-700 px-3 py-1 text-sm rounded text-white">
            EndSession
          </button>
          <Dialog>
    <DialogTrigger>
      <Button variant="secondary">
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