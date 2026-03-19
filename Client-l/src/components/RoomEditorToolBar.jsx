import React from 'react'
import LanguageSelector from './LanguageSelector'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { Button } from './ui/button'
import { Field, FieldLabel } from './ui/field'
import { Input } from './ui/input'


const RoomEditorToolBar = ({ language, setLanguage ,roomId}) => {
  
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
            <Input   type="text" value ={`http://localhost:5173/room/${roomId}/join`}/>
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