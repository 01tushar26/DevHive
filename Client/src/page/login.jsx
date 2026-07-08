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


function Login() {

    const usernameRef = useRef()
    const passwordRef = useRef()
    const navigate = useNavigate()

    const handleLogin=async()=>{
     if(!usernameRef.current || usernameRef.current.value==""){
        toast.error("Email is required")
        return;
     }
     if(!passwordRef.current || passwordRef.current.value==""){
       toast.error("Password is required")
        return;
     }
     try{
      
      const response = await axiosInstance.post('/auth/login',
        {
            "email":usernameRef.current.value,
            "password":passwordRef.current.value
        })
       
        const accessToken  = response.data.data.accessToken;
        localStorage.setItem("accessToken",accessToken)
        toast.success("Login Successfully !!")
         setTimeout(() => navigate("/editor"), 1000)
        
         

     }
     catch(error){
       const message=error.response?.data?.error?.message || "Login Failed";
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

  <div className="absolute inset-0 flex justify-center items-center px-8 py-10">
  <Card className="w-full max-w-sm bg-black/60 backdrop-blur-sm  px-5 py-10">
    <CardHeader className="text-center pb-2">
      <CardTitle className="text-on-surface text-2xl font-bold font-headline"> Welcome Back to DevHive</CardTitle>
      <CardDescription className="text-primary-container uppercase tracking-widest text-xs">
        Log in to your hive and start collaborating
      </CardDescription>
    </CardHeader>

    <CardContent className="flex flex-col gap-4">
      {/* Email Field */}
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="username" className="text-on-surface uppercase text-xs tracking-wider">
          Email Address
        </Label>
        <div className="relative">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-container text-sm">@</span> */}
          <Input
            ref={usernameRef}
            id="username"
            type="text"
            
            className="bg-surface-container/80 border-outline-variant/30 text-on-surface placeholder:text-outline pl-4 py-4 focus-visible:ring-primary-container"
          />
        </div>
      </div>

      {/* Password Field */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between items-center">
          <Label htmlFor="password" className="text-on-surface uppercase text-xs tracking-wider">
            Password
          </Label>
          {/* <span className="text-primary-container text-xs cursor-pointer hover:text-primary-fixed-dim">
            Forgot Password?
          </span> */}
        </div>
        <div className="relative">
          {/* <span className="absolute left-3 top-1/2 -translate-y-1/2 text-primary-container text-sm">🔒</span> */}
          <Input
            ref={passwordRef}
            id="password"
            type="password"
           
            className="bg-surface-container/80 px-4 py-4  border-outline-variant/30 text-on-surface placeholder:text-outline  focus-visible:ring-primary-container"
          />
        </div>
      </div>
    </CardContent>

   
    <Button
        className="w-full bg-primary-container hover:bg-primary-fixed-dim text-on-primary-container"
        onClick={() => handleLogin()}
      >
        Log In
      </Button>
      <p className="text-outline text-xs text-center">
        Don't have an account?{' '}
       <Link to="/signup" className="text-primary-container cursor-pointer hover:text-primary-fixed-dim">
        Sign Up
      </Link>
      </p>
  </Card>
</div>
</div>
     

  )
}

export default Login