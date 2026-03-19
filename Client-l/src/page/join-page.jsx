import axios from 'axios'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const JoinPage = () => {
    const {roomId} = useParams()
    const navigate = useNavigate()
    useEffect(()=>{

      async function joinRoom() {
        if(!roomId){
          return
        }
       const response = await axios.post(`http://localhost:8080/api/v1/rooms/${roomId}/join`)
       if(response.status === 200){
          navigate(`/room/${response.data.data.id}`)
       }
        //todo- popup joined room 
      }  

      joinRoom()

    },[])
    
  return (
    <div></div>
  )
}

export default JoinPage