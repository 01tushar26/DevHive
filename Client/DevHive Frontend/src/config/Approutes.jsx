import React from 'react'
import App from '../App'
import { Route ,Routes } from 'react-router-dom'
const AppRoutes = () => {
  return (
    <Routes>
    <Route path='/' element ={<App/>}/>
    <Route path='/about' element ={<h1>This is Tushar</h1>}/>
   </Routes>
  )
}

export default AppRoutes