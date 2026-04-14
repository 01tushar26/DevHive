
import React from 'react'
import { useRef } from 'react'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

import { Link, useNavigate } from 'react-router-dom'
import axiosInstance from '@/lib/axios-instance'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import LetterGlitch from '@/components/ui/letterGlitch'


function SignUp() {

    const usernameRef = useRef()
    const passwordRef = useRef()
    const useremailRef = useRef()
    const navigate = useNavigate()

    const handleSignUp=async()=>{

       if(!useremailRef.current || useremailRef.current.value==""){
       toast.error("Email is required")
        return;
     }
     if(!usernameRef.current || usernameRef.current.value==""){
        toast.error("Name is required")
        return;
     }
     if(!passwordRef.current || passwordRef.current.value==""){
       toast.error("Password is required")
        return;
     }
    
     try{
      
      const response = await axiosInstance.post('/auth/signup',
        {
            "name":usernameRef.current.value,
            "email":useremailRef.current.value,
            "password":passwordRef.current.value
        })
       
        
        toast.success("Sign Up Successfully !!")
         setTimeout(() => navigate("/login"), 1000)
        
         

     }
     catch(error){
       const message=error.response?.data?.error?.message || "Server Down";
        toast.error(message + " !!")

     }


    }
  return (
    <div className="relative w-full h-screen">
  {/* Background */}
  <div className="absolute inset-0">
    <LetterGlitch
      glitchSpeed={50}
      centerVignette={true}
      outerVignette={false}
      smooth={true}
    />
  </div>

  <div className="absolute inset-0 flex justify-center items-center p-8">
  <Card className="w-full max-w-sm bg-black/60 backdrop-blur-sm  px-2">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-white text-2xl font-bold">Join DevHive</CardTitle>
      <CardDescription className="text-emerald-500 uppercase tracking-widest text-xs">
        Create your account and start building together
      </CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      {/* Email Field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" className="text-zinc-100 uppercase text-xs tracking-wider">
          Email Address
        </Label>
        <div className="relative">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">@</span> */}
          <Input
            ref={useremailRef}
            id="username"
            type="text"
            
            className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-600 pl-8 focus-visible:ring-emerald-600"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" className="text-zinc-100 uppercase text-xs tracking-wider">
          User Name
        </Label>
        <div className="relative">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">@</span> */}
          <Input
            ref={usernameRef}
            id="username"
            type="text"
            
            className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-600 pl-8 focus-visible:ring-emerald-600"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-zinc-100 uppercase text-xs tracking-wider">
            Password
          </Label>
          {/* <span className="text-emerald-500 text-xs cursor-pointer hover:text-emerald-400">
            Forgot Password?
          </span> */}
        </div>
        <div className="relative">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-500 text-sm">🔒</span> */}
          <Input
            ref={passwordRef}
            id="password"
            type="password"
           
            className="bg-zinc-900/80 border-zinc-700 text-white placeholder:text-zinc-600 pl-8 focus-visible:ring-emerald-600"
          />
        </div>
      </div>
    </CardContent>

    
    <Button
        className="w-full bg-emerald-600 hover:bg-emerald-700 text-black"
        onClick={() => handleSignUp()}
      >
        Sign Up
      </Button>
      <p className="text-zinc-600 text-xs text-center">
        Already have an account?{' '}
        <Link to="/login" className="text-emerald-600 cursor-pointer hover:text-emerald-700">
          Log In
      </Link>
      </p>
  </Card>
</div>
</div>
     

  )
}

export default SignUp