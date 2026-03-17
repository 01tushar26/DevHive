import { useState } from 'react'
import './App.css'
import EditorPage from './Pages/EditorPage'

function App() {
  const [count, setCount] = useState(0)

  return (
   <div >
   <EditorPage/>
   </div>
  )
}

export default App
