import React, { useRef, useState } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios-instance'
import { getErrorMessage } from '@/lib/get-error-message'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import LetterGlitch from '@/components/ui/letterGlitch'

function SignUp() {
  const usernameRef = useRef()
  const passwordRef = useRef()
  const useremailRef = useRef()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const handleSignUp = async () => {
    if (loading) return // guard against double submit

    if (!useremailRef.current || useremailRef.current.value === "") {
      toast.error("Email is required")
      return
    }
    if (!usernameRef.current || usernameRef.current.value === "") {
      toast.error("Name is required")
      return
    }
    if (!passwordRef.current || passwordRef.current.value === "") {
      toast.error("Password is required")
      return
    }

    try {
      setLoading(true)
      await axiosInstance.post('/auth/signup', {
        name: usernameRef.current.value,
        email: useremailRef.current.value,
        password: passwordRef.current.value,
      })

      toast.success("Account created", {
        description: "Redirecting you to login…",
      })
      // stay locked during redirect
      setTimeout(() => navigate("/login"), 1000)
    } catch (error) {
      toast.error("Sign up failed", {
        description: getErrorMessage(error, "Server is down. Please try again."),
      })
      setLoading(false)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSignUp()
  }

  return (
    <div className="relative w-full h-screen">
      <div className="absolute inset-0">
        <LetterGlitch glitchSpeed={50} centerVignette={true} outerVignette={false} smooth={true} />
      </div>

      <div className="absolute inset-0 flex justify-center items-center p-8">
        <Card className="w-full max-w-sm bg-black/60 backdrop-blur-sm px-2">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-on-surface text-2xl font-bold font-headline">Join DevHive</CardTitle>
            <CardDescription className="text-primary-container uppercase tracking-widest text-xs">
              Create your account and start building together
            </CardDescription>
          </CardHeader>

          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="email" className="text-on-surface uppercase text-xs tracking-wider">
                Email Address
              </Label>
              <Input
                ref={useremailRef}
                id="email"
                type="text"
                disabled={loading}
                onKeyDown={handleKeyDown}
                className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline pl-4 px-4 focus-visible:ring-primary-container"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="username" className="text-on-surface uppercase text-xs tracking-wider">
                User Name
              </Label>
              <Input
                ref={usernameRef}
                id="username"
                type="text"
                disabled={loading}
                onKeyDown={handleKeyDown}
                className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline px-4 py-4 focus-visible:ring-primary-container"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="password" className="text-on-surface uppercase text-xs tracking-wider">
                Password
              </Label>
              <Input
                ref={passwordRef}
                id="password"
                type="password"
                disabled={loading}
                onKeyDown={handleKeyDown}
                className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline px-4 py-4 focus-visible:ring-primary-container"
              />
            </div>
          </CardContent>

          <Button
            className="w-full gap-2 bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container"
            onClick={handleSignUp}
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Creating account…
              </>
            ) : (
              "Sign Up"
            )}
          </Button>
          <p className="text-outline text-xs text-center">
            Already have an account?{' '}
            <Link to="/login" className="text-primary-container cursor-pointer hover:text-primary-fixed-dim">
              Log In
            </Link>
          </p>
        </Card>
      </div>
    </div>
  )
}

export default SignUp