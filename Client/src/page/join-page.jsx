import axiosInstance from '@/lib/axios-instance'
import { getErrorMessage } from '@/lib/get-error-message'
import React, { useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

const JoinPage = () => {
  const { roomId } = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    let cancelled = false

    async function joinRoom() {
      if (!roomId) return

      try {
        const response = await axiosInstance.post(`/rooms/${roomId}/join`)
        if (cancelled) return

        if (response.status === 200) {
          toast.success("Joined room successfully", {
            description: "Opening the room…",
          })
          setTimeout(() => navigate(`/room/${response.data.data.id}`), 1000)
        }
      } catch (err) {
        if (cancelled) return
        toast.error("Failed to join room", {
          description: getErrorMessage(err),
        })
        setTimeout(() => navigate("/editor"), 1000)
      }
    }

    joinRoom()
    return () => {
      cancelled = true
    }
  }, [roomId, navigate])

  // Spinner stays visible for the whole join + redirect, so the page never looks blank
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-on-surface">
      <Loader2 className="h-8 w-8 animate-spin text-primary-container mb-4" />
      <p className="text-lg font-medium tracking-tight font-headline">Joining collaboration room...</p>
      <p className="text-sm text-outline mt-2">Please wait while we connect you.</p>
    </div>
  )
}

export default JoinPage