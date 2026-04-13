import axiosInstance from '@/lib/axios-instance'
import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'sonner'

const JoinPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function joinRoom() {
      if (!roomId) return

      try {
        const response = await axiosInstance.post(`/rooms/${roomId}/join`, {
          userName: "Tushar"
        })

        if (response.status === 200) {

          toast.success("Joined room successfully")
           setTimeout(() => navigate(`/room/${response.data.data.id}`), 1000)
          
        }
      } catch (err) {
        const message =
          err.response?.data?.error?.message ||
          "Failed to join room"

        toast.error(message, { duration: 2000 })

        setTimeout(() => {
          navigate("/")
        }, 1000)
      } 
      finally {
        setLoading(false)
      }
    }

    joinRoom()
  }, [roomId, navigate])

 if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-zinc-950 text-zinc-100">
        <div className="w-8 h-8 border-4 border-emerald-500/20 border-t-emerald-500 rounded-full animate-spin mb-4"></div>
        <p className="text-lg font-medium tracking-tight">Joining collaboration room...</p>
        <p className="text-sm text-zinc-500 mt-2">Please wait while we connect you.</p>
      </div>
    )
  }

  return null
}


export default JoinPage