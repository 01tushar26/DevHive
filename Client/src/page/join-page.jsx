import axiosInstance from '@/lib/axios-instance'
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
       const response = await axiosInstance.post(`/rooms/${roomId}/join`,
        {userName:"tushar"}
       )
       
       console.log(response)
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