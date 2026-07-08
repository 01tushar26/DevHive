
import './App.css'

import { BrowserRouter, Routes ,Route } from 'react-router-dom'
import DefaultPage from './page/default-page'
import RoomPage from './page/room-page'
import JoinPage from './page/join-page'
import Login from './page/login'
import SignUp from './page/signup-page'
import Home from './page/home'

function App() {
  
  return (
    <>
    <BrowserRouter>
     <Routes>
      <Route path='/editor' element = {<DefaultPage/>}></Route>
      <Route path='/' element = {<Home/>}></Route>
      <Route path='/login' element = {<Login/>}></Route>
      <Route path='/signup' element = {<SignUp/>}></Route>
      <Route path='/room/:roomId' element = {<RoomPage/>}></Route>
      <Route path='/room/:roomId/join' element = {<JoinPage/>}></Route>

     </Routes>
    </BrowserRouter>
      
    </>
  )
}

export default App
